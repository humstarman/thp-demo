(function (root, factory) {
if (typeof define === 'function' && define.amd) {
define([], factory);
} else if (typeof module === 'object' && module.exports) {
module.exports = factory();
} else {
root.GModel = factory();
}
}(this, function () {
/**@desc
 * 全局类
 * @class
 */
GModel={
    forceIncludes:false,

    /**
     * @property {mxGraph} graph mxGraph实例的引用
     */
    graph:null,
    /**
     * @function
     * @param {mxGraph} graph mxGraph实例
     */
    init:function (graph) {
        /**
         * Function: clone
         *
         * Recursively clones the specified object ignoring all fieldnames in the
         * given array of transient fields. <mxObjectIdentity.FIELD_NAME> is always
         * ignored by this function.
         *
         * Parameters:
         *
         * obj - Object to be cloned.
         * transients - Optional array of strings representing the fieldname to be
         * ignored.
         * shallow - Optional boolean argument to specify if a shallow clone should
         * be created, that is, one where all object references are not cloned or,
         * in other words, one where only atomic (strings, numbers) values are
         * cloned. Default is false.
         */
        mxUtils.clone=function(obj, transients, shallow)
        {
            shallow = (shallow != null) ? shallow : false;
            var clone = null;

            if (obj != null && typeof(obj.constructor) == 'function')
            {
                clone = new obj.constructor();

                for (var i in obj)
                {
                    if (i != mxObjectIdentity.FIELD_NAME && (transients == null ||
                            mxUtils.indexOf(transients, i) < 0)&&obj.hasOwnProperty(i))
                    {
                        if (!shallow && typeof(obj[i]) == 'object')
                        {
                            clone[i] = mxUtils.clone(obj[i]);
                        }
                        else
                        {
                            clone[i] = obj[i];
                        }
                    }
                }
            }

            return clone;
        };
        /**
         * Function: clone
         *
         * Returns a clone of the cell. Uses <cloneValue> to clone
         * the user object. All fields in <mxTransient> are ignored
         * during the cloning.
         */
        mxCell.prototype.clone = function()
        {
            var clone = mxUtils.clone(this, this.mxTransient);
            clone.setValue(this.cloneValue());
            var value = clone.getValue();
            if(value instanceof GObject){
                value.mxCell = clone;
            }
            return clone;
        };
        this.graph=graph;
        // Returns canvas with dynamic chart for vertex labels
        var graphConvertValueToString = graph.convertValueToString;
        graph.convertValueToString = function(cell)
        {
            if (cell.value&&(cell.value.constructor===GChart||cell.value instanceof GChart))
            {
                var node = document.createElement('div');
                node.setAttribute('style', 'width:'+cell.geometry.width+"px;height:"+cell.geometry.height+"px;");
                // node.setAttribute('height', cell.geometry.height);

                // Document for empty output if not in DOM
                document.body.appendChild(node);

                var myChart = echarts.init(node);
                myChart.setOption(cell.value.options);
                cell.value.chart = myChart;
                return node;
            }

            return graphConvertValueToString.apply(this, arguments);
        };
        this.graph.addListener(mxEvent.CLICK, function(sender, evt)
        {
            var e = evt.getProperty('event'); // mouse event
            var cell = evt.getProperty('cell'); // cell may be null

            if (cell != null)
            {
                if(cell.value&&(cell.value instanceof GObject)&&cell.value.events&&cell.value.events.click){
                    var func =  new Function('cell',"("+cell.value.events.click+")(cell)");
                    func(cell);
                }
                evt.consume();
            }
        });
    }
};
if(GModel.forceIncludes){
    GModel.include('/GModel/Util.js');
    GModel.include('/GModel/DocumentMap.js');
    GModel.include('/GModel/UnitMap.js');
    GModel.include('/GModel/EnumDeviceType.js');
    GModel.include('/GModel/EnumElectricType.js');
    GModel.include('/GModel/EnumGobjectType.js');
    GModel.include('/GModel/DataDrawingDef.js');
    GModel.include('/GModel/TextDrawStyle.js');
    GModel.include('/GModel/StatusDrawingDef.js');
    GModel.include('/GModel/ShapeDrawStyle.js');
    GModel.include('/GModel/DataMultiStatus.js');
    GModel.include('/GModel/GObject.js');
    GModel.include('/GModel/GDeviceObj.js');
    GModel.include('/GModel/GDataTag.js');
    GModel.include('/GModel/GDevSwitch.js');
    GModel.include('/GModel/GExtendObj.js');
    GModel.include('/GModel/GButton.js');
    GModel.include('/GModel/GImage.js');
    GModel.include('/GModel/GChart.js');
    GModel.include('/GModel/GChartTrend.js');
    GModel.include('/GModel/GChartBar.js');
    GModel.include('/GModel/GChartPie.js');
    GModel.include('/GModel/GChartGauge.js');
    GModel.include('/GModel/GChartScatter.js');
    GModel.include('/GModel/GElectric.js');
    GModel.include('/GModel/GElectricSwitch.js');
    GModel.include('/GModel/GElectricBreaker.js');
    GModel.include('/GModel/GElectricBusbar.js');
    GModel.include('/GModel/GElectricCapacitor.js');
    GModel.include('/GModel/GElectricDistributionTransformer.js');
    GModel.include('/GModel/GElectricGrounding.js');
    GModel.include('/GModel/GElectricHandcartBreaker.js');
    GModel.include('/GModel/GElectricHandcartIsolatorSwitch.js');
    GModel.include('/GModel/GElectricKnifeSwitch.js');
    GModel.include('/GModel/GElectricLoad.js');
    GModel.include('/GModel/GElectricTertiaryTransformer.js');
    GModel.include('/GModel/GElectricTransformer.js');
    GModel.include('/GModel/GModelCodec.js');
}

Util={
    colorToRgba:function(color,opacity){
        if(opacity===undefined||opacity===null){
            opacity=1;
        }
        var sColor = color.toLowerCase();
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i=1; i<4; i+=1) {
                    sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i=1; i<7; i+=2) {
                sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
            }
            sColorChange.push(opacity);
            return "rgba(" + sColorChange.join(",") +")";
        }else if(/^rgb\(([0-9],){2}[0-9]\)/.test(color)){
            return "rgba("+color.slice(0,-1)+","+opacity+")";
        }
        return sColor;
    }
}
GModel.Util = typeof Util !== 'undefined' ? Util : undefined;

/**
 * @typedef {object} GDataTagObject
 * @property {string} name 属性key，即对象属性key
 * @property {string} lable 页面属性名称
 * @property {string} type 属性需要的form表单类型
 * @memberof GModel.DocumentMap
 */

/**
 * @desc
 * 属性组件对应列表，直接点，不必new
 * @class
 * @memberof GModel
 */
DocumentMap = {
    /**
     * @property {Array.<GModel.DocumentMap.GDataTagObject>} GDataTag 包含模型属性的数组
     * @instance
     */
    GDataTag: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        }, {
            name: "measTable",
            label: "测点表",
            type: "input"
        }, {
            name: "measId",
            label: "测点ID",
            type: "input"
        }, {
            name: "measName",
            label: "测点名称",
            type: "input"
        }, {
            name: "valueUnit",
            label: "实际单位",
            type: "input"
        }, {
            name: "dataFormat",
            label: "实际格式",
            type: "input"
        }, {
            name: "dispUnit",
            label: "显示单位",
            type: "input"
        }, {
            name: "bShowPhy",
            label: "显示测点名称",
            type: "booleanRadio"
        }, {
            name: "bShowUnit",
            label: "显示单位",
            type: "booleanRadio"
        }, {
            name: "bShowTime",
            label: "显示时间",
            type: "booleanRadio"
        }
    ],
    GImage: [
        {
            name: "url",
            label: "路径",
            type: "inputImage"
        }
    ],
    GButton: [
        {
            name: "label",
            label: "名称",
            type: "input"
        },
        {
            name: "pageId",
            label: "图层跳转",
            type: "pageSelect"
        }
    ],
    GChartBar: [
        {
            name: "title",
            label: "标题",
            type: "input"
        },
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        },
        {
            name: "dataFormat",
            label: "数据格式",
            type: "dataFormat"
        },
        {
            name: "styleOptions.chartStyle",
            label: "视图样式",
            type: "chartStyle"
        },
        {
            name: "styleOptions.max",
            label: "最大值",
            type: "input"
        },
        {
            name: "styleOptions.min",
            label: "最小值",
            type: "input"
        },
        {
            name: "styleOptions.zero",
            label: "起始值",
            type: "input"
        },
        {
            name: "styleOptions.isInner",
            label: "内部显示",
            type: "isInner"
        },
        {
            name: "styleOptions.foreground",
            label: "前景色",
            type: "colorInput"
        }
    ],
    GChartPie: [
        {
            name: "title",
            label: "标题",
            type: "input"
        },
        {
            name: "dataSrc",
            label: "数据源",
            type: "dataSrc"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "dataIds"
        },
        {
            name: "radius",
            label: "半径",
            type: "input"
        },
        {
            name: "dataFormat",
            label: "数据格式",
            type: "dataFormat"
        },
        {
            name: "isInner",
            label: "内部显示",
            type: "isInner"
        }
    ],
    GChartGauge: [
        {
            name: "title",
            label: "标题",
            type: "input"
        },
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        },
        {
            name: "upper",
            label: "数据上限",
            type: "input"
        },
        {
            name: "lower",
            label: "数据下限",
            type: "input"
        },
        {
            name: "styleOptions.max",
            label: "最大刻度",
            type: "input"
        },
        {
            name: "styleOptions.min",
            label: "最小刻度",
            type: "input"
        },
        {
            name: "showFormat",
            label: "显示格式",
            type: "showFormat"
        }
    ],
    GChartTrend: [
        {
            name: "chartStyle",
            label: "视图样式",
            type: "chartStyle"
        },
        {
            name: "title",
            label: "标题",
            type: "input"
        },
        {
            name: "dataSrc",
            label: "数据源",
            type: "dataSrc"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "dataIds"
        },
        {
            name: "dataFormat",
            label: "数据格式",
            type: "dataFormat"
        },
        {
            name: "background",
            label: "背景色",
            type: "colorInput"
        },
        {
            name: "opacity",
            label: "透明度",
            type: "numberInput"
        },
        {
            name: "startTime",
            label: "开始时间",
            type: "timeSelect"
        },
        {
            name: "endTime",
            label: "结束时间",
            type: "timeSelect"
        },
        {
            name: "multipleScale",
            label: "是否多刻度",
            type: "multipleScale"
        }
    ],
    GChartScatter: [
        {
            name: "title",
            label: "标题",
            type: "input"
        },
        {
            name: "dataSrc",
            label: "数据源",
            type: "dataSrc"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "dataIds"
        },
        {
            name: "dataFormat",
            label: "数据格式",
            type: "dataFormat"
        },
        {
            name: "background",
            label: "背景色",
            type: "colorInput"
        },
        {
            name: "opacity",
            label: "透明度",
            type: "numberInput"
        },
        {
            name: "startTime",
            label: "开始时间",
            type: "timeSelect"
        },
        {
            name: "endTime",
            label: "结束时间",
            type: "timeSelect"
        },
        {
            name: "multipleScale",
            label: "是否多刻度",
            type: "multipleScale"
        }
    ],
    GElectric: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricSwitch: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
        // {
        //     name: "switchStatus",
        //     label: "开关状态",
        //     type: "booleanRadio"
        // }
    ],
    GElectricBreaker: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricBusbar: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricCapacitor: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricDistributionTransformer: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricGrounding: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricHandcartBreaker: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricHandcartIsolatorSwitch: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricKnifeSwitch: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricLoad: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricTertiaryTransformer: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ],
    GElectricTransformer: [
        {
            name: "dataSrc",
            label: "数据源",
            type: "input"
        },
        {
            name: "dataIds",
            label: "测试点",
            type: "input"
        }
    ]
};
GModel.DocumentMap = typeof DocumentMap !== 'undefined' ? DocumentMap : undefined;

