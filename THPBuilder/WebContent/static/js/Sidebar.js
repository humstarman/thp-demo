/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new sidebar for the given editor.
 */

function SidebarBast(editorUi, container) {
    this.editorUi = editorUi;
    this.container = container;
    this.init();
}


SidebarBast.prototype.labelIndex = 0;

/**
 * Returns information about the current selection.
 */
SidebarBast.prototype.currentIndex = 0;


SidebarBast.prototype.init = function() {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    // this.update = mxUtils.bind(this, function(sender, evt) {
    // //before upating formatpane ,checkout saveflag.changed vaule if it needs
	// to be saved
    // if (saveflag.changed == 1) {
    // savewithflag();
    // resetflag();
    // }
    // this.clearSelectionState();
    // this.refresh();


    // });

    // graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
    // graph.addListener(mxEvent.EDITING_STARTED, this.update);
    // graph.addListener(mxEvent.EDITING_STOPPED, this.update);
    // graph.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this,
	// function() {
    // this.clearSelectionState();
    // }));
    // graph.addListener(mxEvent.ROOT, mxUtils.bind(this, function() {
    // this.refresh();
    // }));

    this.refresh();
};

SidebarBast.prototype.refresh = function() {

    // Performance tweak: No refresh needed if not visible
    if (this.container.style.width == '0px') {
        return;
    }
    this.panels = [];
    // this.clear();
    var ui = this.editorUi;
    var graph = ui.editor.graph;

    var div = document.createElement('div');
    div.style.whiteSpace = 'nowrap';
    div.style.color = 'rgb(112, 112, 112)';
    div.style.textAlign = 'left';
    div.style.width = '99%';
    // div.style.cursor = 'default';

    // add top tab on left sidebar: label & label2
    var label = document.createElement('div');
    label.style.border = '1px solid #c0c0c0';
    label.style.borderWidth = '0px 0px 1px 0px';
    label.style.textAlign = 'center';
    label.style.fontWeight = 'bold';
    label.style.overflow = 'hidden';
    label.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
    label.style.paddingTop = '8px';
    label.style.height = (mxClient.IS_QUIRKS) ? '34px' : '25px';
    label.style.width = '100%';
    // label.style.color = 'white';
    label.setAttribute('class', 'formatTitle');
    
    this.container.appendChild(div);

    var containsLabel = null;
    var currentLabel = null;
    var currentPanel = null;

    var addClickHandler = mxUtils.bind(this, function(elt, panel, index) {
        var clickHandler = mxUtils.bind(this, function(evt) {
            if (currentLabel != elt) {
                if (containsLabel) {
                    this.labelIndex = index;
                } else {
                    this.currentIndex = index;
                }

                if (currentLabel != null) {
                    currentLabel.style.backgroundColor = '#d7d7d7';
                    currentLabel.style.borderBottomWidth = '1px';
                }

                currentLabel = elt;
                currentLabel.style.backgroundColor = '';
                currentLabel.style.borderBottomWidth = '0px';

                if (currentPanel != panel) {
                    if (currentPanel != null) {
                        currentPanel.style.display = 'none';
                    }

                    currentPanel = panel;
                    currentPanel.style.display = '';
                }
            }
        });

        mxEvent.addListener(elt, 'click', clickHandler);

        if (index == ((containsLabel) ? this.labelIndex : this.currentIndex)) {
            // Invokes handler directly as a workaround for no click on DIV in
			// KHTML.
            clickHandler();
        }
    });

    var idx = 0;

    label.style.backgroundColor = '#d7d7d7';
    label.style.borderLeftWidth = '1px';
    // label.style.width = (containsLabel) ? '50%' : '33.3%';
    // label.style.width = (ui.isModule) ? '50%' : '33.3%';
    label.style.width = '50%';
    
    var label2 = label.cloneNode(false);
    // var label3 = label2.cloneNode(false);

    // Workaround for ignored background in IE
    label2.style.backgroundColor = '#d7d7d7';
    // label3.style.backgroundColor = '#d7d7d7';

    // controls list
    if (containsLabel) {
        label2.style.borderLeftWidth = '0px';
    }
    else 
    {
        label.style.borderLeftWidth = '0px';
        mxUtils.write(label,  mxResources.get('eletbale'));
        div.appendChild(label);
        label.setAttribute('title', mxResources.get('eletbale'))
        
        var paramPanel = div.cloneNode(false);
        paramPanel.className = 'sidebar_ele_list_';
        // paramPanel.className='geSidebarContainer';
        var tmp = this.container.cloneNode(false);
        paramPanel.style = tmp.style
        var sidebarHeight = Math.max(0, this.editorUi.container.clientHeight - this.editorUi.footerHeight - this.editorUi.menubarHeight - this.editorUi.toolbarHeight);
        paramPanel.style.height = (sidebarHeight - Number(label.style.height.substring(0, label.style.height.length - 2)) - 27) + 'px'
        paramPanel.style.overflow = 'auto';
        paramPanel.style.display = 'none';
        
        this.eleList = new Sidebar(ui, paramPanel, 0);
        this.panels.push(this.eleList);
        this.container.appendChild(paramPanel);

        addClickHandler(label, paramPanel, idx++);
    }

    // apps list
    var textPanel = div.cloneNode(false);
    textPanel.style.display = 'none';
    // this.panels.push(new TextFormatPanel(this, ui, textPanel));
    mxUtils.write(label2, mxResources.get('resourceTree'));
    label2.setAttribute( 'title', mxResources.get('resourceTree'));
    (!ui.isModule) && div.appendChild(label2);

    var treePanel = div.cloneNode(false);
    treePanel.style.display = 'none';
    var tmp = this.container.cloneNode(false);
    treePanel.style = tmp.style
    var sidebarHeight = Math.max(0, this.editorUi.container.clientHeight - this.editorUi.footerHeight - this.editorUi.menubarHeight - this.editorUi.toolbarHeight);
    treePanel.style.height = (sidebarHeight - Number(label.style.height.substring(0, label.style.height.length - 2)) - 27) + 'px'
    treePanel.style.overflow = 'auto';
    treePanel.style.display = 'none';
    
    this.panels.push(new TreeMenuPanel(this, ui, treePanel));
    
    this.container.appendChild(treePanel);

    addClickHandler(label2, treePanel, idx++);
       
    // Arrange
    /*
	 * mxUtils.write(label3, mxResources.get('useTable'));
	 * div.appendChild(label3); label3.setAttribute('title',
	 * mxResources.get('useTable')); var usedPanel = div.cloneNode(false);
	 * usedPanel.style.display = 'none'; var tmp =
	 * this.container.cloneNode(false); usedPanel.style = tmp.style var
	 * sidebarHeight = Math.max(0, this.editorUi.container.clientHeight -
	 * this.editorUi.footerHeight - this.editorUi.menubarHeight -
	 * this.editorUi.toolbarHeight); usedPanel.style.height = (sidebarHeight -
	 * Number(label.style.height.substring(0, label.style.height.length - 2)) -
	 * 27) + 'px' usedPanel.style.overflow = 'auto'; usedPanel.style.display =
	 * 'none';
	 * 
	 * this.usedTable = new UsedComponentTable(this, ui, usedPanel);
	 * this.panels.push(this.usedTable); this.container.appendChild(usedPanel);
	 * 
	 * addClickHandler(label3, usedPanel, idx++);
	 * 
	 */
    
    div.className = 'sidebartabs_';
    
};

/**
 * 已使用元件表
 */

function UsedComponentTable(sidebar, ui, container) {
    this.sidebar = sidebar;
    this.ui = ui;
    this.container = container;
    this.init();
}

UsedComponentTable.prototype.init = function() {
    this.container.appendChild(this.addComponentTable(this.createPanel()));
}

UsedComponentTable.prototype.createPanel = function() {
    var div = document.createElement('div');
    div.style.padding = '12px 0px 12px 18px';
    div.style.borderBottom = '1px solid #c0c0c0';

    return div;
};
UsedComponentTable.prototype.addComponentTable = function(div) {

    // var div = document.createElement('div');
    if (!div) {
        div = document.getElementById('addComponentTable');
        div.innerHTML = '';
    } else {
        div.id = 'addComponentTable';
    }
    var ui = this.ui;
    var graph = ui.editor.graph;
    var usedTable = {};
    var vts = [];
    var parents = graph.model.getChildCells(graph.model.root);
    for (var i = 0; i < parents.length; i++) {
        var edge = graph.model.getChildVertices(parents[i]);
        for (var x in edge) {
            var sKey = edge[x].classname ? edge[x].classname : edge[x].value;
            if (graph.model.isVisible(edge[x]) && _pssEle[sKey]) {
                vts.push(edge[x]);

                usedTable[_pssEle[sKey].sym] = usedTable[_pssEle[sKey].sym] ? usedTable[_pssEle[sKey].sym] : [];
                usedTable[_pssEle[sKey].sym].push(edge[x].value);
            }

        }
    }

    var listtypetable = document.createElement('table');
    listtypetable.setAttribute('class', 'listtypetable');
    listtypetable.style.width = "92%";
    listtypetable.style.margin = '10px';
    this.currentSelect=this.currentSelect||{};
    var that=this;
    for (var x in usedTable) {
        function createtable(xKey) {
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var a = document.createElement('a');
            var cdiv = document.createElement('div');
            td.style.padding = '0px';
            a.innerHTML = xKey;
            a.value = xKey;
            a.setAttribute('href', 'javascript:void(0);');
            a.setAttribute('class', 'geTitle');

            a.style.backgroundRepeat = 'no-repeat';
            a.style.backgroundPosition = '0% 50%';

            // a.setAttribute('style',shrinkstyle);
            for (var y in usedTable[xKey]) {
                function addtypecom(indx, indy) {
                    var portraitCheckBox = document.createElement('input');
                    var label = document.createElement('label');
                    var ltr = document.createElement('tr');
                    label.className = 'geTitle';
                    mxUtils.write(label, usedTable[xKey][y]);
                    var br = document.createElement('br');
                    cdiv.appendChild(label);
                    mxEvent.addListener(label, 'click', function(evt) {
                        
                        focusTargetCell(searchcellbyname(usedTable[indx][indy]));

                    });
                }
                addtypecom(xKey, y);
            }
            if(!that.currentSelect[xKey]){
                a.style.backgroundImage = 'url(\'' + Dialog.prototype.collapsedImage + '\')';
                a.expand = 0;
                cdiv.style.display = 'none';
            }else{
                a.style.backgroundImage = 'url(\'' + Sidebar.prototype.expandedImage + '\')';
            }

            cdiv.style['margin-left'] = '20px';
            td.appendChild(a);
            td.appendChild(cdiv);
            tr.appendChild(td);
            listtypetable.appendChild(tr);
            mxEvent.addListener(a, 'click', function() {
                that.currentSelect[xKey]=that.currentSelect[xKey]?0:1;
                if (a.expand == 0) {
                    a.style.backgroundImage = 'url(\'' + Sidebar.prototype.expandedImage + '\')';
                    // initTypeComParam(a.value+'-1');
                    cdiv.style.display = '';
                    var t = $(cdiv).find('input');
                    for (var ii = 0; ii < t.length; ii++) {
                        t[ii].click();
                    }
                    a.expand = 1;
                } else {
                    a.style.backgroundImage = 'url(\'' + Dialog.prototype.collapsedImage + '\')';
                    cdiv.style.display = 'none';
                    var t = $(cdiv).find('input');
                    for (var ii = 0; ii < t.length; ii++) {
                        if (t[ii].checked) {
                            t[ii].click();
                        }

                    }
                    a.expand = 0;
                }
            });
        }
        createtable(x);
    }
    div.appendChild(listtypetable);
    return div;
}

// ////////////////////////////////////////////////////////////////////////////////////////




/**
 * 文件树
 * 
 * @param {[type]}
 *            sidebar [description]
 * @param {[type]}
 *            ui [description]
 * @param {[type]}
 *            container [description]
 */
function TreeMenuPanel(sidebar, ui, container) {
    this.sidebar = sidebar;
    this.ui = ui;
    this.container = container;
    this.init();
}
TreeMenuPanel.prototype.init = function() {
    this.container.appendChild(this.addTreeMenu(this.createPanel()));
}
TreeMenuPanel.prototype.createPanel = function() {
    var div = document.createElement('div');
    div.style.padding = '12px 0px 12px 18px';
    div.style.borderBottom = '1px solid #c0c0c0';

    return div;
};


TreeMenuPanel.prototype.addTabListeners = function(page, tab) {
    mxEvent.disableContextMenu(tab);
    var graph = this.ui.editor.graph;
    var model = graph.model;

    // mxEvent.addListener(tab, 'dblclick', mxUtils.bind(this, function(evt)
    // {
    // this.renamePage(page)
    // mxEvent.consume(evt);
    // }));

    var menuWasVisible = false;
    var pageWasActive = false;

    mxEvent.addGestureListeners(tab, mxUtils.bind(this, function(evt) {
            // Do not consume event here to allow for drag and drop of tabs
            // menuWasVisible = this.currentMenu != null;
            // pageWasActive = page == this.currentPage;

        // if (!graph.isMouseDown && !pageWasActive)
        // {
        // this.selectPage(page);
        // }
    }), null, mxUtils.bind(this, function(evt) {
        if (graph.isEnabled() && !graph.isMouseDown &&
            ((mxEvent.isTouchEvent(evt) && pageWasActive) ||
                mxEvent.isPopupTrigger(evt))) {
            graph.popupMenuHandler.hideMenu();
            this.ui.hideCurrentMenu();

            if (!mxEvent.isTouchEvent(evt) || !menuWasVisible) {
                var menu = new mxPopupMenu(this.createPageMenu(page));

                menu.div.className += ' geMenubarMenu';
                menu.smartSeparators = true;
                menu.showDisabled = true;
                menu.autoExpand = true;

                // Disables autoexpand and destroys menu when hidden
                menu.hideMenu = mxUtils.bind(this, function() {
                    mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
                    this.ui.resetCurrentMenu();
                    menu.destroy();
                });

                var x = mxEvent.getClientX(evt);
                var y = mxEvent.getClientY(evt);
                menu.popup(x, y, null, evt);
                this.ui.setCurrentMenu(menu, tab);
            }

            mxEvent.consume(evt);
        }
    }));
};


TreeMenuPanel.prototype.createPageMenu = function(page, label) {
    return mxUtils.bind(this, function(menu, parent) {
        var graph = this.ui.editor.graph;
        var model = graph.model;

        menu.addItem(mxResources.get('insert'), null, mxUtils.bind(this, function() {
            this.addLayer();
            // this.insertPage(null, mxUtils.indexOf(this.pages, page) + 1);
        }), parent);

        menu.addItem(mxResources.get('delete'), null, mxUtils.bind(this, function() {
            this.deleteLayer();
            // this.removePage(page);
        }), parent);

        menu.addItem(mxResources.get('rename'), null, mxUtils.bind(this, function() {
            this.renameLayer(page);
            // this.renamePage(page, label);
        }), parent);

        // menu.addSeparator(parent);

        // menu.addItem(mxResources.get('duplicate'), null, mxUtils.bind(this,
		// function()
        // {
        // //this.duplicatePage(page, mxResources.get('copyOf',
		// [page.getName()]));
        // }), parent);
    });
};

