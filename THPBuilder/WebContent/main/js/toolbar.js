/**
 * Created by wly on 2018/6/22.
 */

toolbar={
		dataList:[],
		timeList:[],
		timeArchvieList:[],
		isStart:false, //是否开始定时更新
		ncount:0,
		nArchviecount:0,
		timeCount:0,   //单个测点数据播放的数量
		timeArchvieCount:0,  //测点一段时间的播放数量
		int:{},
		refreshFrequency:1,  //刷新频率
		refreshInterval:60,  //刷新时间间隔（设置历史数据的时间间隔 默认1小时 单位：分钟）
		/*组织需要循环播放的数据*/
		getTimeList:function(dataList){
			  var  timeList=[];
			    if (dataList) {
			        for (var index in dataList) {
			            var data = dataList[index].data;
			            for (var n in data) {
			                // var time = Date.parse(new Date(data[n].time));
			                var time = data[n].time;
			                var item = {};
			                item.time = time;
			                item.data = [];
			                timeList.push(item);
			            }
			            break;
			        }
			        this.timeCount=timeList.length;
			    }
			    if (dataList) {
			        for (var index in dataList) {
			            var item =dataList[index];
			            var recordid =item.recordid;  //测点id
			            var count=item.count;
			            var  data=dataList[index].data;   //测点数据
			            for (var n in data) {
			                for(var ntime in timeList){
//			                    if(timeList[ntime].time==data[n].time){
			                	 if(ntime==n){
			                        var timedata={};
			                        timedata.value=data[n].value;
			                        timedata.time=data[n].time;
			                        timedata.iQuality=data[n].iQuality;
			                        timedata.recordid=recordid;
			                        timeList[ntime].data.push(timedata);
			                    }
			                }

			            }

			            }
			        }
			    return timeList;
		},
		
		/*获取时间段的集合*/
		  getTimeSpanList:function(dataList,startDate,endDate) {

		    var  timeList=[];
		    var interval = this.refreshInterval;   //1小时1个间隔(分钟)
		    var timelineData = [];
		    for (var ntime = startDate; ntime < endDate; ntime++) {
		    	var item={};
		        item.time = ntime;
		        item.starttime = ntime;
		        item.endtime = ntime + 1000 * 60 * interval;
		        item.data = [];
		        timeList.push(item);
		        ntime = ntime + 1000 * 60 * interval;
		    }
		 
		    this.timeArchvieCount=timeList.length;
		    
		    if (dataList) {
		        for (var index in dataList) {
		            var recordid = dataList[index].recordid;  //测点id
		            for (var n in dataList[index].data) {
		                var item = dataList[index].data[n];
		                var time = item.time * 1000;
		                for (var o in timeList) {
		                    if (time >= timeList[o].starttime && time < timeList[o].endtime) {
		                        var timedata={};
  		                        timedata.value=item.value;
  		                        timedata.time=item.time;
  		                        timedata.iQuality=item.iQuality;
  		                        timedata.recordid=recordid;
  		                    
  		                        if(timeList[o].data.length>0){
  		                        	
  		                        	var btrue=false; 
  		                        	for(var i in timeList[o].data)
	                        	      {
 		                      	       if(timeList[o].data[i].recordid==recordid)
		                        	    {
 		                      	    	 timeList[o].data[i].data.push(timedata);
 		                      	    	 btrue=true;
		                        	    }		  		                       
	                        	   }
  		                        	if(!btrue){
   		                      		 var da={};
 			                    	  da.recordid=recordid;
 			                    	  da.data=[];
 			                    	  da.data.push(timedata);
 			                    	  timeList[o].data.push(da);
   		                      	   }
  		                    
  		                        }
  		                          else{
  	  		                          var da={};
  			                    	  da.recordid=recordid;
  			                    	  da.data=[];
  			                    	  da.data.push(timedata);
  			                    	  timeList[o].data.push(da);
  	  		                        }
		                    
		                    }
		                }
		            }

		        }
		    }

		    return timeList;
		},
		
		
		/*获取历史数据进行播放*/
		playData:function(startdate,enddate,ids,graph,updateCells,updarchiveCells)
		{
			var that=this;
			var graph=graph;
			var updateCells=updateCells;
			var startdate=startdate;
			var enddate=enddate;
			 var  recordids=ids;
			    var param = {
			        "tbname":"hdr_analog",
			        "recordids":recordids,
			        "begintime":startdate/1000,
			        "endtime": enddate/1000,
			        "intervaltime":1,
			        "datatype":2
			    };
			    var contentStr = JSON.stringify(param);
			    mxUtils.post(settings.hbaseServerURL, contentStr, function(req) {
			    	if(req && req.request && req.request.responseText ){
			        var data = JSON.parse(req.request.responseText);
			        if(data){
			        	that.dataList= data;
			        	if(data){
			        		that.timeList= that.getTimeList(that.dataList);
			        		
			        		//更新历史数据
			        		that.timeArchvieList=that.getTimeSpanList(that.dataList,startdate,enddate);
			        	}
			        	that.timerUpdate(mygraph,updateCells,updarchiveCells);
			 
			        }
			    	}
			    });
			
		},
		
		timerUpdate:function(graph,updateCells,updarchiveCells){
			 var that=this;
			  this.isStart=!this.isStart;
			  var i=that.refreshFrequency;
//			  toolbar.isStart?$('#btn_PlayTimer').val('暂停'):$('#btn_PlayTimer').val('播放');
			  toolbar.isStart?$('#btn_PlayTimer').text('暂停'):$('#btn_PlayTimer').text('播放');
			    // isStart?$('#btnTimer').val('停止'):$('#btnTimer').val('刷新');
			    if(this.isStart){
			        this.int= setInterval(function () {
			        	that.refreshPlayPoint(this.ncount,graph,updateCells);
			            if(toolbar.ncount >= toolbar.timeCount){
			            	toolbar.ncount = 0;
			            }
//			            
			            that.refreshPlayArchviePoint(graph,updarchiveCells)
			            if(toolbar.nArchviecount >= toolbar.timeArchvieCount){
				            	toolbar.nArchviecount= 0;
				        }
			        		
			            toolbar.ncount++;
			            toolbar.nArchviecount++;

			        },1000*i);
			    }
			    else {
			    	this.intint=clearInterval(this.int);
			    }

		},
		
		//播放测点
		refreshPlayPoint:function(ncount,graph,updateCells){
			
			  for(var index in this.timeList){
				  var item=this.timeList[index];
				  if(toolbar.ncount==index){
					  if(updateCells){
		                    for(var cell in updateCells){
		                    	   var mycell=updateCells[cell];
//			                        if(mycell.dataIds.indexOf(item.data[index].recordid)>-1){
			                            //存在
			                            for(var i in mycell.pointIds){
			                            	for(var n in item.data){
			                            		  if(mycell.pointIds[i].pointId==item.data[n].recordid){
			                            			  
			                            			  mycell.pointIds[i].timestamp=item.data[n].time;
					                                    
					                               	   var dataFormat=mycell.dataFormat;
					                                   if(!dataFormat){
					                                	 dataFormat="0.00";
					                                   }
					                                    mycell.pointIds[i].value=numeral(item.data[n].value).format(dataFormat);
					                                    mycell.pointIds[i].iQuality=item.data[n].iQuality;
			                            		  }
			                            	}
			                            }
//			                        }
		                    }
		                    this.setData(graph,updateCells);
					  }
				  }
			  }
		},
		
		/*播放历史数据*/
		refreshPlayArchviePoint:function(graph,updateCells){
			  for(var index in this.timeArchvieList){
				  var item=this.timeArchvieList[index];
				  if(toolbar.nArchviecount==index){
					  if(updateCells){
		                    for(var cell in updateCells){
		                    	   var mycell=updateCells[cell];
//			                        if(mycell.dataIds.indexOf(item.data[index].recordid)>-1){
			                            //存在
			                            for(var i in mycell.pointIds){
			                            	for(var n in item.data){
			                            		  if(mycell.pointIds[i].pointId==item.data[n].recordid){
			                            			  
			                            			  mycell.pointIds[i].timestamp=item.data[n].time;
			                            			  
			                            			  var dataFormat=mycell.dataFormat;
			                                          if(!dataFormat){
			                                       	     dataFormat="0.00";
			                                          }
			                                         //存在
			                                         for(var i in mycell.pointIds){
			                                        	 for(var n in item.data){
			                                        		 if(mycell.pointIds[i].pointId==item.data[n].recordid.toString()){
			                                        			 mycell.pointIds[i].data=this.formatpointsData(item.data[n].data,dataFormat);
			                                        		 }			                                        		 
			                                        	 }
			                                        	
			                                         }
			                            		  }
			                            	}
			                            }
//			                        }
		                    }
		                    this.setArchvieData(graph,updateCells);
					  }
				  }
			  }
		},

		//往model中添加更新数据
		  setData:function(graph,updateCells) {
		    graph.getModel().beginUpdate();
		    try{
		        var cells=  graph.getModel().cells;
		        for(var index in cells){
		            var mxcell=cells[index];
		            if(mxcell.value && updateCells){
		                for(var i in updateCells){
		                    if(mxcell.id==updateCells[i].id){
		                        if(mxcell.value.measId){
		                            var value=updateCells[i].pointIds[0].value;
		                            var time=formatDate(new Date(updateCells[i].pointIds[0].timestamp*1000));

		                            //存在多态数据
		                            if(updateCells[i].multiStatus){
		                                var multiobj={};
		                                if(updateCells[i].pointIds.length>1){
		                                    multiobj.value=updateCells[i].pointIds[1].value;
		                                    multiobj.iQuality=updateCells[i].pointIds[1].iQuality;
		                                }
		                                mxcell.value.setData(value,time,multiobj);
		                            }
		                            else{
		                                mxcell.value.setData(value,time);
		                            }



		                        }
		                        else if(mxcell.value.dataIds){
		                            if(typeof mxcell.value.startTime == "undefined" || typeof mxcell.value.endTime == "undefined") {  //单个测点刷新
		                                if(updateCells[i].pointIds.length==1){
//													mxcell.value.setData(updateCells[i].pointIds[0].value);
		                                    var value=updateCells[i].pointIds[0].value;
		                                    mxcell.value.setData([{"value":value, "name":'测点'+updateCells[i].pointIds[0].pointId}]);
		                                }
		                                else {
		                                    var data=[];
		                                    for(var j in updateCells[i].pointIds){
		                                        var item=updateCells[i].pointIds[j];
//		                                        var value=numeral(item.value).format(dataFormat);
		                                        var value=item.value+"";
		                                        var da={};
		                                        da.name="测点"+item.pointId;
		                                        da.value=value;
		                                        data.push(da);
		                                    }
		                                    mxcell.value.setData(data);
		                                }
		                            }
		                        }

		                    }
		                }
		            }
		        }
		    }
		    finally
		    {
		        graph.getModel().endUpdate();
		    }
		    
		  //时间格式化
		    function formatDate(date) {
		        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + p(date.getHours()) + ":" + p(date.getMinutes()) + ":" + p(date.getSeconds());
		    }
		},
		
		setArchvieData:function(graph,updateCells){
		    graph.getModel().beginUpdate();
		    try{
		        var cells=  graph.getModel().cells;
		        for(var index in cells){
		            var mxcell=cells[index];
		            if(mxcell.value && updateCells){
		                for(var i in updateCells){
		                    if(mxcell.id==updateCells[i].id){
		                        if(mxcell.value.dataIds){
		                            var data=[];
		                            for(var j in updateCells[i].pointIds){
		                                var item=updateCells[i].pointIds[j];
		                                var da={};
		                                da.name="测点"+item.pointId;
		                                da.data=item.data;
		                                data.push(da);
		                            }
		                            
//		                            var startTime=Date.parse(new Date(Time.getDate(mxcell.value.startTime)));
//		                            var endTime=Date.parse(new Date(Time.getDate(mxcell.value.endTime)));
//		                            var ninterval=60;
//		                            var echart=mxcell.value.chart;
//		                           var option= charts.setTimeDataOption(startTime,endTime,ninterval,data,echart);
//		                            mxcell.value.chart.setOption(option);
		                            mxcell.value.setData(data);
		                        }

		                    }
		                }
		            }
		        }
		    }
		    finally
		    {
		        graph.getModel().endUpdate();
		    }
		},

		//格式化测点数据
		 formatpointsData:function(data,dataFormat) {
		    var result=[];
		    for(var index in data){
		        var da=[];
		        var item=data[index];
		        var time =formatDate(new Date(item.time*1000))
		        //var value =item.value;
		        
		        //20180513,wugh,format value by numeral.mim.js
		        var value =numeral(item.value).format(dataFormat);
		        da.push(time);
		        da.push(value);
		        result.push(da);
		    }
		    return result;
		}


}
					  