/**
 * @desc
 * 数值单位枚举
 * @readonly
 * @enum {number}
 * @memberof GModel.GDataTag
 */
var UnitMap ={
    "w":1,
    "kW":1000,
    "MW":1000000,
    "v":1,
    "kV":1000,
    "MV":1000000
};
GModel.UnitMap = typeof UnitMap !== 'undefined' ? UnitMap : undefined;



var EnumDeviceType = {
    DEV_SUBSTATION:'devSubstation',
    DEV_ACLINE:'devAcline',
    DEV_BUSBAR:'devBusbar',
    DEV_BREAKER:'devBreaker',
    DEV_DISCONNECTOR:'devDisconnector',
    DEV_FUSH:'devFush',
    DEV_TRANSFORMER:'devTransformer',
    DEV_LOAD:'devLoad',
    DEV_GENERATOR:'devGenerator',
    DEV_CAPACITOR:'devCapacitor'
};
GModel.EnumDeviceType = typeof EnumDeviceType !== 'undefined' ? EnumDeviceType : undefined;



var EnumElectricType = {
    G_Electric:'GElectric',
    G_Electric_Switch:'GElectricSwitch'
};
GModel.EnumElectricType = typeof EnumElectricType !== 'undefined' ? EnumElectricType : undefined;


/**
 * 枚举{@link GModel.GObject} 的类型
 * @class
 * @readonly
 * @enum {string}
 * @memberof GModel.GObject
 */
var EnumGobjectType = {
    /**图片 */
    G_IMG:'GImage',
    /**文本 */
    G_TEXT:'GText',
    /**设备 */
    G_DEV:'GDev',
    /**模拟量 */
    G_DATA:'GDataTag',
    /**按钮 */
    G_BUTTON:'GButton',
    /**图形 */
    G_CHART:'GChart',
    /**表格 */
    G_TABLE:'GTable',
    /**仪表盘 */
    G_Electric:'GElectric',
    /**扩展 */
    G_EXTEND:'GExtend',
    G_DATADRAWINGDEF:'DataDrawingDef',
    G_DATAMULTISTATUS:'DataMultiStatus',
    G_STATUSDRAWINGDEF:'StatusDrawingDef',
    G_SHAPEDRAWSTYLE:'ShapeDrawStyle'
};
GModel.EnumGobjectType = typeof EnumGobjectType !== 'undefined' ? EnumGobjectType : undefined;


/**
 * @desc
 * 多态描述类
 * @class
 * @param {number|string} lower 最小值，需要为数值或者数值字符串
 * @param {number|string} upper 最大值，需要为数值或者数值字符串
 * @param {GModel.TextDrawStyle} drawStyle 文本样式
 * @memberof GModel
 */
function DataDrawingDef(lower,upper,drawStyle) {
    GObject.call(this,EnumGobjectType.G_DATADRAWINGDEF);
    this.lower = parseFloat(lower);
    this.upper = parseFloat(upper);
    this.drawStyle = drawStyle;
}
DataDrawingDef.prototype = new GObject();
DataDrawingDef.prototype.constructor = DataDrawingDef;
/**
 * @property {number|string} lower 最小值，需要为数值或者数值字符串   
 * @default
 */
DataDrawingDef.prototype.lower = null;
/**
 * @property {number|string} upper 最大值，需要为数值或者数值字符串  
 * @default
 */
DataDrawingDef.prototype.upper = null;
/**
 * @property {GModel.TextDrawStyle} drawStyle 文本样式 
 * @default
 */
DataDrawingDef.prototype.drawStyle = null;
GModel.DataDrawingDef = typeof DataDrawingDef !== 'undefined' ? DataDrawingDef : undefined;

/**
 * @desc
 * 文本样式
 * @class
 * @param {string} textColor 文本颜色
 * @param {boolean} bBLink 文本闪烁
 * @memberof GModel
 */
function TextDrawStyle(textColor,bBLink) {
    GObject.call(this,EnumGobjectType.G_DATADRAWINGDEF);
    this.textColor = textColor;
    this.bBLink = bBLink;
}
TextDrawStyle.prototype = new GObject();
TextDrawStyle.prototype.constructor = TextDrawStyle;

/**
 * @property {string} textColor 文本颜色
 * @default
 */
TextDrawStyle.prototype.textColor = "#000000";

/**
 * @property {boolean} bBLink 文本闪烁
 * @default false
 */
TextDrawStyle.prototype.bBLink = false;


GModel.TextDrawStyle = typeof TextDrawStyle !== 'undefined' ? TextDrawStyle : undefined;


/**
 * @desc
 * 设备状态模型定义类
 * @class
 * @param {number|string} statusCode 状态码，需要为字符串
 * @param {number|string} statusName 状态名称，需要为字符串
 * @param {[mxCell]} shapeList 形状模型属性列表，需要为mxgraph中的mxCell实例对象的数组
 * @memberof GModel
 */
function StatusDrawingDef(statusCode,statusName,shapeList) {
    GObject.call(this,EnumGobjectType.G_STATUSDRAWINGDEF);
    this.statusCode = statusCode;
    this.statusName = statusName;
    this.shapeList = [];
    if(Array.isArray(shapeList)){
        for(var i=0;i<shapeList.length;i++){
            this.shapeList.push(shapeList[i].clone());
        }
    }
}
StatusDrawingDef.prototype = new GObject();
StatusDrawingDef.prototype.constructor = StatusDrawingDef;
/**
 * @property {number|string} statusCode 状态码，需要为字符串
 * @default
 */
StatusDrawingDef.prototype.statusCode = null;
/**
 * @property {string} statusName 状态名称，需要为字符串
 * @default
 */
