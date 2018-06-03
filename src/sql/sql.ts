/* sql语句 */
let sql = {
    check: 'SELECT username FROM user WHERE username = ?;', // 检查用户是否重复
    add: 'INSERT INTO user(username) VALUES (?);', // 增加用户
    fetch: 'SELECT * from user;', // 获取当前用户
    del: 'DELETE FROM user WHERE username = ?;', // 删除用户
}

export {
    sql,
}
