const jwt = require('jsonwebtoken');

// In-memory user storage (untuk demo. Gunakan database real di production)
let users = [
  {
    id: 'user1',
    email: 'test@example.com',
    password: 'password123', // Hash this in production!
    name: 'Test User',
    createdAt: new Date().toISOString(),
  },
];

const register = (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        code: 'EMAIL_EXISTS',
      });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In production: hash password with bcrypt!
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      code: 'REGISTER_ERROR',
    });
  }
};

const login = (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      code: 'LOGIN_ERROR',
    });
  }
};

const getProfile = (req, res) => {
  try {
    const userId = req.user.id;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      code: 'GET_PROFILE_ERROR',
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
