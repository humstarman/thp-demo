/**
 *
 * 仿真结果窗口设置，仿真结果的处理分析
 * */
function hideChart() {
  if (_running == true) {
    alert(mxResources.get('stopsimufirst'));
    return;
  }

  for (var i = 0; i < Charts.length; i++) {
    Charts[i].destroy();
  }
  Charts = [];
  _wndChart.destroy();
  //~ stopSimu();
  _runningChart = false;
}
var _pssDb = null;
//保存显示分组
/*类似：chart表示在chart中的索引，serie表示其线条索引
"Im-1":{"chart":1,"serie":0}
*/
var chartGrp = {};
// 保存图表分开，[ [] , [] ] 的形式
var charts = [];

// 保存绘图的body dom
var chartBody = [],
  chartHead = [];
// 初始化仿真结果窗口
function initChartWnd(task_IDs) {
  // 显示分组的输入示例：a,b;c,d
  chartGrp = {};
  charts = [];
  chartBody = [], chartHead = [];
  var _progressbar = '<br/><div class="progress" style="width:850px;height:20px;margin-top:5px">\
        <div><a>Progress:</a></div>\
        <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;margin-top:5px">\
        <span class="sr-only" style="color=#F5F5F5">0% Complete</span></div></div>';
  var _progressbar1 = '<br/><div class="progress" style="width:100%;height:20px;margin-top:-5px">\
        <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;margin-top:5px">\
        <span class="sr-only" style="color=#F5F5F5">0% Complete</span></div></div>';
  var _tabhead = '',
    _tabbody = '';
  _tabbody += '<div style="overflow:auto;height:450px" ><div id="chartsDivId"><div id="multicharts"><div style="height:400px">';
  for (var i = 0, j = 1; i < _pssDspgrp.length; i++, j++) {
    if (i == 0) {
      _tabhead += '<a class="dspgrp-head dspgrp-current" onclick="showChart(' + i + ')">' + mxResources.get('show', [j]) + '</a>';
      _tabbody += '<div class="chart-con chart-current " style="width:98%;height:100%" id="chart' + j + '"></div>';
    } else {
      _tabhead += '<a class="dspgrp-head" onclick="showChart(' + i + ')">' + mxResources.get('show', [j]) + '</a>';
      _tabbody += '<div class="chart-con " style="width:98%;height:100%" id="chart' + j + '"></div>';
    }
  }
  for (var x = 0; x < (_pssDspgrp_sum.length - _pssDspgrp.length); x++) {
    if (x == 0 && _pssDspgrp.length == 0) {
      var grpName = _pssEle[_pssDspgrp_sum_Name[x]].param[0].value;
      _tabhead += '<a class="dspgrp-head dspgrp-current" onclick="showChart(0)">' + grpName + '</a>';
      _tabbody += '<div class="chart-con chart-current " style="width:98%;height:100%" id="chart' + (x + 1) + '"></div>';
    } else {
      var grpName = _pssEle[_pssDspgrp_sum_Name[x]].param[0].value;
      _tabhead += '<a class="dspgrp-head" onclick="showChart(' + (x + _pssDspgrp.length) + ')">' + grpName + '</a>';
      _tabbody += '<div class="chart-con  " style="width:98%;height:100%" id="chart' + (x + 1) + '"></div>';
    }
  }
  _tabbody += '</div></div></div>';


  //new end
  // make chartGrp
  var i = 0;
  for (var k = 0; k < _pssDspgrp_sum.length; k++, i = 0) {
    //~ var d = _pssDspgrp_sum[k].split(',');
    //~ chartGrp[k]=d;
    charts[k] = _pssDspgrp_sum[k];
    for (var j = 0; j < _pssDspgrp_sum[k].length; j++) {
      var chart_serises = {
        "chart": k,
        "serie": i
      };
      if (chartGrp[_pssDspgrp_sum[k][j]['comp']] == undefined) {
        chartGrp[_pssDspgrp_sum[k][j]['comp']] = [];
      };
      chartGrp[_pssDspgrp_sum[k][j]['comp']].push(chart_serises);
      //chartGrp[ _pssDspgrp_sum[k][j]['comp'] ]={"chart":k,"serie":i};
      i++;
    }
    //~ console.log('call make grp');
  }
  //~ for( var i=0;i<charts.length;i++)
  //~ charts[i] = _.uniq(charts[i]);
  console.log(' charts is  ----', charts);
  var selectIDs = ''
  var hightSetDiv = ''
  if (task_IDs) {
    selectIDs = '<span ><select value="choose" onmousewheel="onmousechangeID()" id="select_taksID" style="width:90px;margin: 5px 0px 10px 0px;" onchange="onmousechangeID()">'
    for (var indx = 0; indx < task_IDs.length; indx++) {
      selectIDs += '<option value=' + task_IDs[indx] + '>' + mxResources.get('Scenes')+(indx + 1) + '</option>';
    }
    selectIDs += '</select></span>';
  }
  selectIDs +='<span class="btn btnclose disstop" onclick="com_hightSet(this)" id="hightSet">'+mxResources.get('curveAnalysis')+'</span>\
  <span class="btn btnclose disstop" style="margin-left: 4px;" onclick="createShareDl(this)" id="shareDl"> '+mxResources.get('editsharedocument')+' </span>'
  
  hightSetDiv = '<div id="hightSetDiv"></div>';
  _wndChartCon.style.userSelect = 'installMoveHandler';
  _wndChartCon.innerHTML = '\
    <div class="operate" style="overflow:auto;">\
      <span class="btn btnclose disstop" onclick="hideChart()" id="close_chart">' + mxResources.get('close') + '</span>\
       <span class="btn btnclose stopsimu" onclick="com_stopsimu()" id="stop_simu">' + mxResources.get('stopsimu') + '</span>\
      ' + selectIDs + '<span class="pull-right">' + _tabhead + '</span>\
    </div> ' + hightSetDiv + _tabbody + _progressbar1;
  //~ _wndChart = new mxWindow('仿真结果', _wndChartCon, 30, 30, _WIN.width*0.75, _WIN.height-300, true, true);
  _WIN.width = document.body.clientWidth || document.documentElement.clientWidth;
  _WIN.height = document.body.clientHeight || document.documentElement.clientHeight;
  var simuWindowWidth = _WIN.width * 0.75;
  _wndChart = new mxWindow(mxResources.get('result'), _wndChartCon, (_WIN.width * 0.25) / 2, (_WIN.height - 550) / 2, simuWindowWidth, 550, true, true);

  _wndChart.setMinimizable(true);
  _wndChart.setMaximizable(true);
  _wndChart.setScrollable(true);
  _wndChart.setVisible(true);
  _wndChart.setLocation = function(x, y) {
    x = Math.max(0, x);
    y = Math.max(0, y);
    x = Math.min(x, _WIN.width - simuWindowWidth);
    y = Math.min(y, _WIN.height - 550);
    mxWindow.prototype.setLocation.apply(this, arguments);
  };
  _runningChart = true;
  //~ _wndChart.setClosable(true);
  _wndChart.setScrollable(true);
  //~ return;
  // 关闭窗口时的处理函数
  _wndChart.addListener(mxEvent.CLOSE, function(e) {
    WebSck.close();
    for (var i = 0; i < Charts.length; i++) {
      Charts[i].destroy();
    }
  });
  // 窗口显示时的处理
  _wndChart.addListener(mxEvent.SHOW, function(e) {
    console.log(task_IDs)
    initWebSck4Sql(task_IDs);

    console.log('chart window shown');
    //~ showchart();//cnavasjs 版

  });
  // 窗口最大化时的处理
  _wndChart.addListener(mxEvent.MAXIMIZE, function(e) {
    for (var i = 0; i < Charts.length; i++)
      Charts[i].reflow();
  });
  _wndChart.addListener(mxEvent.NORMALIZE, function(e) {
    for (var i = 0; i < Charts.length; i++)
      Charts[i].reflow();
  });
  // 窗口最大化时的处理
  _wndChart.addListener(mxEvent.HIDE, function(e) {
    console.log(' chart window hidden ');
    stopSimu();

  });
  //~ showchart();

  // 将绘图body记录入列表
  var x = $('.chart-con');
  for (var i = 0; i < x.length; i++) {
    chartBody.push(x[i]);
  }
  var x = $('.dspgrp-head');
  for (var i = 0; i < x.length; i++) {
    chartHead.push(x[i]);
  }

  showchartH(); // highcharts 版
  currentChart = 0;
} // initEleCompPanel end
function showChart(target) {
  for (var i = 0; i < chartBody.length; i++) {
    chartBody[i].className = 'chart-con';
  }
  for (var i = 0; i < chartHead.length; i++) {
    chartHead[i].className = 'dspgrp-head';
  }
  chartHead[target].className = 'dspgrp-head dspgrp-current';
  chartBody[target].className = 'chart-con chart-current';
  currentChart = target;
  Charts[currentChart].reflow();
  Charts[currentChart].redraw();
}

