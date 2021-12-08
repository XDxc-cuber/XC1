var express = require('express');
var router = express.Router();
var userDAO = require('../dao/userDAO');

// login
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    userDAO.getByUsername(username, function (user) {
        if(user.length==0){
            res.json({msg:'Username is not exist! Please check your username or register!'});
        }
        else {
            if(password==user[0].password){
                req.session['username'] = username;
                res.cookie('username', username);
                res.json({msg:'ok'});
            }
            else{
                res.json({msg:'Your username or password may be not correct!'});
                //res.json({msg: password+'&'+user[0].password});//'Your username or password may be not correct!'
            }
        }
    });
});


// register
router.post('/register', function (req, res) {
    var add_user = req.body;

    userDAO.getByUsername(add_user.username, function (user) {
        if (user.length != 0) {
            res.json({msg: 'This username has been occupied!'});
        }else {
            userDAO.add(add_user, function (success) {
                res.json({msg: 'Register successfully! Please login.'});
            })
        }
    });

});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/process_get', function(request, response) {
    var fetchSql = "select team,ground,scores,record,oppo,ground_op,"+
    "opScores,opRecord,time,timeCost,location,numsOfAd,shoot,3point,penalty,"+
    "frontcourt,backcourt,backboard,assist,foul,steal,mistake,cover "+
    "from myfetches where team like '%"+request.query.title+"%'";
    mysql.query(fetchSql, function(err, result, fields) {
        response.writeHead(200, {
            "Content-Type": "application/json"
        });
        response.write(JSON.stringify(result));
        response.end();
    });
});
module.exports = router;


module.exports = router;
