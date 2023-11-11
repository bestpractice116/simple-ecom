import { Controller, Get, Headers, Param, Post, RawBodyRequest, Request, Response } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Controller("stripe")
export class StripeController {
  constructor(private readonly stripe: StripeService) {}

  @Get("checkout-session/:id")
  async createCheckoutSession(@Param("id") id: string, @Response() res: any) {
    res.redirect(303, (await this.stripe.createCheckoutSession(id)));
  }

  @Post("webhook")
  async stripeWebhook(@Request() res: RawBodyRequest<any>, @Headers() headers) {
    const signature = headers["stripe-signature"];

    const event = this.stripe.verifyStripeWebhookSignature(res.rawBody, signature);

    switch (event.type) {
      case "checkout.session.completed":
        console.log("enter checkout.session.completed");
        await this.stripe.handleCheckoutSessionCompleted(event.data.object.id);
        break;
      case "payment_intent.succeeded":
        console.log("enter payment_intent.succeeded");
        const metadata = event.data.object.metadata as { order: string };
        const recipient = event.data.object.receipt_email;
        console.log(recipient);
        const total = event.data.object.amount_received / 100;

        await this.stripe.handlePaymentIntentSucceeded(metadata.order, recipient, total);

        break;
      default:
        break;
    }

    return;
  }

}
