import * as Router from 'koa-router'
import * as fs from 'fs'
import * as path from 'path'
import { api } from '../api' // api对象

const router = new Router();


/* index */
router.get(api.string, async (ctx: any, next: any) => {
    ctx.body = 'koa2 string'
    console.log(ctx.body)
    console.log(ctx.response.body)
    console.log(ctx.body == ctx.response.body) // => true 是同一个东西
})
  
router.get('/json', async (ctx: any, next: any) => {
    ctx.body = {
      title: 'koa2 json'
    }
})

/* users */
// router.prefix('/users')

router.get('/', function (ctx: any, next: any) {
    let pathname = path.resolve(__dirname, '../../views/index.html'); 
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(pathname);
})

router.get('/bar', function (ctx: any, next: any) {
    ctx.body = 'this is a users/bar response'
})

export { 
    router,
}