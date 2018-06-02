import * as Koa from 'koa'
import * as path from 'path'
import * as bodyparser from 'koa-bodyparser'
import * as logger from 'koa-logger'
import * as json from 'koa-json'
// 导入WebSocket模块:
import * as WebSocket from 'ws'
import * as uuid from 'node-uuid'

import {router as router} from './routes/router';

const app = new Koa()

// 引用Server类:
const WebSocketServer = WebSocket.Server;

const views = require('koa-views')
const onError = require('koa-onerror')

// error handler
onError(app)

// middlewares
app.use(bodyparser({
  	enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

let pathname = path.resolve(__dirname, '../public') // 静态资源地址,不需要静态资源服务器
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


// 这一行代码一定要在最后一个app.use后面使用, 在koa中使用socket.io
let server = require('http').Server(app.callback()),
	io = require('socket.io')(server);
	
// Socket.io的标准用法
io.on('connection', function(socket: any){
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data: any) {
	  console.log(data);
	});
});
  
// 开启服务器
server.listen(3000);
console.info('Now running on localhost:3000');


