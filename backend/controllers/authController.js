const User = require("../models/User");
const { generateToken } = require("../services/tokenService");

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email is already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json(userResponse(user));
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json(userResponse(user));
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ id: _id, name, email });
};
