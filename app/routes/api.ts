import Router from 'koa-router'
import engine from '../core/pm2'

const router = new Router({
  prefix: '/api'
})

// 开启指定服务
router.post('/start', async (ctx, next) => {
  const { name } = ctx.request.body || {}
  if (!name) {
    ctx.response.body = {
      stat: "error",
      msg: "Bad Params"
    }
  }
  try {
    const ret = await engine.apiStart(name)
    ctx.response.body = {
      stat: "ok",
      data: ret
    }
    // ctx.res.end(ret)
  } catch (error) {
    ctx.body = {
      stat: "fail",
      msg: error
    }
  }
})

// 关闭指定服务
router.post('/stop', async (ctx, next) => {
  const { name } = ctx.request.body || {}
  try {
    const ret = await engine.apiStop(name)
    ctx.response.body = {
      stat: "ok",
      data: ret
    }
    // ctx.res.end(ret)
  } catch (error) {
    ctx.body = {
      stat: "fail",
      msg: error
    }
  }
})

// 关闭指定服务
router.post('/list', async (ctx, next) => {
  try {
    const ret = await engine.apiList()
    ctx.response.body = {
      stat: "ok",
      data: ret
    }
    // ctx.res.end(ret)
  } catch (error) {
    ctx.body = {
      stat: "fail",
      msg: error
    }
  }
})

// 关闭指定服务
router.post('/desc', async (ctx, next) => {
  const { name } = ctx.request.body || {}
  try {
    const ret = await engine.apiDesc(name)
    ctx.response.body = {
      stat: "ok",
      data: ret
    }
    // ctx.res.end(ret)
  } catch (error) {
    ctx.body = {
      stat: "fail",
      msg: error
    }
  }
})

// 与指定进程通信
router.post('/sendData', async (ctx, next) => {
  const { name, data } = ctx.request.body || {}
  try {
    const [info] = await engine.apiDesc(name)
    const ret = await engine.apiSendData(info.pm_id, "ipc", data)
    ctx.response.body = {
      stat: "ok",
      data: ret
    }
  } catch (error) {
    ctx.body = {
      stat: "fail",
      msg: error
    }
  }
})

export default router
