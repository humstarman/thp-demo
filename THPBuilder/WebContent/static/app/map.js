// Fixes possible clipping issues in Chrome  在Chrome中修复可能的剪切问题
	mxClient.NO_FO = true;
	//去掉图形有操作手柄
	mxVertexHandler.prototype.redrawHandles = function(){};
	mxEdgeHandler.prototype.redrawHandles=function(){};
	//重写此发方法用于在鼠标位置缩放
	var _gMapZoom=mxGraph.prototype.zoom;
	//重写此方法用于加载echarts、按钮等。
	var _gMapConvertValueToString=mxGraph.prototype.convertValueToString;
	//绘制线路会有闭合
	mxPolyline.prototype.paintLine = function(c, pts, rounded)
	{
		var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
		c.begin();
		this.addPoints(c, pts, rounded, arcSize, false);
		if(this.state.cell.attributes&&this.state.cell.attributes.closed=="true") {
			c.close();
			c.fillAndStroke();
		}
		else c.stroke();
	};
	//不移动图形
	//mxGraphHandler.prototype.isMoveEnabled=function(){
		//return false;
	//};
	
	/**
	 *自定义圆弧图形 
	 ***/
	function ArcShape(bounds, fill, stroke, strokewidth){
		mxShape.call(this);
		this.bounds = bounds;
		this.fill = fill;
		this.stroke = stroke;
		this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	}
	mxUtils.extend(ArcShape, mxShape);
	mxCellRenderer.prototype.defaultShapes['arcShape'] = ArcShape;
	//画圆弧
	ArcShape.prototype.paintVertexShape=function(path, x, y, _w, _h){
		path.translate(x,y);
		var spanAngle=this.state.cell.spanAngle||360;
		if(spanAngle!=360&&spanAngle<360){
			var flag=true;
			if(this.state.cell.arc!="true") flag=false;
			this.drawArcLine(path, x, y, _w, _h,flag);
		}else{//画椭圆
			path.ellipse(0, 0, _w, _h);
			path.fillAndStroke();
		}
	};
	
	
	ArcShape.prototype.drawArcLine=function(path, x, y, _w, _h,flag){
		if(!flag){//如果闭合
			//如果有跨角
			path.begin();
			var startAngle=this.state.cell.startAngle||0;
			if(startAngle*1!=0){//如果有起始角
				if(startAngle*1<0) startAngle=startAngle*1+360;
				var xyArr=this.caculateEquationResult(_w, _h,startAngle*1);
				//移动到中心点
				path.moveTo(_w/2,_h/2);
				path.lineTo(xyArr[0],xyArr[1]);
				var spanAngle=this.state.cell.spanAngle*1||360;
				spanAngle=spanAngle*1+startAngle*1;
				if(spanAngle>360){//画椭圆
					path.ellipse(0, 0, _w, _h);
					path.fillAndStroke();
				}else{
					var largeArcFlag=0;
					if(this.state.cell.spanAngle*1>180) largeArcFlag=1;
					//w/2,h/2获取中心坐标。 w/2是x的结束位置。0是y的结束位置。
					//_w/2,0。弧度结束位置。(也就是spanAngle与椭圆的焦点)
					var xyArr=this.caculateEquationResult(_w, _h,spanAngle*1);
					path.arcTo(_w/2,_h/2,1,largeArcFlag,0,xyArr[0],xyArr[1]);
					//连接到中心点
					path.lineTo(_w/2,_h/2);
					path.fillAndStroke();
				}
			}else{//如果没有起始角,即起始角是0度.
				var largeArcFlag=0;
				var spanAngle=this.state.cell.spanAngle||360;
				if(spanAngle*1>180) largeArcFlag=1;
				var xyArr=this.caculateEquationResult(_w, _h,spanAngle*1);
				//移动到中心点
				path.moveTo(_w/2,_h/2);
				//如果startAngle=0.默认是(w,h/2)及右中角.
				//其他角度要计算这个线与其他椭圆的焦点了。
				path.lineTo(_w,_h/2);
				//w/2,h/2获取中心坐标。 w/2是x的结束位置。0是y的结束位置。
				//_w/2,0。弧度结束位置。(也就是spanAngle与椭圆的焦点)
				path.arcTo(_w/2,_h/2,1,largeArcFlag,0,xyArr[0],xyArr[1]);
				//连接到中心点
				path.lineTo(_w/2,_h/2);
				path.fillAndStroke();
			}
		}else{//如果不闭合
			//如果有跨角
			path.begin();
			var startAngle=this.state.cell.startAngle||0;
			if(startAngle*1!=0){//如果有起始角
				if(startAngle*1<0) startAngle=startAngle*1+360;
				var xyArr=this.caculateEquationResult(_w, _h,startAngle*1);
				//移动到中心点
				path.moveTo(xyArr[0],xyArr[1]);
				var spanAngle=this.state.cell.spanAngle*1||360;
				spanAngle=spanAngle*1+startAngle*1;
				if(spanAngle>360){//画椭圆
					path.ellipse(0, 0, _w, _h);
					path.fillAndStroke();
				}else{
					var largeArcFlag=0;
					if(this.state.cell.spanAngle*1>180) largeArcFlag=1;
					//w/2,h/2获取中心坐标。 w/2是x的结束位置。0是y的结束位置。
					//_w/2,0。弧度结束位置。(也就是spanAngle与椭圆的焦点)
					var xyArr=this.caculateEquationResult(_w, _h,spanAngle*1);
					path.arcTo(_w/2,_h/2,1,largeArcFlag,0,xyArr[0],xyArr[1]);
					path.stroke();
				}
			}else{//如果没有起始角,即起始角是0度.
				var largeArcFlag=0;
				var spanAngle=this.state.cell.spanAngle||360;
				if(spanAngle*1>180) largeArcFlag=1;
				var xyArr=this.caculateEquationResult(_w, _h,spanAngle*1);
				//如果startAngle=0.默认是(w,h/2)及右中角.
				//其他角度要计算这个线与其他椭圆的焦点了。
				path.moveTo(_w,_h/2);
				//w/2,h/2获取中心坐标。 w/2是x的结束位置。0是y的结束位置。
				//_w/2,0。弧度结束位置。(也就是spanAngle与椭圆的焦点)
				path.arcTo(_w/2,_h/2,1,largeArcFlag,0,xyArr[0],xyArr[1]);
				path.stroke();
			}
		
		}
		
	
	};
	/**
	 *计算根坐标 
	 ***/
	ArcShape.prototype.caculateEquationResult=function(_w,_h,angle){
		//圆心两个半径
		var a=_w/2;//a
		var b=_h/2;//b
		//圆心中心点坐标
		var h=_w/2;//h
		var k=_h/2;//k
		
		var realX=0;
		var realY=0;
		
		if(angle==90){
			realX=a;
		}else if(angle==180){
			realY=b;
		}else if(angle==270){
			realX=a;
			realY=2*b;
		}else if(angle==360){
			realX=2*a;
			realY=b;
		}else{
			var k1=Math.tan(Math.PI/180*angle);
			var b1=k-k1*h;
			//公式中a，b分别为长短轴长，中心点为(h,k)，主轴平行于x轴。
			//椭圆公式 (x-h)^2/a^2+(y-k)^2/b^2=1;   直线公式 y=k1*x+b1
			//一元二次方程 ax^2+bx+c=0--->(b^2+a^2*k1^2) x^2 + (2*a^2*k1-2*b^2*h-2*a^2*k*k1)*x +(b^2 * h^2+a^2 *b1^2-2*a^2*k*b1+a^2* k^2-a^2* b^2)=0
			//							  (b^2+a^2*k1^2) x^2 + (2*a^2*k1*b1-2*b^2*h-2*a^2*k*k1)*x +(b^2 * h^2+a^2 *b1^2-2*a^2*k*b1+a^2* k^2-a^2* b^2)=0
			//两根x1,x2= [-b±√(b^2-4ac)]/2a
			var numA=(Math.pow(b,2)+Math.pow(a,2)*Math.pow(k1,2));//a
			var numB= 2*(Math.pow(a,2))*k1*b1-(2*Math.pow(b,2)*h)-(2*(Math.pow(a,2))*k*k1);//b
			var numC=(Math.pow(b,2))*(Math.pow(h,2))+(Math.pow(a,2))*(Math.pow(b1,2))-2*Math.pow(a,2)*k*b1+Math.pow(a,2)*Math.pow(k,2)-Math.pow(a,2)*Math.pow(b,2);//c
			var x1=(-numB+Math.sqrt((Math.pow(numB,2)-4*numA*numC)))/(2*numA);
			var x2=(-numB-Math.sqrt((Math.pow(numB,2)-4*numA*numC)))/(2*numA);
			
			//0-90度 求出的x的值就应该大于x
			//90-180 <X
			//180-270 <X
			//270-360>x
			if(angle<=90){
				realX=Math.max(x1,x2);
			}else if(angle<=180){
				realX=Math.min(x1,x2);
			}else if(angle<=270){
				realX=Math.min(x1,x2);
			}else if(angle<=360){
				realX=Math.max(x1,x2);
			}
			
			realY=k1*realX+b1;
			realY=_h-realY;//因为svg的y轴向下是正方向
		}
		return [realX,realY];
	};
	
	function gMap(container){
		mxGraph.call(this, container, this.initModel());
		//this.initTHPGraph();
		this.initMouse();
		this.initMouseWheel();
		this.initManager();
		//设置移动
		this.setPanning(true);
		this.setEnabled(false);
		//设置鼠标左键移动
		this.panningHandler.useLeftButtonForPanning = true;
		//子图元没有减号
		this.foldingEnabled = false;
		//图层对象 {key:name,value:layer}.
		this.layerGroup={};
	}
	gUtil.extend(gMap, mxGraph);
	/**
	 *初始化model。
	 ***/
	gMap.prototype.initModel=function(){
		this.root= new mxCell();
		var cell = new mxCell();
		cell.insert(this.root);
		var model =this.model= new mxGraphModel(cell);
		return model;
	};
	/**
	 *添加图层 
	 ***/
	gMap.prototype.addLayer=function(name){
		var layer=new mxCell();
		this.root.insert(layer);
		layer.name=name;
		this.layerGroup[layer.name]=layer;
		return layer;
	};
	gMap.prototype.initManager=function(){
		this._gGraphicManager=new gGraphicManager(this);
	};
	gMap.prototype.drawGraphics=function(graphicsArr){
		this._gGraphicManager.drawGraphics(graphicsArr);
		
	   	//初始化事件执行
		settings.initScript&&setTimeout(gScript.fireInitListener,1000);
		//定时事件执行
		if(settings.timerEvent&&this.attributes&&this.attributes.timer&&""!=this.attributes.timer){
			setInterval(gScript.fireTimerListener,parseInt(this.attributes.timer));
		}
		//定时更新缓存的数据
		if(settings.isCacheData){
			setInterval(gCache.updateDataCache,parseInt(settings.updateCacheTimer));
		}
		
		//定时更新脚本缓存的数据
		if(settings.isScriptCacheData){
			setInterval(gCache.updateScriptCacheData,parseInt(settings.scriptUpdateCacheTimer));
		}
	};
	
	//初始化鼠标
	gMap.prototype.initMouse=function(){
		
		  var gmap =this;

		  //注册mouseDown事件，如果是在某个cell上发出来，在这个cell上发出onmousePress事件
		  gmap.addMouseListener({
			  
			// 绘制当前对象的样式
			currentState: null,
			//previousStyle: null,
			
			// 鼠标当前所在的Cell，用于检测鼠标移入/移出Cell
			currentCell:null,
			
		    mouseDown: function(sender, me) {
		    	var graphicCell=me.getCell();
		    	//console.log(graphicCell.name);
		    	if(graphicCell!=null&&graphicCell.attributes.onMousePress&&graphicCell.attributes.onMousePress!=""){
		    		graphicCell.fireCustomerListener("onMousePress");

		    	}
		    	if(graphicCell!=null&&graphicCell.getParent){
		    		var parent = graphicCell.getParent();
		    		while(parent){
				    	if(parent!=null&&parent.attributes&&parent.attributes.onMousePress&&parent.attributes.onMousePress!=""){
				    		parent.fireCustomerListener("onMousePress");
				    	}
				    	parent = parent.getParent();
		    		}
		    	}

		    },
		    mouseMove: function(sender, me)
		    {    
		    	 if (this.currentState != null && me.getState() == this.currentState)
			        {
			            return;
			        }
			        var tmp = gmap.view.getState(me.getCell());
			        // Ignores everything but vertices
			        if (gmap.isMouseDown || (tmp != null && !
			        		gmap.getModel().isVertex(tmp.cell)))
			        {
			        	tmp = null;
			        }
			        if (tmp != this.currentState)
			        {
			            if (this.currentState != null)
			            {
			            	//console.log("onHoverLeave");
			            	var graphicCell=currentCell;
			            	if(graphicCell!=null&&graphicCell.attributes.onHoverLeave&&graphicCell.attributes.onHoverLeave!=""){
			            		graphicCell.fireCustomerListener("onHoverLeave");
					    	}
			            	currentCell=null;
			            }
			            this.currentState = tmp;
			            if (this.currentState != null)
			            {
			            	//console.log("onHoverEnter");
			            	var graphicCell=me.getCell();
			            	currentCell=graphicCell;
			            	if(graphicCell!=null&&graphicCell.attributes.onHoverEnter&&graphicCell.attributes.onHoverEnter!=""){
			            		graphicCell.fireCustomerListener("onHoverEnter");
			            	}
			            }
			        }
		    },
		    mouseUp: function(sender, me) {
		    	//console.log("mouseup");
		    }
		    
		  });
	}
	
	
	gMap.prototype.initMouseWheel=function(){
		//初始化鼠标滚轮
		mxEvent.addMouseWheelListener(mxUtils.bind(this, function(evt, up){
			if (true){
				var source = mxEvent.getSource(evt);
				while (source != null){
					if (source == this.container){
						cursorPosition = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
						this.MapZoom(up,true,cursorPosition);
						mxEvent.consume(evt);
				
						return;
					}
					
					source = source.parentNode;
				}
			}
		}));
	};
	//鼠标缩放
	gMap.prototype.MapZoom=function(up,center,cursorPosition){
		var factor=caculateFactor(up,this);
		factor = Math.max(0.01, Math.min(this.view.scale * factor, 160)) / this.view.scale;
		this.zoom(factor,true,cursorPosition);
		function caculateFactor(zoomIn,graph){
			var cumulativeZoomFactor=1;
			//计算缩放比例
			if (zoomIn)
			{
				if (graph.view.scale * cumulativeZoomFactor < 0.15)
				{
					cumulativeZoomFactor = (graph.view.scale + 0.01) / graph.view.scale;
				}
				else
				{
					// Uses to 5% zoom steps for better grid rendering in webkit
					// and to avoid rounding errors for zoom steps
					cumulativeZoomFactor *= graph.zoomFactor;
					cumulativeZoomFactor = Math.round(graph.view.scale *cumulativeZoomFactor * 20) / 20 / graph.view.scale;
				}
			}
			else
			{
				if (graph.view.scale * cumulativeZoomFactor <= 0.15)
				{
					  cumulativeZoomFactor = (graph.view.scale - 0.01) / graph.view.scale;
				}
				else
				{
					// Uses to 5% zoom steps for better grid rendering in webkit
					// and to avoid rounding errors for zoom steps
					  cumulativeZoomFactor /= graph.zoomFactor;
					  cumulativeZoomFactor = Math.round(graph.view.scale *   cumulativeZoomFactor * 20) / 20 / graph.view.scale;
				}
			}
			cumulativeZoomFactor = Math.max(0.01, Math.min(graph.view.scale *   cumulativeZoomFactor, 160) / graph.view.scale);
			return cumulativeZoomFactor;
		}
	};
	/**
	 *缩放重新绘制 
	 ***/
	mxGraph.prototype.zoom = function(factor,center,cursorPosition){
		center = (center != null) ? center : this.centerZoom;
		var scale = Math.round(this.view.scale * factor * 100) / 100;
		var state = this.view.getState(this.getSelectionCell());
		factor = scale / this.view.scale;
		
		if (this.keepSelectionVisibleOnZoom && state != null)
		{
			var rect = new mxRectangle(state.x * factor, state.y * factor,
				state.width * factor, state.height * factor);
			this.view.scale = scale;
			if (!this.scrollRectToVisible(rect))
			{
				this.view.revalidate();
				// Forces an event to be fired but does not revalidate again
				this.view.setScale(scale);
			}
		}
		else
		{
			var hasScrollbars = mxUtils.hasScrollbars(this.container);
			
			if (center && !hasScrollbars)
			{
				var dx = this.container.offsetWidth;
				var dy = this.container.offsetHeight;
				
				if (factor > 1)
				{
					var f = (factor - 1) / (scale * 2);
					dx *= -f;
					dy *= -f;
					if(cursorPosition!=null){
						dx=cursorPosition.x*2*-f;
						dy=cursorPosition.y*2*-f;
					}
				}
				else
				{
					var f = (1 / factor - 1) / (this.view.scale * 2);
					dx *= f;
					dy *= f;
					if(cursorPosition!=null){
						dx=cursorPosition.x*2*f;
						dy=cursorPosition.y*2*f;
					}
				}
				
				this.view.scaleAndTranslate(scale,
					this.view.translate.x + dx,
					this.view.translate.y + dy);
			}
			else
			{
				// Allows for changes of translate and scrollbars during setscale
				var tx = this.view.translate.x;
				var ty = this.view.translate.y;
				var sl = this.container.scrollLeft;
				var st = this.container.scrollTop;
				
				this.view.setScale(scale);
				
				if (hasScrollbars)
				{
					var dx = 0;
					var dy = 0;
					
					if (center)
					{
						dx = this.container.offsetWidth * (factor - 1) / 2;
						dy = this.container.offsetHeight * (factor - 1) / 2;
					}
					
					this.container.scrollLeft = (this.view.translate.x - tx) * this.view.scale + Math.round(sl * factor + dx);
					this.container.scrollTop = (this.view.translate.y - ty) * this.view.scale + Math.round(st * factor + dy);
				}
			}
		}
		
	};
	/**
	 *绘制图表与按钮等
	 *graphic gGraphic对象
	 ***/
	gMap.prototype.convertValueToString=function(graphic){
		if(graphic.name=="dsChartItem"){
			//1.获取echart要加载的数据
			//2.设置echarts属性
			//3.动态创建div(node)
			//4.将node添加到body中
			//5.设置echarts实例到node中
			var sid=graphic._uuid;
            var node=document.getElementById(sid);
            var myChart =null;
            if(!node){
            	node = document.createElement('div');
                node.style.width=graphic.geometry.width-20+"px";
                node.style.height=graphic.geometry.height-30+"px";
            	node.setAttribute('id', sid);
                document.body.appendChild(node);
                myChart = echarts.init(document.getElementById(sid));
            }else{
            	myChart = graphic.chart;
                node.style.width=graphic.geometry.width-20+"px";
                node.style.height=graphic.geometry.height-30+"px";
                myChart.resize();
            }
            
            if(!graphic.isTimerInterval){
                var chartJson = graphic.attributes;
                chartJson.legendFontColor=chartJson["legend.labelColor"];
                chartJson.legendFont=chartJson["legend.font"]||"";
                chartJson.xTitleBrush=chartJson["axist.titleBrush"]||"";
                chartJson.xTitleFont=chartJson["axist.titleFont"]||"";
                chartJson.xTitleText=chartJson["axist.titleText"]||"";
                chartJson.xLabelsFont=chartJson["axist.labelsFont"]||"";
                chartJson.yFormat=chartJson["axis2.format"]||"";
                chartJson.yLabelsColor=chartJson["axis2.labelsColor"]||"";
                chartJson.yLabelsFont=chartJson["axis2.labelsFont"]||"";
                chartJson.yTitleBrush=chartJson["axis2.titleBrush"]||"";
                chartJson.yTitleFont=chartJson["axis2.titleFont"]||"";
                chartJson.yTitleText=chartJson["axis2.titleText"]||"";
                var _legendArr=[];
                var _seriesDataArr=[];
                var  seriArr=chartJson.seriesList.split(" ");
                
                graphic.isTimerInterval=false;//组件自身是否支持动态刷新数据的功能，ture支持动态刷新，false不支持动态刷新
                var allTimerInterval = "";
                for(var i=0;i<seriArr.length;i++){
                	var color=chartJson[seriArr[i]+".color"];
                	var label=chartJson[seriArr[i]+".label"];
                	var value=chartJson[seriArr[i]+".value"];
                	var valueKey = seriArr[i]+".value";
                	var name=null;
                	if(undefined==chartJson[seriArr[i]+".name"]||null==chartJson[seriArr[i]+".name"]||""==chartJson[seriArr[i]+".name"]){
                		name=chartJson[seriArr[i]+".label"];
                	}else{
                		name=chartJson[seriArr[i]+".name"];
                	}
                	var timerInterval=chartJson[seriArr[i]+".timerInterval"];
                	if(undefined!=timerInterval&&""!=timerInterval){
                		graphic.isTimerInterval=true;
                	}else{
                		graphic.isTimerInterval=false;
                	}
                	
                	_legendArr.push(color,label,value,name,timerInterval);
                	var seriesDataObj={
                			color:color,
                			label:label,
                			value:String(value),
                			name:name,
                			timerInterval:timerInterval,
                			valueKey:valueKey
                	};
                	_seriesDataArr.push(seriesDataObj);
                }
                chartJson.legend=_legendArr;
                chartJson.series=_seriesDataArr;
                	
                
                
                var chartOptions={
                		//backgroundColor:gUtil.subColor(chartJson.brushColor),使用透明度解决背景问题
                        legend:{
                        	show:(function () {
                        		if(chartJson['legend.visible']&&"false"==chartJson['legend.visible']){
                        			return false;
                                }
                        		return true;
                            }()),
                            top: 0,
                            //orient:'vertical',
                            textStyle:(function () {
                                var legendColor = chartJson.legendFontColor?gUtil.subColor(chartJson.legendFontColor):'#fff';
                                var legendFont = chartJson.legendFont.split(",");
                                var legendFontFamily =legendFont[0];
                                var legendFontSize =legendFont[1]!=='-1'?Number(legendFont[1]):Number(legendFont[2]);
                                return {
                                    color:legendColor,
                                    fontFamily:legendFontFamily?legendFontFamily:'sans-serif',
                                    fontSize:legendFontSize?legendFontSize:7
                                }
                            }()),
        					data:(function () {
        						var legend = chartJson.legend;
        						if(chartJson.echartType.toLowerCase().indexOf('line')>0){
        							return legend;
        						}else{
                                    var series = chartJson.series;
                                    var names=[];
                                    for(var i=0;i<series.length;i++){
                                        names.push(series[i].name);
                                    }
                                    return names;
        						}

                            }())
                        },
                        trigger:{
                            trigger:'axis',
        					show:true
                        },
                        xAxis:{
                            type:chartJson.echartType.toLowerCase().indexOf('hrizontal')<0?'category':'value',
                        	show:chartJson.echartType.toLowerCase().indexOf('pie')<0,
                            name:chartJson.xTitleText,
                            nameTextStyle:(function () {
                                var xTitleColors = chartJson.xTitleBrush.split(",");
                                var xTitleColor = xTitleColors[1]?gUtil.subColor(xTitleColors[1]):'#fff';
                                var xTitleFont = chartJson.xTitleFont.split(",");
                                var xTitleFontFamily =xTitleFont[0];
                                var xTitleFontSize =xTitleFont[1]!=='-1'?Number(xTitleFont[1]):Number(xTitleFont[2]);
                                return {
                                    color:xTitleColors[0]!=='0'?xTitleColor:'#fff',
                                    fontFamily:xTitleFontFamily?xTitleFontFamily:'sans-serif',
                                    fontSize:xTitleFontSize?xTitleFontSize:12
                                }
                            }()),
                            axisLabel:(function () {
                                var xLabelColor =chartJson.xLabelsColor?gUtil.subColor(chartJson.xLabelsColor):'#fff';
                                var xLabelFont = chartJson.xLabelsFont.split(",");
                                var xLabelFontFamily =xLabelFont[0];
                                var xLabelFontSize =xLabelFont[1]!=='-1'?Number(xLabelFont[1]):Number(xLabelFont[2]);
                                return {
                                    color:xLabelColor,
                                    fontFamily:xLabelFontFamily?xLabelFontFamily:'sans-serif',
                                    fontSize:xLabelFontSize?xLabelFontSize:12
                                }
                            }()),
        					min:chartJson.xMin&&(Number(chartJson.xMax)-Number(chartJson.xMin))?Number(chartJson.xMin):null,
        					max:chartJson.xMax&&(Number(chartJson.xMax)-Number(chartJson.xMin))?Number(chartJson.xMax):null,
                            interval:(function () {
                            	var xMax = Number(chartJson.xMax);
                            	var xMin = Number(chartJson.xMin);
                            	var xTickCount = Number(chartJson.xTickCount);
                            	if(xMax&&xMin&&xTickCount&&(xMax-xMin)!==0){
        							return parseInt((xMax-xMin)/(xTickCount-1));
        						}else{
                            		return null;
        						}
                            }()),
        					splitLine:{
                            	show:chartJson.xGridVisible==='false'?false:true
        					},
                            axisLine:{
                                onZero:false
        					},
                            // axisTick:{
                            //     alignWithLabel:true
                            // },
        					data:(function () {
                                var xf=chartJson.xFormat;
                                var xTickCount = Number(chartJson.xTickCount);
                                var xSpan = Number(chartJson.xSpan);
                                if(xf&&xTickCount&&xSpan){
                                    return gUtil.getNowFormatDate(xTickCount,xSpan,xf);
                                }else if(xTickCount&&xTickCount!==0){
                                	var xMax = Number(chartJson.xMax);
                                	var xMin = Number(chartJson.xMin);
                                	if((xMax-xMin)===0){
                                		return[xMax]
        							}
                                    var data=[];
                                    for(var i=0;i<xTickCount;i++){
                                        data.push(xMin+parseInt(((xMax-xMin)/xTickCount)*i));
                                    }
                                    return data;
                                }else{
                                	//以后视情况修改
                                	return [];
        						}
                            }())
                        },
                        yAxis:{
                        	type:chartJson.echartType.toLowerCase().indexOf('hrizontal')<0?'value':'category',
                        	show:chartJson.echartType.toLowerCase().indexOf('pie')<0,
                            name:chartJson.yTitleText,
                            nameTextStyle:(function () {
                                var yTitleColors = chartJson.yTitleBrush.split(",");
                                var yTitleColor = gUtil.subColor(yTitleColors[1]);
                                var yTitleFont = chartJson.yTitleFont.split(",");
                                var yTitleFontFamily =yTitleFont[0];
                                var yTitleFontSize =yTitleFont[1]!=='-1'?Number(yTitleFont[1]):Number(yTitleFont[2]);
                                return {
                                    color:yTitleColors[0]!=='0'?yTitleColor:'#fff',
                                    fontFamily:yTitleFontFamily?yTitleFontFamily:'sans-serif',
                                    fontSize:yTitleFontSize?yTitleFontSize:12
                                }
                            }()),
                            axisLabel:(function () {
                                var yLabelColor =chartJson.yLabelsColor?gUtil.subColor(chartJson.yLabelsColor):'#fff';
                                var yLabelFont = chartJson.yLabelsFont.split(",");
                                var yLabelFontFamily =yLabelFont[0];
                                var yLabelFontSize =yLabelFont[1]!=='-1'?Number(yLabelFont[1]):Number(yLabelFont[2]);
                                //console.log(yLabelColor);
                                return {
                                    color:yLabelColor,
                                    fontFamily:yLabelFontFamily?yLabelFontFamily:'sans-serif',
                                    fontSize:yLabelFontSize?yLabelFontSize:12
                                }
                            }()),
                            min:chartJson.yMin&&(Number(chartJson.yMax)-Number(chartJson.yMin))?Number(chartJson.yMin):null,
                            max:chartJson.yMax&&(Number(chartJson.yMax)-Number(chartJson.yMin))?Number(chartJson.yMax):null,
                            interval:(function () {
                                var yMax = Number(chartJson.yMax);
                                var yMin = Number(chartJson.yMin);
                                var yTickCount = Number(chartJson.yTickCount);
                                if(yMax&&yMin&&yTickCount&&(yMax-yMin)!==0){
                                    return parseInt((yMax-yMin)/(yTickCount-1));
                                }else{
                                    return null;
                                }
                            }()),
                            splitLine:{
                                show:chartJson.yGridVisible==='false'?false:true
                            },
                            data:(function () {
                                var yf=chartJson.yFormat;
                                var yTickCount = Number(chartJson.yTickCount);
                                var ySpan = Number(chartJson.ySpan);
                                var yMax = Number(chartJson.yMax);
                                var yMin = Number(chartJson.yMin);
                                if(yf&&yTickCount&&ySpan){
                                    return gUtil.getNowFormatDate(yTickCount,ySpan,yf);
                                }else if(yTickCount&&yTickCount!==0){
                                	if((yMax-yMin)===0){
                                		return [yMax]
        							}
                                    var data=[];
                                    for(var i=0;i<yTickCount;i++){
                                        data.push(yMin+parseInt(((yMax-yMin)/yTickCount)*i));
                                    }
                                    return data;
        						}else{
                                    //以后视情况修改
                                    return [];
                                }
                            }())
                        },
        				series:(function () {
        					if(chartJson.echartType.toLowerCase().indexOf('line')>=0){
        						var colors = ['#209fdf','#99ca53','#f6a625'];
        						var lines=[];
        						var series = chartJson.series;
        						for(var i=0;i<series.length;i++){
        							var line = {
        								type:'line',
                                        symbol:'rect',
        								name:series[i].name,
        								valueKey:series[i].valueKey,
                                        itemStyle:{
                                            normal:{
                                                color:series[i].color?gUtil.subColor(series[i].color):colors[i]
                                            }
                                        },
        								data:(function(i){
        									var data= series[i].value.split(',');
        									for(var j=0;j<data.length;j++){
                                                data[j]=Number(data[j]);
        									}
        									return data;
                                        }(i))
        							};
                                    lines.push(line);  
        						}
        						return lines;
        					}else if(chartJson.echartType.toLowerCase().indexOf('pie')>=0){
                                 var colors = ['#209fdf','#99ca53','#f6a625'];
                                 var pie = {
                                    type:'pie',
                                    label: {
                                        normal: {
                                           show: false
                                       }
                                    },
                                   labelLine: {
                                       normal: {
                                           show: false
                                       }
                                   },
                                   radius : (function(){
                                        var data= chartJson.series;
                                        var temp = 0.88;
                                        var rad=[0,(temp*100)+"%"];
                                        if(chartJson['series.holeSize']&&""!=chartJson['series.holeSize']){
                                        	var str=(Number(chartJson['series.holeSize'])*100*temp).toFixed(2);
                                            str+="%";
                                        	rad[0]=str;
                                        }
                                        return rad;
                                    }()),
                                    data:(function(){
                                        var data= chartJson.series;
                                        var pies=[];
                                        for(var i=0;i<data.length;i++){
                                        	//console.log(data[i]);
                                            pies.push({
                                            	name:data[i].label,
                                            	value:Number(data[i].value),
        										label:{
                                            		normal:{
                                            			position:'outside'
        											}
        										},
                                                itemStyle:{
                                            		normal:{
                                            			color:data[i].color?gUtil.subColor(data[i].color):colors[i]
        											}
        										}
                                            });
                                        }
                                        return pies;
                                    }())
                                };
                                return pie;
        					}else if(chartJson.echartType.toLowerCase().indexOf('bar')>=0){
                                var colors = ['#209fdf','#99ca53','#f6a625'];
                                var bars=[];
                                var series = chartJson.series;
                                for(var i=0;i<series.length;i++){
                                    //console.log(series[i]);
                                    var bar = {
                                        type:'bar',
                                        name:series[i].label,
                                        itemStyle:{
                                            normal:{
                                                color:series[i].color?gUtil.subColor(series[i].color):colors[i]
                                            }
                                        },
                                        data:(function(i){
                                            var data= series[i].value.split(',');
                                            for(var j=0;j<data.length;j++){
                                                data[j]=Number(data[j]);
                                            }
                                            return data;
                                        }(i))
                                    };
                                    bars.push(bar);
                                }
                                return bars;
                            }
                        }())
                    };
        			myChart.setOption(chartOptions);
            }

    		graphic.chart = myChart;
    			
			if(graphic.isTimerInterval&&!graphic.isTimerIntervalRun){
				var count = 6;
    			setInterval(function (){
    				option = graphic.chart.getOption();
    			    axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
    			    var chartJson = graphic.attributes;
    			    for(var i=0;i< option.series.length;i++){
    			    	 var data = option.series[i].data;
    			    	 if(data.length>=count){
    			    		 data.shift();
    			    	 }
    			    	 data.push(chartJson[option.series[i].valueKey]);
    			    }
   			    	 if(option.xAxis[0].data.length>=count){
   	      			    option.xAxis[0].data.shift();
   			    	 }
    			    option.xAxis[0].data.push(axisData);

    			    myChart.setOption(option);
    			}, 1000);
    			graphic.isTimerIntervalRun = true;
			}
            return node;
		}else if(graphic.name=="dsUiItem"){//如果模型是dsUiItem
			var edoc=document.getElementById(graphic._uuid);
			if(edoc){//无为空。更新
				edoc.style.width=graphic.geometry.width+"px";
				edoc.style.height=graphic.geometry.height+"px";
				return edoc;
			}else{//为空创建
				var node = document.createElement('input');
				node.type = 'button';
				node.value = graphic.attributes.text;
				node.style.width=graphic.geometry.width+"px";
				node.style.height=graphic.geometry.height+"px";
				node.setAttribute('id', this._uuid);
				document.body.appendChild(node);
				return node;
			}
		}
		return _gMapConvertValueToString.apply(this, arguments);
	};
	/**
	 *设置画布样式
	 * 
	 ***/
	gMap.prototype.setCanvasStyle=function(attr){
		this.container.style.width=attr.rect.split(",")[2]+"px";
		this.container.style.height=attr.rect.split(",")[3]+"px";
		this.container.style.backgroundColor = gUtil.subColor(attr.color);
		this.container.style.color= gUtil.subColor(attr.foregroundColor);
		this.attributes=attr;
	};
	
	