var chartInterval;
var dps = [];
var tmpi = 0;
var currentChart = 0;

//分组记录，方便后面进行查找
/*
var chartGrp={
    // currentChart:group
    // eg: 1:['E-1','I-2']
    // 改为 "E-1":0的形式 ，后面的数字表示其在哪张图
};
* */

function changetabpreview() {

  for (var i = 0; i < 4; i++) {
    $('#chart' + (i + 1)).css('width', '50%');
    $('#chart' + (i + 1)).css('float', 'left');
    //$('#chart'+(i+1)).addClass('chart-current');
    chartHead[i].className = 'dspgrp-head dspgrp-current';
    chartBody[i].className = 'chart-con chart-current';
  }
  for (var i = 0; i < 4; i++) {
    /*      charts[i].reflow();
          charts[i].redraw();*/
    var chart1 = $('#chart' + (i + 1)).highcharts();

    chart1.reflow();
    chart1.redraw();
  }
}

/********** highcharts ***************/
// 操作
//$(Charts[0]).highcharts('StockChart').series[0].remove()
function showchartH() {
  // 根据分组情况添加显示结果window
  var noc = $('.chart-con');
  var serie = [],
    se = [],
    _title = '',
    t = '';
  //for(var i=0;i<noc.length;i++){
  $('.chart-con').each(function(i) {
    //~ se= chartGrp[i].split(',');
    serie = [], _title = '', t = '';
    for (var j = 0; j < charts[i].length; j++) {
      serie.push({
        name: charts[i][j]['name'],
        data: []
      });
      _title += charts[i][j]['name'] + ','
        //~ console.log( '_title', _title );
    }
    t = _title.substr(0, _title.length - 1);
    console.log(noc[i].id);
    //~ console.log( serie );
    try {
      var cha = $(this).highcharts('StockChart', {
        chart: {
          //~ renderTo:noc[i].id,
          zoomType: 'x',
          animation: true,
          margin: [0, 0, 80, 50],
          zoomType: 'xy',
        },
        navigator: {
          xAxis: {
            labels: {
              maxStaggerLines: 500,
              formatter: function() {

                // var now=this.value*_simuPARAM["step"];
                // now=now.toFixed(5);
                return this.value + 's';
              }
            },
            //~ format:'{value}'
          },
        },
        credits: {
          enabled: false
        },
        rangeSelector: false,
        exporting: {
          enabled: true
        },
        legend: {
          enabled: true,
          　　align: "center",
          　　verticalAlign: "bottom",
          　　x: 0,
          　　y: 0
        },
        tooltip: {
          formatter: function() {
            var html = '<span >Time</span>: <b>' + (this.x).toFixed(4) + 's</b> <br/>'

            for (var i = 0; i < this.points.length; i++) {
              html += '<span style="color:' + this.points[i].series.color + '">' + this.points[i].series.name + '</span>: <b>' + (this.points[i].y).toFixed(5) + '</b><br/>';
            }
            return html;
          }
        },
        xAxis: {
          title: {
            text: mxResources.get('Time')
          },
          labels: {
            maxStaggerLines: 500,
            formatter: function() {
              // var now = this.value * _simuPARAM["step"];
              // now = now.toFixed(5);
              return this.value + 's';
            }
          },
        },
        yAxis: [{
          lineWidth: 1,
          opposite: false,
          labels: {
            x: -5
          }
        }],
        series: serie
      });
    } catch (err) {
      console.log(err);
    }
    //~ Charts.push( $(cha).highcharts('StockChart') );
    //  Charts.push( $(noc[i]).highcharts('StockChart') );
    Charts.push($(noc[i]).highcharts());
    //~ console.log( cha )

  }); // end for

} // endof showChartH
function onmousechangeID() {
  var message = moreSimumessages[$('#select_taksID').val()];
  var channel = {};
  for (var indx = 0; indx < message.length; indx++) {
    if (message[indx].cmd == 'draw') {
      for (var x in message[indx]['data']) {
        channel[x] = channel[x] ? channel[x] : [];
        for (var i = 0, l = message[indx]['data'][x].length; i < l; i++) {
          channel[x].push(message[indx]['data'][x][i]);
          //Charts[k].series[s].addPoint(dat['data'][x][i], false, false);
        }
      }
    }
  }
  for (var x in channel) {
    for (var en = 0; en < chartGrp[x].length; en++) {
      k = chartGrp[x][en]['chart'], s = chartGrp[x][en]['serie'];
      Charts[k].series[s].setData(channel[x]);
    }
  }
}

