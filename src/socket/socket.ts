import * as Fun from '../sql/sqlfun' // 数据库封装的一些简单方法
import {sql as SQL} from '../sql/sql' // 引入sql
import * as Ifun from '../models/interface'
import { promises } from 'fs';
let sio = require('socket.io');



let IO = function(server: any) {
    let io = sio.listen(server),
        counter = 0, // 在线聊天室的人数
        messageIndex = 0, // 消息的ID
        users: object = {},
        usocket: object = {}

    function createMessage(Message: Ifun.Message) {
        messageIndex ++;
        return {
            id: messageIndex,
            type: Message.type,
            user: Message.user,
            data: Message.data
        };
    }
    // Socket.io的标准用法
    io.on('connection', function(socket: any){
        /* 刚登陆时获取当前在线用户 */
        socket.on('user list', function(data: string){
            console.log(data);
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
            users[username] = username;
			// usocket[username] = socket;
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
                                已经上线啦！ 
                            </p>
                        `
                    }
                    let msg = createMessage(Imsg); // 消息对象
                    
                    io.sockets.emit('user add', msg);
                }
            })
        });

        /* 用户退出登录 */
        socket.on('user del', function(data: any){
            // 数据库操作
            counter--;
            let userDel: string = SQL.del;
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
                    let msg = createMessage(Imsg); // 消息对象
                    io.sockets.emit('user del', msg)
                }
            }) 
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
            let msg = createMessage(Imsg); // 消息对象
            io.sockets.emit('msg', msg)
        })

        // socket.on('disconnect', function() {
		// 	console.log('disconnect')
		// 	if (username) {
		// 		counter--;
		// 		delete users[username];
		// 		delete usocket[username];
		// 		if (home.name == username) {
		// 			homeLeave(username);
		// 		}
		// 		sendmsg({
		// 			type: 0,
		// 			msg: "用户<b>" + username + "</b>离开聊天室",
		// 			counter: counter,
		// 			users: users
		// 		})
		// 	}
		// });

    });
}

export {
    IO,
}