StatusDrawingDef.prototype.statusName = null;
/**
 * @property {GModel.TextDrawStyle} shapeList 形状模型属性列表，需要为ShapeDrawStyle对象的数组
 * @default
 */
StatusDrawingDef.prototype.shapeList = [];

StatusDrawingDef.prototype.getStyleAttribute = function (mxCell, styleKey, defValue) {
    var styleMap = {};
    var styleList = mxCell.style.split(";");
    for (var i = 0; i < styleList.length; i++) {
        if (styleList[i] != '') {
            var kv = styleList[i].split("=");
            styleMap[kv[0]] = kv[1];
        }
    }
    if (styleMap[styleKey] && styleMap[styleKey] != '') {
        return styleMap[styleKey];
    } else {
        return defValue;
    }
};
StatusDrawingDef.prototype.setStyleAttribute = function (mxCell, styleKey, styleValue, graph) {
    var styleList = mxCell.style.split(";");
    var isExist=false;
    for (var i = 0; i < styleList.length; i++) {
        if (styleList[i] != '') {
            var kv = styleList[i].split("=");
            if(kv[0]==styleKey){
                styleList[i]=styleKey+'='+styleValue;
                isExist=true;
                break;
            }
        }
    }
    var style='';
    for (var i = 0; i < styleList.length; i++) {
        if (styleList[i] != '') {
            style+=styleList[i]+';';
        }
    }
    if(!isExist){
        style+=styleKey+'='+styleValue+';';
    }
    mxCell.setStyle(style);
    //如果传入画布直接重绘这个mxCell
    if(graph){
        graph.getModel().execute(new mxCellAttributeChange(mxCell, 'style', style));
    }
};
/**
 * @desc
 * 将shapeList的元素实例化为mxCell
 * @function
 */
StatusDrawingDef.prototype.decodeShapeList = function () {
    var list=[];
    if(Array.isArray(this.shapeList)){
        this.shapeList.forEach(function (shape) {
            list.push(new mxCell('', shape.geometry, shape.style));
        });
    }
    this.shapeList=list;
};
/**
 * @desc
 * 将shapeList的元素实例化为ShapeDrawStyle对象便于压缩存储
 * @function
 */
StatusDrawingDef.prototype.encodeShapeList = function () {
    var list=[];
    if(Array.isArray(this.shapeList)){
        this.shapeList.forEach(function (mxCell) {
            list.push(new GModel.ShapeDrawStyle(mxCell.geometry,mxCell.style));
        });
    }
    this.shapeList=list;
};

GModel.StatusDrawingDef = typeof StatusDrawingDef !== 'undefined' ? StatusDrawingDef : undefined;

/**
 * @desc
 * 图形样式
 * @class
 * @param {string} geometry 几何，传入obj对象
 * @param {boolean} style 样式，传入样式字符串
 * @memberof GModel
 */
function ShapeDrawStyle(geometry, style) {
    GObject.call(this, EnumGobjectType.G_SHAPEDRAWSTYLE);
    this.geometry = geometry;
    this.style = style;
}
ShapeDrawStyle.prototype = new GObject();
ShapeDrawStyle.prototype.constructor = ShapeDrawStyle;

/**
 * @property {string} geometry 几何对象
 * @default
 */
ShapeDrawStyle.prototype.geometry = null;

/**
 * @property {boolean} style 样式字符串
 * @default false
 */
ShapeDrawStyle.prototype.style = null;



GModel.ShapeDrawStyle = typeof ShapeDrawStyle !== 'undefined' ? ShapeDrawStyle : undefined;


/**
 * @desc
 * 模拟量多态存储类
 * @class
 * @param {GModel.TextDrawStyle} deNormalSatus 脏数据样式
 * @param {Array.<GModel.DataDrawingDef>} normalStatus 正常数据样式
 * @memberof GModel
 */
function DataMultiStatus(deNormalSatus,normalStatus,msMeasId) {
    GObject.call(this,EnumGobjectType.G_DATAMULTISTATUS);
    this.deNormalSatus = deNormalSatus?deNormalSatus:new TextDrawStyle(null,false);
    this.normalStatus = normalStatus?normalStatus:[];
    this.msMeasId = msMeasId;
}
DataMultiStatus.prototype = new GObject();
DataMultiStatus.prototype.constructor = DataMultiStatus;

/**
 * @property {GModel.TextDrawStyle} deNormalSatus 脏数据样式 
 * @default  new TextDrawStyle(null,false)
 */
DataMultiStatus.prototype.deNormalSatus = new TextDrawStyle(null,false);

/**
 * @property {Array.<GModel.DataDrawingDef>} normalStatus 正常数据样式 
 * @default []
 */
DataMultiStatus.prototype.normalStatus = [];

/**
 * @property {string|number|undefined} msMeasId 多态的测点id，如果为undefined，则测点id值和绑定的测点相等
 * @default null
 */
DataMultiStatus.prototype.msMeasId = null;
GModel.DataMultiStatus = typeof DataMultiStatus !== 'undefined' ? DataMultiStatus : undefined;

/**
 * @classdesc
 * 基类，用于继承，所有模型对象均继承于此类
 * @class
 * @param {GModel.GObject.EnumGobjectType} gobjType 模型类型
 * @memberof GModel
 * @tutorial helloworld
 */

function GObject(gobjType){
    this.gobjType = gobjType;
}

/**
 * @property {string} gobjType 模型类型
 * @default         
 */
GObject.prototype.gobjType = null;


//此处有个大bug，解析xml转为对象的时候，如果为数字字符串，不显示在页面上，是mxgraph的bug

/**
 * @property {string} label 模型所关联图形需要显示的文本   
 * @default        
 */
GObject.prototype.label = '';

/**
 * @desc
 * 此方法用于生成图形上的文本
 * @function 
 */
GObject.prototype.toString = function(){
    return this.label;
}

/**
 * @desc
 * 用于深度复制mxCell的同时深度复制value
 * @function 
 */
GObject.prototype.clone=function(){
    return mxUtils.clone(this,['mxCell','chart']);
}

/**
 * @desc
 * 获取模型属性
 * @function 
 */
GObject.prototype.getAttribute=function(key){
    return this[key];
}

/**
 * @desc
 * 设置模型属性
 * @function 
 */
GObject.prototype.setAttribute=function(key,value){
    this[key] = value;
    var edit = new mxCellAttributeChange(
        this.mxCell, key, value);
      GModel.graph.getModel().execute(edit);
}
GModel.GObject = typeof GObject !== 'undefined' ? GObject : undefined;

function GDeviceObj(mxCell,devId,devType){
    GObject.call(this,EnumGobjectType.G_DEV);
    this.devId = devId;
    this.mxCell = mxCell;
    if(mxCell){
        mxCell.value = this;
    }
    this.devType = devType;
    this.statusMap = new Object();
}
GDeviceObj.prototype = new GObject();
GDeviceObj.prototype.constructor = GDeviceObj;
GDeviceObj.prototype.devId = null;

GDeviceObj.prototype.mxCell = null;

GDeviceObj.prototype.devType = null;

GDeviceObj.prototype.cimobj = null;

GDeviceObj.prototype.statusMap = null;

GDeviceObj.prototype.setStatus = function (string,int) {
    this.statusMap[string] = int;
}
GModel.GDeviceObj = typeof GDeviceObj !== 'undefined' ? GDeviceObj : undefined;


/**
 * @desc
 * 模拟量模型
 * @example
 * ---模拟量---
 * var v3 = graph.insertVertex(parent, null, '', 120, 20, 80, 30);
 * var gData = new GModel.GDataTag(v3,null,null,'电压',null,'v');
 * var textDrawStyle = new GModel.TextDrawStyle("#CCC",false,"red");
 * var textDrawStyle1 = new GModel.TextDrawStyle("#ddd",false,"blue");
 * var dataDrawStyle1 = new GModel.DataDrawingDef(40,50,textDrawStyle1);
 * gData.multiStatus.deNormalSatus = textDrawStyle;
 * gData.multiStatus.normalStatus.push(dataDrawStyle1);
 * @class
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 * @param {string} dataSrc 数据源
 * @param {string} measId 测点标识符
 * @param {string} measName 测点名称
 * @param {GModel.GDataTag.UnitMap} valueUnit 数值单位
 * @param {GModel.GDataTag.UnitMap} dispUnit 显示单位
 * @param {boolean} bShowPhy 是否显示测点类型
 * @param {boolean} bShowUnit 是否显示测点的数值单位
 * @param {GModel.DataMultiStatus} multiStatus 是否显示测点的数值单位
 * @memberof GModel
 * @tutorial helloworld
 */
