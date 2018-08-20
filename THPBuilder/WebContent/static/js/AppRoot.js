
/*
var tempparents = _graph.model.getChildCells(_graph.model.root);
tempparents[0].layerType='emtp';
tempparents[1].layerType='emtp';
tempparents[2].layerType='emtp';
tempparents[3].layerType='sfa';
tempparents[4].layerType='sfa';
tempparents[5].layerType='acb';
*/


//Save all menus file of loaded Project
var appRoots = [];


//Save Index of Opened menus
var appLabels = [];

//CurrentID in appLabels Array
var CurrentID = 0;


//var appproject = '<mxfile><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0" visible="1"/><mxCell id="2"  parent="1" visible="1" value="Thpower," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" parent="1" value="SmartGrid!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" parent="1" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel></mxfile>';

//var appfile1 = '<mxfile><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0" visible="1"/><mxCell id="2"  parent="1" visible="1" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" parent="1" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" parent="1" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel></mxfile>';
//var appfile2 = '<mxfile><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0" visible="1"/><mxCell id="2"  parent="1" visible="1" value="Thpower," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" parent="1" value="SmartGrid!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" parent="1" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel></mxfile>';

/**
 * [用于响应root改变事件]
 * @Author   wugh
 * @DateTime 2017-11-09 T16:36:48+0800
 * @param    {[type]} ui [description]
 * @param    {[type]} app [description]
 * @param    {[type]} select [description]
 * @param    {[type]} index [description]
 */
function ChangeApp(ui, app, select, index) {
	//SelectApp.call(this, ui, select);
	this.relatedApp = app;
	this.previousApp = app;
	this.index = index;
	this.previousIndex = null;
};

//mxUtils.extend(ChangeApp, SelectApp);

/**
 * Function: execute
 * 事件操作函数
 * Changes the current root of the view.
 */
ChangeApp.prototype.execute = function() {
	// Fires event to setting view state from realtime
	_editorUI.fireEvent(new mxEventObject('beforeAppChange', 'change', this));
	var tmpRoot = _editorUI.currentApp;
	tmpRoot['node'] = _editorUI.editor.getGraphXml();
	tmpRoot['viewState'] = _graph.getViewState();
	tmpRoot.root = _graph.model.root;
	tmpRoot.current = 0;
	_graph.view.clear(tmpRoot.root, true);
	_graph.clearSelection(tmpRoot.root);

	_editorUI.currentApp = this.previousApp;
	this.previousApp = tmpRoot;
	var appRoot = _editorUI.currentApp;
	_graph.model.rootChanged(appRoot.root);
	_graph.setViewState(appRoot.viewState);
	_graph.fireEvent(new mxEventObject(mxEvent.ROOT));
	appRoot.current = 1;

	_editorUI.currentAppID = this.index;
	_editorUI.fireEvent(new mxEventObject('endChange', 'change', this));
};


/**
 * [添加app并切换到app层]
 * @Author   wugh
 * @DateTime 2017-11-09T16:39:20+0800
 * @param    {[type]} app [description]
 * @param    {[type]} index [description]
 * @return   {[type]} [description]
 */
EditorUi.prototype.insertApp = function(app, index) {
	if (this.editor.graph.isEnabled()) {
		var change = new ChangeApp(this, app, app, index);
		this.updateAppRoot(app)
		this.editor.graph.model.execute(change, index);
	}

	return app;
};

/**
 * [更新app 如果app不存在创建]
 * @Author   wugh
 * @DateTime 2017-11-09T16:39:56+0800
 * @param    {[type]} app [description]
 * @return   {[type]} [description]
 */
EditorUi.prototype.updateAppRoot = function(app) {
	if (app.root == null) {
		//	var node = this.editor.extractGraphModel(app.node);
		var node = app.node;
		if (node != null) {
			app.graphModelNode = node;

			// Converts model XML into App object with root cell
			app.viewState = this.editor.graph.createViewState(node);
			var codec = new mxCodec(node.ownerDocument);
			app.root = codec.decode(node).root;
		} else {
			// Initializes App object with new empty root
			app.root = this.editor.graph.model.createRoot();
		}
	}

	return app;
};



