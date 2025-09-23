import express from 'express';
import { testConnection } from './config/db.js';
import helloRouter from './routes/helloRoutes.js';

const app = express();

const port = 3000;

app.use("/", helloRouter)

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
    testConnection();
});