function GDataTag(mxCell,dataSrc,measId,measName,valueUnit,dataFormat,dispUnit,bShowPhy,bShowUnit,bShowTime,multiStatus) {
    GObject.call(this,EnumGobjectType.G_DATA);
    this.mxCell = mxCell;
    this.label="123v";
    this.dataSrc = dataSrc;
    this.measTable = '';
    this.measId = measId;
    this.measName = measName;
    this.valueUnit = valueUnit;
    this.dispUnit = dispUnit;
    this.dataFormat = dataFormat?dataFormat:'0.00';
    this.bShowPhy = bShowPhy!==undefined?bShowPhy:false;
    this.bShowUnit = bShowUnit!==undefined?bShowPhy:false;
    this.bShowTime = bShowTime!==undefined?bShowTime:false;
    this.multiStatus = multiStatus;
    if(mxCell){
        mxCell.value = this;
        mxCell.setStyle('shape=label;fillColor=none;strokeColor=none');
    }

}

GDataTag.prototype = new GObject();
GDataTag.prototype.constructor = GDataTag;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */
GDataTag.prototype.mxCell = null;

/**
 * @property {string} dataSrc 数据源
 * @default
 */
GDataTag.prototype.dataSrc = "";

/**
 * @property {string} measId 测点标识符
 * @default
 */
GDataTag.prototype.measId = null;

/**
 * @property {string} measName 测点名称
 * @default
 */
GDataTag.prototype.measName = null;

/**
 * @property {string} measTable 测点表
 * @default
 */
GDataTag.prototype.measTable = null;

/**
 * @property {GModel.GDataTag.UnitMap} valueUnit 数值单位
 * @default
 */
GDataTag.prototype.valueUnit = null;

/**
 * @property {string} dataFormat 数值单位
 * @default
 */
GDataTag.prototype.dataFormat = null;

/**
 * @property {GModel.GDataTag.UnitMap} dispUnit 显示单位
 * @default
 */
GDataTag.prototype.dispUnit = null;

/**
 * @property {boolean} bShowPhy 是否显示测点类型
 * @default
 */
GDataTag.prototype.bShowPhy = true;

/**
 * @property {boolean} bShowUnit 是否显示测点的数值单位
 * @default
 */
GDataTag.prototype.bShowUnit = true;

/**
 * @property {boolean} bShowTime 是否显示测点的时间
 * @default
 */
GDataTag.prototype.bShowTime = true;


/**
 * @property {GModel.DataMultiStatus} multiStatus 是否显示测点的数值单位
 * @default null
 */
GDataTag.prototype.multiStatus = null ;

/**
 * @desc
 * 设置mxCell
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 */
GDataTag.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
    mxCell.setStyle('shape=label;fillColor=none;strokeColor=none');
}

/**
 * @desc
 * 设置测点的数值
 * @function
 * @param {number|string} data 测点的数值，必须为数字或者数字字符串
 */
GDataTag.prototype.setData = function(data,time,multiData){
    var data = parseFloat(data);
    //数值为NaN，为空为null处理
    if(isNaN(data)&&data!==undefined){
        new Error("数值不是数字或空或null");
        return false;
    }else if(data===""||data===null||data===undefined){
        this.label = "";
        return false;
    }
    if(this.dataFormat&&this.dataFormat.length>0){
        var formatLength = this.dataFormat.slice(2).lastIndexOf('0')+1;
        data = data.toFixed(formatLength);
    }

    //正常数据处理
    var label="";
    //数据类型显示
    if(this.bShowPhy){
        label+=this.measName;
    }
    //数值单位显示
    if(this.valueUnit&&this.dispUnit){
        //数值单位转换
        label+=data*GModel.UnitMap[this.valueUnit]/GModel.UnitMap[this.dispUnit];
        if(this.bShowUnit){
            label+=this.dispUnit;
        }
    }else{
        label+=data;
    }
    if(this.bShowTime&&time){
        label=time+"  "+label
    }
    if(multiData&&this.multiStatus){
        var deNormalSatus = this.multiStatus.deNormalSatus;
        var normalStatus = this.multiStatus.normalStatus;
        var style = 'shape=label;fillColor=none;strokeColor=none';
        if(multiData.value&&multiData.iQuality===0){
            if(normalStatus.length>0){
                for(var i=0,l=normalStatus.length;i<l;i++){
                    var temp =normalStatus[i];
                    if(Number(multiData.value)>=temp.lower&&Number(multiData.value)<temp.upper){
                        style+=";fontColor="+temp.drawStyle.textColor;
                        if(temp.drawStyle.bBLink){
                            var state = GModel.graph.view.getState(this.mxCell);
                            state.shape.node.parentNode.setAttribute('class', 'show-hide');
                        }
                        break;
                    }
                }
            }else{
                return;
            }
        }else{
            style+=";fontColor="+deNormalSatus.textColor;
            if(deNormalSatus.bBLink){
                var state = GModel.graph.view.getState(this.mxCell);
                state.shape.node.setAttribute('class', 'show-hide');
            }
        }
        this.mxCell.setStyle(style);
    }

    this.setAttribute('label',label);
}

GModel.GDataTag = typeof GDataTag !== 'undefined' ? GDataTag : undefined;

function GDevSwitch(mxCell,devId) {
    GDeviceObj.call(this,mxCell,devId,EnumDeviceType.DEV_BREAKER);
}
GDevSwitch.prototype = new GDeviceObj();
GDevSwitch.prototype.constructor = GDevSwitch;
GModel.GDevSwitch = typeof GDevSwitch !== 'undefined' ? GDevSwitch : undefined;


/**
 * @desc
 * 基类用于继承
 * @class
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 * @param {GModel.GObject.EnumGobjectType} type 模型类型
 * @extends GModel.GObject
 * @memberof GModel 
 */
function GExtendObj(mxCell,type){
    GObject.call(this,type);
    this.mxCell = mxCell;
    if(mxCell){
        mxCell.value = this;
    }
}

GExtendObj.prototype = new GObject();
GExtendObj.prototype.constructor = GExtendObj;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default 
 */
GExtendObj.prototype.mxCell = null;
GModel.GExtendObj = typeof GExtendObj !== 'undefined' ? GExtendObj : undefined;


/**
 * @desc
 * 按钮模型
 * @example 
 * ---按钮---
 * var v1 = graph.insertVertex(parent, null, '', 20, 20, 80, 30);
 * var gButton = new GModel.GButton(v1,'跳转','click',function (cell) {
 *                        console.log(cell);
 *						  window.location.href='./';
 *                   });
 * @class
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 * @param {string} label 按钮显示文本
 * @param {string} pageId 跳转到某个页面

 * @extends GModel.GExtendObj
 * @memberof GModel
 * @tutorial helloworld
 */
function GButton(mxCell,label,pageId){
    GExtendObj.call(this,mxCell,EnumGobjectType.G_BUTTON);
    this.label = label;
    this.pageId = pageId
    
}
GButton.prototype = new GExtendObj();
GButton.prototype.constructor = GButton;

/**
 * @property {string} label 按钮显示文本
 * @default
 */
GButton.prototype.label = "";

/**
 * @property {string} pageId 跳转到某个页面
 * @default
 */
GButton.prototype.pageId = null;

/**
 * @property {object} events 该按钮的可触发的事件集合 
 * @default {}      
 */

GButton.prototype.events={};

/**
 * @desc
 * 设置mxCell
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 */
GButton.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
}

/**
 * @desc
 * 设置mxCell
 * @function
 * @param {string} type 事件类型
 * @param {callback} callback 回调函数
 */
GButton.prototype.addEvent = function(type,callback){
    switch(type){
        case 'click':
            this.events.click = callback.toString().replace(/\s+/g,"");
            break;
        default:
            break;
    }
}
GModel.GButton = typeof GButton !== 'undefined' ? GButton : undefined;


/**
 * @desc
 * 图片模型
 * @example
 * ---图片---
 * var v2 = graph.insertVertex(parent, null, '', 20, 40, 800, 560);
 * var gImage = new GModel.GImage(v2,'sys.svg','image1');
 * @class
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 * @param {string} url 图片地址 
 * @extends GModel.GExtendObj
 * @memberof GModel
 * @tutorial helloworld
 */
function GImage(mxCell,url){
    GExtendObj.call(this,mxCell,EnumGobjectType.G_IMG);
    this.url= url;
    if(mxCell){
        this.mxCell = mxCell;
        mxCell.value = this;
        // var style = new Object();
        // style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
        // style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        // style[mxConstants.STYLE_IMAGE] = url;
        // GModel.graph.getStylesheet().putCellStyle(name, style);
        mxCell.setStyle('shape=image;perimeter=rectanglePerimeter;image='+url);
    }
}
GImage.prototype = new GExtendObj();
GImage.prototype.constructor = GImage;

/**
 * @property {string} url 图片地址
 * @default
 */
GImage.prototype.url = "";


