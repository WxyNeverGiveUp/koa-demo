import * as Router from 'koa-router'
import * as fs from 'fs'
import * as path from 'path'
import * as Koa from 'koa'

const router = new Router();

/* 路由 */
// router.prefix('/users')

// 公共聊天区
router.get('/', function (ctx: Koa.Context, next: any) {
    let pathname = path.resolve(__dirname, '../../views/index.html'); 
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(pathname);
})

// 私密聊天
router.get('/chat/:user/to/:anotheruser/:type', function (ctx: Koa.Context, next: any) { // type为1 表示主动发起 为2表示被发起
    let pathname = path.resolve(__dirname, '../../views/privateChat.html'); 
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(pathname);
})

export { 
    router,
}