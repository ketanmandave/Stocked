import Address from "../models/address.js";


// Add user Address: /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address } = req.body;

        // ✅ FIXED
        const userId = req.user.id;
                                                                                                            
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const newAddress = new Address({
            ...address,
            userId
        });

        await newAddress.save();

        res.status(201).json({
            success: true,
            message: "Address added successfully"
        });

    } catch (error) {
        console.error("Add address error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




// Get user Addresses: /api/address/get
export const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await Address.find({ userId });
        res.status(200).json({ success: true, addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get addresses" });
    }
}