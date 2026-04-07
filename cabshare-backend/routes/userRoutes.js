const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/",    userController.createUser);
router.get("/",     userController.getAllUsers);
router.get("/me",   protect, userController.getMe);
router.put("/me",   protect, userController.updateUser);
router.put("/me/password", protect, userController.changePassword);
router.get("/:id",  userController.getUserById);

// Add this route
router.put("/me/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await require("../models/User").findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is wrong" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;