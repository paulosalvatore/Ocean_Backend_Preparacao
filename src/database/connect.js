(async () => {

    const MongoClient = require('mongodb').MongoClient;

    console.info('Connecting to MongoDB database...');

    const client = await MongoClient.connect('mongodb://localhost:27017/',
        { useUnifiedTopology: true },
    );

    const db = client.db('ocean-preparacao');

    const collection = db.collection('example');

})();
