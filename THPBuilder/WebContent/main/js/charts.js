/**
 * Created by admin on 2018/3/8.
 */


var colors = [];
var title={};  //标题

var charts = {
    datalist:[],
    chartID:'LoadLine',
    mychart:{},
    timelineCturrentIndex:0,  //当前播放的点
    
    //设置一段时间的timeoption
    /*
    * startDate 开始时间
    * endDate  结束时间
    * Interval  时间间隔(分钟来间隔数据)
    * datalist 数据集合
    * echartId echart的id
    * */
    setTimeDataOption:function(startDate,endDate,ninterval,dataList,echart){
    	   this.mychart=echart;
    	   this.datalist=dataList;
           var datalist=this.datalist;
           var legend = [];
           var xData;
           if (datalist) {
               for (var index in datalist) {
                   var xy = charts.getXY(datalist[index]);
                   xData = xy.x;
                   legend.push(xy.yname);
               }
           }
           
           var options = [];
           var interval = 60;   //1小时1个间隔(分钟)
           if(ninterval){
        	   interval=ninterval;
           }
           var timelineData = [];
           for (var ntime = startDate; ntime < endDate; ntime++) {
               var optionsitem = {};
               optionsitem.title = {};
               optionsitem.name = formatDate(new Date(ntime));
               optionsitem.starttime = ntime;
               optionsitem.endtime = ntime + 1000 * 60 * interval;
               optionsitem.series = [];
               optionsitem.xAxis=[];
               optionsitem.dataZoom=[];
               options.push(optionsitem);
               timelineData.push(formatDate(new Date(ntime)));
               ntime = ntime + 1000 * 60 * interval;

           }
           var height=this.mychart.getHeight();  //echart的高度
           var width=this.mychart.getWidth();  //echart的高度
           for (var x in options) {
               for (var index in dataList) {
                   {
                       var data = {};
                       var dataZoom={
                           y:height-60,
                           width: width/2-60,
                           // height:20,
                           show: true,
                           realtime: true,
                           left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'
                           // top:"top",                                //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
                           // right:"auto",                             //组件离容器右侧的距离,'20%'
                           // bottom:"auto",                            //组件离容器下侧的距离,'20%'
                           start: 0,
                           end: 100,
                           // startValue: startDate,
                           // endValue:endDate,
                       };
                       var series= {name: dataList[index].name, type: 'line',data:[]};
                       data.data = [];
                       options[x].series.push(series);
                       options[x].dataZoom.push(dataZoom);

                   }
                   var xaxis={
                           label: {
                               formatter: function (s) {
                                   return (new Date(s)).getFullYear();
                               }
                           },

                           data:[]};
                       options[x].xAxis=xaxis;
               }
           }

           if (dataList) {
               for (var index in dataList) {
                   for (var n in dataList[index].data) {
                       var seriesdata = [];
                       var item = dataList[index].data[n];
                       var time = Date.parse(new Date(item[0]));
//                       var time = Date.parse(new Date(item.time));
                       for (var o in options) {
                           if (time >= options[o].starttime && time < options[o].endtime) {

                               options[o].series[index].data.push(item);
                               if(index==0){
                                   options[o].xAxis.data.push(item[0]);
                               }
//                               options[o].xAxis[index].data.push(item[0]);
                           }
                       }
                   }

               }


           }
           var timeline = {};
           timeline.playInterval = 1000;   //播放频率
           timeline.lableformatter = "day";   //节点显示的格式
           timeline.data = timelineData;

           var chartOptions=[];
           var m=100/options.length;
           for (var nindex in options) {
               var chartoption = {};
               chartoption.title = {};
               chartoption.dataZoom = options[nindex].dataZoom;
               chartoption.xAxis = options[nindex].xAxis;
               chartoption.series = options[nindex].series;
               chartOptions.push(chartoption);
           }
          var option= this.setDataToChart(timeline,legend,chartOptions);
          return option;
    },

    /*
     * 设置散点图的option
     * */
    setScatterDataOption:function(dataList,echart){
    	 this.mychart=echart;
  	     this.datalist=dataList;
         var datalist=this.datalist;
         var legend = [];
         var series=[];   
         var xData=[];
         for (var index in dataList) {
        	  var xy = charts.getXY(datalist[index]);
              xData = xy.x;
              legend.push(xy.yname);
              var ser={
            		  type: 'scatter',
            		  data:datalist[index].data,
            		  label: {
            	            emphasis: {
            	                show: true,
            	                formatter: function (param) {
            	                    return param.data[3];
            	                },
            	                position: 'top'
            	            }
            	        },
            	        symbolSize:5,
              }
              series.push(ser);
             
         }
         
         var option={
        		 xAxis:{
        			 type:"category"
        		 },
        		 legend:{data: legend},
        		 series:series
         };
         return option;
         
               
    },
    
    
    //播放时给charts添加数据
    setDataToChart:function (timeline,legend,options) {
      var height=this.mychart.getHeight();  //echart的高度
      var width=this.mychart.getWidth();  //echart的高度
       var option = {
            baseOption: {
                timeline: {
                    y:height-60,
                    axisType: 'category',
                    autoPlay: true,
                    // playInterval: 1000,
                    playInterval: timeline.playInterval,
                    data:timeline.data,
                    label: {
                        show:false,
                        formatter : function(s) {
                            var time=new Date(s);
                            if(timeline.lableformatter=="year"){
                                return time.getFullYear();
                            }
                            else  if(timeline.lableformatter=="month"){
                                return time.getFullYear()+"-"+(time.getMonth()+1);
                            }
                            else  if(timeline.lableformatter=="day"){
                                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                            }
                            else{
                                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+ " " + p(time.getHours()) + ":" + p(time.getMinutes()) + ":" + p(time.getSeconds());
                            }

                        }
                    },
                    //线条设置
                    lineStyle:{
                        show:false,
                        color:'#f32421',
                    },
                    symbol: 'diamond',  //显示的形状
                    symbolSize: 0,       //显示的大小
                    itemStyle:{
                        normal:{
                            color: 'rgba(0,0,0,0)',
                            // barBorderColor:'rgba(0,0,0,0)',
                            // color: '#f32421', //填充色
                            // barBorderColor: '#4876FF', //边框色
                        },
                    },
                    //选中的设置
                    checkpointStyle:{
                        symbol: 'diamond',  //显示的形状
                        symbolSize: 0,       //显示的大小
                        color: 'rgba(0,0,0,0)',
                    },
                    controlStyle: {
//                        showPlayBtn:false,
                        // prevIcon:'image://images/backward.png',  //后退按钮的图形
                        // nextIcon:'',   //前进按钮的图形

                    },
                },
                title: {
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    // x:50,
                    // y: 20,
                    // x2: 40,
                    y2:80,
                    containLabel: true
                },
                dataZoom:[ {
                    y:height-60,
                    width: width/2-60,
                    show: true,
                    realtime: true,
                    left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'
                    start: 0,
                    end: 100
                }],
                // dataZoom:{
                //     y:height-90,
                //     width: 1000,
                //     show: true,
                //     realtime: true,
                //     left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'
                //     start: 0,
                //     end: 100,
                // },
                // dataZoom: [
                //     {
                //         type: 'slider',
                //         show: true,
                //         xAxisIndex: [0],
                //         handleSize: 20,//滑动条的 左右2个滑动条的大小
                //         height: 8,//组件高度
                //         left: 30, //左边的距离
                //         right: 40,//右边的距离
                //         bottom: 30,//右边的距离
                //         handleColor: '#ddd',//h滑动图标的颜色
                //         handleStyle: {
                //             borderColor: "#cacaca",
                //             borderWidth: "1",
                //             shadowBlur: 2,
                //             background: "#ddd",
                //             shadowColor: "#ddd",
                //         },
                //         fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                //             //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                //             //给第一个设置0，第四个设置1，就是垂直渐变
                //             offset: 0,
                //             color: '#1eb5e5'
                //         }, {
                //             offset: 1,
                //             color: '#5ccbb1'
                //         }]),
                //         backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色
                //         showDataShadow: false,//是否显示数据阴影 默认auto
                //         showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                //         handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                //         filterMode: 'filter',
                //     },
                //     //下面这个属性是里面拖到
                //     {
                //         type: 'inside',
                //         show: true,
                //         xAxisIndex: [0],
                //         start: 1,
                //         end: 100
                //     }
                // ],

                legend: {
                    x: 'right',
                    orient: 'vertical',
                    padding: 40,
                    data: legend
                },
                calculable : true,
                // grid: {
                //     top: 80,
                //     bottom: 100,
                //     tooltip: {
                //         trigger: 'axis',
                //         axisPointer: {
                //             type: 'shadow',
                //             label: {
                //                 show: true,
                //                 formatter: function (params) {
                //                     return params.value.replace('\n', '');
                //                 }
                //             }
                //         }
                //     }
                // },
                xAxis: [
                    {
                        'type':'category',
                        // 'axisLabel':{'interval':0},   //  X轴刻度配置interval:0 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                        splitLine: {show: false},
                        // //  隐藏坐标轴
                        // axisLine: {
                        //     show: false
                        // },
                        // // 去除坐标轴上的刻度线
                        // axisTick: {
                        //     show: false
                        // }
                        // data: xData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisPointer: {
                            snap: true
                        }
                    }
                ],
                series:
                    [
                    {name: '测点0', type: 'line'}
                ]
            },
           options:options
      
        };
       
       this.mychart.on("timelinechanged", function(param) {
            this.timelineCturrentIndex=param.currentIndex;
    
        });

        //创建补0函数
        function p(s) {
            return s < 10 ? '0' + s : s;
        }
        return option;
    },

    //给echart赋值
    initDataToChart: function (datalist, echartId) {
        this.chartID = echartId;
        var series = [];
        var legend = [];
        var xData;
        var lineStyles=[];
        // if(seriescolors){
        //     for (var index in seriescolors) {
        //        var lineStyle={//折线的颜色
        //             normal: {
        //                 color:seriescolors[index].color,
        //                 width:1.5,
        //             }
        //         };
        //         lineStyles.push(lineStyle);
        //     }
        // }

        if (datalist) {
            for (var index in datalist) {
                var xy = charts.getXY(datalist[index]);
                var ser = {
                    name: xy.yname,
                    type: 'line',
                    smooth: true,
                    data: xy.y,
                    lineStyle:lineStyles[index],
                };

                xData = xy.x;
                series.push(ser);
                legend.push(xy.yname);
            }
        }
        var colors=[];

        charts.initEchart(xData, legend,colors, series);
    },
    //给echart的xy轴赋值
    getXY: function (data) {
        var xy = {};
        if (data) {
            var xData = [];
            var yData = [];
            var list = data.data;
            if(list){
            for (var i = 0; i < list.length; i++) {
                var time = new Date(list[i].time);
                //var date = time.getHours() + ":" + time.getMinutes();
                var date = list[i].time;
                xData.push(date);
                var value = list[i].value;
                yData.push(value);
            }
            }
            xy.x = xData;
            xy.yname = data.name;
            xy.y = yData;
            return xy;

        }
    },
    //加载echart
    initEchart: function (xData, legend,colors, series) {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            // color:colors,
            legend: {
                x: 'right',
                orient: 'vertical',
                icon:"bar",
                itemWidth:20,
                itemHeight:5,
                padding: 40,
                data: legend
            },
            dataZoom: {
                // width: 300,
                // height: 25,
                // x: 145,
                show: true,
                realtime: true,
                start: 0,
                end: 100
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine: {onZero: true},
                data: xData
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                axisPointer: {
                    snap: true
                }
            },
            series: series
        };

        var myChart1 = echarts.init(document.getElementById(this.chartID));
        myChart1.setOption(option);
        // mychart = myChart1;

    },

    //设置曲线线条颜色
    setlColors: function (colors) {
        if (colors) {
            colors=colors;
        }
    },
    //设置标题位置
    settitleLocation:function (titleLocation) {
        title.x= titleLocation;
    },
    //设置标题位置
    settitleText:function (titleText) {
        title.text= titleText;
    },

    //播放时给charts添加数据
    setDataToCharts:function (timeline,legend,options) {
      var height= document.getElementById(this.chartID).offsetHeight;  //echart的高度
       var option = {
            baseOption: {
                timeline: {
                    y:height-90,
                    axisType: 'category',
                    autoPlay: true,
                    // playInterval: 1000,
                    playInterval: timeline.playInterval,
                    data:timeline.data,
                    label: {
                        show:false,
                        formatter : function(s) {
                            var time=new Date(s);
                            if(timeline.lableformatter=="year"){
                                return time.getFullYear();
                            }
                            else  if(timeline.lableformatter=="month"){
                                return time.getFullYear()+"-"+(time.getMonth()+1);
                            }
                            else  if(timeline.lableformatter=="day"){
                                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                            }
                            else{
                                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+ " " + p(time.getHours()) + ":" + p(time.getMinutes()) + ":" + p(time.getSeconds());
                            }

                        }
                    },
                    //线条设置
                    lineStyle:{
                        show:false,
                        color:'#f32421',
                    },
                    symbol: 'diamond',  //显示的形状
                    symbolSize: 0,       //显示的大小
                    itemStyle:{
                        normal:{
                            color: 'rgba(0,0,0,0)',
                            // barBorderColor:'rgba(0,0,0,0)',
                            // color: '#f32421', //填充色
                            // barBorderColor: '#4876FF', //边框色
                        },
                    },
                    //选中的设置
                    checkpointStyle:{
                        symbol: 'diamond',  //显示的形状
                        symbolSize: 0,       //显示的大小
                        color: 'rgba(0,0,0,0)',
                    },
                    controlStyle: {
                        showPlayBtn:false,
                        // prevIcon:'image://images/backward.png',  //后退按钮的图形
                        // nextIcon:'',   //前进按钮的图形

                    },
                },
                title: {
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    // x:50,
                    // y: 20,
                    // x2: 40,
                    y2:80,
                    containLabel: true
                },
                dataZoom:[ {
                    y:height-90,
                    width: 1000,
                    show: true,
                    realtime: true,
                    left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'
                    start: 0,
                    end: 100
                }],
                // dataZoom:{
                //     y:height-90,
                //     width: 1000,
                //     show: true,
                //     realtime: true,
                //     left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'
                //     start: 0,
                //     end: 100,
                // },
                // dataZoom: [
                //     {
                //         type: 'slider',
                //         show: true,
                //         xAxisIndex: [0],
                //         handleSize: 20,//滑动条的 左右2个滑动条的大小
                //         height: 8,//组件高度
                //         left: 30, //左边的距离
                //         right: 40,//右边的距离
                //         bottom: 30,//右边的距离
                //         handleColor: '#ddd',//h滑动图标的颜色
                //         handleStyle: {
                //             borderColor: "#cacaca",
                //             borderWidth: "1",
                //             shadowBlur: 2,
                //             background: "#ddd",
                //             shadowColor: "#ddd",
                //         },
                //         fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                //             //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                //             //给第一个设置0，第四个设置1，就是垂直渐变
                //             offset: 0,
                //             color: '#1eb5e5'
                //         }, {
                //             offset: 1,
                //             color: '#5ccbb1'
                //         }]),
                //         backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色
                //         showDataShadow: false,//是否显示数据阴影 默认auto
                //         showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                //         handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                //         filterMode: 'filter',
                //     },
                //     //下面这个属性是里面拖到
                //     {
                //         type: 'inside',
                //         show: true,
                //         xAxisIndex: [0],
                //         start: 1,
                //         end: 100
                //     }
                // ],

                legend: {
                    x: 'right',
                    orient: 'vertical',
                    padding: 40,
                    data: legend
                },
                calculable : true,
                // grid: {
                //     top: 80,
                //     bottom: 100,
                //     tooltip: {
                //         trigger: 'axis',
                //         axisPointer: {
                //             type: 'shadow',
                //             label: {
                //                 show: true,
                //                 formatter: function (params) {
                //                     return params.value.replace('\n', '');
                //                 }
                //             }
                //         }
                //     }
                // },
                xAxis: [
                    {
                        'type':'category',
                        // 'axisLabel':{'interval':0},   //  X轴刻度配置interval:0 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                        splitLine: {show: false},
                        // //  隐藏坐标轴
                        // axisLine: {
                        //     show: false
                        // },
                        // // 去除坐标轴上的刻度线
                        // axisTick: {
                        //     show: false
                        // }
                        // data: xData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisPointer: {
                            snap: true
                        }
                    }
                ],
                series:
                    [
                    {name: '测点0', type: 'line'}
                ]
            },
           options:options
            // options: [
            //     {
            //         title: {text: '2002全国宏观经济指标'},
            //         series: [
            //             {data: dataMap.dataGDP['2002']},
            //             {data: dataMap.dataFinancial['2002']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2003全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2003']},
            //             {data: dataMap.dataFinancial['2003']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2004全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2004']},
            //             {data: dataMap.dataFinancial['2004']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2005全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2005']},
            //             {data: dataMap.dataFinancial['2005']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2006全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2006']},
            //             {data: dataMap.dataFinancial['2006']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2007全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2007']},
            //             {data: dataMap.dataFinancial['2007']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2008全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2008']},
            //             {data: dataMap.dataFinancial['2008']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2009全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2009']},
            //             {data: dataMap.dataFinancial['2009']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2010全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2010']},
            //             {data: dataMap.dataFinancial['2010']},
            //
            //         ]
            //     },
            //     {
            //         title : {text: '2011全国宏观经济指标'},
            //         series : [
            //             {data: dataMap.dataGDP['2011']},
            //             {data: dataMap.dataFinancial['2011']},
            //
            //         ]
            //     }
            // ]
        };
        var myChart1 = echarts.init(document.getElementById(this.chartID));
        myChart1.setOption(option);
        this.mychart=myChart1;
        // mychart = echarts.init(document.getElementById(chartID));
        // mychart.setOption(option);

        // myChart1.on("dataZoom", function(param){
        //     console.log(param)
        // });
        // myChart1.on("timelineplaychanged", function(event) {
        //     console.log(event)
        // });
        myChart1.on("timelinechanged", function(param) {
            console.log(param);
            this.timelineCturrentIndex=param.currentIndex;

            // imelineCturrentIndex
        });





        //创建补0函数
        function p(s) {
            return s < 10 ? '0' + s : s;
        }
    },

    //加载一段时间内的数据
    /*
    * startDate 开始时间
    * endDate  结束时间
    * Interval  时间间隔
    * datalist 数据集合
    * echartId echart的id
    * */
    initTimeDataToCharts:function (startDate,endDate,interval,dataList,echartId) {
        this.chartID = echartId;
        this.datalist=dataList;
        var datalist=this.datalist;
        var legend = [];
        var xData;
        if (datalist) {
            for (var index in datalist) {
                var xy = charts.getXY(datalist[index]);
                xData = xy.x;
                legend.push(xy.yname);
            }
        }
        var options = [];
        var interval = 60;   //1小时1个间隔(分钟)
        var timelineData = [];
        for (var ntime = startDate; ntime < endDate; ntime++) {
            var optionsitem = {};
            optionsitem.title = {};
            optionsitem.name = formatDate(new Date(ntime));
            optionsitem.starttime = ntime;
            optionsitem.endtime = ntime + 1000 * 60 * interval;
            optionsitem.series = [];
            optionsitem.xAxis=[];
            optionsitem.dataZoom=[];
            options.push(optionsitem);
            timelineData.push(formatDate(new Date(ntime)));
            ntime = ntime + 1000 * 60 * interval;

        }
        var height= document.getElementById(this.chartID).offsetHeight;  //echart的高度
        for (var x in options) {
            for (var index in dataList) {
                {
                    var data = {};
                    var xaxis={
                        label: {
                            formatter: function (s) {
                                return (new Date(s)).getFullYear();
                            }
                        },

                        data:[]};
                    var dataZoom={
                        y:height-90,
                        width: 1000,
                        // height:20,
                        show: true,
                        realtime: true,
                        left:"center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'
                        // top:"top",                                //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
                        // right:"auto",                             //组件离容器右侧的距离,'20%'
                        // bottom:"auto",                            //组件离容器下侧的距离,'20%'
                        start: 0,
                        end: 100,
                        // startValue: startDate,
                        // endValue:endDate,
                    };
                    var series= {name: dataList[index].name, type: 'line',data:[]};
                    data.data = [];
                    options[x].series.push(series);
                    options[x].xAxis.push(xaxis);
                    options[x].dataZoom.push(dataZoom);

                }
            }
        }

        if (dataList) {
            for (var index in dataList) {
                for (var n in dataList[index].data) {
                    var seriesdata = [];
                    var item = dataList[index].data[n];
                    var time = Date.parse(new Date(item.time));
                    for (var o in options) {
                        if (time >= options[o].starttime && time < options[o].endtime) {

                            options[o].series[index].data.push(item);
                            options[o].xAxis[index].data.push(item.time);
                        }
                    }
                }

            }


        }
        var timeline = {};
        timeline.playInterval = 1000;   //播放频率
        timeline.lableformatter = "day";   //节点显示的格式
        timeline.data = timelineData;

        var chartOptions=[];
        var m=100/options.length;
        for (var nindex in options) {
            var chartoption = {};
            chartoption.title = {};
            chartoption.dataZoom = options[nindex].dataZoom;
            chartoption.xAxis = options[nindex].xAxis;
            chartoption.series = options[nindex].series;
            chartOptions.push(chartoption);
        }
        this.setDataToCharts(timeline,legend,chartOptions);
    },

    //设置是否播放
    setTimelineplay:function (playState) {
        if(this.mychart){
            this.mychart.dispatchAction({
                type: 'timelinePlayChange',
                playState: playState,
            });
        }
    },
    //设置后退
    setTimelineprev:function () {
        if(this.mychart){
            var currentIndex=1;
            if(this.timelineCturrentIndex>1){
                currentIndex= this.timelineCturrentIndex-1;
            }
            this.mychart.dispatchAction({
                type: 'timelineChange',
                // 时间点的 index
                currentIndex: currentIndex
            });
        }
    },
    //设置前进
    setTimelinenext:function () {
        if(this.mychart){
            var currentIndex= this.timelineCturrentIndex+1;
            this.mychart.dispatchAction({
                type: 'timelineChange',
                // 时间点的 index
                currentIndex: currentIndex
            });
        }
    }

}





