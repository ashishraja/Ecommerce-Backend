import { catchAsyncErrors } from "../Middleware/catchAsyncErrors.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Payment } from "../Models/Payment.js";

export const processPayment = catchAsyncErrors(async (req, res, next) => {

  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: (parseInt(req.body.totalPrice) * 100) ,
    currency: "INR",
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
});

export const paymentVerification = catchAsyncErrors(async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_signature, razorpay_order_id } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(500).json({ success: false, message: "Invalid Signature!" });
    } else {
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      res.redirect(`${process.env.FRONTEND_URL}/success?reference=${razorpay_payment_id}`);
    }
    
  } catch (error) {
    console.error('Error in payment verification:', error);
    next(error);
  }
});
