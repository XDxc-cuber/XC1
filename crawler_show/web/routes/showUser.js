var shusDAO = require('../dao/showuserDAO');
var shlogDAO = require('../dao/showlogDAO');
var dltDAO = require('../dao/deleteDAO');
var express = require('express');
var router = express.Router();


router.get('/show', function(request, response) {
    console.log(request.session['managername']);
    //sql字符串和参数
    if (request.session['managername']===undefined) {
        response.json({message:'url',result:'/management.html'});
    }else {
        var param = request.query;
        shusDAO.search(param,function (err, result, fields) {
            response.json({message:'data',result:result});
        })
    }
});

router.get('/showlog', function(request, response) {
    console.log(request.session['managername']);
    //sql字符串和参数
    if (request.session['managername']===undefined) {
        response.json({message:'url',result:'/management.html'});
    }else {
        var param = request.query;
        shlogDAO.search(param,function (err, result, fields) {
            response.json({message:'data',result:result});
        })
    }
});

router.get('/delete', function(request, response) {
    console.log(request.session['managername']);
    //sql字符串和参数
    if (request.session['managername']===undefined) {
        response.json({message:'url',result:'/management.html'});
    }else {
        var param = request.query;
        dltDAO.delete(param,function (err, result, fields) {
            response.json({message:'data',result:result});
        })
    }
});

module.exports = router;
