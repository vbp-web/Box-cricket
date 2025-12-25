import Razorpay from 'razorpay';
import { logger } from '../utils/logger.js';

// Use placeholder values if Razorpay credentials are not provided
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret_key';

const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
});

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    logger.warn('Razorpay credentials not configured. Payment functionality will not work. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file.');
} else {
    logger.info('Razorpay configured successfully');
}

export default razorpay;

