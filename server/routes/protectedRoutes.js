const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Route accessible only to admin
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard!' });
});

// Route accessible to both user and admin
router.get('/dashboard', verifyToken, authorizeRoles('user', 'admin'), (req, res) => {
    res.json({ message: 'Welcome to the User Dashboard!' });
});

module.exports = router;
