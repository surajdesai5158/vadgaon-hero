
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcomeEmail } from '../config/email.js';

export const register = async (req, res) => {
  try {
    const { name, email, phone, age, password } = req.body;

    if (!name?.trim() || !email?.trim() || !phone || !age || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields.'
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({
        message: 'Please enter a valid email address.'
      });
    }

    if (!/^\d{10}$/.test(String(phone).trim())) {
      return res.status(400).json({
        message: 'Please enter a valid 10-digit mobile number.'
      });
    }

    if (!Number.isInteger(Number(age)) || Number(age) < 1 || Number(age) > 120) {
      return res.status(400).json({
        message: 'Age must be a whole number between 1 and 120.'
      });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      age: Number(age),
      password: hashedPassword,
      role: 'user',
      status: 'pending'
    });

    // Send welcome email without cancelling successful registration
    try {
      await sendWelcomeEmail(user);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    return res.status(201).json({
      message: 'Registration successful. Your account is awaiting admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    console.error('Registration error:', error);

    return res.status(500).json({
      message: 'Registration failed due to a server error.'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: 'Please enter your email and password.'
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({
        message:
          user.status === 'rejected'
            ? 'Your account has been rejected. Please contact the administrator.'
            : 'Your account is awaiting admin approval.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing from the environment.');

      return res.status(500).json({
        message: 'Login is temporarily unavailable.'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Login failed due to a server error.'
    });
  }
};
