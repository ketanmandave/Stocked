import User from "../models/User.js";


// Update User CartData: /api/cart/update
export const updateCartData = async (req, res) => {
    try {
        // this user id send through the middleware (auth.js) and cartItems send through the body of the request
        const { userId, cartItems } = req.body;
        await User.findByIdAndUpdate(userId, { cartItems });
        res.status(200).json({ 
            success: true,
            message: "Cart updated successfully" });

    } catch (error) {
        console.error("Error updating cart data:", error);
        res.status(500).json({ success: false, message: "Failed to update cart data" });
    }
}
