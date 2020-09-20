import express from 'express';
const app = express();

import { v4 as uuidv4 } from 'uuid';

// (async () => {

/*
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
*/

const messages = [];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/messages', (req, res) => {
    const message = req.body;

    if (!message.text) {
        return res.status(400).json({ message: `Message text is empty or wasn't found` });
    } else if (messages.find(msg => msg.text === message.text)) {
        return res.status(409).json({ message: `Message is duplicated.` });
    }

    const id = uuidv4();

    messages[id] = {
        text: message.text,
    };

    return res.status(202).json({ message: 'Message added successfully.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));

// })();
