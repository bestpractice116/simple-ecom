import type { Stripe as StripeType } from "stripe";
import { Stripe } from "stripe";
import { HttpException, Injectable } from "@nestjs/common";
import { ItemRepository } from "../../db/item.repository";
import { OrderRepository } from "../../db/order.repository";
import { MailService } from "../../helper/mail.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StripeService {
  private stripe: StripeType;

  constructor(private readonly item: ItemRepository, private readonly order: OrderRepository, private readonly mail: MailService, private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY"), {
      apiVersion: "2023-10-16",
      typescript: true
    });
  }

  async createCheckoutSession(itemId: string) {
    const [item, itemError] = await this.item.get(itemId);

    if (itemError) {
      throw new HttpException(itemError.message, itemError.status);
    }

    const [order, orderError] = await this.order.create(item.id);

    if (orderError) {
      throw new HttpException(orderError.message, orderError.status);
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price_data: {
            currency: "gpb",
            product_data: {
              name: item.name,
              description: item.description,
              images: [item.image]
            },
            unit_amount: item.price * 100
          },
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10
          }
        }
      ],
      metadata: {
        order: order.id
      },
      payment_intent_data: {
        metadata: {
          order: order.id
        }
      },
      success_url: `${this.configService.get("STRIPE_SUCCESS_URL")}`,
      cancel_url: `${this.configService.get("STRIPE_CANCEL_URL")}`
    });

    return session.url;
  }

  verifyStripeWebhookSignature(body: any, signature: string): [any | null, null | string] {
    try {


      const event = this.stripe.webhooks.constructEvent(body, signature, this.configService.get("STRIPE_WEBHOOK_SECRET"));

      return [event, null];
    } catch (error) {
      return [null, "Error verifying stripe webhook signature"];
    }
  }

  async handleCheckoutSessionCompleted(sessionId: string) {
    const session = await this.retrieveSession(sessionId);

    const metadata = session.metadata as { order: string };
    const customer = session.customer_details as { email: string, name: string };
    const totalAmount = session.amount_total / 100;

    await this.order.update(metadata.order, customer.email, session.line_items.data[0].quantity, totalAmount);

    return;
  }

  async handlePaymentIntentSucceeded(orderId: string, recipient: string) {
    const [order, dbError] = await this.order.updateStatus(orderId, "PAID");

    if (dbError) {
      throw new HttpException(dbError.message, dbError.status);
    }

    if (order.email) {
      recipient = order.email;
    }

    //await this.mail.sendOrderConfirmation(recipient, order.id, order.item.name, order.quantity, order.total);
    return;
  }

  private async retrieveSession(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });

    } catch {
      throw new HttpException("Invalid session", 400);
    }
  }
}