var multiSelect = 1;

function onmousechangeID() {
  var message = moreSimumessages[$('#select_taksID').val()];
  var poLabel = document.getElementById('poLabelid')
  if (poLabel) {
    poLabel.innerText = null
    var paramList = mulitParamObj[$('#select_taksID').val()];
    mxUtils.write(poLabel, JSON.stringify(paramList));
  }
  var channel = {};
  for (var indx = 0; indx < message.length; indx++) {
    if (message[indx].cmd == 'draw') {
      for (var x in message[indx]['data']) {
        channel[x] = channel[x] ? channel[x] : [];
        for (var i = 0, l = message[indx]['data'][x].length; i < l; i++) {
          channel[x].push(message[indx]['data'][x][i]);
          //Charts[k].series[s].addPoint(dat['data'][x][i], false, false);
        }
      }
    }
  }
  for (var x in channel) {
    for (var en = 0; en < chartGrp[x].length; en++) {
      k = chartGrp[x][en]['chart'], s = chartGrp[x][en]['serie'];
      Charts[k].series[s].setData(channel[x]);
    }
  }
}

function com_hightSet() {
  if (_running == true) {
    alert(mxResources.get('stopsimufirst'));
    return;
  }
  chartawesomplete = null;
  var chartsDiv = document.getElementById('chartsDivId');
  chartsDiv.firstElementChild.style.float = 'right';
  // chartsDiv.firstElementChild.style['margin-right'] =($('#chartsDivId').width()*0.05)+ 'px';
  chartsDiv.firstElementChild.style.width = '62%';
  for (var cindx = 0; cindx < Charts.length; cindx++) {
    Charts[cindx].setSize($('#chartsDivId').width()*0.58, 400)

  }

  var mulitParamdiv = document.getElementById('mulitParamID');
  if (!mulitParamdiv) {
    mulitParamdiv = document.createElement('div');
    mulitParamdiv.id = 'mulitParamID';
  } else {
    return ;
    $('#mulitParamID').empty()
    $('#multichartschild').empty()
  }
  analysisTable={};
  expLength=0;
  tabeUse=[];
  expMappTable = {};
  mappExpName = {};

  mulitParamdiv.style.float = 'left';
  mulitParamdiv.style.width = '36%';

  var handlerDiv = document.createElement('div');
  handlerDiv.style.height = '20px';
  handlerDiv.style['margin-bottom'] = '10px';
  var hlabel = document.createElement('div');
  mxUtils.write(hlabel, mxResources.get('paramTable'));
  hlabel.style.width = '50%';
  hlabel.style.backgroundColor = '#d7d7d7';
  hlabel.style.borderLeftWidth = '1px';
  hlabel.style.textAlign = 'center';
  hlabel.style.fontWeight = 'bold';
  hlabel.style.paddingTop = '2px'
  hlabel.style.overflow = 'hidden';
  hlabel.style.float = 'left';
  hlabel.setAttribute('class', 'formatTitle');
  if(_task_ids.length){
    handlerDiv.appendChild(hlabel);
  }else{
    hlabel.style.width = '100%';
  }
  
  var hlabel2 = hlabel.cloneNode(false);
  var hlabel3 = hlabel2.cloneNode(false);

  var currentLabel = null;
  var currentPanel = null;
  this.currentIndex = 0;
  var addClickHandler = mxUtils.bind(this, function(elt, panel, index) {
    var clickHandler = mxUtils.bind(this, function(evt) {
      if (currentLabel != elt) {

        this.currentIndex = index;


        if (currentLabel != null) {
          currentLabel.style.backgroundColor = '#d7d7d7';
          currentLabel.style.borderBottomWidth = '1px';
        }

        currentLabel = elt;
        currentLabel.style.backgroundColor = '';
        currentLabel.style.borderBottomWidth = '0px';
        console.log(panel)
        if (currentPanel != panel) {
          if (chartawesomplete) {
            chartawesomplete.list = Object.keys(getNmapping());
          }

          if (currentPanel != null) {
            currentPanel.style.display = 'none';
          }

          currentPanel = panel;
          currentPanel.style.display = '';
        }
      }
    });

    mxEvent.addListener(elt, 'click', clickHandler);

    if (index == (this.currentIndex)) {
      console.log(this.currentIndex)
        // Invokes handler directly as a workaround for no click on DIV in KHTML.
      clickHandler();
    }

  });

  var paramTableDiv = document.createElement('div');
  if(_task_ids.length){

    var multiTable=new multiparamTable(paramTableDiv);
  }

  



  var dataAns = document.createElement('div');
  var anls = new dataAnalysis(dataAns);
  if(_task_ids.length){
    addClickHandler(hlabel, paramTableDiv, 0);
    addClickHandler(hlabel2, dataAns, 1);
    dataAns.style.display = 'none';
  }else{
    addClickHandler(hlabel2, dataAns, 0);
    paramTableDiv.style.display = 'none';
  }
  
  

  addClickHandler(hlabel3, '3', 2);
  mxUtils.write(hlabel2, mxResources.get('curveAnalysis'));
  mxUtils.write(hlabel3,  mxResources.get('paramTable'));
  handlerDiv.appendChild(hlabel2);
  //handlerDiv.appendChild(hlabel3);
  mulitParamdiv.appendChild(handlerDiv)
  mulitParamdiv.appendChild(paramTableDiv)
  mulitParamdiv.appendChild(dataAns)
  chartsDiv.appendChild(mulitParamdiv)
  if(multiTable){

   multiTable.init();
  }
  anls.init();
 
  //   chartsDiv.appendChild(dataAns)
}
var chartawesomplete = null;

