import * as Koa from 'koa'
import * as path from 'path'

import {router as router} from './routes/router';

const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onError = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// error handler
onError(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

let pathname = path.resolve(__dirname, '../../public') // 静态资源地址,不需要静态资源服务器
app.use(require('koa-static')(pathname))

// logger
app.use(async (ctx: any, next: any) => {
  const start: Date = new Date()
  await next()
  const ms: Number  = Date.parse(new Date().toString()) -Date.parse(start.toString()); 
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(router.routes()).use(router.allowedMethods()) // allowedMethods必须搭配routes使用😂

// error-handling
app.on('error', (err: any, ctx: any) => {
  console.error('server error', err, ctx)
});

app.listen(3000);

console.log('Server running on port 3000');
