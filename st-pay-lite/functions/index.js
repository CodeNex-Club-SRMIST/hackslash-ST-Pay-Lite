const functions = require('firebase-functions');
const axios = require('axios');

exports.createOrder = functions.https.onRequest(async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      },
      {
        auth: {
          username: 'rzp_test_2lSmESlERyUiN9',
          password: 'naFIDe3Q2cNo9iAXvxcNlYmY',
        },
      }
    );

    res.json({
      orderId: response.data.id,
      amount: response.data.amount,
      currency: response.data.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});