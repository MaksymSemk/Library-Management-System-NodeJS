import express from 'express';
import bookRoutes from './routes/book.routes.js';
import userRoutes from './routes/user.routes.js';
import loanRoutes from './routes/loan.routes.js';

const app = express();
app.use(express.json());

const PORT = 3000;

app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/loans', loanRoutes);

app.get('/', (req, res) => {
  res.send('Library API is running! 📚');
});

app.listen(PORT, () => {
  console.log(`Server is flying on http://localhost:${PORT}`);
});