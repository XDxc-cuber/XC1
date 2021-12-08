var mysql = require('mysql');
var mysqlConf = require('../conf/mysqlConf');
var managerSqlMap = require('./managerSqlMap');
var pool = mysql.createPool(mysqlConf.mysql);
// 使用了连接池，重复使用数据库连接，而不必每执行一次CRUD操作就获取、释放一次数据库连接，从而提高了对数据库操作的性能。

module.exports = {
    getByManagername: function (managername, callback) {
        pool.query(managerSqlMap.getByManagername, [managername], function (error, result) {
            if (error) throw error;
            callback(result);
        });
    },

};
