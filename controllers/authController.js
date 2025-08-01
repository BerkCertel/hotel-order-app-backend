const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// // RegisterUser
// exports.register = async (req, res) => {
//   console.log("incoming request:", req.body);
//   const { email, password } = req.body;

//   // Validation : check for missing fields

//   if (!email || !password) {
//     return res.status(400).json({ message: "All Fields are required !" });
//   }

//   try {
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use." });
//     }

//     const user = await User.create({
//       email,
//       password,
//     });

//     res.status(201).json({
//       id: user._id,
//       user,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error registering user", error: error.message });
//     console.log(error);
//   }
// };

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

// Get User Info
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error regşstering user", error: error.message });
    console.log(error);
  }
};

// Tüm kullanıcıları getir (yalnızca admin/superadmin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcılar alınamadı", error: error.message });
  }
};

// Add User
exports.addUser = async (req, res) => {
  const { email, password, role = "USER" } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email ve şifre zorunlu." });
  }

  // Sadece ADMIN veya USER eklenebilir!
  const allowedRoles = ["USER", "ADMIN"];
  if (!allowedRoles.includes(role)) {
    return res
      .status(400)
      .json({ message: "Sadece USER veya ADMIN eklenebilir!" });
  }

  // Eğer dışarıdan "SUPERADMIN" gelirse, yok say!
  if (role === "SUPERADMIN") {
    return res.status(403).json({ message: "SUPERADMIN dışarıdan atanamaz!" });
  }

  if (password.length < 6 || password.length > 20) {
    return res
      .status(400)
      .json({ message: "Şifre 6-20 karakter arasında olmalıdır." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email zaten kullanılıyor." });
    }
    const user = await User.create({
      email,
      password,
      role,
    });

    res
      .status(201)
      .json({ id: user._id, user, token: generateToken(user._id) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı eklenemedi", error: error.message });
  }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;
  if (!userId || !newRole) {
    return res.status(400).json({ message: "Kullanıcı ve yeni rol zorunlu." });
  }
  const allowedRoles = ["USER", "ADMIN"];
  if (!allowedRoles.includes(newRole)) {
    return res
      .status(400)
      .json({ message: "Sadece USER veya ADMIN seçilebilir!" });
  }
  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    // Yeni rol SUPERADMIN olamaz
    if (newRole === "SUPERADMIN") {
      return res
        .status(403)
        .json({ message: "Kullanıcı SUPERADMIN atanamaz!" });
    }

    // SUPERADMIN'in rolü değiştirilemez
    if (user.role === "SUPERADMIN") {
      return res
        .status(403)
        .json({ message: "SUPERADMIN'in rolü değiştirilemez!" });
    }

    user.role = newRole;
    await user.save();
    res.status(200).json({ message: "Rol güncellendi.", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Rol güncellenemedi.", error: error.message });
  }
};

// Kullanıcı sil (yalnızca SUPERADMIN)
// SUPERADMIN silinemez!
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  console.log(req.user);

  if (!id) {
    return res.status(400).json({ message: "Kullanıcı ID zorunlu." });
  }
  if (id === req.user.id) {
    return res.status(403).json({ message: "Kendi hesabınızı silemezsiniz." });
  }
  try {
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    if (user.role === "SUPERADMIN") {
      return res.status(403).json({ message: "SUPERADMIN silinemez!" });
    }
    await User.deleteOne({ _id: id });
    res.status(200).json({ message: "Kullanıcı silindi." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı silinemedi.", error: error.message });
  }
};
