var mysql = require('mysql');
var mysqlConf = require('../conf/mysqlConf');
var pool = mysql.createPool(mysqlConf.mysql);
// 使用了连接池，重复使用数据库连接，而不必每执行一次CRUD操作就获取、释放一次数据库连接，从而提高了对数据库操作的性能。

module.exports = {
    query_noparam :function(sql, callback) {
        pool.getConnection(function(err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, function(qerr, vals, fields) {
                    conn.release(); //释放连接
                    callback(qerr, vals, fields); //事件驱动回调
                });
            }
        });
    },
    search :function(searchparam, callback) {
        // 组合查询条件
        var sql = 'select team,ground,scores,record,oppo,ground_op,'+
        'opScores,opRecord,time,timeCost,location,'+
        'numsOfAd,shoot,three_point,penalty,frontcourt,'+
        'backcourt,backboard,assist,foul,steal,mistake,cover from myfetches ';

        if(searchparam["t1"]!="undefined"){
            sql +=(`where team like '%${searchparam["t1"]}%'`);
            if(searchparam["op"]!="undefined"){
                sql +=(`AND oppo like '%${searchparam["op"]}%' `);
            };
        }
        else if(searchparam["op"]!="undefined"){
            sql +=(`where oppo like '%${searchparam["t1"]}%' `);
        };

        sql+=';';
        pool.getConnection(function(err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, function(qerr, vals, fields) {
                    conn.release(); //释放连接
                    callback(qerr, vals, fields); //事件驱动回调
                });
            }
        });
    },


};
