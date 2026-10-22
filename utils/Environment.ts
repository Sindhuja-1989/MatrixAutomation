import * as dotenv from 'dotenv';

dotenv.config();

export const Environment = {
  baseUrl: process.env.BASE_URL!,
  username: process.env.APP_USERNAME!,
  password: process.env.PASSWORD!
};