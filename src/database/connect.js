import mongodb from 'mongodb';

export default async () => {
    console.info('Connecting to MongoDB database...');

    const urlLocal = 'mongodb://localhost:27017/';
    const urlCloud = 'mongodb+srv://admin:Uu8ftSpPxbyJiNk@ocean-preparacao-backen.0oe98.mongodb.net/ocean-preparacao?retryWrites=true&w=majority';

    const client = await mongodb.MongoClient.connect(urlCloud,
        { useUnifiedTopology: true },
    );

    console.info('MongoDB connected');

    return client.db('ocean-preparacao');
};