function dataAnalysis(container) {
  var html = '\
              <div class="row" style="overflow:scroll;height:400px">\
              <div class="col-xs-2" id="operate" style="margin-left: 30px;margin-top: 20px;">\
                <div id="myTabContent" class="tab-content">\
                  <div class="tab-pane fade in active" id="home">\
                      <label for="eq">'+mxResources.get('inputexpression')+':</label>\
                          <input class="form-control" type="text" name="expre" /><br/>\
                          <button onclick="addexp()" class="btn btn-primary btn-sm" style="margin-top: 5px;">'+mxResources.get('add')+'</button>\
                          <button onclick="drawChart()" class="btn btn-primary btn-sm" style="margin-top: 5px;">'+mxResources.get('draw')+'</button>\
                          <Table  class="table table-condensed" id="cal_tab" cellpadding="0"cellspacing="0" width="30%" style="margin-top: 5px;">\
                              <tr>\
                              <td width="30%" align="center">'+mxResources.get('expression')+'</td>\
                              <td width="30%" align="center">'+mxResources.get('grouping')+'</td>\
                              <td width="30%" align="center">'+mxResources.get('operate')+'</td>\
                              </tr>\
                          </Table>\
                  </div>\
              </div>\
            </div>\
          </div>';
  container.innerHTML += html;
  this.init = function() {
    //测试用delimiter:null
    var taginput = $('input[name="expre"]').tagsInput({ 
      interactive: true,unique:false
    });
    if(!chartawesomplete){
        chartawesomplete = new Awesomplete($('#'+taginput.attr('id')+'_tag')[0], {
        list: Object.keys(getNmapping())
      });
    }
    
  }

}
var analysisTable={};
var expLength=0;
var tabeUse=[];
var expMappTable = {};
var mappExpName = {};
/**
 * 添加表达式
 */
