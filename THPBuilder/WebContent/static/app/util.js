/************工具类*************/
	/**********************************/
	var gUtil={
		//图形中会触发的脚本名称
		configListener:["onMousePress","initScript","timerEvent","valueChange"],
		//预留接口 动态添加会触发脚本
		addConfigListener:function(name){
			configListener.push(name);
		},
		//创建uuid
		createUUID:function(){
			var s = [];
		    var hexDigits = "0123456789abcdef";
		    for (var i = 0; i < 36; i++) {
		        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		    }
		    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		    s[8] = s[13] = s[18] = s[23] = "-";
		    var uuid = s.join("");
		    return uuid;
		},
		//继承
		extend: function(ctor, superCtor){
			var f = function() {};
			f.prototype = superCtor.prototype;
			
			ctor.prototype = new f();
			ctor.prototype.constructor = ctor;
		},
		inherits:function(childCtor, parentCtor) {
			  childCtor.prototype = Object.create(parentCtor.prototype);
			  childCtor.prototype.constructor = childCtor;
		},
		/*16进制颜色转截取*/  
		subColor : function(str){  
		    var sColor = str; 
		    if(sColor && sColor.length === 9){  
		        return "#"+sColor.substring(3);
		    }else{  
		        return sColor;    
		    }  
		}, 
		/*16进制颜色转截取*/  
		subOpacity : function(str){  
		    var sColor = str; 
		    if(sColor && sColor.length === 9){
		    	return parseInt(sColor.substring(1,3),16)/255*100;
		    }else{  
		        return 100;    
		    }  
		}, 
		/*16进制颜色转为RGB格式*/  
		colorRgb : function(str){  
		    var sColor = str.toLowerCase(str); 
		    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;  
		    if(sColor && reg.test(sColor)){  
		        if(sColor.length === 4){  
		            var sColorNew = "#";  
		            for(var i=1; i<4; i+=1){  
		                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
		            }  
		            sColor = sColorNew;  
		        }  
		        //处理六位的颜色值  
		        var sColorChange = [];  
		        for(var i=1; i<7; i+=2){  
		            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
		        }  
		        return "RGB(" + sColorChange.join(",") + ")";  
		    }else{  
		        return sColor;    
		    }  
		}, 
		/*RGB颜色转换为16进制*/  
		colorHex : function(str){  
		    var that = str;  
		    if(/^(rgb|RGB)/.test(that)){  
		        var aColor = that.replace(/(?:||rgb|RGB)*/g,"").split(",");  
		        var strHex = "#";  
		        for(var i=0; i<aColor.length; i++){  
		            var hex = Number(aColor[i]).toString(16);  
		            if(hex === "0"){  
		                hex += hex;   
		            }  
		            strHex += hex;  
		        }  
		        if(strHex.length !== 7){  
		            strHex = that;    
		        }  
		        return strHex;  
		    }else if(reg.test(that)){  
		        var aNum = that.replace(/#/,"").split("");  
		        if(aNum.length === 6){  
		            return that;      
		        }else if(aNum.length === 3){  
		            var numHex = "#";  
		            for(var i=0; i<aNum.length; i+=1){  
		                numHex += (aNum[i]+aNum[i]);  
		            }  
		            return numHex;  
		        }  
		    }else{  
		        return that;      
		    }  
		},
		styleToJson:function(style){
			var retObj={};
			//"shape=deviceShape;rotation=90;textColor=#ff000000;" --->  "shape=deviceShape;rotation=90;textColor=#ff000000"
			if(style.trim().endsWith(";")) style=style.substring(0,style.length-1);
			//"shape=deviceShape;rotation=90;textColor=#ff000000"  --->   [shape=deviceShape,rotation=90,textColor=#ff000000]
			var attrValArr=style.split(";");
			for(var i=0,len=attrValArr.length;i<len;i++){
				//shape=deviceShape --->  [shape,deviceShape]
				var av=attrValArr[i].split("=");
				retObj[av[0]]=av[1];
			}
			return retObj;
		},
		endWith:function(par,str){ 
			var reg=new RegExp(str+"$"); 
			return reg.test(par); 
		}, 
		guid:function(){
			function S4() {
			       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			    }
			return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		},
		getNowFormatDate:function(){
			var date = new Date();
		    var seperator1 = "-";
		    var seperator2 = ":";
		    var month = date.getMonth() + 1;
		    var strDate = date.getDate();
		    if (month >= 1 && month <= 9) {
		        month = "0" + month;
		    }
		    if (strDate >= 0 && strDate <= 9) {
		        strDate = "0" + strDate;
		    }
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		            + " " + date.getHours() + seperator2 + date.getMinutes()
		            + seperator2 + date.getSeconds();
		    return currentdate;
		},
		clone:function(oldObj){
			var newObj={};
			for(var key in oldObj){
				newObj[key]=oldObj[key];
			}
			return newObj;
		},
		deepClone:function(source) {
			var result={};
			if(source instanceof Array) result=[];
			for (var key in source) {
			      result[key] = typeof source[key]==='object'? this.deepClone(source[key]):source[key];
			   } 
			   return result; 
		},
		//许继字体
		 lset : {
			 //labelPosition,verticalLabelPosition;align;verticalAlign
			'topLeft': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP],
			'topRight': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP],
			'bottomLeft': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM],
			'bottomRight': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM],
			'left': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE],
			'right': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE],
			'top': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP],
			'bottom': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM],
			'center': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE]
		},
		//获取字位置
		getFontPostion:function(num){
			var directions={
				   '0':gUtil.lset.topLeft,
				   '1':gUtil.lset.topRight,
				   '2':gUtil.lset.bottomLeft,
				   '3':gUtil.lset.bottomRight,
				   '4':gUtil.lset.left,
				   '5':gUtil.lset.right,
				   '6':gUtil.lset.top,
				   '7':gUtil.lset.bottom,
				   '8':gUtil.lset.center
				}; 
			return directions[num];
		}
	};