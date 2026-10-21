const axios = require('axios');

const convertToEUR = async (amount, fromCurrency) => {
  const currency = fromCurrency ? fromCurrency.toUpperCase().trim() : 'EUR';
  const numericAmount = Number(amount) || 0;

  // Return amount as is if already EUR or 0
  if (currency === 'EUR' || numericAmount === 0) {
    return numericAmount;
  }

  try {
    const response = await axios.get(
      `https://api.frankfurter.dev/v1/latest?amount=${numericAmount}&from=${currency}&to=EUR`
    );
    return response.data?.rates?.EUR || numericAmount;
  } catch (error) {
    console.warn(`[Currency Service] Conversion error for ${currency}: ${error.message}`);
    return numericAmount; // Fallback to avoid failing the work order request
  }
};

module.exports = { convertToEUR };