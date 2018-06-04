/* 存放socket模块需要的各种接口类型 例如：消息接口 message*/

/**
 * 消息接口
 * @param {type: number} 消息的类型(1:登陆公聊区消息.2:退出公聊区消息.3:公聊消息.4.私聊消息 5.进入私聊 6.退出私聊)
 * @param {user: string} 发起聊天的用户名
 * @param {anotheruser: string} 被发起聊天的用户名(私密聊天可用)
 * @param {data: any} 为JSON格式的数据
 */
interface Message {
    type: number;
    user: string;
    anotheruser?: string;
    data: any;
}

/**
 * 房间接口(表示房间中的所属关系)
 * @param {index} 索引签名
 */
interface Room{
    [index: string]: string
}

export {
    Message,
    Room,
}