EditorUi.prototype.setEngEdgeStyle = function(indexOf) {
	//var state = graph.view.getState(cell);
	var graph = this.editor.graph;
	var style = null;
	if (indexOf == 1) {
		style = {
			"shape": "flexArrow",
			"labelBackgroundColor": "#FFFFFF",
			"fontSize": "9",
			"fontFamily": "Helvetica",
			"align": "center",
			"verticalAlign": "middle",
			"rounded": 1,
			"strokeColor": "#000033",
			"fontColor": "#000000",
			"edgeStyle": "orthogonalEdgeStyle",
			"movable": "0",
			"strokeWidth": 2,
			"startSize": 4,
			"endSize": 4,
			"html": 1,
			"exitX": 0.5,
			"exitY": 0,
			"jettySize": "auto",
			"orthogonalLoop": 1,
			"endArrow": "block",
			"fillColor": "#00CC00"
		};

	} else if (indexOf == 2) {
		style = {
			"shape": "flexArrow",
			"labelBackgroundColor": "#FFFFFF",
			"fontSize": "9",
			"fontFamily": "Helvetica",
			"align": "center",
			"verticalAlign": "middle",
			"rounded": 1,
			"strokeColor": "#000033",
			"fontColor": "#000000",
			"edgeStyle": "orthogonalEdgeStyle",
			"movable": "0",
			"strokeWidth": 2,
			"startSize": 4,
			"endSize": 4,
			"html": 1,
			"exitX": 0.5,
			"exitY": 0,
			"jettySize": "auto",
			"orthogonalLoop": 1,
			"endArrow": "block",
			"fillColor": "#CC0000"
		};

	} else if (indexOf == 3) {
		style = {
			"shape": "flexArrow",
			"labelBackgroundColor": "#FFFFFF",
			"fontSize": "9",
			"fontFamily": "Helvetica",
			"align": "center",
			"verticalAlign": "middle",
			"rounded": 1,
			"strokeColor": "#000033",
			"fontColor": "#000000",
			"edgeStyle": "orthogonalEdgeStyle",
			"movable": "0",
			"strokeWidth": 2,
			"startSize": 4,
			"endSize": 4,
			"html": 1,
			"exitX": 0.5,
			"exitY": 1,
			"endArrow": "block",
			"jettySize": "auto",
			"orthogonalLoop": 1,
			"fillColor": "#0000CC"
		};

	} else if (indexOf == 0) {
		//style={"shape":"connector","labelBackgroundColor":"#FFFFFF","fontSize":"9","fontFamily":"Helvetica","align":"center","verticalAlign":"middle","rounded":0,"strokeColor":"#000000","fontColor":"#000000","edgeStyle":"orthogonalEdgeStyle","movable":"0","strokeWidth":2,"startSize":4,"endSize":4,"html":1,"exitX":0.5,"exitY":0.5,"sourcePort":"n","targetPort":"n","jettySize":"auto","orthogonalLoop":1};
		//style={"shape":"connector","verticalAlign":"middle","align":"center","strokeColor":"#000000","fontColor":"#000000","labelBackgroundColor":"#FFFFFF","edgeStyle":"wireEdgeStyle","fontSize":"9","movable":"0","strokeWidth":2,"startSize":7,"endSize":7};
	}
	var cell = graph.createEdge(null, null, null, null, null, style);
	var state = new mxCellState(graph.view, cell, graph.getCellStyle(cell));
	if (style != null) {
		// Ignores default styles
		var clone = cell.clone();
		clone.style = ''
		var defaultStyle = graph.getCellStyle(clone);
		var values = [];
		var keys = [];

		for (var key in style) {
			if (defaultStyle[key] != style[key]) {
				values.push(style[key]);
				keys.push(key);
			}
		}

		// Handles special case for value "none"
		var cellStyle = graph.getModel().getStyle(state.cell);
		//var tokens = (cellStyle != null) ? cellStyle.split(';') : [];

		// for (var i = 0; i < tokens.length; i++) {
		// 	var tmp = tokens[i];
		// 	var pos = tmp.indexOf('=');
		for (var key in cellStyle) {
			var value = cellStyle[key];

			// if (pos >= 0) {
			// 	var key = tmp.substring(0, pos);
			// 	var value = tmp.substring(pos + 1);

			if (defaultStyle[key] != null && value == 'none') {
				values.push(value);
				keys.push(key);
			}
			//}
		}

		// Resets current style
		if (graph.getModel().isEdge(state.cell)) {
			graph.currentEdgeStyle = {};
		} else {
			graph.currentVertexStyle = {}
		}

		this.fireEvent(new mxEventObject('styleChanged', 'keys', keys, 'values', values, 'cells', [state.cell]));
	}
};


