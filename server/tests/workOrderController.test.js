const WorkOrder = require('../src/models/WorkOrder');
const Vehicle = require('../src/models/Vehicle');

jest.mock('../src/models/WorkOrder');
jest.mock('../src/models/Vehicle');
jest.mock('../src/services/currencyService');

describe('WorkOrder Controller Business Logic & Vehicle Status Sync', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('converts foreign currency cost to EUR and sets vehicle status to Under Maintenance', async () => {
    mockReq = {
      body: {
        vehicle: 'veh123',
        title: 'Brake Pad Replacement',
        description: 'Front axle pads worn below limit',
        cost: 200,
        currency: 'GBP',
      },
    };

  });
});