function addexp() {
  var tagval =$('input[name="expre"]').val();
    var str = tagval.split(',');
    var dataMapp = getNmapping();
    var mappName = {};
    var mappTable = {};
    var newExp = '';
    var oldExp = '';
    for (var i = 0; i < str.length; i++) {
        if (dataMapp[str[i]]) {
            var newName = mappingName(str[i], mappName);
            mappingTable(newName, dataMapp[str[i]].yData, mappTable);
            newExp += newName;
        } else if (!isNaN(str[i])) {
            var newName = mappingName(str[i], mappName);
            mappingTable(newName, str[i], mappTable);
            newExp += newName;
        } else {
            newExp += str[i];
        }
        oldExp += str[i];
    }
    try {
        var result = math.eval(newExp, mappTable)
        
        tabeUse.push(1)
        analysisTable[newExp]=tabeUse.length-1;
        expMappTable[oldExp] = expMappTable[oldExp]||{
            result: result,
            mappName: mappName,
        }
    } catch (err) {
        console.log(err);
        alert(err);
        return;
    }
    var s = ' <tr ><td >' + oldExp + '</td><td ><button class="btn btn-default btn-xs ">'+mxResources.get('delete')+'</button></td></tr>';
    var selectbt = "<select id='selectTest' class='btn btn-default btn-xs tab' onchange='selectChange(this,\""+newExp+"\")' name='selectTest'></select>";

    var newtypes = " <tr ><td >" + oldExp + "</td>" + "<td>" + selectbt + "</td>" + "<td ><button class='btn btn-default btn-xs btn_delop' >"+mxResources.get('delete')+"</button></td></tr>";
    ($("#cal_tab" + " tr").eq(-1)).after(newtypes);
    setTabClear(tabeUse.length);
   // addChartGroup(tabeUse.length);
    console.log(1)
    $("button.btn_delop:last").click(function() {
        $(this).closest("tr").remove();
        console.log(newExp);
         tabeUse[analysisTable[newExp]]-=1;
    });
}
  var isdarwexp=0;
