import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.use('/messages', routes.messages);

const port = process.env.PORT || 3000;

const jsonParser = bodyParser.json();
app.use(jsonParser);

// Error handling

app.use((req, res, next) => {
    const error = new Error(`Endpoint wasn't found`);
    error.status = 404;
    next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

app.listen(port, () => console.log(`App listening on port: ${port}`));
