/**
 * Created by wly on 2018/8/3.
 */
$(function () {
    var obj = JSON.parse(localStorage.getItem('obj_point'));
    if(objPoints){
        var btrue=false;
        for(var index in objPoints){
            if(objPoints[index].id==obj.id){
                btrue=true;
            }
        }
        if(!btrue){
            objPoints.push(obj);
        }
    }
    else {
        objPoints.push(obj);
    }
    //
    if(objPoints) {
        var html = '';
        for (var i = 0; i < objPoints.length; i++) {
            // if(objPoints[i].id==pointID){
            //     html +='<li class="ul_nav_li"><input type="checkbox" checked style="width: 15px;height: 15px;" value="'+objPoints[i].id+'" name="checked"/>'+objPoints[i].name+'</li>' ;
            // }
            // else {
            var name=objPoints[i].id;
            if(objPoints[i].name){
                name=objPoints[i].name;
            }
            html += '<li class="ul_nav_li"><input type="checkbox" checked style="width: 15px;height: 15px;" value="' + objPoints[i].id + '" name="checked"/>' + name + '</li>';
            // }

        }
        $('#ul_allpoints').html(html);
    }


    var date = new Date(); //获取当前时间
    var preDate=new Date(new Date(date.toLocaleDateString()).getTime());
    var time = GetDate(date.toString());
    var pretime = GetDate(preDate.toString());
    $('#date_start').val(pretime);
    $('#date_end').val(time);
    $('#date_start1').val(pretime);
    $('#date_end1').val(time);

    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});
    //点击查询
    $("#selected").on("click", function () {
        dataList = [];
        initchartData();
    });
    //点击查询
    $("#btn_selectedtable").on("click", function () {
        dataList = [];
        initTableData();
    });
    $("ul#myTab").on("click","li",function(){      //只需要找到你点击的是哪个ul里面的就行
        var tabid= $(this)[0].id;   //选中的id
        if(tabid =="mytab1"){
            initchartData();
        }
        else {
            initTableData();
        }


    });
    initchartData();

});
var objPoints=[];
var dataList=[];
var pageSize = 20;
var pageCount = 0;
var pageNum = 0;
//时间格式化
function GetDate(Ntime) {
    var str = Ntime;
    str = str.replace(/ GMT.+$/, '');// Or str = str.substring(0, 24)
    var d = new Date(str);
    var a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
    for (var i = 0, len = a.length; i < len; i++) {
        if (a[i] < 10) {
            a[i] = '0' + a[i];
        }
    }
    return str = a[0] + '-' + a[1] + '-' + a[2] + " " + a[3] + ":" + a[4] + ":" + a[5];
}

/*加载图表*/
function  initchartData() {
    var pretime= $("#date_start").val();
    var time= $("#date_end").val();
    var recordids="63";

    var startdate=Date.parse(pretime);
    var enddate=Date.parse(time);
    var tbname="hdr_analog";
    Viewchart.chartId="mychart1";
    Viewchart.getDatabyServer(tbname,recordids,startdate,enddate);
}

/*加载数据表格*/
function initTableData() {
    var pretime= $("#date_start1").val();
    var time= $("#date_end1").val();
    // var recordids="63";

    var startdate=Date.parse(pretime);
    var enddate=Date.parse(time);
    var tbname="hdr_analog";

    var pointIDs="";
    var checkeds= document.getElementById('ul_allpoints').getElementsByTagName('li');
    for(var i=0;i<checkeds.length;i++) {
        if(checkeds[i].getElementsByTagName("input")['checked'].checked) {
            if(pointIDs){
                pointIDs +=",";
            }
            pointIDs +=checkeds[i].getElementsByTagName("input")['checked'].value;
        }

    }

    var param = {
        "tbname":tbname,
        "recordids":pointIDs,
        "begintime": startdate/1000,
        "endtime": enddate/1000,
        "intervaltime":1,
        "datatype":2
    };
    var contentStr = JSON.stringify(param);
    mxUtils.post(settings.hbaseServerURL, contentStr, function(req) {
        if(req && req.request && req.request.responseText ){
            var data = JSON.parse(req.request.responseText);
            if(data){
                dataList= Viewchart.initDataList(data);
                getDetail(1,pageSize);
            }


        }
    });

}
//分页
function getDetail(pageIndex, pageSize) {
    pageNum = pageIndex;
    var pageinNum = (pageNum - 1) * pageSize;
    var pagelength = pageinNum + pageSize;
    if (pagelength > dataList[0].data.length) {
        pagelength = dataList[0].data.length;
    }
    if (dataList[0].data) {
        var pagePoints = [];
        for (var i = pageinNum; i < pagelength; i++) {
            pagePoints.push(dataList[0].data[i]);
        }
        $('#tablePoints tbody').html("");
        viewPoints(pagePoints, dataList[0].recordid);

        //页面显示页码的个数
        var pageindexNum = 5;
        //总共多少页
        pageCount = Math.ceil(dataList[0].data.length / pageSize) || 1;
        //页面显示页数的第一个
        var beginpage = pageIndex;
        //页面显示页数的最后一个
        var endPage = beginpage + pageindexNum - 1;
        if (endPage > pageCount) {
            endPage = pageCount;
        }
        var pages = '';
        pages += '<a href="#" onclick="previouspage()">&laquo;</a>';
        for (var i = beginpage; i <= endPage; i++) {
            if (i == pageIndex) {
                pages += '<li><a href="#" class="page" onclick="getDetail(' + i + ',' + pageSize + ')">' + i + '</a></li>';
            } else {
                pages += '<li></li><a href="#" onclick="getDetail(' + i + ',' + pageSize + ')">' + i + '</a></li>';
            }
        }
        pages += '<a href="#" onclick="nextpage()">&raquo;</a>';
        pages += '<li class="all-pages">共' + pageCount + '页</li>';
        $("#pageGro").html(pages);
    }
}

//把测点的历史数据加载到页面中
function viewPoints(data, recordid) {
    var count = data.length;  //总条数
    var html = '';
    for (var i = 0; i < data.length; i++) {
        // var item = {};
        // item.time = formatDate(new Date(data[i].time * 1000));
        // item.value = data[i].value;
        html += '<tr>'
        html += '<td style="width: 120px;">' + i + '</td>';
        html += '<td>测点' +recordid + '</td>';
        html += '<td>' + data[i].time + '</td>';
        html += '<td>' + data[i].value + '</td>';
        html += '</tr>'
    }
    $('#tablePoints tbody').html(html);

}