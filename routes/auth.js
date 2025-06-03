const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ✅ Correct relative path
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET);
};

// Signup Route
router.post('/signup', async (req, res) => {
  const { fullName, emailOrPhone, password, confirmPassword } = req.body;
  if (!fullName || !emailOrPhone || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ emailOrPhone });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ fullName, emailOrPhone, passwordHash });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Login Route
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ emailOrPhone });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      emailOrPhone: user.emailOrPhone,
    },
  });
});

// Password Reset Route
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const user = await User.findOne({ emailOrPhone: email }); // Query with 'emailOrPhone' field in DB
  if (!user) return res.status(404).json({ message: 'User not found' });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = passwordHash;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});

//StudentManagement

// Add new student
router.post('/api/students/add', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get students (optional filters)
// Example using Mongoose
router.get('/api/students', async (req, res) => {
  const { course, department, year, section } = req.query;
  const filter = {
    course,
    department,
    year,
    section
  };
  try {
    const students = await Student.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});


module.exports = router;

