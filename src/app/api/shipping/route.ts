import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(_req: NextRequest) {
  const fees = await prisma.shippingFee.findMany({ orderBy: { wilayaId: 'asc' } });
  const settings = await prisma.settings.findUnique({ where: { key: 'freeShippingGlobal' } });
  return NextResponse.json({ fees, freeShippingGlobal: settings?.value === 'true' });
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { wilaya, amount, freeShippingGlobal } = await req.json();

  if (freeShippingGlobal !== undefined) {
    await prisma.settings.upsert({
      where: { key: 'freeShippingGlobal' },
      update: { value: String(freeShippingGlobal) },
      create: { key: 'freeShippingGlobal', value: String(freeShippingGlobal) },
    });
  }

  if (wilaya && amount !== undefined) {
    await prisma.shippingFee.update({ where: { wilaya }, data: { amount } });
  }

  return NextResponse.json({ success: true });
}
