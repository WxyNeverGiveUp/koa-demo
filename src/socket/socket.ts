import * as Fun from '../sql/sqlfun' // 数据库封装的一些简单方法
import {sql as SQL} from '../sql/sql' // 引入sql
import * as Ifun from '../models/interface'
import { promises } from 'fs';
let sio = require('socket.io');



let IO = function(server: any) {
    let io = sio.listen(server),
        counter: number = 0, // 在线聊天室的人数
        messageIndex: number = 0, // 消息的ID
        user: { [key: string]: string; } = {},   
        usocket: { [key: string]: string; } = {},
        room: { [key: string]: string} = {}; // 一个私聊室。key：发起者 对应 value：被发起者 

    function createMessage(Message: Ifun.Message) {
        messageIndex ++;
        return {
            id: messageIndex,
            type: Message.type,
            user: Message.user,
            anotheruser: Message.anotheruser,
            data: Message.data
        };
    }
    // Socket.io的标准用法
    io.on('connection', function(socket: any){

        /* 刚登陆时获取当前在线用户 */
        socket.on('user list', function(data: string){
            console.log(data);
            console.log('重新刷新列表');
            let userList: string = SQL.fetch;
            Fun.connPool(userList, [], function(err: any,result: any) {
                if(err){
                    console.log(err);
                }
                if(result.length){
                    socket.emit('user list', {
                        code: 1,
                        data: result
                    });
                } else{
                    socket.emit('user list', {
                        code: 0,
                        data: '当前没有用户在线'
                    });
                }
            })
        });

        /* 用户登录 */
        socket.on('user add', async function (data: any) {
            counter++; // 增加用户
            console.log('有一个新人进入了，他的id为' + socket.id)
            let id: string = socket.id;
            user[data] = id;
            usocket[id] = data;
            console.log(user);
            console.log(usocket);
            let userCheck: string = SQL.check; // 检查是否拥有该用户名
            let userAdd: string = SQL.add; // 检查是否拥有该用户名
            console.log('传送的数据为：' + data);
            await new Promise(function(resolve,reject){
                Fun.connPool(userCheck,[data], function(err: any,result: any) {
                    if(err){
                        console.log(err);
                    }
                    if(result.length){
                        socket.emit('user add', {
                            code: 1,
                            msg: '已存在用户！请更换姓名重新登录！'
                        });
                        reject('已经存在用户，无法登录了！');
                    }
                    resolve('此用户不存在，可以继续')
                })
            })
            await Fun.connPool(userAdd,[data],function(err: any,result: any) {
                if(err){
                    console.log(err);
                }
                if(result){
                    // 消息广播
                    let Imsg: Ifun.Message = { // 消息接口
                        type: 1,
                        user: data,
                        data: `
                            <p>
                                <span class="user">
                                    ${data}
                                </span>
                                <span class="text-green">已经上线啦！</span> 
                            </p>
                        `
                    }
                    let msg: object = createMessage(Imsg); // 消息对象
                    
                    io.sockets.emit('user add', msg);
                }
            })
        });

        /* 用户退出登录 */
        socket.on('user del', function(data: any){
            counter--;           
            let userDel: string = SQL.del;
            // 数据库操作
            Fun.connPool(userDel,[data],function(err: any,result: any) {
                if(err){
                    console.log(err);
                }
                if(result){
                    // 消息广播
                    let Imsg: Ifun.Message = { // 消息接口
                        type: 2,
                        user: data,
                        data: `
                            <p>
                                <span class="user">
                                    ${data}
                                </span>
                                <span class="text-red">已经下线了！</span>
                            </p>
                        `
                    }
                    let msg: object = createMessage(Imsg); // 消息对象
                    io.sockets.emit('user del', msg)
                }
            }) 
            delete usocket[socket.id]; // 删除此用户 
        })        

        /* 用户发送公聊信息时！ */
        socket.on('msg', function(data: any){
            // 广播
            let Imsg: Ifun.Message = { // 消息接口
                type: 3,
                user: data.name,
                data: `
                    <p>
                        <span class="user">
                            ${data.name}
                        </span>
                        对大家说：
                        <div class="msg">
                            ${data.msg}
                        </div>
                    </p>
                `
            }
            let msg: object = createMessage(Imsg); // 消息对象
            io.sockets.emit('msg', msg)
        })
        
        /* 进入私聊房间 */
        socket.on('private chat', function(data: any){
            let user: string = data.user, // 发起人姓名
                anotheruser: string = data.anotheruser; // 被发起人姓名
            room[user] = anotheruser;
            socket.join(`${user} to ${anotheruser}`); // 加入到指定聊天室
            
            let Imsg: Ifun.Message = { // 消息接口
                type: 5,
                user: user,
                anotheruser: anotheruser,
                data: '进入了私聊室'
            }
            let msg: object = createMessage(Imsg); // 消息对象
            socket.broadcast.emit('private chat', msg) // 主动人 收到的信息

            
        })


        /* 拒绝私聊 */
        socket.on('private reject',function(data: any){
            let user: string = data.name; // 拒绝人姓名
            let Imsg: Ifun.Message = { // 消息接口
                type: 6,
                user: user,
                data: '拒绝了您的聊天请求'
            }
            let msg: object = createMessage(Imsg); // 消息对象
            io.sockets.emit('private reject', msg)
        })

            /* 私聊消息 */
            socket.on('private msg', function(data: any){
                let Imsg: Ifun.Message = { // 消息接口
                    type: 5,
                    user: data.user,
                    anotheruser: data.anotheruser,
                    data: data.msg
                }
                let msg: object = createMessage(Imsg); // 消息对象
                io.in(`${data.user} to ${data.anotheruser}`).emit('private msg',msg)
            })
        
       

        /* 断开连接 */
        socket.on('disconnect', function() {
            // 数据库操作
            console.log('断开连接的socket.id是' + socket.id);            
            counter--;
            let userDel: string = SQL.del;
            let user: string = usocket[socket.id]
            if(user){
                Fun.connPool(userDel,[user],function(err: any,result: any) {
                    if(err){
                        console.log(err);
                    }
                    if(result){
                        // 广播
                        let Imsg: Ifun.Message = { // 消息接口
                            type: 3,
                            user: 'socket.id',
                            data: `
                                <p>
                                    <span class="user">
                                        ${user}
                                    </span>
                                    <span class="text-red">已经下线了！</span>
                                </p>
                            `
                        }
                        let msg: object = createMessage(Imsg); // 消息对象
                        io.sockets.emit('user del', msg)
                    }
                }) 
            }
            delete usocket[socket.id]; // 删除此用户            
		});
    });
}

export {
    IO,
}