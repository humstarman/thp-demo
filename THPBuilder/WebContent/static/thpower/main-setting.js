/*
 * 系统的设置，全局参数等在这里
 * */

var _WIN = {
  'width': 0,
  'height': 0,
  'wl': 0, //窗口停靠左侧的数量
  'wr': 0, //窗口停靠右侧的数量
  'wt': 0, //窗口停靠上部的数量
  'wb': 0 //窗口停靠下部的数量
};

var _task_id = -1;
var _task_ids=[];
var _simuFile_ = '';

var _container = document.getElementById('mainEditor');


// 主编辑器对象
var _editor = {};
var _graph = {};
var _modEditor = {};
var _modgraph = {};
var _modIconEditor = {};
var _wndModIcon = {};
var _modList = []; //模块列表，左侧使用


/*******************   主要的  windows  *******************/

// 各窗口的位置大小记录，初始参数放到cloudpss initParam里完成
var _wndRestore = {};
// 元件面板，模块面板，信息面板

// 窗口的数组对象，需要加入窗口管理器的窗口列表
var _wndList = {
  Comp: {},
  //~ Module:{},
  //Msr:{},
  //Ctrl:{},
  //UserModule:{},
  //~ Outline:{},
  //~ wInfo:{},
  Ctrl: {},
  Msr: {},
  Mymod: {}
};

var editorType = {
    0: {
      type: 'EMTP',
      typeFloor: 'eleFloor',
    },
    1: {
      type: 'ENG',
      typeFloor: 'engFloor',
    },
    2: {
      type: 'timing',
      typeFloor: 'timeFloor',
    },
    3: {
      type: 'CPS',
      typeFloor: 'CPSFloor',
    }
};


// 系统信息网面板
var _wndInfoCon = document.createElement('div');

// 仿真结果窗口
var _wndChart = {},
  	_wndChartCon = document.createElement('div');
	_wndChartCon.id = 'id_chart';

// 搜索结果窗口
var _wndSResult = {};

// 保存仿真的对话框
var _wndSave = null;

var layerNameMap = {};

// 元件参数设定窗口
var _wndEleParam = {},
  	_wndEleParamCon = document.createElement('div');
	_wndEleParamCon.id = "id_eparam",
	_wndEleParamCon.className = 'paramPrompt';

//模块参数设定窗口
//var _mod_param ={};//texteditor.js
var _mod_param = {};
var _wndMod_ParamCon = document.createElement('div');

_wndMod_ParamCon.id = "id_modparam",
_wndMod_ParamCon.className = 'paramPrompt';
	
// 模块详情查看对话框
var _wndModProfile = {},
  	_wndModProfileCon = document.createElement('div');
	//~ _wndModProfileCon.id='id_modprofile',

_wndModProfileCon.style.height = '100%';
	
var _layersParam = {};
var _hasTimeLine = 0;
var _simuUnique = {};
var _timeLien = {};

//  保存为模块的窗口
var _wndSaveMod = null;

// 模块的显示图形窗口
var _wndModDsp = {},
   _dpsgraph = {};

var _dspXml = '',
    _dpsXmlBack = ''; // 保存dsp的xml和xml备份

/*************************************/
// 拖拽的显示元素
var dragElt = document.createElement('div');
dragElt.style.border = 'dashed black 1px';
dragElt.style.width = '64px';
dragElt.style.height = '64px';
dragElt.style.backgroundSize = 'cover';
dragElt.style['position']='absolute';
dragElt.style['z-index']='9999999';

// 仿真参数
var _wndSimuParam = {};

// 插入元件的处理函数
//~ var insertComp=null;

// 全局websocket 对象
var WebSck = null,
  	WebSckUrl = 'ws://192.168.3.66:8003/socket/';

// 绘图记录对象
var Charts = [];

var simu_flag=1;

// 保存模块时，记录模块的显示样式xml(未group)，防止有元件悬空，后台返回后，前台的图形消失
var _MOD_DSP = '';

