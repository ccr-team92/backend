import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;

const DB_URI = process.env.DB_URI;
const client = new MongoClient(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db = null;

export async function db() {
  if (_db === null) {
    await client.connect();
    _db = client.db();
  }
  return _db;
}
