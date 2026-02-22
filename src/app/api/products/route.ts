import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  promoPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  imageUrl: z.string().url(),
  categoryId: z.string().uuid(),
  displayOrder: z.number().int().optional(),
  freeShipping: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');
  const adminMode = searchParams.get('admin') === 'true';

  const where: Record<string, unknown> = adminMode ? {} : { isActive: true };
  if (categoryId) Object.assign(where, { categoryId });

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { displayOrder: 'asc' },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
