/**
 * models/User.js — User Schema
 * ──────────────────────────────
 * Defines the shape of a User document in MongoDB.
 *
 * Fields:
 *  - name        : Display name
 *  - email       : Unique login email
 *  - password    : bcrypt-hashed password (NEVER stored plain)
 *  - createdAt   : Auto timestamp
 *
 * The pre-save hook hashes the password before every save.
 * comparePassword() is a helper used during login.
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    }
  },
  { timestamps: true }
);

// ── Pre-save: hash password ──────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if the password field was modified
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare plain vs hashed password ─
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);