function selectChange(self,data){
  if(!isdarwexp){
    return;
  }
    tabeUse[analysisTable[data]]-=1;
    analysisTable[data]= $(self).get(0).selectedIndex;
    tabeUse[analysisTable[data]]+=1
    console.log(tabeUse,analysisTable)
    drawChart();
    $($('#myTabforchart li a')[$(self).get(0).selectedIndex]).click()
}
var chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//随机生成字符
function generateMixed(n) {    
  var res = "";    
  for (var i = 0; i < n; i++) {        
    var id = Math.ceil(Math.random() * 25);        
    res += chars[id];    
  }    
  return res;
}
//名称对应表
function mappingName(str, mapping) {
  var newName = generateMixed(6);
  while (mappExpName[newName]) {
    newName = generateMixed(6)
  }
  mapping[newName] = str;
  mappExpName[newName]=str;
  return newName;
}
//数据对应表
function mappingTable(str, value, mapping) {
  mapping[str] = value;
}
//获取表信息
function getChartType() {
  var tp = [];
  $('select.charttp').each(function(i) {
    tp[i] = $(this).val();
  });
  /*        console.log("tptp"+tp);*/
  return tp;
}

function drawData2Chart() {
  var dataMapping = getNmapping();
  $("#cal_tab tr:gt(0)").each(function(i) {
    var exp = $(this).children("td").eq(0).text();
    console.log(exp);
    if (expMappTable[exp]) {
      var mappName = expMappTable[exp]['mappName'];
      var xData = null;
      for (var key in mappName) {
        if (dataMapping[mappName[key]]) {
          xData = dataMapping[mappName[key]].xData;
          break;
        }
      }
      if (xData && expMappTable[exp]['result']) {
        var ser = {};
        ser.name = exp;
        var cData = [];
        for (var indx = 0; indx < expMappTable[exp]['result'].length; indx++) {
          cData.push([xData[indx], expMappTable[exp]['result'][indx]])
        }
        ser.data = cData;

      }

      var chart = 'chart' + $(this).children("td").eq(1).children('select').val();
      hchart = $('#' + chart).highcharts()
      hchart.addSeries(ser)
    }

  });
}

function drawChart() {
    var mulitCharts = document.getElementById('multicharts');
    isdarwexp=1;
    var ancdiv = document.getElementById('multichartschild');
    if (!ancdiv) {
        ancdiv = document.createElement('div');
        ancdiv.id = 'multichartschild';
    } else {
        $('#multichartschild').empty()
    }
    ancdiv.innerHTML += '<div class="col-xs-10"  style="height:450x;">\
    <ul id="myTabforchart" class="nav nav-tabs"></ul>\
    <div id="myTabContent1" class="tab-content" style="width:100%;" >\
    </div> ';

    mulitCharts.appendChild(ancdiv);
    mulitCharts.style.overflow = 'auto';
    mulitCharts.style.height = '420px';
    var size = tabeUse.length;
    var type = getChartType();
    var fistGroup=undefined;
    for (var x = 0; x < size; x++) {
        if(!tabeUse[x]){
            continue;
        }
        fistGroup=(fistGroup==undefined)?x:fistGroup;
        if (x == 0) {
            var temphtml = "<li class='active'><a href='#tabb1' data-toggle='tab'>"+mxResources.get('grouping')+"1</a></li>";
            $("#myTabforchart").html(temphtml);
            var divhtml = "<div class='cal_content' id='tabb1'><div style='height:400px;margin-bottom: 40px;' id='charttab1' ></div></div>";
            $("#myTabContent1").html(divhtml);
        } else {
            var temphtml = "<li><a href='#tabb" + (x + 1) + "' data-toggle='tab'>" +mxResources.get('grouping')+ (x + 1) + "</a></li>";
            $("#myTabforchart").append(temphtml);
            var divhtml = "<div class='cal_content' id='tabb" + (x + 1) + "'><div style='height:400px;margin-bottom: 40px;' id='charttab" + (x + 1) + "'></div></div>";
            $("#myTabContent1").append(divhtml);
        }
        optionchart['chart']['renderTo'] = 'charttab' + (x + 1);
        optionchart.chart.type = type[x];
        new Highcharts.StockChart(optionchart);
        optionchart['series'] = [];
    }

    drawData2Chart();
    $('.cal_content').addClass('cal_unactive');
    $('#tabb'+(fistGroup+1)).removeClass('cal_unactive');
    $('#tabb'+(fistGroup+1)).addClass('cal_active');
    $('#myTabforchart li').click(function() {
        var index = $(this).index();
        $('.cal_active').removeClass('cal_active').addClass('cal_unactive');
        var activeTab = $(this).find("a").attr("href");
        $(activeTab).removeClass('cal_unactive').addClass('cal_active');

    });
}


