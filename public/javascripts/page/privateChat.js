let socket = io(),
    chatContent = $('.chat'), // 聊天窗口
    send = $('#btnSend'), // 发送信息
    user = decodeURI(window.location.href.toString().split('/')[4]), // 发起聊天的用户
    anotheruser = decodeURI(window.location.href.toString().split('/')[6]), // 被发起聊天的用户
    type = decodeURI(window.location.href.toString().split('/')[7]); // 聊天发起的类型

socket.emit('private chat', {
    user: user,
    anotheruser: anotheruser,
    type: type, // 发起类型
})


socket.on('private chat', function(data) {
    let msg = data.data;

    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${data.anotheruser}</span>${msg}
        </p>
    `)
})

socket.on('private msg', function(data) {
    console.log(data);
    let msg = data.data
    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            ${data.user} 对  ${data.anotheruser} 说
            <span class="msg">${msg}</span>
        </p>
    `)
})

socket.on('private reject', function(data) {
    let user = data.user,
        msg = data.data;
    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${user}</span>${msg}
        </p>
    `)
})


// 逻辑
$(function() {
    if (type == 1) { // 主动者
        chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${user}</span> 进入了聊天室
        </p>
        `)
    } else { // 被动者
        chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            <span class="user">${anotheruser}</span> 进入了聊天室
        </p>
        `)
    }
    // 发送按钮
    $(send).click(function() {
        let msg = $('#msg').val();
        if (type == 1) {
            $('#msg').val('');
            socket.emit('private msg', {
                user: user,
                anotheruser: anotheruser,
                msg: msg,
                type: 5
            });
        } else {
            socket.emit('private msg', {
                user: anotheruser,
                anotheruser: user,
                msg: msg,
                type: 5
            });
        }
        $('#msg').val('');
    })

    // 回车发送消息
    $('#msg').keydown(function(e) {
        if (e.which === 13) {
            e.preventDefault();
            let msg = $('#msg').val(); // 消息内容
            let name = nameText.val(); // 用户名
            $(this).val('');

            socket.emit('msg', {
                name: name,
                msg: msg,
                type: 3
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