/**
 * Copyright(c) 2018-2020, All Rights Reserved.
 * Project: ModelService 
 * Author: wh and lvdf
 * Createdate: 2018-03-28
 * Version: 1.2
 */
	
	/**
	 *svg本身左上角是 00.绘制方式是以左上角为基准。
	 *parentcell包含childcell的时候。childcell的起始位置为parentcell左上角00的位置为基准。 
	 *parentrect的重要性，子图形的postion+rect。 减去父亲parentrect才能得出子图形相对于父图形的真正左上角相对位置。
	 ***/
	/**
	 *gGraphic工厂类。用于创建graphic对象
	 *@param graphicObj graphic对象数据
	 *@param parentRect graphic对象父节点rect属性，用于计算子节点位置用。  
	 ***/ 
	function gGraphicFacotry(graphicObj,parentRect){
		var _x=0;
		var _y=0;
		if(parentRect){
			var prectArr=parentRect.split(",");
			_x=-prectArr[0]*1;
			_y=-prectArr[1]*1;
		}
		var gGraphicCell=null;
		if(graphicObj.name=="dsGroupItem"){
			//计算左上角位置
			var rectArr=[0,0];
			if(graphicObj.attributes.rect) rectArr=graphicObj.attributes.rect.split(",");
			var posArr=graphicObj.attributes.position.split(",");
			var x=rectArr[0]*1+posArr[0]*1;
			var y=rectArr[1]*1+posArr[1]*1;
			var geo=new mxGeometry(x+_x,y+_y,rectArr[2]*1,rectArr[3]*1);
			var style = "fillColor=none;strokeColor=none;"
			//var style="fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1;fillOpacity=100;";
			gGraphicCell=new gGraphic("",geo,style);
			gGraphicCell.setVertex(true);
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name="dsGroupItem";
			//gGraphicCell.
			
			
			//return gGraphicCell;
		}else if(graphicObj.name=="dsTextItem"){

			var _scale=1;
			if(graphicObj.attributes.scale) {
				_scale=graphicObj.attributes.scale*1;
			}
			//计算左上角位置
			var rectArr=graphicObj.attributes.rect.split(",");
			var posArr=graphicObj.attributes.position.split(",");
			var x=rectArr[0]*1*_scale+posArr[0]*1;
			var y=rectArr[1]*1*_scale+posArr[1]*1;
		
			var geo=new mxGeometry(_x+x,_y+y,rectArr[2]*1*_scale,rectArr[3]*1*_scale);
			//样式
			var fillColor=gUtil.subColor(graphicObj.attributes.brushColor);
			var strokeColor=gUtil.subColor(graphicObj.attributes.penColor);
			var fontArr=graphicObj.attributes.font.split(",");
			var fontFamily=fontArr[0];
			var fontSize=fontArr[1]*1;
			if(fontSize<0) fontSize=fontArr[2]*1;
			fontSize=fontSize*1*_scale;
			//字体默认位置
			var dir='8';
			if(graphicObj.attributes.alignment) dir=graphicObj.attributes.alignment;
			var vals = gUtil.getFontPostion(dir);	
			var style="text;html=1;fillColor=none;strokeColor=none;fontColor="+strokeColor+";fontSize="+fontSize+";fontFamily="+fontFamily+";labelPosition="+vals[0]+";verticalLabelPosition="+vals[1]+";align="+vals[2]+";verticalAlign="+vals[3]+";";
			//文字内容
			var content=graphicObj.attributes.text;
			gGraphicCell=new gGraphic(content,geo,style);
			gGraphicCell.setVertex(true);
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name="dsTextItem";
			gGraphicCell.fontSize=fontSize;
			//return text;
		
		}else if(graphicObj.name=="dsRectItem"){
			//计算左上角位置
			var rectArr=graphicObj.attributes.rect.split(",");
			var newRect=rectArr;
			if(graphicObj.attributes.transform){
				 var transform=graphicObj.attributes.transform;
				 var transArr=transform.split(",");
				 var a=transArr[0]*1;
				 var b=transArr[1]*1;
				 var c=transArr[2]*1;
				 var d=transArr[3]*1;
				 var e=transArr[4]*1;
				 var f=transArr[5]*1;
				
				 var x=rectArr[0]*1;
				 var y=rectArr[1]*1;
				 //x坐标就是ax+cy+e  
				 //y坐标就是bx+dy+f
				 var newX=a*x+c*y+e;
				 var newY=b*x+d*y+f;
				 newRect=(newX+","+newY+","+rectArr[2]+","+rectArr[3]).split(",");
				
				 var rotation=Math.acos(a)*180/Math.PI;
				 graphicObj.attributes.rotation=rotation;
				 graphicObj.attributes.rect = newRect;
			}
			var posArr=graphicObj.attributes.position.split(",");
			var x=rectArr[0]*1+posArr[0]*1;
			var y=rectArr[1]*1+posArr[1]*1;
			var geo=new mxGeometry(x+_x,y+_y,rectArr[2]*1,rectArr[3]*1);
			//样式 gUtil.subColor(data.attributes.brushColor)
			var fillColor=gUtil.subColor(graphicObj.attributes.brushColor);
			var strokeWidth=graphicObj.attributes.penWidth;
			var _opacity=100;
			if(graphicObj.attributes.brushStyle!='1'){
				fillColor='none';
				_opacity=100;
			}else{
				_opacity=gUtil.subOpacity(graphicObj.attributes.brushColor);
			}
			var strokeColor=gUtil.subColor(graphicObj.attributes.penColor);
			var style="fillColor="+fillColor+";strokeColor="+strokeColor+";strokeWidth="+strokeWidth+";fillOpacity="+_opacity+";";
			
			gGraphicCell=new gGraphic('',geo,style);
			gGraphicCell.setVertex(true);
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name="dsRectItem";
			//return gGraphicCell;
		}else if(graphicObj.name=="dsPinItem"||graphicObj.name=="dsConnectItem"){
			//pinitem不加_x,_y。加上以后位置不对。怀疑是不是跟relative有关系？只有相对于group的才加？
			//计算左上角位置
			var rectArr=graphicObj.attributes.relative.split(",");
			var posArr=graphicObj.attributes.position.split(",");
			var x=rectArr[0]*1+posArr[0]*1;
			var y=rectArr[1]*1+posArr[1]*1;
			var geo=new mxGeometry(x,y,1,1);
			//样式
			var fillColor=gUtil.subColor(graphicObj.attributes.noConnectColor);
			var strokeColor=gUtil.subColor(graphicObj.attributes.noConnectColor);
			var style="fillColor=none;strokeColor=none;";
			
			var gGraphicCell=new gGraphic('',geo,style);
			gGraphicCell.setVertex(true);
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name=graphicObj.name;
			//return gGraphicCell;
		}else if(graphicObj.name=="dsLineItem"||graphicObj.name=="dsConnectLineItem"){
			//计算位置
			
			var pArr=graphicObj.attributes.polygon.trim().split(" ");
			var _scale=1;
			if(graphicObj.attributes.scale) {
				_scale=graphicObj.attributes.scale*1;
			}
			for(var i=0,len=pArr.length;i<len;i++){
				 var xy=pArr[i].split(",");
				 pArr[i]=xy[0]*1*_scale+","+xy[1]*1*_scale;
			}
			var newPolygon="";
			 if(graphicObj.attributes.transform){
				 var transform=graphicObj.attributes.transform;
				 var transArr=transform.split(",");
				 var a=transArr[0]*1;
				 var b=transArr[1]*1;
				 var c=transArr[2]*1;
				 var d=transArr[3]*1;
				 var e=transArr[4]*1;
				 var f=transArr[5]*1;
				 for(var i=0,ilen=pArr.length;i<ilen;i++){
					 var xy=pArr[i].split(",");
					 var x=xy[0]*1;
					 var y=xy[1]*1;
					 var newX=a*x+c*y+e;
					 var newY=b*x+d*y+f;
					 newPolygon+=newX+","+newY+" ";
				 }
				 newPolygon=newPolygon.trim();
				 pArr=newPolygon.split(" ");
				 graphicObj.attributes.polygon = newPolygon;
			 }
			
			
			
			var posArr=graphicObj.attributes.position.split(",");
			var pointsArr=[];
			for(var i=0,len=pArr.length;i<len;i++){
				var _p=pArr[i].split(",");
				pointsArr.push(new mxPoint(_x+posArr[0]*1+_p[0]*1,_y+posArr[1]*1+_p[1]*1));
			}
			var x=pointsArr[0].x;
			var y=pointsArr[0].y;
			var geo=new mxGeometry(x,y,1,1);
			//样式
			var fillColor=gUtil.subColor(graphicObj.attributes.brushColor);
			var strokeColor=gUtil.subColor(graphicObj.attributes.penColor);
			var startArrow='none';
			var startSize=0;
			if(graphicObj.attributes.startArrow&&graphicObj.attributes.startArrow!="0"){
				startArrow="classic";
				if(graphicObj.attributes.startArrowSize&&graphicObj.attributes.startArrowSize!="0") startSize=graphicObj.attributes.startArrowSize*1;
			}
			var endArrow="none";
			var endSize=0;
			if(graphicObj.attributes.endArrow&&graphicObj.attributes.endArrow!="0"){
				endArrow="classic";
				if(graphicObj.attributes.endArrowSize&&graphicObj.attributes.endArrowSize!="0") endSize=graphicObj.attributes.endArrowSize*1;
			}
			
			var dashed="0"
			if(graphicObj.attributes.penStyle&&graphicObj.attributes.penStyle!="0"){
				dashed="1";
			}
			
			var style="startArrow="+startArrow+";startSize="+startSize+";endArrow="+endArrow+";endSize="+endSize+";startSize=4;endArrow=none;fillColor="+fillColor+";strokeColor="+strokeColor+";dashed="+dashed+";";
			
			
			gGraphicCell=new gGraphic('',geo,style);
			gGraphicCell.edge=true;
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name=graphicObj.name;
			gGraphicCell.geometry.setTerminalPoint(pointsArr[0], true);
			gGraphicCell.geometry.setTerminalPoint(pointsArr[pointsArr.length-1], false);
			if(pointsArr.length>2) gGraphicCell.geometry.points=[];
			for(var i=1,len=pointsArr.length;i<len-1;i++){
				gGraphicCell.geometry.points.push(pointsArr[i]);
			}
			//return gGraphicCell;
		}else if(graphicObj.name=="dsEllipseItem"){
			//计算左上角位置
			var rectArr=graphicObj.attributes.rect.split(",");
			var posArr=graphicObj.attributes.position.split(",");
			var x=rectArr[0]*1+posArr[0]*1;
			var y=rectArr[1]*1+posArr[1]*1;
			var geo=new mxGeometry(_x+x,_y+y,rectArr[2]*1,rectArr[3]*1);
			//样式 
			var fillColor='none'
			if(graphicObj.attributes.brushStyle){
				if(graphicObj.attributes.brushStyle=='1'){
					fillColor=gUtil.subColor(graphicObj.attributes.brushColor);
				}else{
					fillColor='none';
				}
			}else{
				fillColor='none';
			}
			
			//if(!graphicObj.attributes.brushStyle||graphicObj.attributes.brushStyle=='1')fillColor='none';
			var strokeColor=gUtil.subColor(graphicObj.attributes.penColor);
			var style="shape=arcShape;perimeter=ellipsePerimeter;fillColor="+fillColor+";strokeColor="+strokeColor+";";
			
			gGraphicCell=new gGraphic('',geo,style);
			gGraphicCell.arc=graphicObj.attributes.arc;
			gGraphicCell.startAngle=graphicObj.attributes.startAngle*1||0;
			gGraphicCell.spanAngle=graphicObj.attributes.spanAngle*1||360;
			
			gGraphicCell.setVertex(true);
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name="dsEllipseItem";
			//return gGraphicCell;
		}else if(graphicObj.name=="dsPixmapItem"){
			var _scale=1;
			if(graphicObj.attributes.scale) _scale=graphicObj.attributes.scale*1;
			//计算左上角位置
			var rectArr=graphicObj.attributes.rect.split(",");
			var posArr=graphicObj.attributes.position.split(",");
			var x=rectArr[0]*1*_scale+posArr[0]*1;
			var y=rectArr[1]*1*_scale+posArr[1]*1;
			var geo=new mxGeometry(_x+x,_y+y,rectArr[2]*1*_scale,rectArr[3]*1*_scale);
			//样式 gUtil.subColor(data.attributes.brushColor)
			var fillColor='none';
			var strokeColor='none';
			var style="shape=image;imageAspect=0;image="+ settings.xjResURL+graphicObj.attributes.imagefile+";fillColor="+fillColor+";strokeColor="+strokeColor+";";
			
			gGraphicCell=new gGraphic('',geo,style);
			gGraphicCell.setVertex(true);
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name="dsPixmapItem";
			//return gGraphicCell;
		}else if(graphicObj.name=="dsUiItem"){
			//计算左上角位置
			var rectArr=[0,0];
			if(graphicObj.attributes.rect) rectArr=graphicObj.attributes.rect.split(",");
			var posArr=graphicObj.attributes.position.split(",");
			var x=rectArr[0]*1+posArr[0]*1;
			var y=rectArr[1]*1+posArr[1]*1;
			var geo=new mxGeometry(x+_x,y+_y,rectArr[2]*1,rectArr[3]*1);
			gGraphicCell=new gGraphic("",geo,"fillColor=none;strokeColor=none;");
			gGraphicCell.setVertex(true);
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name="dsUiItem";
			gGraphicCell._uuid=gUtil.createUUID();
			//return gGraphicCell;
		}else if(graphicObj.name=="dsChartItem"){
			var rectArr=[0,0];
			if(graphicObj.attributes.chartRect) rectArr=graphicObj.attributes.chartRect.split(",");
			var posArr=graphicObj.attributes.position.split(",");
			var x=rectArr[0]*1+posArr[0]*1;
			var y=rectArr[1]*1+posArr[1]*1;
			var geo=new mxGeometry(x+_x,y+_y,rectArr[2]*1,rectArr[3]*1);
			gGraphicCell=new gGraphic("",geo,"fillColor=none;strokeColor=none;");
			gGraphicCell.setVertex(true);
			gGraphicCell.attributes=graphicObj.attributes;
			gGraphicCell.name="dsChartItem";
			gGraphicCell._uuid=gUtil.createUUID();
			
		}else{
			console.log(graphicObj.name);
		}
		
		//处理layer，许继的xml中layer应该为大于0的整数，对于小于0的，强制设置为0
		if(gGraphicCell&&gGraphicCell.attributes.layer&&"-1"==gGraphicCell.attributes.layer){
			gGraphicCell.attributes.layer = "0";
		}
		
		//添加数据初始化缓存
		if(gGraphicCell&&gGraphicCell.attributes.tableName&&gGraphicCell.attributes.recordId&&
				""!=gGraphicCell.attributes.tableName&&""!=gGraphicCell.attributes.recordId){
			gCache.addObserver(gGraphicCell.attributes.tableName+':'+gGraphicCell.attributes.recordId,gGraphicCell);
		}
		//添加初始化事件处理
		if(gGraphicCell&&gGraphicCell.attributes.initScript&&""!=gGraphicCell.attributes.initScript){
			gScript.addInitListener(gGraphicCell);
		}
		//添加定时事件处理
		if(gGraphicCell&&gGraphicCell.attributes.timerEvent&&""!=gGraphicCell.attributes.timerEvent){
			gScript.addTimerListener(gGraphicCell);
		}
		
		return gGraphicCell;
	}
	
	
	