import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies;

  console.log("cookies:", req.cookies);
  console.log("token:", token);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
    });
  }
// if token exists, then decode it to verify userId
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", tokenDecoded);

    if (!tokenDecoded.id) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
      });
    }

    // ✅ CORRECT PLACE to // if id exists then add into the request body for further use in controllers
    req.user = { id: tokenDecoded.id };

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
};

export default authUser;
