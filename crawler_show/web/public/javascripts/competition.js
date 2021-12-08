var app = angular.module('competition', []);
app.controller('competition_Ctrl', function ($scope, $http, $timeout) {
    // 控制查询页面是否显示
    $scope.showSearch = function () {
        $scope.isShow = true;
        $scope.isisshowresult = false;

        // 再次回到查询页面时，表单里要保证都空的
        $scope.team=undefined;
        $scope.oppo=undefined;

    };

    // 查询数据（根据主客场队伍检索）
    $scope.search = function () {
        var team = $scope.team;
        var oppo = $scope.oppo;

        // 用户可能一个队伍名都不输入，默认查找全部数据
        var myurl = `/competitions/search?t1=${team}&op=${oppo}`;

        $http.get(myurl).then(
            function (res) {
                if(res.data.message=='data'){
                    $scope.isisshowresult = true; //显示表格查询结果
                    $scope.initPageSort(res.data.result)
                }else {
                    window.location.href=res.data.result;
                }


            },function (err) {
                $scope.msg = err.data;
            });
    };

    // 分页
    $scope.initPageSort=function(item){
        $scope.pageSize=6;　　//每页显示的数据量，可以随意更改
        $scope.selPage = 1;
        $scope.data = item;
        $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //分页数
        $scope.pageList = [];//最多显示5页，后面6页之后不会全部列出页码来
        $scope.index = 1;
        var len = $scope.pages> 5 ? 5:$scope.pages;
        $scope.pageList = Array.from({length: len}, (x,i) => i+1);

        //设置表格数据源(分页)
        $scope.items = $scope.data.slice(0, $scope.pageSize);

    };

    //打印当前选中页
    $scope.selectPage = function (page) {
        //不能小于1大于最大（第一页不会有前一页，最后一页不会有后一页）
        if (page < 1 || page > $scope.pages) return;
        //最多显示分页数5，开始分页转换
        var pageList = [];
        if(page>2){
            for (var i = page-2; i <= $scope.pages && i < page+3; i++) {
                pageList.push(i);
            }
        }else {
            for (var i = page; i <= $scope.pages && i < page+5; i++) {
                pageList.push(i);
            }
        }

        $scope.index =(page-1)*$scope.pageSize+1;
        $scope.pageList = pageList;
        $scope.selPage = page;
        $scope.items = $scope.data.slice(($scope.pageSize * (page - 1)), (page * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
        console.log("选择的页：" + page);
    };

    //设置当前选中页样式
    $scope.isActivePage = function (page) {
        return $scope.selPage == page;
    };
    //上一页
    $scope.Previous = function () {
        $scope.selectPage($scope.selPage - 1);
    };
    //下一页
    $scope.Next = function () {
        $scope.selectPage($scope.selPage + 1);
    };

    $scope.searchsortASC = function () {
        $scope.sorttime = '1';
        $scope.search();
    };
    $scope.searchsortDESC = function () {
        $scope.sorttime = '2';
        $scope.search();
    };

    // 下面是四个图的操作
    $scope.histogram = function () {
        $scope.isShow = false;
        $http.get("/competitions/histogram")
            .then(
                function (res) {
                    if(res.data.message=='url'){
                        window.location.href=res.data.result;
                    }else {
                        let xdata = [], ydata = [], newdata;
                        res.data.result.forEach(function (element) {
                            // "record":"XX胜利XX失败"
                            if(element["record"].length > 4 && xdata.indexOf(element["team"]) == -1)
                            {
                                var win = parseInt(element["record"].substr(0, 2));//将字符串数据转化为数字，计算胜率
                                var lose = parseInt(element["record"].substr(3, 2));
                                var rate = win / (win + lose);
                                ydata.push(rate);
                                xdata.push(element["team"]);
                            }
                        });
                        newdata = {"xdata": xdata, "ydata": ydata};

                        var myChart = echarts.init(document.getElementById('main1'));

                        // 指定图表的配置项和数据
                        var option = {
                            title: {
                                text: 'NBA各队伍胜率'
                            },
                            tooltip: {},
                            legend: {
                                data: ['队伍']
                            },
                            xAxis: {
                                data: newdata["xdata"],
                                axisLabel: {
                                    show: true,
                                    interval:0
                                }
                            },

                            yAxis: {},
                            series: [{
                                name: '胜率',
                                type: 'bar',
                                data: newdata["ydata"],
                                barGap: '80%',
                                barWidth: '50%'
                            }]
                        };
                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);
                    }
                },
                function (err) {
                    $scope.msg = err.data;
                });

    };
    $scope.pie = function () {
        $scope.isShow = false;
        $http.get("/competitions/pie").then(
            function (res) {
                if(res.data.message=='url'){
                    window.location.href=res.data.result;
                }else {
                    let newdata = [];
                    res.data.result.forEach(function (element) {
                        newdata.push({name: element["x"], value: element["y"]});
                    });

                    var myChart = echarts.init(document.getElementById('main1'));
                    var app = {};
                    option = null;
                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '各队伍比赛场数',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                        },
                        series: [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: newdata,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    // myChart.setOption(option);
                    app.currentIndex = -1;

                    setInterval(function () {
                        var dataLen = option.series[0].data.length;
                        // 取消之前高亮的图形
                        myChart.dispatchAction({
                            type: 'downplay',
                            seriesIndex: 0,
                            dataIndex: app.currentIndex
                        });
                        app.currentIndex = (app.currentIndex + 1) % dataLen;
                        // 高亮当前图形
                        myChart.dispatchAction({
                            type: 'highlight',
                            seriesIndex: 0,
                            dataIndex: app.currentIndex
                        });
                        // 显示 tooltip
                        myChart.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 0,
                            dataIndex: app.currentIndex
                        });
                    }, 1000);
                    if (option && typeof option === "object") {
                        myChart.setOption(option, true);
                    }
                    ;
                }
            });
    };
    $scope.line = function () {
        $scope.isShow = false;
        $http.get("/competitions/line").then(
            function (res) {
                if(res.data.message=='url'){
                    window.location.href=res.data.result;
                }else {
                    var myChart = echarts.init(document.getElementById("main1"));
                    let teams = [];
                    let avgScores = [];
                    res.data.result.forEach(function(element) {
                        teams.push(element["x"]);
                        avgScores.push(element["y"]);
                    });
                    option = {
                        title: {
                            text: '各队伍平均得分'
                        },
                        xAxis: {
                            type: 'category',
                            data: teams,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: avgScores,
                            type: 'line',
                            itemStyle: {normal: {label: {show: true}}}
                        }],

                    };

                    if (option && typeof option === "object") {
                        myChart.setOption(option, true);
                    }
                }

            });
    };

});