import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
        return res.status(401).json({
            message: "Unauthorized: No token provided",
        });
    }

    try {
        const tokenDecoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if (tokenDecoded.email === process.env.SELLER_EMAIL) {
            next();
        }else{
            res.status(401).json({
                message: "Unauthorized: Invalid token",
            });
        }
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({
            message: "Unauthorized: Invalid token",
        });
    }
};

export default authSeller;