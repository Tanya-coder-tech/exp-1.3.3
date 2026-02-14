const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Database Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log('MongoDB Connection Error:', err));
} else {
    console.log('MONGO_URI not found in environment variables. Database features will not work.');
}

// Serve static files from client build
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Client application not found. Please run build.');
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

