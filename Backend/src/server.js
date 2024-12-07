import dotenv from "dotenv";
import http from "http";
import { app } from "./app.js";

dotenv.config({
  path: "./.env"
})

const PORT = process.env.PORT || 8001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
