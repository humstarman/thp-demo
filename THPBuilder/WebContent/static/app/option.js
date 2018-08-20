	var defaults = {
			initScript:false,
			timerEvent:true,
			dataService:true,
			dataServiceURL : "http://39.107.67.255:9099/api/RTDATA/getvalues?",
		    hbaseServerURL:"http://39.107.67.255:9098/hbase/api/getvaluesext?",
		     redisServerURL:"http://39.107.67.255:9898/rtdb/api/query?",
			modelServiceURL : "http://localhost:8080/THPModelService/index.html?key=",
			xjResURL : 'http://localhost:8080/THPModelService/xuji/res/',
			isCacheData:true,
			updateCacheTimer:5000,
			userTimeInterval:30000,
			
			isScriptCacheData:false,
			scriptUpdateCacheTimer:5000,
			scriptUserTimeInterval:30000,
			
			/*页面刷新*/
			viewStartDate:"y",
			viewEndDate:"*",
			viewFrequency:5,    //单位：秒 刷新频率
			viewInterval:60,  //单位：分钟  时间间隔
			
	};
	var settings = defaults;
	var setOption=function(option){
		settings = Object.assign(defaults,option);
	};