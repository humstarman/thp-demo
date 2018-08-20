	/********************************************************************/
	/************脚本类***************************************************/
    /************脚本对象item、page、data、ctrl、view的创建********************/
	/************初始化事件，及定时事件处理*************************************/
	var gScript={
		//许继脚本执行的上下文对象
		scriptContext:function(gGraphic){
			var _this=this;
			this.gGraphic=gGraphic;
			this.item={
				getProperty:function(){
					//alert("getProperty");
				    var id=null;
				    var itemPath=null;
					if(1==arguments.length){
						id=arguments[0];
						return gGraphic.attributes[id];
					}else if(2==arguments.length){
						id=arguments[0];
						itemPath=arguments[1];
						return 0;
					}else{
						console.log('非法的参数个数异常！');
						return 0;
					}
				},
				setProperty:function(){
					//alert("setProperty");
				    var id=null;
				    var itemPath=null;
				    var val=null;
				    var isvaluechange=false;
					if(2==arguments.length){
						id=arguments[0];
						val=arguments[1];
						var old=gGraphic.attributes[id];
						gGraphic.attributes[id]=val;
						if(old!=val){
							isvaluechange=true;
						}
					}else if(3==arguments.length){
						itemPath=arguments[0]
						id=arguments[1];
						itemPath=arguments[2];
					}else{
						console.log('非法的参数个数异常！');
					}
					
					if(isvaluechange){
						
						//处理子属性，如a2.penColor，将父图元上的属性变化，同步更新到子图元的属性上，用来出发相关脚本。
						if(gGraphic.name=="dsGroupItem"&&id.indexOf(".")>0){
							
							var getSubGraphic=function(gGraphic,name){
									  if(gGraphic.children&&gGraphic.children.length>0){
										   for(var i=0;i<gGraphic.children.length;i++){
											   if(gGraphic.children[i].attributes["name"]==name){
												   return gGraphic.children[i];
											   }
										   }
									  }
									  return null;
							};
							
							
						  var keys = id.split(".");
						  var tempGraphic =gGraphic;
						  var existSubGraphic=false;
						  for(var i=0;i<keys.length-1;i++)
						  {
							  tempGraphic = getSubGraphic(tempGraphic,keys[i]);
							  if(tempGraphic==null){
								  existSubGraphic=false;
								  break;
							  }
							  if(i==keys.length-2){
								  existSubGraphic=true;
							  }
						  }
						  if(existSubGraphic){
							  var context = null;
							  if(!tempGraphic.scriptContext){
									context = new gScript.scriptContext(tempGraphic);
									tempGraphic.scriptContext=context;
							  }else{
								  context = tempGraphic.scriptContext;
							  }
							  context.item.setProperty(keys[keys.length-1],val);
						  }
							
						}
						
						//更新Chart类型
						if(gGraphic.name=="dsChartItem"&&id.indexOf(".")>0){
							//gGraphic.map.refresh(gGraphic);
							if(!gGraphic.isTimerInterval){
								gGraphic.map.getLabel(gGraphic);
							}
							
						}
						
						//更新setAngle
						if(id=="spanAngle"){
							gGraphic.setAngle(val);
						}
						
						//更新rotation
						if(id=="rotation"){
							gGraphic._setRotation(val);
						}
						//更新penColor
						if(id=="penColor"){
							gGraphic.setLineColor(val);
						}
						
						//更新brushColor
						if(id=="brushColor"){
							gGraphic.setFillColor(val);
						}
						
						//更新image类型
						if(gGraphic.name=="dsPixmapItem"&&id=="imagefile"){
							gGraphic.setImage(settings.xjResURL+val);
						}
						//更新text类型
						if (gGraphic.name=="dsTextItem"&&id=="text"){
							gGraphic.updateTextContent(String(val));
					    }
						 
						//处理监测属性值变化的事件
						if(gGraphic.attributes[id+"Change"]&&""!=gGraphic.attributes[id+"Change"]){
							gScript.timerListener[i].fireCustomerListener(id+"Change");
						}
					}
					

				}
			
			};
			
			this.view=(function(){
                function view(fileName){
                     var model = document.createElement('div');
                     model.setAttribute("class", "model");
                     document.body.appendChild(model);
                     var _gTask=new gTask();
                     var resss =decodeURI(fileName);
                     var graphicsArr=_gTask.getXMLData(resss);
                     var container = document.createElement('div');
                     container.id=fileName;
                     var map = new gMap(container);
                     map.drawGraphics(graphicsArr);
                     var rect = map.attributes.rect.split(",");
                     var centerX = document.body.clientWidth/2-Number(rect[2])/2;
                     var centerY = document.body.clientHeight/2-Number(rect[3])/2;
                     var width=centerX<0?(document.body.clientWidth-100):Number(rect[2]);
                     var height=centerY<0?(document.body.clientHeight-100):Number(rect[3]);
                     centerX=centerX<0?50:centerX;
                     centerY=centerY<0?50:centerY;
                     var wnd = new mxWindow(fileName, container, centerX, centerY, width, height, true, true);
                     
                     wnd.setMaximizable(true);
                     wnd.setResizable(true);
                     wnd.setVisible(false);
                     wnd.setClosable(true);
                     wnd.addListener('close',function () {
                         model.removeAttribute('class');
                     });
                    wnd.addListener('show',function () {
                        model.setAttribute('class',"model active");
                    });
                    wnd.fit();
                    this.window = wnd;
                    this.map = map;
                    this._pos={
                         x:wnd.getX(),
                         y:wnd.getY()
                    };
                    Object.defineProperty(this,"pos", {
                        get: function () {
                            return this._pos;
                        },
                        set: function (pos) {
                            this.window.setLocation(pos.x,pos.y);
                            return this._pos=pos;
                        }
                    });
                 }
                view.prototype.show=function () {
                    this.window.show();
                };
                view.prototype.exec=function () {
                    this.window.show();
                };
                view.prototype.close=function () {
                    this.window.fireEvent(new mxEventObject(mxEvent.CLOSE));
                    this.window.destroy();
                };
                view.prototype.getProperty=function(){};
                view.prototype.setProperty=function(){};
                view.prototype.setPropertyFromJson=function(){};
                return view;
            }());
			
			this.page={
				setPage:function(url,pageName){//打开新的页面
					if(null==url||""==url||undefined==url){
						return;
					}
					var fileName=encodeURI(url);
					if(!!window.parent.createTab){
						var para=null;
						if(pageName){
							para={
									"text":pageName,
									"modIcon":"icon node-icon iconfont icon-richengguanli",
									"id":pageName,
									"href":settings.modelServiceURL+fileName,
									"icon":"fa fa-calendar"
								};
						}else{
							var disName = "新建标签页";
							var tmp = fileName.split("/");
							if(tmp.length>0){
								disName = decodeURI(tmp[tmp.length-1].split(".")[0]);
							}
							
							para={
									"text":disName,
									"modIcon":"icon node-icon iconfont icon-richengguanli",
									"id":disName,
									"href":settings.modelServiceURL+fileName,
									"icon":"fa fa-calendar"
								};
						}
						
						window.top.createTab(para);
					}else if(!!window.parent.addTab){
						var para=null;
						if(pageName){
							para ={url:settings.modelServiceURL+fileName, title: pageName};
						}else{
							para ={url:settings.modelServiceURL+fileName, title: fileName};
						}
						
						window.parent.addTab(para);
					}else if(!!window.parent.Tab&&!!window.parent.Tab.addTab){
						if(pageName){
							window.parent.Tab.addTab(pageName,settings.modelServiceURL+fileName);
						}else{
							window.parent.Tab.addTab(url,settings.modelServiceURL+fileName);
						}
					}
					else{
						window.open(settings.modelServiceURL+fileName);
					}
				},
				createView:function(fileName){
					  return new _this.view(fileName);
				},
				createUiDialog:function(uiFile,jsFile){},
				getChildFromUi:function(){},
				createTimer:function(){},
				getProperty:function(){},
				setProperty:function(){},
				setPropertyFromJson:function(){},
				outputInfo:function(){},
				outputInfoFromJson:function(){}
			};
			this.data={
				setValue:function(){},
				getValue:function(tableName,id){
					if(!settings.dataService){
						return null;
					}
					if(null==tableName||undefined==tableName||""==tableName||
							null==id||undefined==id||""==id){
						return null;
					}
					//var ajax=new gAjax();
					var postData={};
					postData.request="getvalue";
					postData.dbname=tableName;
					postData.id=id;
					var res = gCache.getScriptCacheData(settings.dataServiceURL,postData);
					return JSON.parse(res).value;
				},
				setRecord:function(){},
				getRecord:function(tableName,id,field){
					if(!settings.dataService){
						return null;
					}
					
					if(null==tableName||undefined==tableName||""==tableName||
							null==id||undefined==id||""==id||
							null==field||undefined==field||""==field){
						return null;
					}
					
					
					//var ajax=new gAjax();
					var postData={};
					postData.request="getrecord";
					postData.dbname=tableName;
					postData.id=id;
					postData.field=field;
					var res = gCache.getScriptCacheData(settings.dataServiceURL,postData);
					if(res==null||""==res){
						return null;
					}
					return JSON.parse(res).value;
				},
				queryFromDB:function(dbname,context){
					if(!settings.dataService){
						return null;
					}
					if(null==dbname||undefined==dbname||""==dbname||
							null==context||undefined==context||""==context){
						return null;
					}
					//var ajax=new gAjax();
					var postData={};
					postData.request="queryfromdb";
					postData.dbname=dbname;
					postData.context=JSON.stringify(context);
					
					var res = gCache.getScriptCacheData(settings.dataServiceURL,postData);
					if(res==null||""==res){
						return null;
					}
					return JSON.parse(res);
				}
			};
			this.ctrl={
				ykpreset:function(){},
				ykexcute:function(){},
				ykcancel:function(){},
				ykcontrol:function(){},
				ytpreset:function(){},
				ytexcute:function(){},
				ytcancel:function(){},
				ytcontrol:function(){},
				tdpreset:function(){},
				tdexcute:function(){},
				tdcancel:function(){},
				tdcontrol:function(){},
				operate:function(){},
				queryresultPreset:function(){},
				queryresultExcute:function(){},
				queryresultErrMsg:function(){}
			};
			
		},

		//处理许继的初始化事件
		initListener:[],
		addInitListener:function(gGraphic){
			gScript.initListener.push(gGraphic);
		},
		removeInitListener:function(gGraphic){
			if(gScript.initListener[gGraphic]) delete gScript.initListener[gGraphic];
		},
		fireInitListener:function(){
			for(var i=0,len=gScript.initListener.length;i<len;i++){
				gScript.initListener[i].fireCustomerListener("initScript");
			}
		},
		
		//处理许继的定时事件
		timerListener:[],
		addTimerListener:function(gGraphic){
			gScript.timerListener.push(gGraphic);
		},
		removeTimerListener:function(gGraphic){
			if(gScript.timerListener[gGraphic]) delete gScript.timerListener[gGraphic];
		},
		fireTimerListener:function(){
			for(var i=0,len=gScript.timerListener.length;i<len;i++){
				gScript.timerListener[i].fireCustomerListener("timerEvent");
			}
		}
	};