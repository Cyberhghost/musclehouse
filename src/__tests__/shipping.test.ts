// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    settings: {
      findUnique: jest.fn(),
    },
    shippingFee: {
      findUnique: jest.fn(),
    },
  },
}));

import { calculateShipping } from '@/lib/shipping';
import { prisma } from '@/lib/prisma';

const mockPrisma = prisma as any;

describe('calculateShipping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 0 when freeShippingGlobal is true', async () => {
    mockPrisma.settings.findUnique.mockResolvedValue({ key: 'freeShippingGlobal', value: 'true' });
    const result = await calculateShipping('Alger', [{ price: 100, quantity: 1, freeShipping: false }]);
    expect(result).toBe(0);
  });

  it('returns 0 when all items have freeShipping', async () => {
    mockPrisma.settings.findUnique.mockResolvedValue({ key: 'freeShippingGlobal', value: 'false' });
    const result = await calculateShipping('Oran', [{ price: 100, quantity: 1, freeShipping: true }]);
    expect(result).toBe(0);
  });

  it('returns wilaya fee when no free shipping applies', async () => {
    mockPrisma.settings.findUnique.mockResolvedValue({ key: 'freeShippingGlobal', value: 'false' });
    mockPrisma.shippingFee.findUnique.mockResolvedValue({ wilaya: 'Alger', amount: '450' });
    const result = await calculateShipping('Alger', [{ price: 100, quantity: 1, freeShipping: false }]);
    expect(result).toBe(450);
  });

  it('returns default fee when wilaya not found', async () => {
    mockPrisma.settings.findUnique.mockResolvedValue({ key: 'freeShippingGlobal', value: 'false' });
    mockPrisma.shippingFee.findUnique.mockResolvedValue(null);
    const result = await calculateShipping('Unknown', [{ price: 100, quantity: 1, freeShipping: false }]);
    expect(result).toBe(550);
  });

  it('returns 0 when mixed items but all have freeShipping', async () => {
    mockPrisma.settings.findUnique.mockResolvedValue({ key: 'freeShippingGlobal', value: 'false' });
    const result = await calculateShipping('Blida', [
      { price: 100, quantity: 2, freeShipping: true },
      { price: 50, quantity: 1, freeShipping: true },
    ]);
    expect(result).toBe(0);
  });

  it('returns wilaya fee when some items have freeShipping but not all', async () => {
    mockPrisma.settings.findUnique.mockResolvedValue({ key: 'freeShippingGlobal', value: 'false' });
    mockPrisma.shippingFee.findUnique.mockResolvedValue({ wilaya: 'Oran', amount: '550' });
    const result = await calculateShipping('Oran', [
      { price: 100, quantity: 1, freeShipping: true },
      { price: 50, quantity: 1, freeShipping: false },
    ]);
    expect(result).toBe(550);
  });
});
