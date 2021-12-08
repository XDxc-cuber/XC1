var managerSqlMap = {
    getByManagername: 'select managername, password from manager where managername = ?'//登录时用
};

module.exports = managerSqlMap;