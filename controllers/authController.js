const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// RegisterUser
exports.register = async (req, res) => {
  console.log("incoming request:", req.body);
  const { fullName, email, password, profileImageUrl } = req.body;

  // Validation : check for missing fields

  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are required !" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const user = await User.create({
      email,
      password,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
    console.log(error);
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error login user", error: error.message });
    console.log(error);
  }
};

// // Get User Info
// exports.getUserInfo = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error regşstering user", error: error.message });
//     console.log(error);
//   }
// };

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
    console.log(error);
  }
};
