const { Requester, Validator } = require('@chainlink/external-adapter-framework');
const fetch = require('node-fetch');

const customParams = {
  savingsId: ['savingsId'],
  amount: ['amount'],
  userAddress: ['userAddress']
};

const execute = async (input, callback) => {
  // Validate input
  const validator = new Validator(callback, input, customParams);
  if (validator.error) throw validator.error;

  // Extract input data
  const { id: jobRunID, data } = input;
  const { savingsId, amount, userAddress } = data;

  // Get API endpoint and key from environment variables
  const apiEndpoint = process.env.LOANDISK_API_ENDPOINT;
  const apiKey = process.env.LOANDISK_API_KEY;

  try {
    // Fetch balance from LoanDisk API
    const balanceResponse = await fetch(`${apiEndpoint}/transactions/${savingsId}/balance`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    const balanceData = await balanceResponse.json();

    // Check if the balance is enough and initiate withdrawal
    if (balanceData.balance >= amount) {
      const withdrawalResponse = await fetch(`${apiEndpoint}/transactions/${savingsId}/withdrawals`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userAddress })
      });

      const withdrawalData = await withdrawalResponse.json();

      if (withdrawalData.status === 'success') {
        const result = balanceData.balance - amount;
        return Requester.success(jobRunID, { data: { result } });
      } else {
        throw new Error(`Withdrawal failed: ${withdrawalData.message}`);
      }
    } else {
      throw new Error("Insufficient balance");
    }
  } catch (error) {
    return Requester.errored(jobRunID, error);
  }
};

module.exports.execute = execute;
