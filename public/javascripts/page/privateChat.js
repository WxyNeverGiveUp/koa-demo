let socket = io(),
    chatContent = $('.chat'), // 聊天窗口
    send = $('#btnSend'), // 发送信息
    user = decodeURI(window.location.href.toString().split('/')[4]), // 发起聊天的用户
    anotheruser = decodeURI(window.location.href.toString().split('/')[6]), // 被发起聊天的用户
    type = decodeURI(window.location.href.toString().split('/')[7]); // 聊天发起的类型

/* 进入私聊室 */
socket.emit('private chat', {
    user: user,
    anotheruser: anotheruser,
    type: type, // 发起类型
})

socket.on('private chat', function(data) {
    let msg = data.data;
    if (anotheruser == data.anotheruser) { // 如果广播的信息是你要找的人
        chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${data.anotheruser}</span><span class="text-green">${msg}</span>
        </p>
    `)
    }
})

/* 私聊信息 */
socket.on('private msg', function(data) {
    console.log(`${data.anotheruser}`);
    let msg = data.data
    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${data.user}</span> 对 <span class="user">${data.anotheruser}</span> 说
            <div class="msg">${msg}</div>
        </p>
    `)
})

/* 拒接私聊 */
socket.on('private reject', function(data) {
    let user = data.user,
        msg = data.data;
    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${user}</span><span class="text-red">${msg}</span>
        </p>
    `)
})

/* 退出私聊室 */
socket.on('private logout', function(data) {
    let user = data.user,
        msg = data.data;
    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${user}</span><span class="text-red">${msg}</span>
        </p>
    `)
})


// 逻辑
$(function() {
    // 进入聊天室的提示信息
    if (type == 1) { // 主动者
        chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${user}</span><span class="text-green">进入了私聊室</span>
        </p>
        `)
    } else { // 被动者
        chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${anotheruser}</span><span class="text-green">进入了私聊室</span>
        </p>
        `)
    }

    // 发送按钮
    $(send).click(function() {
        let msg = $('#msg').val();
        console.log(user)
        if (type == 1) {
            socket.emit('private msg', {
                user: user,
                anotheruser: anotheruser,
                msg: msg,
                type: 1 // 主动聊天者
            });
        } else {
            socket.emit('private msg', {
                user: anotheruser,
                anotheruser: user,
                msg: msg,
                type: 2 // 被动聊天者
            });
        }
        $('#msg').val('');
    })

    // 回车发送消息
    $('#msg').keydown(function(e) {
        if (e.which === 13) {
            e.preventDefault();
            let msg = $('#msg').val(); // 消息内容
            if (type == 1) {
                socket.emit('private msg', {
                    user: user,
                    anotheruser: anotheruser,
                    msg: msg,
                    type: 1 // 主动聊天者
                });
            } else {
                socket.emit('private msg', {
                    user: anotheruser,
                    anotheruser: user,
                    msg: msg,
                    type: 2 // 被动聊天者
                });
            }
            $('#msg').val('');
        }
    })

    // 退出私聊
    $('.back').click(function() {
        if (type == 1) {
            socket.emit('private logout', {
                user: user,
                anotheruser: anotheruser,
                msg: msg,
                type: 1 // 主动聊天者
            });
        } else {
            socket.emit('private logout', {
                user: anotheruser,
                anotheruser: user,
                msg: msg,
                type: 2 // 被动聊天者
            });
        }
    })
})

/* 工具方法 */
// 获取时间
function CurentTime() {
    var now = new Date();

    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日

    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分
    var ss = now.getSeconds(); //秒

    var clock = year + "-";

    if (month < 10)
        clock += "0";

    clock += month + "-";

    if (day < 10)
        clock += "0";

    clock += day + " ";

    if (hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10)
        clock += '0';

    clock += mm + ":";
    if (ss < 10)
        clock += '0';

    clock += ss;
    return (clock);
}