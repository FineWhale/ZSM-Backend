require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Todo List API Server                  ║
║  Port: ${PORT}                            ║
║  Environment: ${process.env.NODE_ENV}      ║
╚════════════════════════════════════════╝

📖 Documentation: http://localhost:${PORT}/api-docs
🏥 Health check:  http://localhost:${PORT}/health
  `);
});