/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GImage.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
    mxCell.setStyle('shape=image;perimeter=rectanglePerimeter;image='+this.url);
}
GImage.prototype.setAttribute = function (key,value) {
    this[key] = value;
    this.mxCell.setStyle('shape=image;perimeter=rectanglePerimeter;image='+this.url);
    var edit = new mxCellAttributeChange(
        this.mxCell, key, value);
    GModel.graph.getModel().execute(edit);
}
GModel.GImage = typeof GImage !== 'undefined' ? GImage : undefined;

/**
 * @desc
 * 图表模型
 * @example
 *  * ---图标---
 * var v4 = graph.insertVertex(parent, null, '', 120, 40, 300, 200);
 * var gChart = new GModel.GChart(v4,'localhost:8080',['123','456'],{
 *                       xAxis: {
 *                           type: 'category',
 *                           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
 *                        },
 *                        yAxis: {
 *                            type: 'value'
 *                        },
 *                        series: [{
 *                            data: [820, 932, 901, 934, 1290, 1330, 1320],
 *                            type: 'line'
 *                        }]
 * 					});
 * @class
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 * @param {string} dataSrc 数据源
 * @param {Array.<number|string>} dataIds 包含测点id的数组
 * @param {object} options echarts配置
 * @extends GModel.GExtendObj
 * @memberof GModel
 * @tutorial helloworld
 */
function GChart(mxCell,dataSrc,dataIds,title,options) {
    GExtendObj.call(this,mxCell,EnumGobjectType.G_CHART);
    this.dataSrc = dataSrc;
    this.dataIds = dataIds;
    this.title = title;
    this.dataFormat = '0.00';
    this.options = options;
    if(mxCell){
        mxCell.setStyle('overflow=fill;fillColor=none;fontColor=#000000;strokeColor=none;');
    }
}
GChart.prototype = new GExtendObj();
GChart.prototype.constructor = GChart;

/**
 * @property {string} dataSrc 数据源
 * @default
 */
GChart.prototype.dataSrc = "";

/**
 * @property {Array.<number|string>|number} dataIds 包含测点id的数组
 * @default
 */
GChart.prototype.dataIds = null;

/**
 * @property {string} title 标题
 * @default
 */
GChart.prototype.title = "";

/**
 * @property {object} options echarts配置
 * @default
 */
GChart.prototype.options = null;

GChart.prototype. init = function(){}
/**
 * @desc
 * 设置mxCell
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 */
GChart.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};

/**
 * @desc
 * 设置echarts的options
 * @function
 * @param {object} options echarts的options
 */
GChart.prototype.setOption = function(options){
    this.chart.setOption(options);
}

GChart.prototype.addData = function (data) {
    this.options.series[0].data.push(data);
    this.chart.setOption(this.options);
}

GChart.prototype.setAttribute = function (key,value) {
    if(key.indexOf('styleOptions')>=0){
        var key = key.split(".")[1];
        this.styleOptions[key] = value;
        this.init();
        this.setOption(this.options);
    }else{
        this[key] = value;
    }
}
GModel.GChart = typeof GChart !== 'undefined' ? GChart : undefined;


/**
 * 
 * @desc
 * 趋势图
 * @example
 * var v5 = graph.insertVertex(parent, null, '', 120, 280, 580, 400);
 * var gChart2 = new GModel.GChartTrend(v5,'localhost:8080',['123','456'],'趋势图','*-5d','*');
 * var data = ['2009/10/13 0:00', '2009/10/13 1:00', '2009/10/13 2:00', '2009/10/13 3:00', '2009/10/13 4:00', '2009/10/13 5:00', '2009/10/13 6:00', '2009/10/13 7:00', '2009/10/13 8:00', '2009/10/13 9:00', '2009/10/13 10:00', '2009/10/13 11:00', '2009/10/13 12:00', '2009/10/13 13:00', '2009/10/13 14:00', '2009/10/13 15:00', '2009/10/13 16:00', '2009/10/13 17:00', '2009/10/13 18:00', '2009/10/13 19:00', '2009/10/13 20:00', '2009/10/13 21:00', '2009/10/13 22:00', '2009/10/13 23:00', '2009/10/14 0:00', '2009/10/14 1:00', '2009/10/14 2:00', '2009/10/14 3:00', '2009/10/14 4:00', '2009/10/14 5:00', '2009/10/14 6:00', '2009/10/14 7:00', '2009/10/14 8:00', '2009/10/14 9:00', '2009/10/14 10:00', '2009/10/14 11:00', '2009/10/14 12:00', '2009/10/14 13:00', '2009/10/14 14:00', '2009/10/14 15:00', '2009/10/14 16:00', '2009/10/14 17:00', '2009/10/14 18:00', '2009/10/14 19:00', '2009/10/14 20:00', '2009/10/14 21:00', '2009/10/14 22:00', '2009/10/14 23:00', '2009/10/15 0:00', '2009/10/15 1:00', '2009/10/15 2:00', '2009/10/15 3:00', '2009/10/15 4:00', '2009/10/15 5:00', '2009/10/15 6:00', '2009/10/15 7:00', '2009/10/15 8:00', '2009/10/15 9:00', '2009/10/15 10:00', '2009/10/15 11:00', '2009/10/15 12:00', '2009/10/15 13:00', '2009/10/15 14:00', '2009/10/15 15:00', '2009/10/15 16:00', '2009/10/15 17:00', '2009/10/15 18:00', '2009/10/15 19:00', '2009/10/15 20:00', '2009/10/15 21:00', '2009/10/15 22:00', '2009/10/15 23:00', '2009/10/16 0:00', '2009/10/16 1:00', '2009/10/16 2:00', '2009/10/16 3:00', '2009/10/16 4:00', '2009/10/16 5:00', '2009/10/16 6:00', '2009/10/16 7:00', '2009/10/16 8:00', '2009/10/16 9:00', '2009/10/16 10:00', '2009/10/16 11:00', '2009/10/16 12:00', '2009/10/16 13:00', '2009/10/16 14:00', '2009/10/16 15:00', '2009/10/16 16:00', '2009/10/16 17:00', '2009/10/16 18:00', '2009/10/16 19:00', '2009/10/16 20:00', '2009/10/16 21:00', '2009/10/16 22:00', '2009/10/16 23:00', '2009/10/17 0:00', '2009/10/17 1:00', '2009/10/17 2:00', '2009/10/17 3:00', '2009/10/17 4:00', '2009/10/17 5:00', '2009/10/17 6:00', '2009/10/17 7:00', '2009/10/17 8:00', '2009/10/17 9:00', '2009/10/17 10:00', '2009/10/17 11:00', '2009/10/17 12:00', '2009/10/17 13:00', '2009/10/17 14:00', '2009/10/17 15:00', '2009/10/17 16:00', '2009/10/17 17:00', '2009/10/17 18:00', '2009/10/17 19:00', '2009/10/17 20:00', '2009/10/17 21:00', '2009/10/17 22:00', '2009/10/17 23:00', '2009/10/18 0:00', '2009/10/18 1:00', '2009/10/18 2:00', '2009/10/18 3:00', '2009/10/18 4:00', '2009/10/18 5:00', '2009/10/18 6:00', '2009/10/18 7:00', '2009/10/18 8:00'];
 * data = [{name:'线路1',data:data.map(function (str) {
 *      return [str.replace(' ', '\n'),2]
 * })},{name:'线路2',data:data.map(function (str) {
 *      return [str.replace(' ', '\n'),3]
 * })}]
 * gChart2.setData(data);
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @param {string} dataSrc 数据源
 * @param {Array.<string|number>} dataIds 
 * @param {string} title 标题
 * @param {string} startTime 横轴开始时间
 * @param {string} endTime 横轴结束时间
 * @extends GModel.GChart
 * @memberof GModel
 * @tutorial helloworld
 */
function GChartTrend(mxCell,dataSrc,dataIds,title,startTime,endTime,styleOptions){
    GChart.call(this,mxCell,dataSrc,dataIds,title);
    this.gobjType = "GChartTrend";
    this.startTime = startTime?startTime:"*-8h";
    this.endTime = endTime?endTime:"*";
    this.styleOptions = styleOptions;
    this.init();
    if(mxCell){
        this.mxCell = mxCell;
        mxCell.value = this;
    }
}

GChartTrend.prototype = new GChart();
GChartTrend.prototype.constructor = GChartTrend;

/**
 * @property {string} startTime 开始时间
 * @default
 */
GChartTrend.prototype.startTime =null;

/**
 * @property {string} endTime 结束时间
 * @default
 */
GChartTrend.prototype.endTime =null;

