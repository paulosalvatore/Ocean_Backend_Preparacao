import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();

const port = process.env.PORT || 3000;

const jsonParser = bodyParser.json();
app.use(jsonParser);

/*

// (async () => {

/!*
// Retrieve
const MongoClient = require('mongodb').MongoClient;

console.info('Connecting to MongoDB database...');

// Connect to the db
const client = await MongoClient.connect('mongodb://localhost:27017/',
    { useUnifiedTopology: true },
);

const db = client.db('ocean-preparacao');

const collection = db.collection('example');

const { insertedCount } = await collection.insertOne({
    a: 1
});

const result = await collection.countDocuments({});

console.log(result);
*!/

})();
*/

const messages = {};

// CREATE
app.post('/messages', (req, res) => {
    const message = req.body;
    console.log(req.body);

    if (!message || !message.text) {
        return res.status(400).json({ message: `Message text is empty or wasn't found` });
    } else if (Object.values(messages).find(msg => msg.text === message.text)) {
        return res.status(409).json({ message: `Message is duplicated.` });
    }

    const id = uuidv4();

    messages[id] = {
        id,
        text: message.text,
    };

    return res.status(202).json(messages[id]);
});

// READ ALL
app.get('/messages', (req, res) => {
    res.send(messages);
});

// READ BY ID
app.get('/messages/:id', (req, res) => {
    const id = req.params.id;

    if (!messages[id]) {
        return res.status(404).send({ message: `Message with id '${id}' wasn't found.` });
    }

    res.send(messages[id]);
});

// UPDATE
app.put('/messages/:id', (req, res) => {
    const id = req.params.id;

    const message = req.body;

    if (!messages[id]) {
        return res.status(404).send({ message: `Message with id '${id}' wasn't found.` });
    } else if (Object.values(messages).find(msg => msg.text === message.text)) {
        return res.status(409).json({ message: `Message is duplicated.` });
    }

    messages[id] = {
        id,
        text: message.text,
    };

    res.send({ message: `Message with id '${id}' updated successfully.` });
});

app.delete('/messages:id', (req, res) => {
    const id = req.params.id;

    if (!messages[id]) {
        return res.status(404).send({ message: `Message with id '${id}' wasn't found.` });
    }

    delete messages[id];

    res.send({ message: `Message with id '${id}' deleted successfully.` });
});

// DELETE

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
