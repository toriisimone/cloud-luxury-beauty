import prisma from '../config/database';

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          variants: true,
        },
      },
    },
  });
};

export const getCategoryByName = async (name: string) => {
  // Case-insensitive search
  return prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });
};

export const createCategory = async (data: any) => {
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');

  return prisma.category.create({
    data: {
      ...data,
      slug,
    },
  });
};

export const updateCategory = async (id: string, data: any) => {
  if (data.name && !data.slug) {
    data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};
