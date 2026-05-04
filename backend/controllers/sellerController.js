import jwt from 'jsonwebtoken';


// Login Seller:  /api/seller/login

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
            // generate token
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // set token in cookie
            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: true,
  sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            });
            return res.status(200).json({
                success: true,
                message: "Seller logged in successfully",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

    } catch (error) {
        console.log("Error logging in seller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// checkSellerAuth: /api/seller/is-auth

export const checkSellerAuth = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Seller is authenticated",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Logout Seller: /api/seller/logout

export const logoutSeller = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: true,
  sameSite: "None",
        });
        return res.status(200).json({
            success: true,
            message: "Seller logged out successfully",
        });
    } catch (error) {
        console.log("Error logging out seller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};