TreeMenuPanel.prototype.addTreeMenu = function(div) {
    var ui = this.ui;
    var editor = ui.editor;
    var graph = editor.graph;
    var selectionLayer = null;

    var treeMenu = document.getElementById('browser')
    if (!treeMenu) {
        treeMenu = document.createElement('ul');
        treeMenu.id = 'browser';
    } else {

    }      

    treeMenu.className = 'filetree';

    var eleFloor = document.createElement('li');
    eleFloor.className = 'expandable lastExpandable';
    treeMenu.appendChild(eleFloor);
    
    var eleFloorSpan = document.createElement('span');
    eleFloorSpan.className = 'folder';
    mxUtils.write(eleFloorSpan, simuName||mxResources.get('eleFloor'));
    eleFloor.appendChild(eleFloorSpan);
    
    var elechildul = document.createElement('ul');
    var elechildli = document.createElement('li');
    eleFloor.appendChild(elechildul);
    elechildul.appendChild(elechildli);

    var addDiv = document.createElement('div');
    // addDiv.style.border = '1px solid #c0c0c0';
    addDiv.style.margin = '0px 0px 0px -8px';
    addDiv.style.borderWidth = '0px 0px 1px 0px';
    addDiv.style.textAlign = 'center';
    addDiv.style.fontWeight = 'bold';
    addDiv.style.overflow = 'hidden';
    addDiv.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
    addDiv.style.paddingTop = '8px';
    addDiv.style.height = (mxClient.IS_QUIRKS) ? '34px' : '25px';
    addDiv.style.width = '100%';
    // addDiv.style.backgroundColor = '#d7d7d7';
    addDiv.style.borderLeftWidth = '1px';
    addDiv.setAttribute('class', 'formatLayer');

    // add
    var addLink = document.createElement('a');
    addLink.innerHTML = '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>';
    addLink.setAttribute('title', mxResources.get('addLayer'));

    // mxEvent.addListener(addLink, 'click', function(evt) {

    this.addLayer = mxUtils.bind(this, function() {
        if (graph.isEnabled()) {
            var dlg = new addNewLayers(ui, mxResources.get('untitledLayer'), mxResources.get('addFile'), mxUtils.bind(this, function(newValue, floor, layerParam) {
                // if (newValue != null)
                // {
                // /// graph.getModel().setValue(layer, newValue);
                // }
              
            	refresh();
                            
				// graph.model.beginUpdate();
				//
				// try {
				// changeAppRoot(null, floor);
				// var layerCount = graph.model.getChildCount(graph.model.root);
				// var cell = graph.addCell(new mxCell(newValue), graph.model.root);
				//
				// //cell.typeFloor = floor;
				// cell.layerType = floor;
				// // if(floor == 'eleFloor'){
				// // cell.layerType = layerParam['Application Name'];
				// // // _layersParam[cell.id] = layerParam;
				//
				//
				// // }else if(floor == 'timeFloor'){
				// // cell.layerType = 'timing';
				// // }
				// graph.setDefaultParent(cell);
				// for (var i = 0; i < layerCount; i++) {
				// var tempchild = graph.model.getChildAt(graph.model.root, i)
				// if (graph.model.isVisible(tempchild)) {
				// graph.model.setVisible(tempchild, !graph.model.isVisible(tempchild));
				// }
				// }
				//                    
				//                    
				// //graph.model.setVisible(cell, !graph.model.isVisible(cell));
				// } finally {
				// graph.center();
				// graph.model.endUpdate();
				// }
				            	

            }), mxResources.get('enterName'));
            ui.showDialog(dlg.container, 360, 160, true, true);
            dlg.init();
        }
        // mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
        addLink.className = 'geButton mxDisabled';
    }

    // delete
    var adddelete = document.createElement('a');
    adddelete.innerHTML = '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>';
    // adddelete.setAttribute('title', mxResources.get('removeIt',
	// [selectionLayer.value || mxResources.get('background')]));

    // mxEvent.addListener(adddelete, 'click', function(evt) {
    this.deleteLayer = mxUtils.bind(this, function() {
        if (mxUtils.confirm('确定删除该图层')) { 

        	var menuid = _editorUI.currentApp.id;
        	
        	deleteMenu(menuid);
			
        	refresh();
        	
// if (graph.isEnabled()) {
// graph.model.beginUpdate();
// try {
// if (selectionLayer.id != 1) {
// var index = graph.model.root.getIndex(selectionLayer);
//
//
// if (selectionLayer.mappingPoint) {
//
// graph.removeCells([graph.model.getCell(selectionLayer.mappingPoint)]);
// }
// graph.removeCells([selectionLayer], false);
//
// // Creates default layer if no layer exists
// if (graph.model.getChildCount(graph.model.root) == 0) {
// graph.model.add(graph.model.root, new mxCell());
// graph.setDefaultParent(null);
// // tempThis.loadsimu(1);
// } else if (index > 0 && index <= graph.model.getChildCount(graph.model.root))
// {
// graph.setDefaultParent(graph.model.getChildAt(graph.model.root, index - 1));
// graph.model.setVisible(graph.model.getChildAt(graph.model.root, index - 1),
// true);
// } else {
// graph.setDefaultParent(null);
// }
//
// } else {
// toastr["warning"](mxResources.get('undelete'));
// }
//                    
// } finally {
// graph.center();
// graph.model.endUpdate();
// }
// }
            
            
        }
        // mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
        adddelete.className = 'geButton mxDisabled';
    }

    // rename
    var renameLink = document.createElement('a');
    renameLink.innerHTML = '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>';

    this.renameLayer = function(layer) {
        if (graph.isEnabled() && layer != null) {
            var dlg = new FilenameDialog(ui, layer.value || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function(newValue) {
            	
            	refresh();
            	
// if (newValue != null) {
// graph.getModel().beginUpdate();
// try {
// if (layer.layersType == 'system') {
// var oldName = layer.value;
// var layerCells = graph.model.getChildVertices(layer);
// for (var i = 0; i < layerCells.length; i++) {
// for (var j = 0; j < layerCells[i].children.length; j++) {
// if (layerCells[i].children) {
// graph.getModel().setValue(layerCells[i].children[j],
// layerCells[i].children[j].value.replace(oldName + '.', newValue + '.'));
// //layerCells[i].children[j].value = cloneChild.value.replace(name,
// childrenName);
// }
// }
// var tempPin = _pssEle[layerCells[i].value]['pin'];
// for (var pinKey in tempPin) {
// tempPin[pinKey]['label'] = tempPin[pinKey]['label'].replace(oldName + '.',
// newValue + '.');
// }
//
// }
// _pssSystem[newValue] = {}
// $.extend(true, _pssSystem[newValue], _pssSystem[oldName]); //深度夝制模块坂数
// delete _pssSystem[oldName];
// var mappingCell = graph.getModel().getCell(layer.mappingPoint);
// for (var i = 0; i < mappingCell.children.length; i++) {
// graph.getModel().setValue(mappingCell.children[i],
// mappingCell.children[i].value.replace(oldName + '.', newValue + '.'));
// }
// var maxLength = newValue.length - oldName.length;
// if (maxLength > 0) {
// mappingCell.geometry.width += maxLength * 13;
// }
// graph.getModel().setValue(mappingCell, newValue);
// }
// graph.getModel().setValue(layer, newValue);
// } finally {
// graph.getModel().endUpdate();
// }
// }
            }), mxResources.get('enterName'));
            ui.showDialog(dlg.container, 300, 150, true, true);
            dlg.init();
        }
    };
    mxEvent.addListener(renameLink, 'click', function(evt) {
        if (graph.isEnabled()) {
            this.renameLayer(selectionLayer);
        }

        // mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
        renameLink.className = 'geButton mxDisabled';
    }

    // dupilcate
    var duplicateLink = document.createElement('a');
    duplicateLink.innerHTML = '<div class="geSprite geSprite-duplicate" style="display:inline-block;"></div>';

    mxEvent.addListener(duplicateLink, 'click', function(evt) {
        if (graph.isEnabled()) {
            var newCell = null;
            graph.model.beginUpdate();
            try {
                newCell = graph.cloneCells([selectionLayer])[0];
                newCell.value = mxResources.get('untitledLayer');
                newCell.setVisible(true);
                newCell = graph.addCell(newCell, graph.model.root);
                graph.setDefaultParent(newCell);
            } finally {
                graph.model.endUpdate();
            }

            if (newCell != null && !graph.isCellLocked(newCell)) {
                graph.selectAll(newCell);
            }
        }
    });

    if (!graph.isEnabled()) {
        duplicateLink.className = 'geButton mxDisabled';
    }

    
    // 右键弹出菜单：添加、重命名、删除
    var that = this;
    addDiv.appendChild(addLink);
    addDiv.appendChild(adddelete);
    addDiv.appendChild(renameLink);
    
    var selectLDiv = null;
    var prevSelect = null;
    var treeStatus=0;
    
    
    // refresh
    function refresh() {
    	
        layerCount = graph.model.getChildCount(graph.model.root)
            // gischildul.innerHTML = '';
        elechildul.innerHTML = '';
        var checkf = {};

        function addLayer(index, label, child, defaultParent, appName, appKey) {
            // if(child.layersType=='system'){
            // return;
            // }
        	
            function addfolder(folderName) {
                var sul = document.createElement('ul');
                var sli = document.createElement('li');
                var folderspan = document.createElement('span');
                var secul = document.createElement('ul');
                var secli = document.createElement('li');
                sul.style['background-color'] = '#f5f5f5';
                sul.style['margin-top'] = '0px';
                secul.style['background-color'] = '#f5f5f5';
                secul.style['margin-top'] = '0px';
                mxUtils.write(folderspan, folderName);
                folderspan.className = 'folder';
                secul.id = folderName;
                sul.appendChild(sli);
                sli.appendChild(folderspan);
                sli.appendChild(secul);
                secul.appendChild(secli);

                elechildul.appendChild(sul);
                return secli;
            }
            
            //添加资源库的树节点：
            var ldiv = document.createElement('div');
            // ldiv.className = 'file';

            ldiv.style.overflow = 'hidden';
            ldiv.style.position = 'relative';
            ldiv.style.display = 'block';
            ldiv.style.backgroundColor = 'whiteSmoke';
            ldiv.style.borderColor = '#c3c3c3';
            ldiv.style.whiteSpace = 'nowrap';
            ldiv.style.cursor = 'pointer';
            ldiv.appKey = appKey;
            
            var left = document.createElement('span');
            left.className = 'file';
            left.style.display = 'inline-block';
            left.style.width = '80%';
            left.style.textOverflow = 'ellipsis';
            left.style.overflow = 'hidden';
            mxUtils.write(left, label);
            ldiv.appendChild(left);

            if (child.isLock) {
                if (child.editorName == editorName) {
                    var img = document.createElement('img');
                    img.setAttribute('border', '0');
                    img.setAttribute('src', Dialog.prototype.unlockedImage);
                    img.setAttribute('title', mxResources.get('hide'));
                    img.style.position = 'relative';

                    ldiv.appendChild(img);
                } else {


                    var img = document.createElement('img');
                    img.setAttribute('border', '0');
                    img.setAttribute('src', Dialog.prototype.lockedImage);
                    img.setAttribute('title', mxResources.get('hide'));
                    img.style.position = 'relative';
                    ldiv.appendChild(img);
                }
            }

           
            if (appRoots[appKey].typeFloor == 'gisFloor') {
                gischildul.appendChild(ldiv);
            } else if (appRoots[appKey].typeFloor == 'tableFloor') {
                tablechildul.appendChild(ldiv);
            } else if (appRoots[appKey].typeFloor == 'timeFloor') {
                timechildul.appendChild(ldiv);
            } else if (appRoots[appKey].typeFloor == 'moreFloor') {
                morechildul.appendChild(ldiv);
            } else if (appRoots[appKey].typeFloor == 'engFloor') {
                engchildul.appendChild(ldiv);
            } else if (appRoots[appKey].typeFloor == 'CPSFloor') {
                cpschildul.appendChild(ldiv);
            } else            
            {
                 // if (checkf[appName] == undefined && appName != undefined)
					// {
                 // var t = addfolder(appName);
                 // t.appendChild(ldiv);
                 // checkf[appName] = t;
                 // } else if (checkf[appName] != undefined && appName !=
					// undefined) {
                 // checkf[appName].appendChild(ldiv);
                 // } else {
                 // elechildul.appendChild(ldiv);
                 // }

                 elechildul.appendChild(ldiv);
            }

            if (appKey == _editorUI.currentAppID) {

                that.addTabListeners(child, ldiv)
            }
            if (graph.getDefaultParent() == child) {
                if (graph.getDefaultParent() != child) {
                    graph.setDefaultParent(child);

                }
                /*
				 * //20171203 if (appRoots[appKey].typeFloor == 'tableFloor') {
				 * 
				 * if (_graph.pageVisible) {
				 * _editorUI.actions.get('pageView').funct(); } if
				 * (ui.floorChange != 1) { _scale['ele'] = _graph.view.scale;
				 * _graph.zoomTo(_scale['table']); var childNodes =
				 * that.sidebar.eleList.container.childNodes; for (var l = 0; l <
				 * childNodes.length;) {
				 * that.sidebar.eleList.container.removeChild(childNodes[l]); }
				 * that.sidebar.eleList.init(2) ui.setEngEdgeStyle(0);
				 * ui.toolbar.removeLineSelect();
				 * _graph.setConnectableEdges(true); }
				 * 
				 * ui.floorChange = 1; } else if (appRoots[appKey].typeFloor ==
				 * 'timeFloor') { if (ui.floorChange != 2) { _scale['ele'] =
				 * _graph.view.scale; _graph.zoomTo(_scale['ele']); var
				 * childNodes = that.sidebar.eleList.container.childNodes; for
				 * (var l = 0; l < childNodes.length;) {
				 * that.sidebar.eleList.container.removeChild(childNodes[l]); }
				 * that.sidebar.eleList.init(3) if (!_graph.pageVisible) {
				 * _editorUI.actions.get('pageView').funct(); }
				 * ui.setEngEdgeStyle(0); ui.toolbar.removeLineSelect();
				 * _graph.setConnectableEdges(true); }
				 * ui.sidebar.usedTable.addComponentTable(); ui.floorChange = 2; }
				 * else if (appRoots[appKey].typeFloor == 'engFloor') { if
				 * (ui.floorChange != 4) { _scale['ele'] = _graph.view.scale;
				 * _graph.zoomTo(_scale['ele']); var childNodes =
				 * that.sidebar.eleList.container.childNodes; for (var l = 0; l <
				 * childNodes.length;) {
				 * that.sidebar.eleList.container.removeChild(childNodes[l]); }
				 * that.sidebar.eleList.init(4) if (!_graph.pageVisible) {
				 * _editorUI.actions.get('pageView').funct(); }
				 * ui.toolbar.addLineSelect();
				 * _graph.setConnectableEdges(false); _graph.refresh(); }
				 * ui.sidebar.usedTable.addComponentTable(); ui.floorChange = 4; }
				 * else if (appRoots[appKey].typeFloor == 'moreFloor') { if
				 * (ui.floorChange != 5) { _scale['ele'] = _graph.view.scale;
				 * _graph.zoomTo(_scale['ele']); var childNodes =
				 * that.sidebar.eleList.container.childNodes; for (var l = 0; l <
				 * childNodes.length;) {
				 * that.sidebar.eleList.container.removeChild(childNodes[l]); }
				 * that.sidebar.eleList.init(5) if (!_graph.pageVisible) {
				 * _editorUI.actions.get('pageView').funct(); }
				 * ui.toolbar.addLineSelect();
				 * _graph.setConnectableEdges(false); }
				 * ui.sidebar.usedTable.addComponentTable(); ui.floorChange = 5; }
				 * else if (appRoots[appKey].typeFloor == 'CPSFloor') { if
				 * (ui.floorChange != 6) { _scale['ele'] = _graph.view.scale;
				 * _graph.zoomTo(_scale['ele']); var childNodes =
				 * that.sidebar.eleList.container.childNodes; for (var l = 0; l <
				 * childNodes.length;) {
				 * that.sidebar.eleList.container.removeChild(childNodes[l]); }
				 * that.sidebar.eleList.init(6) //
				 * ui.createSidebar(ui.sidebarContainer, 6); if
				 * (!_graph.pageVisible) {
				 * _editorUI.actions.get('pageView').funct(); }
				 * ui.toolbar.addLineSelect(); _graph.refresh();
				 * _graph.setConnectableEdges(true); }
				 * ui.sidebar.usedTable.addComponentTable(); ui.floorChange = 6; }
				 * else { //add SelectLine if (ui.floorChange != 0) {
				 * _scale['table'] = _graph.view.scale;
				 * _graph.zoomTo(_scale['ele']); var childNodes =
				 * that.sidebar.eleList.container.childNodes; for (var l = 0; l <
				 * childNodes.length;) {
				 * that.sidebar.eleList.container.removeChild(childNodes[l]); }
				 * that.sidebar.eleList.init(0) //
				 * ui.createSidebar(ui.sidebarContainer); if
				 * (!_graph.pageVisible) {
				 * _editorUI.actions.get('pageView').funct(); }
				 * ui.setEngEdgeStyle(0); ui.toolbar.removeLineSelect()
				 * _graph.setConnectableEdges(true); }
				 * 
				 * ui.sidebar.usedTable.addComponentTable(); ui.floorChange = 0; }
				 */ 
                ldiv.style.background = '#d7d7d7';
                selectionLayer = child;

            } else 
            {
                mxEvent.addListener(ldiv, 'mouseenter', mxUtils.bind(this, function(evt) {
                    if (!graph.isMouseDown) {
                        ldiv.style.backgroundColor = '#d0d0d0';
                        mxEvent.consume(evt);
                    }
                }));

                mxEvent.addListener(ldiv, 'mouseleave', mxUtils.bind(this, function(evt) {
                    ldiv.style.backgroundColor = '#f5f5f5';
                    mxEvent.consume(evt);
                }));

                mxEvent.addListener(ldiv, 'click', function(evt) {
                    graph.model.beginUpdate();
                    try {
                        if (child.editorName == editorName || !child.isLock) {

                            if (graph.isEnabled()) {
                                graph.setDefaultParent(defaultParent);
                                graph.view.setCurrentRoot(null);
                                defaultParent.isOpen = 1;
                                // refresh();
                                if (this.appKey != _editorUI.currentAppID) {
                                    changeAppRoot(this.appKey);
                                }
                                
// for (var i = 0; i < layerCount; i++) {
// var tempchild = graph.model.getChildAt(graph.model.root, i)
// if (graph.model.isVisible(tempchild)) {
// graph.model.setVisible(tempchild, !graph.model.isVisible(tempchild));
// }
// }
// graph.model.setVisible(child, !graph.model.isVisible(child));
                                
                                
                                for (var i = 0; i < appRoots.length; i++) {
                                	if(this.appKey ==i )
                            		{
                                		if( $.inArray(i, appLabels)<0)
                                		{
                                			appLabels.push(i);
                                		}
                                		
                                		//记录当前Labels中显示的ID
                                		CurrentID =i;
                                		
                                		var node = appRoots[i].root;                            
                                		// this.editor.setGraphXml(node);
                                		var newValue;                                		
                                		graph.getModel().setValue(node, newValue);
                            		}
                                }
                                
                            }
                            prevSelect = null;
                            selectLDiv = null;
                            graph.center();
                            mxEvent.consume(evt);
                        } else {
                            alert(mxResources.get('graphLock'));
                        }
                    } finally {
                        graph.model.endUpdate();
                    }
                });
            }

        };

        // Cannot be moved or deleted
        /*
		 * for (var appKey = 0; appKey < appRoots.length; appKey++) { var
		 * appLayerCount = graph.model.getChildCount(appRoots[appKey].root);
		 * 
		 * for (var i = 0; i < appLayerCount; i++) { (mxUtils.bind(this,
		 * function(child, appName, appKey) {
		 * 
		 * if (child.lastSave) { graph.setDefaultParent(child); child.lastSave =
		 * 0; }
		 * 
		 * addLayer(i, child.value || mxResources.get('NewPage'), child, child,
		 * appName, appKey); }))(graph.model.getChildAt(appRoots[appKey].root,
		 * i), appRoots[appKey].name, appKey); } }
		 */
        for (var appKey = 0; appKey < appRoots.length; appKey++) {
        	
        	var appLayerCount = graph.model.getChildCount(appRoots[appKey].root);

        	//appLayerCount 导致多个菜单的出现
        	
        	if(appLayerCount>1)console.log(appRoots[appKey].name + ":" + appLayerCount);
        	
        	//for (var i = 0; i < appLayerCount; i++) {        		
        		(mxUtils.bind(this, function(child, appName, appKey) {
        			
        			if (child.lastSave) {
        				graph.setDefaultParent(child);
        				child.lastSave = 0;
        			}        			
        			//i====》0
        			addLayer(0, appName || mxResources.get('NewPage'), child, child, appName, appKey);
        		}))(graph.model.getChildAt(appRoots[appKey].root, 0), appRoots[appKey].name, appKey);        		
        	//}
        }      
         

    };
    
    refresh();
    
    // _graph.model.getCell(1).layerType='EMTP';
    graph.model.addListener(mxEvent.CHANGE, function() {
        refresh();
    });
    
    
    if (selectionLayer != null) {
        renameLink.setAttribute('title', mxResources.get('renameIt', [selectionLayer.value || mxResources.get('background')]));
        adddelete.setAttribute('title', mxResources.get('removeIt', [selectionLayer.value || mxResources.get('background')]));

    }



    // div.appendChild(addDiv);

    div.appendChild(treeMenu);

    return div;


}



// ////////////////////////////////////////////////////////////////////////////////////////


function Sidebar(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
	this.palettes = new Object();
	this.taglist = new Object();
	this.showTooltips = true;
	this.graph = editorUi.createTemporaryGraph(this.editorUi.editor.graph.getStylesheet());
	this.graph.cellRenderer.antiAlias = false;
	this.graph.foldingEnabled = false;
	
	// Workaround for blank output in IE11-
	if (!mxClient.IS_IE && !mxClient.IS_IE11)
	{
		this.graph.container.style.display = 'none';
	}

	document.body.appendChild(this.graph.container);
	
	this.pointerUpHandler = mxUtils.bind(this, function()
	{
		this.showTooltips = true;
	});
    //触控输入或者鼠标事件
	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', this.pointerUpHandler);

	this.pointerDownHandler = mxUtils.bind(this, function()
	{
		this.showTooltips = false;
		this.hideTooltip();
	});
    //触控输入或者鼠标事件	
	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', this.pointerDownHandler);
	
	this.pointerMoveHandler = mxUtils.bind(this, function(evt)
	{
		var src = mxEvent.getSource(evt);
		
		while (src != null)
		{
			if (src == this.currentElt)
			{
				return;
			}
			
			src = src.parentNode;
		}
		
		this.hideTooltip();
	});
    //触控输入或者鼠标事件
	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.pointerMoveHandler);

	// Handles mouse leaving the window
	this.pointerOutHandler = mxUtils.bind(this, function(evt)
	{
		if (evt.toElement == null && evt.relatedTarget == null)
		{
			this.hideTooltip();
		}
	});
    //触控输入或者鼠标事件
	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerout' : 'mouseout', this.pointerOutHandler);

	// Enables tooltips after scroll
	mxEvent.addListener(container, 'scroll', mxUtils.bind(this, function()
	{
		this.showTooltips = true;
	}));
	var sidebar=this;
    window.setTimeout(function () {
		sidebar.init();
    },0);
	
	// Pre-fetches tooltip image
	if (!mxClient.IS_SVG)
	{
		new Image().src = IMAGE_PATH + '/tooltip.png';
	}
};

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.init = function()
{
	var dir = STENCIL_PATH;
	
	// Sidebar Search and Toolbar Search
	// this.addSearchPalette(true);
    //添加左侧图元库
	GModel.init(this.graph);
    this.addCustomPalette(localStorage.getItem('customGraph'));
    //基本图元库
    this.addGeneralPaletteEX(false);
    //动态图元库
    // this.addDynamicPalette(false);
    //电气图元库（基于解析xml格式的svg）
    // this.addStencilPaletteEX('transfer', mxResources.get('gobjElectricModel'), dir + '/power.xml',';whiteSpace=wrap;html=1;fillColor=#ff0000;strokeColor=#ff0000;strokeWidth=2');
    // this.addElectricPalette(localStorage.getItem('gobjElectricModel'));
    //设备图元库
    // this.addDevicePalette(localStorage.getItem('gobjDeviceModel'));
    this.getModelPaletteXML('DynamicPalette', function (sidebar, metaId, metaContent, metaName) {
        sidebar.addDynamicPalette(metaId, metaContent, metaName);
    });
    this.getModelPaletteXML('ElectricPalette', function (sidebar, metaId, metaContent, metaName) {
        sidebar.addElectricPalette(metaId, metaContent, metaName);
    });
    this.getModelPaletteXML('DevicePalette', function (sidebar, metaId, metaContent, metaName) {
        sidebar.addDevicePalette(metaId, metaContent, metaName);
    });

};
Sidebar.prototype.getModelPaletteXML=function (metaLabel, call) {
    var _this=this;
    $.ajax({
        type : 'POST',
        url : "getMetasByLabel",
        //contentType: 'application/json',
        data : {'metaLabel':metaLabel},
        dataType : 'json',
        async : true,
        success : function(data, textStatus) {
            if(data && data.rows.length>0){
                call(_this, data.rows[0].metaId, data.rows[0].metaContent, data.rows[0].metaName);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("请求失败，无法获取分组数据");
        }
    });
};
Sidebar.prototype.updataModelPaletteByMetaId=function (metaId, metaContent, call) {
    var _this=this;
    $.ajax({
        type : 'POST',
        url : "updateMetaContent",
        data : {'metaId':metaId, 'metaContent':metaContent},
        dataType : 'json',
        async : true,
        success : function(data, textStatus) {
            if(typeof call === "function"){
                call(_this);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("请求失败，无法获取分组数据");
        }
    });
};
/**
 * 自定义图元面板
 */
Sidebar.prototype.addCustomPalette = function (xml) {
    var graph = this.editorUi.editor.graph;
    var cellList = this.editorUi.stringToCells(xml);
    var contentDiv = this.addPalettePrestrain('customGraph', mxResources.get('customGraph'), false, mxUtils.bind(this, function (content) {
        this.initCustomData(content, cellList);
    }));
    // 获取面板台头
    var title = contentDiv.parentNode.previousSibling;
    var buttons = document.createElement('div');
    buttons.style.position = 'absolute';
    buttons.style.right = '0px';
    buttons.style.top = '5px';
    title.style.position = 'relative';
    contentDiv.style.border = '3px solid transparent';
    //编辑图元面板
    var editLibrary = mxUtils.bind(this, function (evt) {
        var dlg = new LibraryDialogEX(this, null, 'customGraph', mxResources.get('customGraph'), contentDiv, cellList);
        this.editorUi.showDialog(dlg.container, 640, 480, true, false);
        mxEvent.consume(evt);
    });
    var btnWidth = 18;
    var btn = document.createElement('img');
    btn.setAttribute('align', 'top');
    btn.setAttribute('border', '0');
    btn.className = 'geButton';
    btn.style.marginRight = '1px';
    btn.style.marginTop = '-1px';
    btn.setAttribute('src', IMAGE_PATH + '/edit.gif');
    btn.setAttribute('title', mxResources.get('edit'));
    buttons.insertBefore(btn, buttons.firstChild);
    mxEvent.addListener(btn, 'click', editLibrary);
    //添加并记录图元
    var addCells = mxUtils.bind(this, function (cells, bounds, evt, title) {
        if(cellList.length==0){
            contentDiv.innerHTML='';
        }
        cells = graph.cloneCells(mxUtils.sortCells(graph.model.getTopmostCells(cells)));
        // 计算组合图形原点
        for (var i = 0; i < cells.length; i++) {
        	cells[i].parent=undefined;
            var geo = graph.getCellGeometry(cells[i]);
            if (geo != null) {
                geo.translate(-bounds.x, -bounds.y);
            }
            cellList.push(cells[i]);
        }
        contentDiv.appendChild(this.createVertexTemplateFromCells(
            cells, bounds.width, bounds.height, (cells[0].title!=null&&cells[0].title!='') ? cells[0].title : mxResources.get('untitled'), true, false, false));
        var xml = graph.compress(mxUtils.getXml(graph.encodeCells(cellList)));
        localStorage.setItem('customGraph', xml);
    });
    var addSelection = mxUtils.bind(this, function (evt) {
        if (!graph.isSelectionEmpty()) {
            if(graph.getSelectionCount()>1){
                graph.setSelectionCell(graph.groupCells(null, 0));
            }
            var cells = graph.getSelectionCells();
            if(cells[0].children && cells[0].children.length){
                cells[0].style='group';
            }
            var bounds = graph.view.getBounds(cells);
            var s = graph.view.scale;
            bounds.x /= s;
            bounds.y /= s;
            bounds.width /= s;
            bounds.height /= s;
            bounds.x -= graph.view.translate.x;
            bounds.y -= graph.view.translate.y;
            addCells(cells, bounds);
        } else {
            alert(mxResources.get('noGraphicsWereSelected'));
        }
        mxEvent.consume(evt);
    });
    var btn2 = btn.cloneNode(false);
    btn2.setAttribute('src', IMAGE_PATH + '/plus.gif');
    btn2.setAttribute('title', mxResources.get('add'));
    buttons.insertBefore(btn2, buttons.firstChild);
    mxEvent.addListener(btn2, 'click', addSelection);
    title.appendChild(buttons);
    title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
};
Sidebar.prototype.initCustomData = function(content, cellList) {
    var sidebar=this;
    content.innerHTML='';
    if (cellList.length) {
        cellList.forEach(function(cell){
            content.appendChild(sidebar.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, (cell.title!=null&&cell.title!='') ? cell.title : mxResources.get('untitled')));
        });
    }else{
        var dropTarget = document.createElement('div');
        mxUtils.setPrefixedStyle(dropTarget.style, 'borderRadius', '6px');
        dropTarget.style.border = '3px dotted lightGray';
        dropTarget.style.textAlign = 'center';
        dropTarget.style.padding = '8px';
        dropTarget.style.color = '#B3B3B3';
        mxUtils.write(dropTarget, mxResources.get('null'));
        content.appendChild(dropTarget);
    }
    //bug repair： image retention
    if (this.tooltip){
        this.tooltip.innerHTML='';
        this.graph2 = new Graph(this.tooltip, null, null, this.editorUi.editor.graph.getStylesheet());
        this.graph2.resetViewOnRootChange = false;
        this.graph2.foldingEnabled = false;
        this.graph2.gridEnabled = false;
        this.graph2.autoScroll = false;
        this.graph2.setTooltips(false);
        this.graph2.setConnectable(false);
        this.graph2.setEnabled(false);
    }
};
/**
 * 测试
 */
Sidebar.prototype.addMiscTestPalette = function (expand) {
	var xml='<mxGraphModel dx="876" dy="512" grid="0" gridSize="10" guides="0" tooltips="1" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#000000" appId="1" appName="接线图" appType="grid" appIndex="1" typeFloor="elefloor"><root><mxCell id="0"/><mxCell id="1" parent="0"/><GObject gobjType="GImage" url="./static/images/sys1.svg" name="image1" id="2"><mxCell parent="1" style="image1" vertex="1"><mxGeometry x="10" y="80" width="800" height="560" as="geometry"/></mxCell></GObject><GObject gobjType="GButton" label="跳转" type="click" id="3"><Object url="./" as="options"/><mxCell parent="1" style="fontColor=#FFFFFF;strokeColor=#FFFFFF;" vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell></GObject><GObject gobjType="GDataTag" phyType="电压" dispUnit="v" bShowPhy="1" bShowUnit="1" label="电压：123 v" id="4"><mxCell parent="1" style="shape=label;fillColor=none;strokeColor=none;fontColor=#FFFFFF;" vertex="1"><mxGeometry x="270" y="20" width="80" height="30" as="geometry"/></mxCell></GObject></root></mxGraphModel>';
    var cells = this.editorUi.stringToCells(xml);
    var _this=this;
    var list=[];
    cells.forEach(function(cell){
    	list.push(         
    			_this.addEntry('', mxUtils.bind(_this, function () {
    	            cell.vertex = true;
    	            return _this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height,'title');
    	        }))
            );
    });
    this.addPaletteFunctions('misc', mxResources.get('misc'), (expand != null) ? expand : true, list);
};
/**
 * 基本图元，使用自带图元
 */
Sidebar.prototype.addGeneralPaletteEX = function (expand) {
    var lineTags = 'line lines connector connectors connection connections arrow arrows ';
    var fns = [
        //Text
	    this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
	    		   40, 20, 'Text', mxResources.get('gobjText'), null, null, 'text textbox textarea label'),
        //this.createEdgeTemplateEntry('endArrow=none;dashed=1;html=1;', 50, 50, '', '点线', null, lineTags + 'dashed undirected no'),
        this.createEdgeTemplateEntry('endArrow=none;html=1;', 50, 50, '', mxResources.get('gobjLine'), null, lineTags + 'simple undirected plain blank no'),
        this.addEntry('curve', mxUtils.bind(this, function () {
            var cell = new mxCell('', new mxGeometry(0, 0, 50, 50), 'curved=1;endArrow=classic;html=1;');
            cell.geometry.setTerminalPoint(new mxPoint(0, 50), true);
            cell.geometry.setTerminalPoint(new mxPoint(50, 0), false);
            cell.geometry.points = [new mxPoint(50, 50), new mxPoint(0, 0)];
            cell.geometry.relative = true;
            cell.edge = true;

            return this.createEdgeTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, mxResources.get('gobjCurve'));
        })),
        this.createVertexTemplateEntry('triangle;whiteSpace=wrap;html=1;', 60, 80, '', mxResources.get('gobjTriangle'), null, null, 'triangle logic inverter buffer'),
        this.createVertexTemplateEntry('rounded=0;whiteSpace=wrap;html=1;', 120, 60, '', mxResources.get('gobjRectangle'), null, null, 'rect rectangle box'),
        this.createVertexTemplateEntry('shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;', 120, 60, '', mxResources.get('gobjParallelogram')),
        this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;', 120, 80, '', mxResources.get('gobjEllipse'), null, null, 'oval ellipse state'),
        //添加扇形，弧形
		this.createVertexTemplateEntry(mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;strokeWidth=2;shape='+ 'pie;startAngle=0.2;endAngle=0.9;', 100, 100, '', mxResources.get('gobjSector'), null, null),
		this.createVertexTemplateEntry(mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;strokeWidth=2;shape='+ 'arc;startAngle=0.3;endAngle=0.1;', 100, 100, '', mxResources.get('gobjArc'), null, null),
        this.createVertexTemplateEntry('shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;', 120, 80, '', mxResources.get('gobjCube')),
        this.createVertexTemplateEntry('shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;', 60, 80, '', mxResources.get('gobjCylinder'), null, null, 'cylinder data database'),
        //添加甜甜圈
		this.createVertexTemplateEntry(mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;strokeWidth=2;shape='+'donut;dx=25;', 100, 100, '', mxResources.get('gobjDoughnut'), null, null)
        /*this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;rounded=0;', 190, 120,
            '<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
            '多行文字', null, null, 'text textbox textarea')*/
    ];

    this.addPaletteFunctions('general', mxResources.get('gobjBasicModel'), (expand != null) ? expand : true, fns);
};
/**
 * 动态图元，暂时使用自定义GModel组库图片模型
 */
Sidebar.prototype.addDynamicPalette = function (metaId, metaContent, metaName) {
    var cells = this.editorUi.stringToCells(metaContent);
    var _this=this;
    var list=[];
    var title=['gobjDataTag','gobjImage','gobjButton','gobjChartTrend','gobjChartBar','gobjChartPie','gobjChartDisperse','gobjChartGauge','gobjDataTable'];
    var index=0;
    cells.forEach(function(cell){
    	list.push(         
    			_this.addEntry('', mxUtils.bind(_this, function () {
    	            cell.vertex = true;
    	            return _this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height,mxResources.get(title[index++]));
    	        }))
            );
    });
    this.addPaletteFunctions(metaId, metaName, false, list);
};
/**
 * 电气图元
 */
Sidebar.prototype.addStencilPaletteEX = function (id, title, stencilFile, style, ignore, onInit, scale, tags, customFns) {
	scale = (scale != null) ? scale : 1;
    if (this.addStencilsToIndex) {
        // LATER: Handle asynchronous loading dependency
        var fns = [];
        if (customFns != null) {
            for (var i = 0; i < customFns.length; i++) {
                fns.push(customFns[i]);
            }
        }
        mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function (packageName, stencilName, displayName, w, h) {
            if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0) {
                var tmp = this.getTagsForStencil(packageName, stencilName);
                var tmpTags = (tags != null) ? tags[stencilName] : null;

                if (tmpTags != null) {
                    tmp.push(tmpTags);
                }
                var style2 = 'shape=' + packageName + stencilName.toLowerCase() + style;
                var cell = new mxCell('', new mxGeometry(0, 0, Math.round(w * scale), Math.round(h * scale)), style2);
                var GElectric = new GModel.GElectric();
                var gObj=GElectric.getNewGObjectByEname(cell,stencilName);
                if(gObj){
                	cell.value=gObj;
                }
                fns.push(this.addEntry('', mxUtils.bind(this, function () {
    	            cell.vertex = true;
    	            return this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height,stencilName);
    	        })));
            }
        }), true, true);
        // this.addPaletteFunctions(id, title, false, fns);
        this.addPaletteFunctions(id, title, false, fns);
    } else {
        this.addPalette(id, title, false, mxUtils.bind(this, function (content) {
            if (style == null) {
                style = '';
            }
            if (onInit != null) {
                onInit.call(this, content);
            }
            if (customFns != null) {
                for (var i = 0; i < customFns.length; i++) {
                    customFns[i](content);
                }
            }
            mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function (packageName, stencilName, displayName, w, h) {
                if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0) {
                    content.appendChild(this.createVertexTemplate('shape=' + packageName + stencilName.toLowerCase() + style,
                        Math.round(w * scale), Math.round(h * scale), '', stencilName.replace(/_/g, ' '), true));
                }
            }), true);
        }));
    }
};
Sidebar.prototype.addElectricPalette = function (metaId, metaContent, metaName) {
    // var xml='';
    // $.ajax({
    //     type: "get",
    //     url: STENCIL_PATH+"/xxxx.xml",
    //     dataType: "text",
    //     async: false
    // }).done(function (data) {
    //     xml=data;
    // });
    var graph = this.editorUi.editor.graph;
    var cellList = this.editorUi.stringToCells(metaContent);
    var contentDiv = this.addPalettePrestrain(metaId, metaName, false, mxUtils.bind(this, function (content) {
        this.initCustomData(content, cellList);
    }));
    // 获取面板台头
    var title = contentDiv.parentNode.previousSibling;
    var buttons = document.createElement('div');
    buttons.style.position = 'absolute';
    buttons.style.right = '0px';
    buttons.style.top = '5px';
    title.style.position = 'relative';
    contentDiv.style.border = '3px solid transparent';
    //编辑图元面板
    var editLibrary = mxUtils.bind(this, function (evt) {
        var dlg = new LibraryDialogEX(this, metaId, null, metaName, contentDiv, cellList);
        this.editorUi.showDialog(dlg.container, 640, 480, true, false);
        mxEvent.consume(evt);
    });
    var btnWidth = 18;
    var btn = document.createElement('img');
    btn.setAttribute('align', 'top');
    btn.setAttribute('border', '0');
    btn.className = 'geButton';
    btn.style.marginRight = '1px';
    btn.style.marginTop = '-1px';
    btn.setAttribute('src', IMAGE_PATH + '/edit.gif');
    btn.setAttribute('title', mxResources.get('edit'));
    buttons.insertBefore(btn, buttons.firstChild);
    mxEvent.addListener(btn, 'click', editLibrary);
    //添加并记录图元
    var addSelection = mxUtils.bind(this, function (evt) {
        this.editorUi.actions.get('creatElectricModel').funct(this, metaId, contentDiv);
        mxEvent.consume(evt);
    });
    var btn2 = btn.cloneNode(false);
    btn2.setAttribute('src', IMAGE_PATH + '/plus.gif');
    btn2.setAttribute('title', mxResources.get('add'));
    buttons.insertBefore(btn2, buttons.firstChild);
    mxEvent.addListener(btn2, 'click', addSelection);
    title.appendChild(buttons);
    title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
};
/**
 * 设备图元，暂时使用自定义GModel组库图片模型
 */
