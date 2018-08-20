/**
 * Created by wly on 2018/8/2.
 */
Viewchart={
    pointIds:'',
    chartId:'my_chart',
    /*创建chart*/
    createChart:function (points,viewDiv) {
        var html='';
        // html +='<div class="input-append date" id="stratTime" data-date="2018-02-01" data-date-format="yyyy-mm-dd"> <input class="span2" size="16" type="text" value="12-02-2012"> <span class="add-on"><i class="icon-th"></i></span> </div>';
        html +='<div style="margin-top: 10px;">';
        html +=' <label style="margin-left: 10px;">开始时间：</label>';
        html +='<input size="16" type="text"  id="stratTime" value="2012-06-15 14:45" readonly class="form_datetime" style="padding-left: 10px; height: 30px;line-height: 30px;border: 1px solid #e6e6e6;background-color: #fff;border-radius: 3px;">';
        html +=' <label>结束时间：</label>';
        html +='<input size="16" type="text"  id="endTime" value="2012-06-15 14:45" readonly class="form_datetime" style="padding-left: 10px; height: 30px;line-height: 30px;border: 1px solid #e6e6e6;background-color: #fff;border-radius: 3px;">';
        html +=' <button type="button" class="btn btn-primary" style="margin-left: 5px;" id="btn_ok" onclick="Viewchart.selectData()">查询</button>';
        html +='</div>';
        html +='<div id="my_chart" class="chart-content" style="padding-top: 20px;height:400px;width:100%;float: left;"></div>';
        var div= document.createElement("div");
        div.innerHTML = html;
        viewDiv.appendChild(div);
        $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});

        var recordids='';
        for(var index  in points){
            if(recordids){
                recordids +=","+points[index].id;
            }
            else {
                recordids +=points[index].id;
            }

        }
        this.pointIds=recordids;

        var date = new Date(); //获取当前时间
        var preDate=new Date(new Date(date.toLocaleDateString()).getTime());
        var time = this.GetDate(date.toString());
        var pretime = this.GetDate(preDate.toString());

        $("#stratTime").val(pretime);
        $("#endTime").val(time);


        var startdate=Date.parse(pretime);
        var enddate=Date.parse(time);
        var tbname="hdr_analog";
        this.getDatabyServer(tbname,recordids,startdate,enddate);

    },
    /*点击查询*/
    selectData:function () {
        var pretime= $("#stratTime").val();
        var time= $("#endTime").val();
        var recordids=this.pointIds;

        var startdate=Date.parse(pretime);
        var enddate=Date.parse(time);
        var tbname="hdr_analog";
        Viewchart.getDatabyServer(tbname,recordids,startdate,enddate);
    },
    /*获取历史数据并加载到chart图表中*/
    getDatabyServer:function (tbname,recordids,startdate,enddate) {
        var param = {
            "tbname":tbname,
            "recordids":recordids,
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
                    var  dataList= Viewchart.initDataList(data);
                    charts.initDataToChart(dataList,Viewchart.chartId);
                }


            }
        });
    },
    //加载测点数据
   initDataList:function(da) {
    var  list=[];
    for(var i=0;i<da.length;i++){
        var data = {};
        data.id = i;
        data.name = "" + da[i].recordid;
        data.count = da[i].count;
        data.recordid = da[i].recordid;
        data.data = [];
        data.ydata = [];
        for(var j=0;j<da[i].data.length;j++){
            var item = {};
            item.time =this.formatDate(new Date(da[i].data[j].time*1000))
            item.value =da[i].data[j].value;
            data.data.push(item);
            data.ydata.push(item.value);
        }

        list.push(data);

    }
    return list;
},
    //时间格式化
    formatDate: function (date) {
        //创建补0函数
        function p(s) {
            return s < 10 ? '0' + s : s;
        }
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + p(date.getHours()) + ":" + p(date.getMinutes()) + ":" + p(date.getSeconds());
    },
    //时间格式化
    GetDate:function(Ntime) {
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
    },
}