/*	mxShape.prototype.updateTransform = function(c, x, y, w, h)
	{
		// NOTE: Currently, scale is implemented in state and canvas. This will
		// move to canvas in a later version, so that the states are unscaled
		// and untranslated and do not need an update after zooming or panning.
		c.scale(this.scale);
		var cx=x + w / 2;
		var cy=y + h / 2;
		if(this.rotationCx!=null){
			cx=this.rotationCx;
		}
		if(this.rotationCy!=null){
			cy=this.rotationCy;
		}
		c.rotate(this.getShapeRotation(), this.flipH, this.flipV, cx, cy);
	};
	
	mxShape.prototype.apply = function(state)
	{
		this.state = state;
		this.style = state.style;

		if (this.style != null)
		{
			this.fill = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, this.fill);
			this.gradient = mxUtils.getValue(this.style, mxConstants.STYLE_GRADIENTCOLOR, this.gradient);
			this.gradientDirection = mxUtils.getValue(this.style, mxConstants.STYLE_GRADIENT_DIRECTION, this.gradientDirection);
			this.opacity = mxUtils.getValue(this.style, mxConstants.STYLE_OPACITY, this.opacity);
			this.fillOpacity = mxUtils.getValue(this.style, mxConstants.STYLE_FILL_OPACITY, this.fillOpacity);
			this.strokeOpacity = mxUtils.getValue(this.style, mxConstants.STYLE_STROKE_OPACITY, this.strokeOpacity);
			this.stroke = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, this.stroke);
			this.strokewidth = mxUtils.getNumber(this.style, mxConstants.STYLE_STROKEWIDTH, this.strokewidth);
			this.spacing = mxUtils.getValue(this.style, mxConstants.STYLE_SPACING, this.spacing);
			this.startSize = mxUtils.getNumber(this.style, mxConstants.STYLE_STARTSIZE, this.startSize);
			this.endSize = mxUtils.getNumber(this.style, mxConstants.STYLE_ENDSIZE, this.endSize);
			this.startArrow = mxUtils.getValue(this.style, mxConstants.STYLE_STARTARROW, this.startArrow);
			this.endArrow = mxUtils.getValue(this.style, mxConstants.STYLE_ENDARROW, this.endArrow);
			this.rotation = mxUtils.getValue(this.style, mxConstants.STYLE_ROTATION, this.rotation);
			this.direction = mxUtils.getValue(this.style, mxConstants.STYLE_DIRECTION, this.direction);
			this.flipH = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPH, 0) == 1;
			this.flipV = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPV, 0) == 1;	
			this.rotationCx = mxUtils.getValue(this.style, "rotationCx", null);
			this.rotationCy = mxUtils.getValue(this.style, "rotationCy", null);	
			
			// Legacy support for stencilFlipH/V
			if (this.stencil != null)
			{
				this.flipH = mxUtils.getValue(this.style, 'stencilFlipH', 0) == 1 || this.flipH;
				this.flipV = mxUtils.getValue(this.style, 'stencilFlipV', 0) == 1 || this.flipV;
			}
			
			if (this.direction == mxConstants.DIRECTION_NORTH || this.direction == mxConstants.DIRECTION_SOUTH)
			{
				var tmp = this.flipH;
				this.flipH = this.flipV;
				this.flipV = tmp;
			}

			this.isShadow = mxUtils.getValue(this.style, mxConstants.STYLE_SHADOW, this.isShadow) == 1;
			this.isDashed = mxUtils.getValue(this.style, mxConstants.STYLE_DASHED, this.isDashed) == 1;
			this.isRounded = mxUtils.getValue(this.style, mxConstants.STYLE_ROUNDED, this.isRounded) == 1;
			this.glass = mxUtils.getValue(this.style, mxConstants.STYLE_GLASS, this.glass) == 1;
			
			if (this.fill == mxConstants.NONE)
			{
				this.fill = null;
			}

			if (this.gradient == mxConstants.NONE)
			{
				this.gradient = null;
			}

			if (this.stroke == mxConstants.NONE)
			{
				this.stroke = null;
			}
		}
	};*/
	
	
	