let socket = io(),
    chatContent = $('.chat'), // 聊天窗口
    login = $('#btnLogin'), // 登录按钮
    logout = $('#btnLogout'), // 退出按钮
    send = $('#btnSend'), // 发送信息
    nameText = $('#username'), // 用户姓名
    userList = $('.user-list'), // 用户列表
    accpet = $('.accpet'), // 接受按钮
    reject = $('.reject'), // 拒绝按钮
    user = $('#user'); // 发起人姓名

/* 用户列表 */
socket.emit('user list', '有一个新人进入到房间内啦！')
socket.on('user list', function(data) {
    console.log('有新信息!');
    if (data.code) {
        console.log(data.data);
        let li = ''
        data.data.forEach(function(item, index) {
            li += `<li><a data-user="${item.username}" href="javascript:;">${item.username}</a></li> `
        })
        userList.html(li);
    } else {
        userList.html('<li class="text-red">当前无人在线</li>');
    }
});

/* 用户增加 */
socket.on('user add', function(data) {
    console.log(data);
    let loginMsg = data.data
    let user = data.user
    if (data.code) {
        $('#username').val('');
        nameText.removeAttr('disabled');
        login.removeAttr('disabled');
        login.removeClass('disabled');
        alert(data.msg);
    } else {
        // 清楚无人在线的提示
        $('.user-list .text-red').remove();
        chatContent.append(`
            <p>
                【系统时间】：${CurentTime()} 
                ${loginMsg}
            </p>
        `);
        userList.append(`
            <li><a data-user="${user}" href="javascript:;">${user}</a></li> 
        `)
    }
});

/* 删除用户 */
socket.on('user del', function(data) {
    let logoutMsg = data.data
    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            ${logoutMsg}
        </p>
    `);
    socket.emit('user list', '有人退出，重新刷列表')
});

/* 公聊消息 */
socket.on('msg', function(data) {
    console.log(data);
    let msg = data.data
    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            ${msg}
        </p>
    `)
});

/* 私密聊天 */
socket.on('private chat', function(data) {
    console.log(data);
    if (data.anotheruser == nameText.val()) {
        $('.tip').removeClass('hide');
        $('.accpet').attr('href', `/chat/${data.user}/to/${data.anotheruser}/2`); // 页面传参        
    }
})

// 逻辑
$(function() {
    // 登录按钮
    $(login).click(function() {
        let name = nameText.val();
        // localStorage.setItem('username', name); // 使用localstorage进行持久化
        if (name != '') {
            socket.emit('user add', name);
            nameText.attr('disabled', 'disabled');
            login.attr('disabled', 'disabled');
            login.addClass('disabled');
        } else {
            alert('用户名不能为空');
        }
    })

    // 发送按钮
    $(send).click(function() {
        let msg = $('#msg').val();
        let name = nameText.val();
        // let name = localStorage.getItem('username');
        console.log(name);
        if (msg != '' && name) {
            $('#msg').val('');
            socket.emit('msg', {
                name: name,
                msg: msg,
                type: 3
            });
        } else {
            alert('聊天内容不能为空或您未登陆');
        }
    })

    // 回车发送消息
    $('#msg').keydown(function(e) {
        if (e.which === 13) {
            e.preventDefault();
            let msg = $('#msg').val(); // 消息内容
            let name = nameText.val(); // 用户名
            if (msg != '' && name) {
                $(this).val('');

                socket.emit('msg', {
                    name: name,
                    msg: msg,
                    type: 3
                });
            } else {
                alert('聊天内容不能为空或您未登陆');
            }
        }
    })

    // 退出登录
    $(logout).click(function() {
        let name = nameText.val();
        let isLogin = nameText.prop('disabled');
        if (isLogin) {
            socket.emit('user del', name);
            nameText.removeAttr('disabled');
            login.removeAttr('disabled');
            login.removeClass('disabled');
        } else {
            alert('您暂未登录');
        }
    })

    // 点击人名发起私聊
    $('.user-list').on('click', 'li a', function() {
        let name = nameText.val(); // 发起人姓名
        let anothername = $(this).data('user'); // 被发起人姓名
        $(this).attr('href', `/chat/${name}/to/${anothername}/1`); // 页面传参
        let isLogin = nameText.prop('disabled');
        if (!(isLogin && name !== anothername)) {
            alert('您暂未登录,或您不能与自己聊天');
            return false;
        }
    })

    // 拒绝别人发起的聊天
    $(reject).click(function() {
        let name = nameText.val(); // 拒绝者姓名
        socket.emit('private reject', {
            name: name,
            type: 6
        });
        $('.tip').addClass('hide');
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