Sidebar.prototype.addDevicePalette__ = function (expand) {
	var xml='<mxGraphModel dx="501" dy="293" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" background="#ffffff" appId="7" appName="HelloWorld" appType="grid" appIndex="1" typeFloor="elefloor"><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/switchboard.png" name="switchboard" id="2"><mxCell parent="1" vertex="1" title="交换机"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/gateway.png" name="img_gateway" id="3"><mxCell parent="1" vertex="1" title="通讯网关"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/server.png" name="img_server" id="4"><mxCell parent="1" vertex="1" title="服务器"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/workstation.png" name="img_workstation" id="5"><mxCell parent="1" vertex="1" title="工作站"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/pump.png" name="img_pump" id="6"><mxCell parent="1" vertex="1" title="泵"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/draught.png" name="img_draught" id="7"><mxCell parent="1" vertex="1" title="风机"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/ammeter.png" name="img_ammeter" id="8"><mxCell parent="1" vertex="1" title="智能表"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/alternator.png" name="img_alternator" id="9"><mxCell parent="1" vertex="1" title="风力发电机"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/solarpanels.png" name="img_solarpanels" id="10"><mxCell parent="1" vertex="1" title="太阳能板"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/battery.png" name="img_battery" id="11"><mxCell parent="1" vertex="1" title="储电"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/heataccumulation.png" name="img_heataccumulation" id="12"><mxCell parent="1" vertex="1" title="储热"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'<GObject gobjType="GImage" url="./static/images/assembly/combustionmotor.png" name="img_combustionmotor" id="13"><mxCell parent="1" vertex="1" title="燃气内燃机"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
		+'</root></mxGraphModel>';
    var cells = this.editorUi.stringToCells(xml);
    var _this=this;
    var list=[];
    var title=['gobgSwitchboard','gobjGateway','gobjServer','gobjWorkstation','gobjPump','gobjDraught','gobjAmmeter','gobjAlternator','gobgSolarpanels','gobjBattery','gobjHeataccumulation','gobjCombustionmotor'];
    var index=0;
    cells.forEach(function(cell){
    	list.push(         
    			_this.addEntry('', mxUtils.bind(_this, function () {
    	            cell.vertex = true;
    	            return _this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, mxResources.get(title[index++]));
    	        }))
            );
    });
    this.addPaletteFunctions('device', mxResources.get('gobjDeviceModel'), (expand != null) ? expand : true, list);
};
Sidebar.prototype.addDevicePalette = function (metaId, metaContent, metaName) {
    if(!metaContent){
        metaContent='<mxGraphModel dx="501" dy="293" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" background="#ffffff" appId="7" appName="HelloWorld" appType="grid" appIndex="1" typeFloor="elefloor"><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/switchboard.png" name="switchboard" id="2"><mxCell parent="1" vertex="1" title="交换机"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/gateway.png" name="img_gateway" id="3"><mxCell parent="1" vertex="1" title="通讯网关"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/server.png" name="img_server" id="4"><mxCell parent="1" vertex="1" title="服务器"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/workstation.png" name="img_workstation" id="5"><mxCell parent="1" vertex="1" title="工作站"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/pump.png" name="img_pump" id="6"><mxCell parent="1" vertex="1" title="泵"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/draught.png" name="img_draught" id="7"><mxCell parent="1" vertex="1" title="风机"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/ammeter.png" name="img_ammeter" id="8"><mxCell parent="1" vertex="1" title="智能表"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/alternator.png" name="img_alternator" id="9"><mxCell parent="1" vertex="1" title="风力发电机"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/solarpanels.png" name="img_solarpanels" id="10"><mxCell parent="1" vertex="1" title="太阳能板"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/battery.png" name="img_battery" id="11"><mxCell parent="1" vertex="1" title="储电"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/heataccumulation.png" name="img_heataccumulation" id="12"><mxCell parent="1" vertex="1" title="储热"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'<GObject gobjType="GImage" url="./static/images/assembly/combustionmotor.png" name="img_combustionmotor" id="13"><mxCell parent="1" vertex="1" title="燃气内燃机"><mxGeometry x="20" y="20" width="50" height="50" as="geometry"/></mxCell></GObject>'
            +'</root></mxGraphModel>';
    }
    var graph = this.editorUi.editor.graph;
    var cellList = this.editorUi.stringToCells(metaContent);
    var contentDiv = this.addPalettePrestrain(metaId, metaName, false, mxUtils.bind(this, function (content) {
        this.initCustomData(content, cellList);
    }));
    // 获取面板台头
    var title = contentDiv.parentNode.previousSibling;
    var buttons = document.createElement('div');
    buttons.style.position = 'absolute';
    buttons.style.right = '0px';
    buttons.style.top = '5px';
    title.style.position = 'relative';
    contentDiv.style.border = '3px solid transparent';
    //编辑图元面板
    var editLibrary = mxUtils.bind(this, function (evt) {
        var dlg = new LibraryDialogEX(this, metaId, null, metaName, contentDiv, cellList);
        this.editorUi.showDialog(dlg.container, 640, 480, true, false);
        mxEvent.consume(evt);
    });
    var btnWidth = 18;
    var btn = document.createElement('img');
    btn.setAttribute('align', 'top');
    btn.setAttribute('border', '0');
    btn.className = 'geButton';
    btn.style.marginRight = '1px';
    btn.style.marginTop = '-1px';
    btn.setAttribute('src', IMAGE_PATH + '/edit.gif');
    btn.setAttribute('title', mxResources.get('edit'));
    buttons.insertBefore(btn, buttons.firstChild);
    mxEvent.addListener(btn, 'click', editLibrary);
    //添加并记录图元
    var addCells = mxUtils.bind(this, function (cells, bounds, evt, title) {
        if(cellList.length==0){
            contentDiv.innerHTML='';
        }
        cells = graph.cloneCells(mxUtils.sortCells(graph.model.getTopmostCells(cells)));
        // 计算组合图形原点
        for (var i = 0; i < cells.length; i++) {
            cells[i].parent=undefined;
            var geo = graph.getCellGeometry(cells[i]);
            if (geo != null) {
                geo.translate(-bounds.x, -bounds.y);
            }
            cellList.push(cells[i]);
        }
        contentDiv.appendChild(this.createVertexTemplateFromCells(
            cells, bounds.width, bounds.height, (cells[0].title!=null&&cells[0].title!='') ? cells[0].title : mxResources.get('untitled'), true, false, false));
        var xml = graph.compress(mxUtils.getXml(graph.encodeCells(cellList)));
        // localStorage.setItem('gobjDeviceModel', xml);
        this.updataModelPaletteByMetaId(metaId, xml);
    });
    var addSelection = mxUtils.bind(this, function (evt) {
        if (!graph.isSelectionEmpty()) {
            if(graph.getSelectionCount()>1){
                graph.setSelectionCell(graph.groupCells(null, 0));
            }
            var cells = graph.getSelectionCells();
            if(cells[0].children && cells[0].children.length){
                cells[0].style='group';
            }
            var bounds = graph.view.getBounds(cells);
            var s = graph.view.scale;
            bounds.x /= s;
            bounds.y /= s;
            bounds.width /= s;
            bounds.height /= s;
            bounds.x -= graph.view.translate.x;
            bounds.y -= graph.view.translate.y;
            addCells(cells, bounds);
        } else {
            alert(mxResources.get('noGraphicsWereSelected'));
        }
        mxEvent.consume(evt);
    });
    var btn2 = btn.cloneNode(false);
    btn2.setAttribute('src', IMAGE_PATH + '/plus.gif');
    btn2.setAttribute('title', mxResources.get('add'));
    buttons.insertBefore(btn2, buttons.firstChild);
    mxEvent.addListener(btn2, 'click', addSelection);
    title.appendChild(buttons);
    title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
};
/**
 * Sets the default font size.
 */
Sidebar.prototype.collapsedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/collapsed.gif' : 'data:image/gif;base64,R0lGODlhDQANAIABAJmZmf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNUQyRTJFNjZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNUQyRTJFNzZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFERjc3MEUxNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFERjc3MEUyNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhSMj6lrwAjcC1GyahV+dcZJgeIIFgA7';

/**
 * Sets the default font size.
 */
Sidebar.prototype.expandedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/expanded.gif' : 'data:image/gif;base64,R0lGODlhDQANAIABAJmZmf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxREY3NzBERjZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxREY3NzBFMDZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFERjc3MERENkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFERjc3MERFNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7';

/**
 * Sets the default font size.
 */
Sidebar.prototype.tooltipImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/tooltip.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAbCAMAAAB7jU7LAAAACVBMVEX///+ZmZn///9Y2COLAAAAA3RSTlP//wDXyg1BAAAAOElEQVR42mXQMQ4AMAgDsWv//+iutcJmIQSk+9dJpVKpVCqVSqVSqZTdncWzF8/NeP7FkxWenPEDOnUBiL3jWx0AAAAASUVORK5CYII=';

/**
 * 
 */
Sidebar.prototype.searchImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/search.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEaSURBVHjabNGxS5VxFIfxz71XaWuQUJCG/gCHhgTD9VpEETg4aMOlQRp0EoezObgcd220KQiXmpretTAHQRBdojlQEJyukPdt+b1ywfvAGc7wnHP4nlZd1yKijQW8xzNc4Su+ZOYfQ3T6/f4YNvEJYzjELXp4VVXVz263+7cR2niBxAFeZ2YPi3iHR/gYERPDwhpOsd6sz8x/mfkNG3iOlWFhFj8y89J9KvzGXER0GuEaD42mgwHqUtoljbcRsTBCeINpfM/MgZLKPpaxFxGbOCqDXmILN7hoJrTKH+axhxmcYRxP0MIDnOBDZv5q1XUNIuJxifJp+UNV7t7BFM6xeic0RMQ4Bpl5W/ol7GISx/eEUUTECrbx+f8A8xhiZht9zsgAAAAASUVORK5CYII=';

/**
 * Specifies if tooltips should be visible. Default is true.
 */
Sidebar.prototype.enableTooltips = true;

/**
 * Specifies the delay for the tooltip. Default is 16 px.
 */
Sidebar.prototype.tooltipBorder = 16;

/**
 * Specifies the delay for the tooltip. Default is 300 ms.
 */
Sidebar.prototype.tooltipDelay = 300;

/**
 * Specifies the delay for the drop target icons. Default is 200 ms.
 */
Sidebar.prototype.dropTargetDelay = 200;

/**
 * Specifies the URL of the gear image.
 */
Sidebar.prototype.gearImage = STENCIL_PATH + '/clipart/Gear_128x128.png';

/**
 * Specifies the width of the thumbnails.
 */
Sidebar.prototype.thumbWidth = 36;

/**
 * Specifies the height of the thumbnails.
 */
Sidebar.prototype.thumbHeight = 36;

/**
 * Specifies the padding for the thumbnails. Default is 3.
 */
Sidebar.prototype.thumbPadding = (document.documentMode >= 5) ? 0 : 1;

/**
 * Specifies the delay for the tooltip. Default is 2 px.
 */
Sidebar.prototype.thumbBorder = 2;

/**
 * Specifies the size of the sidebar titles.
 */
Sidebar.prototype.sidebarTitleSize = 9;

/**
 * Specifies if titles in the sidebar should be enabled.
 */
Sidebar.prototype.sidebarTitles = false;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.tooltipTitles = true;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipWidth = 400;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipHeight = 400;

/**
 * Specifies if stencil files should be loaded and added to the search index
 * when stencil palettes are added. If this is false then the stencil files are
 * lazy-loaded when the palette is shown.
 */
Sidebar.prototype.addStencilsToIndex = true;

/**
 * Specifies the width for clipart images. Default is 80.
 */
Sidebar.prototype.defaultImageWidth = 80;

/**
 * Specifies the height for clipart images. Default is 80.
 */
Sidebar.prototype.defaultImageHeight = 80;

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.showTooltip = function(elt, cells, w, h, title, showLabel)
{
	Editor.prototype.originalNoForeignObject =false;
	mxClient.NO_FO=true;
	if (this.enableTooltips && this.showTooltips)
	{
		if (this.currentElt != elt)
		{
			if (this.thread != null)
			{
				window.clearTimeout(this.thread);
				this.thread = null;
			}
			
			var show = mxUtils.bind(this, function()
			{
				// Lazy creation of the DOM nodes and graph instance
				if (this.tooltip == null)
				{
					this.tooltip = document.createElement('div');
					this.tooltip.className = 'geSidebarTooltip';
					this.tooltip.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
					document.body.appendChild(this.tooltip);
					
					this.graph2 = new Graph(this.tooltip, null, null, this.editorUi.editor.graph.getStylesheet());
					this.graph2.resetViewOnRootChange = false;
					this.graph2.foldingEnabled = false;
					this.graph2.gridEnabled = false;
					this.graph2.autoScroll = false;
					this.graph2.setTooltips(false);
					this.graph2.setConnectable(false);
					this.graph2.setEnabled(false);
					
					if (!mxClient.IS_SVG)
					{
						this.graph2.view.canvas.style.position = 'relative';
					}
					
					this.tooltipImage = mxUtils.createImage(this.tooltipImage);
					this.tooltipImage.className = 'geSidebarTooltipImage';
					this.tooltipImage.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
					this.tooltipImage.style.position = 'absolute';
					this.tooltipImage.style.width = '14px';
					this.tooltipImage.style.height = '27px';
					
					document.body.appendChild(this.tooltipImage);
				}

				this.graph2.model.clear();
				this.graph2.view.setTranslate(this.tooltipBorder, this.tooltipBorder);

				if (w > this.maxTooltipWidth || h > this.maxTooltipHeight)
				{
					this.graph2.view.scale = Math.round(Math.min(this.maxTooltipWidth / w, this.maxTooltipHeight / h) * 100) / 100;
				}
				else
				{
					this.graph2.view.scale = 1;
				}
				
				this.tooltip.style.display = 'block';
				this.graph2.labelsVisible = (showLabel == null || showLabel);
				
				var fo = mxClient.NO_FO;
				mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
				this.graph2.addCells(cells);
				mxClient.NO_FO = fo;
				var bounds = this.graph2.getGraphBounds();
				var width = bounds.width + 2 * this.tooltipBorder + 4;
				var height = bounds.height + 2 * this.tooltipBorder;
				
				if (mxClient.IS_QUIRKS)
				{
					height += 4;
					this.tooltip.style.overflow = 'hidden';
				}
				else
				{
					this.tooltip.style.overflow = 'visible';
				}

				this.tooltipImage.style.visibility = 'visible';
				this.tooltip.style.width = width + 'px';
				
				// Adds title for entry
				if (this.tooltipTitles && title != null && title.length > 0)
				{
					if (this.tooltipTitle == null)
					{
						this.tooltipTitle = document.createElement('div');
						this.tooltipTitle.style.borderTop = '1px solid gray';
						this.tooltipTitle.style.textAlign = 'center';
						this.tooltipTitle.style.width = '100%';
						
						// Oversize titles are cut-off currently. Should make
						// tooltip wider later.
						this.tooltipTitle.style.overflow = 'hidden';
						
						if (mxClient.IS_SVG)
						{
							this.tooltipTitle.style.paddingTop = '6px';
						}
						else
						{
							this.tooltipTitle.style.position = 'absolute';
							this.tooltipTitle.style.paddingTop = '6px';							
						}

						this.tooltip.appendChild(this.tooltipTitle);
					}
					else
					{
						this.tooltipTitle.innerHTML = '';
					}
					
					this.tooltipTitle.style.display = '';
					mxUtils.write(this.tooltipTitle, title);
					
					var ddy = this.tooltipTitle.offsetHeight + 10;
					height += ddy;
					
					if (mxClient.IS_SVG)
					{
						this.tooltipTitle.style.marginTop = (2 - ddy) + 'px';
					}
					else
					{
						height -= 6;
						this.tooltipTitle.style.top = (height - ddy) + 'px';	
					}
				}
				else if (this.tooltipTitle != null && this.tooltipTitle.parentNode != null)
				{
					this.tooltipTitle.style.display = 'none';
				}
				
				this.tooltip.style.height = height + 'px';
				var x0 = -Math.round(bounds.x - this.tooltipBorder);
				var y0 = -Math.round(bounds.y - this.tooltipBorder);
				
				var b = document.body;
				var d = document.documentElement;
				var bottom = Math.max(b.clientHeight || 0, d.clientHeight);

				var left = this.container.clientWidth + this.editorUi.splitSize + 3 + this.editorUi.container.offsetLeft;
				var top = Math.min(bottom - height - 20 /* status bar */, Math.max(0, (this.editorUi.container.offsetTop +
					this.container.offsetTop + elt.offsetTop + 40 - this.container.scrollTop - height / 2 + 16)));

				if (mxClient.IS_SVG)
				{
					if (x0 != 0 || y0 != 0)
					{
						this.graph2.view.canvas.setAttribute('transform', 'translate(' + x0 + ',' + y0 + ')');
					}
					else
					{
						this.graph2.view.canvas.removeAttribute('transform');
					}
				}
				else
				{
					this.graph2.view.drawPane.style.left = x0 + 'px';
					this.graph2.view.drawPane.style.top = y0 + 'px';
				}
				
				// Workaround for ignored position CSS style in IE9
				// (changes to relative without the following line)
				this.tooltip.style.position = 'absolute';
				this.tooltip.style.left = left + 'px';
				this.tooltip.style.top = top + 'px';
				this.tooltipImage.style.left = (left - 13) + 'px';
				this.tooltipImage.style.top = (top + height / 2 - 13) + 'px';
			});

			if (this.tooltip != null && this.tooltip.style.display != 'none')
			{
				show();
			}
			else
			{
				this.thread = window.setTimeout(show, this.tooltipDelay);
			}

			this.currentElt = elt;
		}
	}
};

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.hideTooltip = function()
{
	if (this.thread != null)
	{
		window.clearTimeout(this.thread);
		this.thread = null;
	}
	
	if (this.tooltip != null)
	{
		this.tooltip.style.display = 'none';
		this.tooltipImage.style.visibility = 'hidden';
		this.currentElt = null;
	}
};

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.addDataEntry = function(tags, width, height, title, data)
{
	return this.addEntry(tags, mxUtils.bind(this, function()
	{
	   	return this.createVertexTemplateFromData(data, width, height, title);
	}));
};

/**
 * Hides the current tooltip.将fn添加至taglist中
 */
Sidebar.prototype.addEntry = function(tags, fn)
{
	if (this.taglist != null && tags != null && tags.length > 0)
	{
		// Replaces special characters
		var tmp = tags.toLowerCase().replace(/[\/\,\(\)]/g, ' ').split(' ');

		var doAddEntry = mxUtils.bind(this, function(tag)
		{
			if (tag.length > 1)
			{
				var entry = this.taglist[tag];
				
				if (typeof entry !== 'object')
				{
					entry = {entries: [], dict: new mxDictionary()};
					this.taglist[tag] = entry;
				}

				// Ignores duplicates
				if (entry.dict.get(fn) == null)
				{
					entry.dict.put(fn, fn);
					entry.entries.push(fn);
				}
			}
		});
		
		for (var i = 0; i < tmp.length; i++)
		{
			doAddEntry(tmp[i]);
			
			// Adds additional entry with removed trailing numbers
			var normalized = tmp[i].replace(/\.*\d*$/, '');
			
			if (normalized != tmp[i])
			{
				doAddEntry(normalized);
			}
		}
	}
	
	return fn;
};

/**
 * Adds shape search UI.
 */
Sidebar.prototype.searchEntries = function(searchTerms, count, page, success, error)
{
	if (this.taglist != null && searchTerms != null)
	{
		var tmp = searchTerms.toLowerCase().split(' ');
		var dict = new mxDictionary();
		var max = (page + 1) * count;
		var results = [];
		var index = 0;
		
		for (var i = 0; i < tmp.length; i++)
		{
			if (tmp[i].length > 0)
			{
				var entry = this.taglist[tmp[i]];
				var tmpDict = new mxDictionary();
				
				if (entry != null)
				{
					var arr = entry.entries;
					results = [];

					for (var j = 0; j < arr.length; j++)
					{
						var entry = arr[j];
	
						// NOTE Array does not contain duplicates
						if ((index == 0) == (dict.get(entry) == null))
						{
							tmpDict.put(entry, entry);
							results.push(entry);
							
							if (i == tmp.length - 1 && results.length == max)
							{
								success(results.slice(page * count, max), max, true, tmp);
								
								return;
							}
						}
					}
				}
				else
				{
					results = [];
				}
				
				dict = tmpDict;
				index++;
			}
		}
		
		var len = results.length;
		success(results.slice(page * count, (page + 1) * count), len, false, tmp);
	}
	else
	{
		success([], null, null, tmp);
	}
};

