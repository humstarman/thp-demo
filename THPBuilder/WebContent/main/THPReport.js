/**
 * Created by admin on 2018/8/13.
 */

//基于Handsontable的报表工具
//吴观辉
// 2018.08.01
//北京

//project
var proid;

//report data
var rtdatas;

// 列出全局变量
var hot;
var Crow, Ccol, Ccell, valT;
var selectRange, selectRangeArr = [];
var settingArr=[];
var rowSizeArr=[];
var colSizeArr=[];

//初始化最小行和最小列
var minRows=1, minCols=1;
var startRows=40, startCols=26;

//类型列表
var rttypes=["日报表", "月报表", "年报表"];

//模板列表
var rttemplates;

//报表列表
var rtspreadsheets;

//报表列表
var rtsheets;

//= JSON.parse(localStorage.getItem('rttemplates'));
//= JSON.parse(localStorage.getItem('rtspreadsheets'));
//= JSON.parse(localStorage.getItem('rtsheets'));

//KEY ID
var selecttemplateId;
var selectspreadsheetId;
var selectsheetId;

//localstorage variable
const rtinfor={
    rtsize: '',      //[rows, columns]
    rtdata: '',      //data
    rtmcell: '',     //mergecells
    rtsetting: '',   //settings include font \ color \ align
    rtrowsize: '',   //rowsize :  max, 500
    rtcolsize: ''    //rolsize :  max, 500
}

var saveastype;

//init mock
$(function () {
	/*
    Mock.mock('http://thp.cn/gettemplates',[
            {"key": "day-1", "value": "日报表"},
            {"key": "month-2", "value": "月报表"}
        ]);

    Mock.mock('http://thp.cn/getspreadsheets',[
        {"key": "day-123", "value": "长隆集团电力日报表"},
        {"key": "month-123", "value": "横琴能源公司供冷月报表"}
    ]);
    */
});