// 记录IO输入输出
var _IO = {
    'input': {},
    'output': {}
	},
	_OutPut = {};

var _wndIO = null;

// 电气元件符号记录列表
var _pssEle = {},
	_pssEleCount = {};

// 控制元件记录
var _pssCtrl = {},
  	_pssCtrlCount = {};

// 量测元件的记录
var _pssMsr = {},
  	_pssMsrCount = {};

// 模块的记录
var _pssMod = {},
  	_rpssMod = [],
  	_pssModCount = {};

var _pssModId = [],
  	_rpssModId = []; // 记录插入的模块id

var _pssSystem = {},
  	_pssSystemCount = {},
  	_pssSystemId = {};

// 在提交仿真时的元件记录，_pssEle记录的不删除，
var _rpssEle = {},
  	_rpssCtrl = {},
  	_rpssMsr = {},
  	_rpssMod;

var _moreSimuFile = [];

var _pssNode = [],
  	_npssNode = {}; //电气元件的节点数组，默认0的是接地

var _pssNodeCtrl = [[] ],
    _npssNodeCtrl = []; //控制系统的节点数组，节点号从1开始

var _pssNodeMsr = [],
    _npssNodeMsr = []; //量测系统的节点数组

var _pssGndTMp = [];

// 需要显示的电表，显示分组字符串
var _pssMeters = {},
  	_pssDspgrp = [  [] ];

var _pssDspgrp_sum = [];

var _pssDspgrp_sum_Name = [];

// 模块的显示
var _pssInport = [];

var _pssSwitch = [];

// 模块被点击的记录
// [ {} ] [ 'mod1','mod2']
var _pssModRec = [];

// 仿真的参数
var _scale = {
  'ele': 1,
  'table': 0.5
};

var modnames = [];
var systemNames = [];

var _simuPARAM = {
  "_isSet": false, // 用户是否设置过参数
  "start": 0, //仿真开始时间，单位：秒
  "end": 1, //仿真结束时间，单位：秒
  "step": 0.00001, //步长，单位：秒
  "switch": 0.001, //开关周期，单位：秒
  "breakPoint": [] //断点处,断点的数组列表
};

// 仿真的非电气属性
var _simuProp = {
  'name': '',
  'folder': '',
  'simuno': '',
  'desc': '',
  'share': 1
};

// 记录仿真状态，是否在仿真中，仿真图表窗口是否在显示中
var _running = false,
  _runningChart = false;

// task id 和 文件
var _pssTid = '',
  	_pssFile = '';

// 当前被双击的module
var _curModId = null,
  	_curModSym = '';

/********************  另存为模块的工作 *************************/
var _modParam = {
  "_isSet": false, // 用户是否设置过参数
  "name": '',
  "icon": '',
  "sym": '',
  "desc": ''
};

/**/
//加载动画
var opts = {
  lines: 11, // The number of lines to draw
  length: 15, // The length of each line
  width: 6, // The line thickness
  radius: 10, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1.4, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};

var spinner = new Spinner(opts);


//same before flag
var same_before_flag = 0 ;

mxGuide.prototype.isEnabledForEvent = function(evt) {
	  return !mxEvent.isAltDown(evt);
	};

	
mxGraph.prototype.startEditing = function(evt) {
  console.log(evt);
}

mxGraph.prototype.startEditingAtCell = function(cell, evt) {
  return;
  if (evt == null || !mxEvent.isMultiTouchEvent(evt)) {
    if (cell == null) {
      cell = this.getSelectionCell();

      if (cell != null && !this.isCellEditable(cell)) {
        cell = null;
      }
    }

    if (cell != null) {
      this.fireEvent(new mxEventObject(mxEvent.START_EDITING,
        'cell', cell, 'event', evt));
      this.cellEditor.startEditing(cell, evt);
      this.fireEvent(new mxEventObject(mxEvent.EDITING_STARTED,
        'cell', cell, 'event', evt));
    }
  }
};
