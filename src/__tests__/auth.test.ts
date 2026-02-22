process.env.JWT_SECRET = 'test-secret-key';

import { signToken, verifyToken, getTokenFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

describe('auth utilities', () => {
  it('signs and verifies a token', () => {
    const payload = { email: 'admin@test.com', role: 'admin' };
    const token = signToken(payload);
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(payload);
  });

  it('returns null for invalid token', () => {
    const result = verifyToken('invalid-token');
    expect(result).toBeNull();
  });

  it('returns null for expired token', () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ email: 'test@test.com' }, 'test-secret-key', { expiresIn: -1 });
    const result = verifyToken(token);
    expect(result).toBeNull();
  });

  it('extracts token from Authorization header', () => {
    const req = new NextRequest('http://localhost/api/test', {
      headers: { Authorization: 'Bearer test-token-123' },
    });
    const token = getTokenFromRequest(req);
    expect(token).toBe('test-token-123');
  });

  it('extracts token from cookie', () => {
    const req = new NextRequest('http://localhost/api/test', {
      headers: { Cookie: 'admin-token=cookie-token-456' },
    });
    const token = getTokenFromRequest(req);
    expect(token).toBe('cookie-token-456');
  });

  it('returns null when no token present', () => {
    const req = new NextRequest('http://localhost/api/test');
    const token = getTokenFromRequest(req);
    expect(token).toBeNull();
  });
});
