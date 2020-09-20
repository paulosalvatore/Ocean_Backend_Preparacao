import { v4 as uuidv4 } from 'uuid';

import { Router } from 'express';

const router = Router();

const messages = {};

// CREATE
router.post('/messages', (req, res) => {
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
router.get('/messages', (req, res) => {
    res.send(messages);
});

// READ BY ID
router.get('/messages/:id', (req, res) => {
    const id = req.params.id;

    if (!messages[id]) {
        return res.status(404).send({ message: `Message with id '${id}' wasn't found.` });
    }

    res.send(messages[id]);
});

// UPDATE
router.put('/messages/:id', (req, res) => {
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

// DELETE
router.delete('/messages:id', (req, res) => {
    const id = req.params.id;

    if (!messages[id]) {
        return res.status(404).send({ message: `Message with id '${id}' wasn't found.` });
    }

    delete messages[id];

    res.send({ message: `Message with id '${id}' deleted successfully.` });
});

export default router;
