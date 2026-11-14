const axios = require('axios');
const { convertToEUR } = require('../src/services/currencyService');

jest.mock('axios');

describe('Currency Normalization Service (Frankfurter FX)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns exact amount without API call when currency is already EUR', async () => {
    const result = await convertToEUR(150, 'EUR');
    expect(result).toBe(150);
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('converts foreign currency (USD) to EUR using Frankfurter API response', async () => {
    axios.get.mockResolvedValueOnce({
      data: { rates: { EUR: 92.5 } },
    });

    const result = await convertToEUR(100, 'USD');
    expect(result).toBe(92.5);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

});