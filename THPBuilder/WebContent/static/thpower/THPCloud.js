/**
 * 
 */

// ************初始化各项参数 **************
function iniParam() {
    _WIN.width = document.body.clientWidth || document.documentElement.clientWidth;
    _WIN.height = document.body.clientHeight || document.documentElement.clientHeight;

    // 各窗口的位置大小记录
    _wndRestore = {
        'comp': {
            'w': 155,
            'h': _WIN.height - 80
        }, //电气元件的初始参数
        'mod': {}, //
    };
} // iniParam end



//Cloud property
var thpCloud = {
		//RootID
		rootId: '0',
		//RootName
		rootName:'thpower',	
		
		//ProjectID
		proId: '1',
		//ProjectName
		proName: 'NewProject',
		//projectPath
		proPath: '0/NewProject/',
		
		//curent menuId
		menuId:'1',
		//curent menuName
		menuName:'liupanshui.xml',		

		//datasource
		dataSource: ""
};

var thpMenu = {
	menuId: '',
	menuName:'',
	menuPath:'',		
};


//Diagram数量
var thpPagesNumber = 0;

var thpPagesXML=new Array();

var thpCurrentPageIndex =0;

var thpCurrentPageXML = "";


function getRootPath(){ 
	var strFullPath=window.document.location.href; 
	var strPath=window.document.location.pathname; 
	var pos=strFullPath.indexOf(strPath); 
	var prePath=strFullPath.substring(0,pos); 
	var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1); 
	return(prePath+postPath); 
};

//webpath就是目录路径变量 

var thpWebPath=getRootPath() + "/xml/"; 

function thpNewDialog(){
	var newdialog = "<div class='maskDiv'>"
		+ "<div class='container' style='height:100%;width:60%; vertical-align:middle;'>"
		//+ "<form role='form' style='margin: 100px auto;'>"
		+ "<div class='panel panel-primary'>"
		+ "<div class='panel-heading'>新建...</div>"
		+ "<label class='radio-inline'> <input type='radio' name='optionsRadiosinline' id='optionsRadios3' value='0' checked> 新建文件(.xml) </label> "
		//+ "<label class='radio-inline'> <input type='radio' name='optionsRadiosinline' id='optionsRadios4' value='1'>  新建工程(.pro)</label>"
		+ "<div class='form-group has-success'>"
		+ "<label class='control-label' for='inputSuccess1'>名称：</label>"
		+ "<label id='nameisvalidated' class='control-label' for='inputSuccess1'></label>"
		+ "<input type='text' class='form-control' id='inputSuccess1' aria-describedby='helpBlock2' placeholder='请输入新的名称'>"
		+ "</div>"
		+ "<div style='float:left;'><button id='thpcreate' type='button' disabled='true' class='btn btn-primary btn-lg active'>创建</button> </div>"
		+ "<div style='float:right;'><button id='thpclose' type='button' class='btn btn-primary btn-lg active'>返回</button> </div>"
		+ "</div>"
		//+ "</form>"
		+ "</div>"
		+ "<script language='javascript'>"
		+ "$('#inputSuccess1').blur(function(){thpValidate('file',$('#inputSuccess1').val());}); "
		+ "$('#thpclose').click(function(){$('.maskDiv').remove();});"
		+ "$('#thpcreate').click(function(){thpNewFile($('#inputSuccess1').val()); });"
		//+ "$(document).keyup(function(event){ if(event.keyCode ==13){ $('#thpcreate').trigger('click'); } });"
		+ "</script>"
		+ "</div>";
	
	$(document.body).append(newdialog);	
	
	$('.maskDiv').fadeIn();
};


function thpOpenDialog(){
	var newdialog = "<div class='maskDiv'>"
		+ "<div class='container' style='height:100%;width:60%; vertical-align:middle;'>"
		//+ "<form role='form' style='margin: 100px auto;'>"
		+ "<div class='panel panel-primary'>"
		+ "<div class='panel-heading'>打开...</div>"
		+ "<label class='radio-inline'> <input type='radio' name='optionsRadiosinline' id='optionsRadios3' value='0' checked> 打开文件(.xml) </label> "
		//+ "<label class='radio-inline'> <input type='radio' name='optionsRadiosinline' id='optionsRadios4' value='1'>  打开工程(.pro)</label>"
		+ "<div class='form-group has-success'>"
		+ "<input type='file' id='thpupload' accept='text/xml, application/xml' name='thpupload'></input>"
		+ "<input type='text' hidden id='thpurl' name='thpurl'></input>"
		+ "</div>"
		+ "<div style='float:left;'><button id='thpopen' type='button' disabled='true' class='btn btn-primary btn-lg active'>打开</button></div>"
		+ "<div style='float:right;'><button id='thpclose' type='button' class='btn btn-primary btn-lg active'>返回</button> </div>"
		+ "</div>"
		//+ "</form>"
		+ "</div>"
		+ "<script language='javascript'>"
		+ "$('#thpclose').click(function(){$('.maskDiv').remove();});"
		+ "$('#thpopen').click(function(){thpOpenFile();});"
		+ "$('#thpupload').on('change',function () {  "
		+ " var $file = $(this);"
		+ " var dataURL; "  
		+ " var fileObj = $file[0]; "
		
		//+ " var windowURL = window.URL || window.webkitURL;  "
        //+ " if (fileObj && fileObj.files && fileObj.files[0]) {  "
        //+ "    dataURL = windowURL.createObjectURL(fileObj.files[0]);  "
        //+ " } else { "
        //+ "    dataURL = $file.val(); " 
        //+ " }"
		
		//+ "if(window.createObjcectURL != undefined) { "
        //+ "    dataURL = window.createOjcectURL(fileObj.files[0]); "
        //+ "} else if (window.URL != undefined) {"
        //+ "  dataURL = window.URL.createObjectURL(fileObj.files[0]); "
        //+ "} else if (window.webkitURL != undefined) {"
        //+ " dataURL = window.webkitURL.createObjectURL(fileObj.files[0]);}"
        + " $('#thpopen').attr('disabled', false);"
        + " var ofile={'filename':fileObj.files[0].name, 'filecontent':''}; "
        + "localStorage.setItem('thpcloud.openfile', JSON.stringify(ofile));"
        + "}); "  
		+ "</script>"
		+ "</div>";
	
	$(document.body).append(newdialog);	
	
	$('.maskDiv').fadeIn();
};