GChartTrend.prototype.init = function () {
    this.styleOptions = this.styleOptions?this.styleOptions:{};
    var options = {
        title: {
            text: this.title?this.title:""
        },
        tooltip: {
            trigger: 'axis'
        },
        grid:{
            bottom:'80'
        },
        xAxis: {
            type: 'category',
            boundaryGap:false,
            splitLine: {
                show: true
            },
            axisLabel:{
                showMinLabel:true,
                showMaxLabel:true
            }

        },
        yAxis: {
            type: 'value'
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
        }, {
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [{
            name: this.title,
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: [[this.startTime?Time.getDate(this.startTime):"*-8h","-"],[this.endTime?Time.getDate(this.endTime):"*","-"]]
        }]
    };
    var styles = this.styleOptions.dataStyles;
    //symbol:'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    //itemStyle.color:''
    //lineStyle.width
    //lineStyle.type
    if(styles){
        var temp = this.options.series;
        options.series=[];
        for(var i = 0,l = styles.length;i < l;i++){
            styles[i].type='line';
            styles[i].data = temp[i].data?temp[i].data:[[this.startTime?Time.getDate(this.startTime):"*-8h","-"],[this.endTime?Time.getDate(this.endTime):"*","-"]];
            options.series.push(styles[i]);
        }
    }
    this.options = options;
}

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GChartTrend.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
    this.options.series[0].data=[[this.startTime?Time.getDate(this.startTime):"","-"],[this.endTime?Time.getDate(this.endTime):"","-"]];
}


/**
 * @function
 * @example
 * [{name:"测点1",data:[['2018/5/3 18:00:00',12345],['2018/5/3 19:00:00',6789]]}]
 * @param {Array.<Object>} data 填充趋势图的数据
 */
GChartTrend.prototype.setData = function(data){
    for(var i=0,l=data.length;i<l;i++){
        var temp = this.options.series[i];
        temp = temp?temp:{};
        temp.name = data[i].name;
        temp.data = data[i].data;
    }
    this.setOption(this.options);
}


GModel.GChartTrend = typeof GChartTrend !== 'undefined' ? GChartTrend : undefined;


/**
 * @desc
 * 柱状图
 * @example
 * var v6 = graph.insertVertex(parent, null, '', 500, 40, 80, 200);
 * var gChart3 = new GModel.GChartBar(v6,'localhost:8080','123','测点1','*');
 * gChart3.setData(34);
 * @class
 * @param {mxCell} mxCell mxgraph中的mxCell
 * @param {string} dataSrc 数据源
 * @param {string|number} dataIds 测点id
 * @param {string} title 柱图名称
 * @param {string} nowTime 获取数据的时间点
 * @param {number} max 最大值
 * @param {number} min 最小值
 * @param {string} formatter label显示格式，默认为'{c}'
 * @extends GModel.GChart
 * @memberof GModel
 * @tutorial helloworld
 */
function GChartBar(mxCell,dataSrc,dataIds,title,nowTime,styleOptions){
    
    // 指定图表的配置项和数据
    GChart.call(this,mxCell,dataSrc,dataIds,title);
    this.gobjType = "GChartBar";
    this.nowTime = nowTime;
    this.styleOptions = styleOptions;
    this.init();
    if(mxCell){
        this.mxCell = mxCell;
        mxCell.value = this;
    }
}

GChartBar.prototype = new GChart();
GChartBar.prototype.constructor = GChartBar;

/**
 * @property {string} nowTime 显示的时间
 * @default
 */
GChartBar.prototype.nowTime =null;

GChartBar.prototype.init = function () {
    this.styleOptions = this.styleOptions?this.styleOptions:{};
    var options = {
        color: [this.styleOptions.foreground?this.styleOptions.foreground:'#3398DB'],
        grid: {
            top:10,
            left:10,
            right:10,
            bottom:10,
            containLabel: true
        },
        xAxis : {
            type : 'category',
            data : [this.title?this.title:(this.dataIds?this.dataIds:"")]
        },
        yAxis :{
            type : 'value',
            min: this.styleOptions.zero?this.styleOptions.zero:(this.styleOptions.min?this.styleOptions.min:0),
            max: this.styleOptions.max?this.styleOptions.max:100,
            splitLine:false
        },
        series : [
            {
                type:'bar',
                label: {
                    show: true,
                    position: 'top',
                    padding: 10,
                    color: '#2979ff',
                    fontSize: 14,
                    formatter: this.styleOptions.formatter?this.styleOptions.formatter:'{c}'
                },
                barWidth: '99%',
                data:this.options?this.options.series[0].data:[34]
            }
        ]
    };
    if(this.styleOptions.chartStyle){
        var preX = options.xAxis;
        options.xAxis = options.yAxis;
        options.yAxis = preX;
    }
    this.options= options;
};

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GChartBar.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};

/**
 * @function
 * @param {number} data bar的数值
 */
GChartBar.prototype.setData = function(data){
    this.options.series[0].data = data;
    this.setOption(this.options);
};




GModel.GChartBar = typeof GChartBar !== 'undefined' ? GChartBar : undefined;


/**
 * 
 * @desc
 * 饼图
 * @example
 *var v7 = graph.insertVertex(parent, null, '', 640, 40, 280, 200);
 *var gChart4 = new GModel.GChartPie(v7,'localhost:8080',['123','456','789'],'饼图','*');
 *gChart4.setData([{value:335, name:'测点1'},{value:310, name:'测点2'},{value:310, name:'测点3'}]);
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @param {string} dataSrc 数据源
 * @param {Array.<string|number>} dataIds 测点id的数组
 * @param {string} title 饼图标题
 * @param {string} nowTime 获取数据的时间点
 * @param {string} formatter 数据显示格式，默认为"{a} &lt;br/&gt;{b} : {c} ({d}%)"
 * @extends GModel.GChart
 * @memberof GModel
 * @tutorial helloworld
 */
function GChartPie(mxCell,dataSrc,dataIds,title,nowTime,styleOptions){
    GChart.call(this,mxCell,dataSrc,dataIds,title);
    this.gobjType = "GChartPie";
    this.nowTime = nowTime;
    this.styleOptions = styleOptions;
    this.init();
    if(mxCell){
        this.mxCell = mxCell;
        mxCell.value = this;
    }
    // mxCell.setStyle('fillColor=none;strokeColor=none');
}

GChartPie.prototype = new GChart();
GChartPie.prototype.constructor = GChartPie;

/**
 * @property {string} nowTime 显示的时间
 * @default
 */
GChartPie.prototype.nowTime =null;


GChartPie.prototype.init = function(){
    this.styleOptions = this.styleOptions?this.styleOptions:{};
    // 指定图表的配置项和数据
    var options = {
        tooltip : {
            trigger: 'item',
            formatter: this.styleOptions.formatter?this.styleOptions.formatter:"{a} <br/>{b} : {c} ({d}%)"
        },
        series : [
            {
                name: this.title,
                type: 'pie',
                radius : this.styleOptions.radius?this.styleOptions.radius:'55%',
                center: ['50%', '50%'],
                data:[],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    this.options= options;
}

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GChartPie.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
}

/**@example
 * [{value:335, name:'测点1'},{value:310, name:'测点2'},{value:310, name:'测点3'}]
 * @function
 * @param {Array.<Object>} data bar的数值
 */
GChartPie.prototype.setData = function(data){
    this.options.series[0].data = data;
    this.setOption(this.options);
}



GModel.GChartPie = typeof GChartPie !== 'undefined' ? GChartPie : undefined;


/**
 * @desc
 * 仪表盘
 * @example
 * var v8 = graph.insertVertex(parent, null, '', 940, 40, 280, 300);
 * var gChart5 = new GModel.GChartGauge(v8,'localhost:8080','123','仪表盘','*');
 * gChart5.setData([{value:35, name:'测点1'}]);
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @param {string} dataSrc 数据源
 * @param {string|number} dataIds 测点id
 * @param {string} title 仪表盘名称
 * @param {string} nowTime 获取数据的时间点
 * @param {number} max 仪表盘最大值
 * @param {number} min 仪表盘最小值
 * @param {number} splitNumber 仪表盘分段数
 * @param {any} formatter 仪表盘数据显示格式，默认为"{a} &lt;br/&gt;{b} : {c}%"
 * @extends GModel.GChart
 * @memberof GModel
 * @tutorial helloworld
 */
function GChartGauge(mxCell,dataSrc,dataIds,title,nowTime,upper,lower,styleOptions){
    GChart.call(this,mxCell,dataSrc,dataIds,title);
    this.gobjType = "GChartGauge";
    this.nowTime = nowTime;
    this.styleOptions = styleOptions;
    this.upper = upper;
    this.lower = lower;
    this.init();
    if(mxCell){
        this.mxCell = mxCell;
        mxCell.value = this;
    }
    // mxCell.setStyle('fillColor=none;strokeColor=none');
}

GChartGauge.prototype = new GChart();
GChartGauge.prototype.constructor = GChartGauge;

/**
 * @property {string} nowTime 显示的时间
 * @default
 */
GChartGauge.prototype.nowTime =null;

GChartGauge.prototype.init = function () {
    this.styleOptions = this.styleOptions?this.styleOptions:{};
    // 指定图表的配置项和数据
    var options = {
        backgroundColor:this.styleOptions.background?this.styleOptions.background:'',
        tooltip : {
            formatter: this.styleOptions.formatter?this.styleOptions.formatter:"{a} <br/>{b} : {c}%"
        },
        series: [
            {
                name: this.title,
                type: 'gauge',
                title:{
                    fontSize:13
                },
                detail: {
                    fontWeight: 'bolder',
                    fontSize:14,
                    formatter:'{value}%'
                },
                min:this.styleOptions.min?this.styleOptions.min:0,
                max:this.styleOptions.max?this.styleOptions.max:100,
                splitNumber:this.styleOptions.splitNumber?this.styleOptions.splitNumber:10,
                data: []
            }
        ]
    };
    this.options= options;
}

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GChartGauge.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
}

/**
 * @example
 * [{value: 50, name: '指标1'}]
 * @function
 * @param {Array.<Object>} data bar的数值
 */
GChartGauge.prototype.setData = function(data){
    this.options.series[0].data = data;
    this.setOption(this.options);
}



GModel.GChartGauge = typeof GChartGauge !== 'undefined' ? GChartGauge : undefined;



function GChartScatter(mxCell,dataSrc,dataIds,title,startTime,endTime,intervalTime,styleOptions) {
    // 指定图表的配置项和数据
    GChart.call(this,mxCell,dataSrc,dataIds,title);
    this.gobjType = "GChartScatter";
    this.startTime = startTime;
    this.endTime = endTime;
    this.intervalTime = intervalTime;
    this.styleOptions = styleOptions;
    this.init();
    if(mxCell){
        this.mxCell = mxCell;
        mxCell.value = this;
    }
}

GChartScatter.prototype = new GChart();
GChartScatter.prototype.constructor = GChartScatter;

GChartScatter.prototype.init =function () {
    this.styleOptions = this.styleOptions?this.styleOptions:{};
    var options = {
        xAxis: {
            type: 'value',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            }
        },
        series: [{
            symbolSize: 20,
            data: [],
            type: 'scatter'
        }]
    };
    var styles = this.styleOptions.dataStyles;
    //symbol:'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    //itemStyle.color:''
    //lineStyle.width
    //lineStyle.type
    if(styles){
        var temp = this.options.series;
        options.series=[];
        for(var i = 0,l = styles.length;i < l;i++){
            styles[i].type='scatter';
            styles[i].data = temp[i].data?temp[i].data:[[this.startTime?Time.getDate(this.startTime):"*-8h","-"],[this.endTime?Time.getDate(this.endTime):"*","-"]];
            options.series.push(styles[i]);
        }
    }
    this.options= options;
}

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GChartScatter.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
}

