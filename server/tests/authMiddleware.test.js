const jwt = require('jsonwebtoken');
const { protect, requireManager } = require('../src/middleware/auth');

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

  test('protect blocks requests missing Authorization Bearer header', () => {
    protect(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('protect attaches decoded user payload and calls next() for valid JWT', () => {
    const token = jwt.sign({ id: '123', role: 'Manager' }, process.env.JWT_SECRET);
    mockReq.headers.authorization = `Bearer ${token}`;

    protect(mockReq, mockRes, nextFunction);
    expect(mockReq.user.role).toBe('Manager');
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });
});