/**
 * [extractGraphModel description]
 * @Author   wugh
 * @DateTime 2017-11-09T16:40:24+0800
 * @param    {[type]} node [description]
 * @param    {[type]} allowMxFile [description]
 * @return   {[type]} [description]
 */
Editor.prototype.extractGraphModel = function(node, allowMxFile) {
	if (node != null && typeof(pako) !== 'undefined') {
		var tmp = node.ownerDocument.getElementsByTagName('div');
		var divs = [];

		if (tmp != null && tmp.length > 0) {
			for (var i = 0; i < tmp.length; i++) {
				if (tmp[i].getAttribute('class') == 'mxgraph') {
					divs.push(tmp[i]);
					break;
				}
			}
		}

		if (divs.length > 0) {
			var data = divs[0].getAttribute('data-mxgraph');

			if (data != null) {
				var config = JSON.parse(data);

				if (config != null && config.xml != null) {
					var doc2 = mxUtils.parseXml(config.xml);
					node = doc2.documentElement;
				}
			} else {
				var divs2 = divs[0].getElementsByTagName('div');

				if (divs2.length > 0) {
					var data = mxUtils.getTextContent(divs2[0]);
					data = this.graph.decompress(data);

					if (data.length > 0) {
						var doc2 = mxUtils.parseXml(data);
						node = doc2.documentElement;
					}
				}
			}
		}
	}

	if (node != null && node.nodeName == 'svg') {
		var tmp = node.getAttribute('content');

		if (tmp != null && tmp.charAt(0) != '<' && tmp.charAt(0) != '%') {
			tmp = unescape((window.atob) ? atob(tmp) : Base64.decode(cont, tmp));
		}

		if (tmp != null && tmp.charAt(0) == '%') {
			tmp = decodeURIComponent(tmp);
		}

		if (tmp != null && tmp.length > 0) {
			node = mxUtils.parseXml(tmp).documentElement;
		} else {
			throw {
				message: mxResources.get('notADiagramFile')
			};
		}
	}

	if (node != null && !allowMxFile) {
		var diagramNode = null;

		if (node.nodeName == 'diagram') {
			diagramNode = node;
		} else if (node.nodeName == 'mxfile') {
			var diagrams = node.getElementsByTagName('diagram');

			if (diagrams.length > 0) {
				diagramNode = diagrams[Math.max(0, Math.min(diagrams.length - 1, urlParams['app'] || 0))];
			}
		}

		if (diagramNode != null) {
			node = mxUtils.parseXml(this.graph.decompress(mxUtils.getTextContent(diagramNode))).documentElement;
		}
	}

	if (node != null && node.nodeName != 'mxGraphModel' && (!allowMxFile || node.nodeName != 'mxfile')) {
		node = null;
	}

	return node;
};

/**
 * Overrides setDefaultParent
 * 获取app的历史状态
 */
Graph.prototype.getViewState = function() {
	return {
		defaultParent: this.defaultParent,
		currentRoot: this.view.currentRoot,
		gridEnabled: this.gridEnabled,
		//gridColor: this.view.gridColor,
		gridSize: this.gridSize,
		guidesEnabled: this.graphHandler.guidesEnabled,
		foldingEnabled: this.foldingEnabled,
		scrollbars: this.scrollbars,
		AppVisible: this.AppVisible,
		background: this.background,
		backgroundImage: this.backgroundImage,
		AppScale: this.AppScale,
		AppFormat: this.AppFormat,
		tooltips: this.tooltipHandler.isEnabled(),
		connect: this.connectionHandler.isEnabled(),
		arrows: this.connectionArrowsEnabled,
		scale: this.view.scale,
		scrollLeft: this.container.scrollLeft - this.view.translate.x * this.view.scale,
		scrollTop: this.container.scrollTop - this.view.translate.y * this.view.scale,
		translate: this.view.translate.clone(),
		lastPasteXml: this.lastPasteXml,
		pasteCounter: this.pasteCounter,
		mathEnabled: this.mathEnabled
	};
};

/**
 * Overrides setDefaultParent
 * 设置创建app历史状态
 */
