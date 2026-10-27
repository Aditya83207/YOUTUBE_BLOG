const User = require("../models/User");
const { verifyToken } = require("../services/tokenService");

exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const decoded = verifyToken(header.split(" ")[1]);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
