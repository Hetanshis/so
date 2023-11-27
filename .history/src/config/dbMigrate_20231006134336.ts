const { MongoClient } = require('mongodb');

async function runMigration() {
  const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
  
  try {
    await client.connect();
    const database = client.db('social-api');
    const collection = database.collection('social-api');

    // Perform your migration logic here, e.g., add a new field
    await collection.updateMany({}, { $set: { newField: 'default value' } });

    console.log('Migration completed successfully.');
  } finally {
    await client.close();
  }
}

runMigration();
