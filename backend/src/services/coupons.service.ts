import prisma from '../config/database';

export const getActiveCoupons = async () => {
  const now = new Date();

  return prisma.coupon.findMany({
    where: {
      active: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCouponByCode = async (code: string) => {
  const now = new Date();

  const coupon = await prisma.coupon.findFirst({
    where: {
      code: code.toUpperCase(),
      active: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    include: {
      category: true,
    },
  });

  if (!coupon) {
    return null;
  }

  // Check usage limit manually
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return null;
  }

  return coupon;
};

export const calculateCouponDiscount = async (
  code: string,
  subtotal: number,
  categoryId?: string
): Promise<number> => {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    throw new Error('Invalid coupon code');
  }

  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    throw new Error(`Minimum purchase of $${coupon.minPurchase} required`);
  }

  if (coupon.categoryId && coupon.categoryId !== categoryId) {
    throw new Error('Coupon not valid for this category');
  }

  let discount = 0;

  if (coupon.type === 'PERCENTAGE') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else if (coupon.type === 'FIXED') {
    discount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === 'BOGO') {
    // BOGO: Buy One Get One - apply 50% discount
    discount = subtotal * 0.5;
  }

  return discount;
};

export const createCoupon = async (data: any) => {
  const code = data.code.toUpperCase();

  const existing = await prisma.coupon.findUnique({
    where: { code },
  });

  if (existing) {
    throw new Error('Coupon code already exists');
  }

  return prisma.coupon.create({
    data: {
      ...data,
      code,
    },
    include: {
      category: true,
    },
  });
};

export const updateCoupon = async (id: string, data: any) => {
  if (data.code) {
    data.code = data.code.toUpperCase();
  }

  return prisma.coupon.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

export const deleteCoupon = async (id: string) => {
  return prisma.coupon.delete({
    where: { id },
  });
};
