var express = require('express');
var router = express.Router();
var managerDAO = require('../dao/managerDAO');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('management', { title: 'Express' });
});

// login
router.post('/login', function(req, res) {
    var managername = req.body.managername;
    var password = req.body.password;

    managerDAO.getByManagername(managername, function (manager) {
        if(manager.length==0){
            res.json({msg:'Managername is not exist! Please check your managername or register!'});
        }
        else {
            if(password==manager[0].password){
                req.session['managername'] = managername;
                res.cookie('managername', managername);
                res.json({msg:'ok'});
            }
            else{
                res.json({msg:'Your managername or password may be not correct!'});
            }
        }
    });
});

module.exports = router;


module.exports = router;
