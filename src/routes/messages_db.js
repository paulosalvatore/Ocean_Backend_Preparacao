import express from 'express';
import connect from '../database/connect.js';
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;

const router = express.Router();

(async () => {
    const db = await connect();

    const messages = await db.collection('messages');

    // READ ALL
    router.get('/', async (req, res) => {
        const find = await messages.find({}).toArray();

        res.send(find);
    });

    // CREATE
    router.post('/', async (req, res) => {
        const message = req.body;

        if (!message || !message.text) {
            return res.status(400).json({ message: `Message text is empty or wasn't found` });
        } else if (Object.values(messages).find(msg => msg.text === message.text)) {
            return res.status(409).json({ message: `Message is duplicated.` });
        }

        const result = await messages.insert(message);

        if (result.insertedCount === 1) {
            return res.status(202).json(result.ops[0]);
        } else {
            return res.status(400).send(`Message couldn't be added.`);
        }
    });

    // READ BY ID
    router.get('/:id', async (req, res) => {
        const id = req.params.id;

        const message = await messages.findOne({ _id: ObjectId(id) });

        if (!message) {
            return res.status(404).send({ message: `Message with id '${id}' wasn't found.` });
        }

        res.json(message);
    });

    // UPDATE
    router.put('/:id', async (req, res) => {
        const id = req.params.id;

        const newMessage = req.body;

        const message = await messages.findOne({ _id: ObjectId(id) });

        message.text = newMessage.text;

        const { result } = await messages.update({ _id: ObjectId(id) }, message);

        console.log();

        if (result.ok !== 1) {
            return res.status(404).send({ message: `Message with id '${id}' wasn't found.` });
        } else if (Object.values(messages).find(msg => msg.text === newMessage.text)) {
            return res.status(409).json({ message: `Message is duplicated.` });
        }

        res.send({ message: `Message with id '${id}' updated successfully.` });
    });

    // DELETE
    router.delete('/:id', async (req, res) => {
        const id = req.params.id;

        if (!messages[id]) {
            return res.status(404).send({ message: `Message with id '${id}' wasn't found.` });
        }

        delete messages[id];

        res.send({ message: `Message with id '${id}' deleted successfully.` });
    });
})();

export default router;
