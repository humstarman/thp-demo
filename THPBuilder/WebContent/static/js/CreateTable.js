/**
 * Created by wly on 2018/8/2.
 */

CreateTable={
     TableID:'',
    ColumnsNum:[],
     Html:'',
    create_Table:function (tableName,viewDiv) {
        var param = {
            "type": "get_model"
        };
        var contentStr = JSON.stringify(param);
        mxUtils.post(settings.redisServerURL, contentStr, function(req){
            if(req.request && req.request.responseText ){
                if(req.request.responseText =="readValues failed"){
                    return;
                }
                var data = JSON.parse(req.request.responseText);
                var TablesColumn=[];
                var treelist = data.Setting.database;
                for (var q = 0; q < treelist.length; q++) {
                    var tables = treelist[q].table;
                    for (var i = 0; i < tables.length; i++) {
                        //中文名称
                        var tbaleName = tables[i].Alias;
                        //数据库存储名称
                        var tableEName = tables[i].path;
                        var cars = new Array();
                        var Ecars = new Array();
                        var Types = new Array();
                        for (var j = 0; j < tables[i].fields.length; j++) {
                            cars[j] = tables[i].fields[j].Desc;
                            Ecars[j] = tables[i].fields[j].Name;
                            Types[j] = tables[i].fields[j].DataType;
                        }
                        TablesColumn.push({
                            tablename: tbaleName,
                            tableEname: tableEName,
                            Columns: cars,
                            EColumns: Ecars,
                            ColumnTypes: Types
                        });
                    }

                }

                var html= CreateTable.CreateTableTitle(TablesColumn,tableName);
                var div= document.createElement("div");
                div.innerHTML = html;
                viewDiv.appendChild(div);
                // viewDiv.innerHTML +=html;
            }

        });
    },
    //4.获取表数据并创建表格
    get_tablemodel: function (tablename,pointID,viewDiv) {
        // var filter = new Array();
        // var item={name: "ID32", value: pointID, method: "=="};
        // filter.push(item);
        var filter = [{name: "ID32", value: pointID, method: "=="}];
        var param = {
            "type": "query_by_filter",
            "tbname":tablename,
            "begin":"0",
            "count":"0",
            "filter":filter
        };
        var contentStr = JSON.stringify(param);
        mxUtils.post(settings.redisServerURL, contentStr, function(req){
        // mxUtils.get("http://39.107.241.142:3501/webgis/conditionget_tablemodel", contentStr, function(req){
            if(req.request && req.request.responseText ){
                if(req.request.responseText =="readValues failed"){
                    return;
                }
                var data = JSON.parse(req.request.responseText);
                var html= CreateTable.CreateTableData(data.data);
                $('#' + tablename + ' tbody').html(html);
                // viewDiv.innerHTML +=html;
            }

        });


    },
    //3.创建列表表头
    CreateTableTitle: function (TablesColumn,TableName) {
        for (var i = 0; i < TablesColumn.length; i++) {
            if (TableName == TablesColumn[i].tableEname) {
                $("#contentTable").empty();
                var html = '<div class="table-box" style="overflow:auto;width:100%;margin-top: 20px;"   id=' + TablesColumn[i].tableEname + '> <table id="'+TableName+'" width="auto" style="white-space:nowrap;border-color:#0a0a0a;"> <thead> <tr>';
                // if(TableName=="SCADA_Analog" || TableName=="SCADA_Digit"  ){
                //
                // }
                for (var j = 0; j < TablesColumn[i].Columns.length; j++) {
                    html += '<th class="num">' + TablesColumn[i].Columns[j] + '</th>';
                }
                html += '</tr></thead> <tbody> </tbody> </table> </div>';
                this.TableID = TablesColumn[i].tableEname;
                // $('#contentTable').html(html);
                return html;
                break;

            }
        }

    },
    /*获取表中数据*/
    CreateTableData:function (data) {
        var html = "";
        if(data){
            for (var i = 0; i < data.length; i++) {
                if (i / 2 == 0 && i != 0) {
                    html += '<tr >';  //style="background-color: rgb(239, 246, 250);"
                } else {
                    html += '<tr>';
                }
                var content = data[i].record.split(',');
                // if(TableID=="SCADA_Analog" || TableID=="SCADA_Digit"){
                // }
                for (var j = 0; j < content.length; j++) {
                    //判断是否是数字类型
                    var  item=content[j];
                    if(item){
                        if(item.match(/^(-?\d+)(\.\d+)?$/) && !(item.match(/^-?\d+$/))){  //是浮点数
                            html += '<td>' + parseFloat(item).toFixed(2) + '</td>';
                        }
                        else if(item.match(/^-?\d+$/)){
                            //整数型
                            html += '<td>' +content[j]  + '</td>';
                        }
                        else if(item.length==1){
                            //只存在一个字符
                            html += '<td>' +content[j]  + '</td>';
                        }
                        else if(item.match(/^(\d{4})-(\d{2})-(\d{2})$/)){
                            // 是否是时间格式 style="text-align:left"/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/
                            var  date=this.formatDate(new Date(item));
                            html += '<td>' + date + '</td>';
                        }
                        else {
                            html += '<td style="text-align:left">' + content[j] + '</td>';
                        }

                    }
                    else {
                        html += '<td style="text-align:left">' + content[j] + '</td>';
                    }


                }
                html += '</tr>';
            }
        }
        return html;
        // $('#' + TableID + ' tbody').html(html);
        // $("#"+TableID+" tbody tr:nth-child(even)").css("background-color", " rgb(243, 243, 245)");
    },
    //时间格式化
    formatDate: function (date) {
        //创建补0函数
        function p(s) {
            return s < 10 ? '0' + s : s;
        }
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + p(date.getHours()) + ":" + p(date.getMinutes()) + ":" + p(date.getSeconds());
    },

}