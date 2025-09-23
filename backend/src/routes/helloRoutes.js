import express from "express";

import { sayHello } from "../handlers/helloHandler.js";

const helloRouter = express.Router();

helloRouter.get("/hello", sayHello);

export default helloRouter;