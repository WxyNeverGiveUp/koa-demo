// 封装一些简单的功能  连接池
import * as mysql from 'mysql' // 数据库
import { mysql as db } from '../db_config/db'
let pool = mysql.createPool(db);

// 封装连接池
function connPool (sql: string, options: any, callback: any) {
    pool.getConnection(function(err,conn){  
        if(err){  
            callback(err,null,null); 
            console.log(err); 
        }else{  
            conn.query(sql,options,function(err,results,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(err,results,fields);  
            });  
        }  
    });
}

/*获取当前时间*/
function CurentTime(){ 
        var now = new Date();
       
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
       
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss = now.getSeconds();            //秒
       
        var clock = year + "-";
       
        if(month < 10)
            clock += "0";
       
        clock += month + "-";
       
        if(day < 10)
            clock += "0";
           
        clock += day + " ";
       
        if(hh < 10)
            clock += "0";
           
        clock += hh + ":";
        if (mm < 10) 
            clock += '0'; 

        clock += mm + ":"; 
        if (ss < 10) 
            clock += '0'; 

        clock += ss; 
        return(clock); 
}
export {
    connPool,
    CurentTime
}