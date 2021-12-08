var compDAO = require('../dao/competitionsDAO');
var express = require('express');
var router = express.Router();


router.get('/search', function(request, response) {
    console.log(request.session['username']);
    //sql字符串和参数
    if (request.session['username']===undefined) {
        response.json({message:'url',result:'/index.html'});
    }else {
        var param = request.query;
        compDAO.search(param,function (err, result, fields) {
            response.json({message:'data',result:result});
        })
    }
});

router.get('/histogram', function(request, response) {
    //sql字符串和参数
    console.log(request.session['username']);

    //sql字符串和参数
    if (request.session['username']===undefined) {
        response.json({message:'url',result:'/index.html'});
    }else {
        var fetchSql = "select team,record from myfetches group by team,record;";
        compDAO.query_noparam(fetchSql, function (err, result, fields) {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": 0
            });
            response.write(JSON.stringify({message:'data',result:result}));
            response.end();
        });
    }
});


router.get('/pie', function(request, response) {
    //sql字符串和参数
    console.log(request.session['username']);

    //sql字符串和参数
    if (request.session['username']===undefined) {
        response.json({message:'url',result:'/index.html'});
    }else {
        var fetchSql = "select team as x,count(team) as y from myfetches group by team;";
        compDAO.query_noparam(fetchSql, function (err, result, fields) {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": 0
            });
            response.write(JSON.stringify({message:'data',result:result}));
            response.end();
        });
    }
});

router.get('/line', function(request, response) {
    //sql字符串和参数
    console.log(request.session['username']);

    //sql字符串和参数
    if (request.session['username']===undefined) {
        // response.redirect('/index.html')
        response.json({message:'url',result:'/index.html'});
    }else {
        var fetchSql = "select team as x,avg(scores) as y from myfetches group by team;";
        compDAO.query_noparam(fetchSql, function (err, result, fields) {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": 0
            });
            response.write(JSON.stringify({message:'data',result:result}));
            response.end();
        });
    }
});

module.exports = router;