/**
 * Adds shape search UI.
 */
Sidebar.prototype.filterTags = function(tags)
{
	if (tags != null)
	{
		var arr = tags.split(' ');
		var result = [];
		var hash = {};
		
		// Ignores tags with leading numbers, strips trailing numbers
		for (var i = 0; i < arr.length; i++)
		{
			// Removes duplicates
			if (hash[arr[i]] == null)
			{
				hash[arr[i]] = '1';
				result.push(arr[i]);
			}
		}
		
		return result.join(' ');
	}
	
	return null;
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.cloneCell = function(cell, value)
{
	var clone = cell.clone();
	
	if (value != null)
	{
		clone.value = value;
	}
	
	return clone;
};

/**
 * Adds shape search UI.
 */
Sidebar.prototype.addSearchPalette = function(expand)
{
	var elt = document.createElement('div');
	elt.style.visibility = 'hidden';
	this.container.appendChild(elt);
		
	var div = document.createElement('div');
	div.className = 'geSidebar';
	div.style.boxSizing = 'border-box';
	div.style.overflow = 'hidden';
	div.style.width = '100%';
	div.style.padding = '8px';
	div.style.paddingTop = '14px';
	div.style.paddingBottom = '0px';

	if (!expand)
	{
		div.style.display = 'none';
	}
	
	var inner = document.createElement('div');
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.paddingBottom = '8px';
	inner.style.cursor = 'default';

	var input = document.createElement('input');
	input.setAttribute('placeholder', mxResources.get('searchShapes'));
	input.setAttribute('type', 'text');
	input.style.fontSize = '12px';
	input.style.overflow = 'hidden';
	input.style.boxSizing = 'border-box';
	input.style.border = 'solid 1px #d5d5d5';
	input.style.borderRadius = '4px';
	input.style.width = '100%';
	input.style.outline = 'none';
	input.style.padding = '6px';
	inner.appendChild(input);

	var cross = document.createElement('img');
	cross.setAttribute('src', Sidebar.prototype.searchImage);
	cross.setAttribute('title', mxResources.get('search'));
	cross.style.position = 'relative';
	cross.style.left = '-18px';
	
	if (mxClient.IS_QUIRKS)
	{
		input.style.height = '28px';
		cross.style.top = '-4px';
	}
	else
	{
		cross.style.top = '1px';
	}

	// Needed to block event transparency in IE
	cross.style.background = 'url(\'' + this.editorUi.editor.transparentImage + '\')';
	
	var find;

	inner.appendChild(cross);
	div.appendChild(inner);

	var center = document.createElement('center');
	var button = mxUtils.button(mxResources.get('moreResults'), function()
	{
		find();
	});
	button.style.display = 'none';
	
	// Workaround for inherited line-height in quirks mode
	button.style.lineHeight = 'normal';
	button.style.marginTop = '4px';
	button.style.marginBottom = '8px';
	center.style.paddingTop = '4px';
	center.style.paddingBottom = '8px';
	
	center.appendChild(button);
	div.appendChild(center);
	
	var searchTerm = '';
	var active = false;
	var complete = false;
	var page = 0;
	var hash = new Object();

	// Count is dynamically updated below
	var count = 12;
	
	var clearDiv = mxUtils.bind(this, function()
	{
		active = false;
		this.currentSearch = null;
		var child = div.firstChild;
		
		while (child != null)
		{
			var next = child.nextSibling;
			
			if (child != inner && child != center)
			{
				child.parentNode.removeChild(child);
			}
			
			child = next;
		}
	});
		
	mxEvent.addListener(cross, 'click', function()
	{
		if (cross.getAttribute('src') == Dialog.prototype.closeImage)
		{
			cross.setAttribute('src', Sidebar.prototype.searchImage);
			cross.setAttribute('title', mxResources.get('search'));
			button.style.display = 'none';
			input.value = '';
			searchTerm = '';
			clearDiv();
		}

		input.focus();
	});

	find = mxUtils.bind(this, function()
	{
		// Shows 4 rows (minimum 4 results)
		count = 4 * Math.max(1, Math.floor(this.container.clientWidth / (this.thumbWidth + 10)));
		this.hideTooltip();
		
		if (input.value != '')
		{
			if (center.parentNode != null)
			{
				if (searchTerm != input.value)
				{
					clearDiv();
					searchTerm = input.value;
					hash = new Object();
					complete = false;
					page = 0;
				}
				
				if (!active && !complete)
				{
					button.setAttribute('disabled', 'true');
					button.style.display = '';
					button.style.cursor = 'wait';
					button.innerHTML = mxResources.get('loading') + '...';
					active = true;
					
					// Ignores old results
					var current = new Object();
					this.currentSearch = current;
					
					this.searchEntries(searchTerm, count, page, mxUtils.bind(this, function(results, len, more, terms)
					{
						if (this.currentSearch == current)
						{
							results = (results != null) ? results : [];
							active = false;
							page++;
							center.parentNode.removeChild(center);
							this.insertSearchHint(div, searchTerm, count, page, results, len, more, terms);

							for (var i = 0; i < results.length; i++)
							{
								var elt = results[i]();
								
								// Avoids duplicates in results
								if (hash[elt.innerHTML] == null)
								{
									hash[elt.innerHTML] = '1';
									div.appendChild(results[i]());
								}
							}
							
							if (more)
							{
								button.removeAttribute('disabled');
								button.innerHTML = mxResources.get('moreResults');
							}
							else
							{
								button.innerHTML = mxResources.get('reset');
								button.style.display = 'none';
								complete = true;
							}
							
							button.style.cursor = '';
							div.appendChild(center);
						}
					}), mxUtils.bind(this, function()
					{
						// TODO: Error handling
						button.style.cursor = '';
					}));
				}
			}
		}
		else
		{
			clearDiv();
			input.value = '';
			searchTerm = '';
			hash = new Object();
			button.style.display = 'none';
			complete = false;
			input.focus();
		}
	});
	
	mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(evt)
	{
		if (evt.keyCode == 13 /* Enter */)
		{
			find();
		}
	}));
	
	mxEvent.addListener(input, 'focus', function()
	{
		input.style.paddingRight = '';
	});
	
	mxEvent.addListener(input, 'blur', function()
	{
		input.style.paddingRight = '20px';
	});

	input.style.paddingRight = '20px';
	
	mxEvent.addListener(input, 'keyup', mxUtils.bind(this, function(evt)
	{
		if (input.value == '')
		{
			cross.setAttribute('src', Sidebar.prototype.searchImage);
			cross.setAttribute('title', mxResources.get('search'));
		}
		else
		{
			cross.setAttribute('src', Dialog.prototype.closeImage);
			cross.setAttribute('title', mxResources.get('reset'));
		}
		
		if (input.value == '')
		{
			complete = true;
			button.style.display = 'none';
		}
		else if (input.value != searchTerm)
		{
			button.style.display = 'none';
			complete = false;
		}
		else if (!active)
		{
			if (complete)
			{
				button.style.display = 'none';
			}
			else
			{
				button.style.display = '';
			}
		}
	}));

    // Workaround for blocked text selection in Editor
    mxEvent.addListener(input, 'mousedown', function(evt)
    {
    	if (evt.stopPropagation)
    	{
    		evt.stopPropagation();
    	}
    	
    	evt.cancelBubble = true;
    });
    
    // Workaround for blocked text selection in Editor
    mxEvent.addListener(input, 'selectstart', function(evt)
    {
    	if (evt.stopPropagation)
    	{
    		evt.stopPropagation();
    	}
    	
    	evt.cancelBubble = true;
    });

	var outer = document.createElement('div');
    outer.appendChild(div);
    this.container.appendChild(outer);
	
    // Keeps references to the DOM nodes
	this.palettes['search'] = [elt, outer];
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.insertSearchHint = function(div, searchTerm, count, page, results, len, more, terms)
{
	if (results.length == 0 && page == 1)
	{
		var err = document.createElement('div');
		err.className = 'geTitle';
		err.style.cssText = 'background-color:transparent;border-color:transparent;' +
			'color:gray;padding:6px 0px 0px 0px !important;margin:4px 8px 4px 8px;' +
			'text-align:center;cursor:default !important';
		
		mxUtils.write(err, mxResources.get('noResultsFor', [searchTerm]));
		div.appendChild(err);
	}
};

/**
 * Adds the general palette to the sidebar.
 */

Sidebar.prototype.addGeneralPalette = function(expand)
{
	var lineTags = 'line lines connector connectors connection connections arrow arrows ';
	
	var fns = [
	 	this.createVertexTemplateEntry('rounded=0;whiteSpace=wrap;html=1;', 120, 60, '', 'Rectangle', null, null, 'rect rectangle box'),
	 	this.createVertexTemplateEntry('rounded=1;whiteSpace=wrap;html=1;', 120, 60, '', 'Rounded Rectangle', null, null, 'rounded rect rectangle box'),
	 	// Explicit strokecolor/fillcolor=none is a workaround to maintain
		// transparent background regardless of current style
	 	this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;',
 			40, 20, 'Text', 'Text', null, null, 'text textbox textarea label'),
	 	this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;', 190, 120,
			'<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
			'Textbox', null, null, 'text textbox textarea'),
		this.createVertexTemplateEntry('shape=ext;double=1;rounded=0;whiteSpace=wrap;html=1;', 120, 60, '', 'Double Rectangle', null, null, 'rect rectangle box double'),
	 	this.createVertexTemplateEntry('shape=ext;double=1;rounded=1;whiteSpace=wrap;html=1;', 120, 60, '', 'Double Rounded Rectangle', null, null, 'rounded rect rectangle box double'),
 		this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;', 120, 80, '', 'Ellipse', null, null, 'oval ellipse state'),
	 	this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;', 120, 80, '', 'Double Ellipse', null, null, 'oval ellipse start end state double'),
		this.createVertexTemplateEntry('whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Square', null, null, 'square'),
		this.createVertexTemplateEntry('shape=ext;double=1;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Double Square', null, null, 'double square'),
		this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Circle', null, null, 'circle'),
		this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Double Circle', null, null, 'double circle'),
	 	this.createVertexTemplateEntry('shape=process;whiteSpace=wrap;html=1;', 120, 60, '', 'Process', null, null, 'process task'),
	 	this.createVertexTemplateEntry('rhombus;whiteSpace=wrap;html=1;', 80, 80, '', 'Diamond', null, null, 'diamond rhombus if condition decision conditional question test'),
	 	this.createVertexTemplateEntry('shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;', 120, 60, '', 'Parallelogram'),
	 	this.createVertexTemplateEntry('shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;', 120, 80, '', 'Hexagon', null, null, 'hexagon preparation'),
	 	this.createVertexTemplateEntry('triangle;whiteSpace=wrap;html=1;', 60, 80, '', 'Triangle', null, null, 'triangle logic inverter buffer'),
	 	this.createVertexTemplateEntry('shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;', 60, 80, '', 'Cylinder', null, null, 'cylinder data database'),
	 	this.createVertexTemplateEntry('ellipse;shape=cloud;whiteSpace=wrap;html=1;', 120, 80, '', 'Cloud', null, null, 'cloud network'),
	 	this.createVertexTemplateEntry('shape=document;whiteSpace=wrap;html=1;boundedLbl=1;', 120, 80, '', 'Document'),
	 	this.createVertexTemplateEntry('shape=internalStorage;whiteSpace=wrap;html=1;', 80, 80, '', 'Internal Storage'),
	 	this.createVertexTemplateEntry('shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;', 120, 80, '', 'Cube'),
	 	this.createVertexTemplateEntry('shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;', 120, 80, '', 'Step'),
	 	this.createVertexTemplateEntry('shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;', 120, 60, '', 'Trapezoid'),
	 	this.createVertexTemplateEntry('shape=tape;whiteSpace=wrap;html=1;', 120, 100, '', 'Tape'),
	 	this.createVertexTemplateEntry('shape=note;whiteSpace=wrap;html=1;', 80, 100, '', 'Note'),
	    this.createVertexTemplateEntry('shape=card;whiteSpace=wrap;html=1;', 80, 100, '', 'Card'),
	    this.createVertexTemplateEntry('shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;', 120, 80, '', 'Callout'),
	 	this.createEdgeTemplateEntry('endArrow=none;dashed=1;html=1;', 50, 50, '', 'Dashed Line', null, lineTags + 'dashed undirected no'),
	 	this.createEdgeTemplateEntry('endArrow=none;html=1;', 50, 50, '', 'Line', null, lineTags + 'simple undirected plain blank no'),
	 	this.createEdgeTemplateEntry('endArrow=classic;startArrow=classic;html=1;', 50, 50, '', 'Bidirectional Connector', null, lineTags + 'bidirectional'),
	 	this.createEdgeTemplateEntry('endArrow=classic;html=1;', 50, 50, '', 'Directional Connector', null, lineTags + 'directional directed')
	];
	
	this.addPaletteFunctions('general', mxResources.get('general'), (expand != null) ? expand : true, fns);
};