Graph.prototype.setViewState = function(state) {
	if (state != null) {
		this.lastPasteXml = state.lastPasteXml;
		this.pasteCounter = state.pasteCounter || 0;
		this.mathEnabled = state.mathEnabled;
		this.gridEnabled = state.gridEnabled;
		//this.view.gridColor = state.gridColor;
		this.gridSize = state.gridSize;
		this.graphHandler.guidesEnabled = state.guidesEnabled;
		this.foldingEnabled = state.foldingEnabled;
		this.scrollbars = state.scrollbars;
		this.AppVisible = state.AppVisible;
		this.background = state.background;
		this.backgroundImage = state.backgroundImage;
		this.AppScale = state.AppScale;
		this.AppFormat = state.AppFormat;
		this.view.scale = state.scale;
		this.view.currentRoot = state.currentRoot;
		this.defaultParent = state.defaultParent;
		this.connectionArrowsEnabled = state.arrows;
		this.setTooltips(state.tooltips);
		this.setConnectable(state.connect);

		// Checks if current root or default parent have been removed
		if (!this.model.contains(this.view.currentRoot)) {
			this.view.currentRoot = null;
		}

		if (!this.model.contains(this.defaultParent)) {
			this.setDefaultParent(null);
		}

		if (state.translate != null) {
			this.view.translate = state.translate;
		}
	} else {
		this.view.currentRoot = null;
		this.view.scale = 1;
		this.gridEnabled = true;
		this.gridSize = mxGraph.prototype.gridSize;
		this.AppScale = mxGraph.prototype.AppScale;
		this.AppVisible = this.defaultAppVisible;
		this.background = this.defaultGraphBackground;
		this.backgroundImage = null;
		this.scrollbars = this.defaultScrollbars;
		this.graphHandler.guidesEnabled = true;
		this.foldingEnabled = true;
		this.defaultParent = null;
		this.setTooltips(true);
		this.setConnectable(true);
		this.lastPasteXml = null;
		this.pasteCounter = 0;
		this.mathEnabled = false;
		this.connectionArrowsEnabled = true;
	}

	// Implicit settings
	this.AppBreaksVisible = this.AppVisible;
	this.preferAppSize = this.AppVisible;
};

/**
 * 保存文件
 * @Author   wugh
 * @DateTime 2017-11-09T16:42:28+0800
 * @return   {[type]} [description]
 */
EditorUi.prototype.saveAppFile = function() {
		var node = this.editor.getGraphXml();
		this.currentApp.node = node;
//		var fileNode = node.ownerDocument.createElement('mxfile');
//		for (var key in appRoots) {
//			appRoots[key].node.setAttribute('appName', appRoots[key].name);
//			appRoots[key].node.setAttribute('appType', appRoots[key].type);
//			appRoots[key].node.setAttribute('typeFloor', appRoots[key].typeFloor);
//			if (appRoots[key].current) {
//				appRoots[key].node.setAttribute('isSelect', 1);
//			}
//			fileNode.appendChild(appRoots[key].node);
//		}
		//var node = mxUtils.createXmlDocument();
		
		var projectNode = node.ownerDocument.createElement('mxproject');
		for (var key in appRoots) {
			var fileNode = node.ownerDocument.createElement('mxfile');
			appRoots[key].node.setAttribute('appId', appRoots[key].id);
			appRoots[key].node.setAttribute('appName', appRoots[key].name);
			appRoots[key].node.setAttribute('appType', appRoots[key].type);
			appRoots[key].node.setAttribute('appIndex', appRoots[key].index);
			appRoots[key].node.setAttribute('typeFloor', appRoots[key].typeFloor);
			if (appRoots[key].current) {
				appRoots[key].node.setAttribute('isSelect', 1);
			}
			
			fileNode.appendChild(appRoots[key].node);
			
			projectNode.appendChild(fileNode);
		}
			
		
		return mxUtils.getXml(projectNode);
	}



	/**
	 * 导入文件
	 * @Author   wugh
	 * @DateTime 2017-11-09T16:42:16+0800
	 * @param    {[type]} data [description]
	 * @return   {[type]} [description]
	 */
