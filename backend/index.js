const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const authorsRouter = require('./controllers/authors');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// Error handler middleware
const errorHandler = (error, req, res, next) => {
    console.error("Error occurred:", error);

    if(error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: "Validation error: username must follow email format" });
    }

    next(error);
 }
 app.use(errorHandler);

const start = async () => {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
start();