/**
 * @function
 * @param {number} data Scatter的数值
 */
GChartScatter.prototype.setData = function(data){
    for(var i=0,l=data.length;i<l;i++){
        var temp = this.options.series[i];
        temp = temp?temp:{};
        temp.name = data[i].name;
        temp.data = data[i].data;
    }
    this.setOption(this.options);
}
GModel.GChartScatter = typeof GChartScatter !== 'undefined' ? GChartScatter : undefined;


/**
 * @desc
 * 基类用于继承
 * @class
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 * @extends GModel.GObject
 * @memberof GModel
 */
function GElectric(mxCell){
    GObject.call(this,EnumGobjectType.G_Electric);
    this.mxCell = mxCell;
    this.runStatus='noElectric';
    if(mxCell){
        this.mxCell = mxCell;
        mxCell.value = this;
    }
}

GElectric.prototype = new GObject();
GElectric.prototype.constructor = GElectric;

/**
 * @property {string} dataSrc 数据源
 * @default
 */
GChart.prototype.dataSrc = "";

/**
 * @property {Array.<number|string>|number} dataIds 包含测点id的数组
 * @default
 */
GChart.prototype.dataIds = null;

/**
 * @property {string} runStatus 运行状态（带点，不带电，重过载）
 * @default
 */
GChart.prototype.runStatus = null;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */
GElectric.prototype.mxCell = null;

/**
 * @desc
 * 设置mxCell
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell实例
 */
GElectric.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GElectric.prototype.getNewGObjectByEname = function (mxCell,eName) {
    switch (eName){
        case '母线': return new GElectricBusbar(mxCell);
        case '变压器': return new GElectricTransformer(mxCell);
        case '三卷变压器': return new GElectricTertiaryTransformer(mxCell);
        case '断路器': return new GElectricBreaker(mxCell);
        case '手车断路器': return new GElectricHandcartBreaker(mxCell);
        case '刀闸': return new GElectricKnifeSwitch(mxCell);
        case '手车隔离开关': return new GElectricHandcartIsolatorSwitch(mxCell);
        case '配变': return new GElectricDistributionTransformer(mxCell);
        case '负荷': return new GElectricLoad(mxCell);
        case '接地': return new GElectricGrounding(mxCell);
        case '电容器': return new GElectricCapacitor(mxCell);
    }
};
GModel.GElectric = typeof GElectric !== 'undefined' ? GElectric : undefined;


/**
 *
 * @desc
 * 开关类型设备
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @param {string} devName 设备名称
 * @param {Array.<GModel.StatusDrawingDef>} statusShapeList 状态图形列表
 * @param {string} switchStatus 开关当前状态
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricSwitch(mxCell,statusShapeList,switchStatus){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricSwitch";
    this.statusShapeList=statusShapeList;
    this.switchStatus=switchStatus||'on';
}

GElectricSwitch.prototype = new GElectric();
GElectricSwitch.prototype.constructor = GElectricSwitch;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricSwitch.prototype.mxCell = null;

/**
 * @property {string} switchStatus 记录开关当前状态
 * @default
 */
GChart.prototype.switchStatus = null;

/**
 * @property {Array.<GModel.StatusDrawingDef>} statusShapeList 状态图形列表，数组元素为状态模型对象
 * @default
 */
GChart.prototype.statusShapeList = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricSwitch.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};

/**
 * @desc
 * 设置开关状态
 * @class
 * @param {string} status 开关状态
 * @memberof GModel
 */
GElectricSwitch.prototype.setSwitchStatus = function (status) {
    if(this.statusShapeList && this.statusShapeList.length){
        var sdd;
        for(var i=0;i<this.statusShapeList.length;i++){
            if(this.statusShapeList[i].statusName==status){
                sdd=this.statusShapeList[i];
                break;
            }
        }
        for(var i=0;i<sdd.shapeList.length;i++){
            this.mxCell.children[i].geometry=sdd.shapeList[i].geometry;
            this.mxCell.children[i].style=sdd.shapeList[i].style;
        }
        this.setAttribute('switchStatus',status);
    }
};
GModel.GElectricSwitch = typeof GElectricSwitch !== 'undefined' ? GElectricSwitch : undefined;