EditorUi.prototype.loadAppFile = function(data) {
	
	this.currentApp = null;
	this.fileNode = null;
	//this.pages = null;
	GModel.graph = _graph;
	_graph.model.beginUpdate();
	
	try {
		//var node = (data != null && data.length > 0) ? mxUtils.parseXml(data).documentElement : null;

		// Some nodes must be extracted here to find the mxfile node
		// LATER: Remove duplicate call to extractGraphModel in overridden setGraphXml
		//var tmp = (node != null) ? this.editor.extractGraphModel(node, true) : null;

		//if (tmp != null) {
		//	node = tmp;
		//}
		
		var node;
				
		if (data.project.length>0)
		{
				//this.fileNode = node;
				//	this.pages = [];
				var selectID = 0;				
				
				// Wraps page nodes
				for (var i = 0; i < data.project.length; i++) {

					node = data.project[i];
					
					//var page = new DiagramPage(nodes[i]);
					//appRoots[i]={};
					var app = {};
					
					app.id = node.appId;
					app.name = node.appName;
					app.type = node.appType;
					app.index = node.appIndex;
					
					var nodegg= mxUtils.parseXml(node.appRoot).documentElement;
					var nodehh = this.editor.extractGraphModel(nodegg, true);
					var nodeskk = nodehh.getElementsByTagName('mxGraphModel');
					var tempNode = nodeskk[0].cloneNode(true);
					var codeccc = new mxCodec(nodeskk[0].ownerDocument);
					var noderoot = codeccc.decode(nodeskk[0]).root;	
					
					app.root = noderoot;
					app.node = tempNode;

					app.current = node.current;
					app.typeFloor = node.typeFloor;
							
					
					appRoots.push(app);
				}
				
				/////////////////////////////////////////////////////////////////////////////////////////
				//test
				//new xj
				
				//var page = new DiagramPage(nodes[i]);
				//appRoots[i]={};
				/*
				var app = {};
				
				app.id = "100";
				app.name = "xuji";
				app.type = node.appType;
				app.index = node.appIndex;				
				
				app.root = _xj_mxgraph.root;
				app.node = _xj_mxgraph;
				
				app.current = node.current;
				app.typeFloor = node.typeFloor;
				
				
				appRoots.push(app);
				*/
				
				/////////////////////////////////////////////////////////////////////////////////////////

				this.currentAppID = selectID ? selectID : 0;
				this.currentApp = appRoots[this.currentAppID];
				node = this.currentApp.node;
				
				//Label index Container
				appLabels.push(this.currentAppID);
				
		} 

		// Avoids scroll offset when switching page
		this.editor.setGraphXml(node);

		// Avoids duplicate parsing of the XML stored in the node
		if (this.currentApp != null) {
			this.currentApp.root = this.editor.graph.model.root;
		}
	}catch(err)
	{
		console.error(err.message);
		
	}finally {
		_graph.model.endUpdate();
	}
}


EditorUi.prototype.insertAppFile = function(data) {
	
	//this.currentApp = null;
	//this.fileNode = null;
	//this.pages = null;
	
	_graph.model.beginUpdate();
	
	try {
		
		var node;
				
		if (data.menu.length>0)
		{	
			// Wraps page nodes
			for (var i = 0; i < data.menu.length; i++) {

				node = data.menu[i];
				
				//var page = new DiagramPage(nodes[i]);
				//appRoots[i]={};
				var app = {};
				
				app.id = node.appId;
				app.name = node.appName;
				app.type = node.appType;
				app.index = node.appIndex;
				
				var nodegg= mxUtils.parseXml(node.appRoot).documentElement;
				var nodehh = this.editor.extractGraphModel(nodegg, true);
				var nodeskk = nodehh.getElementsByTagName('mxGraphModel');
				var codeccc = new mxCodec(nodeskk[0].ownerDocument);
				var noderoot = codeccc.decode(nodeskk[0]).root;	
				
				app.root = noderoot;
				app.node = nodeskk[0];

				app.current = node.current;
				app.typeFloor = node.typeFloor;
				
				appRoots.push(app);
						
			}
		} 

		// Avoids scroll offset when switching page
		this.editor.setGraphXml(node);

		// Avoids duplicate parsing of the XML stored in the node
		if (this.currentApp != null) {
			this.currentApp.root = this.editor.graph.model.root;
		}
		
	} finally {
		_graph.model.endUpdate();
	}
}

EditorUi.prototype.renameAppFile = function(menuid, menuname) {
	
	_graph.model.beginUpdate();
	
	try {
		
			// Wraps page nodes
			for (var i = 0; i < appRoots.length; i++) {				
				if(appRoots[i].id == menuid)
					appRoots[i].name = menuname;				
			}
		
	} finally {
		_graph.model.endUpdate();
	}
}

