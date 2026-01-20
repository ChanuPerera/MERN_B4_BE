const Order = require("../../models/order/order.model");
const Watch = require("../../models/watch/watch.model");
const Customer = require("../../models/user/customer.model");
// Place Order 
exports.placeOrder = async (req, res, next) => {
    try {
        const customerId = req.customer._id;
        const { watchId , quantity = 1} = req.body;
        if(!watchId){
            return res.status(400).json({
                success:false,
                message:"Watch ID is required to place an order"
            })
        }
        const watch = await Watch.findById(watchId);
        if(!watch){
             return res.status(400).json({
                success:false,
                message:"Watch not found"
            })
        }
        const customer = await Customer.findById(customerId);
        if(!customer){
             return res.status(400).json({
                success:false,
                message:"Customer not found"
            })
        }
        const totalAmount = watch.price * quantity;
        const order = await Order.create({
            customer: customerId,
            items:[
                {
                    product: watch._id,
                    name: `${watch.brand} ${watch.modelNumber}`,
                    price: watch.price,
                    quantity,
                }
            ],
            totalAmount,
            shippingAddress: customer.shippingAddress,
        });
        customer.orders.push(order._id);
        await customer.save();
        return res.status(201).json({
            success:true,
            message:"Order placed successfully",
            order,
        })
    } catch (error) {
        next(error)
    }
}