//
function stripscript(value) {  
    var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); 
    if(reg.test(value))
    { 
    	return true;
    }
    return false;  
}  

//
function thpValidate(item, content)
{
	//file
	if(item==="file")
	{
		var menuName = $.trim($("#inputSuccess1").val());
		if(menuName===null || menuName==="" || stripscript(menuName))
		{
			$("#thpcreate").attr("disabled", true);	
			$("#nameisvalidated").html("文件名称不能为空或包含非法字符!");
			return;
		}
		
		//ajax开始 
		$.ajax({
			type : "Post", 
			url : "/THPBuilder/ValidteMenu",
			data : {menuName : menuName},
			async : false,
			dataType : "text",
			success : function(data) {
				console.log(data);
				if (data === "0") {
					$("#nameisvalidated").html(menuName + "   √");
					$("#thpcreate").attr("disabled", false);					
				}
				else {
					$("#nameisvalidated").html("相同名称的文件已存在!");
					$("#thpcreate").attr("disabled", true);	
					return false;
				}
			},
			error : function() {
				console.log('数据繁忙，请稍后!');
			}
		})
		//end ajax	
	}
	
	//project
	if(item==="project")
	{
			
	}

}

//写入msyql
function thpNewFile(filename)
{
	//if(filename.substring(filename.length-3).toLowerCase() != ".xml")
	//{
	//	filename = filename+".xml";
	//}	
	//console.log(filename);
	
	var menuName = filename;
	
	//写入
	//thpCloud.
	
	//ajax开始 
	$.ajax({
		type : "Post", 
		url : "/THPBuilder/newDBFile",
		data : {menuName : menuName},
		async : false,
		dataType : "json",
		success : function(data,textstatus) {
			console.log(textstatus);
			if (textstatus !== "success") {
				$("#nameisvalidated").html("创建失败!");
				$("#thpcreate").attr("disabled", true);
				return false;
			}
			
			//console.log(JSON.stringify(data));
			
			localStorage.setItem("thpcloud.newmenu", JSON.stringify(data));
			//JSON.parse(jsonstr)			

		},
		error : function() {
			//console.log('数据繁忙，请稍后!');
		}
	})
	//end ajax	
	
	//关闭	
	$('.maskDiv').remove();
	
	//clear
	editorUi.editor.graph.removeCells(editorUi.editor.graph.getChildCells(editorUi.editor.graph.getDefaultParent()));  

};

function thpOpenFile(obj, type)
{		
	if(!(window.File||window.FileReader|| window.FileList||window.Blob)) {
	    alert('该换Chrome浏览器啦');		
	}
	
	//open
	var files = $('#thpupload').prop('files'); 

	var ofile = JSON.parse(localStorage.getItem("thpcloud.openfile"));
	//var fileid = thpCloud.fileId;		
	var filename = ofile.filename;					 
	var filecontent = "";
	
	if(files.length ==0 )
	{
		alert('请选择文件');
		return;
	}else
	{

		//clear
		editorUi.editor.graph.removeCells(editorUi.editor.graph.getChildCells(editorUi.editor.graph.getDefaultParent()));  
		
		var reader = new FileReader();//新建一个FileReader
		reader.readAsText(files[0], "UTF-8");//读取文件 	
		reader.onload = function(evt){ //读取完文件之后会回来这里
			filecontent = evt.target.result;

			//console.log(filecontent);
			
			ofile = {"filename": filename,"filecontent": filecontent};
			localStorage.setItem('thpcloud.openfile', JSON.stringify(ofile))

			var doc = mxUtils.parseXml(filecontent);
			var codec = new mxCodec(doc);	
			
			codec.decode(doc.documentElement, editorUi.editor.graph.getModel());  

		 	editorUi.editor.graph.zoomTo(screen.width / 1920);
            editorUi.editor.graph.center();
            
			//隐藏maskdiv
			$('.maskDiv').remove();

		}
	}

};