EditorUi.prototype.deleteAppFile = function(menuid) {
	
	_graph.model.beginUpdate();
	
	try {
		
		// Wraps page nodes
		for (var i = 0; i < appRoots.length; i++) {				
			if(appRoots[i].id == menuid)
				appRoots.splice(i, 1);			
		}
		
	} finally {
		_graph.model.endUpdate();
	}
}

/*
 EditorUi.prototype.loadAppFile = function(data) {
	
	this.currentApp = null;
	this.fileNode = null;
	//this.pages = null;
	
	_graph.model.beginUpdate();
	
	try {
		var node = (data != null && data.length > 0) ? mxUtils.parseXml(data).documentElement : null;

		// Some nodes must be extracted here to find the mxfile node
		// LATER: Remove duplicate call to extractGraphModel in overridden setGraphXml
		var tmp = (node != null) ? this.editor.extractGraphModel(node, true) : null;

		if (tmp != null) {
			node = tmp;
		}
		
		//var nodegg= mxUtils.parseXml(apphelloworld1).documentElement;
		//var nodehh = this.editor.extractGraphModel(nodegg, true);
		//var nodeskk = nodehh.getElementsByTagName('mxGraphModel');
		//var codeccc = new mxCodec(nodeskk[0].ownerDocument);
		//noderoot = codeccc.decode(nodeskk[0]).root;
		
		if (node != null && node.nodeName == 'mxfile') {
			var nodes = node.getElementsByTagName('mxGraphModel');

			if (nodes.length > 1 ||
				(nodes.length == 1 && nodes[0].hasAttribute('appName'))) {
				this.fileNode = node;
				//	this.pages = [];
				var selectID = null;				
				
				// Wraps page nodes
				for (var i = 0; i < nodes.length; i++) {

					//var page = new DiagramPage(nodes[i]);
					//appRoots[i]={};
					var app = {};
					app.node = nodes[i];
					// Checks for invalid page names
					if (app.name == null) {
						app.name = nodes[i].getAttribute('appName');
						app.type = nodes[i].getAttribute('appType');
						app.typeFloor = nodes[i].getAttribute('typeFloor');
						//page.name=.setName(mxResources.get('pageWithNumber', [i + 1]));
						app.current = nodes[i].getAttribute('isSelect');
						if (app.current) {
							selectID = i;
						}
					}
					
					var codec = new mxCodec(nodes[i].ownerDocument);
					app.root = codec.decode(nodes[i]).root;		
					
					appRoots.push(app);
				}

				this.currentApp = appRoots[selectID ? selectID : 0];
				this.currentAppID = selectID ? selectID : 0;
				node = this.currentApp.node;
			}
		} else if (node != null && node.nodeName == 'mxGraphModel') {
			var app = {};
			app.node = node;
			app.name = node.getAttribute('appName') ? node.getAttribute('appName') : 'defaultApp';
			app.type = 'EMTP';
			app.current = 1;
			this.fileNode = node.ownerDocument.createElement('mxfile');
			var model = new mxGraphModel();
			var codec = new mxCodec(node);
			codec.decode(node.documentElement, _graph.getModel());
			appRoots.push(app);
			var layerParam = {
				'Application Name': "defaultApp",
				Type: "EMTP",
				deltaT: '50e-6',
				firstSimTime: ''
			}
			_pssEle[layerParam['Application Name']] = {
				'name': layerParam['Application Name'],
				'thutype': 'timing',
				'sym': layerParam['Application Name'],
				'pin': {
					"0": {
						"node": -1,
						"id": 0,
						"label": ""
					},
					"1": {
						"node": -1,
						"id": 0,
						"label": ""
					}
				},
				"param": [layerParam],
				'_mid': -1,
				'ctrlable': 0,
				'Type': layerParam.Type
			}
			_layersParam[0] = layerParam;
			this.currentApp = appRoots[0];
			this.currentAppID = 0;
		}

		// Creates tabbed file structure if enforced by URL
		if (this.fileNode == null) {
			node = this.editor.getGraphXml(false);
			this.fileNode = node.ownerDocument.createElement('mxfile');
			var appRoot = {};
			appRoot.node = node.ownerDocument.createElement('mxGraphModel');
			this.currentApp = appRoot;
			this.currentApp.name = 'defaultApp';
			this.currentApp.type = editorType[urlParams['editorType'] ? urlParams['editorType'] : 0]['type'];
			this.currentApp.typeFloor = editorType[urlParams['editorType'] ? urlParams['editorType'] : 0]['typeFloor'];
			this.currentApp.current = 1;
			var layerParam = {
				'Application Name': "defaultApp",
				Type: "EMTP",
				deltaT: '50e-6',
				firstSimTime: ''
			}
			_pssEle[layerParam['Application Name']] = {
				'name': layerParam['Application Name'],
				'thutype': 'timing',
				'sym': layerParam['Application Name'],
				'pin': {
					"0": {
						"node": -1,
						"id": 0,
						"label": ""
					},
					"1": {
						"node": -1,
						"id": 0,
						"label": ""
					}
				},
				"param": [layerParam],
				'_mid': -1,
				'ctrlable': 0,
				'Type': layerParam.Type
			}
			_layersParam[0] = layerParam;
			this.currentAppID = 0;
			appRoots = [this.currentApp];
		}

		// Avoids scroll offset when switching page
		this.editor.setGraphXml(node);

		// Avoids duplicate parsing of the XML stored in the node
		if (this.currentApp != null) {
			this.currentApp.root = this.editor.graph.model.root;
		}
	} finally {
		_graph.model.endUpdate();
	}
}
*/

