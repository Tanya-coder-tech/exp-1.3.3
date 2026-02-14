const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock in-memory user store
const mockUsers = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (isDbConnected()) {
            // Real Database Logic
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                role: role || 'user'
            });

            await newUser.save();
            return res.status(201).json({ message: 'User registered successfully' });
        } else {
            // Mock Logic
            console.log('Using Mock Auth for Register');
            const existingUser = mockUsers.find(u => u.email === email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists (Mock)' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                _id: Date.now().toString(),
                username,
                email,
                password: hashedPassword,
                role: role || 'user'
            };
            mockUsers.push(newUser);
            return res.status(201).json({ message: 'User registered successfully (Mock Mode)' });
        }

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user;

        if (isDbConnected()) {
            // Real Database Logic
            user = await User.findOne({ email });
        } else {
            // Mock Logic
            console.log('Using Mock Auth for Login');
            user = mockUsers.find(u => u.email === email);
            
            // If no user found in mock store, check for a default admin/test user
            if (!user && (email === 'admin@test.com' || email === 'user@test.com')) {
                // Auto-create default users for convenience if they don't exist
                const defaultRole = email === 'admin@test.com' ? 'admin' : 'user';
                const hashedPassword = await bcrypt.hash('password123', 10);
                user = {
                    _id: Date.now().toString(),
                    username: defaultRole === 'admin' ? 'Admin User' : 'Test User',
                    email: email,
                    password: hashedPassword,
                    role: defaultRole
                };
                mockUsers.push(user);
            }
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

