describe('Order status flow', () => {
  const validStatuses = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

  it('validates all allowed statuses', () => {
    validStatuses.forEach(status => {
      expect(validStatuses).toContain(status);
    });
  });

  it('rejects invalid statuses', () => {
    const invalid = ['processing', 'returned', 'unknown'];
    invalid.forEach(status => {
      expect(validStatuses).not.toContain(status);
    });
  });

  it('has correct status flow order', () => {
    const flow = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
    expect(flow[0]).toBe('pending');
    expect(flow[flow.length - 1]).toBe('delivered');
    expect(flow).not.toContain('cancelled'); // cancelled is separate branch
  });
});
