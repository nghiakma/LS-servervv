import http from "http";
import { app } from "./app";
require("dotenv").config();
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
   
});