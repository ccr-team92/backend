import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

const DB_URI = process.env.DB_URI;
const client = new MongoClient(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function db() {
  await client.connect();
  const db = client.db('ccr-team92');
  return db;
}