/**
 *
 * @desc
 * 断路器
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricBreaker(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricBreaker";
}

GElectricBreaker.prototype = new GObject();
GElectricBreaker.prototype.constructor = GElectricBreaker;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricBreaker.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricBreaker.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricBreaker = typeof GElectricBreaker !== 'undefined' ? GElectricBreaker : undefined;


/**
 *
 * @desc
 * 母线
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricBusbar(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricBusbar";
}

GElectricBusbar.prototype = new GObject();
GElectricBusbar.prototype.constructor = GElectricBusbar;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricBusbar.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricBusbar.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricBusbar = typeof GElectricBusbar !== 'undefined' ? GElectricBusbar : undefined;


/**
 *
 * @desc
 * 电容器
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricCapacitor(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricCapacitor";
}

GElectricCapacitor.prototype = new GObject();
GElectricCapacitor.prototype.constructor = GElectricCapacitor;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricCapacitor.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricCapacitor.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricCapacitor = typeof GElectricCapacitor !== 'undefined' ? GElectricCapacitor : undefined;


/**
 *
 * @desc
 * 配变
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricDistributionTransformer(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricDistributionTransformer";
}

GElectricDistributionTransformer.prototype = new GObject();
GElectricDistributionTransformer.prototype.constructor = GElectricDistributionTransformer;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricDistributionTransformer.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricDistributionTransformer.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricDistributionTransformer = typeof GElectricDistributionTransformer !== 'undefined' ? GElectricDistributionTransformer : undefined;


/**
 *
 * @desc
 * 接地
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricGrounding(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricGrounding";
}

GElectricGrounding.prototype = new GObject();
GElectricGrounding.prototype.constructor = GElectricGrounding;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricGrounding.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricGrounding.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricGrounding = typeof GElectricGrounding !== 'undefined' ? GElectricGrounding : undefined;


/**
 *
 * @desc
 * 手车断路器
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricHandcartBreaker(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricHandcartBreaker";
}

GElectricHandcartBreaker.prototype = new GObject();
GElectricHandcartBreaker.prototype.constructor = GElectricHandcartBreaker;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricHandcartBreaker.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricHandcartBreaker.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricHandcartBreaker = typeof GElectricHandcartBreaker !== 'undefined' ? GElectricHandcartBreaker : undefined;


/**
 *
 * @desc
 * 手车隔离开关
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricHandcartIsolatorSwitch(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricHandcartIsolatorSwitch";
}

GElectricHandcartIsolatorSwitch.prototype = new GObject();
GElectricHandcartIsolatorSwitch.prototype.constructor = GElectricHandcartIsolatorSwitch;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricHandcartIsolatorSwitch.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricHandcartIsolatorSwitch.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricHandcartIsolatorSwitch = typeof GElectricHandcartIsolatorSwitch !== 'undefined' ? GElectricHandcartIsolatorSwitch : undefined;


/**
 *
 * @desc
 * 刀闸
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricKnifeSwitch(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricKnifeSwitch";
}

GElectricKnifeSwitch.prototype = new GObject();
GElectricKnifeSwitch.prototype.constructor = GElectricKnifeSwitch;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricKnifeSwitch.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricKnifeSwitch.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricKnifeSwitch = typeof GElectricKnifeSwitch !== 'undefined' ? GElectricKnifeSwitch : undefined;


/**
 *
 * @desc
 * 负荷
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricLoad(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricLoad";
}

GElectricLoad.prototype = new GObject();
GElectricLoad.prototype.constructor = GElectricLoad;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricLoad.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricLoad.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricLoad = typeof GElectricLoad !== 'undefined' ? GElectricLoad : undefined;


/**
 *
 * @desc
 * 三卷变压器
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricTertiaryTransformer(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricTertiaryTransformer";
}

GElectricTertiaryTransformer.prototype = new GObject();
GElectricTertiaryTransformer.prototype.constructor = GElectricTertiaryTransformer;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricTertiaryTransformer.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricTertiaryTransformer.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricTertiaryTransformer = typeof GElectricTertiaryTransformer !== 'undefined' ? GElectricTertiaryTransformer : undefined;


/**
 *
 * @desc
 * 变压器
 * @class
 * @param {mxCell} mxCell mxgraph的mxCell
 * @extends GModel.GElectric
 * @memberof GModel
 */
function GElectricTransformer(mxCell){
    GElectric.call(this,mxCell);
    this.gobjType = "GElectricTransformer";
}

GElectricTransformer.prototype = new GObject();
GElectricTransformer.prototype.constructor = GElectricTransformer;

/**
 * @property {mxCell} mxCell mxgraph中的mxCell实例
 * @default
 */

GElectricTransformer.prototype.mxCell = null;

/**
 * @function
 * @param {mxCell} mxCell mxgraph中的mxCell对象
 */
GElectricTransformer.prototype.setMxCell = function (mxCell) {
    this.mxCell = mxCell;
    mxCell.value = this;
};
GModel.GElectricTransformer = typeof GElectricTransformer !== 'undefined' ? GElectricTransformer : undefined;

mxCodecRegistry.register(function () {
    var codec = new mxObjectCodec(new GObject(), ['mxCell']);
    var mxCellCodec = mxCodecRegistry.getCodec(mxCell);
    //obj->xml
    mxCellCodec.afterEncode = function (enc, obj, node) {
        if (obj.value != null && typeof(obj.value) == 'object' && obj.value instanceof GObject) {
            var tmp = node;
            var encoder = new mxCodec();
            var enc = mxCodecRegistry.getCodec(GObject);

            if (enc != null) {
                node = enc.encode(encoder, obj.value);
                node.appendChild(tmp);
                var id = tmp.getAttribute('id');
                node.setAttribute('id', id);
                tmp.removeAttribute('id');
            } else {
                return node;
            }
        }
        return node;
    };
    //xml->obj
    mxCellCodec.beforeDecode = function (dec, node, obj) {
        var inner = node.cloneNode(true);
        var classname = this.getName();

        if (node.nodeName != classname) {
            // Passes the inner graphical annotation node to the
            // object codec for further processing of the cell.
            var tmp = node.getElementsByTagName(classname)[0];

            if (tmp != null && tmp.parentNode == node) {
                mxUtils.removeWhitespace(tmp, true);
                mxUtils.removeWhitespace(tmp, false);
                tmp.parentNode.removeChild(tmp);
                inner = tmp;
            }
            else {
                inner = null;
            }

            // Creates the user object out of the XML node
            obj.value = node.cloneNode(true);
            var id = obj.value.getAttribute('id');
            if (id != null) {
                obj.setId(id);
                obj.value.removeAttribute('id');
            }
            //GObject开始
            if (node.nodeName == 'GObject') {
                var decoder = new mxCodec(node);
                decoder.decode = function (node, into) {
                    var obj = null;

                    if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
                        var ctor = null;

                        try {
                            ctor = window[node.nodeName];
                            if (node.nodeName == 'GObject') {
                                ctor = GModel[node.getAttribute('gobjType')];
                            }
                        }
                        catch (err) {
                            // ignore
                        }

                        var dec = mxCodecRegistry.getCodec(ctor);

                        if (dec != null) {
                            obj = dec.decode(this, node, into);
                        }
                        else {
                            obj = node.cloneNode(true);
                            obj.removeAttribute('as');
                        }
                    }

                    return obj;
                };
                obj.value = decoder.decode(node);
                obj.value.setMxCell(obj);
            }
            //GObject结束
        }
        else {
            // Uses ID from XML file as ID for cell in model
            obj.setId(node.getAttribute('id'));
        }

        // Preprocesses and removes all Id-references in order to use the
        // correct encoder (this) for the known references to cells (all).
        if (inner != null) {
            for (var i = 0; i < this.idrefs.length; i++) {
                var attr = this.idrefs[i];
                var ref = inner.getAttribute(attr);

                if (ref != null) {
                    inner.removeAttribute(attr);
                    var object = dec.objects[ref] || dec.lookup(ref);

                    if (object == null) {
                        // Needs to decode forward reference
                        var element = dec.getElementById(ref);

                        if (element != null) {
                            var decoder = mxCodecRegistry.codecs[element.nodeName] || this;
                            object = decoder.decode(dec, element);
                        }
                    }

                    obj[attr] = object;
                }
            }
        }
        return inner;
    };
    mxCellCodec.isExcluded = function (obj, attr, value, isWrite) {
        return mxObjectCodec.prototype.isExcluded.apply(this, arguments) ||
            (obj.value instanceof GObject && isWrite && attr == 'value');
    };
    //->xml
    mxCodec.prototype.encode = function (obj) {
        var node = null;

        if (obj != null && obj.constructor != null) {
            var enc = mxCodecRegistry.getCodec(obj.constructor);
            if (obj instanceof GObject) {
                enc = mxCodecRegistry.getCodec(GObject);
            }
            if (enc != null) {
                node = enc.encode(this, obj);
            } else {
                if (mxUtils.isNode(obj)) {
                    node = mxUtils.importNode(this.document, obj, true);
                } else {
                    mxLog.warn('mxCodec.encode: No codec for ' + mxUtils.getFunctionName(obj.constructor));
                }
            }
        }

        return node;
    };
    return codec;
}());

/*
 //自己转换所有属性，自己可控
 function GModelCodec(){
 this.init();
 }
 GModelCodec.prototype.exclude = [];
 GModelCodec.prototype.init = function () {
 mxCodecRegistry.getCodec(mxCell).afterEncode=function (enc, obj, node) {
 if(obj.value != null&&typeof(obj.value) == 'object'&&obj.value instanceof GObject){
 var tmp = node;
 node = this.encodeObject(obj.value);
 node.appendChild(tmp);
 var id = tmp.getAttribute('id');
 node.setAttribute('id', id);
 tmp.removeAttribute('id');
 }
 return node;
 }
 }

 GModelCodec.prototype.encodeObject =function (obj) {
 for (var i in obj)
 {
 var name = i;
 var value = obj[name];

 if (value != null && !this.isExcluded(name))
 {
 if (mxUtils.isInteger(name))
 {
 name = null;
 }
 var node = enc.document.createElement(this.getName());

 this.encodeValue(obj, name, value,node);
 }
 }
 }

 GModelCodec.prototype.isExcluded = function (attr) {
 return mxUtils.indexOf(this.exclude, attr) >= 0;
 }

 GModelCodec.prototype.encodeValue = function (obj, name, value,node) {
 if (value != null)
 {
 var defaultValue = GObject[name];
 if (name == null || defaultValue != value)
 {
 if (typeof(value) != 'function')
 {
 mxCodec.setAttribute(node, name, value,node);
 }

 }
 }
 }
 */
GModel.GModelCodec = typeof GModelCodec !== 'undefined' ? GModelCodec : undefined;
return GModel;
}));