function getTabsize() {
  //console.log($("#tab2 tr").length);
  return ($('#cal_tab2 tr').length - 1);
}

function getTabinfo() {
    tabinfo = [];

    $('select.tab').each(function(i) {
        tabinfo[i] = $(this).get(0).selectedIndex;
    });
    return tabinfo;
}

function setTab() {
    var lengthoftab = $('#selectTest')[0].options.length + 1;
    var value = 'tab' + lengthoftab;
    var id = mxResources.get('grouping') + lengthoftab;
    var valueoption = "<option value='" + value + "'>" + id + "</option>";
    //console.log(valueoption);
    $(valueoption).appendTo("select.tab");
}

function setTabClear(size) {
    size =size|| getTabsize();
    var info = getTabinfo();
    if (info.length == 0) {
        return;
    }
    $('select.tab').empty();
    for (var i = 0; i < size; i++) {
        setTab();
    }
    $('select.tab').each(function(i) {
        if( info[i]==-1){
            info[i]=size-1;
        }
        $(this).get(0).selectedIndex = info[i];
    });
}
// function addChartGroup(size) {
//     var trinfo = "<tr><td width='30%' align='center'>" + mxResources.get('grouping')+size + "</td><td width='30%' align='center'><select class='btn btn-default btn-xs charttp' onchange='tableTypeChange("+size+")'><option value='line'>line</option>><option value='area'>area</option>><option value='column'>column</option>><option value='bar'>bar</option>><option value='scatter'>scatter</option></select></td></tr>";
//     ($('#cal_tab2 tr').eq(-1)).after(trinfo);
//     setTabClear(size);
// }
//参数表
function multiparamTable(container) {
  var addOLine = document.createElement('div');

  var selectLabel = document.createElement('label');
  mxUtils.write(selectLabel, mxResources.get('selectAppParamtable'));
  var selectApp = document.createElement('select');
  //selectApp.id='selectAppId';
  var paramObj = {};
  this.selectrow = {};
  var that = this;
  $.each(_task_ids, function(indx, value) {
    that.selectrow[indx] = 0;
    var paramList = mulitParamObj[value];
    for (var aKdy in paramList) {
      if (!paramObj[aKdy]) {
        paramObj[aKdy] = {
          head: [],
          data: []
        };
        var tmpList = [];
        tmpList.push(indx + 1);
        paramObj[aKdy]['head'].push(mxResources.get('Scenes'));
        for (var pKey in paramList[aKdy]) {
          paramObj[aKdy]['head'].push(pKey);
          tmpList.push(paramList[aKdy][pKey]);
        }
        paramObj[aKdy]['data'].push(tmpList)
      } else {
        var tmpList = [];
        tmpList.push(indx + 1);
        for (var pKey in paramList[aKdy]) {
          tmpList.push(paramList[aKdy][pKey]);
        }
        paramObj[aKdy]['data'].push(tmpList)
      }
    }
  });
  for (var aKey in paramObj) {
    var option = document.createElement('option');
    option.setAttribute('value', aKey);
    mxUtils.write(option, aKey);
    selectApp.appendChild(option);
  }
  selectApp.value = 'None';
  var table = document.createElement('table');
  table.id = 'paramTableID'
  container.appendChild(selectApp);
  this.ptable = null;

  var addSelectHandler = mxUtils.bind(this, function(elt, panel, index) {
    var selectHandler = mxUtils.bind(this, function(evt,flag) {
      //  $('#paramTableID').empty()
      if (this.ptable) {
        $('#paramTableID').DataTable().destroy();
        $('#paramTableID').empty()
      }
      if(flag){
        elt.value=Object.keys(paramObj)[0];
      }
      var tableData = paramObj[elt.value];
      var thead = document.getElementById('theadID');
      if (!thead) {
        thead = document.createElement('thead');
        thead.id = 'theadID';
        table.appendChild(thead);
      } else {
        $('#theadID').empty()
      }
      // var thead=document.createElement('thead');
      var tr = document.createElement('tr');
      var columns = [];
      for (var i = 0; i < tableData.head.length; i++) {
        var td = document.createElement('td');
        mxUtils.write(td, tableData.head[i]);
        var tmp = {
          "title": tableData.head[i]
        };
        columns.push(tmp);
        tr.appendChild(td);
      }
      thead.appendChild(tr);

      this.ptable = $('#paramTableID').dataTable({
        "data": tableData.data,
        "columns": columns,
        "scrollX": false,
        "scrollY": "200px",
        "destroy": true
      });
      $('#paramTableID tbody').on('click', 'tr', function() {
        var indx = this.rowIndex;
        $(this).toggleClass('selected');
        if (that.selectrow[indx - 1] == 0) {
          multiSelect++;
          setData(indx - 1, true);
          that.selectrow[indx - 1] = 1;
        } else {
          multiSelect--;
          setData(indx - 1, false);
          that.selectrow[indx - 1] = 0;
        }
      });
      var rows = $('#paramTableID tr');
      for (var sKey in this.selectrow) {

        if (this.selectrow[sKey] == 1) {
          $(rows[Number(sKey) + 1]).toggleClass('selected');
        }
      }
    });
    mxEvent.addListener(elt, 'change', selectHandler);
    selectHandler(null,1);
  })
  container.appendChild(table);
 
  this.init=function(){
     addSelectHandler(selectApp);
   // selectApp[0].selected=true;
  }
}

