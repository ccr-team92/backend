import { response } from '../utils';

export async function endpoint(event) {
  try {
    return response(200, { event });
  } catch (error) {
    return response({ error });
  }
};