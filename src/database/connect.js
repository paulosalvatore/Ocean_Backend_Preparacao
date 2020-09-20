import mongodb from 'mongodb';

export default async () => {
    console.info('Connecting to MongoDB database...');

    const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/',
        { useUnifiedTopology: true },
    );

    console.log('MongoDB connected');

    return client.db('ocean-preparacao');
};
