const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  emailOrPhone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);

//Studentmanagement 
const studentSchema = new mongoose.Schema({
  name: String,
  roll: String,
  attendance: String,
  status: String,
  contact: String,
  course: String,
  department: String,
  year: String,
  section: String,
});

const Student = mongoose.model('Student', studentSchema);