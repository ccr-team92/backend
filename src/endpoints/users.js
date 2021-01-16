import { db } from '../db';
import { response } from '../utils';

function toArray(cursor) {
  return new Promise(function(resolve, reject) {
    cursor.toArray(function(err, docs) {
      console.log(err, docs)
      if (err) {
        return reject(err)
      }
      return resolve(docs)
    })
  })
}

export async function list(event) {
  const conn = await db();
  return response(200, { users: await toArray(conn.collection('users').find({})), });
};
