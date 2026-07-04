import 'dotenv/config';
import app from "./app.js";
import { ConnectDb } from './config/mongo.js';

const PORT = process.env.PORT || 3000;

ConnectDb()

app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`);
});