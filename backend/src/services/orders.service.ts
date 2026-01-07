import prisma from '../config/database';
import { Prisma } from '@prisma/client';
import { calculateCouponDiscount } from './coupons.service';

export interface CreateOrderData {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  couponCode?: string;
}

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      coupon: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrderById = async (id: string, userId: string) => {
  return prisma.order.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      coupon: true,
    },
  });
};

export const createOrder = async (userId: string, data: CreateOrderData) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    let subtotal = 0;
    const orderItems = [];

    // Calculate subtotal and validate stock
    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      let price = product.price;
      let stock = product.stock;
      let variant = null;

      if (item.variantId) {
        variant = product.variants.find((v: { id: string }) => v.id === item.variantId);
        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found`);
        }
        price = variant.price || product.price;
        stock = variant.stock;
      }

      if (stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        price,
      });

      // Decrement stock
      if (item.variantId && variant) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    // Calculate discount
    let discount = 0;
    let couponId = null;

    if (data.couponCode) {
      try {
        const categoryId = data.items[0]?.productId
          ? (await tx.product.findUnique({ where: { id: data.items[0].productId } }))?.categoryId
          : undefined;

        discount = await calculateCouponDiscount(data.couponCode, subtotal, categoryId);

        const coupon = await tx.coupon.findUnique({
          where: { code: data.couponCode.toUpperCase() },
        });

        if (coupon) {
          couponId = coupon.id;
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      } catch (error: any) {
        throw new Error(`Coupon error: ${error.message}`);
      }
    }

    const shipping = subtotal >= 75 ? 0 : 10; // Free shipping over $75
    const total = subtotal - discount + shipping;

    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        subtotal,
        discount,
        shipping,
        total,
        couponId,
        status: 'PENDING',
        shippingStreet: data.shippingAddress.street,
        shippingCity: data.shippingAddress.city,
        shippingState: data.shippingAddress.state,
        shippingZipCode: data.shippingAddress.zipCode,
        shippingCountry: data.shippingAddress.country,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        coupon: true,
      },
    });

    return order;
  });
};

export const updateOrderStatus = async (id: string, status: string) => {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      coupon: true,
    },
  });
};
