import prisma from "@/libs/prismadb";

export interface IProductParams {
  category?: string | null;
  searchTerm?: string | null;
}

export default async function getProducts(params: IProductParams) {
  try {
    const { category, searchTerm } = params;
    const searchString = searchTerm ?? "";

    // Build query conditions
    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (searchString) {
      // Search by product name or description containing searchString (case-insensitive)
      query.OR = [
        { name: { contains: searchString, mode: "insensitive" } },
        { description: { contains: searchString, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where: query,
    });

    return products;
  } catch (error: any) {
    console.error("Error getting products:", error);
    return [];
  }
}
