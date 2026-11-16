const jwt = require('jsonwebtoken');
const authModule = require('../src/middleware/auth');

const { requireManager } = authModule;
const authMiddleware =
  typeof authModule === 'function'
    ? authModule
    : Object.entries(authModule).find(
        ([key, val]) => key !== 'requireManager' && typeof val === 'function'
      )?.[1];

process.env.JWT_SECRET = 'test_secret_key';

describe('Authentication & RBAC Middleware', () => {
  let mockReq, mockRes, nextFunction;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  test('auth middleware blocks requests missing Authorization Bearer header', async () => {
    await authMiddleware(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('auth middleware attaches decoded user payload and calls next() for valid JWT', async () => {
    const token = jwt.sign({ id: '123', role: 'Manager' }, process.env.JWT_SECRET);
    mockReq.headers.authorization = `Bearer ${token}`;

    await authMiddleware(mockReq, mockRes, nextFunction);
    expect(mockReq.user.role).toBe('Manager');
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  test('requireManager rejects Technician role with 403 Forbidden', () => {
    mockReq.user = { id: '456', role: 'Technician' };

    requireManager(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('requireManager allows Manager role to proceed', () => {
    mockReq.user = { id: '123', role: 'Manager' };

    requireManager(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });
});