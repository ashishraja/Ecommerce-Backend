import { Product } from  "../Models/Product.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { catchAsyncErrors } from "../Middleware/catchAsyncErrors.js";
import { Order } from "../Models/Order.js";

export const newOrder = catchAsyncErrors(async (req,res,next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
        taxPrice,
        user
     } = req.body;  

     try {
        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            shippingPrice,
            totalPrice,
            taxPrice,
            paidAt: Date.now(),
            user: user,
        });

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
});


//get single order.
export const getSingleOrder = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }

    res.status(200).json({
        success:true,
        order
    });
});

//get the logged in user orders.
export const myOrders = catchAsyncErrors(async (req,res,next) => {
    const orders = await Order.find({user:req.user._id});
    
    res.status(200).json({
        success:true,
        orders
    });
});

//get all order details -- admin
export const getAllOrders = catchAsyncErrors(async (req,res,next) => {
    const orders = await Order.find();
    
    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    });
});

//update orderStatus -- admin
export const updateOrderStatus = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("You have already delivered this order", 400));
    }
  
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({validateBeforeSave:false});
}   


//delete order -- admin
export const deleteOrders = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id);
    
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }

    await order.deleteOne();

    res.status(200).json({
        success:true
    });
});