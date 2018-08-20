/**
 * Copyright(c) 2018-2020, All Rights Reserved.
 * Project: ModelService 
 * Author: wh and lvdf
 * Createdate: 2018-03-28
 * Version: 1.2
 */
	
	/**
	 *图形模型的元素。代表了图形中的基本图形、线路和组
	 *@param value 可选。图形模型的值。
	 *@param geometry 可选。指定的几何对象。
	 *@param style 可选。定义样式的格式化字符串。
	 ***/
	function gGraphic(value, geometry, style){
		mxCell.call(this, value, geometry, style);
		this.map=null;
	}
	gUtil.extend(gGraphic, mxCell);
	
	
	/**
	 *获取指定图元gGraphic的所有dsRectItem，dsLineItem子图元，用于画笔和画刷着色
	 *@param gGraphic 
	 ***/
	var getAllSubGraphic=function(gGraphic,subGraphics){
		  if(gGraphic.children&&gGraphic.children.length>0){
			   for(var i=0;i<gGraphic.children.length;i++){
				   if(gGraphic.children[i].name=="dsRectItem"||gGraphic.children[i].name=="dsLineItem"){
					   subGraphics.push(gGraphic.children[i]);
				   }else if(gGraphic.children[i].name=="dsGroupItem"){
					   getAllSubGraphic(gGraphic.children[i],subGraphics);
				   }
			   }
		  }
    };
	
	
	/**
	 *设置线条颜色
	 *@param color 颜色
	 ***/
	gGraphic.prototype.setLineColor=function(color){
		if(this.name=="dsGroupItem"){
			if(this.children&&this.children.length>0){
				var children = [];
				getAllSubGraphic(this,children);
				this.map.setCellStyles("strokeColor",gUtil.subColor(color),children);
			}
		}else{
			this.map.setCellStyles("strokeColor",gUtil.subColor(color),[this]);
		}
	};
	/**
	 *设置线条宽度
	 *@param width number 宽度
	 ***/
	gGraphic.prototype.setLineWidth=function(width){
		this.map.setCellStyles("strokeWidth",width,[this]);
	};

	/**
	 *设置图形填充颜色
	 *@param color 
	 ***/
	gGraphic.prototype.setFillColor=function(color){
		if(this.name=="dsGroupItem"){
			//dsGroupItem画笔和画刷都递归作用到子节点上
			if(this.children&&this.children.length>0){
				var children =[];
				getAllSubGraphic(this,children);
				this.map.setCellStyles("fillColor",gUtil.subColor(color),children);
			}
		}else{
			this.map.setCellStyles("fillColor",gUtil.subColor(color),[this]);
		}
	};
	/**
	 *更改图片地址
	 *@param src 新的图片地址
	 ***/
	gGraphic.prototype.setImage=function(src){
		this.map.setCellStyles("image",src,[this]);
	};
	/**
	 *设置图形整体透明度
	 *@param opacity 
	 ***/
	gGraphic.prototype.setOpacity=function(opacity){
		this.map.setCellStyles("opacity",opacity,[this]);
	};
	/**
	 *设置图形填充透明度
	 *@param opacity 
	 ***/
	gGraphic.prototype.setFillOpacity=function(opacity){
		this.map.setCellStyles("fillOpacity",opacity,[this]);
	};
	/**
	 *设置图形线条透明度
	 *@param opacity 
	 ***/
	gGraphic.prototype.setStrokeOpacity=function(opacity){
		this.map.setCellStyles("strokeOpacity",opacity,[this]);
	};
	/**
	 *设置图形文字字体
	 *@param fontFamily 
	 ***/
	gGraphic.prototype.setFontFamily=function(fontFamily){
		this.map.setCellStyles("fontFamily",fontFamily,[this]);
	};
	/**
	 *设置图形文字大小
	 *@param fontSize 
	 ***/
	gGraphic.prototype.setFontSize=function(fontSize){
		this.map.setCellStyles("fontSize",fontSize,[this]);
	};
	/**
	 *设置图形文字style
	 *@param fontStyle 
	 ***/
	gGraphic.prototype.setFontStyle=function(fontStyle){
		this.map.setCellStyles("fontStyle",fontStyle,[this]);
	};
	/**
	 *设置图形文字颜色
	 *@param fontColor 
	 ***/
	gGraphic.prototype.setFontColor=function(fontColor){
		this.map.setCellStyles("fontColor",gUtil.subColor(fontColor),[this]);
	};
	/**
	 *更改文字位置 
	 *@param dir 代表文字位置标识0-8.详细见utils
	 ***/
	gGraphic.prototype.updateTextPosition=function(dir){
		var vals = gUtil.getFontPostion(dir);
		this.map.setCellStyles("labelPosition",vals[0],[this]);
		this.map.setCellStyles("verticalLabelPosition",vals[1],[this]);
		this.map.setCellStyles("align",vals[2],[this]);
		this.map.setCellStyles("verticalAlign",vals[3],[this]);
	};
	/**
	 *更改文字内容
	 *@param content 
	 ***/
	gGraphic.prototype.updateTextContent=function(content){
		this.value=content;
		this.map.refresh(this);
	};
	/**
	 *设置图形旋转
	 *@param content 
	 ***/
	gGraphic.prototype.setRotation=function(angel,center){
		if(center){
			var px=center[0]*1;
			var py=center[1]*1;
			if(this.isVertex()&&this.parent.isVertex()){
				var geo=this.parent.geometry;
				var w=geo.width;
				var h=geo.height;
				this.geometry.x=this.geometry.x*w;
				this.geometry.y=this.geometry.y*h;
				this.geometry.relative=false;
			}
			this.geometry.rotate(angel*1,new mxPoint(px,py));
			
		}
		this.map.setCellStyles("rotation",angel*1,[this]);
		if(this.isVertex()&&this.parent.isVertex()){
			var geo=this.parent.geometry;
			this.updateGeometry(geo.x+","+geo.y+","+geo.width+","+geo.height);
		}
	};
	/**
	 *设置图形旋转
	 *@param content 
	 ***/
	gGraphic.prototype._setRotation=function(angel,center){
		var px=0;
		var py=0;
		var newCenter=[0,0];
		if(center){
			//if(this.isVertex()&&this.parent.isVertex()){
				var prectArr=[0,0];
				if(this.parent.attributes.rect){
					prectArr=this.parent.attributes.rect.split(",");
				}
				px= -prectArr[0]*1;
				py= -prectArr[1]*1;
			//}
			this.geometry.relative=false;
			newCenter=[center[0]*1,center[1]*1];
			//单独处理线旋转
			//if(!this.isVertex()){
				//var _pArr=this.attributes.position.split(",");
				//var polygon =this.attributes.polygon.split(" ");
				//var xy=polygon[0].split(",");
				//this.geometry.rotate(angel*1,new mxPoint(-(_pArr[0]*1+xy[0]*1-px),-(_pArr[1]*1+xy[1]*1-py)));
			//}else{
				this.geometry.rotate(angel*1,new mxPoint(px,py));
			//}
			if(this.attributes.transform&&this.attributes.rotation){
				this.map.setCellStyles("rotation",angel*1 + this.attributes.rotation*1,[this]);
			}else{
				this.map.setCellStyles("rotation",angel*1,[this]);
			}
		}

		if(!center){
			var _pArr=this.attributes.position.split(",");
			//计算真正的旋转坐标
			var prectArr = [0,0];
			if(this.parent&&this.parent.attributes&&this.parent.attributes.rect){
				prectArr=this.parent.attributes.rect.split(",");
			}
			//旋转坐标=(子pos+父pos)-父左上角=(子pos+父pos)-(父rect+父pos)=子pos-父rect=(50,25)
			px=_pArr[0]*1-prectArr[0]*1;
			py=_pArr[1]*1-prectArr[1]*1;
			//this.geometry.relative=true;
			this.geometry.rotate(angel*1,new mxPoint(px,py));
			//this.geometry.relative=false;
			newCenter=[px,py];
			this.map.setCellStyles("rotation",angel*1,[this]);
		}
		//this.style = this.style+"rotation="+angel+";rotationCx="+px+";rotationCy="+py+";";
		
		//旋转子孩子
		if(this.children&&this.children.length>0){
			for(var i=0,len=this.children.length;i<len;i++){
				var child=this.children[i];
				child._setRotation(angel*1,newCenter);
			}
			//this.map.setCellStyles("rotation",_rotate,this.children);
		}
		
		if(this.isVertex()&&this.parent.isVertex()){
			var geo=this.parent.geometry;
			//this.updateGeometry(geo.x+","+geo.y+","+geo.width+","+geo.height);
		}
	};
	/**
	 *设置椭圆跨角
	 *@param spanAngle 跨角
	 *@param startAngle 起始角 可选参数。默认是0
	 ***/
	gGraphic.prototype.setAngle=function(spanAngle,startAngle){
		if(!startAngle) startAngle=0;
		if(startAngle<0) startAngle=startAngle+360;
		this.startAngle=startAngle;
		this.spanAngle=spanAngle;
		this.map.setCellStyles("startAngle",startAngle,[this]);
		this.map.setCellStyles("spanAngle",spanAngle,[this]);
	};
	/**
	 *更新子图元的geometry
	 *@param Rect 父亲图形的包裹矩形
	 *
	 *1.将图形设置成绝对百分比坐标
	 *2.根据父亲的宽高计算图形起始位置的百分比
	 ***/
	//mxgraph虽然是相对位置了，但是如果cell里面本身包含子图形旋转后他会有1.多像素的偏差。图形换算成百分比的方式就不会出现偏差
	gGraphic.prototype.updateGeometry=function(parentRect){
		this.geometry.relative=true;
		if(this.isVertex()&&parentRect){
			var pRectArr=parentRect.split(",");
			var w=pRectArr[2]*1;
			var h=pRectArr[3]*1;
			this.geometry.x=this.geometry.x/w;
			this.geometry.y=this.geometry.y/h;
		}
	};
	/**
	 *旋转子图元(比如开关分合).动态属性修改
	 *@parent parentGraphic 父亲图形gGraphic对象
	 *
	 *1.循环拿到父亲图形中还有.rotation的名称
	 *2.判读是否是当前图形的属性
	 *3.是的话。计算图形旋转点位置。进行旋转
	 *	图形的话需要多判断一步，将百分比转成像素坐标。旋转完后，还需要将坐标换成百分比。
	 ***/
	gGraphic.prototype.rotateChild=function(parentGraphic){
		for(var key in parentGraphic.attributes){
			if(key.indexOf(".rotation")!=-1){
				var childRotateName=key.substring(0,key.indexOf(".rotation"));
				var _rotate=parentGraphic.attributes[key]*1;
				if(this.attributes.name==childRotateName){
					var _pArr=this.attributes.position.split(",");
					var px=_pArr[0]*1;
					var py=_pArr[1]*1;
					if(this.isVertex()&&parentGraphic.attributes.rect){
						var pRectArr=parentGraphic.attributes.rect.split(",");
						var w=pRectArr[2]*1;
						var h=pRectArr[3]*1;
						this.geometry.x=this.geometry.x*w;
						this.geometry.y=this.geometry.y*h;
						this.geometry.relative=false;
					}
					//就算真正的旋转坐标
					if(parentGraphic.attributes.rect){
						var rectArr=parentGraphic.attributes.rect.split(",");
						if(parentGraphic.attributes.rotation&&parentGraphic.attributes.rotation!="0"){
							var rotation = parseFloat(parentGraphic.attributes.rotation*1);
							var rad = mxUtils.toRadians(rotation);
							var cos = Math.cos(rad);
							var sin = Math.sin(rad);
							var originX=px;
							var originY=py;
							//var pArr=parentGraphic.attributes.position.split(",");
							//var rotatePointX=pArr[0]*1;
							//var rotatePointY=pArr[1]*1;
							//x1=(x-xcenter)cos@-(y-ycenter)sin@+xcenter;
							//y1=(x-xcenter)sin@+(y-ycenter)cos@+ycenter;
							px=(originX*1)*cos-(originY*1)*sin;
							py=(originX*1)*sin+(originY*1)*cos;
						}
						//旋转坐标=(子pos+父pos)-父左上角=(子pos+父pos)-(父rect+父pos)=子pos-父rect=(50,25)
						px=px-rectArr[0]*1;
						py=py-rectArr[1]*1;
					}
					
					this.geometry.rotate(_rotate,new mxPoint(px,py));
					this.map.setCellStyles("rotation",_rotate,[this]);
					//旋转子孩子
					if(this.children&&this.children.length>0){
						for(var i=0,len=this.children.length;i<len;i++){
							var child=this.children[i];
							if(child.isEdge()){
								child.geometry.rotate(_rotate,new mxPoint(px,py));
								this.map.setCellStyles("rotation",_rotate,[child]);
							}
						}
						//this.map.setCellStyles("rotation",_rotate,this.children);
					}
					//如果选择的是图形而不是线路的话需要在将geometry换算会百分比
					if(this.isVertex()&&parentGraphic.attributes.rect){
						this.updateGeometry(parentGraphic.attributes.rect);
					}
				}
			}
		}
	};
	
	/**
	 *触发图元绑定的事件
	 *@param name 事件名称
	 *
	 ***/
	gGraphic.prototype.fireCustomerListener=function(name){
		var context=null;
		if(!this.scriptContext){
			context = new gScript.scriptContext(this);
			this.scriptContext=context;
		}else{
			context =this.scriptContext;
		}

    	if(this.attributes[name]&&this.attributes[name]!=""){
    		if(!this[name]){
    			this[name] = new Function("item","view","page","data","ctrl",this.attributes[name]);
    		}
    		this[name](context.item,context.view,context.page,context.data,context.ctrl);
    	}
	};
	
	/**
	 *获取真正相对旋转的父亲rect 
	 ***/
	gGraphic.prototype.getRealParentRect=function(parentGraphic){
		if(parentGraphic&&parentGraphic.attributes.rotation&&parentGraphic.attributes.rotation!="0"){
			return parentGraphic.attributes.rect;
		}else{
			if(parentGraphic.parent) return this.getRealParentRect(parentGraphic.parent);
		}
	};
