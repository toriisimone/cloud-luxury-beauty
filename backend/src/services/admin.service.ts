import prisma from '../config/database';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
  };
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
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

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};
