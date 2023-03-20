import combineRouters from "koa-combine-routers";

import apiRouter from './api'
import shRouter from './sh'

const router = combineRouters(apiRouter, shRouter)

export default router