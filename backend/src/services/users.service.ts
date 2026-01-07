import prisma from '../config/database';

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      addresses: true,
    },
  });
};

export const updateUser = async (id: string, data: any) => {
  const { password, ...updateData } = data;

  if (password) {
    const { hashPassword } = require('../utils/hashPassword');
    updateData.password = await hashPassword(password);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getWishlist = async (userId: string) => {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
          variants: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const addToWishlist = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    create: {
      userId,
      productId,
    },
    update: {},
    include: {
      product: {
        include: {
          category: true,
          variants: true,
        },
      },
    },
  });
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  return prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};
