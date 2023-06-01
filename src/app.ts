import express from "express";
import { Env } from "./config";
import loader from "./loaders/index";
import { logger } from "./utils";
console.clear();
const spinner = ["|", "/", "-", "\\"];
let i = 0;
const interval = setInterval(() => {
  process.stdout.write(`\r${spinner[i++ % spinner.length]} Initializing...`);
}, 100);
async function initialize() {
  const app = express();

  await loader(app);
  app.listen(Env.PORT, () => {
    clearInterval(interval);
    logger.info(`🚀 Server is running on port ${Env.PORT}`);
  });
}
initialize()
  .then(() => {
    console.log("Initialized");
  })
  .catch(() => {
    console.log("Error");
  });
