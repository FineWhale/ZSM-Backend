// In-memory storage (untuk demo. Gunakan database real di production)
let todos = [
  {
    id: '1',
    title: 'Belajar Express.js',
    description: 'Mempelajari Express.js dan REST API',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user1',
  },
];

const getAllTodos = (req, res) => {
  try {
    const userId = req.user.id;
    const userTodos = todos.filter((todo) => todo.userId === userId);

    res.status(200).json({
      success: true,
      data: userTodos,
      total: userTodos.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get todos',
      code: 'GET_TODOS_ERROR',
    });
  }
};

const getTodoById = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const todo = todos.find((t) => t.id === id && t.userId === userId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
        code: 'TODO_NOT_FOUND',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get todo',
      code: 'GET_TODO_ERROR',
    });
  }
};

const createTodo = (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const userId = req.user.id;

    const newTodo = {
      id: Date.now().toString(),
      title,
      description: description || '',
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    todos.push(newTodo);

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      code: 'CREATE_TODO_ERROR',
    });
  }
};

const updateTodo = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate } = req.body;
    const userId = req.user.id;

    const todoIndex = todos.findIndex((t) => t.id === id && t.userId === userId);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
        code: 'TODO_NOT_FOUND',
      });
    }

    // Update only provided fields
    if (title !== undefined) todos[todoIndex].title = title;
    if (description !== undefined) todos[todoIndex].description = description;
    if (completed !== undefined) todos[todoIndex].completed = completed;
    if (priority !== undefined) todos[todoIndex].priority = priority;
    if (dueDate !== undefined) todos[todoIndex].dueDate = dueDate;

    todos[todoIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todos[todoIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      code: 'UPDATE_TODO_ERROR',
    });
  }
};

const deleteTodo = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const todoIndex = todos.findIndex((t) => t.id === id && t.userId === userId);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
        code: 'TODO_NOT_FOUND',
      });
    }

    const deletedTodo = todos.splice(todoIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: deletedTodo[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      code: 'DELETE_TODO_ERROR',
    });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
