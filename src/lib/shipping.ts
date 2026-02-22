import { prisma } from './prisma';

export async function calculateShipping(
  wilaya: string,
  items: Array<{ price: number; quantity: number; freeShipping: boolean }>
): Promise<number> {
  // Priority 1: global free shipping
  const globalSetting = await prisma.settings.findUnique({
    where: { key: 'freeShippingGlobal' },
  });
  if (globalSetting?.value === 'true') return 0;

  // Priority 2: all items have free shipping
  const allFreeShipping = items.every((item) => item.freeShipping);
  if (allFreeShipping) return 0;

  // Priority 3: per-wilaya fee
  const fee = await prisma.shippingFee.findUnique({ where: { wilaya } });
  return fee ? Number(fee.amount) : 550;
}
