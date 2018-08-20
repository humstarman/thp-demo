/**
 * Copyright(c) 2017-2018, All Rights Reserved.
 * Project: Configuration 
 * Author: wh
 * Createdate: 2017-11-6
 * Version: 1.1
 */

	/************服务类*************/
	/**********************************/
	function gTask(){
		
	}
	/**
	 *获取服务端xml数据
	 *@param xmlName xml文件名称
	 *@return jsonData。 json数据 graphic对象的数组数据。
	 ***/
	gTask.prototype.getXMLData=function(xmlName){
		var ajax=new gAjax();
		var jsonData = JSON.parse(ajax.requestSoapData("XmlServlet?xmlName="+xmlName));
		return jsonData;
	};
	
	/**********************************/
	/************ajax类*************/
	/**********************************/
	/**
	 *私有
	 *得到xmlHttpRequest对象(浏览器不同获取方式不一样)
	 *@return xmlHttp xmlHttpRequest对象
	 */
	var gHtp=null;
	(function _getXmlHttpObject(){
		if(window.ActiveXObject)	gHtp=new ActiveXObject("Microsoft.XMLHTTP");  
		else if(window.XMLHttpRequest)	gHtp=new XMLHttpRequest();
	})();
	function gAjax(){
		this._readyState=4;
		this._status=200;
	}
	gAjax.prototype.requestSoapData=function(url){
		var xmlHttp=gHtp;
		//false为同步请求
		xmlHttp.open("GET", url, false);
		//向服务端发送
		xmlHttp.send(null);
		if(xmlHttp.readyState==this._readyState&&xmlHttp.status ==this._status)
		//返回数据
		return xmlHttp.responseText;
		else throw new Error("链接服务器失败");
	};
	//发送post请求
	gAjax.prototype.requestPostSoapData=function(url,postData){
		if(typeof(postData) == "object"){
			postData = (function(obj){ // 转成post需要的字符串.
				var str = "";
				for(var prop in obj){
					str += prop + "=" + obj[prop] + "&";
				}
				return str;
			})(postData);
			postData=postData.substring(0,postData.length-1);
		}
		var xmlHttp=gHtp;
		//false为同步请求
		xmlHttp.open("POST", url, false);
		xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		//向服务端发送
		xmlHttp.send(postData);
		if(xmlHttp.readyState==this._readyState&&xmlHttp.status ==this._status)
		//返回数据
		return xmlHttp.responseText;
		else throw new Error("链接服务器失败");
	};