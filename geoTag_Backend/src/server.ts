import 'dotenv/config';
import app from "./app.js";
import { ConnectDb } from './config/mongo.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await ConnectDb();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

void startServer();