/*Sidebar.prototype.addPowerPalette = function(expand)
{
	var lineTags = 'line lines connector connectors connection connections arrow arrows ';
	
	var fns = [
	   this.createPVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;',
			   40, 20, '31', 'tablename', 'AText', 'PText', null, null, 'text textbox textarea label')
	];
	
	this.addPaletteFunctions('power', mxResources.get('power'), (expand != null) ? expand : true, fns);
};*/

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addBasicPalette = function(dir)
{
	this.addStencilPalette('basic', mxResources.get('basic'), dir + '/basic.xml',
		';whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2',
		null, null, null, null, [
			this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;top=0;bottom=0;fillColor=none;', 120, 60, '', 'Partial Rectangle'),
			this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;right=0;top=0;bottom=0;fillColor=none;routingCenterX=-0.5;', 120, 60, '', 'Partial Rectangle'),
			this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;bottom=0;right=0;fillColor=none;', 120, 60, '', 'Partial Rectangle'),
			this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;', 120, 60, '', 'Partial Rectangle')
	]);
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addMiscPalette = function(expand)
{
	var lineTags = 'line lines connector connectors connection connections arrow arrows '
	
	var fns = [
   	 	this.createVertexTemplateEntry('text;strokeColor=none;fillColor=none;html=1;fontSize=24;fontStyle=1;verticalAlign=middle;align=center;', 100, 40, 'Title', 'Title', null, null, 'text heading title'),
	 	this.createVertexTemplateEntry('text;strokeColor=none;fillColor=none;html=1;whiteSpace=wrap;verticalAlign=middle;overflow=hidden;', 100, 80,
 			'<ul><li>Value 1</li><li>Value 2</li><li>Value 3</li></ul>', 'Unordered List'),
	 	this.createVertexTemplateEntry('text;strokeColor=none;fillColor=none;html=1;whiteSpace=wrap;verticalAlign=middle;overflow=hidden;', 100, 80,
 			'<ol><li>Value 1</li><li>Value 2</li><li>Value 3</li></ol>', 'Ordered List'),
	 	this.createVertexTemplateEntry('text;html=1;strokeColor=#c0c0c0;fillColor=#ffffff;overflow=fill;rounded=0;', 280, 160,
 			'<table border="1" width="100%" height="100%" cellpadding="4" style="width:100%;height:100%;border-collapse:collapse;">' +
 			'<tr style="background-color:#A7C942;color:#ffffff;border:1px solid #98bf21;"><th align="left">Title 1</th><th align="left">Title 2</th><th align="left">Title 3</th></tr>' +
 			'<tr style="border:1px solid #98bf21;"><td>Value 1</td><td>Value 2</td><td>Value 3</td></tr>' +
 			'<tr style="background-color:#EAF2D3;border:1px solid #98bf21;"><td>Value 4</td><td>Value 5</td><td>Value 6</td></tr>' +
 			'<tr style="border:1px solid #98bf21;"><td>Value 7</td><td>Value 8</td><td>Value 9</td></tr>' +
 			'<tr style="background-color:#EAF2D3;border:1px solid #98bf21;"><td>Value 10</td><td>Value 11</td><td>Value 12</td></tr></table>', 'Table 1'),
		this.createVertexTemplateEntry('text;html=1;strokeColor=#c0c0c0;fillColor=none;overflow=fill;', 180, 140,
 			'<table border="0" width="100%" height="100%" style="width:100%;height:100%;border-collapse:collapse;">' +
 			'<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
 			'<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
 			'<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>', 'Table 2'),
	 	this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;overflow=fill;', 180, 140,
 			'<table border="1" width="100%" height="100%" style="width:100%;height:100%;border-collapse:collapse;">' +
 			'<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
 			'<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
 			'<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>', 'Table 3'),
	 	this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;overflow=fill;', 160, 140,
 			'<table border="1" width="100%" height="100%" cellpadding="4" style="width:100%;height:100%;border-collapse:collapse;">' +
 			'<tr><th align="center"><b>Title</b></th></tr>' +
 			'<tr><td align="center">Section 1.1\nSection 1.2\nSection 1.3</td></tr>' +
 			'<tr><td align="center">Section 2.1\nSection 2.2\nSection 2.3</td></tr></table>', 'Table 4'),
	 	this.addEntry('link hyperlink', mxUtils.bind(this, function()
	 	{
	 		var cell = new mxCell('Link', new mxGeometry(0, 0, 60, 40), 'text;html=1;strokeColor=none;fillColor=none;whiteSpace=wrap;align=center;verticalAlign=middle;fontColor=#0000EE;fontStyle=4;');
	 		cell.vertex = true;
	 		this.graph.setLinkForCell(cell, 'https://www.draw.io');

	 		return this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Link');
	 	})),
	 	this.addEntry('timestamp date time text label', mxUtils.bind(this, function()
	 	{
	 		var cell = new mxCell('%date{ddd mmm dd yyyy HH:MM:ss}%', new mxGeometry(0, 0, 160, 20), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;');
	 		cell.vertex = true;
	 		this.graph.setAttributeForCell(cell, 'placeholders', '1');

	 		return this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Timestamp');
	 	})),
	 	this.addEntry('variable placeholder metadata hello world text label', mxUtils.bind(this, function()
	 	{
	 		var cell = new mxCell('%name% Text', new mxGeometry(0, 0, 80, 20), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;');
	 		cell.vertex = true;
	 		this.graph.setAttributeForCell(cell, 'placeholders', '1');
	 		this.graph.setAttributeForCell(cell, 'name', 'Variable');

	 		return this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Variable');
	 	})),
	 	this.createVertexTemplateEntry('shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;', 30, 60, 'Actor', 'Actor', false, null, 'user person human stickman'),
	 	this.createVertexTemplateEntry('html=1;whiteSpace=wrap;comic=1;strokeWidth=2;fontFamily=Comic Sans MS;fontStyle=1;', 120, 60, 'RECTANGLE', 'Comic Rectangle', true, null, 'comic rectangle rect box text retro'),
	 	this.createVertexTemplateEntry('rhombus;html=1;align=center;whiteSpace=wrap;comic=1;strokeWidth=2;fontFamily=Comic Sans MS;fontStyle=1;', 100, 100, 'DIAMOND', 'Comic Diamond', true, null, 'comic diamond rhombus if condition decision conditional question test retro'),
	 	this.createEdgeTemplateEntry('rounded=0;comic=1;strokeWidth=2;endArrow=blockThin;html=1;fontFamily=Comic Sans MS;fontStyle=1;', 50, 50, '', 'Comic Arrow'),
	 	this.createVertexTemplateEntry('html=1;whiteSpace=wrap;aspect=fixed;shape=isoRectangle;', 150, 90, '', 'Isometric Square', true, null, 'rectangle rect box iso isometric'),
	 	this.createVertexTemplateEntry('html=1;whiteSpace=wrap;aspect=fixed;shape=isoCube;', 90, 100, '', 'Isometric Cube', true, null, 'cube box iso isometric'),
	 	this.createEdgeTemplateEntry('edgeStyle=isometricEdgeStyle;endArrow=none;html=1;', 50, 100, '', 'Isometric Edge 1'),
	 	this.createEdgeTemplateEntry('edgeStyle=isometricEdgeStyle;endArrow=none;html=1;elbow=vertical;', 50, 100, '', 'Isometric Edge 2'),
	 	this.createVertexTemplateEntry('line;strokeWidth=2;html=1;', 160, 10, '', 'Horizontal Line'),
	 	this.createVertexTemplateEntry('line;strokeWidth=2;direction=south;html=1;', 10, 160, '', 'Vertical Line'),
	 	this.createVertexTemplateEntry('line;strokeWidth=4;html=1;perimeter=backbonePerimeter;points=[];outlineConnect=0;', 160, 10, '', 'Horizontal Backbone', false, null, 'backbone bus network'),
	 	this.createVertexTemplateEntry('line;strokeWidth=4;direction=south;html=1;perimeter=backbonePerimeter;points=[];outlineConnect=0;', 10, 160, '', 'Vertical Backbone', false, null, 'backbone bus network'),
	 	this.createVertexTemplateEntry('shape=curlyBracket;whiteSpace=wrap;html=1;rounded=1;', 20, 120, '', 'Curly Bracket'),
	 	this.createVertexTemplateEntry('shape=crossbar;whiteSpace=wrap;html=1;rounded=1;', 120, 20, '', 'Crossbar', false, null, 'crossbar distance measure dimension unit'),
	 	this.createVertexTemplateEntry('shape=image;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;imageAspect=1;aspect=fixed;image=' + this.gearImage, 52, 61, '', 'Image (Fixed Aspect)', false, null, 'fixed image icon symbol'),
	 	this.createVertexTemplateEntry('shape=image;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;imageAspect=0;image=' + this.gearImage, 50, 60, '', 'Image (Variable Aspect)', false, null, 'strechted image icon symbol'),
	 	this.createVertexTemplateEntry('icon;html=1;image=' + this.gearImage, 60, 60, 'Icon', 'Icon', false, null, 'icon image symbol'),
	 	this.createVertexTemplateEntry('label;whiteSpace=wrap;html=1;image=' + this.gearImage, 140, 60, 'Label', 'Label 1', null, null, 'label image icon symbol'),
	 	this.createVertexTemplateEntry('label;whiteSpace=wrap;html=1;align=center;verticalAlign=bottom;spacingLeft=0;spacingBottom=4;imageAlign=center;imageVerticalAlign=top;image=' + this.gearImage, 120, 80, 'Label', 'Label 2', null, null, 'label image icon symbol'),
		this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;left=0;right=0;fillColor=none;', 120, 60, '', 'Partial Rectangle'),
		this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;left=0;right=0;top=0;fillColor=none;routingCenterY=0.5;', 120, 60, '', 'Partial Rectangle'),
		this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;bottom=1;right=1;top=0;bottom=1;fillColor=none;routingCenterX=-0.5;', 120, 60, '', 'Partial Rectangle'),
	    this.createEdgeTemplateEntry('shape=flexArrow;endArrow=classic;html=1;fillColor=#ffffff;', 50, 50, '', 'Directional Arrow', null, lineTags + 'directional directed'),
	    this.createEdgeTemplateEntry('shape=flexArrow;endArrow=classic;startArrow=classic;html=1;fillColor=#ffffff;', 50, 50, '', 'Bidirectional Arrow', null, lineTags + 'bidirectional'),
	 	this.createEdgeTemplateEntry('edgeStyle=segmentEdgeStyle;endArrow=classic;html=1;', 50, 50, '', 'Manual Line', null, lineTags + 'manual'),
	 	this.createEdgeTemplateEntry('shape=filledEdge;rounded=0;fixDash=1;endArrow=none;strokeWidth=10;fillColor=#ffffff;edgeStyle=orthogonalEdgeStyle;', 120, 60, '', 'Filled Edge'),
	 	this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;elbow=horizontal;endArrow=classic;html=1;', 50, 50, '', 'Horizontal Elbow', null, lineTags + 'elbow horizontal'),
	 	this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;elbow=vertical;endArrow=classic;html=1;', 50, 50, '', 'Vertical Elbow', null, lineTags + 'elbow vertical'),
	 	this.addEntry('curve', mxUtils.bind(this, function()
	 	{
			var cell = new mxCell('', new mxGeometry(0, 0, 50, 50), 'curved=1;endArrow=classic;html=1;');
			cell.geometry.setTerminalPoint(new mxPoint(0, 50), true);
			cell.geometry.setTerminalPoint(new mxPoint(50, 0), false);
			cell.geometry.points = [new mxPoint(50, 50), new mxPoint(0, 0)];
			cell.geometry.relative = true;
			cell.edge = true;
			
		    return this.createEdgeTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Bidirectional Curve');
	 	})),
	 	this.createEdgeTemplateEntry('shape=link;html=1;', 50, 50, '', 'Link', null, lineTags + 'link')
	];

	this.addPaletteFunctions('misc', mxResources.get('misc'), (expand != null) ? expand : true, fns);
};
/**
 * Adds the container palette to the sidebar.
 */
Sidebar.prototype.addAdvancedPalette = function(expand)
{
	this.addPaletteFunctions('advanced', mxResources.get('advanced'), (expand != null) ? expand : false, this.createAdvancedShapes());
};

/**
 * Adds the container palette to the sidebar.
 */
Sidebar.prototype.createAdvancedShapes = function()
{
	// Avoids having to bind all functions to "this"
	var sb = this;

	// Reusable cells
	var field = new mxCell('List Item', new mxGeometry(0, 0, 60, 26), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
	field.vertex = true;

	return [
	 	this.createVertexTemplateEntry('shape=xor;whiteSpace=wrap;html=1;', 60, 80, '', 'Or', null, null, 'logic or'),
	 	this.createVertexTemplateEntry('shape=or;whiteSpace=wrap;html=1;', 60, 80, '', 'And', null, null, 'logic and'),
	 	this.createVertexTemplateEntry('shape=dataStorage;whiteSpace=wrap;html=1;', 100, 80, '', 'Data Storage'),    
	 	this.createVertexTemplateEntry('shape=tapeData;whiteSpace=wrap;html=1;perimeter=ellipsePerimeter;', 80, 80, '', 'Tape Data'),
	 	this.createVertexTemplateEntry('shape=manualInput;whiteSpace=wrap;html=1;', 80, 80, '', 'Manual Input'),
	 	this.createVertexTemplateEntry('shape=loopLimit;whiteSpace=wrap;html=1;', 100, 80, '', 'Loop Limit'),
	 	this.createVertexTemplateEntry('shape=offPageConnector;whiteSpace=wrap;html=1;', 80, 80, '', 'Off Page Connector'),
	 	this.createVertexTemplateEntry('shape=delay;whiteSpace=wrap;html=1;', 80, 40, '', 'Delay'),
	 	this.createVertexTemplateEntry('shape=display;whiteSpace=wrap;html=1;', 80, 40, '', 'Display'),
	 	this.createVertexTemplateEntry('shape=singleArrow;direction=west;whiteSpace=wrap;html=1;', 100, 60, '', 'Arrow Left'),
	 	this.createVertexTemplateEntry('shape=singleArrow;whiteSpace=wrap;html=1;', 100, 60, '', 'Arrow Right'),
	 	this.createVertexTemplateEntry('shape=singleArrow;direction=north;whiteSpace=wrap;html=1;', 60, 100, '', 'Arrow Up'),
	 	this.createVertexTemplateEntry('shape=singleArrow;direction=south;whiteSpace=wrap;html=1;', 60, 100, '', 'Arrow Down'),
	 	this.createVertexTemplateEntry('shape=doubleArrow;whiteSpace=wrap;html=1;', 100, 60, '', 'Double Arrow'),
	 	this.createVertexTemplateEntry('shape=doubleArrow;direction=south;whiteSpace=wrap;html=1;', 60, 100, '', 'Double Arrow Vertical', null, null, 'double arrow'),
	 	this.createVertexTemplateEntry('shape=actor;whiteSpace=wrap;html=1;', 40, 60, '', 'User', null, null, 'user person human'),
	 	this.createVertexTemplateEntry('shape=cross;whiteSpace=wrap;html=1;', 80, 80, '', 'Cross'),
	 	this.createVertexTemplateEntry('shape=corner;whiteSpace=wrap;html=1;', 80, 80, '', 'Corner'),
	 	this.createVertexTemplateEntry('shape=tee;whiteSpace=wrap;html=1;', 80, 80, '', 'Tee'),
	 	this.createVertexTemplateEntry('shape=datastore;whiteSpace=wrap;html=1;', 60, 60, '', 'Data Store', null, null, 'data store cylinder database'),
	 	this.createVertexTemplateEntry('shape=orEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;', 80, 80, '', 'Or', null, null, 'or circle oval ellipse'),
	 	this.createVertexTemplateEntry('shape=sumEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;', 80, 80, '', 'Sum', null, null, 'sum circle oval ellipse'),
	 	this.createVertexTemplateEntry('shape=lineEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;', 80, 80, '', 'Ellipse with horizontal divider', null, null, 'circle oval ellipse'),
	 	this.createVertexTemplateEntry('shape=lineEllipse;line=vertical;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;', 80, 80, '', 'Ellipse with vertical divider', null, null, 'circle oval ellipse'),
	 	this.createVertexTemplateEntry('shape=sortShape;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;', 80, 80, '', 'Sort', null, null, 'sort'),
	 	this.createVertexTemplateEntry('shape=collate;whiteSpace=wrap;html=1;', 80, 80, '', 'Collate', null, null, 'collate'),
	 	this.createVertexTemplateEntry('shape=switch;whiteSpace=wrap;html=1;', 60, 60, '', 'Switch', null, null, 'switch router'),
	 	this.createVertexTemplateEntry('shape=dimension;whiteSpace=wrap;html=1;align=center;points=[];verticalAlign=bottom;spacingBottom=-5;labelBackgroundColor=#ffffff', 100, 40, 'Label', 'Horizontal Dimension', null, null, 'horizontal dimension measure distance unit'),
	 	this.createVertexTemplateEntry('shape=dimension;direction=north;whiteSpace=wrap;html=1;align=right;points=[];verticalAlign=middle;labelBackgroundColor=#ffffff', 40, 100, 'Label', 'Vertical Dimension', null, null, 'vertical dimension measure distance unit'),
	 	this.createVertexTemplateEntry('swimlane;', 200, 200, 'Container', 'Container', null, null, 'container swimlane lane pool'),
		this.addEntry('list', function()
		{
			var cell = new mxCell('List', new mxGeometry(0, 0, 140, 110),
		    	'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;' +
		    	'resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;');
			cell.vertex = true;
			cell.insert(sb.cloneCell(field, 'Item 1'));
			cell.insert(sb.cloneCell(field, 'Item 2'));
			cell.insert(sb.cloneCell(field, 'Item 3'));
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'List');
		}),
		this.addEntry('list item entry value', function()
		{
			return sb.createVertexTemplateFromCells([sb.cloneCell(field, 'List Item')], field.geometry.width, field.geometry.height, 'List Item');
		})
	];
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addUmlPalette = function(expand)
{
	// Avoids having to bind all functions to "this"
	var sb = this;

	// Reusable cells
	var field = new mxCell('+ field: type', new mxGeometry(0, 0, 100, 26), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
	field.vertex = true;

	var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
	divider.vertex = true;
	
	// Default tags
	var dt = 'uml static class ';
	
	var fns = [
   		this.createVertexTemplateEntry('html=1;', 110, 50, 'Object', 'Object', null, null, dt + 'object instance'),
   		this.createVertexTemplateEntry('html=1;', 110, 50, '&laquo;interface&raquo;<br><b>Name</b>', 'Interface', null, null, dt + 'interface object instance annotated annotation'),
	 	this.addEntry(dt + 'object instance', function()
		{
			var cell = new mxCell('Classname', new mxGeometry(0, 0, 160, 90),
		    	'swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;');
			cell.vertex = true;
			cell.insert(field.clone());
			cell.insert(divider.clone());
			cell.insert(sb.cloneCell(field, '+ method(type): type'));
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Class'); 
		}),
		this.addEntry(dt + 'section subsection', function()
		{
			var cell = new mxCell('Classname', new mxGeometry(0, 0, 140, 110),
		    	'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;');
			cell.vertex = true;
			cell.insert(field.clone());
			cell.insert(field.clone());
			cell.insert(field.clone());
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Class 2');
		}),
		this.addEntry(dt + 'item member method function variable field attribute label', function()
		{
			return sb.createVertexTemplateFromCells([sb.cloneCell(field, '+ item: attribute')], field.geometry.width, field.geometry.height, 'Item 1');
		}),
   		this.addEntry(dt + 'item member method function variable field attribute label', function()
		{
   			var cell = new mxCell('item: attribute', new mxGeometry(0, 0, 120, field.geometry.height), 'label;fontStyle=0;strokeColor=none;fillColor=none;align=left;verticalAlign=top;overflow=hidden;' +
   				'spacingLeft=28;spacingRight=4;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;imageWidth=16;imageHeight=16;image=' + sb.gearImage);
   			cell.vertex = true;
   			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Item 2');
		}),
		this.addEntry(dt + 'divider hline line separator', function()
		{
			return sb.createVertexTemplateFromCells([divider.clone()], divider.geometry.width, divider.geometry.height, 'Divider');
		}),
		this.addEntry(dt + 'spacer space gap separator', function()
		{
			var cell = new mxCell('', new mxGeometry(0, 0, 20, 14), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=4;spacingRight=4;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
			cell.vertex = true;
			
			return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, 'Spacer');
		}),
		this.createVertexTemplateEntry('text;align=center;fontStyle=1;verticalAlign=middle;spacingLeft=3;spacingRight=3;strokeColor=none;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;',
			80, 26, 'Title', 'Title', null, null, dt + 'title label'),
		this.addEntry(dt + 'component', function()
		{
		    var cell = new mxCell('&laquo;Annotation&raquo;<br/><b>Component</b>', new mxGeometry(0, 0, 180, 90), 'html=1;');
		    cell.vertex = true;
		    
			var symbol = new mxCell('', new mxGeometry(1, 0, 20, 20), 'shape=component;jettyWidth=8;jettyHeight=4;');
			symbol.vertex = true;
			symbol.geometry.relative = true;
			symbol.geometry.offset = new mxPoint(-27, 7);
			cell.insert(symbol);
	    	
	    	return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Component');
		}),
		this.addEntry(dt + 'component', function()
		{
		    var cell = new mxCell('<p style="margin:0px;margin-top:6px;text-align:center;"><b>Component</b></p>' +
				'<hr/><p style="margin:0px;margin-left:8px;">+ Attribute1: Type<br/>+ Attribute2: Type</p>', new mxGeometry(0, 0, 180, 90),
				'align=left;overflow=fill;html=1;');
		    cell.vertex = true;
		    
			var symbol = new mxCell('', new mxGeometry(1, 0, 20, 20), 'shape=component;jettyWidth=8;jettyHeight=4;');
			symbol.vertex = true;
			symbol.geometry.relative = true;
			symbol.geometry.offset = new mxPoint(-24, 4);
			cell.insert(symbol);
	    	
	    	return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Component with Attributes');
		}),
		this.createVertexTemplateEntry('verticalAlign=top;align=left;spacingTop=8;spacingLeft=2;spacingRight=12;shape=cube;size=10;direction=south;fontStyle=4;html=1;',
			180, 120, 'Block', 'Block', null, null, dt + 'block'),
		this.createVertexTemplateEntry('shape=component;align=left;spacingLeft=36;', 120, 60, 'Module', 'Module', null, null, dt + 'module'),
		this.createVertexTemplateEntry('shape=folder;fontStyle=1;spacingTop=10;tabWidth=40;tabHeight=14;tabPosition=left;html=1;', 70, 50,
		   	'package', 'Package', null, null, dt + 'package'),
		this.createVertexTemplateEntry('verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;',
			160, 90, '<p style="margin:0px;margin-top:4px;text-align:center;text-decoration:underline;"><b>Object:Type</b></p><hr/>' +
			'<p style="margin:0px;margin-left:8px;">field1 = value1<br/>field2 = value2<br>field3 = value3</p>', 'Object',
			null, null, dt + 'object instance'),
		this.createVertexTemplateEntry('verticalAlign=top;align=left;overflow=fill;html=1;',180, 90,
			'<div style="box-sizing:border-box;width:100%;background:#e4e4e4;padding:2px;">Tablename</div>' +
			'<table style="width:100%;font-size:1em;" cellpadding="2" cellspacing="0">' +
			'<tr><td>PK</td><td>uniqueId</td></tr><tr><td>FK1</td><td>' +
			'foreignKey</td></tr><tr><td></td><td>fieldname</td></tr></table>', 'Entity', null, null, 'er entity table'),
		this.addEntry(dt + 'object instance', function()
		{
		    var cell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Class</b></p>' +
					'<hr size="1"/><div style="height:2px;"></div>', new mxGeometry(0, 0, 140, 60),
					'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;');
		    cell.vertex = true;
			
			return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, 'Class 3');
		}),
		this.addEntry(dt + 'object instance', function()
		{
		    var cell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Class</b></p>' +
					'<hr size="1"/><div style="height:2px;"></div><hr size="1"/><div style="height:2px;"></div>', new mxGeometry(0, 0, 140, 60),
					'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;');
		    cell.vertex = true;
			
			return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, 'Class 4');
		}),
		this.addEntry(dt + 'object instance', function()
		{
		    var cell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Class</b></p>' +
					'<hr size="1"/><p style="margin:0px;margin-left:4px;">+ field: Type</p><hr size="1"/>' +
					'<p style="margin:0px;margin-left:4px;">+ method(): Type</p>', new mxGeometry(0, 0, 160, 90),
					'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;');
		    cell.vertex = true;
			
			return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, 'Class 5');
		}),
		this.addEntry(dt + 'object instance', function()
		{
		    var cell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>&lt;&lt;Interface&gt;&gt;</i><br/><b>Interface</b></p>' +
					'<hr size="1"/><p style="margin:0px;margin-left:4px;">+ field1: Type<br/>' +
					'+ field2: Type</p>' +
					'<hr size="1"/><p style="margin:0px;margin-left:4px;">' +
					'+ method1(Type): Type<br/>' +
					'+ method2(Type, Type): Type</p>', new mxGeometry(0, 0, 190, 140),
					'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;');
		    cell.vertex = true;
			
			return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, 'Interface 2');
		}),
		this.createVertexTemplateEntry('shape=lollipop;direction=south;html=1;', 30, 10, '', 'Provided Interface', null, null, dt + 'provided interface'),
		this.createVertexTemplateEntry('shape=requires;direction=north;html=1;', 30, 20, '', 'Required Interface', null, null, dt + 'required interface'),
		this.createVertexTemplateEntry('shape=umlBoundary;whiteSpace=wrap;html=1;', 100, 80, 'Boundary Object', 'Boundary Object', null, null, 'uml boundary object'),
		this.createVertexTemplateEntry('ellipse;shape=umlEntity;whiteSpace=wrap;html=1;', 80, 80, 'Entity Object', 'Entity Object', null, null, 'uml entity object'),
		this.createVertexTemplateEntry('ellipse;shape=umlControl;whiteSpace=wrap;html=1;', 70, 80, 'Control Object', 'Control Object', null, null, 'uml control object'),
		this.createVertexTemplateEntry('shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;', 30, 60, 'Actor', 'Actor', false, null, 'uml actor'),
		this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;', 140, 70, 'Use Case', 'Use Case', null, null, 'uml use case usecase'),
		this.addEntry('uml activity state start', function()
		{
	    	var cell = new mxCell('', new mxGeometry(0, 0, 30, 30),
	    		'ellipse;html=1;shape=startState;fillColor=#000000;strokeColor=#ff0000;');
	    	cell.vertex = true;
	    	
			var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
			edge.geometry.setTerminalPoint(new mxPoint(15, 90), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
			cell.insertEdge(edge, true);
	    	
			return sb.createVertexTemplateFromCells([cell, edge], 30, 90, 'Start');
		}),
		this.addEntry('uml activity state', function()
		{
			var cell = new mxCell('Activity', new mxGeometry(0, 0, 120, 40),
				'rounded=1;whiteSpace=wrap;html=1;arcSize=40;fillColor=#ffffc0;strokeColor=#ff0000;');
			cell.vertex = true;
			
			var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
			edge.geometry.setTerminalPoint(new mxPoint(60, 100), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
			cell.insertEdge(edge, true);
			
			return sb.createVertexTemplateFromCells([cell, edge], 120, 100, 'Activity');
		}),
		this.addEntry('uml activity composite state', function()
		{
			var cell = new mxCell('Composite State', new mxGeometry(0, 0, 160, 60),
					'swimlane;html=1;fontStyle=1;align=center;verticalAlign=middle;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=0;resizeLast=1;container=0;collapsible=0;rounded=1;arcSize=30;strokeColor=#ff0000;fillColor=#ffffc0;swimlaneFillColor=#ffffc0;');
			cell.vertex = true;
			
			var cell1 = new mxCell('Subtitle', new mxGeometry(0, 0, 200, 26), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;');
			cell1.vertex = true;
			cell.insert(cell1);
			
			var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
			edge.geometry.setTerminalPoint(new mxPoint(80, 120), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
			cell.insertEdge(edge, true);
			
			return sb.createVertexTemplateFromCells([cell, edge], 160, 120, 'Composite State');
		}),
		this.addEntry('uml activity condition', function()
		{
	    	var cell = new mxCell('Condition', new mxGeometry(0, 0, 80, 40), 'rhombus;whiteSpace=wrap;html=1;fillColor=#ffffc0;strokeColor=#ff0000;');
	    	cell.vertex = true;
	    	
			var edge1 = new mxCell('no', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;align=left;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
			edge1.geometry.setTerminalPoint(new mxPoint(180, 20), false);
			edge1.geometry.relative = true;
			edge1.geometry.x = -1;
			edge1.edge = true;
			
			cell.insertEdge(edge1, true);
	    	
			var edge2 = new mxCell('yes', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;align=left;verticalAlign=top;endArrow=open;endSize=8;strokeColor=#ff0000;');
			edge2.geometry.setTerminalPoint(new mxPoint(40, 100), false);
			edge2.geometry.relative = true;
			edge2.geometry.x = -1;
			edge2.edge = true;
			
			cell.insertEdge(edge2, true);
			
			return sb.createVertexTemplateFromCells([cell, edge1, edge2], 180, 100, 'Condition');
		}),
		this.addEntry('uml activity fork join', function()
		{
	    	var cell = new mxCell('', new mxGeometry(0, 0, 200, 10), 'shape=line;html=1;strokeWidth=6;strokeColor=#ff0000;');
	    	cell.vertex = true;
			
			var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;');
			edge.geometry.setTerminalPoint(new mxPoint(100, 80), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
			cell.insertEdge(edge, true);
		
			return sb.createVertexTemplateFromCells([cell, edge], 200, 80, 'Fork/Join');
		}),
		this.createVertexTemplateEntry('ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#ff0000;', 30, 30, '', 'End', null, null, 'uml activity state end'),
		this.createVertexTemplateEntry('shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;', 100, 300, ':Object', 'Lifeline', null, null, 'uml sequence participant lifeline'),
		this.createVertexTemplateEntry('shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;',
				20, 300, '', 'Actor Lifeline', null, null, 'uml sequence participant lifeline actor'),
		this.createVertexTemplateEntry('shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;',
				50, 300, '', 'Boundary Lifeline', null, null, 'uml sequence participant lifeline boundary'),
		this.createVertexTemplateEntry('shape=umlLifeline;participant=umlEntity;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;',
				40, 300, '', 'Entity Lifeline', null, null, 'uml sequence participant lifeline entity'),
		this.createVertexTemplateEntry('shape=umlLifeline;participant=umlControl;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;',
				40, 300, '', 'Control Lifeline', null, null, 'uml sequence participant lifeline control'),
		this.createVertexTemplateEntry('shape=umlFrame;whiteSpace=wrap;html=1;', 300, 200, 'frame', 'Frame', null, null, 'uml sequence frame'),
		this.createVertexTemplateEntry('shape=umlDestroy;whiteSpace=wrap;html=1;strokeWidth=3;', 30, 30, '', 'Destruction', null, null, 'uml sequence destruction destroy'),
		this.createVertexTemplateEntry('shape=note;whiteSpace=wrap;html=1;size=14;verticalAlign=top;align=left;spacingTop=-6;', 100, 70, 'Note', 'Note', null, null, 'uml note'),
		this.addEntry('uml sequence invoke invocation call activation', function()
		{
	    	var cell = new mxCell('', new mxGeometry(0, 0, 10, 80), 'html=1;points=[];perimeter=orthogonalPerimeter;');
	    	cell.vertex = true;
	    	
			var edge = new mxCell('dispatch', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;startArrow=oval;endArrow=block;startSize=8;');
			edge.geometry.setTerminalPoint(new mxPoint(-60, 0), true);
			edge.geometry.relative = true;
			edge.edge = true;
			
			cell.insertEdge(edge, false);
	
			return sb.createVertexTemplateFromCells([cell, edge], 10, 80, 'Found Message');
		}),
		this.addEntry('uml sequence invoke call delegation synchronous invocation activation', function()
		{
	    	var cell = new mxCell('', new mxGeometry(0, 0, 10, 80), 'html=1;points=[];perimeter=orthogonalPerimeter;');
	    	cell.vertex = true;
	    	
			var edge1 = new mxCell('dispatch', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;endArrow=block;entryX=0;entryY=0;');
			edge1.geometry.setTerminalPoint(new mxPoint(-70, 0), true);
			edge1.geometry.relative = true;
			edge1.edge = true;

			cell.insertEdge(edge1, false);
			
			var edge2 = new mxCell('return', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;exitX=0;exitY=0.95;');
			edge2.geometry.setTerminalPoint(new mxPoint(-70, 76), false);
			edge2.geometry.relative = true;
			edge2.edge = true;
			
			cell.insertEdge(edge2, true);
			
			return sb.createVertexTemplateFromCells([cell, edge1, edge2], 10, 80, 'Synchronous Invocation');
		}),
		this.addEntry('uml sequence self call recursion delegation activation', function()
		{
	    	var cell = new mxCell('', new mxGeometry(0, 20, 10, 40), 'html=1;points=[];perimeter=orthogonalPerimeter;');
	    	cell.vertex = true;
	
			var edge = new mxCell('self call', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;align=left;spacingLeft=2;endArrow=block;rounded=0;entryX=1;entryY=0;');
			edge.geometry.setTerminalPoint(new mxPoint(5, 0), true);
			edge.geometry.points = [new mxPoint(30, 0)];
			edge.geometry.relative = true;
			edge.edge = true;
			
			cell.insertEdge(edge, false);
	
			return sb.createVertexTemplateFromCells([cell, edge], 10, 60, 'Self Call');
		}),
		this.addEntry('uml sequence invoke call delegation callback activation', function()
		{
			// TODO: Check if more entries should be converted to compressed XML
			return sb.createVertexTemplateFromData('xZRNT8MwDIZ/Ta6oaymD47rBTkiTuMAxW6wmIm0q19s6fj1OE3V0Y2iCA4dK8euP2I+riGxedUuUjX52CqzIHkU2R+conKpuDtaKNDFKZAuRpgl/In264J303qSRCDVdk5CGhJ20WwhKEFo62ChoqritxURkReNMTa2X80LkC68AmgoIkEWHpF3pamlXR7WIFwASdBeb7KXY4RIc5+KBQ/ZGkY4RYY5Egyl1zLqLmmyDXQ6Zx4n5EIf+HkB2BmAjrV3LzftPIPw4hgNn1pQ1a2tH5Cp2QK1miG7vNeu4iJe4pdeY2BtvbCQDGlAljMCQxBJotJ8rWCFYSWY3LvUdmZi68rvkkLiU6QnL1m1xAzHoBOdw61WEb88II9AW67/ydQ2wq1Cy1aAGvOrFfPh6997qDA3g+dxzv3nIL6MPU/8T+kMw8+m4QPgdfrEJNo8PSQj/+s58Ag==',
				10, 60, 'Callback');
		}),
		this.createVertexTemplateEntry('html=1;points=[];perimeter=orthogonalPerimeter;', 10, 80, '', 'Activation', null, null, 'uml sequence activation'),
	 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;startArrow=oval;startFill=1;endArrow=block;startSize=8;', 60, 0, 'dispatch', 'Found Message 1', null, 'uml sequence message call invoke dispatch'),
	 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;startArrow=circle;startFill=1;endArrow=open;startSize=6;endSize=8;', 80, 0, 'dispatch', 'Found Message 2', null, 'uml sequence message call invoke dispatch'),
	 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;endArrow=block;', 80, 0, 'dispatch', 'Message', null, 'uml sequence message call invoke dispatch'),
		this.addEntry('uml sequence return message', function()
		{
			var edge = new mxCell('return', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;');
			edge.geometry.setTerminalPoint(new mxPoint(80, 0), true);
			edge.geometry.setTerminalPoint(new mxPoint(0, 0), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
			return sb.createEdgeTemplateFromCells([edge], 80, 0, 'Return');
		}),
		this.addEntry('uml relation', function()
		{
			var edge = new mxCell('name', new mxGeometry(0, 0, 0, 0), 'endArrow=block;endFill=1;html=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=top;');
			edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			edge.geometry.relative = true;
			edge.geometry.x = -1;
			edge.edge = true;
			
	    	var cell = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;');
	    	cell.geometry.relative = true;
	    	cell.setConnectable(false);
	    	cell.vertex = true;
	    	edge.insert(cell);
	    	
			return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Relation 1');
		}),
		this.addEntry('uml association', function()
		{
			var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=orthogonalEdgeStyle;');
			edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
	    	var cell1 = new mxCell('parent', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;');
	    	cell1.geometry.relative = true;
	    	cell1.setConnectable(false);
	    	cell1.vertex = true;
	    	edge.insert(cell1);
			
	    	var cell2 = new mxCell('child', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;');
	    	cell2.geometry.relative = true;
	    	cell2.setConnectable(false);
	    	cell2.vertex = true;
	    	edge.insert(cell2);
	    	
			return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Association 1');
		}),
		this.addEntry('uml aggregation', function()
		{
			var edge = new mxCell('1', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;');
			edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			edge.geometry.relative = true;
			edge.geometry.x = -1;
			edge.geometry.y = 3;
			edge.edge = true;
		
			return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Aggregation 1');
		}),
		this.addEntry('uml composition', function()
		{
			var edge = new mxCell('1', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;');
			edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			edge.geometry.relative = true;
			edge.geometry.x = -1;
			edge.geometry.y = 3;
			edge.edge = true;
			
			return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Composition 1');
		}),
		this.addEntry('uml relation', function()
		{
			var edge = new mxCell('Relation', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;');
			edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
	    	var cell1 = new mxCell('0..n', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=#ffffff;fontSize=10;');
	    	cell1.geometry.relative = true;
	    	cell1.setConnectable(false);
	    	cell1.vertex = true;
	    	edge.insert(cell1);
			
	    	var cell2 = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=#ffffff;fontSize=10;');
	    	cell2.geometry.relative = true;
	    	cell2.setConnectable(false);
	    	cell2.vertex = true;
	    	edge.insert(cell2);
	    	
			return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Relation 2');
		}),
		this.createEdgeTemplateEntry('endArrow=open;endSize=12;dashed=1;html=1;', 160, 0, 'Use', 'Dependency', null, 'uml dependency use'),
		this.createEdgeTemplateEntry('endArrow=block;endSize=16;endFill=0;html=1;', 160, 0, 'Extends', 'Generalization', null, 'uml generalization extend'),
	 	this.createEdgeTemplateEntry('endArrow=block;startArrow=block;endFill=1;startFill=1;html=1;', 160, 0, '', 'Association 2', null, 'uml association'),
	 	this.createEdgeTemplateEntry('endArrow=open;startArrow=circlePlus;endFill=0;startFill=0;endSize=8;html=1;', 160, 0, '', 'Inner Class', null, 'inner class'),
	 	this.createEdgeTemplateEntry('endArrow=open;startArrow=cross;endFill=0;startFill=0;endSize=8;startSize=10;html=1;', 160, 0, '', 'Terminate', null, 'terminate'),
	 	this.createEdgeTemplateEntry('endArrow=block;dashed=1;endFill=0;endSize=12;html=1;', 160, 0, '', 'Implementation', null, 'realization implementation'),
	 	this.createEdgeTemplateEntry('endArrow=diamondThin;endFill=0;endSize=24;html=1;', 160, 0, '', 'Aggregation 2', null, 'aggregation'),
	 	this.createEdgeTemplateEntry('endArrow=diamondThin;endFill=1;endSize=24;html=1;', 160, 0, '', 'Composition 2', null, 'composition'),
	 	this.createEdgeTemplateEntry('endArrow=open;endFill=1;endSize=12;html=1;', 160, 0, '', 'Association 3', null, 'association')
	];
	
	this.addPaletteFunctions('uml', mxResources.get('uml'), expand || false, fns);
};

/**
 * Adds the BPMN library to the sidebar.
 */
Sidebar.prototype.addBpmnPalette = function(dir, expand)
{
	// Avoids having to bind all functions to "this"
	var sb = this;

	var fns =
	[
	 	this.createVertexTemplateEntry('shape=ext;rounded=1;html=1;whiteSpace=wrap;', 120, 80, 'Task', 'Process', null, null, 'bpmn task process'),
	 	this.createVertexTemplateEntry('shape=ext;rounded=1;html=1;whiteSpace=wrap;double=1;', 120, 80, 'Transaction', 'Transaction', null, null, 'bpmn transaction'),
	 	this.createVertexTemplateEntry('shape=ext;rounded=1;html=1;whiteSpace=wrap;dashed=1;dashPattern=1 4;', 120, 80, 'Event\nSub-Process', 'Event Sub-Process', null, null, 'bpmn event subprocess sub process sub-process'),
	 	this.createVertexTemplateEntry('shape=ext;rounded=1;html=1;whiteSpace=wrap;strokeWidth=3;', 120, 80, 'Call Activity', 'Call Activity', null, null, 'bpmn call activity'),
		this.addEntry('bpmn subprocess sub process sub-process', function()
		{
			var cell = new mxCell('Sub-Process', new mxGeometry(0, 0, 120, 80), 'html=1;whiteSpace=wrap;rounded=1;');
			cell.vertex = true;
			
			var cell1 = new mxCell('', new mxGeometry(0.5, 1, 14, 14), 'html=1;shape=plus;');
			cell1.vertex = true;
			cell1.geometry.relative = true;
			cell1.geometry.offset = new mxPoint(-7, -14);
			cell.insert(cell1);
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Sub-Process');
		}),
		this.addEntry(this.getTagsForStencil('mxgraph.bpmn', 'loop', 'subprocess sub process sub-process looped').join(' '), function()
		{
			var cell = new mxCell('Looped\nSub-Process', new mxGeometry(0, 0, 120, 80), 'html=1;whiteSpace=wrap;rounded=1');
			cell.vertex = true;
			
			var cell1 = new mxCell('', new mxGeometry(0.5, 1, 14, 14), 'html=1;shape=mxgraph.bpmn.loop;');
			cell1.vertex = true;
			cell1.geometry.relative = true;
			cell1.geometry.offset = new mxPoint(-15, -14);
			cell.insert(cell1);
			
			var cell2 = new mxCell('', new mxGeometry(0.5, 1, 14, 14), 'html=1;shape=plus;');
			cell2.vertex = true;
			cell2.geometry.relative = true;
			cell2.geometry.offset = new mxPoint(1, -14);
			cell.insert(cell2);
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Looped Sub-Process');
		}),
		this.addEntry('bpmn receive task', function()
		{
			var cell = new mxCell('Receive', new mxGeometry(0, 0, 120, 80), 'html=1;whiteSpace=wrap;rounded=1;');
			cell.vertex = true;
			
			var cell1 = new mxCell('', new mxGeometry(0, 0, 20, 14), 'html=1;shape=message;');
			cell1.vertex = true;
			cell1.geometry.relative = true;
			cell1.geometry.offset = new mxPoint(7, 7);
			cell.insert(cell1);
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Receive Task');
		}),
		this.addEntry(this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' '), function()
		{
			var cell = new mxCell('User', new mxGeometry(0, 0, 120, 80), 'html=1;whiteSpace=wrap;rounded=1;');
			cell.vertex = true;
			
			var cell1 = new mxCell('', new mxGeometry(0, 0, 14, 14), 'html=1;shape=mxgraph.bpmn.user_task;');
			cell1.vertex = true;
			cell1.geometry.relative = true;
			cell1.geometry.offset = new mxPoint(7, 7);
			cell.insert(cell1);
			
			var cell2 = new mxCell('', new mxGeometry(0.5, 1, 14, 14), 'html=1;shape=plus;');
			cell2.vertex = true;
			cell2.geometry.relative = true;
			cell2.geometry.offset = new mxPoint(-7, -14);
			cell.insert(cell2);
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'User Task');
		}),
		this.addEntry(this.getTagsForStencil('mxgraph.bpmn', 'timer_start', 'attached').join(' '), function()
		{
			var cell = new mxCell('Process', new mxGeometry(0, 0, 120, 80), 'html=1;whiteSpace=wrap;rounded=1;');
			cell.vertex = true;

			var cell1 = new mxCell('', new mxGeometry(1, 1, 30, 30), 'shape=mxgraph.bpmn.timer_start;perimeter=ellipsePerimeter;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;');
			cell1.vertex = true;
			cell1.geometry.relative = true;
			cell1.geometry.offset = new mxPoint(-40, -15);
			cell.insert(cell1);

			return sb.createVertexTemplateFromCells([cell], 120, 95, 'Attached Timer Event 1');
		}),
		this.addEntry(this.getTagsForStencil('mxgraph.bpmn', 'timer_start', 'attached').join(' '), function()
		{
			var cell = new mxCell('Process', new mxGeometry(0, 0, 120, 80), 'html=1;whiteSpace=wrap;rounded=1;');
			cell.vertex = true;

			var cell1 = new mxCell('', new mxGeometry(1, 0, 30, 30), 'shape=mxgraph.bpmn.timer_start;perimeter=ellipsePerimeter;html=1;labelPosition=right;labelBackgroundColor=#ffffff;align=left;');
			cell1.vertex = true;
			cell1.geometry.relative = true;
			cell1.geometry.offset = new mxPoint(-15, 10);
			cell.insert(cell1);

			return sb.createVertexTemplateFromCells([cell], 135, 80, 'Attached Timer Event 2');
		}),
		this.createVertexTemplateEntry('swimlane;html=1;horizontal=0;startSize=20;', 320, 240, 'Pool', 'Pool', null, null, 'bpmn pool'),
		this.createVertexTemplateEntry('swimlane;html=1;horizontal=0;swimlaneFillColor=white;swimlaneLine=0;', 300, 120, 'Lane', 'Lane', null, null, 'bpmn lane'),
	 	this.createVertexTemplateEntry('shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;', 60, 50, '', 'Conversation', null, null, 'bpmn conversation'),
	 	this.createVertexTemplateEntry('shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;strokeWidth=4', 60, 50, '', 'Call Conversation', null, null, 'bpmn call conversation'),
		this.addEntry('bpmn subconversation sub conversation sub-conversation', function()
		{
			var cell = new mxCell('', new mxGeometry(0, 0, 60, 50), 'shape=hexagon;whiteSpace=wrap;html=1;perimeter=hexagonPerimeter;');
			cell.vertex = true;
			
			var cell1 = new mxCell('', new mxGeometry(0.5, 1, 14, 14), 'html=1;shape=plus;');
			cell1.vertex = true;
			cell1.geometry.relative = true;
			cell1.geometry.offset = new mxPoint(-7, -14);
			cell.insert(cell1);
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Sub-Conversation');
		}),
		this.addEntry('bpmn data object', function()
		{
			var cell = new mxCell('', new mxGeometry(0, 0, 40, 60), 'shape=note;whiteSpace=wrap;size=16;html=1;');
			cell.vertex = true;
			
			var cell1 = new mxCell('', new mxGeometry(0, 0, 14, 14), 'html=1;shape=singleArrow;arrowWidth=0.4;arrowSize=0.4;');
			cell1.vertex = true;
			cell1.geometry.relative = true;
			cell1.geometry.offset = new mxPoint(2, 2);
			cell.insert(cell1);
			
			var cell2 = new mxCell('', new mxGeometry(0.5, 1, 14, 14), 'html=1;whiteSpace=wrap;shape=parallelMarker;');
			cell2.vertex = true;
			cell2.geometry.relative = true;
			cell2.geometry.offset = new mxPoint(-7, -14);
			cell.insert(cell2);
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Data Object');
		}),
		this.createVertexTemplateEntry('shape=datastore;whiteSpace=wrap;html=1;', 60, 60, '', 'Data Store', null, null, 'bpmn data store'),
	 	this.createVertexTemplateEntry('shape=plus;html=1;', 14, 14, '', 'Sub-Process Marker', null, null, 'bpmn subprocess sub process sub-process marker'),
	 	this.createVertexTemplateEntry('shape=mxgraph.bpmn.loop;html=1;', 14, 14, '', 'Loop Marker', null, null, 'bpmn loop marker'),
	 	this.createVertexTemplateEntry('shape=parallelMarker;html=1;', 14, 14, '', 'Parallel MI Marker', null, null, 'bpmn parallel mi marker'),
	 	this.createVertexTemplateEntry('shape=parallelMarker;direction=south;html=1;', 14, 14, '', 'Sequential MI Marker', null, null, 'bpmn sequential mi marker'),
	 	this.createVertexTemplateEntry('shape=mxgraph.bpmn.ad_hoc;fillColor=#000000;html=1;', 14, 14, '', 'Ad Hoc Marker', null, null, 'bpmn ad hoc marker'),
	 	this.createVertexTemplateEntry('shape=mxgraph.bpmn.compensation;html=1;', 14, 14, '', 'Compensation Marker', null, null, 'bpmn compensation marker'),
	 	this.createVertexTemplateEntry('shape=message;whiteSpace=wrap;html=1;fillColor=#000000;strokeColor=#ffffff;strokeWidth=2;', 40, 30, '', 'Send Task', null, null, 'bpmn send task'),
	 	this.createVertexTemplateEntry('shape=message;whiteSpace=wrap;html=1;', 40, 30, '', 'Receive Task', null, null, 'bpmn receive task'),
	 	this.createVertexTemplateEntry('shape=mxgraph.bpmn.user_task;html=1;', 14, 14, '', 'User Task', null, null, this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' ')),
	 	this.createVertexTemplateEntry('shape=mxgraph.bpmn.manual_task;html=1;', 14, 14, '', 'Manual Task', null, null, this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' ')),
	 	this.createVertexTemplateEntry('shape=mxgraph.bpmn.business_rule_task;html=1;', 14, 14, '', 'Business Rule Task', null, null, this.getTagsForStencil('mxgraph.bpmn', 'business_rule_task').join(' ')),
	 	this.createVertexTemplateEntry('shape=mxgraph.bpmn.service_task;html=1;', 14, 14, '', 'Service Task', null, null, this.getTagsForStencil('mxgraph.bpmn', 'service_task').join(' ')),
	 	this.createVertexTemplateEntry('shape=mxgraph.bpmn.script_task;html=1;', 14, 14, '', 'Script Task', null, null, this.getTagsForStencil('mxgraph.bpmn', 'script_task').join(' ')),
	 	this.createEdgeTemplateEntry('endArrow=block;endFill=1;endSize=6;html=1;', 100, 0, '', 'Sequence Flow', null, 'bpmn sequence flow'),
	 	this.createEdgeTemplateEntry('startArrow=dash;startSize=8;endArrow=block;endFill=1;endSize=6;html=1;', 100, 0, '', 'Default Flow', null, 'bpmn default flow'),
	 	this.createEdgeTemplateEntry('startArrow=diamondThin;startFill=0;startSize=14;endArrow=block;endFill=1;endSize=6;html=1;', 100, 0, '', 'Conditional Flow', null, 'bpmn conditional flow'),
	 	this.createEdgeTemplateEntry('startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1;html=1;', 100, 0, '', 'Message Flow 1', null, 'bpmn message flow'),
		this.addEntry('bpmn message flow', function()
		{
			var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1;html=1;');
			edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			edge.geometry.setTerminalPoint(new mxPoint(100, 0), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
	    	var cell = new mxCell('', new mxGeometry(0, 0, 20, 14), 'shape=message;html=1;');
	    	cell.geometry.relative = true;
	    	cell.setConnectable(false);
	    	cell.vertex = true;
	    	cell.geometry.offset = new mxPoint(-10, -7);
	    	edge.insert(cell);

			return sb.createEdgeTemplateFromCells([edge], 100, 0, 'Message Flow 2');
		}),
		this.createEdgeTemplateEntry('shape=link;html=1;', 100, 0, '', 'Link', null, 'bpmn link')
	];
	
	this.addPaletteFunctions('bpmn', 'BPMN ' + mxResources.get('general'), false, fns);
};

/**
 * Creates and returns the given title element.
 */
Sidebar.prototype.createTitle = function(label)
{
	var elt = document.createElement('a');
	elt.setAttribute('href', 'javascript:void(0);');
	elt.setAttribute('title', mxResources.get('sidebarTooltip'));
	elt.className = 'geTitle';
	mxUtils.write(elt, label);

	return elt;
};

/**
 * Creates a thumbnail for the given cells.
 */
Sidebar.prototype.createThumb = function(cells, width, height, parent, title, showLabel, showTitle, realWidth, realHeight)
{
	Editor.prototype.originalNoForeignObject=false;
	mxClient.NO_FO=false;
	this.graph.labelsVisible = (showLabel == null || showLabel);
	var fo = mxClient.NO_FO;
	mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
	this.graph.view.scaleAndTranslate(1, 0, 0);
	this.graph.addCells(cells);
	var bounds = this.graph.getGraphBounds();
	var s = Math.floor(Math.min((width - 2 * this.thumbBorder) / bounds.width,
			(height - 2 * this.thumbBorder) / bounds.height) * 100) / 100;
	this.graph.view.scaleAndTranslate(s, Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
			Math.floor((height - bounds.height * s) / 2 / s - bounds.y));
	
	var node = null;
	// For supporting HTML labels in IE9 standards mode the container is cloned
	// instead
	if (this.graph.dialect == mxConstants.DIALECT_SVG && !mxClient.NO_FO)
	{
		node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
		var gobj=cells[0].value;
		if(gobj instanceof GModel.GChart){
			node.innerHTML='<g style="visibility: visible;"><image x="2" y="2" width="31" height="31" xlink:href="./static/images/assembly/'+gobj.gobjType+'.png"></image></g>';
		}
	}
	// LATER: Check if deep clone can be used for quirks if container in DOM
	else
	{
		node = this.graph.container.cloneNode(false);
		node.innerHTML = this.graph.container.innerHTML;
	}
	
	this.graph.getModel().clear();
	mxClient.NO_FO = fo;
	
	// Catch-all event handling
	if (mxClient.IS_IE6)
	{
		parent.style.backgroundImage = 'url(' + this.editorUi.editor.transparentImage + ')';
	}
	
	node.style.position = 'relative';
	node.style.overflow = 'hidden';
	node.style.cursor = 'move';
	node.style.left = this.thumbBorder + 'px';
	node.style.top = this.thumbBorder + 'px';
	node.style.width = width + 'px';
	node.style.height = height + 'px';
	node.style.visibility = '';
	node.style.minWidth = '';
	node.style.minHeight = '';
	node.style.display='inline-block';
	
	parent.appendChild(node);
	
	// Adds title for sidebar entries
	if (this.sidebarTitles && title != null && showTitle != false)
	{
		var border = (mxClient.IS_QUIRKS) ? 2 * this.thumbPadding + 2: 0;
		parent.style.height = (this.thumbHeight + border + this.sidebarTitleSize + 8) + 'px';

		var div = document.createElement('div');
		div.style.fontSize = this.sidebarTitleSize + 'px';
		div.style.color = '#303030';
		div.style.textAlign = 'center';
		div.style.whiteSpace = 'nowrap';

		if (mxClient.IS_IE)
		{
			div.style.height = (this.sidebarTitleSize + 12) + 'px';
		}

		div.style.paddingTop = '4px';
		mxUtils.write(div, title);
		parent.appendChild(div);
	}

	return bounds;
};

/**
 * Creates and returns a new palette item for the given image.
 */
Sidebar.prototype.createItem = function(cells, title, showLabel, showTitle, width, height, allowCellsInserted)
{
    //左侧图元展现形式调整
	var border = (mxClient.IS_QUIRKS) ? 8 + 2 * this.thumbPadding : 2 * this.thumbBorder;
	
	var tab = document.createElement('div');
	tab.className = 'use-mock-table';
	
	var elt = document.createElement('div');
	//elt.setAttribute('href', 'javascript:void(0);');
	elt.className = 'geItem';
	elt.style.overflow = 'hidden';
	elt.style.width = (this.thumbWidth + border) + 'px';
	elt.style.height = (this.thumbHeight + border) + 'px';
	elt.style.padding = this.thumbPadding + 'px';
	elt.style.display = 'table-cell';
	
	var div = document.createElement("div");
	div.style.height = (this.thumbHeight + border) + 'px';
	//div.style.display = 'table-cell';
	div.style.display = 'block';
	div.style.lineHeight = '38px';
	div.style.border = '1px solid';
	div.innerHTML = title;
	
	var clear = document.createElement("div");
	clear.style.height = '1px';
	clear.style.width = '100%';
	
	tab.appendChild(elt);
	tab.appendChild(div);
	tab.appendChild(clear);
	
	if (mxClient.IS_IE6)
	{
		elt.style.border = 'none';
	}
	
	// Blocks default click action
	mxEvent.addListener(elt, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});

	this.createThumb(cells, this.thumbWidth, this.thumbHeight, elt, title, showLabel, showTitle, width, height);
	var bounds = new mxRectangle(0, 0, width, height);
	
	if (cells.length > 1 || cells[0].vertex)
	{
		var ds = this.createDragSource(elt, this.createDropHandler(cells, true, allowCellsInserted,
			bounds), this.createDragPreview(width, height), cells, bounds);
		this.addClickHandler(elt, ds, cells);

		// Uses guides for vertices only if enabled in graph
		ds.isGuidesEnabled = mxUtils.bind(this, function()
		{
			return this.editorUi.editor.graph.graphHandler.guidesEnabled;
		});
	}
	else if (cells[0] != null && cells[0].edge)
	{
		var ds = this.createDragSource(elt, this.createDropHandler(cells, false, allowCellsInserted,
			bounds), this.createDragPreview(width, height), cells, bounds);
		this.addClickHandler(elt, ds, cells);
	}
	
	// Shows a tooltip with the rendered cell
	if (!mxClient.IS_IOS)
	{
		mxEvent.addGestureListeners(elt, null, mxUtils.bind(this, function(evt)
		{
			if (mxEvent.isMouseEvent(evt))
			{
				this.showTooltip(elt, cells, bounds.width, bounds.height, title, showLabel);
			}
		}));
	}
	
	return tab;
};
/*
Sidebar.prototype.createPItem = function(cells, title, showLabel, showTitle, width, height, recordId, tableName, allowCellsInserted)
{
	var elt = document.createElement('a');
	elt.setAttribute('href', 'javascript:void(0);');
	elt.className = 'geItem';
	elt.style.overflow = 'hidden';
	var border = (mxClient.IS_QUIRKS) ? 8 + 2 * this.thumbPadding : 2 * this.thumbBorder;
	elt.style.width = (this.thumbWidth + border) + 'px';
	elt.style.height = (this.thumbHeight + border) + 'px';
	elt.style.padding = this.thumbPadding + 'px';
	//elt.style.display='block';
	if (mxClient.IS_IE6)
	{
		elt.style.border = 'none';
	}
	
	// Blocks default click action
	mxEvent.addListener(elt, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});
	
	this.createThumb(cells, this.thumbWidth, this.thumbHeight, elt, title, showLabel, showTitle, width, height);
	var bounds = new mxRectangle(0, 0, width, height);
	
	if (cells.length > 1 || cells[0].vertex)
	{
		var ds = this.createDragSource(elt, this.createDropHandler(cells, true, allowCellsInserted,
				bounds), this.createDragPreview(width, height), cells, bounds);
		this.addClickHandler(elt, ds, cells);
		
		// Uses guides for vertices only if enabled in graph
		ds.isGuidesEnabled = mxUtils.bind(this, function()
		{
			return this.editorUi.editor.graph.graphHandler.guidesEnabled;
		});
	}
	else if (cells[0] != null && cells[0].edge)
	{
		var ds = this.createDragSource(elt, this.createDropHandler(cells, false, allowCellsInserted,
				bounds), this.createDragPreview(width, height), cells, bounds);
		this.addClickHandler(elt, ds, cells);
	}
	
	// Shows a tooltip with the rendered cell
	if (!mxClient.IS_IOS)
	{
		mxEvent.addGestureListeners(elt, null, mxUtils.bind(this, function(evt)
				{
			if (mxEvent.isMouseEvent(evt))
			{
				this.showTooltip(elt, cells, bounds.width, bounds.height, title, showLabel);
			}
				}));
	}
	
	return elt;
};*/

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.updateShapes = function(source, targets)
{
	var graph = this.editorUi.editor.graph;
	var sourceCellStyle = graph.getCellStyle(source);
	var result = [];
	
	graph.model.beginUpdate();
	try
	{
		var cellStyle = graph.getModel().getStyle(source);

		// Lists the styles to carry over from the existing shape
		var styles = ['shadow', 'dashed', 'dashPattern', 'fontFamily', 'fontSize', 'fontColor', 'align', 'startFill',
		              'startSize', 'endFill', 'endSize', 'strokeColor', 'strokeWidth', 'fillColor', 'gradientColor',
		              'html', 'part', 'noEdgeStyle', 'edgeStyle', 'elbow', 'childLayout'];
		
		for (var i = 0; i < targets.length; i++)
		{
			var targetCell = targets[i];
			
			if ((graph.getModel().isVertex(targetCell) == graph.getModel().isVertex(source)) ||
				(graph.getModel().isEdge(targetCell) == graph.getModel().isEdge(source)))
			{
				var state = graph.view.getState(targetCell);
				var style = (state != null) ? state.style : graph.getCellStyle(targets[i]);
				graph.getModel().setStyle(targetCell, cellStyle);
				
				// Removes all children of composite cells
				if (state != null && mxUtils.getValue(state.style, 'composite', '0') == '1')
				{
					var childCount = graph.model.getChildCount(targetCell);
					
					for (var j = childCount; j >= 0; j--)
					{
						graph.model.remove(graph.model.getChildAt(targetCell, j));
					}
				}

				if (style != null)
				{
					// Replaces the participant style in the lifeline shape with
					// the target shape
					if (style[mxConstants.STYLE_SHAPE] == 'umlLifeline' &&
						sourceCellStyle[mxConstants.STYLE_SHAPE] != 'umlLifeline')
					{
						graph.setCellStyles(mxConstants.STYLE_SHAPE, 'umlLifeline', [targetCell]);
						graph.setCellStyles('participant', sourceCellStyle[mxConstants.STYLE_SHAPE], [targetCell]);
					}
					
					for (var j = 0; j < styles.length; j++)
					{
						var value = style[styles[j]];
						
						if (value != null)
						{
							graph.setCellStyles(styles[j], value, [targetCell]);
						}
					}
				}
				
				result.push(targetCell);
			}
		}
	}
	finally
	{
		graph.model.endUpdate();
	}
	
	return result;
};

/**
 * Creates a drop handler for inserting the given cells.
 * 拖动图元到主页面，拖动完成后触发的事件。将组件添加到主页面
 */
Sidebar.prototype.createDropHandler = function(cells, allowSplit, allowCellsInserted, bounds)
{
	allowCellsInserted = (allowCellsInserted != null) ? allowCellsInserted : true;
	
	return mxUtils.bind(this, function(graph, evt, target, x, y)
	{
		if (graph.isEnabled())
		{
			cells = graph.getImportableCells(cells);
			
			if (cells.length > 0)
			{
				graph.stopEditing();
				
				// Holding alt while mouse is released ignores drop target
				var validDropTarget = (target != null && !mxEvent.isAltDown(evt)) ?
					graph.isValidDropTarget(target, cells, evt) : false;
				var select = null;

				if (target != null && !validDropTarget)
				{
					target = null;
				}
				
				if (!graph.isCellLocked(target || graph.getDefaultParent()))
				{
					graph.model.beginUpdate();
					try
					{
						x = Math.round(x);
						y = Math.round(y);
						
						// Splits the target edge or inserts into target group
						if (allowSplit && graph.isSplitTarget(target, cells, evt))
						{
							var clones = graph.cloneCells(cells);
							graph.splitEdge(target, clones, null,x - bounds.width / 2, y - bounds.height / 2);
							select = clones;
						}
						else if (cells.length > 0)
						{
							select = graph.importCells(cells, x, y, target);
						}
						
						// Executes parent layout hooks for position/order
						if (graph.layoutManager != null)
						{
							var layout = graph.layoutManager.getLayout(target);
							
							if (layout != null)
							{
								var s = graph.view.scale;
								var tr = graph.view.translate;
								var tx = (x + tr.x) * s;
								var ty = (y + tr.y) * s;
								
								for (var i = 0; i < select.length; i++)
								{
									layout.moveCell(select[i], tx, ty);
								}
							}
						}
	
						if (allowCellsInserted)
						{
							graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
						}
					}
					finally
					{
						graph.model.endUpdate();
					}
	
					if (select != null && select.length > 0)
					{
						graph.scrollCellToVisible(select[0]);
						graph.setSelectionCells(select);
					}
				}
			}
			
			mxEvent.consume(evt);
		}
	});
};

/**
 * Creates and returns a preview element for the given width and height.
 * 生成拖动图元时显示的虚框
 */
Sidebar.prototype.createDragPreview = function(width, height)
{
	var elt = document.createElement('div');
	elt.style.border = '1px dashed black';
	elt.style.width = width + 'px';
	elt.style.height = height + 'px';
	
	return elt;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.dropAndConnect = function(source, targets, direction, dropCellIndex)
{
	var geo = this.getDropAndConnectGeometry(source, targets[dropCellIndex], direction, targets);
	
	// Targets without the new edge for selection
	var tmp = [];
	
	if (geo != null)
	{
		var graph = this.editorUi.editor.graph;

		graph.model.beginUpdate();
		try
		{
			var sourceGeo = graph.getCellGeometry(source);
			var geo2 = graph.getCellGeometry(targets[dropCellIndex]);

			// Handles special case where target should be ignored for stack
			// layouts
			var targetParent = graph.model.getParent(source);
			var validLayout = true;
			
			// Ignores parent if it has a stack layout
			if (graph.layoutManager != null)
			{
				var layout = graph.layoutManager.getLayout(targetParent);
			
				// LATER: Use parent of parent if valid layout
				if (layout != null && layout.constructor == mxStackLayout)
				{
					validLayout = false;

					var tmp = graph.view.getState(targetParent);
					
					// Offsets by parent position
					if (tmp != null)
					{
						var offset = new mxPoint((tmp.x / graph.view.scale - graph.view.translate.x),
								(tmp.y / graph.view.scale - graph.view.translate.y));
						geo.x += offset.x;
						geo.y += offset.y;
						var pt = geo.getTerminalPoint(false);
						
						if (pt != null)
						{
							pt.x += offset.x;
							pt.y += offset.y;
						}
					}
				}
			}
			
			var dx = geo2.x;
			var dy = geo2.y;
			
			// Ignores geometry of edges
			if (graph.model.isEdge(targets[dropCellIndex]))
			{
				dx = 0;
				dy = 0;
			}
			
			var useParent = graph.model.isEdge(source) || (sourceGeo != null && !sourceGeo.relative && validLayout);
			targets = graph.importCells(targets, (geo.x - (useParent ? dx : 0)),
					(geo.y - (useParent ? dy : 0)), (useParent) ? targetParent : null);
			tmp = targets;
			
			if (graph.model.isEdge(source))
			{
				// Adds new terminal to edge
				// LATER: Push new terminal out radially from edge start point
				graph.model.setTerminal(source, targets[dropCellIndex], direction == mxConstants.DIRECTION_NORTH);
			}
			else if (graph.model.isEdge(targets[dropCellIndex]))
			{
				// Adds new outgoing connection to vertex and clears points
				graph.model.setTerminal(targets[dropCellIndex], source, true);
				var geo3 = graph.getCellGeometry(targets[dropCellIndex]);
				geo3.points = null;
				
				if (geo3.getTerminalPoint(false) != null)
				{
					geo3.setTerminalPoint(geo.getTerminalPoint(false), false);
				}
				else if (useParent && graph.model.isVertex(targetParent))
				{
					// Adds parent offset to other nodes
					var tmpState = graph.view.getState(targetParent);
					var offset = new mxPoint((tmpState.x / graph.view.scale - graph.view.translate.x),
							(tmpState.y / graph.view.scale - graph.view.translate.y));
					graph.cellsMoved(targets, offset.x, offset.y, null, null, true);
				}
			}
			else
			{
				geo2 = graph.getCellGeometry(targets[dropCellIndex]);
				dx = geo.x - Math.round(geo2.x);
				dy = geo.y - Math.round(geo2.y);
				geo.x = Math.round(geo2.x);
				geo.y = Math.round(geo2.y);
				graph.model.setGeometry(targets[dropCellIndex], geo);
				graph.cellsMoved(targets, dx, dy, null, null, true);
				tmp = targets.slice();
				targets.push(graph.insertEdge(null, null, '', source, targets[dropCellIndex],
					graph.createCurrentEdgeStyle()));
			}
			
			graph.fireEvent(new mxEventObject('cellsInserted', 'cells', targets));
		}
		finally
		{
			graph.model.endUpdate();
		}
	}
	
	return tmp;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.getDropAndConnectGeometry = function(source, target, direction, targets)
{
	var graph = this.editorUi.editor.graph;
	var view = graph.view;
	var keepSize = targets.length > 1;
	var geo = graph.getCellGeometry(source);
	var geo2 = graph.getCellGeometry(target);
	
	if (geo != null && geo2 != null)
	{
		geo2 = geo2.clone();

		if (graph.model.isEdge(source))
		{
			var state = graph.view.getState(source);
			var pts = state.absolutePoints;
			var p0 = pts[0];
			var pe = pts[pts.length - 1];
			
			if (direction == mxConstants.DIRECTION_NORTH)
			{
				geo2.x = p0.x / view.scale - view.translate.x - geo2.width / 2;
				geo2.y = p0.y / view.scale - view.translate.y - geo2.height / 2;
			}
			else
			{
				geo2.x = pe.x / view.scale - view.translate.x - geo2.width / 2;
				geo2.y = pe.y / view.scale - view.translate.y - geo2.height / 2;
			}
		}
		else
		{
			if (geo.relative)
			{
				var state = graph.view.getState(source);
				geo = geo.clone();
				geo.x = (state.x - view.translate.x) / view.scale;
				geo.y = (state.y - view.translate.y) / view.scale;
			}
			
			var length = graph.defaultEdgeLength;
			
			// Maintains edge length
			if (graph.model.isEdge(target) && geo2.getTerminalPoint(true) != null && geo2.getTerminalPoint(false) != null)
			{
				var p0 = geo2.getTerminalPoint(true);
				var pe = geo2.getTerminalPoint(false);
				var dx = pe.x - p0.x;
				var dy = pe.y - p0.y;
				
				length = Math.sqrt(dx * dx + dy * dy);
				
				geo2.x = geo.getCenterX();
				geo2.y = geo.getCenterY();
				geo2.width = 1;
				geo2.height = 1;
				
				if (direction == mxConstants.DIRECTION_NORTH)
				{
					geo2.height = length
					geo2.y = geo.y - length;
					geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y), false);
				}
				else if (direction == mxConstants.DIRECTION_EAST)
				{
					geo2.width = length
					geo2.x = geo.x + geo.width;
					geo2.setTerminalPoint(new mxPoint(geo2.x + geo2.width, geo2.y), false);
				}
				else if (direction == mxConstants.DIRECTION_SOUTH)
				{
					geo2.height = length
					geo2.y = geo.y + geo.height;
					geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y + geo2.height), false);
				}
				else if (direction == mxConstants.DIRECTION_WEST)
				{
					geo2.width = length
					geo2.x = geo.x - length;
					geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y), false);
				}
			}
			else
			{
				// Try match size or ignore if width or height < 45 which
				// is considered special enough to be ignored here
				if (!keepSize && geo2.width > 45 && geo2.height > 45 &&
					geo.width > 45 && geo.height > 45)
				{
					geo2.width = geo2.width * (geo.height / geo2.height);
					geo2.height = geo.height;
				}
	
				geo2.x = geo.x + geo.width / 2 - geo2.width / 2;
				geo2.y = geo.y + geo.height / 2 - geo2.height / 2;

				if (direction == mxConstants.DIRECTION_NORTH)
				{
					geo2.y = geo2.y - geo.height / 2 - geo2.height / 2 - length;
				}
				else if (direction == mxConstants.DIRECTION_EAST)
				{
					geo2.x = geo2.x + geo.width / 2 + geo2.width / 2 + length;
				}
				else if (direction == mxConstants.DIRECTION_SOUTH)
				{
					geo2.y = geo2.y + geo.height / 2 + geo2.height / 2 + length;
				}
				else if (direction == mxConstants.DIRECTION_WEST)
				{
					geo2.x = geo2.x - geo.width / 2 - geo2.width / 2 - length;
				}
				
				// Adds offset to match cells without connecting edge
				if (graph.model.isEdge(target) && geo2.getTerminalPoint(true) != null && target.getTerminal(false) != null)
				{
					var targetGeo = graph.getCellGeometry(target.getTerminal(false));
					
					if (targetGeo != null)
					{
						if (direction == mxConstants.DIRECTION_NORTH)
						{
							geo2.x -= targetGeo.getCenterX();
							geo2.y -= targetGeo.getCenterY() + targetGeo.height / 2;
						}
						else if (direction == mxConstants.DIRECTION_EAST)
						{
							geo2.x -= targetGeo.getCenterX() - targetGeo.width / 2;
							geo2.y -= targetGeo.getCenterY();
						}
						else if (direction == mxConstants.DIRECTION_SOUTH)
						{
							geo2.x -= targetGeo.getCenterX();
							geo2.y -= targetGeo.getCenterY() - targetGeo.height / 2;
						}
						else if (direction == mxConstants.DIRECTION_WEST)
						{
							geo2.x -= targetGeo.getCenterX() + targetGeo.width / 2;
							geo2.y -= targetGeo.getCenterY();
						}
					}
				}
			}
		}
	}
	
	return geo2;
};

/**
 * Creates a drag source for the given element.为给定的元素创建一个拖放源
 */
Sidebar.prototype.createDragSource = function(elt, dropHandler, preview, cells, bounds)
{
	// Checks if the cells contain any vertices
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var freeSourceEdge = null;
	var firstVertex = null;
	var sidebar = this;
	
	for (var i = 0; i < cells.length; i++)
	{
		if (firstVertex == null && this.editorUi.editor.graph.model.isVertex(cells[i]))
		{
			firstVertex = i;
		}
		else if (freeSourceEdge == null && this.editorUi.editor.graph.model.isEdge(cells[i]) &&
				this.editorUi.editor.graph.model.getTerminal(cells[i], true) == null)
		{
			freeSourceEdge = i;
		}
		
		if (firstVertex != null && freeSourceEdge != null)
		{
			break;
		}
	}
	
	var dragSource = mxUtils.makeDraggable(elt, this.editorUi.editor.graph, mxUtils.bind(this, function(graph, evt, target, x, y)
	{
		if (this.updateThread != null)
		{
			window.clearTimeout(this.updateThread);
		}
		
		if (cells != null && currentStyleTarget != null && activeArrow == styleTarget)
		{
			var tmp = graph.isCellSelected(currentStyleTarget.cell) ? graph.getSelectionCells() : [currentStyleTarget.cell];
			var updatedCells = this.updateShapes((graph.model.isEdge(currentStyleTarget.cell)) ? cells[0] : cells[firstVertex], tmp);
			graph.setSelectionCells(updatedCells);
		}
		else if (cells != null && activeArrow != null && currentTargetState != null && activeArrow != styleTarget)
		{
			var index = (graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null) ? firstVertex : freeSourceEdge;
			graph.setSelectionCells(this.dropAndConnect(currentTargetState.cell, cells, direction, index));
		}
		else
		{
			dropHandler.apply(this, arguments);
		}
		
		if (this.editorUi.hoverIcons != null)
		{
			this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
		}
	}),
	preview, 0, 0, this.editorUi.editor.graph.autoscroll, true, true);
	
	// Stops dragging if cancel is pressed 如果按下esc键则停止拖动
	this.editorUi.editor.graph.addListener(mxEvent.ESCAPE, function(sender, evt)
	{
		if (dragSource.isActive())
		{
			dragSource.reset();
		}
	});

	// Overrides mouseDown to ignore popup triggers
	var mouseDown = dragSource.mouseDown;
	
	dragSource.mouseDown = function(evt)
	{
		if (!mxEvent.isPopupTrigger(evt) && !mxEvent.isMultiTouchEvent(evt))
		{
			graph.stopEditing();
			mouseDown.apply(this, arguments);
		}
	};

	// Workaround for event redirection via image tag in quirks and IE8 ； 使用图片生成三角
	function createArrow(img, tooltip)
	{
		var arrow = null;
		
		if (mxClient.IS_IE && !mxClient.IS_SVG)
		{
			// Workaround for PNG images in IE6；IE6非标准兼容模式的解决方法
			if (mxClient.IS_IE6 && document.compatMode != 'CSS1Compat')
			{
				arrow = document.createElement(mxClient.VML_PREFIX + ':image');
				arrow.setAttribute('src', img.src);
				arrow.style.borderStyle = 'none';
			}
			else
			{
				arrow = document.createElement('div');
				arrow.style.backgroundImage = 'url(' + img.src + ')';
				arrow.style.backgroundPosition = 'center';
				arrow.style.backgroundRepeat = 'no-repeat';
			}
			
			arrow.style.width = (img.width + 4) + 'px';
			arrow.style.height = (img.height + 4) + 'px';
			arrow.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
		}
		else
		{
			arrow = mxUtils.createImage(img.src);
			arrow.style.width = img.width + 'px';
			arrow.style.height = img.height + 'px';
		}
		
		if (tooltip != null)
		{
			arrow.setAttribute('title', tooltip);
		}
		//设置透明度
		mxUtils.setOpacity(arrow, (img == this.refreshTarget) ? 30 : 20);
		arrow.style.position = 'absolute';
		arrow.style.cursor = 'crosshair';
		
		return arrow;
	};

	var currentTargetState = null;
	var currentStateHandle = null;
	var currentStyleTarget = null;
	var activeTarget = false;
	
	var arrowUp = createArrow(this.triangleUp, mxResources.get('connect'));
	var arrowRight = createArrow(this.triangleRight, mxResources.get('connect'));
	var arrowDown = createArrow(this.triangleDown, mxResources.get('connect'));
	var arrowLeft = createArrow(this.triangleLeft, mxResources.get('connect'));
	var styleTarget = createArrow(this.refreshTarget, mxResources.get('replace'));
	// Workaround for actual parentNode not being updated in old IE
	var styleTargetParent = null;
	var roundSource = createArrow(this.roundDrop);
	var roundTarget = createArrow(this.roundDrop);
	var direction = mxConstants.DIRECTION_NORTH;
	var activeArrow = null;
	
	//通过判断x,y坐标是否在bounds范围内来设置arrow的透明度
	function checkArrow(x, y, bounds, arrow)
	{
		if (arrow.parentNode != null)
		{
			if (mxUtils.contains(bounds, x, y))
			{
				mxUtils.setOpacity(arrow, 100);
				activeArrow = arrow;
			}
			else
			{
				mxUtils.setOpacity(arrow, (arrow == styleTarget) ? 30 : 20);
			}
		}
		
		return bounds;
	};
	
	// Hides guides and preview if target is active
	var dsCreatePreviewElement = dragSource.createPreviewElement;
	
	// Stores initial size of preview element
	dragSource.createPreviewElement = function(graph)
	{
		var elt = dsCreatePreviewElement.apply(this, arguments);
		
		// Pass-through events required to tooltip on replace shape
		if (mxClient.IS_SVG)
		{
			elt.style.pointerEvents = 'none';
		}
		
		this.previewElementWidth = elt.style.width;
		this.previewElementHeight = elt.style.height;
		
		return elt;
	};
	
	// Shows/hides hover icons；显/隐悬停图标
	var dragEnter = dragSource.dragEnter;
	dragSource.dragEnter = function(graph, evt)
	{
		if (ui.hoverIcons != null)
		{
			ui.hoverIcons.setDisplay('none');
		}
		
		dragEnter.apply(this, arguments);
	};
    //拖动离开？
	var dragExit = dragSource.dragExit;
	dragSource.dragExit = function(graph, evt)
	{
		if (ui.hoverIcons != null)
		{
			ui.hoverIcons.setDisplay('');
		}
		
		dragExit.apply(this, arguments);
	};
	//拖动完成？
	dragSource.dragOver = function(graph, evt)
	{
		mxDragSource.prototype.dragOver.apply(this, arguments);

		if (this.currentGuide != null && activeArrow != null)
		{
			this.currentGuide.hide();
		}

		if (this.previewElement != null)
		{
			var view = graph.view;
			
			if (currentStyleTarget != null && activeArrow == styleTarget)
			{
				this.previewElement.style.display = (graph.model.isEdge(currentStyleTarget.cell)) ? 'none' : '';
				
				this.previewElement.style.left = currentStyleTarget.x + 'px';
				this.previewElement.style.top = currentStyleTarget.y + 'px';
				this.previewElement.style.width = currentStyleTarget.width + 'px';
				this.previewElement.style.height = currentStyleTarget.height + 'px';
			}
			else if (currentTargetState != null && activeArrow != null)
			{
				var index = (graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null) ? firstVertex : freeSourceEdge;
				var geo = sidebar.getDropAndConnectGeometry(currentTargetState.cell, cells[index], direction, cells);
				var geo2 = (!graph.model.isEdge(currentTargetState.cell)) ? graph.getCellGeometry(currentTargetState.cell) : null;
				var geo3 = graph.getCellGeometry(cells[index]);
				var parent = graph.model.getParent(currentTargetState.cell);
				var dx = view.translate.x * view.scale;
				var dy = view.translate.y * view.scale;
				
				if (geo2 != null && !geo2.relative && graph.model.isVertex(parent))
				{
					var pState = view.getState(parent);
					dx = pState.x;
					dy = pState.y;
				}
				
				var dx2 = geo3.x;
				var dy2 = geo3.y;

				// Ignores geometry of edges
				if (graph.model.isEdge(cells[index]))
				{
					dx2 = 0;
					dy2 = 0;
				}
				
				// Shows preview at drop location
				this.previewElement.style.left = ((geo.x - dx2) * view.scale + dx) + 'px';
				this.previewElement.style.top = ((geo.y - dy2) * view.scale + dy) + 'px';
				
				if (cells.length == 1)
				{
					this.previewElement.style.width = (geo.width * view.scale) + 'px';
					this.previewElement.style.height = (geo.height * view.scale) + 'px';
				}
				
				this.previewElement.style.display = '';
			}
			else if (dragSource.currentHighlight.state != null &&
				graph.model.isEdge(dragSource.currentHighlight.state.cell))
			{
				// Centers drop cells when splitting edges
				this.previewElement.style.left = Math.round(parseInt(this.previewElement.style.left) -
					bounds.width * view.scale / 2) + 'px';
				this.previewElement.style.top = Math.round(parseInt(this.previewElement.style.top) -
					bounds.height * view.scale / 2) + 'px';
			}
			else
			{
				this.previewElement.style.width = this.previewElementWidth;
				this.previewElement.style.height = this.previewElementHeight;
				this.previewElement.style.display = '';
			}
		}
	};
	
	var startTime = new Date().getTime();
	var timeOnTarget = 0;
	var prev = null;
	
	// Gets source cell style to compare shape below
	var sourceCellStyle = this.editorUi.editor.graph.getCellStyle(cells[0]);
	
	// Allows drop into cell only if target is a valid root
	dragSource.getDropTarget = mxUtils.bind(this, function(graph, x, y, evt)
	{
		// Alt means no targets at all
		// LATER: Show preview where result will go
		var cell = (!mxEvent.isAltDown(evt) && cells != null) ? graph.getCellAt(x, y) : null;
		
		// Uses connectable parent vertex if one exists；如果父节点存在，则采用父节点的连接点？？
		if (cell != null && !this.graph.isCellConnectable(cell))
		{
			var parent = this.graph.getModel().getParent(cell);
			
			if (this.graph.getModel().isVertex(parent) && this.graph.isCellConnectable(parent))
			{
				cell = parent;
			}
		}
		
		// Ignores locked cells
		if (graph.isCellLocked(cell))
		{
			cell = null;
		}
		
		var state = graph.view.getState(cell);
		activeArrow = null;
		var bbox = null;

		// Time on target
		if (prev != state)
		{
			prev = state;
			startTime = new Date().getTime();
			timeOnTarget = 0;

			if (this.updateThread != null)
			{
				window.clearTimeout(this.updateThread);
			}
			
			if (state != null)
			{
				this.updateThread = window.setTimeout(function()
				{
					if (activeArrow == null)
					{
						prev = state;
						dragSource.getDropTarget(graph, x, y, evt);
					}
				}, this.dropTargetDelay + 10);
			}
		}
		else
		{
			timeOnTarget = new Date().getTime() - startTime;
		}

		// Shift means disabled, delayed on cells with children, shows after
		// this.dropTargetDelay, hides after 2500ms
		if (timeOnTarget < 2500 && state != null && !mxEvent.isShiftDown(evt) &&
			// If shape is equal or target has no stroke then add long delay
			// except for images
			(((mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE) != mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE) &&
			mxUtils.getValue(state.style, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE) != mxConstants.NONE) ||
			mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE) == 'image') ||
			timeOnTarget > 1500 || graph.model.isEdge(state.cell)) && (timeOnTarget > this.dropTargetDelay) && 
			((graph.model.isVertex(state.cell) && firstVertex != null) ||(graph.model.isEdge(state.cell) && graph.model.isEdge(cells[0])))
			)
		{
			currentStyleTarget = state;
			var tmp = (graph.model.isEdge(state.cell)) ? graph.view.getPoint(state) :new mxPoint(state.getCenterX(), state.getCenterY());
			tmp = new mxRectangle(tmp.x - this.refreshTarget.width / 2, tmp.y - this.refreshTarget.height / 2,this.refreshTarget.width, this.refreshTarget.height);
			
			styleTarget.style.left = Math.floor(tmp.x) + 'px';
			styleTarget.style.top = Math.floor(tmp.y) + 'px';
			
			if (styleTargetParent == null)
			{
				graph.container.appendChild(styleTarget);
				styleTargetParent = styleTarget.parentNode;
			}
			
			checkArrow(x, y, tmp, styleTarget);
		}
		// Does not reset on ignored edges
		else if (currentStyleTarget == null || !mxUtils.contains(currentStyleTarget, x, y) ||
			(timeOnTarget > 1500 && !mxEvent.isShiftDown(evt)))
		{
			currentStyleTarget = null;
			
			if (styleTargetParent != null)
			{
				styleTarget.parentNode.removeChild(styleTarget);
				styleTargetParent = null;
			}
		}
		else if (currentStyleTarget != null && styleTargetParent != null)
		{
			// Sets active Arrow as side effect
			var tmp = (graph.model.isEdge(currentStyleTarget.cell)) ? graph.view.getPoint(currentStyleTarget) : new mxPoint(currentStyleTarget.getCenterX(), currentStyleTarget.getCenterY());
			tmp = new mxRectangle(tmp.x - this.refreshTarget.width / 2, tmp.y - this.refreshTarget.height / 2,
				this.refreshTarget.width, this.refreshTarget.height);
			checkArrow(x, y, tmp, styleTarget);
		}
		
		// Checks if inside bounds
		if (activeTarget && currentTargetState != null && !mxEvent.isAltDown(evt) && activeArrow == null)
		{
			// LATER: Use hit-detection for edges
			bbox = mxRectangle.fromRectangle(currentTargetState);
			
			if (graph.model.isEdge(currentTargetState.cell))
			{
				var pts = currentTargetState.absolutePoints;
				
				if (roundSource.parentNode != null)
				{
					var p0 = pts[0];
					bbox.add(checkArrow(x, y, new mxRectangle(p0.x - this.roundDrop.width / 2,
						p0.y - this.roundDrop.height / 2, this.roundDrop.width, this.roundDrop.height), roundSource));
				}
				
				if (roundTarget.parentNode != null)
				{
					var pe = pts[pts.length - 1];
					bbox.add(checkArrow(x, y, new mxRectangle(pe.x - this.roundDrop.width / 2,
						pe.y - this.roundDrop.height / 2,
						this.roundDrop.width, this.roundDrop.height), roundTarget));
				}
			}
			else
			{
				var bds = mxRectangle.fromRectangle(currentTargetState);
				
				// Uses outer bounding box to take rotation into account
				if (currentTargetState.shape != null && currentTargetState.shape.boundingBox != null)
				{
					bds = mxRectangle.fromRectangle(currentTargetState.shape.boundingBox);
				}

				bds.grow(this.graph.tolerance);
				bds.grow(HoverIcons.prototype.arrowSpacing);
				
				var handler = this.graph.selectionCellsHandler.getHandler(currentTargetState.cell);
				
				if (handler != null)
				{
					bds.x -= handler.horizontalOffset / 2;
					bds.y -= handler.verticalOffset / 2;
					bds.width += handler.horizontalOffset;
					bds.height += handler.verticalOffset;
					
					// Adds bounding box of rotation handle to avoid overlap
					if (handler.rotationShape != null && handler.rotationShape.node != null &&
						handler.rotationShape.node.style.visibility != 'hidden' &&
						handler.rotationShape.node.style.display != 'none' &&
						handler.rotationShape.boundingBox != null)
					{
						bds.add(handler.rotationShape.boundingBox);
					}
				}
				
				bbox.add(checkArrow(x, y, new mxRectangle(currentTargetState.getCenterX() - this.triangleUp.width / 2,
					bds.y - this.triangleUp.height, this.triangleUp.width, this.triangleUp.height), arrowUp));
				bbox.add(checkArrow(x, y, new mxRectangle(bds.x + bds.width,
					currentTargetState.getCenterY() - this.triangleRight.height / 2,
					this.triangleRight.width, this.triangleRight.height), arrowRight));
				bbox.add(checkArrow(x, y, new mxRectangle(currentTargetState.getCenterX() - this.triangleDown.width / 2,
						bds.y + bds.height, this.triangleDown.width, this.triangleDown.height), arrowDown));
				bbox.add(checkArrow(x, y, new mxRectangle(bds.x - this.triangleLeft.width,
						currentTargetState.getCenterY() - this.triangleLeft.height / 2,
						this.triangleLeft.width, this.triangleLeft.height), arrowLeft));
			}
			
			// Adds tolerance
			if (bbox != null)
			{
				bbox.grow(10);
			}
		}
		
		direction = mxConstants.DIRECTION_NORTH;
		
		if (activeArrow == arrowRight)
		{
			direction = mxConstants.DIRECTION_EAST;
		}
		else if (activeArrow == arrowDown || activeArrow == roundTarget)
		{
			direction = mxConstants.DIRECTION_SOUTH;
		}
		else if (activeArrow == arrowLeft)
		{
			direction = mxConstants.DIRECTION_WEST;
		}
		
		if (currentStyleTarget != null && activeArrow == styleTarget)
		{
			state = currentStyleTarget;
		}

		var validTarget = (firstVertex == null || graph.isCellConnectable(cells[firstVertex])) &&
			((graph.model.isEdge(cell) && firstVertex != null) ||
			(graph.model.isVertex(cell) && graph.isCellConnectable(cell)));
		
		// Drop arrows shown after this.dropTargetDelay, hidden after 5 secs,
		// switches arrows after 500ms
		if ((currentTargetState != null && timeOnTarget >= 5000) ||
			(currentTargetState != state &&
			(bbox == null || !mxUtils.contains(bbox, x, y) ||
			(timeOnTarget > 500 && activeArrow == null && validTarget))))
		{
			activeTarget = false;
			currentTargetState = ((timeOnTarget < 5000 && timeOnTarget > this.dropTargetDelay) || graph.model.isEdge(cell)) ? state : null;

			if (currentTargetState != null && validTarget)
			{
				var elts = [roundSource, roundTarget, arrowUp, arrowRight, arrowDown, arrowLeft];
				
				for (var i = 0; i < elts.length; i++)
				{
					if (elts[i].parentNode != null)
					{
						elts[i].parentNode.removeChild(elts[i]);
					}
				}
				
				if (graph.model.isEdge(cell))
				{
					var pts = state.absolutePoints;
					
					if (pts != null)
					{
						var p0 = pts[0];
						var pe = pts[pts.length - 1];
						var tol = graph.tolerance;
						var box = new mxRectangle(x - tol, y - tol, 2 * tol, 2 * tol);
						
						roundSource.style.left = Math.floor(p0.x - this.roundDrop.width / 2) + 'px';
						roundSource.style.top = Math.floor(p0.y - this.roundDrop.height / 2) + 'px';
						
						roundTarget.style.left = Math.floor(pe.x - this.roundDrop.width / 2) + 'px';
						roundTarget.style.top = Math.floor(pe.y - this.roundDrop.height / 2) + 'px';
						
						if (graph.model.getTerminal(cell, true) == null)
						{
							graph.container.appendChild(roundSource);
						}
						
						if (graph.model.getTerminal(cell, false) == null)
						{
							graph.container.appendChild(roundTarget);
						}
					}
				}
				else
				{
					var bds = mxRectangle.fromRectangle(state);
					
					// Uses outer bounding box to take rotation into account
					if (state.shape != null && state.shape.boundingBox != null)
					{
						bds = mxRectangle.fromRectangle(state.shape.boundingBox);
					}

					bds.grow(this.graph.tolerance);
					bds.grow(HoverIcons.prototype.arrowSpacing);
					
					var handler = this.graph.selectionCellsHandler.getHandler(state.cell);
					
					if (handler != null)
					{
						bds.x -= handler.horizontalOffset / 2;
						bds.y -= handler.verticalOffset / 2;
						bds.width += handler.horizontalOffset;
						bds.height += handler.verticalOffset;
						
						// Adds bounding box of rotation handle to avoid overlap
						if (handler.rotationShape != null && handler.rotationShape.node != null &&
							handler.rotationShape.node.style.visibility != 'hidden' &&
							handler.rotationShape.node.style.display != 'none' &&
							handler.rotationShape.boundingBox != null)
						{
							bds.add(handler.rotationShape.boundingBox);
						}
					}
					
					arrowUp.style.left = Math.floor(state.getCenterX() - this.triangleUp.width / 2) + 'px';
					arrowUp.style.top = Math.floor(bds.y - this.triangleUp.height) + 'px';
					
					arrowRight.style.left = Math.floor(bds.x + bds.width) + 'px';
					arrowRight.style.top = Math.floor(state.getCenterY() - this.triangleRight.height / 2) + 'px';
					
					arrowDown.style.left = arrowUp.style.left
					arrowDown.style.top = Math.floor(bds.y + bds.height) + 'px';
					
					arrowLeft.style.left = Math.floor(bds.x - this.triangleLeft.width) + 'px';
					arrowLeft.style.top = arrowRight.style.top;
					
					if (state.style['portConstraint'] != 'eastwest')
					{
						graph.container.appendChild(arrowUp);
						graph.container.appendChild(arrowDown);
					}

					graph.container.appendChild(arrowRight);
					graph.container.appendChild(arrowLeft);
				}
				
				// Hides handle for cell under mouse
				if (state != null)
				{
					currentStateHandle = graph.selectionCellsHandler.getHandler(state.cell);
					
					if (currentStateHandle != null && currentStateHandle.setHandlesVisible != null)
					{
						currentStateHandle.setHandlesVisible(false);
					}
				}
				
				activeTarget = true;
			}
			else
			{
				var elts = [roundSource, roundTarget, arrowUp, arrowRight, arrowDown, arrowLeft];
				
				for (var i = 0; i < elts.length; i++)
				{
					if (elts[i].parentNode != null)
					{
						elts[i].parentNode.removeChild(elts[i]);
					}
				}
			}
		}

		if (!activeTarget && currentStateHandle != null)
		{
			currentStateHandle.setHandlesVisible(true);
		}
		
		// Handles drop target
		var target = ((!mxEvent.isAltDown(evt) || mxEvent.isShiftDown(evt)) &&
			!(currentStyleTarget != null && activeArrow == styleTarget)) ?
			mxDragSource.prototype.getDropTarget.apply(this, arguments) : null;
		var model = graph.getModel();
		
		if (target != null)
		{
			if (activeArrow != null || !graph.isSplitTarget(target, cells, evt))
			{
				// Selects parent group as drop target
				while (target != null && !graph.isValidDropTarget(target, cells, evt) && model.isVertex(model.getParent(target)))
				{
					target = model.getParent(target);
				}
				
				if (graph.view.currentRoot == target || (!graph.isValidRoot(target) &&
					graph.getModel().getChildCount(target) == 0) ||
					graph.isCellLocked(target) || model.isEdge(target))
				{
					target = null;
				}
			}
		}
		
		return target;
	});
	
	dragSource.stopDrag = function()
	{
		mxDragSource.prototype.stopDrag.apply(this, arguments);
		
		var elts = [roundSource, roundTarget, styleTarget, arrowUp, arrowRight, arrowDown, arrowLeft];
		
		for (var i = 0; i < elts.length; i++)
		{
			if (elts[i].parentNode != null)
			{
				elts[i].parentNode.removeChild(elts[i]);
			}
		}
		
		if (currentTargetState != null && currentStateHandle != null)
		{
			currentStateHandle.reset();
		}
		
		currentStateHandle = null;
		currentTargetState = null;
		currentStyleTarget = null;
		styleTargetParent = null;
		activeArrow = null;
	};
	
	return dragSource;
};

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.itemClicked = function(cells, ds, evt, elt)
{
	var graph = this.editorUi.editor.graph;
	
	// Alt+Click inserts and connects
	if (mxEvent.isAltDown(evt))
	{
		if (graph.getSelectionCount() == 1 && graph.model.isVertex(graph.getSelectionCell()))
		{
			var firstVertex = null;
			
			for (var i = 0; i < cells.length && firstVertex == null; i++)
			{
				if (graph.model.isVertex(cells[i]))
				{
					firstVertex = i;
				}
			}
			
			if (firstVertex != null)
			{
				graph.setSelectionCells(this.dropAndConnect(graph.getSelectionCell(), cells, (mxEvent.isMetaDown(evt) || mxEvent.isControlDown(evt)) ?
					(mxEvent.isShiftDown(evt) ? mxConstants.DIRECTION_WEST : mxConstants.DIRECTION_NORTH) : 
					(mxEvent.isShiftDown(evt) ? mxConstants.DIRECTION_EAST : mxConstants.DIRECTION_SOUTH), firstVertex));
				graph.scrollCellToVisible(graph.getSelectionCell());
			}
		}
	}
	// Shift+Click updates shape
	else if (mxEvent.isShiftDown(evt))
	{
		if (!graph.isSelectionEmpty())
		{
			this.updateShapes(cells[0], graph.getSelectionCells());
			graph.scrollCellToVisible(graph.getSelectionCell());
		}
	}
	else
	{
		var pt = graph.getFreeInsertPoint();
		ds.drop(graph, evt, null, pt.x, pt.y);
		
		if (this.editorUi.hoverIcons != null && (mxEvent.isTouchEvent(evt) || mxEvent.isPenEvent(evt)))
		{
			this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
		}
	}
};

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.addClickHandler = function(elt, ds, cells)
{
	var graph = this.editorUi.editor.graph;
	var oldMouseUp = ds.mouseUp;
	var first = null;
	
	mxEvent.addGestureListeners(elt, function(evt)
	{
		first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
	});
	
	ds.mouseUp = mxUtils.bind(this, function(evt)
	{
		if (!mxEvent.isPopupTrigger(evt) && this.currentGraph == null && first != null)
		{
			var tol = graph.tolerance;
			
			if (Math.abs(first.x - mxEvent.getClientX(evt)) <= tol &&
				Math.abs(first.y - mxEvent.getClientY(evt)) <= tol)
			{
				this.itemClicked(cells, ds, evt, elt);
			}
		}

		oldMouseUp.apply(ds, arguments);
		first = null;
		
		// Blocks tooltips on this element after single click
		this.currentElt = elt;
	});
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateEntry = function(style, width, height, value, title, showLabel, showTitle, tags)
{
	tags = (tags != null && tags.length > 0) ? tags : title.toLowerCase();
	
	return this.addEntry(tags, mxUtils.bind(this, function()
 	{
 		return this.createVertexTemplate(style, width, height, value, title, showLabel, showTitle);
 	}));
}

/*Sidebar.prototype.createPVertexTemplateEntry = function(style, width, height, recordId, tableName, value, title, showLabel, showTitle, tags)
{
	tags = (tags != null && tags.length > 0) ? tags : title.toLowerCase();
	
	return this.addEntry(tags, mxUtils.bind(this, function()
	{
		return this.createPVertexTemplate(style, width, height, recordId, tableName, value, title, showLabel, showTitle);
	}));
}*/

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplate = function(style, width, height, value, title, showLabel, showTitle, allowCellsInserted)
{
	var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
	cells[0].vertex = true;
	
	return this.createVertexTemplateFromCells(cells, width, height, title, showLabel, showTitle, allowCellsInserted);
};

/*Sidebar.prototype.createPVertexTemplate = function(style, width, height, recordId, tableName,  value, title, showLabel, showTitle, allowCellsInserted)
{
	var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
	cells[0].vertex = true;
	
	return this.createPVertexTemplateFromCells(cells, width, height, recordId, tableName, title, showLabel, showTitle, allowCellsInserted);
};*/

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateFromData = function(data, width, height, title, showLabel, showTitle, allowCellsInserted)
{
	var doc = mxUtils.parseXml(this.graph.decompress(data));
	var codec = new mxCodec(doc);

	var model = new mxGraphModel();
	codec.decode(doc.documentElement, model);
	
	var cells = this.graph.cloneCells(model.root.getChildAt(0).children);

	return this.createVertexTemplateFromCells(cells, width, height, title, showLabel, showTitle, allowCellsInserted);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateFromCells = function(cells, width, height, title, showLabel, showTitle, allowCellsInserted)
{
	// Use this line to convert calls to this function with lots of boilerplate
	// code for creating cells
	// console.trace('xml',
	// this.graph.compress(mxUtils.getXml(this.graph.encodeCells(cells))),
	// cells);
	return this.createItem(cells, title, showLabel, showTitle, width, height, allowCellsInserted);
};

/*Sidebar.prototype.createPVertexTemplateFromCells = function(cells, width, height, recordId, tableName, title, showLabel, showTitle, allowCellsInserted)
{
	// Use this line to convert calls to this function with lots of boilerplate
	// code for creating cells
	// console.trace('xml',
	// this.graph.compress(mxUtils.getXml(this.graph.encodeCells(cells))),
	// cells);
	return this.createPItem(cells, title, showLabel, showTitle, width, height, recordId, tableName, allowCellsInserted);
};*/

/**
 * 
 */
Sidebar.prototype.createEdgeTemplateEntry = function(style, width, height, value, title, showLabel, tags, allowCellsInserted)
{
	tags = (tags != null && tags.length > 0) ? tags : title.toLowerCase();
	
 	return this.addEntry(tags, mxUtils.bind(this, function()
 	{
 		return this.createEdgeTemplate(style, width, height, value, title, showLabel, allowCellsInserted);
 	}));
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplate = function(style, width, height, value, title, showLabel, allowCellsInserted)
{
	var cell = new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style);
	cell.geometry.setTerminalPoint(new mxPoint(0, height), true);
	cell.geometry.setTerminalPoint(new mxPoint(width, 0), false);
	cell.geometry.relative = true;
	cell.edge = true;
	
	return this.createEdgeTemplateFromCells([cell], width, height, title, showLabel, allowCellsInserted);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplateFromCells = function(cells, width, height, title, showLabel, allowCellsInserted)
{	
	return this.createItem(cells, title, showLabel, true, width, height, allowCellsInserted);
};

/**
 * Adds the given palette.为左侧工具栏添加元素
 */
Sidebar.prototype.addPaletteFunctions = function(id, title, expanded, fns)
{
	this.addPalette(id, title, expanded, mxUtils.bind(this, function(content)
	{
		for (var i = 0; i < fns.length; i++)
		{
			content.appendChild(fns[i](content));
		}
	}));
};

/**
 * Adds the given palette.为左侧工具栏添加元素
 */
Sidebar.prototype.addPalette = function(id, title, expanded, onInit)
{
	//每个类别的图元的类别名称
	var elt = this.createTitle(title);
	this.container.appendChild(elt);
	//每个类别的图元的显示区域
	var div = document.createElement('div');
	div.className = 'geSidebar';
	
	// Disables built-in pan and zoom in IE10 and later
	if (mxClient.IS_POINTER)
	{
		div.style.touchAction = 'none';
	}
	
	// Shows tooltip if mouse over background
	mxEvent.addListener(div, 'mousemove', mxUtils.bind(this, function(evt)
	{
		if (mxEvent.getSource(evt) == div)
		{
			div.setAttribute('title', mxResources.get('sidebarTooltip'));
		}
		else
		{
			div.removeAttribute('title');
		}
	}));

	if (expanded)
	{
		onInit(div);
		onInit = null;
	}
	else
	{
		div.style.display = 'none';
	}
	
    this.addFoldingHandler(elt, div, onInit);
	
	var outer = document.createElement('div');
    outer.appendChild(div);
    this.container.appendChild(outer);
    
    // Keeps references to the DOM nodes
    if (id != null)
    {
    	this.palettes[id] = [elt, outer];
    }
    
    return div;
};
Sidebar.prototype.addPalettePrestrain = function(id, title, expanded, onInit)
{
    //每个类别的图元的类别名称
    var elt = this.createTitle(title);
    this.container.appendChild(elt);
    //每个类别的图元的显示区域
    var div = document.createElement('div');
    div.className = 'geSidebar';

    // Disables built-in pan and zoom in IE10 and later
    if (mxClient.IS_POINTER)
    {
        div.style.touchAction = 'none';
    }

    // Shows tooltip if mouse over background
    mxEvent.addListener(div, 'mousemove', mxUtils.bind(this, function(evt)
    {
        if (mxEvent.getSource(evt) == div)
        {
            div.setAttribute('title', mxResources.get('sidebarTooltip'));
        }
        else
        {
            div.removeAttribute('title');
        }
    }));

    onInit(div);
    onInit = null;
    if (!expanded)
    {
        div.style.display = 'none';
    }

    this.addFoldingHandler(elt, div, onInit);

    var outer = document.createElement('div');
    outer.appendChild(div);
    this.container.appendChild(outer);

    // Keeps references to the DOM nodes
    if (id != null)
    {
        this.palettes[id] = [elt, outer];
    }

    return div;
};
/**
 * Create the given title element.
 */
Sidebar.prototype.addFoldingHandler = function(title, content, funct)
{
	var initialized = false;

	// Avoids mixed content warning in IE6-8
	if (!mxClient.IS_IE || document.documentMode >= 8)
	{
		title.style.backgroundImage = (content.style.display == 'none') ?
			'url(\'' + this.collapsedImage + '\')' : 'url(\'' + this.expandedImage + '\')';
	}
	
	title.style.backgroundRepeat = 'no-repeat';
	title.style.backgroundPosition = '0% 50%';

	mxEvent.addListener(title, 'click', mxUtils.bind(this, function(evt)
	{
		if (content.style.display == 'none')
		{
			if (!initialized)
			{
				initialized = true;
				
				if (funct != null)
				{
					// Wait cursor does not show up on Mac
					title.style.cursor = 'wait';
					var prev = title.innerHTML;
					title.innerHTML = mxResources.get('loading') + '...';
					
					window.setTimeout(function()
					{
						Editor.prototype.originalNoForeignObject=false;
						mxClient.NO_FO=false;
						var fo = mxClient.NO_FO;
						mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
						funct(content);
						mxClient.NO_FO = fo;
						content.style.display = 'block';
						title.style.cursor = '';
						title.innerHTML = prev;
					}, 0);
				}
				else
				{
					content.style.display = 'block';
				}
			}
			else
			{
				content.style.display = 'block';
			}
			
			title.style.backgroundImage = 'url(\'' + this.expandedImage + '\')';
		}
		else
		{
			title.style.backgroundImage = 'url(\'' + this.collapsedImage + '\')';
			content.style.display = 'none';
		}
		
		mxEvent.consume(evt);
	}));
};

/**
 * Removes the palette for the given ID.
 */
Sidebar.prototype.removePalette = function(id)
{
	var elts = this.palettes[id];
	
	if (elts != null)
	{
		this.palettes[id] = null;
		
		for (var i = 0; i < elts.length; i++)
		{
			this.container.removeChild(elts[i]);
		}
		
		return true;
	}
	
	return false;
};

/**
 * Adds the given image palette.
 */
Sidebar.prototype.addImagePalette = function(id, title, prefix, postfix, items, titles, tags)
{
	var showTitles = titles != null;
	var fns = [];
	
	for (var i = 0; i < items.length; i++)
	{
		(mxUtils.bind(this, function(item, title, tmpTags)
		{
			if (tmpTags == null)
			{
				var slash = item.lastIndexOf('/');
				var dot = item.lastIndexOf('.');
				tmpTags = item.substring((slash >= 0) ? slash + 1 : 0, (dot >= 0) ? dot : item.length).replace(/[-_]/g, ' ');
			}
			
			fns.push(this.createVertexTemplateEntry('image;html=1;labelBackgroundColor=#ffffff;image=' + prefix + item + postfix,
				this.defaultImageWidth, this.defaultImageHeight, '', title, title != null, null, this.filterTags(tmpTags)));
		}))(items[i], (titles != null) ? titles[i] : null, (tags != null) ? tags[items[i]] : null);
	}

	this.addPaletteFunctions(id, title, false, fns);
};

/**
 * Creates the array of tags for the given stencil. Duplicates are allowed and
 * will be filtered out later.
 */
Sidebar.prototype.getTagsForStencil = function(packageName, stencilName, moreTags)
{
	var tags = packageName.split('.');
	
	for (var i = 1; i < tags.length; i++)
	{
		tags[i] = tags[i].replace(/_/g, ' ')
	}
	
	tags.push(stencilName.replace(/_/g, ' '));
	
	if (moreTags != null)
	{
		tags.push(moreTags);
	}
	
	return tags.slice(1, tags.length);
};

/**
 * Adds the given stencil palette.
 */
Sidebar.prototype.addStencilPalette = function(id, title, stencilFile, style, ignore, onInit, scale, tags, customFns)
{
	scale = (scale != null) ? scale : 1;
	
	if (this.addStencilsToIndex)
	{
		// LATER: Handle asynchronous loading dependency
		var fns = [];
		
		if (customFns != null)
		{
			for (var i = 0; i < customFns.length; i++)
			{
				fns.push(customFns[i]);
			}
		}

		mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function(packageName, stencilName, displayName, w, h)
		{
			if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0)
			{
				var tmp = this.getTagsForStencil(packageName, stencilName);
				var tmpTags = (tags != null) ? tags[stencilName] : null;

				if (tmpTags != null)
				{
					tmp.push(tmpTags);
				}
				var style2='shape=' + packageName + stencilName.toLowerCase() + style;
				fns.push(this.createVertexTemplateEntry(style2,
					Math.round(w * scale), Math.round(h * scale), '', stencilName.replace(/_/g, ' '), null, null,
					this.filterTags(tmp.join(' '))));
			}
		}), true, true);

		// this.addPaletteFunctions(id, title, false, fns);
		this.addPaletteFunctions(id, title, false, fns);
	}
	else
	{
		this.addPalette(id, title, false, mxUtils.bind(this, function(content)
	    {
			if (style == null)
			{
				style = '';
			}
			
			if (onInit != null)
			{
				onInit.call(this, content);
			}
			
			if (customFns != null)
			{
				for (var i = 0; i < customFns.length; i++)
				{
					customFns[i](content);
				}
			}

			mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function(packageName, stencilName, displayName, w, h)
			{
				if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0)
				{
					content.appendChild(this.createVertexTemplate('shape=' + packageName + stencilName.toLowerCase() + style,
						Math.round(w * scale), Math.round(h * scale), '', stencilName.replace(/_/g, ' '), true));
				}
			}), true);
	    }));
	}
};

/**
 * Adds the given stencil palette.
 */
Sidebar.prototype.destroy = function()
{
	if (this.graph != null)
	{
		if (this.graph.container != null && this.graph.container.parentNode != null)
		{
			this.graph.container.parentNode.removeChild(this.graph.container);
		}
		
		this.graph.destroy();
		this.graph = null;
	}
	
	if (this.pointerUpHandler != null)
	{
		mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', this.pointerUpHandler);
		this.pointerUpHandler = null;
	}

	if (this.pointerDownHandler != null)
	{
		mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', this.pointerDownHandler);
		this.pointerDownHandler = null;
	}
	
	if (this.pointerMoveHandler != null)
	{
		mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.pointerMoveHandler);
		this.pointerMoveHandler = null;
	}
	
	if (this.pointerOutHandler != null)
	{
		mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerout' : 'mouseout', this.pointerOutHandler);
		this.pointerOutHandler = null;
	}
};



