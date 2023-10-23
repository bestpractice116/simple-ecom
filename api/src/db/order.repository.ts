import { Injectable } from "@nestjs/common";
import { PrismaService } from "../helper/prisma.service";
import { OrderDetailDto, OrderDto, OrdersDto } from "../types/data.dto";
import { ErrorDto } from "../types/error.dto";

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(item: string): Promise<[OrderDto, ErrorDto]> {
    try {
      const order = await this.prisma.order.create({
        data: {
          item: {
            connect: {
              id: item
            }
          }
        }
      });

      return [order, null];
    } catch (error) {
      return [null, { message: "Internal Server Error", status: 500 }];
    }
  }

  async get(id: string): Promise<[OrderDetailDto, ErrorDto]> {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id
        },
        include: {
          item: true
        }
      });

      if (!order) {
        return [null, { message: "Order not found", status: 404 }];
      }

      return [order, null];
    } catch (error) {
      return [null, { message: "Internal Server Error", status: 500 }];
    }
  }

  async getAll(): Promise<[OrdersDto, ErrorDto]> {
    try {
      const orders = await this.prisma.order.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });

      return [orders, null];
    } catch (error) {
      return [null, { message: "Internal Server Error", status: 500 }];
    }
  }
}