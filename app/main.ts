import Koa from "koa";
import { koaBody } from 'koa-body'
import pino from "pino";

import router from "./routes";

const PORT = 8088;
const app = new Koa();
const logger = pino();

app.use(koaBody())

app.use(router());

app.listen(PORT);

logger.info(`app running on port ${PORT}`);

// // 未捕获的Api异常
app.on("request-error", (...args) => {
  logger.error("RequestError", ...args);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("UncaughtException", error);
});

process.on("unhandledRejection", (reason: any, promise: any) => {
  logger.info(reason, promise);
});

process.on("SIGTERM", async () => {
  logger.info("Starting graceful shutdown");
  process.exit();
});
