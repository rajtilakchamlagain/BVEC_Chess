const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay (Replace with actual Test Keys from Razorpay Dashboard)
const razorpay = new Razorpay({
    key_id: 'rzp_live_TeQk38h6zZnFHW',
    key_secret: '5DWACwCJvx9Su3sSzxSOlQaK'
});

exports.createOrder = functions.https.onCall(async (data, context) => {
    const { amount, currency = 'INR', receipt } = data;
    
    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in paise
            currency,
            receipt
        });
        return { orderId: order.id, amount: order.amount };
    } catch (error) {
        console.error("Razorpay Error:", error);
        throw new functions.https.HttpsError('internal', 'Unable to create order');
    }
});

exports.verifyPayment = functions.https.onRequest(async (req, res) => {
    // Webhook endpoint for Razorpay successful payments
    const secret = 'your_webhook_secret';
    
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    
    const expectedSignature = crypto.createHmac('sha256', secret)
        .update(body)
        .digest('hex');
        
    if (expectedSignature === signature) {
        // Payment verified! Add the player to Firestore here
        console.log("Payment Verified for order:", req.body.payload.payment.entity.order_id);
        res.status(200).json({ status: 'ok' });
    } else {
        res.status(400).json({ status: 'invalid signature' });
    }
});
