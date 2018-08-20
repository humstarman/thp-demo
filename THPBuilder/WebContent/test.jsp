<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>THPower Scada Test</title>
<style type="text/css">
    img{/* 图片适应div大小 */
        width: 150px;
        height: 150px;
    }
</style>

<script type="text/javascript" src="static/jquery/jquery-3.2.1.js"></script>

<script type="text/javascript">

	// 对Date的扩展，将 Date 转化为指定格式的String  
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
	Date.prototype.Format = function (fmt) { //author: meizz   
	    var o = {  
	        "M+": this.getMonth() + 1, //月份   
	        "d+": this.getDate(), //日   
	        "H+": this.getHours(), //小时   
	        "m+": this.getMinutes(), //分   
	        "s+": this.getSeconds(), //秒   
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
	        "S": this.getMilliseconds() //毫秒   
	    };  
	   if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
	    for (var k in o)  
		   if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
	    return fmt;  
	}  
	
	function isEmpty(obj){
	    if(typeof obj == "undefined" || obj == null || obj == ""){
	        return true;
	    }else{
	        return false;
	    }
	}

	$(function() {	
	
		$("#getMeta").click(function() {
			$.ajax({
				type : 'POST',
				url : "getMetasByLabel",
				//contentType: 'application/json',
				data : {'metaLabel':''},
				dataType : 'json',
				async : true,
				success : function(data, textStatus) {
					console.log(data);
					
					$('#tb-metas tr:gt(0)').remove();//删除之前的数据	

			        var s = '';
			        
					for(var i=0; i<data.rows.length; i++)
					{
						var mKey=data.rows[i].metaId;	
						var mName=data.rows[i].metaName;
						var mContent=data.rows[i].metaContent;
						var mLabel=data.rows[i].metaLabel;				  
						
			        	s += '<tr><td>' + mKey + '</td><td>' + mName + '</td><td>' + mContent + '</td><td>' + mLabel + '</td></tr>';
						 
						 $("#metaid").attr("value", mKey);
						 $("#metalabel").attr("value", mLabel);
						 
					 }  
					 
			         $('#tb-metas').append(s); 
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
		$("#insertMeta").click(function() {

			var metaName = $('#metaname').val();
			var metaContent = $('#metacontent').val();
			
			if (isEmpty(metaName) || isEmpty(metaContent))
			{
				return;			
			}
			 
			$.ajax({
				type : 'POST',
				url : "insertMeta",
				data : {'metaName':metaName, 'metaContent':metaContent, 'metaLabel':'elect'},
				dataType : 'json',
				async : true,
				success : function(data, textStatus) {					
					console.log(data);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
		$("#updateMeta").click(function() {

			var metaid = $('#metaid').val();
			var metalabel = $('#metalabel').val();
			
			if (isEmpty(metaid) || isEmpty(metalabel))
			{
				return;			
			}
			 
			$.ajax({
				type : 'POST',
				url : "updateMetaLabel",
				data : {'metaId':metaid, 'metaLabel':metalabel},
				dataType : 'json',
				async : true,
				success : function(data, textStatus) {					
					console.log(data);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
	
		$("#getGUID").click(function() {
			$.ajax({
				type : 'POST',
				url : "getGUID",
				//contentType: 'application/json',
				data : {},
				dataType : 'json',
				async : true,
				success : function(data, textStatus) {
					console.log(data);
					
					$("#guidvalue").attr("value", data.guidvalue);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
		$("#getparavalue").click(function() {
			$.ajax({
				type : 'POST',
				url : "getParaValue",
				//contentType: 'application/json',
				data : {"paracode": $("#paracode").val()},
				dataType : 'json',
				async : true,
				success : function(data, textStatus) {
					console.log(data);
					
					$("#paracode").attr("value", data.paracode);
					$("#paravalue").attr("value", data.paravalue);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
		
		$("#findpics").click(function() {
			$.ajax({
				type : 'POST',
				url : "findPics",
				//contentType: 'application/json',
				data : {},
				dataType : 'json',
				async : true,
				success : function(data, textStatus) {
					console.log(data);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
		$("#showpics").click(function() {
			$.ajax({
				type : 'POST',
				url : "getPics",
				//contentType: 'application/json',
				data : {},
				dataType : 'json',
				async : true,
				success : function(data, textStatus) {
					console.log(data);
					 
					$('#pics').empty();
					var s = '';
	                for (var i = 0; i < data.length; i++)
	               	{
	               		s += '<img src="' + data[i].picUrl + '" />';
	                }	                
	                $('#pics').append(s);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
		$("#list").click(function() {

			var xmlId = 1;

			$.ajax({
				type : 'POST',
				url : "getMenuList",
				data : {'proId' : '1'},
				dataType : 'json',
				async : true,
				success : function(data, textStatus) {
					$("#status").text(textStatus);
					
					$('#tb tr:gt(0)').remove();//删除之前的数据
	                var s = '';
	                for (var i = 0; i < data.length; i++)
	               	{
	               		s += '<tr><td>' + data[i].menuId + '</td><td>' + data[i].menuName + '</td><td>' + data[i].menuModifyTime + '</td></tr>';
	                }
	                
	                $('#tb').append(s);

				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
		$("#dbload").click(function() {

			var xmlId = 1;

			$.ajax({
				type : 'POST',
				url : "getFromDBFileContent",
				data : {'menuId' : '1'},
				dataType : 'text',
				async : true,
				success : function(data, textStatus) {
					$("#data").text(data);
					$("#status").text(textStatus);
					
					//localStorage.clear();
					
					//第一种方法写入
					//storage["a"]=1;
					//第二种方法写入
					//storage.a=1;
					//第三种方法写入
					localStorage.setItem("thpcloud.thpcloud-graph.xml", data);
					//console.log();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});

		$("#dbsave").click(function() {			
			//第一种方法读取
            //var a=storage.a;
            //第二种方法读取
            //var b=storage["b"];
            //第三种方法读取
            var xmlContents =localStorage.getItem("thpcloud.thpcloud-graph.xml");
    
			if (xmlContents === "") {
				$("#status").text("no value");
				return;
			}
							
			$.ajax({
				type : 'POST',
				url : "saveToDBFileContent",
				contentType: 'application/json',
				data : SaveData(xmlContents),
				dataType : 'text',
				async : true,
				success : function(data, textStatus) {
					$("#data").text('');
					$("#status").text(textStatus);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});
		
		
		$("#dbsaveas").click(function() {
		
            var xmlContents =localStorage.getItem("thpcloud.thpcloud-graph.xml");
            
			if (xmlContents === "") {
				$("#status").text("no value");
				return;
			}
			
			var menuid =  thpCloud.menuId;
			var proid = thpCloud.proId;
			var menuname = thpCloud.menuName;
			var menupath = thpCloud.menuPath;

			$.ajax({
				type : 'POST',
				url : "saveASToDBFileContent",
				contentType: 'application/json',
				data : SaveAsData(xmlContents),
				dataType : 'text',
				async : true,
				success : function(data, textStatus) {
					$("#data").text('');
					$("#status").text(textStatus);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求失败，无法获取分组数据");
				}
			});

		});

	});
	
	function SaveData(xmlContents){
		
		var menuid =  thpCloud.menuId;
		var proid = thpCloud.proId;
		var menuname = thpCloud.menuName;
		//var menupath = thpCloud.menuPath;
		//var menupath = 'http://120.92.89.125:8088/0/NewProject/liupanshui1xxxx.xml';
		var menupath = 'liupanshui1xxxx.xml';
		var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
			
		var menu = {
			menuId: menuid, 
			menuParentId: '0', 
			menuProId: proid,
			menuName:menuname, 
			menuIndex:10,
			menuIsFolder:'0',
			menuIsVisable:'1', 
			menuIsEnable:'1', 
			menuIsDelete: '0',
			menuPath: menupath,
			menuContent: xmlContents,
			meunNote:'',
			menuCreateTime: '',
			menuModifyTime: time2
		};
		
		console.log(JSON.stringify(menu));
		
		return JSON.stringify(menu);
	}
	
	function SaveAsData(xmlContents){
		
		var menuid =  '';
		var proid = thpCloud.proId;
		var menuname = "new_"+thpCloud.menuName;
		var menupath = thpCloud.menuPath;
		var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
			
		var menu = {
			menuId: menuid, 
			menuParentId: '0', 
			menuProId: proid,
			menuName:menuname, 
			menuIndex:10,
			menuIsFolder:'0',
			menuIsVisable:'1', 
			menuIsEnable:'1', 
			menuIsDelete: '0',
			menuPath: menupath,
			menuContent: xmlContents,
			meunNote:'',
			menuCreateTime: '',
			menuModifyTime: time2
		};
		
		return JSON.stringify(menu);
	}
	

	function init() {
		var book = {
			title : "mxGraph",
			authors : [ "Nicholas C. Zakas" ],
			edition : 3,
			year : 2011
		};
		var jsonBook = JSON.stringify(book);
		var objectBook = JSON.parse(jsonBook);
		var title = objectBook.title;
		console.log(title + "  " + jsonBook);
		
	}
		
	function lslist()
	{
		
		$('#tb tr:gt(0)').remove();//删除之前的数据	

        var s = '';
        
		for(var i=0;i<localStorage.length; i++)
		{
			//调用key方法获取localStorage中数据对应的键名
			//如这里键名是从test1开始递增到testN的，那么localStorage.key(0)对应test1
			var getKey=localStorage.key(i);
			
			//通过键名获取值，这里的值包括内容和日期 
			var getVal=localStorage.getItem(getKey);			  
			
        	s += '<tr><td>' + i + '</td><td>' + getKey + '</td><td>' + getVal + '</td></tr>';
			 
		 }  
		 
         $('#tb').append(s); 
	}
	
 	//String path = request.getContextPath();  
	
	//String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/"; 
	
	//request.setAttribute("basePath", basePath);   
	
	
</script>
</head>
<body>

	<!-- SpringMVC Step 1 
     add libs: 7+1 
     add a event helloworld     
-->
	<p>THPower Scada</p>
	
	
	<p>插入Meta</p>
	<button id="insertMeta" style="width: 120px; height: 30px;">insert Meta</button>
	<input id="metaname" type="text" style="width:300px;"/>
	<input id="metacontent" type="text" style="width:300px;"/>	
	
	
	<p>更新Meta</p>
	<button id="updateMeta" style="width: 120px; height: 30px;">update Meta</button>
	<input id="metaid" type="text" style="width:300px;"/>
	<input id="metalabel" type="text" style="width:300px;"/>	
	
	<p>获取Meta</p>
	<button id="getMeta" style="width: 120px; height: 30px;">get Meta</button>	
	<div>
		<table id="tb-metas" border="1" style="border-collapse: collapse;width:590px;">
         <tr>
           <th>ID</th>
           <th>Name</th>
           <th>Content</th>
           <th>Label</th>
         </tr>
       	</table>
	</div>
	
	<p>生成GUID</p>
	<button id="getGUID" style="width: 120px; height: 30px;">get GUID</button>
	<input id="guidvalue" type="text" style="width:300px;"/>
	
	<p>获取参数</p>
	<button id="getparavalue" style="width: 120px; height: 30px;">get para value</button>
	<input id="paracode" type="text" style="width:300px;" value="PicServerUrl"/>
	<input id="paravalue" type="text" style="width:300px;"/>
	
	<p>上传单个图片</p>
	<form action="uploadPic" method="post" enctype="multipart/form-data"> 			
			<input type="file" name="file" /> 
			<input type="submit" name="upload" value="upload"/>		
	</form>
	
	<p>上传多个图片</p>
	<form action="uploadMultiPics" method="post" enctype="multipart/form-data"> 			
			<input type="file" name="mfile" multiple="multiple" /> 
			<input type="submit" name="mupload" value="mupload"/>		
	</form>
	<!--
	<img src="/pics/4dd310f9-de1e-4195-aa52-88ca7a6c27fd.svg"/>  
	<img src="/pics/49861672-aa9f-4a30-ae31-cd7c93821867.jpg"/>
	-->
	<p>发现图片</p>
	<button id="findpics" style="width: 120px; height: 30px;">find pics</button>
	
	<p>展示图片</p>
	<button id="showpics" style="width: 120px; height: 30px;">show pics</button>
    <div id="pics"> 
		<img src="/pics/4dd310f9-de1e-4195-aa52-88ca7a6c27fd.svg"/>
    </div>
	
	<a href="helloworld"><h4>test helloworld</h4></a>
	<a href="hellotoolbar"><h4>test hellotoolbar</h4></a>

	<form action="getUser" method="get">
		<div>
			<p>
				<strong>User ID</strong> <input type="text" value="1" name="userId" />
			</p>
			<input type="submit" value="获取User" />
		</div>
	</form>

	<form action="getMenu" method="get">
		<div>
			<p>
				<strong>Menu ID</strong> <input type="text" value="1" name="menuId" />
			</p>
			<input type="submit" value="获取XML" />
		</div>
	</form>	
	

	<!-- 
	<form action="getMenus" method="get">
		<div>
			<p>
				<strong>Project ID</strong> <input type="text" value="1" name="proId" />
			</p>
			<input type="submit" value="获取工程菜单" />
		</div>
	</form>	
	 -->
	 <br></br>
	 <input type="button" onclick="init()" value="测试json" /> 
	 <br></br>
	 <input type="button" onclick="lslist()" value="测试localStorage" />
	<br></br>	
	<button id="list" style="width: 120px; height: 30px;">List</button>	
	
	<br>db</br>
	<button id="dbload" style="width: 120px; height: 30px;">load</button>
	<button id="dbsave" style="width: 120px; height: 30px;">save</button>
	<button id="dbsaveas" style="width: 120px; height: 30px;">save as</button>
	
	<br>ftp</br>
	<button id="load" style="width: 120px; height: 30px;">load</button>
	<button id="save" style="width: 120px; height: 30px;">save</button>
	<button id="saveas" style="width: 120px; height: 30px;">save as</button>

	<p id="status"></p>
	<div>
		<table id="tb" border="1" style="border-collapse: collapse;width:590px;">
         <tr>
           <th>ID</th>
           <th>Name</th>
           <th>Path</th>
         </tr>
       	</table>
	</div>
	<textarea id="data" style="width: 90%; height: 200px;"></textarea>
	
</body>
</html>