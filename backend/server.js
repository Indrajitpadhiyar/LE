import express from "express";
import cors from "cors";
import {connectDB} from "./db/db.js";
import {config} from "./config/config.js";


const app = express();
const PORT = config.PORT;

app.use(cors());
app.use(express.json());

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
