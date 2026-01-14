// Input validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateTodo = (data) => {
  const errors = {};

  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.title = 'Title is required and must be a string';
  }

  if (data.description && typeof data.description !== 'string') {
    errors.description = 'Description must be a string';
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.priority = 'Priority must be low, medium, or high';
  }

  if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
    errors.dueDate = 'Due date must be a valid date';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUserRegister = (data) => {
  const errors = {};

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.name = 'Name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validateTodo,
  validateUserRegister,
};
