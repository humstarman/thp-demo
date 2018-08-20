/**
 * Copyright(c) 2018-2020, All Rights Reserved.
 * Project: ModelService 
 * Author: wh and lvdf
 * Createdate: 2018-03-28
 * Version: 1.2
 */
	
	/**
	 *图形模型的元素管理器。主要用于组装与绘制gGraphic
	 *@param map 浏览器的图形组件.
	 ***/
	function gGraphicManager(map){
		this.map=map;
		this.referDeviceObj={};//引用的图形结构
	}
	/**
	 *绘制Graphics
	 *@param  graphicsArr 要绘制的graphic对象数组
	 ***/
	gGraphicManager.prototype.drawGraphics=function(graphicsArr){
		/**
		 *1.开始事物
		 *2.获取引用设备结构
		 *3.组装graphics对象
		 *4.结束事物并开始绘制
		 ***/
		this.map.getModel().beginUpdate();
		try{
			this.referDeviceObj=graphicsArr.model;
			for(var i=0,len=graphicsArr.view.length;i<len;i++){
				this.drawGraphic(graphicsArr.view[i],this.map.root);
			}
		}finally{
			this.map.getModel().endUpdate();
		}
	};
	
	var getSubGraphic=function(gGraphic,name){
		  if(gGraphic.childlist&&gGraphic.childlist.length>0){
			   for(var i=0;i<gGraphic.childlist.length;i++){
				   if(gGraphic.childlist[i].attributes["name"]==name){
					   return gGraphic.childlist[i];
				   }
			   }
		  }
		  return null;
     };
	
	
	
     /**
 	 *获取所有父亲图形旋转累加 
 	 **/
 	gGraphicManager.prototype.getAllParentRotation=function(graphic){
 		if(graphic&&graphic.attributes.rotation&&graphic.attributes.rotation!="0"){
 			this._tmpRotation+=graphic.attributes.rotation*1;
 		}
 		if(graphic.parent){
 			this.getAllParentRotation(graphic.parent);
 		}
 	};
	/**
	 *组装Graphic对象
	 *@param graphicObj  graphic对象数据
	 ***/
	gGraphicManager.prototype.drawGraphic=function(graphicObj,parentGraphic){
		/**
		 *1.如果graphicObj是引用文件类型,获取引用文件类型的结构 
		 *2.创建Graphic对象
		 *3.将Graphic对象添加到map中
		 ***/
		if(graphicObj.attributes.xmlns.indexOf(".xml")!=-1){
			//现在对象要将引用的设备属性冲洗掉,所以属性要重新赋值
			//(比如你现在对象属性attribute.postion='11,12'.引用对象文件的postion是'22,22'.那么要将新的11,12赋值过去。)
			var newAttributes=gUtil.clone(graphicObj.attributes);
			//获取引用文件结构
			graphicObj=this.referDeviceObj[graphicObj.attributes.xmlns+"\\"+graphicObj.name];
			if(!graphicObj)return;
			//graphicObj应该clone一下。要不然会造成引用的错误。上一个属性还对下一个用作用
			graphicObj=gUtil.deepClone(graphicObj);
			//将之前的旧属性冲掉换成新的引用属性。如果有新属性就添加，并且将复合属性(a1.e1.a2.tableName)的值，赋值到子图元上(a2.rotation)
			for(var key in newAttributes){
				graphicObj.attributes[key]=newAttributes[key];
				if(graphicObj.name=="dsGroupItem"&&key.indexOf(".")>0){
					  var keys = key.split(".");
					  var tempGraphic =graphicObj;
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
						  tempGraphic.attributes[keys[keys.length-1]]=newAttributes[key];
					  }
				}
			}
		}
		var rect="0,0"
		if(parentGraphic.geometry){
			rect = parentGraphic.attributes.rect;
		}
		
		var graphic=this.createGraphic(graphicObj,rect);
		

		if(graphic){
			//添加到父对象中
			if(graphic.attributes.layer){
				parentGraphic.insert(graphic,graphic.attributes.layer);
			}else{
				parentGraphic.insert(graphic);
			}
			
			//处理子对象
			if(graphicObj.childlist&&graphicObj.childlist.length>0){
				for(var i=0,len=graphicObj.childlist.length;i<len;i++){
					var childGraphicObj=graphicObj.childlist[i];
					this.drawGraphic(graphicObj.childlist[i],graphic);
				}
			}
			
			
			//图形本身旋转
			if(graphic.attributes.rotation&&graphic.attributes.rotation!="0"){
				graphic._setRotation(graphic.attributes.rotation*1);
				console.log(graphic.name +"="+graphic.attributes.rotation);				
				//alert(graphic.name +"="+graphic.attributes.rotation);
			}
		}
		

		
		

	};
	/**
	 *创建Graphic对象
	 *@param graphicObj graphic对象数据
	 ***/
	gGraphicManager.prototype.createGraphic=function(graphicObj,parentRect){
		/**
		 *1.创建graphic对象
		 *2.创建graphic子对象
		 *3.返回graphic对象
		 ***/
		var parent=gGraphicFacotry(graphicObj,parentRect);
		if(parent){
			parent.map=this.map;
			return parent;
		}else{
			if(graphicObj.name=="dsViewItem"){
				this.map.setCanvasStyle(graphicObj.attributes);
			}else{
				console.log(graphicObj);
			}
			return null;
		}
	};

	 /**
	  *创建旋转点(测试用)
	  *pArr:Array 坐标数组 格式[0,1] 
	  ***/
	 gGraphicManager.prototype._createRotatePoint=function(pArr){
			var geo=new mxGeometry(pArr[0]*1,pArr[1]*1,0.1,0.1);
			//样式
			var style="fillColor=black;strokeColor=black;";
			var rotatePoint=new gGraphic('',geo,style);
			rotatePoint.setVertex(true);
			this.map.addCell(rotatePoint);
	 };
	 /**
	 *添加附着文字
	 *@param graphicObj graphic对象数据
	 ***/
	 gGraphicManager.prototype.addAttachText=function(graphicObj){
		 //attachText是设备附着文字 如变压器的pb
		if(graphicObj.attributes.attachText&&graphicObj.attributes.attachText!=""
			&&graphicObj.attributes.attachTextRect&&graphicObj.attributes.attachTextRect!=""){
			var rectArr=[0,0];
			if(graphicObj.attributes.rect){
				rectArr=graphicObj.attributes.rect.split(",");
			}else if(graphicObj.attributes.polygon){
				rectArr=graphicObj.attributes.polygon.split(" ")[0].split(",");
			}
			
			var posArr=graphicObj.attributes.position.split(",");
			var attachTextRect=graphicObj.attributes.attachTextRect.split(",");
			
			var x=rectArr[0]*1+posArr[0]*1+attachTextRect[0]*1;
			var y=rectArr[1]*1+posArr[1]*1+attachTextRect[1]*1;
			var geo=new mxGeometry(x,y,attachTextRect[2]*1,attachTextRect[3]*1);
			//样式
			var strokeColor=gUtil.subColor(graphicObj.attributes.attachTextColor);
			//var fontArr=graphicObj.attributes.font.split(",");
			var fontFamily="宋体";
			var fontSize=12;
			if(fontSize<0) fontSize=fontArr[2]*1;
			//字体默认位置
			var dir='8';
			if(graphicObj.attributes.attachTextAlign) {
				var tmpNum=Number(graphicObj.attributes.attachTextAlign);
				if(tmpNum>8) dir='8';
				else dir=tmpNum;
			}
			var vals = gUtil.getFontPostion(dir);	
			var style="text;html=1;fillColor=none;strokeColor=none;fontColor="+strokeColor+";fontSize="+fontSize+";fontFamily="+fontFamily+";labelPosition="+vals[0]+";verticalLabelPosition="+vals[1]+";align="+vals[2]+";verticalAlign="+vals[3]+";";
			//文字内容
			var content=graphicObj.attributes.attachText;
			var text=new gGraphic(content,geo,style);
			text.setVertex(true);
			text.attributes=graphicObj.attributes;
			text.name="attachText";
			
			if(text.attributes.rotation&&text.attributes.rotation!="0"){
				this.rotateGraphic(text,text.attributes.rotation*1,text.attributes.position.split(","));
			}
			
			this.map.addCell(text);
			return text;
		};
	 };
	 /**
	  *gGraphic旋转 
	  *@param gGraphic 对象
	  *@param rotation 旋转角度
	  *@param parentRect 子相对于父的旋转坐标  （如果是父图形这个参数没啥用） 
	  *@param posArr Array[1,2] 旋转坐标数组 （如果是子图形这个参数没啥用） 
	  * *@param realRectFlag 是否是真是的rect(许继的图形会存在当前线路没有选择，他的父也没有选择，而是他父亲的父亲旋转了)。这个时候旋转点坐标就不是rect的xy了。而是rect的width和height。不知道为啥。
	  *注意:子图形是相对于父图形的位置旋转.所以子图形选择的话要是相对于父亲的位置
	  *相对旋转坐标计算方式。 
	  *父亲绝对左上角坐标是position+rect。父亲绝对旋转坐标是postion。
	  *子相对于父的旋转坐标就是 postion-(position+rect)。 
	  *这里有个疑问按照许继的旋转方式还应该加上子的postion才是真正的旋转点。但是这样会有问题，参考以下xml。
	  *断路器包含的矩形dsRectItem。如果要是加上position未免太大了？都不知道跑到哪了。
	   *<dsGroupItem xmlns="e8k" layer="0" position="51.4492,97.2224"  element="断路器" 
	   * 	<dsRectItem xmlns="e8k" position="298.333,257">
	   *  	</dsRectItem>
    	*</dsGroupItem>
	  ***/
	 gGraphicManager.prototype.rotateGraphic=function(gGraphic,rotation,posArr,parentRect,realRectFlag,parent){
			var px=posArr[0]*1;
			var py=posArr[1]*1;
			 if(parentRect){
				var rectArr=parentRect.split(",");
				px=px-rectArr[0]*1;
				py=py-rectArr[1]*1;
			}
			gGraphic._rotate=rotation;
			//线路存在特殊情况。
			/******************start*********************/
			if(gGraphic.isEdge()&&parentRect){
				var rectArr=parentRect.split(",");
				var _px=Math.abs(-rectArr[0]*1);
				var _py=Math.abs(-rectArr[1]*1);
				//误差像素重新计算旋转坐标(mxgraph本身计算会有偏差)
				if((_px*2<(rectArr[2]*1-5))&&(_py*2<(rectArr[3]*1-5))&&!parent){
					var groupRotation=rotation*1;
					var width=rectArr[2]*1;
				    var height=rectArr[3]*1;
					
					var sourcePoint=gGraphic.geometry.sourcePoint;
					var newSourcePoint=this.rotatePoint(sourcePoint.x,sourcePoint.y,0,0,groupRotation);
					gGraphic.geometry.setTerminalPoint(new mxPoint(newSourcePoint[0]+width,newSourcePoint[1]+height), true);
					
					var targetPoint=gGraphic.geometry.targetPoint;
					var newTagPoint=this.rotatePoint(targetPoint.x,targetPoint.y,0,0,groupRotation);
					gGraphic.geometry.setTerminalPoint(new mxPoint(newTagPoint[0]+width,newTagPoint[1]+height), false);
					
					// Translate the control points
					if (gGraphic.geometry.points != null)
					{
						for (var i = 0; i < gGraphic.geometry.points.length; i++)
						{
							if (gGraphic.geometry.points[i] != null)
							{
								//var pt = mxUtils.getRotatedPoint(this.points[i], cos, sin, cx);
								var pt=this.rotatePoint(gGraphic.geometry.points[i].x,gGraphic.geometry.points[i].y,0,0,groupRotation);
								gGraphic.geometry.points[i].x = Math.round(pt.x);
								gGraphic.geometry.points[i].y = Math.round(pt.y);
							}
						}
					}
					/******************end*********************/
				}else{
					if(realRectFlag){
						px=rectArr[2]*1/2;
						py=rectArr[3]*1/2;
					}
				    gGraphic.geometry.rotate(rotation,new mxPoint(px,py));
					this.map.setCellStyles("rotation",rotation,[gGraphic]);
				}
				
				
			}else{
				if(gGraphic.isVertex()&&parent&&parent.isVertex()){
					var geo=parent.geometry;
					var w=geo.width;
					var h=geo.height;
					gGraphic.geometry.x=gGraphic.geometry.x*w;
					gGraphic.geometry.y=gGraphic.geometry.y*h;
					gGraphic.geometry.relative=false;
				}
				gGraphic.geometry.rotate(rotation,new mxPoint(px,py));
				this.map.setCellStyles("rotation",rotation,[gGraphic]);
				if(gGraphic.isVertex()&&parent&&parent.isVertex()){
					var geo=parent.geometry;
					gGraphic.updateGeometry(geo.x+","+geo.y+","+geo.width+","+geo.height);
				}
			
			}
		 };
		 /**
		  *计算旋转后的坐标
		  *@param originX 原点x
		  *@param originY 原点y
		  *@param rotatePointX 旋转点x
		  *@param rotatePointY 旋转点y
		  *@param rotation 旋转角度
		  ***/
		 gGraphicManager.prototype.rotatePoint=function(originX,originY,rotatePointX,rotatePointY,rotation){
				var rotation = parseFloat(rotation);
				var rad = mxUtils.toRadians(rotation);
				var cos = Math.cos(rad);
				var sin = Math.sin(rad);
				
				//x1=(x-xcenter)cos@-(y-ycenter)sin@+xcenter;
				//y1=(x-xcenter)sin@+(y-ycenter)cos@+ycenter;
				var newX=(originX*1-rotatePointX*1)*cos-(originY*1-rotatePointY*1)*sin+rotatePointX*1;
				var newY=(originX*1-rotatePointX*1)*sin+(originY*1-rotatePointY*1)*cos+rotatePointY*1;
				
				return [newX,newY];
		};
	
	