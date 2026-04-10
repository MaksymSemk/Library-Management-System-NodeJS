import 'dotenv/config'; 
import express from 'express';
import path from 'path';
import bookRoutes from './routes/book.routes.js';
import userRoutes from './routes/user.routes.js';
import loanRoutes from './routes/loan.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = Number(process.env.PORT || 3000);

app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/loans', loanRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Library API is running! 📚');
});

app.listen(PORT, () => {
  console.log(`Server is flying on http://localhost:${PORT}`);
});