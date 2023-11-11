import { Injectable } from "@nestjs/common";
import { PrismaService } from "../helper/prisma.service";
import { ItemDto, ItemsDto } from "../types/data.dto";
import { ErrorDto } from "../types/error.dto";

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, description: string, image: string, price: number): Promise<[ItemDto, ErrorDto]> {
    try {
      const item = await this.prisma.item.create({
        data: {
          name: name,
          description: description,
          image: image,
          price: parseFloat(price.toString())
        }
      });

      return [item, null];
    } catch (error) {
      console.log(error);
      return [null, { message: "Internal Server Error", status: 500 }];
    }
  }

  async get(id: string): Promise<[ItemDto, ErrorDto]> {
    try {
      const item = await this.prisma.item.findUnique({
        where: {
          id
        }
      });

      if (!item) {
        return [null, { message: "Item not found", status: 404 }];
      }

      return [item, null];
    } catch (error) {
      return [null, { message: "Internal Server Error", status: 500 }];
    }
  }

  async getAll(): Promise<[ItemsDto, ErrorDto]> {
    try {
      const items = await this.prisma.item.findMany({
        orderBy: [
          {
            orders: {
              _count: "desc"
            }
          },
          {
            createdAt: "desc"
          }
        ]
      });

      return [items, null];
    } catch (error) {
      return [null, { message: "Internal Server Error", status: 500 }];
    }
  }

  async delete(id: string): Promise<ErrorDto> {
    try {
      await this.prisma.item.delete({
        where: {
          id
        }
      });

      return null;
    } catch (error) {
      return { message: "Internal Server Error", status: 500 };
    }
  }
}