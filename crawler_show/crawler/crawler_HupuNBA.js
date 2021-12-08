var myRequest = require('request');
var myCheerio = require('cheerio');
var myIconv = require('iconv-lite');
var mysql = require('./mysql.js');
require('date-utils');

var seedURL = "https://nba.hupu.com/schedule/";
var myEncoding = 'utf-8';

const weeks = 500;//要爬取几周内的比赛
var time = new Date(2021,5,13);//最近的一周的周一 月份从0开始算

for(var i = 0; i < weeks; i++){
    var thisTime = time.addWeeks(-1);
    var url = seedURL + thisTime.toFormat('YYYY-MM-DD');
    console.log('即将爬取：' + url);

    getCompitition(url);
}

var reg_URL = /^https:\/\/nba.hupu.com\/games\/boxscore\/(\d{5,6})$/;
var reg = /\s/g;

var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
}

//利用'request'模块构建request函数，访问目标url，并在回调函数返回网页源码
function request(url, callback) {
    var options = {
        url: url,
        encoding: null,
        //proxy: 'http://x.x.x.x:8080',
        headers: headers,
        timeout: 10000 
    }
    myRequest(options, callback)
};

function getCompitition(url){
    request(url, function(err, response, body){
        var html = myIconv.encode(body, myEncoding);
        var $ = myCheerio.load(html, { decodeEntities: true });
        var compttion = {};
        var detailURL = '';
        var flag = 0;
        $(".players_table tbody a[target='_blank']").each(function(index){ //获取各场比赛球队总得分情况
            switch(flag){
                case 0:compttion.awayTeam = $(this).text();
                        flag++;
                        return;
                case 1:compttion.homeTeam = $(this).text();
                        flag++;
                        return;
                case 2:detailURL = $(this).attr('href');
                        flag = 0;
                        break;
            }
            if(compttion.awayTeam == undefined) return;
            var content = {};
            content.awayTeam = compttion.awayTeam;
            content.homeTeam = compttion.homeTeam;
            if(reg_URL.test(detailURL))
                getDetails(detailURL, content); //通过超链接读取比赛详细数据
            else
                console.log('非法url：' + detailURL);
        });
    });
}

function getDetails(detailURL, content){
    request(detailURL, function(err, response, body) {
        var dhtml = myIconv.encode(body, myEncoding);
        var $ = myCheerio.load(dhtml, { decodeEntities: true });
        const $AT = $('#J_away_content tbody');//Away Team
        const $HT = $('#J_home_content tbody');//Home Team
        const $AScore = $AT.children('.title').eq(2);//Away team Scores
        const $ARate = $AT.children('.title').eq(3);//Away team Rate
        const $HScore = $HT.children('.title').eq(2);//Home team Scores
        const $HRate = $HT.children('.title').eq(3);//Home team Rate
        const $infOfCom = $('.about_fonts');//information of competition
        var awayDetail = new Array(12), homeDetail = new Array(12);
        for(var k = 0; k < 12; k++){
            if(k < 3){
                awayDetail[k] = $AScore.children().eq(k+3).text().replace(reg, '');
                homeDetail[k] = $HScore.children().eq(k+3).text().replace(reg, '');
                awayDetail[k] += ' rate: ' + $ARate.children().eq(k+3).text().replace(reg, '');
                homeDetail[k] += ' rate: ' + $HRate.children().eq(k+3).text().replace(reg, '');
            }else {
                awayDetail[k] = parseInt($AScore.children().eq(k+3).text().replace(reg, ''));
                homeDetail[k] = parseInt($HScore.children().eq(k+3).text().replace(reg, ''));
            }
        }
        //数组的0到11分别是：投篮,3分,罚球,前场,后场,篮板,助攻,犯规,抢断,失误,封盖,总得分

        const dateOfCom = $infOfCom.find('.time_f').text().substr(3);
        const timeCost = $infOfCom.find('.consumTime').text().substr(3);
        const location = $infOfCom.find('.arena').text().substr(3);
        const numsOfAd = $infOfCom.find('.peopleNum').text().substr(3);
        const ARecord = $('.team_a').find('.message').children().eq(2).text().replace(reg, '').substr(3, 6);
        const HRecord = $('.team_b').find('.message').children().eq(2).text().replace(reg, '').substr(3, 6);
        const At_t = content.awayTeam + dateOfCom;
        const Ht_t = content.homeTeam + dateOfCom;

        if(timeCost != '暂无统计'){
            var fetchAddSql = 'INSERT INTO myFetches(team_time,url,team,ground,scores,record,oppo,ground_op,opScores,opRecord,'+
            'time,timeCost,location,numsOfAd,shoot,3point,penalty,frontcourt,backcourt,backboard,assist,foul,steal,mistake,cover) '+
            'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            var fetchAddSql_A = [At_t,detailURL,content.awayTeam,'客场',awayDetail[11],ARecord,content.homeTeam,'主场',homeDetail[11],
                                HRecord,dateOfCom,timeCost,location,numsOfAd,awayDetail[0],awayDetail[1],awayDetail[2],awayDetail[3],
                                awayDetail[4],awayDetail[5],awayDetail[6],awayDetail[7],awayDetail[8],awayDetail[9],awayDetail[10]];
            var fetchAddSql_H = [Ht_t,detailURL,content.homeTeam,'主场',homeDetail[11],HRecord,content.awayTeam,'客场',awayDetail[11],
                                ARecord,dateOfCom,timeCost,location,numsOfAd,homeDetail[0],homeDetail[1],homeDetail[2],homeDetail[3],
                                homeDetail[4],homeDetail[5],homeDetail[6],homeDetail[7],homeDetail[8],homeDetail[9],homeDetail[10]];
            //执行sql，数据库中fetch表里的team_time属性是unique的，不会把重复的team_time内容写入数据库
            mysql.query(fetchAddSql, fetchAddSql_A, function(qerr, vals, fields) {
                if (qerr) {
                    console.log(qerr);
                }
            });
            mysql.query(fetchAddSql, fetchAddSql_H, function(qerr, vals, fields) {
                if (qerr) {
                    console.log(qerr);
                }
            }); //mysql写入
        }
    });
}
//url,队伍,场1,队伍得分,队伍总战绩,对手,场2,对手得分,对手总战绩,比赛时间,耗时,地点,观众数,投篮,3分,罚球,前场,后场,篮板,助攻,犯规,抢断,失误,封盖
//url,team,ground,scores,record,oppo,ground_op,opScores,opRecord,time,timeCost,location,numsOfAd,shoot,3point,penalty,frontcourt,backcourt,backboard,assist,foul,steal,mistake,cover