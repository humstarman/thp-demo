	/**********************************/
	/************数据缓存类(加载页面初始化数据和脚本中获取数据，包括实时数据和模型数据)*************/
	/**********************************/
	var gCache={
			
		//页面初始化数据缓存对象
		dataCache:{},	
			
		//页面初始化主题类
		subject:function(){
			this.updateTime=null;
			this.userTime=null;
			this.observer=[];
			this.curValue=null;
			this.addObserver=function(observer){
				if(!this.observer[observer]) this.observer.push(observer);
			};
			this.removeObserver=function(observer){
				if(this.observer[observer]) delete this.observer[observer];
			};
			this.getValue=function(){
				this.userTime=new Date().getTime();
				return this.curValue;
			};
			this.notify=function(newValue){
				this.updateTime=new Date().getTime();
				if(this.curValue!=newValue){
					var dataProxy=null;
					for(var i=0,len=this.observer.length;i<len;i++){
						dataProxy = this.observer[i];
						dataProxy.updata(newValue);
					}
					this.curValue=newValue;
				}
			};
		},
		
		//两个功能：1，将最新数据设置到代理的节点中；2，触发属性chang事件，如果存在；
		itemDataProxy:function(gGraphic,key){
				this.gGraphic=gGraphic;
				this.key=key;
				this.updata=function(val){
					var old=gGraphic.attributes[key];
					gGraphic.attributes[key]=val;
					if(old!=val){
						//处理监测属性值变化的事件
						if(gGraphic.attributes[key+"Change"]&&""!=gGraphic.attributes[key+"Change"]){
							gGraphic.fireCustomerListener(key+"Change");
						}
					}
				};
		},
		
		

		
		addObserver:function(key,item){
			if(key.indexOf(":")<=0){
				return;
			}
			var valueName="value"
			if(key.indexOf(",")>0){
				var dbname=key.split(":")[0];
				var ids=(key.split(":")[1]).split(",");
				for(var i=0;i<ids.length;i++){
					var subkey = dbname+":"+ids[i];
					if(!gCache.dataCache[subkey]){
						gCache.dataCache[subkey]=new gCache.subject();	
					}
					if(i!=0){
						valueName="value"+i;
					}
					var DataProxy =new gCache.itemDataProxy(item,valueName);
					gCache.dataCache[subkey].addObserver(DataProxy);
				}
			}else{
				if(!gCache.dataCache[key]){
					gCache.dataCache[key]=new gCache.subject();
				}
				var DataProxy =new gCache.itemDataProxy(item,valueName);
				gCache.dataCache[key].addObserver(DataProxy);
			}
			
		},
		
		removeObserver:function(key,item){
			if(!gCache.dataCache[key]){
				gCache.dataCache[key].removeObserver(item);
			}

		},
		getDataCache:function(key){
			if(gCache.dataCache[key]){
				return gCache.dataCache[key].getValue();
			}
			return null;
		},
		
		addDataCache:function(key,value){
			if(!gCache.dataCache[key]){
				gCache.dataCache[key]=new gCache.subject();
			}
			gCache.dataCache[key].notify(value);
		},
		removeDataCache:function(key){
			if(gCache.dataCache[key]) delete gCache.dataCache[key];
		},
		updateDataCache:function(){
			
			//gCache.addObserver('analog_value:11',null);
			
			for(var key in gCache.dataCache){
				if(key.indexOf(":")>0){
					var dbname=key.split(":")[0];
					var id=key.split(":")[1];
					
					var param = {
					         "table_name":"SCADA_Analog" ,
					         "id":[id]
					};					   
					 var contentStr = JSON.stringify(param);
					//mxUtils.post(settings.dataServiceURL, 'request=getvalue&dbname='+dbname+'&id='+id, function(req){
					mxUtils.post(settings.dataServiceURL, contentStr, function(req){
						var res = req.request.responseText
						//var tempKey = (req.params.split("&")[1]).split("=")[1]+":"+(req.params.split("&")[2]).split("=")[1];
						var tempKey = "analog_value:" + JSON.parse(req.params).id[0];
						
						if(null!=res&&""!=res&& null!=tempKey){
							var json = JSON.parse(res);
							var temp = json.value
							var num = new Number(temp);
							num = num.toFixed(3);
							if(temp==undefined){
								temp ="";
							}
							gCache.addDataCache(tempKey, num);//异步调用key传入方式需要确认是否正确
						}
						//mxUtils.alert(req.request.responseText);
					});
				}
				
			}
		},
		
		/**************************************************************************************************************/
		//脚本中访问后台数据缓存
		scriptCacheData:{},
		
		ScriptCacheSubject:function(url,functionName,paras){
			this.updateTime=new Date().getTime();
			this.userTime=new Date().getTime();
			this.curValue=null;
			this.url=url;
			this.functionName=functionName;
			this.paras=paras;
			this.getValue=function(){
				if(this.updateTime - this.userTime>settings.scriptUserTimeInterval){
					this.synUpdateCacheData();
				}
				this.userTime=new Date().getTime();
				return this.curValue;
			};
			this.setValue=function(newValue){
				this.updateTime=new Date().getTime();
				this.curValue= newValue;
			};
			//异步更新数据
			this.asynUpdateCacheData=function(){
				//如果在settings.scriptUserTimeInterval时间内没有使用，则不更新数据
				if(this.updateTime - this.userTime>settings.scriptUserTimeInterval){
					return;
				}
				mxUtils.post(this.url, this.paras, function(req){
					var res = req.request.responseText
					if(null!=res){
						var key = gUtil.md5(req.params);
						gCache.scriptCacheData[key].setValue(res);
					}
				});
			};
			
			//同步更新数据
			this.synUpdateCacheData=function(){
				var ajax=new gAjax();
				var res = ajax.requestPostSoapData(this.url,this.paras);
				this.setValue(res);
				return res;
			};
		},
		
		getScriptCacheData:function(url,postData){
			//不适用缓存时，每次都访问服务器，并不缓存数据
			if(!settings.isScriptCacheData){
				var ajax=new gAjax();
				var res = ajax.requestPostSoapData(settings.dataServiceURL,postData);
                return res;
			}
			//适用缓存时，执行以下代码
			var postDataStr = (function(obj){ // 转成post需要的字符串.
				var str = "";
				for(var prop in obj){
					str += prop + "=" +obj[prop] + "&";
				}
				return str;
			})(postData);
			postDataStr=postDataStr.substring(0,postDataStr.length-1);
			var key = gUtil.md5(postDataStr);
			//console.log(key);
			if(!gCache.scriptCacheData[key]){
				gCache.scriptCacheData[key] = new gCache.ScriptCacheSubject(settings.dataServiceURL,postData.request,postDataStr)
				var res = gCache.scriptCacheData[key].synUpdateCacheData();
				gCache.scriptCacheData[key].setValue(res);
			}
			return gCache.scriptCacheData[key].getValue();
		},
		
		removeScriptCacheData:function(key){
			if(gCache.scriptCacheData[key]) delete gCache.scriptCacheData[key];
		},
		updateScriptCacheData:function(){
			for(var key in gCache.scriptCacheData){
				 gCache.scriptCacheData[key].asynUpdateCacheData();
			}
		},
		
		
	};