$(function () {

    $("#tabs").tabs();  

    //Template
    $("#myTypes").selectpicker({width: "100px"});
    $("#myTemplates").selectpicker({width: "200px"});
    
    //init Types
    for (var i = 0; i < 3; i++) {
    	$("#myTypes").append("<option value='" + i + "'>" + rttypes[i] + "</option>");
    }
    $("#myTypes").selectpicker('refresh');
    
    //add click event
    $('#myTypes').on('hidden.bs.select', function (e) {
        
    	//Template list
    	refreshTemplate();
    	
    	//Spreadsheet list
    	refreshSpreadsheet();
    	
        //var val = $(this).val();
        //setCellStyle("font-size", val+"pt");
    });
    
    
    //init Types
    for (var i = 0; i < 3; i++) {
    	$("#report_types").append("<option value='" + i + "'>" + rttypes[i] + "</option>");
    }
    $("#report_types").selectpicker('refresh');
    
    //init Templates List
    refreshTemplate();

    
    //init Spreadsheet List
    refreshSpreadsheet();
    
    //init Sheets List
    $("#mySheets").selectpicker({width: "200px"});
    refreshSheet();
        
    
    //////////////////////////////////////////////////////////////////////////
    //toolbar
    $("#myRow").val(startRows);
    
    $("#myCol").val(startCols);
    
    //init selectpicker
    for (var i = 8; i < 100; i++) {
        $("#mySize").append("<option value='" + i + "'>" + i + "</option>");
    }
    $("#mySize").selectpicker({width: "60px"});

    $(".colorStyle input").each(function () {
        $(this).colorpicker();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // the event of handsontable

    container = document.getElementById('dataTable');

    var customRenderer = function (instance, td, row, col, prop, value, cellProperties) {
        // Optionally include `BaseRenderer` which is responsible for adding/removing CSS classes to
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        // ...your custom logic of the renderer
        // $(td).css("text-align", cel[k].align);
        //$(td).css("vertical-align", cel[k].valign);
        //td.style.backgroundColor = 'green';

        for(var i = 0;i < settingArr.length;i++){
            if(settingArr[i].row==row && settingArr[i].col==col){
                $(td)[0].className = settingArr[i].className;
                $(td)[0].style.cssText = settingArr[i].cssText;
                break;
            }
        }
    };

    // Register an alias
    //Handsontable.renderers.registerRenderer('my.customsettings', customRenderer);

    settings={
        //Minimum number of rows. At least that number of rows will be created during initialization.
        minRows: minRows,
        minCols: minCols,
        //This option only has effect in Handsontable constructor and only if data option is not provided
        startRows: startRows,
        startCols: startCols,
        language:'zh-CN',
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true,
        mergeCells: true,
        manualRowResize: true,
        manualRowMove: true,
        manualColumnResize: true,
        manualColumnMove: true,
        //manualColumnFreeze: true,
        comments:false,
        dropdownMenu: true,
        useFormula: true,
        cells: function (row, col, prop) {
            var cellProperties = {};
            cellProperties.renderer = customRenderer;
            return cellProperties;
        },
        rowHeights: function(index) {
            if(rowSizeArr != null) {
                for (var i = 0; i < rowSizeArr.length; i++) {
                    if (rowSizeArr[i].index == index) {
                        return rowSizeArr[i].newSize;
                    }
                }
            }
            //return index * 10;
        },
        colWidths: function(index) {
            if(colSizeArr != null) {
                for (var i = 0; i < colSizeArr.length; i++) {
                    if (colSizeArr[i].index == index) {
                        return colSizeArr[i].newSize;
                    }
                }
            }

            //return index * 10;
        }

        /*
         onChange: function (data, source) {
         if (source === 'loadData') {
         return; //don't show this change in console
         }
         $("#myconsole").text(JSON.stringify(data));
         }
        */

    };

    hot =new Handsontable(container, settings);

    ///////////////////////////////Plugins
//        AutoColumnSize
//        AutoRowSize
//        Autofill
//        ColumnSorting
//        Comments
//        ContextMenu
//        CopyPaste
//        DragToScroll
//        ManualColumnFreeze
//        ManualColumnMove
//        ManualColumnResize
//        ManualRowMove
//        ManualRowResize
//        MergeCells
//        ObserveChanges
//        Search
//        UndoRedo

    ///////////////////////////////Hooks
//        Change: afterChange
//        Render: afterRender, afterRenderer

    //获取所选区域单元格数组
    hot.addHook('afterSelectionEnd', function (r, c, r2, c2, preventScrolling, selectionLayerLevel) {
        // setting if prevent scrolling after selection
        //preventScrolling.value = true;

        selectRangeArr = []; // 所选区域所有单元格数组
        selectRange = hot.getSelected()[0]; // 获取所选区域范围
        //console.log(selectRange);

        var rangeRowArr = []; // 所选区域行数组
        var rangeColArr = []; // 所选区域列数组
        for( var i=selectRange[0];i<selectRange[2]+1;i++ ){
            rangeRowArr.push(i);
        }
        for( var i=selectRange[1];i<selectRange[3]+1;i++ ){
            rangeColArr.push(i);
        }
        for( var i=0;i<rangeRowArr.length;i++ ){
            for( var n=0;n<rangeColArr.length;n++ ){
                var selectRangeCell = { row:rangeRowArr[i],col:rangeColArr[n] };
                selectRangeArr.push(selectRangeCell);
            }
        }

        //R + C
        $('#myInfor').val(hot.getColHeader(c)+hot.getRowHeader(r));

        // 添加表格失去焦点时的当前单元格类
        //$("td").removeClass("currentTd");
        //for( var i=0;i<selectRangeArr.length;i++ ){
        //    var rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
        // $(rangeCell).addClass("currentTd");
        //    hot.render();
        //}
    });

    // 获取鼠标点击单元格 当前高亮
    hot.addHook('afterOnCellMouseDown', function (event, cellCoords) {
        Crow = cellCoords.row;
        Ccol = cellCoords.col;
        Ccell = hot.getCell(Crow, Ccol);

        valT = hot.getDataAtCell(Crow,Ccol); // 获取所点单元格值

        $("#myInput").val(valT);

        // 单击任意单元格取消编辑状态
        $(".handsontableInputHolder").css({
            "display":"none"
        });
    });

    //Size
    hot.addHook('afterRowResize', function(currentRow, newSize, isDoubleClick){
        //console.log("RowResize: " + currentRow+ ": " +newSize);
        //save rowSize
        var setCell;
        var x = ifArrSize(rowSizeArr, currentRow);
        if(x>=0)rowSizeArr.splice(x, 1);
        setCell= {  index: currentRow, newSize: newSize};
        rowSizeArr.push(setCell);
    });

    hot.addHook('afterColumnResize', function(currentColumn, newSize, isDoubleClick){
        //console.log("ColumnResize: " + currentColumn+ ": " + newSize);
        //save rowSize
        var setCell;
        var x = ifArrSize(colSizeArr, currentColumn);
        if(x>=0)colSizeArr.splice(x, 1);
        setCell= {  index: currentColumn, newSize: newSize};
        colSizeArr.push(setCell);
    });

    //afterSetCellMeta
    hot.addHook('afterSetCellMeta', function (row, col, key, value) {
        //console.log(key +": " +value + "-" + );
        if(key!="className"){
            return;
        }

        //save className
        var setCell;
        var x = ifArrVal(settingArr, row, col);
        if(x>=0)
        {
            setCell = settingArr[x];
            setCell.className = value;

            settingArr.splice(x, 1);
        }else
        {
            setCell = {  row: row, col: col, className: value, cssText: ''};
        }
        settingArr.push(setCell);
    });

    //多维数组判断是否存在某值
    function ifArrSize(arr, index){
        for(var i = 0;i < arr.length;i++){
            if(arr[i].index==index){
                return i; //存在
            }
        }
        return -1;//不存在
    }

    //多维数组判断是否存在某值
    function ifArrVal(arr, row, col){
        for(var i = 0;i < arr.length;i++){
            if(arr[i].row==row && arr[i].col==col){
                return i; //存在
            }
        }
        return -1;//不存在
    }

    //同步input 与 cell
    $("#myInput").keyup(function(){
        valT = $(this).val();
        if(selectRangeArr.length>0){
            for( var i=0;i<selectRangeArr.length;i++ ){
                hot.setDataAtCell(selectRangeArr[i].row, selectRangeArr[i].col, valT)
            }
        }
    });

    $("#myRow").blur(function(){
        var newRows = parseInt($(this).val());
        var currentRows = hot.countRows();

        if(newRows<minRows)
        {
            $(this).val(minRows);
            newRows = minRows;
        }

        if(newRows ==currentRows )return;

        //See grid.alter for possible values: "insert_row", "insert_col", "remove_row", "remove_col"
        //alter(action, index, amount, source, keepEmptyRows)
        if(newRows>currentRows)
        {
            hot.alter('insert_row', null, newRows-currentRows);
        }else
        {
            hot.alter('remove_row', null, currentRows-newRows);
        }
    });

    $("#myCol").blur(function(){
        var newCols = parseInt($(this).val());
        var currentCols = hot.countCols();

        if(newCols<minCols) {
            $(this).val(minCols);
            newCols = minCols;
        }

        if(newCols ==currentCols )return;

        if(newCols>currentCols)
        {
            hot.alter('insert_col', null, newCols-currentCols);
        }else
        {
            hot.alter('remove_col', null, currentCols-newCols);
        }


    });

    // 修改单元格样式
    //setCellMeta
    //key: cellClass, bkColor, ftColor, bdColor
    // 修改所选区域所有单元格样式并赋予属性
    function setCellStyle(key, val)
    {
        var toggleSwitch = true;

        var changeCellStyle = function(){

            //bold italic decoration: need normal
            if(key=="font-weight" && $(rangeCell).css("font-weight")=="700") val="400";
            if(key=="font-style" && $(rangeCell).css("font-style")=="italic") val="normal";
            if(key=="text-decoration" && $(rangeCell).css("text-decoration").indexOf("underline")>=0) val="none";

            switch(key) {
                case "font-size":
                    $(rangeCell).css({"font-size": val});
                    break;
                case "font-weight":
                    $(rangeCell).css({"font-weight": val});
                    break;
                case "font-style":
                    $(rangeCell).css({"font-style": val});
                    break;
                case "text-decoration":
                    $(rangeCell).css({"text-decoration": val});
                    break;
                case "background":
                    $(rangeCell).css({"background": val});
                    break;
                case "color":
                    $(rangeCell).css({"color": val});
                    break;
                case "border":
                    $(rangeCell).css({"border": val});
                    break;
                default :
                    break;
            }

        };

        for( var i=0;i<selectRangeArr.length;i++ ){
            var rangeRow = selectRangeArr[i].row;
            var rangeCol = selectRangeArr[i].col;
            var rangeCell = hot.getCell(rangeRow, rangeCol);
            var checkMergeCell = $(rangeCell).attr("rowspan");

            if( checkMergeCell != undefined ){
                if( toggleSwitch ){
                    changeCellStyle();
                    toggleSwitch = false;
                }else{
                    continue;
                }
            }else{
                changeCellStyle();
            }

            //save cssText
            var setCell;
            var rangeSet = $(rangeCell)[0].style.cssText;
            //console.log($(rangeCell)[0].style.cssText);

            var x = ifArrVal(settingArr, rangeRow, rangeCol);
            if(x>=0)
            {
                setCell=settingArr[x];
                setCell.cssText = rangeSet;

                settingArr.splice(x, 1);

            }else {
                setCell= {  row: rangeRow, col: rangeCol, className: '', cssText: rangeSet };
            }

            settingArr.push(setCell);
        }
    }

    //Font Size
    $('#mySize').on('hidden.bs.select', function (e) {
        // 修改单元格文本大小
        var val = $(this).val();
        setCellStyle("font-size", val+"pt");
    });

    $("#myBold").click(function(e){
        //normal bold bolder lighter 100-200...800-900 inherit
        //400==normal 700=bold
        setCellStyle("font-weight", "700");
    });

    $("#myItalic").click(function(e){
        //normal italic oblique
        setCellStyle("font-style", "italic");
    });

    $("#myUnderline").click(function(e){
        //none underline overline line-through blink inherit
        setCellStyle("text-decoration", "underline");
    });

    //Color blur
    $(".colorStyle input").blur(function(){
        var val = $(this).val();
        var _index = $(this).index();

        $(this).css("cssText", "background:"+val+"!important;color:"+val+"!important;");

        if( _index == 1 ){
            setCellStyle("background", val);
        }
        if( _index == 3 ){
            setCellStyle("color", val);
        }
        if( _index == 5 ){
            setCellStyle("border", "solid 1px "+val);
        }
    });

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//the event of buttons  for Template editor

//refresh template list
function refreshTemplate()
{
    $("#myTemplates").empty();    
    
    var val = $("#myTypes").val();

    $.ajax({
        type:"post",
        url:"/THPBuilder/getAllTemplates",
        async:true,
        success:function(data){

            //console.log(data);
        	
        	datajson = $.parseJSON(data);
            
            rttemplates=datajson.rows;
            
            $("#myTemplates").append("<option value='-1'>请选择...</option>"); 
            
            //init templates list
            rttemplates.forEach(function(value, index, array){
                //第一个参数是遍历的数组内容，第二个参数是对应的数组索引，第三个参数是数组本身
                //code something
            	if (parseInt(val)== value.templateType)
        		{
                    $("#myTemplates").append("<option value='"+ index +"'>"+ value.templateName+"</option>");        		
        		}
            });

            $("#myTemplates").selectpicker('refresh');
            
            //console.log(idata);
        }
    });
}


//load template
function importTemplate()
{
	selecttemplateId = $('#myTemplates').val();

	if(selecttemplateId==undefined ||selecttemplateId==null ||selecttemplateId == -1)
	{
		alert("请选择报表模板！");
		return;	
	}
	
    //load data
    //var data1 = JSON.parse(localStorage.getItem('rtinfor'));
    var data1 = JSON.parse(rttemplates[selecttemplateId].templateContent);

    if (data1!=null)
    {
        //data
        rtdatas = data1.rtdata;

        var sRows = rtdatas.length;
        var sCols = rtdatas[0].length;
        $("#myRow").val(sRows);
        $("#myCol").val(sCols);


        //set mergecells
        var inst_mergeCells = hot.getPlugin("mergeCells");
        data1.rtmcell.forEach(function (value, index, array) {
            inst_mergeCells.merge(value.row, value.col, value.row + value.rowspan - 1, value.col + value.colspan - 1);
        });

        //Setting
        settingArr = data1.rtsetting;

        //Size
        rowSizeArr =  data1.rtrowsize?data1.rtrowsize:[];
        colSizeArr = data1.rtcolsize?data1.rtcolsize:[];        

        hot.loadData(rtdatas);
        
        //stats
        var val = rttemplates[selecttemplateId].templateStats;
        val = (val+"0000").substr(0,4);
        $("#myMax").prop("checked", val.substr(0,1)=="1"? true: false);
        $("#myMin").prop("checked", val.substr(1,1)=="1"? true: false);
        $("#myAvg").prop("checked", val.substr(2,1)=="1"? true: false);
        $("#mySum").prop("checked", val.substr(3,1)=="1"? true: false);
        
        $("#myStarttime").val(rttemplates[selecttemplateId].templateStartTime);
        $("#myEndtime").val(rttemplates[selecttemplateId].templateEndTime);

		$("#txt_name").val(rttemplates[selecttemplateId].templateName+"new");
        
    }

    /*
     hot.updateSettings({
     cells: [ {
     renderer: 'my.customsettings'
     }]
     });
     */

    // Access to the Comments plugin instance:
    //const commentsPlugin = hot.getPlugin('comments');

    // Manage comments programmatically:
    //commentsPlugin.setCommentAtCell(1, 6, 'Comment contents');
    //commentsPlugin.showAtCell(3, 1);
    //commentsPlugin.removeCommentAtCell(1, 6);

    //cells: function (row, col, prop) {
    //var cellProperties = {};
    //var visualRowIndex = this.instance.toVisualRow(row);
    //var visualColIndex = this.instance.toVisualColumn(col);
    //cellProperties.readOnly = true;
    //cellProperties.className = "htCenter";
    //return cellProperties;
    //}

//        //delete key
//        localStorage.removeItem('key');
//        //delete all
//        localStorage.clear();
//        //listener
//        window.addEventListener('storage', function (e) {
//            console.log('key', e.key);
//            console.log('oldValue', e.oldValue);
//            console.log('newValue', e.newValue);
//            console.log('url', e.url);
//        });

}

//save template
function saveTemplate()
{
	if(selecttemplateId==undefined ||selecttemplateId==null ||selecttemplateId == -1)
	{
		alert("请选择报表模板！");
		return;	
	}
	
	if(window.confirm('确定更新当前报表模板吗？'))
	{	    
		saveInfor();
	    
		saveastype = "template";		
        
        saveToSQL();        
	}
    
}

function deleteTemplate()
{	
	if(selecttemplateId==undefined ||selecttemplateId==null ||selecttemplateId == -1)
	{
		alert("请选择报表模板！");
		return;	
	}
	
	if(window.confirm('确定删除当前报表模板吗？'))
	{
	    $.ajax({
	        type:"post",
	        url:"/THPBuilder/deleteTemplate",
	        data: {templateid: rttemplates[selecttemplateId].templateId},
			dataType : 'json',
	        async:true,
	        success:function(data){	
	        	
	            //console.log(data); 

	        	refreshTemplate();  
	            
	            hot.clear();
	        	
	    	    $("#myOKLabel").text("系统提示");
	    	    $('#myOK').modal();	            
	        }
	    });
	
	}
	
}

//print template
function printTemplate()
{
    var mode = 'iframe';
    var close = false;
    var extraCss = "";
    var print = "";
    var keepAttr = [];
    var headElements = "";

    var options = {
        mode : mode,
        popClose : close,
        extraCss : extraCss,
        retainAttr : keepAttr,
        extraHead : headElements
    };

//            hot.updateSettings({
//                rowHeaders: false,
//                colHeaders: false
//            });

    $("#dataTable").printArea(options);

    //pro
    //var hiddenRowsPlugin = hot.getPlugin('hiddenRows');
    //hiddenRowsPlugin.hideRows(9);
    //hot.render();

//            hot.updateSettings({
//                rowHeaders: true,
//                colHeaders: true
//            });

}



// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// the event of buttons for Spreadsheet editor

// refresh Spreadsheet list
function refreshSpreadsheet() {
	$("#mySpreadsheets").empty();
	
	var val = $("#myTypes").val();

	$.ajax({
		type : "post",
		url : "/THPBuilder/getAllSheets",
		async : true,
		success : function(data) {

			// console.log(data);

			datajson = $.parseJSON(data);

			rtspreadsheets = datajson.rows;

			$("#mySpreadsheets").append("<option value='-1'>请选择...</option>");

			// init templates list
			rtspreadsheets.forEach(function(value, index, array) {
				// 第一个参数是遍历的数组内容，第二个参数是对应的数组索引，第三个参数是数组本身
				// code something
				if (parseInt(val) == value.sheetType) {
					$("#mySpreadsheets").append(
							"<option value='" + index + "'>"
									+ value.sheetName + "</option>");
				}
			});

			$("#mySpreadsheets").selectpicker('refresh');

			// console.log(idata);
		}
	});
}

// load Spreadsheet
function importSpreadsheet() {
	selectspreadsheetId = $('#mySpreadsheets').val();

	if (selectspreadsheetId == undefined || selectspreadsheetId == null
			|| selectspreadsheetId == -1) {
		alert("请选择报表模板！");
		return;
	}

	// load data
	// var data1 = JSON.parse(localStorage.getItem('rtinfor'));
	var data1 = JSON.parse(rtspreadsheets[selectspreadsheetId].sheetContent);

	if (data1 != null) {
		// data
		rtdatas = data1.rtdata;

		var sRows = rtdatas.length;
		var sCols = rtdatas[0].length;
		$("#myRow").val(sRows);
		$("#myCol").val(sCols);

		// set mergecells
		var inst_mergeCells = hot.getPlugin("mergeCells");
		data1.rtmcell.forEach(function(value, index, array) {
			inst_mergeCells.merge(value.row, value.col, value.row
					+ value.rowspan - 1, value.col + value.colspan - 1);
		});

		// Setting
		settingArr = data1.rtsetting;

		// Size
		rowSizeArr = data1.rtrowsize ? data1.rtrowsize : [];
		colSizeArr = data1.rtcolsize ? data1.rtcolsize : [];

		hot.loadData(rtdatas);

		// stats
		var val = rtspreadsheets[selectspreadsheetId].sheetStats;
		val = (val + "0000").substr(0, 4);
		$("#myMax").prop("checked", val.substr(0, 1) == "1" ? true : false);
		$("#myMin").prop("checked", val.substr(1, 1) == "1" ? true : false);
		$("#myAvg").prop("checked", val.substr(2, 1) == "1" ? true : false);
		$("#mySum").prop("checked", val.substr(3, 1) == "1" ? true : false);

		$("#myStarttime").val(rtspreadsheets[selectspreadsheetId].sheetStartTime);
		$("#myEndtime").val(rtspreadsheets[selectspreadsheetId].sheetEndTime);
		
		$("#txt_name").val(rtspreadsheets[selectspreadsheetId].sheetName+"new");

	}

	/*
	 * hot.updateSettings({ cells: [ { renderer: 'my.customsettings' }] });
	 */

	// Access to the Comments plugin instance:
	// const commentsPlugin = hot.getPlugin('comments');
	// Manage comments programmatically:
	// commentsPlugin.setCommentAtCell(1, 6, 'Comment contents');
	// commentsPlugin.showAtCell(3, 1);
	// commentsPlugin.removeCommentAtCell(1, 6);
	// cells: function (row, col, prop) {
	// var cellProperties = {};
	// var visualRowIndex = this.instance.toVisualRow(row);
	// var visualColIndex = this.instance.toVisualColumn(col);
	// cellProperties.readOnly = true;
	// cellProperties.className = "htCenter";
	// return cellProperties;
	// }
	// //delete key
	// localStorage.removeItem('key');
	// //delete all
	// localStorage.clear();
	// //listener
	// window.addEventListener('storage', function (e) {
	// console.log('key', e.key);
	// console.log('oldValue', e.oldValue);
	// console.log('newValue', e.newValue);
	// console.log('url', e.url);
	// });
}

// save Spreadsheet
function saveSpreadsheet() {
	if (selectspreadsheetId == undefined || selectspreadsheetId == null
			|| selectspreadsheetId == -1) {
		alert("请选择报表！");
		return;
	}

	if (window.confirm('确定更新当前报表模板吗？')) {
		saveInfor();

		saveastype = "spreadsheet";

		saveToSQL();
	}

}

//delete Spreadsheet
function deleteSpreadsheet() {
	if (selectspreadsheetId == undefined || selectspreadsheetId == null
			|| selectspreadsheetId == -1) {
		alert("请选择报表！");
		return;
	}

	if (window.confirm('确定删除当前报表模板吗？')) {
		$.ajax({
			type : "post",
			url : "/THPBuilder/deleteSheet",
			data : {
				sheetid : rtspreadsheets[selectspreadsheetId].sheetId
			},
			dataType : 'json',
			async : true,
			success : function(data) {

				//console.log(data);

				refreshSpreadsheet();

				hot.clear();

				$("#myOKLabel").text("系统提示");
				$('#myOK').modal();
			}
		});

	}

}

// print Spreadsheet
function printSpreadsheet() {
	var mode = 'iframe';
	var close = false;
	var extraCss = "";
	var print = "";
	var keepAttr = [];
	var headElements = "";

	var options = {
		mode : mode,
		popClose : close,
		extraCss : extraCss,
		retainAttr : keepAttr,
		extraHead : headElements
	};

	// hot.updateSettings({
	//rowHeaders: false,
	//colHeaders: false
	//});

	$("#dataTable").printArea(options);

	//pro
	//var hiddenRowsPlugin = hot.getPlugin('hiddenRows');
	//hiddenRowsPlugin.hideRows(9);
	//hot.render();

	//hot.updateSettings({
	//rowHeaders: true,
	//colHeaders: true
	//});

}

function saveAsSheet()
{
	saveastype = "sheet";
	
	saveInfor();

    $("#myModalLabel").text("输入信息：");

    $('#myModal').modal();   
}

///////////////////////////////////////////////////////////////////////////////////////////
// public function for template and spreadsheet shared

//clear content
function clearContent()
{
    if(window.confirm('你确定清空吗？')){
    	
    	selecttemplateId = -1;   
    	
    	selectspreadsheetId = -1;    	
    	
        //alert("确定");
        classArr = [];
        settingArr = [];

        hot.clear();
    }
}

//save template
function saveAsTemplate()
{
	saveastype = "newtemplate";	

	saveInfor();

    $("#myModalLabel").text("输入信息：");
    $('#myModal').modal();

}

function saveAsSpreadsheet()
{
	saveastype = "newspreadsheet";
	
	saveInfor();

    $("#myModalLabel").text("输入信息：");

    $('#myModal').modal();   

}

function saveInfor()
{
	//size
    rtinfor.rtsize = [hot.countRows(), hot.countCols()];

    //data
    rtinfor.rtdata=hot.getData();

    //get mergeCells
    var inst_mergeCells = hot.getPlugin("mergeCells");
    var arr_mergeCells = inst_mergeCells.mergedCellsCollection.mergedCells;
    rtinfor.rtmcell = arr_mergeCells;

    //settings
    rtinfor.rtsetting = settingArr;

    //size
    rtinfor.rtrowsize = rowSizeArr;
    rtinfor.rtcolsize = colSizeArr;    

    //localStorage.setItem('rtinfor', JSON.stringify(rtinfor)); 

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//the event of buttons for modal dialog

function saveToSQL()
{	
	if (saveastype=="template")
	{	
		//Template  ----> Template 
	    rttemplates[selecttemplateId].templateContent = JSON.stringify(rtinfor);		  
        
        rttemplates[selecttemplateId].templateStats = getstats();
        rttemplates[selecttemplateId].templateStartTime =$("#myStarttime").val()
        rttemplates[selecttemplateId].templateEndTime =$("#myEndtime").val();	
        
	    $.ajax({
	        type:"post",
	        url:"/THPBuilder/updateTemplate",
	        data: rttemplates[selecttemplateId],
			dataType : 'json',
	        async:true,
	        success:function(data){	
	            //console.log(data); 
	        	
	    	    $("#myOKLabel").text("系统提示");
	    	    $('#myOK').modal();	            
	        }
	    });	 
		
	}else if (saveastype=="newtemplate")
	{
		//Template  ----> new Template 
		var newname =$("#txt_name").val().trim();
		if(newname==undefined ||newname==null || newname=="" )
		{
			alert("请输入名称！");	
			return;
		}		
		
		var newtemplate = rttemplates[selecttemplateId];

		//newtemplate.proId; 
		
		newtemplate.templateKey = NewGuid();
		
		newtemplate.templateType = $("#report_types").val();
		
		newtemplate.templateName = newname;
		
		newtemplate.templateContent = JSON.stringify(rtinfor);
		          
        newtemplate.templateStats = getstats();
        newtemplate.templateStartTime =$("#myStarttime").val()
        newtemplate.templateEndTime =$("#myEndtime").val();  
        newtemplate.templateCreateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        
        //
        $.ajax({
	        type:"post",
	        url:"/THPBuilder/insertTemplate",
	        data: newtemplate,
			dataType : 'json',
	        async:true,
	        success:function(data){	
	            //console.log(data);   

	        	refreshTemplate();  
	            
	    	    $("#myOKLabel").text("系统提示");
	    	    $('#myOK').modal();	 
	        }
	    });	 
        
	
	}else if (saveastype=="spreadsheet")
	{
		//Spreadsheet  ----> Spreadsheet 
		rtspreadsheets[selectspreadsheetId].sheetContent = JSON.stringify(rtinfor);
		
        rtspreadsheets[selectspreadsheetId].sheetStats = getstats();
        rtspreadsheets[selectspreadsheetId].sheetStartTime =$("#myStarttime").val()
        rtspreadsheets[selectspreadsheetId].sheetEndTime =$("#myEndtime").val(); 
        
        //
        $.ajax({
	        type:"post",
	        url:"/THPBuilder/updateSheet",
	        data: rtspreadsheets[selectspreadsheetId],
			dataType : 'json',
	        async:true,
	        success:function(data){	
	            //console.log(data);   

	        	refreshSpreadsheet();  
	            
	    	    $("#myOKLabel").text("系统提示");
	    	    $('#myOK').modal();	 
	        }
	    });	
        
	}else if (saveastype=="newspreadsheet")
	{
		//Template  ----> new Spreadsheet 
		var newname =$("#txt_name").val().trim();
		if(newname==undefined ||newname==null || newname=="" )
		{
			alert("请输入名称！");	
			return;
		}		
		
		var newtemplate = rttemplates[selecttemplateId];
		
		//json data
		var newspreadsheet={};
		
		//newspreadsheet.sheetId = "1";
		newspreadsheet.proId = newtemplate.proId;
		newspreadsheet.sheetKey = NewGuid();
		newspreadsheet.sheetType = $("#report_types").val();
		newspreadsheet.sheetName = newname;
		newspreadsheet.sheetContent = JSON.stringify(rtinfor);		
        
        newspreadsheet.sheetStats = getstats();
        newspreadsheet.sheetStartTime =$("#myStarttime").val()
        newspreadsheet.sheetEndTime =$("#myEndtime").val();  
        newspreadsheet.sheetCreateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        
        //
        $.ajax({
	        type:"post",
	        url:"/THPBuilder/insertSheet",
	        data: newspreadsheet,
			dataType : 'json',
	        async:true,
	        success:function(data){	
	            //console.log(data);   

	        	//refreshSpreadsheet(); 
	            
	    	    $("#myOKLabel").text("系统提示");
	    	    $('#myOK').modal();	 
	        }
	    });	  		
		
	}else if (saveastype=="sheet")
	{
		//Spreadsheet  ----> new Spreadsheet 
		var newname =$("#txt_name").val().trim();
		if(newname==undefined ||newname==null || newname=="" )
		{
			alert("请输入名称！");	
			return;
		}		
		
		var newsheet = rtspreadsheets[selectspreadsheetId];
		
		//newsheet.sheetId = "1";
		//newsheet.proId;
		newsheet.sheetKey = NewGuid();
		newsheet.sheetType = $("#report_types").val();
		newsheet.sheetName = newname;
		newsheet.sheetContent = JSON.stringify(rtinfor);		
        
		newsheet.sheetStats = getstats();
		newsheet.sheetStartTime =$("#myStarttime").val()
        newsheet.sheetEndTime =$("#myEndtime").val();  
		newsheet.sheetCreateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        
        //
        $.ajax({
	        type:"post",
	        url:"/THPBuilder/insertSheet",
	        data: newsheet,
			dataType : 'json',
	        async:true,
	        success:function(data){	
	            //console.log(data);   

	        	refreshSpreadsheet(); 
	            
	    	    $("#myOKLabel").text("系统提示");
	    	    $('#myOK').modal();	 
	        }
	    });	  
		
	}else 
	{
	
	
	}
	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// public function

function getstats()
{
    var valmax = $("#myMax").prop("checked")==true?"1":"0";
    var	valmin = $("#myMin").prop("checked")==true?"1":"0";
    var	valavg = $("#myAvg").prop("checked")==true?"1":"0";
    var	valsum = $("#mySum").prop("checked")==true?"1":"0"; 
    return valmax.toString() + valmin.toString() + valavg.toString()+ valsum.toString();

}

//guid
function S4() 
{   
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);   
} 

function NewGuid() 
{   
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());   
}


//Date
//author: meizz
//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
//let time1 = new Date().Format("yyyy-MM-dd");
//let time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
Date.prototype.Format = function (fmt) { 
	let o = {
     "M+": this.getMonth() + 1, //月份
     "d+": this.getDate(), //日
     "h+": this.getHours(), //小时
     "m+": this.getMinutes(), //分
     "s+": this.getSeconds(), //秒
     "q+": Math.floor((this.getMonth() + 3) / 3), //季度
     "S": this.getMilliseconds() //毫秒
     };
	if (/(y+)/.test(fmt)) 
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) 
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	
	return fmt;
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//the event of buttons for Viewer Sheet

// refresh Sheet list
function refreshSheet()
{
$("#mySheets").empty();

$.ajax({
		type : "post",
		url : "/THPBuilder/getAllSheets",
		async : true,
		success : function(data) {

			// console.log(data);
			datajson = $.parseJSON(data);

			rtsheets = datajson.rows;

			$("#mySheets").append("<option value='-1'>请选择...</option>");

			// init spreadsheet list
			rtsheets.forEach(function(value, index, array) {
				// 第一个参数是遍历的数组内容，第二个参数是对应的数组索引，第三个参数是数组本身
				// code something
				$("#mySheets").append(
						"<option value='" + index + "'>" + value.sheetName
								+ "</option>");
			});

			$("#mySheets").selectpicker('refresh');
		}
	});
}

// display Sheet
// 加载报表模板
// 获取数据
// 修改rtdata
// 显示报表
function viewSheet() {
	selectsheetId = $('#mySheets').val();

	if (selectsheetId == undefined || selectsheetId == null
			|| selectsheetId == -1) {
		alert("请选择报表！");
		return;
	}

	// load data
	// var data1 = JSON.parse(localStorage.getItem('rtinfor'));

	var localsheet = rtsheets[selectsheetId];
	var data1 = JSON.parse(localsheet.sheetContent);

	if (data1 != null) {
		// add data
		// change
		var arcData_final = new Array(); // time and value
		var arcData_stats = new Array(); // min max avg of value

		$.each(arcData, function(i, item) {

			// console.log(i, item);
			localdata = item.data;

			localdata.forEach(function(value, index, array) {
				if (parseInt(i) == 0) {
					arcData_final[index] = new Array();
					arcData_final[index][i] = value.time;
					arcData_final[index][i + 1] = value.value;
				} else {
					arcData_final[index][i + 1] = value.value;
				}
			});

			if (parseInt(i) == 0) {

				arcData_stats[0] = new Array();
				arcData_stats[1] = new Array();
				arcData_stats[2] = new Array();

				arcData_stats[0][i] = "min";
				arcData_stats[1][i] = "max";
				arcData_stats[2][i] = "avg";

				var arr = new Array();
				localdata.forEach(function(value, index, array) {
					arr.push(value.value);
				});
				arcData_stats[0][i + 1] = Math.min.apply(null, arr);
				arcData_stats[1][i + 1] = Math.max.apply(null, arr);
				var sum = eval(arr.join("+"));
				arcData_stats[2][i + 1] = ~~(sum / arr.length * 100) / 100;

				// console.log(arr);
			} else {

				var arr = new Array();
				localdata.forEach(function(value, index, array) {
					arr.push(value.value);
				});
				arcData_stats[0][i + 1] = Math.min.apply(null, arr);
				arcData_stats[1][i + 1] = Math.max.apply(null, arr);
				var sum = eval(arr.join("+"));
				arcData_stats[2][i + 1] = ~~(sum / arr.length * 100) / 100;
				// console.log(arr);

			}

		});

		// console.log(arcData_final);
		// console.log(arcData_stats);

		var hday = arcData[0].data.length;
		var hcurrent = 0;
		var hstat = 0;

		// data
		rtdatas = data1.rtdata;

		rtdatas.forEach(function(value, index, array) {
			// 第一个参数是遍历的数组内容，第二个参数是对应的数组索引，第三个参数是数组本身
			// code something
			// console.log(index, value);

			if (value[0] == null || value[0] == '' || value[0] == 'tag') {
				if (parseInt(hcurrent) < parseInt(hday)) {
					// value
					value.forEach(function(cvalue, cindex, carray) {
						carray[cindex] = arcData_final[hcurrent][cindex];
					});
					hcurrent = hcurrent + 1;
				} else if (parseInt(hstat) < 3) {
					// stats
					value.forEach(function(cvalue, cindex, carray) {
						carray[cindex] = arcData_stats[hstat][cindex];
					});
					hstat = hstat + 1;
				}
			}
		});

		var sRows = rtdatas.length;
		var sCols = rtdatas[0].length;
		$("#myRow").val(sRows);
		$("#myCol").val(sCols);

		// set mergecells
		var inst_mergeCells = hot.getPlugin("mergeCells");
		data1.rtmcell.forEach(function(value, index, array) {
			inst_mergeCells.merge(value.row, value.col, value.row
					+ value.rowspan - 1, value.col + value.colspan - 1);
		});

		// Setting
		settingArr = data1.rtsetting;

		// Size
		rowSizeArr = data1.rtrowsize ? data1.rtrowsize : [];
		colSizeArr = data1.rtcolsize ? data1.rtcolsize : [];

	}

	/*
	 * hot.updateSettings({ cells: [ { renderer: 'my.customsettings' }] });
	 */

	hot.loadData(rtdatas);

	// hot.updateSettings({
	// rowHeaders: true,
	// colHeaders: true
	// });

}

// print Sheet
function printSheet() {
	var mode = 'iframe';
	var close = false;
	var extraCss = "";
	var print = "";
	var keepAttr = [];
	var headElements = "";

	var options = {
		mode : mode,
		popClose : close,
		extraCss : extraCss,
		retainAttr : keepAttr,
		extraHead : headElements
	};

	// hot.updateSettings({
	// rowHeaders: false,
	// colHeaders: false
	// });

	$("#dataTable").printArea(options);

	// pro
	// var hiddenRowsPlugin = hot.getPlugin('hiddenRows');
	// hiddenRowsPlugin.hideRows(9);
	// hot.render();

	// hot.updateSettings({
	// rowHeaders: true,
	// colHeaders: true
	// });

}

// export Sheet
function exportSheet() {
	// JSONToCSVConvertor(hot.getData(), hot.getSettings().colHeaders)
	// function JSONToCSVConvertor(JSONData, colHeaders) {
	// }
	var JSONData = hot.getData();
	var colHeaders = hot.getSettings().colHeaders;

	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData, CSV = '', row = "", fileName = "handsontable.csv";

	// Put the header (based on the colHeaders of my table in my example)
	/*
	 * for (var index in colHeaders) { row += colHeaders[index] + ';'; } row =
	 * row.slice(0, -1); CSV += row + '\r\n';
	 */

	// Adding each rows of the table
	for (var i = 0; i < arrData.length; i++) {
		var row = "";
		for ( var index in arrData[i]) {
			if (arrData[i][index] != null) {
				row += arrData[i][index] + ',';
			}
		}
		row = row.slice(0, -1);
		CSV += row + '\r\n';
	}

	if (CSV == '') {
		alert("Invalid data");
		return;
	}

	// Downloading the new generated csv.
	// For IE >= 9
	if (window.navigator.msSaveOrOpenBlob) {
		var fileData = [ CSV ];
		blobObject = new Blob(fileData);
		window.navigator.msSaveOrOpenBlob(blobObject, fileName);
	} else {
		// For Chome/Firefox/Opera
		//ascii、ansi(gb2312/big5/...)、unicode(utf8/16/32/...)
		//var uri = 'data:text/csv;charset=utf-8,' + CSV;   //escape(CSV)
		//\ufeff  解决中文乱码显示的问题
		var uri = 'data:text/csv;charset=utf-8,\ufeff'
				+ encodeURIComponent(CSV); //encodeURI

		var link = document.createElement("a");
		link.href = uri;

		link.style = "visibility:hidden";
		link.download = fileName;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