//获取曲线对应名称数据
function getNmapping(mapping) {
  mapping = mapping ? mapping : {};
  for (var i = 0; i < Charts.length; i++) {
    for (var j = 0; j < Charts[i].series.length; j++) {
      mapping[Charts[i].series[j].name] = {
        yData: Charts[i].series[j].yData,
        xData: Charts[i].series[j].xData,
      }
    }
  }
  return mapping;
}

//设置表格数据
var mulitMessage = {};
var seriesNameMapping={};
function setData(selectindx, flag) {
  // var index=selectMulit.value;
  var index = _task_ids[selectindx]
  if (!mulitMessage[_task_ids[selectindx]]) {

    var message = moreSimumessages[index];
    var channel = {};
    for (var indx = 0; indx < message.length; indx++) {
      if (message[indx].cmd == 'draw') {
        for (var x in message[indx]['data']) {
          channel[x] = channel[x] ? channel[x] : [];
          for (var i = 0, l = message[indx]['data'][x].length; i < l; i++) {
            channel[x].push(message[indx]['data'][x][i]);
          }
        }
      }
    }
    mulitMessage[index] = channel;
  } else {
    channel = mulitMessage[index];
  }
  for (var x in channel) {
    if (chartGrp[x]) {
      for (var en = 0; en < chartGrp[x].length; en++) {
        k = chartGrp[x][en]['chart'], s = chartGrp[x][en]['serie'];
        var chartname=charts[k][s].name;
        seriesNameMapping[x]=chartname
        if (flag) {
          var dataObj = {
              name: chartname + '.' + (selectindx+1),
              data: channel[x]
            }
            // Title.push(dataObj.name)
          Charts[k].addSeries(dataObj);
        } else {

          var length=Charts[k].series.length;
          for (var ind = 1; ind <= length; ind++) {
            if (Charts[k].series[ind].name == (seriesNameMapping[x] + '.' + (selectindx+1))) {
              Charts[k].series[ind].remove();
              break;
            }
          }

          //  var dataObj={name:x+'-'+this.selectedIndex,data:channel[x]}
          //  Charts[k].addSeries(dataObj);
        }
      }
    }

  }

}