/**
 * 创建app设置
 * @Author   wugh
 * @DateTime 2017-11-09T16:42:36+0800
 * @param    {[type]} node [description]
 * @return   {[type]} [description]
 */
Graph.prototype.createViewState = function(node) {
	var pv = node.getAttribute('page');
	var ps = node.getAttribute('pageScale');
	var pw = node.getAttribute('pageWidth');
	var ph = node.getAttribute('pageHeight');
	var bg = node.getAttribute('background');
	var temp = node.getAttribute('backgroundImage');
	var bgImg = (temp != null && temp.length > 0) ? JSON.parse(temp) : null;

	return {
		gridEnabled: node.getAttribute('grid') != '0',
		//gridColor: node.getAttribute('gridColor') || mxSettings.getGridColor(),
		gridSize: parseFloat(node.getAttribute('gridSize')) || mxGraph.prototype.gridSize,
		guidesEnabled: node.getAttribute('guides') != '0',
		foldingEnabled: node.getAttribute('fold') != '0',
		shadowVisible: node.getAttribute('shadow') == '1',
		pageVisible: (this.lightbox) ? false : ((pv != null) ? (pv != '0') : this.defaultPageVisible),
		background: (bg != null && bg.length > 0) ? bg : this.defaultGraphBackground,
		backgroundImage: (bgImg != null) ? new mxImage(bgImg.src, bgImg.width, bgImg.height) : null,
		pageScale: (ps != null) ? ps : mxGraph.prototype.pageScale,
		pageFormat: (pw != null && ph != null) ? new mxRectangle(0, 0,
			parseFloat(pw), parseFloat(ph)) : this.pageFormat,
		tooltips: node.getAttribute('tooltips') != '0',
		connect: node.getAttribute('connect') != '0',
		arrows: node.getAttribute('arrows') != '0',
		mathEnabled: node.getAttribute('math') != '0',
		selectionCells: null,
		defaultParent: null,
		scrollbars: this.defaultScrollbars,
		scale: 1
	};
};

/**
 * 创建app
 * @Author   wugh
 * @DateTime 2017-11-09T16:43:04+0800
 * @param    {[type]} name [description]
 * @return   {[type]} [description]
 */
function creatAppRoot(name, type, floor) {
	_graph.model.beginUpdate();
	try {
		var appRoot = {
			name: name,
			type: type,
			typeFloor: floor
		};
		appRoots.push(_editorUI.insertApp(appRoot, appRoots.length));
	} finally {
		_graph.model.endUpdate();
	}
}

function changeAppRoot(id, name, type) {
	if (id != null) {
		_editorUI.insertApp(appRoots[id], id);
		return;
	}
	if (name) {
		for (var i = 0; i < appRoots.length; i++) {
			if (appRoots[i].name == name) {
				_editorUI.insertApp(appRoots[i], i);
				return;
			}
		}
		if (type) {
			var appRoot = {
				name: name,
				type: type
			};
			appRoots.push(_editorUI.insertApp(appRoot, appRoots.length));
		}

	}
}