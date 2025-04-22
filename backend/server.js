// server.js - Backend for registration form
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ message: 'Database connection successful!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Failed to connect to database', error: error.message });
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Check if user already exists
    const connection = await pool.getConnection();
    const [existingUsers] = await connection.execute(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword)
    
    // Insert new user
    const [result] = await connection.execute(
      'INSERT INTO students (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    );
    
    connection.release();
    
    res.status(201).json({
      message: 'Registration successful',
      userId: result.insertId
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});


// Updated login endpoint with better debugging and error handling
app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log(`Login attempt for email: ${email}`);
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Get user from database
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT * FROM students WHERE email = ?',
        [email]
      );
      
      connection.release();
      
      if (users.length === 0) {
        console.log(`No user found with email: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const user = users[0];
      console.log(`User found: ${user.name}, comparing passwords`);
      console.log(password,user.password)
      
      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        console.log('Password does not match');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      console.log('Login successful');
      
      // Create user object without password
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      };
      
      res.json({
        message: 'Login successful',
        user: userResponse
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });


  app.post('/api/pending', async (req, res) => {
    try {
      const { name,email, transid,courseName,amt} = req.body;
      
      console.log(`Pending attempt for email: ${email}`);
      
      // Validate input
      
      // Get user from database
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO pending (name, email, transactionid, courseName, amount) VALUES (?, ?, ?, ?, ?)',
        [name, email, transid,courseName,amt]
      );
      connection.release();

      
      console.log('User is under review');
      
      // Create user object without password
      res.json({
        message: 'User in pending',
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });


  app.post('/api/pending-check', async (req, res) => {
    try {
      const { email } = req.body;
      
      console.log(`Pending check attempt for email: ${email}`);
      
      // Validate input
      
      // Get user from database
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT * FROM pending WHERE email = ?',
        [email]
      );
      connection.release();

      
      console.log('User is under review');
      // Create user object without password
      if(users[0]){
        if(users[0].status==0){
          res.json({
            message: 'User in pending',
            value:0
          });
        }else{
          res.json({
            message: 'User in pending',
            value:1
          });
        }
      }else{
        res.json({
          message: 'User in pending',
          value:-1
        });
      }
      
      
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });


  app.get('/api/admin-check', async (req, res) => {
    try {
      
      
      // Validate input
      
      // Get user from database
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT * FROM pending'
      );
      connection.release();

      
      console.log('User is under review');
      // Create user object without password
      if(users[0]){
        res.json({
          data:users,
        });
      }
      
      
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });


  app.post('/api/admin-approve', async (req, res) => {
    try {
      const { value,email } = req.body;
      
      console.log(`Pending check attempt for email: ${value}`);
      
      // Validate input
      
      // Get user from database
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'UPDATE pending SET status = ? WHERE email = ?',
        [1, email]
      );
      connection.release();
      
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});