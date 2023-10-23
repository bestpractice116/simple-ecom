import type { Item, Order } from "@prisma/client";

export type ItemDto = Item | null;
export type ItemsDto = Item[] | null;

export type OrderDto = Order | null;
export type OrderDetailDto = Order & { item: Item } | null;
export type OrdersDto = Order[] | null;