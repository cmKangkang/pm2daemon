import Router from 'koa-router'
import engine from '../core/pm2'

const router = new Router({
  prefix: '/sh'
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
    const ret = await engine.start(name)
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
    const ret = await engine.stop(name)
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
    const ret = await engine.list()
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


export default router
