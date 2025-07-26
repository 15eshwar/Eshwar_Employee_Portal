const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); // Logging middleware
const authRoutes = require('./routes/auth'); // Route path
const profileRoutes = require ('./routes/Profile')
const leavedataRoutes = require ('./routes/leaveData')
const psdRoutes = require ('./routes/psd')
const payslipRoutes = require ('./routes/payslip')
const sendPayslipEmailRoute = require('./routes/payslipMail');

const app = express();
const PORT = 3000;

//  Middleware 
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests to console

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/Profile',profileRoutes);
app.use('/api/leaveData',leavedataRoutes);
app.use('/api/psd',psdRoutes);
app.use('/api/payslip',payslipRoutes);
app.use('/api/payslipMail', sendPayslipEmailRoute);

// Root Health Check 
app.get('/', (req, res) => {
  res.send(' Server is up and running!');
});

// Start Server 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


