let socket = io(),
    chatContent = $('.chat'), // 聊天窗口
    login = $('#btnLogin'), // 登录按钮
    logout = $('#btnLogout'), // 退出按钮
    send = $('#btnSend'), // 发送信息
    nameText = $('#username'), // 用户姓名
    userList = $('.user-list'); // 用户列表

socket.emit('user list', '我进入到房间内啦！')
socket.on('user list', function(data) {
    if (data.code) {
        console.log(data.data);
        let li = ''
        data.data.forEach(function(item, index) {
            li += `<li data-user="${item.username}">${item.username}</li>`
        })
        userList.html(li);
    }
});

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
        chatContent.append(`
            <p>
                【系统时间】：${CurentTime()} 
                ${loginMsg}
            </p>
        `);
        userList.append(`
            <li data-user="${user}">${user}</li> 
        `)
    }
});

socket.on('user del', function(data) {
    let logoutMsg = data.data
    chatContent.append(`
        <p>
            【系统时间】：${CurentTime()} 
            ${logoutMsg}
        </p>
    `);
    $('.user-list li').each(function(index, item) {
        console.log($(this).data('user'));
        console.log(data.user);
        if ($(this).data('user') == data.user) {
            $(this).remove();
        }
    })
});

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
// 逻辑
$(function() {
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
    $(send).click(function() {
        let msg = $('#msg').val();
        let name = nameText.val();
        // let name = localStorage.getItem('username');
        console.log(name);
        if (msg != '' && name) {
            socket.emit('msg', {
                name: name,
                msg: msg,
                type: 3
            });
        } else {
            alert('聊天内容不能为空或您未登陆');
        }
    })
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