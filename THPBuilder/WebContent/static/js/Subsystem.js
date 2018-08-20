'use strict';

/*
 * @Author: wugh
 * @Date:   2017-12-10 11:03:31
 */

Subsystem = function(editorUi, name) {
    this.editorUi = editorUi;
    ///this.name=name

}

Subsystem.prototype.setName = function(name,isold) {
            this.name = name;
            if(isold)
                this.oldName=name;
}

/**
 * 获取父cell
 * @Author   wugh
 * @DateTime 2017-12-10T17:10:44+0800
 * @return   {[type]} [description]
 */
Subsystem.prototype.linkPort = null;
Subsystem.prototype.labelPort = null;
Subsystem.prototype.parentCell = function(obj) {
        if ("0" != obj.parent.parent.id)
            return this.parentCell(obj.parent);
        else {
            return obj;
        }
    }

/**
 * 获取cell
 * @Author   wugh
 * @DateTime 2017-12-10T10:07:44+0800
 * @param    {[type]} cells [description]
 * @return   {[type]} [description]
 */
Subsystem.prototype.parentCellList = function(cells, flag) {
        var parent = {} //递归选找父级的cell
        this.linkPort = {};
        this.labelPort = {};
        if (flag == null) {
            if ('undefined' == typeof(_pssSystemCount[this.name])) {
                _pssSystemCount[this.name] = 0;
                // this.name=this.name+'_'+(++_pssSystemCount[this.name])
            } else {
                this.oldName=this.name;
                this.name = this.name + '-' + (++_pssSystemCount[this.name])
            }
        }

        //多选择状态
        for (var i = 0; i < cells.length; i++) {
            tempParent = this.parentCell(cells[i])
            parent[tempParent.id] = tempParent;
        }
        var parentList = [];
        for (var p in parent) {
            //delete this.labelPort[parent[p].value];
            if (!parent[p].edge) {

                for (var i = 0; parent[p].children != null && i < parent[p].children.length; i++) {
                    if (parent[p].children[i].pinn != undefined) {
                        this.linkPort[parent[p].children[i].id] = {};
                    }

                    if (parent[p].children[i].value != '' && parent[p].children[i].pinn != undefined) {
                        if (!(this.labelPort[parent[p].children[i].value] instanceof Array)) {

                            this.labelPort[parent[p].children[i].value] = [];
                        }
                        this.labelPort[parent[p].children[i].value].push(parent[p].children[i]);
                    }
                    if (parent[p].thutype == 'mod' && parent[p].children[i].bg == undefined) {

                        this.linkPort[parent[p].children[i].id] = {};
                        if (!(this.labelPort[parent[p].value + '.' + parent[p].children[i].value] instanceof Array)) {

                            this.labelPort[parent[p].value + '.' + parent[p].children[i].value] = [];
                        }
                        this.labelPort[parent[p].value + '.' + parent[p].children[i].value].push(parent[p].children[i]);
                    }
                }

            }
            if (parent[p].thutype == 'linkMark') {
                _graph.removeCells([parent[p]]);
            } else {
                parentList.push(parent[p]);
            }
            //parentList.push(parent[p]);
        }
        //console.log(this.linkPort);
        return parentList;
    }

/**
 * [校验连通]
 * @Author   wugh
 * @DateTime 2017-12-10T15:37:22+0800
 * @param    {[type]} cells [被选择的cell]
 * @return   {[type]} [返回是否校验成功]
 */
Subsystem.prototype.checkIsConnected = function(cells) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var linkPort = this.linkPort;
    var edges = {};
    var elechilds = {};
    var tempThis = this;
    var findLine;
    //var allCells = graph.model.getChildCells(graph.getDefaultParent());
    //
    var parents = _graph.model.getChildCells(_graph.model.root);
    var allCells = [];
    for (var i = 0; i < parents.length; i++) {
        var tCells = _graph.model.getChildVertices(parents[i]);
        for (var x in tCells) {
            allCells.push(tCells[x]);
        }
    }
    var allLabelPort = {};
    this.externalPort = [];
    for (var i = 0; i < allCells.length; i++) {
        if (!allCells[i].edge && allCells[i].children != undefined) {

            for (var j = 0; j < allCells[i].children.length; j++) {
                if (allCells[i].children[j] != null) {
                    allLabelPort[allCells[i].children[j].value] = (allLabelPort[allCells[i].children[j].value] != null) ? allLabelPort[allCells[i].children[j].value] : [];
                    allLabelPort[allCells[i].children[j].value].push(allCells[i]);
                }
            }

        }
    }

    function findNextCell(edge, indexId) {
        findLine[edge.id] = 1;
        if (edge.source != null && linkPort[edge.source.id] == undefined && !edge.source.edge) {
            linkPort[indexId][edge.source.id] = edge.id
        }
        if (edge.source.edge) {
            if (findLine[edge.source.id] != 1) {
                findNextCell(edge.source, indexId);
            }


        }
        if (edge.target != null && linkPort[edge.target.id] == undefined && !edge.target.edge) {
            linkPort[indexId][edge.target.id] = edge.id
        }
        //if(){}
        if (edge.target && edge.target.edge) {
            if (findLine[edge.target.id] != 1) {
                findNextCell(edge.target, indexId);
            }
        }
        if (edge.edges) {
            for (var i = 0; i < edge.edges.length; i++) {
                if (findLine[edge.edges[i].id] != 1) {
                    var ret = findNextCell(edge.edges[i], indexId);
                }
            }
        }
    }
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].edge) {
            edges[cells[i].id] = cells[i];
        } else if (cells[i].thutype == 'system') {
            if (!graph.model.isVisible(cells[i])) {
                graph.removeCells([cells[i]]);
                continue;
            }
        } else {
            elechilds[cells[i].value] = cells[i];
            for (var j = 0; cells[i].children != null && j < cells[i].children.length; j++) {
                tempChild = cells[i].children[j];
                if (tempChild.edges && tempChild.edges.length > 0) {

                    var edgeLenth = tempChild.edges.length;
                    for (var k = 0; k < edgeLenth; k++) {
                        //linkPort[tempChild.id]=1;
                        this.externalPort.push(tempChild.edges[k].id);
                        findLine = {};
                        var ret = findNextCell(tempChild.edges[k], tempChild.id);
                        ///linkPort[tempChild.id]=ret;
                    }
                } else {
                    if (linkPort[tempChild.id] != undefined) {
                        linkPort[tempChild.id][tempChild.id] = 0;
                    }

                }
            }
        }

    }
    var reNameCells = [];
    graph.model.beginUpdate();
    try {
        for (var tLabel in this.labelPort) {
            var labelObj = this.labelPort[tLabel];
            var tGLP = allLabelPort[tLabel];
            if (labelObj.length == 1) {
                for (var i = 0; i < labelObj.length; i++) {
                    if (linkPort[labelObj[i].id] != undefined) {
                        linkPort[labelObj[i].id][labelObj[i].id] = tLabel;
                    }
                    // labelObj[i].valueChanged(this.name+'.'+labelObj[i].value);
                    // reNameCells.push(labelObj[i]);
                    //graph.getModel().setValue(labelObj[i],this.name+'.'+labelObj[i].value);
                    //graph.labelChanged(labelObj[i],this.name+'.'+labelObj[i].value);
                }
            } else if (tGLP.length == labelObj.length) {
                for (var i = 0; i < labelObj.length; i++) {
                    //if(linkPort[labelObj[i].id].length<1||linkPort[labelObj[i].id]<1){
                    linkPort[labelObj[i].id] = {};
                    //}
                    //graph.labelChanged(labelObj[i],this.name+'.'+labelObj[i].value);
                    //labelObj[i].valueChanged(this.name+'.'+labelObj[i].value);
                    //reNameCells.push(labelObj[i]);
                    //graph.getModel().setValue(labelObj[i],this.name+'.'+labelObj[i].value);
                }
            } else {
                for (var i = 0; i < labelObj.length; i++) {
                    if (linkPort[labelObj[i].id] != undefined) {
                        linkPort[labelObj[i].id][labelObj[i].id] = tLabel;
                    }
                    //labelObj[i].valueChanged(this.name+'.'+labelObj[i].value);
                    //reNameCells.push(labelObj[i]);
                    //graph.getModel().setValue(labelObj[i],this.name+'.'+labelObj[i].value);
                }
            }
        }

        //graph.fireEvent(new mxEventObject(mxEvent.EXECUTE, 'change', reNameCells));
        //graph.fireEvent(new mxEventObject(mxEvent.EXECUTED, 'change', reNameCells));
    } finally {
        graph.model.endUpdate();
    }
    //fireEvent(new mxEventObject(mxEvent.EXECUTED, 'change', change));
}


Subsystem.prototype.findVacantCell = function(flag) {
    if (_runningChart == true) {
        //alert('您还有仿真正在进行中，请先停止当前的仿真再进行操作');
        alert(mxResources.get('simucalculating'));
        return;
    }
    _pssDspgrp_sum = [];
    appendGsp(); //加载示波器
    _rpssEle = {};
    _rpssCtrl = {};
    _rpssMsr = {};
    _rpssMod = {};
    _pssInport = [];
    _pssSwitch = [];
    _moreSimuFile = [];
    var _paramList = {};
    var moreSimuEle = {};
    var moduleFloorObj = {};
    //
    var connection = {};
    //~ return;
    //~ _wndChart.show();
    /*	if (_simuPARAM["_isSet"] == false) {
    		alert('您还没设置仿真参数，请先设置仿真参数');
    		_wndSimuParam.show();return false
    		toastr["info"](mxResources.get('usedef'));
    		saveSimuParam();
    	}*/
    var layerTypes = {};
    for (var rootIndex = 0; rootIndex < 1; rootIndex++) {
        if (_editorUI.currentApp.type != 'ENG') {


            layerTypes[_editorUI.currentApp.name] = [];
            var vts = [];
            var edges = [];
            //解决多图层元件的问题。
            var parents = _graph.model.getChildCells(_editorUI.currentApp.root);
            for (var i = 0; i < parents.length; i++) {
                var parent = _graph.model.getChildVertices(parents[i]);
                var edge = _graph.model.getChildEdges(parents[i]);
                for (var x in parent) {
                    vts.push(parent[x]);
                }
                for (var ekey in edge) {
                    edges.push(edge[ekey]);
                }

            }
            if (_editorUI.currentApp.type == 'moresimu') {
                for (var indx = 0; indx < vts.length; indx++) {
                    moreSimuEle[vts[indx].classname] = {};
                    for (var jndx = 0; jndx < _pssEle[vts[indx].classname]['param'].length; jndx++) {
                        moreSimuEle[vts[indx].classname][_pssEle[vts[indx].classname]['param'][jndx].label] = _pssEle[vts[indx].classname]['param'][jndx].value;
                    }
                    moreSimuEle[vts[indx].classname]['length'] = _pssEle[vts[indx].classname]['param'][jndx - 1].value.length;
                }
                continue;
            }
            var vl = vts.length,
                el = edges.length;

            if (vl < 1) {
                // alert('这是乎是一个空的仿真，请先建立仿真模型后再开始');
                alert(mxResources.get('spacesimu'));
                return false;
            }
            var ioexis = 0;
            var existV = [];
            for (var i = 0; i < vl; i++) {
                existV.push(vts[i].classname ? vts[i].classname : vts[i].value)
                if (vts[i].thutype == 'io') ioexis++;
            }
            if (ioexis > 0) {
                alert(mxResources.get('ismod'));
                return;
            }

            //除一些元件的数据记录，例如用户删除了某个元件，但是其元件记录还在，没有一在删除时删掉其记录，为了避免用户回退时出现问题
            // clear ele
            var angoNum = 0;

            for (var x in _pssEle) {
                if (existV.indexOf(x) >= 0) {
                    _rpssEle[x] = _pssEle[x]; // 这种方式没关系，因为_pssEle和 _rpssEle里的元素基本不发生删减
                    //初始化引脚id
                    for (var pinKey in _rpssEle[x].pin) {
                        _rpssEle[x].pin[pinKey].id = 0;

                    }
                    _rpssEle[x]['layer'] = _editorUI.currentApp.name;
                    for (var indx = 0; indx < _rpssEle[x]['param'].length; indx++) {
                        var value = _rpssEle[x]['param'][indx].value;
                        if (_editorUI.currentApp.type != 'timing' && (!_rpssEle[x]['param'][indx].type || _rpssEle[x]['param'][indx].type == 'num') && isNaN(value) && value != '') {
                            _paramList[value] = _paramList[value] ? _paramList[value] : [];
                            _paramList[value].push(_editorUI.currentApp.name + ' ' + x + ' ' + indx);
                        }
                    }
                }

            }
            // clear ctrl
            for (var x in _pssCtrl) {
                if (existV.indexOf(x) >= 0) {
                    _rpssCtrl[x] = _pssCtrl[x];
                }
            }

            // clear msr
            for (var x in _pssMsr) {
                if (existV.indexOf(x) >= 0)
                    _rpssMsr[x] = _pssMsr[x];

            }
            // clear Mod
            _rpssModId = [];
            _rpssMod = {};
            modnames = [];
            for (var x in _pssMod) {
                //~ console.log( '.-mod.',existV.indexOf(x));
                if (existV.indexOf(x) >= 0) {
                    _rpssModId.push(_pssMod[x]['id']);
                    _rpssMod[x] = _pssMod[x];
                    modnames.push(x);
                    _rpssMod[x]['layer'] = _editorUI.currentApp.name;
                    _rpssMod[x]['layerType'] = _editorUI.currentApp.type ? _editorUI.currentApp.type : 'EMTP';
                    moduleFloorObj[_editorUI.currentApp.name] = moduleFloorObj[_rpssMod[x]['layerType']] ? moduleFloorObj[_rpssMod[x]['layerType']] : {
                        _pssmod: {},
                        _pssModeId: [],
                        _pssModeName: []
                    };
                    moduleFloorObj[_editorUI.currentApp.name]['_pssmod'][x] = _rpssMod[x];
                    moduleFloorObj[_editorUI.currentApp.name]['_pssModeId'].push(_pssMod[x]['id']);
                    moduleFloorObj[_editorUI.currentApp.name]['_pssModeName'].push(x);

                }
                if (x.indexOf('.') > 0) { //当改变了被嵌套的模块内部元件参数时，模块名称含有点号
                    _rpssMod[x] = _pssMod[x];
                }
            }
            // clear Edge 连线没多大影响，没有任何连接的连线就直接删了

            //删线
            // if (edges.length < 1) 可能全部都写在引脚上
            for (var i = 0; i < el; i++) {
                if ((edges[i].edges == null) && (edges[i].source == null || edges[i].target == null)) {
                    _graph.removeCells([edges[i]]);
                }
            }

            //appendGsp(); //加入示波器分组
            _graph.refresh(); // 刷新显示


            _pssNodeMsr = []; //量测系统的节点数组
            _pssGndTMp = [];
            _pssMeters = {};
            //   for (var layerType in layerTypes){
            _pssNode = []; //电气元件的节点数组，默认0的是接地
            _pssNodeCtrl = [
                []
            ]; //控制系统的节点数组，节点号从1开始
            pinGrouping = {};
            try {
                console.time('test genNodeLabel')
                genNodeLabel(0, null, vts, _editorUI.currentApp.root); //用户定义的节点标识，已分开控制系统，量测系统仍然在里面
                console.timeEnd('test genNodeLabel')
                console.time('test genNodeEdge')
                genNodeEdge(0, null, edges, _editorUI.currentApp.root); //连线的节点，已分开控制系统，量测系统仍然在里面，已将地节点写入 thuGndTMp
                console.timeEnd('test genNodeEdge')


            } catch (e) {

                console.log(e)
                toastr["info"](mxResources.get('simuerror'));
                return;

            }
            listPin_a = [];
            // 2016-3-26添加
            //~ mergeNodeCtrl( _pssNodeCtrl );

            //  ---刷新一遍有连接的元件的引脚id
            var _model = new mxGraphModel(_editorUI.currentApp.root)
            var ioEleNode = {},
                ioCtrlNode = {},
                _modNodeId = {};
            var delNode = []; // 记录将来要删掉的io口所在节点
            //
            var n = '',
                tmpv = null,
                pin1 = 0,
                j = 0,
                p = null;
            // 电气元件的
            for (var i = 0; i < _pssNode.length; i++) { // for 1
                var temConnectionPoint = [];
                if (_pssNode[i] == undefined) {
                    _pssNode.splice(i, 1);
                    i--;
                    continue;
                }
                for (j = 0; j < _pssNode[i].length; j++) { //for 2
                    p = _model.getCell(_pssNode[i][j]).parent;
                    n = p.value;
                    pin1 = _model.getCell(_pssNode[i][j]).pinn >> 0;
                    temConnectionPoint.push(n + '.' + (pin1 + 1));
                    connection[n] = (connection[n]) ? connection[n] : {};
                    connection[n][pin1] = temConnectionPoint;
                    if (p.thutype == 'io') {
                        // 纯元件对应io口所在的节点删掉，没有节点号。
                        delNode.push(i);
                        ioEleNode[n] = _pssNode[i]; //将接在io口上的引脚id记录，这里只有ele的
                        //~ console.log( 'is io ',p.value )
                        //~ _rpssEle[n]["pin"][pin1]["id"] = p.value;
                        continue;
                    }
                    if (p.thutype == 'mod') {
                        //  console.log('it is mod', n, _pssNode[i][j]);
                        // 纯元件对应io口所在的节点删掉，没有节点号。
                        //~ delNode.push(i);
                        var mm = _model.getCell(_pssNode[i][j]).value;
                        if (typeof(_modNodeId[n]) != 'object') _modNodeId[n] = {};
                        //~ _modNodeId[n][mm] = _pssNode[i][j]; //将模块的引脚dom id记录
                        _modNodeId[n][mm] = i; //将模块的引脚dom id记录
                        continue;
                    }

                    // 电气元件
                    if (typeof(_rpssEle[n]) != 'undefined' && _rpssEle[n]['thutype'] == 'ele') {
                        temConnectionPoint.push(n + '.' + (pin1 + 1));
                        _rpssEle[n]["pin"][pin1]["id"] = _pssNode[i][j];
                        if (_rpssEle[n].type == -50) {
                            _pssInport[n] = _pssEle[n];
                            //    console.log(n)
                        }
                        if (_rpssEle[n].type == -51) {
                            _pssSwitch[n] = _pssEle[n];
                            // console.log(n)
                        }
                        continue;
                    }
                    if (typeof(_rpssEle[n]) != 'undefined' && _rpssEle[n]['thutype'] == 'timing') {
                        console.log(n);
                        temConnectionPoint.push(n + '.' + (pin1 + 1));
                        _rpssEle[n]["pin"][pin1]["id"] = _pssNode[i][j];
                    }

                    // 量测元件(量测元件的单独了)
                    /*if( typeof( _rpssMsr[n] ) != 'undefined' && _rpssMsr[n]['thutype'] == 'msr' ){
                        _rpssMsr[n]["pin"][pin1]["id"] = _pssNode[i][j];
                        continue;
                    }*/
                } // for 2 end
                //listPin_a.push(temConnectionPoint);
                layerTypes[_editorUI.currentApp.name].push(temConnectionPoint)
            } // for 1 end
            if (moduleFloorObj[_editorUI.currentApp.name]) {
                moduleFloorObj[_editorUI.currentApp.name]['moduleIds'] = _modNodeId;
            }

        } else {
            checkEngCell(rootIndex);
        }
    }
    if (layerTypes['TimeLine'] == undefined) {
        layerTypes['TimeLine'] = [
            [],
            ['START.1'],
            ['END.1']
        ];
        for (var indx = 0; indx < appRoots.length; indx++) {
            if (appRoots[indx].type == 'timing' || appRoots[indx].type == 'moresimu') {
                continue;
            }

            layerTypes['TimeLine'][1].push(appRoots[indx].name + '.1');
            layerTypes['TimeLine'][2].push(appRoots[indx].name + '.2');

        }
        for (var x in _pssEle) {
            if (_pssEle[x].thutype == 'timing') {
                _rpssEle[x] = _pssEle[x]; // 这种方式没关系，因为_pssEle和 _rpssEle里的元素基本不发生删减
                //初始化引脚id
                for (var pinKey in _rpssEle[x].pin) {
                    _rpssEle[x].pin[pinKey].id = 0;

                }
                _rpssEle[x]['layer'] = 'TimeLine';
            }

        }
    }
    //console.log(layerTypes);
    //console.log(connection);
    listPin_a = layerTypes[_editorUI.currentApp.name];
    listComponent_a = connection;
    _editorUI.showDialog(new paramTable(), 860, 450, true, true);
    $('.listcomtable tr:eq(1) td').click();
}


Subsystem.prototype.checkConnected = function() {
    pinGrouping = {};
    var ui = this.editorUi;
    var edgeCon;
}

/**
 * [创建子系统图标]
 * @Author   wugh
 * @DateTime 2017-12-10T15:38:04+0800
 * @return   {[type]} [description]
 */
Subsystem.prototype.createSubSystemIcon = function(updatLayers, flag) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var cells = null;
    var linkPort = this.linkPort
    var createMessage = mxResources.get('error');
    if (updatLayers == null) {
        //20161026
        cells = this.parentCellList(mxUtils.sortCells(graph.getSelectionCells(), true));
    } else {
        cells = this.parentCellList(updatLayers.children, flag);
        //cells=updatLayers.children;
        //this.name=updatLayers.value;
    }



    this.checkIsConnected(cells)
        //	if (this.checkIsConnected(cells))
        //{
    var borderNum = 0;
    //var parent = graph.model.getParent(cells[0]);
    var parent = graph.getDefaultParent();
    // if (parent == null) {
    // 	parent = this.model.getParent(cells[0]);
    // }
    var invert = false;
    var fontColor = (invert) ? '#FFFFFF' : '#000000';
    var strokeColor = (invert) ? '#C0C0C0' : '#000000';
    var fillColor = (invert) ? 'none' : '#FFFFFF';
    var newCell = null;
    var addPortList = {};
    var tempPortList = {};
    var selectCell = null;
    var maxLeft = 0,
        maxRight = 0;
    var edgeLink = {};
    graph.model.beginUpdate();
    try {
        var style = 'verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=' + fillColor;
        var subCell = new mxCell(this.name, new mxGeometry(0, 0, 60, 40 * (parseInt(borderNum / 4) + 1)), style);
        var portStyle = 'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;' +
            'spacingLeft=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor;
        var portCell = new mxCell('1', new mxGeometry(0, 0, 10, 16), portStyle);
        subCell.setConnectable(false);
        portCell.geometry.relative = true;
        var linkPortStyle = 'shape=systemLinkPort;verticalLabelPosition=bottom;';
        var linkPortCell = new mxCell('1', new mxGeometry(0, 0, 30, 15), linkPortStyle);
        linkPortCell.geometry.relative = true;

        var rborderNum = 0;
        var edgeLineX = {};

        //var externalPort
        for (var linkKey in this.linkPort) {
            var tempLink = this.linkPort[linkKey];
            var tempPortCell = null;
            var linkCell = graph.model.getCell(linkKey);
            for (var portKey in tempLink) {
                if (tempPortCell == null && addPortList[tempLink[portKey]] == null) {
                    tempPortCell = portCell.clone();
                    tempPortCell.vertex = "1";
                    tempLinkPort = linkPortCell.clone();
                    tempLinkPort.vertex = 1;
                    tempLinkPort.thutype = 'linkMark';
                    //tempLinkPort.setConnectable(false);

                    var externalEdge = graph.model.getCell(tempLink[portKey]);
                    if (externalEdge == undefined || linkCell.value != '') {
                        tempPortCell.value = tempLink[portKey];
                        //tempPortCell.value = linkCell.value;
                        //tempPortCell.value = linkCell.value.replace(this.name+'.','');
                        //graph.getModel().setValue(linkCell,tempPortCell.value);
                        addPortList[tempLink[portKey]] = tempPortCell.value;

                    } else {
                        if (tempLink[portKey] != '0' && externalEdge.source != null) {
                            if (externalEdge.source.id == portKey) {
                                //externalEdge.target=null;
                                edgeLink[externalEdge.id] = 0;
                            } else {
                                //externalEdge.source=null;
                                edgeLink[externalEdge.id] = 1;
                            }
                        }
                        //linkCell.value=this.name+'.'+'p'+borderNum+rborderNum;
                        //_pssEle[this.parentCell(linkCell).value]['pin'][Number(linkCell.pinn)]['label']=linkCell.value;
                        tempPortCell.value = this.name + '.' + 'p' + borderNum + rborderNum;
                        //graph.getModel().setValue(linkCell,tempPortCell.value);
                        addPortList[tempPortCell.value] = tempPortCell.value;
                        //addPortList[tempLink[portKey]] = tempPortCell.value;
                        //_pssSystem[linkCell.value] = (_pssSystem[linkCell.value] != null) ? _pssSystem[linkCell.value] : [];
                        //_pssSystem[linkCell.value].push(linkCell.id);
                    }
                    if (linkCell.geometry.x == 0) {

                        tempPortCell.geometry.offset = new mxPoint(-portCell.geometry.width, 20 * (borderNum) + 2);
                        borderNum++;
                        edgeLineX[tempLink[portKey]] = borderNum * -1;
                        maxLeft = (maxLeft > tempPortCell.value.length) ? maxLeft : tempPortCell.value.length;

                        //var newLinkPort=graph.importCells([tempLinkPort],linkCell.parent.geometry.x-44, linkCell.parent.geometry.y+22.5, newCell);

                    } else {
                        tempPortCell.geometry.x = 1;
                        tempPortCell.style = 'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;' +
                            'spacingRight=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor;
                        tempPortCell.geometry.offset = new mxPoint(0, 20 * (rborderNum) + 2);
                        rborderNum++;
                        edgeLineX[tempLink[portKey]] = rborderNum * 1;
                        maxRight = (maxRight > tempPortCell.value.length) ? maxRight : tempPortCell.value.length;
                        //tempLinkPort.style = 'shape=systemLinkPort;flipV=0;flipH=1;verticalLabelPosition=bottom;';
                        //var newLinkPort=graph.importCells([tempLinkPort],linkCell.parent.geometry.x+84, linkCell.parent.geometry.y+22.5, newCell);
                    }
                    //newLinkPort[0].value=tempPortCell.value;
                    //graph.insertEdge(newCell, null, null,linkCell, newLinkPort[0],'entryX=2;entryY=0.5;entryPerimeter=1;');
                    tempPortList[tempPortCell.value] = tempLink;
                    tempLink.isExternal = true;
                    tempPortCell.mappingPoint = linkCell.id;
                    subCell.insert(tempPortCell);
                } else {
                    var externalEdge = graph.model.getCell(tempLink[portKey]);
                    if (externalEdge != undefined) {
                        if (tempLink[portKey] != '0' && externalEdge.source != null) {
                            if (externalEdge.source.id == portKey) {
                                //externalEdge.target=null;
                                edgeLink[externalEdge.id] = 0;
                            } else {
                                //externalEdge.source=null;
                                edgeLink[externalEdge.id] = 1;
                            }
                        }
                    }

                }
                //}

            }
        }
        this.borderPoint = addPortList;
        var maxheight = (borderNum > rborderNum) ? borderNum : rborderNum;
        subCell.geometry.height = 20 * maxheight;
        var style = graph.getCellStyle(linkCell);
        var fontSize = style[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE;
        subCell.geometry.width = (maxLeft + maxRight) * fontSize * 0.6 + 20;
        subCell.thutype = 'system';
        subCell.vertex = "1"
            //subCell.mappingPoint = newCell.id;
        subCell.maxLeftBorder = borderNum;
        subCell.maxRightBorder = rborderNum;
    } finally {
        graph.model.endUpdate();
        //toastr["info"](createMessage);
    }
    var tempThis = this;
    if (mxUtils.confirm(mxResources.get('createDefinedSystemDoc'))) {
        // createSystem();
        var opendlg = new editorSubSystemPort(ui, this, subCell, createSystem);
        ui.showDialog(opendlg, 860, 475, true, true);
        //createSystem(this);
    } else {
        createSystem(subCell);
    }


    function createSystem(subCell, changeName) {
        graph.model.beginUpdate();
        try {
            var newCell = updatLayers;
            if (newCell == null) {

                var newCell = graph.addCell(new mxCell(tempThis.name), graph.model.root);
                newCell.isOpen = false;
                newCell.layersType = 'system';
                for (var i = 0; i < cells.length; i++) {
                    graph.addCell(cells[i], newCell);
                }

            } else {
                newCell.value = tempThis.name;
                newCell.layersType = 'system';
            }
            subCell.mappingPoint = newCell.id;
            subCell.editorName = editorName;
            newCell.editorName = editorName;
            if (subCell.isLock) {
                newCell.isLock = true;
                var overlay = new mxCellOverlay(
                    new mxImage('/static/graphEditor/images/unlocked.png', 16, 16),
                    'Overlay tooltip');
                graph.addCellOverlay(subCell, overlay);
            }

            if (changeName != null) {
                for (var tLabel in changeName) {
                    if (tLabel != '') {
                        var labelObj = tempThis.labelPort[tLabel];
                        if (labelObj != undefined) {


                            for (var i = 0; i < labelObj.length; i++) {
                                if (labelObj[i].parent.thutype == 'mod') {
                                    continue;
                                }
                                graph.getModel().setValue(labelObj[i], changeName[tLabel]);
                                if (_pssEle[labelObj[i].parent.value]) {
                                    _pssEle[labelObj[i].parent.value]['pin'][labelObj[i].pinn]['label'] = changeName[tLabel];
                                }

                            }
                        }
                    }

                }
            } else {
                for (var tLabel in tempThis.labelPort) {
                    var labelObj = tempThis.labelPort[tLabel];
                    for (var i = 0; i < labelObj.length; i++) {
                        if (labelObj[i].value.indexOf(tempThis.name + '.') != 0 && addPortList[tLabel] == undefined) {
                            if (labelObj[i].parent.thutype == 'mod') {
                                continue;
                            }
                            graph.getModel().setValue(labelObj[i], tempThis.name + '.' + labelObj[i].value);
                            if (_pssEle[labelObj[i].parent.value]) {
                                _pssEle[labelObj[i].parent.value]['pin'][labelObj[i].pinn]['label'] = tempThis.name + '.' + labelObj[i].value;
                            }
                        }

                    }
                }
            }
            if (!ui.isModule) {


                var mainLayers = _graph.model.getCell(1);

                if (!graph.model.isVisible(mainLayers)) {
                    //20161026
                    if (flag) {
                        var tempMappingCell = [graph.model.getCell(newCell.mappingPoint)];
                        selectCell = graph.importCells([subCell], tempMappingCell[0].geometry.x, tempMappingCell[0].geometry.y, mainLayers);
                        graph.removeCells(tempMappingCell);
                        createMessage = mxResources.get('updasuccess');

                    } else {
                        selectCell = graph.importCells([subCell], cells[0].geometry.x, cells[0].geometry.y, mainLayers);
                        createMessage = mxResources.get('createsuccess');
                    }
                    //_graph.addCell(newSystem,mainLayers);
                    graph.setDefaultParent(parent);
                    graph.model.setVisible(selectCell[0], true);
                    graph.model.setVisible(mainLayers, false);

                } else {
                    //_graph.addCell(newSystem,defParent);
                    if (flag) {
                        var tempMappingCell = [graph.model.getCell(newCell.mappingPoint)];

                        selectCell = graph.importCells([subCell], tempMappingCell[0].geometry.x, tempMappingCell[0].geometry.y, parent);

                        graph.removeCells(tempMappingCell);
                        createMessage = mxResources.get('updasuccess');

                    } else {
                        selectCell = graph.importCells([subCell], cells[0].geometry.x, cells[0].geometry.y, parent);
                        createMessage = mxResources.get('createsuccess');
                    }
                    graph.model.setVisible(selectCell[0], true);
                    graph.model.setVisible(newCell, false);
                }

                var oldEdgeList = [];
                var nextPoint = 0;
                var selectCellChildLength = 0;
                if (selectCell[0].children) {
                    selectCellChildLength = selectCell[0].children.length;
                }
                for (var i = 0; i < selectCellChildLength; i++) {
                    var mappingCell = graph.model.getCell(selectCell[0].children[i].mappingPoint);
                    if (mappingCell.value == '') {
                        graph.getModel().setValue(mappingCell, selectCell[0].children[i].value);
                        _pssEle[mappingCell.parent.value]['pin'][mappingCell.pinn]['label'] = selectCell[0].children[i].value;
                    }

                    if (mappingCell.edges == null) {
                        continue;
                    }
                    var portX = 0;
                    for (var tempKey in tempThis.linkPort[mappingCell.id]) {

                        var tempEdgeId = tempThis.linkPort[mappingCell.id][tempKey];
                        var externalEdge = graph.model.getCell(tempEdgeId);
                        if (externalEdge != undefined) {
                            if (externalEdge.edge) {
                                var newEdge = null;
                                if (oldEdgeList.indexOf(externalEdge.id) == -1) {
                                    oldEdgeList.push(externalEdge.id);
                                }
                                if (edgeLink[externalEdge.id]) {
                                    newEdge = graph.insertEdge(parent, null, null, externalEdge.target, selectCell[0].children[i]);
                                } else {
                                    newEdge = graph.insertEdge(parent, null, null, externalEdge.source, selectCell[0].children[i]);

                                }
                                if (portX == 0) {


                                    if (edgeLineX[externalEdge.id] < 0) {
                                        portX = -10 * (2 + borderNum--);
                                    } else {
                                        portX = selectCell[0].geometry.width + 10 * (2 + rborderNum--);
                                    }
                                }
                                newEdge.geometry.points = [new mxPoint(selectCell[0].geometry.x + portX, selectCell[0].geometry.y)];
                                if (externalEdge.edges) {
                                    for (var j = 0; j < externalEdge.edges.length; j++) {
                                        if (tempThis.externalPort.indexOf(externalEdge.edges[j].id)) {
                                            if (oldEdgeList.indexOf(externalEdge.id) == -1) {
                                                oldEdgeList.push(externalEdge.edges[j].id);
                                            }
                                        } else if (externalEdge.edges[j].source.id == externalEdge.id) {
                                            externalEdge.edges[j].source = newEdge;
                                        } else {
                                            externalEdge.edges[j].target = newEdge;
                                        }
                                    }
                                }

                            }

                        }
                    }
                    nextPoint = i;
                }
                for (var i = 0; i < oldEdgeList.length; i++) {
                    graph.removeCells([graph.model.getCell(oldEdgeList[i])], false);
                }
                newCell.mappingPoint = selectCell[0].id;
                _pssSystem = (_pssSystem instanceof Array) ? {} : _pssSystem
                _pssSystem[selectCell[0].value] = {
                    'id': selectCell[0].id,
                    'sym': _pssSystem[selectCell[0].value] ? _pssSystem[selectCell[0].value].sym : selectCell[0].value,
                    'mid': selectCell[0].id,
                    '_mid': newCell.id
                };

                _pssSystemId[selectCell[0].id] = newCell.id;
            } else {
                (subCell.children) && (selectCellChildLength = subCell.children.length);
                for (var i = 0; i < selectCellChildLength; i++) {
                    var mappingCell = graph.model.getCell(subCell.children[i].mappingPoint);
                    if (mappingCell.value == '') {
                        graph.getModel().setValue(mappingCell, subCell.children[i].value);
                        _pssEle[mappingCell.parent.value]['pin'][mappingCell.pinn]['label'] = subCell.children[i].value;
                    }
                }
                console.log(subCell)
                subCell.mappingPoint = newCell.id;
               
                ui.createModuleCell = subCell;
                if(ui.isModule){
                    saveAsModuleParam();
                }
                createMessage = mxResources.get('updasuccess');
            }
        } finally {
            graph.model.endUpdate();
            toastr["info"](createMessage);

            //graph.refresh();
        }
        // if(ui.isModule){
        // 	
        // }
    }

};

Subsystem.prototype.createSubSystemLayer = function() {

};


Subsystem.prototype.checkConnected = function() {
    pinGrouping = {};
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var tmpEC = [
        []
    ]
    var tmpLN = {}
        //求全局的连接接关系
    pinGrouping = {}
    ui.simuCheck.genNodeLabel(null, ui.currentApp.root, tmpEC, tmpLN, 1);
    ui.simuCheck.genNodeEdge(null, ui.currentApp.root, tmpEC);
    var tmpPG = {};
    $.extend(true, tmpPG, pinGrouping);


    var edges = [],
        vts = [];
    var selectCell = graph.getSelectionCells();
    for (var i = 0; i < selectCell.length; i++) {
        if (selectCell[i].edge) {
            edges.push(selectCell[i]);
        } else {
            vts.push(selectCell[i]);
        }
    }

    //求选择区域的连接接关系
    var temSEC = [
        []
    ]
    var tmpSLN = {}
    pinGrouping = {}
    ui.simuCheck.genNodeLabel(0, vts, temSEC, tmpSLN, 1);
    ui.simuCheck.genNodeEdge(0, edges, temSEC);
    var tmpSPG = {};
    $.extend(true, tmpSPG, pinGrouping);
	getPincCond = function(pin, paramPorxy) {
		if ((pin.cond || 'true') == 'true') {
			return 1;
		}
		var checker = new Function("with(this){ return (" + pin.cond + ");}");
		return checker.call(paramPorxy) ? 1 : 0;
	}
    var tmpSPin = [];
    var tmpPinMCell = {};
    for (var i = 0; i < vts.length; i++) {
        if (_pssEle[vts[i].classname]) {
			var pin = _pssEle[vts[i].classname].pin;
			
            for (var pKey in pin) {
				if(getPincCond(pin[pKey],_pssEle[vts[i].classname].paramProxy)){
					tmpSPin.push(vts[i].classname + '.' + pKey)
                	tmpPinMCell[vts[i].classname + '.' + pKey] = vts[i];
				}
                
            }
        }
    }

    //整理出所有边界的点
    var tmpEPoint = {};

    for (let i = 0; i < tmpSPin.length; i++) {
        if (tmpPG[tmpSPin[i]] != undefined) {
            tmpEPoint[tmpPG[tmpSPin[i]]] = tmpEPoint[tmpPG[tmpSPin[i]]] ? tmpEPoint[tmpPG[tmpSPin[i]]] : [];
            tmpEPoint[tmpPG[tmpSPin[i]]].push(tmpSPin[i]);
        } else {
            //	tmpEPoint.push([tmpSPin[i]]);

            tmpEPoint['t' + i] = [tmpSPin[i]];
        }

    }
    var tmpPoint = {};
    $.extend(true, tmpPoint, tmpEPoint);

    for (let key in tmpEPoint) {
        if (tmpEC[key] != undefined && (tmpEC[key].length > 1 && _.difference(tmpEC[key], tmpPoint[key]).length < 1)) {
            delete tmpPoint[key];
        }
    }


    //生成边界点
    var tmpBorder = {};
    var tmpMapName = {};
    for (var lKey in tmpSLN) {
        let indx = tmpSPG[tmpSLN[lKey][0]];
        if (tmpPoint[indx]) {
            tmpBorder[lKey] = lKey;
            tmpMapName[lKey] = tmpMapName[lKey] ? tmpMapName[lKey] : [];
            $.extend(true, tmpMapName[lKey], tmpPoint[indx]);
            delete tmpPoint[indx];
        }
    }

    for (let key in tmpPoint) {
        if (tmpEC[key]) {
            tmpMapName[tmpPoint[key][0]] = tmpMapName[tmpPoint[key][0]] ? tmpMapName[tmpPoint[key][0]] : [];
            $.extend(true, tmpMapName[tmpPoint[key][0]], tmpPoint[key]);
            tmpBorder[tmpPoint[key][0]] = tmpPoint[key][0];
            delete tmpPoint[key];
        } else {
            tmpBorder[tmpPoint[key][0]] = tmpPoint[key][0];
            delete tmpPoint[key];
        }
    }
    var tmpSlNN = {};
    $.extend(true, tmpSlNN, tmpSLN);
    for (let key in tmpSLN) {
        if (!tmpMapName[key]) {

            tmpMapName[key] = tmpSLN[key];
        } else {
            delete tmpSlNN[key];
        }

    }


    //所有全局多点和线多关系
    var tmpNEdge = {};


    function edgeConnection(parent, mapping, source) {

        let edge = parent.getTerminal(source);
        var edgeStyle = graph.getCellStyle(parent);
        mapping[parent.id] = mapping[parent.id] ? mapping[parent.id] : {};
        if (edge && !edge.edge) {
            var tn = edge.classname + '.' + edgeStyle['sourceName'];
            mapping[parent.id]['sourceName'] = tn;
        }
        var term = parent.getTerminal(!source);
        if (term && !term.edge) {
            var tnt = term.classname + '.' + edgeStyle['targetName'];
            mapping[parent.id]['targetName'] = tnt;
        }
    }
    // for (var i = 0; i < edges.length; i++) {
    // 	edgeConnection(edges[i],tmpNEdge,true);
    // }
    var edges = []
    var parents = graph.model.getChildCells(graph.model.root);
    for (var i = 0; i < parents.length; i++) {
        var edge = graph.model.getChildEdges(parents[i]);
        for (var x = 0; x < edge.length; x++) {
            edges.push(edge[x]);
            edgeConnection(edge[x], tmpNEdge, true);
        }
    }

    // var tmpMapping={};
    // for(let key in tmpNEdge){
    // 	if(tmpNEdge[key].sourceName&&tmpNEdge[key].targetName){

    // 	}else{
    // 		delete tmpNEdge[key];
    // 	}
    // }
    // var tmpEdgeObj={}
    // for (var prop in tmpNEdge) {
    // 	if(tmpNEdge[prop].sourceName){
    // 		if(tmpPG[tmpNEdge[prop].sourceName]!=undefined){
    // 			tmpEdgeObj[tmpPG[tmpNEdge[prop].sourceName]]=tmpEdgeObj[tmpPG[tmpNEdge[prop].sourceName]]?tmpEdgeObj[tmpPG[tmpNEdge[prop].sourceName]]:[];
    // 			tmpEdgeObj[tmpPG[tmpNEdge[prop].sourceName]].push(prop);
    // 		}
    // 	}else if(tmpNEdge[prop].targetName){
    // 		if(tmpPG[tmpNEdge[prop].targetName]!=undefined){
    // 			tmpEdgeObj[tmpPG[tmpNEdge[prop].targetName]]=tmpEdgeObj[tmpPG[tmpNEdge[prop].targetName]]?tmpEdgeObj[tmpPG[tmpNEdge[prop].targetName]]:[];
    // 			tmpEdgeObj[tmpPG[tmpNEdge[prop].targetName]].push(prop);
    // 		}
    // 	}
    // }

    var tmpEdgeObj = {}
    for (var prop in tmpNEdge) {
        if (tmpNEdge[prop].sourceName && tmpSPin.indexOf(tmpNEdge[prop].sourceName) >= 0) {
            if (tmpPG[tmpNEdge[prop].sourceName] != undefined) {
                tmpEdgeObj[tmpPG[tmpNEdge[prop].sourceName]] = tmpEdgeObj[tmpPG[tmpNEdge[prop].sourceName]] ? tmpEdgeObj[tmpPG[tmpNEdge[prop].sourceName]] : [];
                tmpEdgeObj[tmpPG[tmpNEdge[prop].sourceName]].push(prop);
            }
        } else if (tmpNEdge[prop].targetName && tmpSPin.indexOf(tmpNEdge[prop].targetName) >= 0) {
            if (tmpPG[tmpNEdge[prop].targetName] != undefined) {
                tmpEdgeObj[tmpPG[tmpNEdge[prop].targetName]] = tmpEdgeObj[tmpPG[tmpNEdge[prop].targetName]] ? tmpEdgeObj[tmpPG[tmpNEdge[prop].targetName]] : [];
                tmpEdgeObj[tmpPG[tmpNEdge[prop].targetName]].push(prop);
            }
        }
    }



    var tmpINP = [];
    for (var prop in tmpMapName) {
        tmpINP = _.union(true, tmpINP, tmpMapName[prop]);
    }


    this.tmpPinMCell = tmpPinMCell; //引脚对应的cell
    this.labelName = tmpMapName;
    this.labelPort = tmpSlNN;
    this.borderPoint = tmpBorder;
    this.tmpEdgeObj = tmpEdgeObj;
    this.tmpEC = tmpEC;
    this.tmpINP = tmpINP;
    this.tmpPG = tmpPG;
    this.tmpNEdge = tmpNEdge;
    console.log(tmpMapName)
    console.log(tmpSlNN)
    console.log(tmpBorder)
}



Subsystem.prototype.createNSubSystemIcon = function(updatLayers, flag) {
    //this.name='test';
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var invert = false;
    var fontColor = (invert) ? '#FFFFFF' : '#000000';
    var strokeColor = (invert) ? '#C0C0C0' : '#000000';
    var fillColor = (invert) ? 'none' : '#FFFFFF';
    var borderNum = 0,
        rborderNum = 0;
    var maxLeft = 0,
        maxRight = 0;
    var cells = null;
    if (updatLayers == null) {
        //20161026
        cells = graph.getSelectionCells();
    } else {
        cells = updatLayers.children;
    }

    pinPosition = mxUtils.bind(this, function(name) {

        var tMCell = this.tmpPinMCell[name];
        var terminal = graph.view.getState(tMCell);
        if (terminal&&terminal.shape&&terminal.shape.stencil) {
				var constraints = terminal.shape.stencil.constraints;
				constraints=(typeof(constraints)=='function')?terminal.shape.stencil.constraints(terminal.shape):constraints;
				if (constraints[name.split('.')[1]].point.x > 0.5) {
					return false;
				} else {
					return true;
				}
			
        }

    });

    this.checkConnected();

    graph.model.beginUpdate();
    try {
        var style = 'verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=' + fillColor;
        var subCell = new mxCell(this.name, new mxGeometry(0, 0, 60, 40 * (parseInt(borderNum / 4) + 1)), style);
        var portStyle = 'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;' +
            'spacingLeft=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor;
        var portCell = new mxCell('1', new mxGeometry(0, 0, 10, 16), portStyle);
        subCell.setConnectable(false);
        portCell.geometry.relative = true;
        portCell.vertex = "1";
        let isleft = true;
        for (let key in this.borderPoint) {
            let tempPortCell = portCell.clone();
            var str = this.borderPoint[key].split('.');

            if (str[1]) {
                tempPortCell.classname = key;
                tempPortCell.mappingPoint = key;
                tempPortCell.value = this.name + '.' + 'p' + borderNum + rborderNum;
            } else {
                tempPortCell.value = str[0];
                tempPortCell.classname = this.labelName[key][0];
                tempPortCell.mappingPoint = this.labelName[key][0];
            }

            tempPortCell.thutype = 'subPin';
            isleft = pinPosition(tempPortCell.classname);
            //tempPortCell.value = this.borderPoint[key];

            if (isleft) {

                tempPortCell.geometry.offset = new mxPoint(-portCell.geometry.width, 20 * (borderNum) + 2);
                borderNum++;
                maxLeft = (maxLeft > this.borderPoint[key].length) ? maxLeft : tempPortCell.value.length;
            } else {
                tempPortCell.geometry.x = 1;
                tempPortCell.style = 'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;' +
                    'spacingRight=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor;
                tempPortCell.geometry.offset = new mxPoint(0, 20 * (rborderNum) + 2);
                rborderNum++;
                maxRight = (maxRight > tempPortCell.value.length) ? maxRight : tempPortCell.value.length;
            }
            //isleft=!isleft;
            subCell.insert(tempPortCell);

        }



        subCell.thutype = 'system';
        subCell.vertex = "1"
        subCell.maxLeftBorder = borderNum;
        subCell.maxRightBorder = rborderNum;
        var style = graph.getCellStyle(portCell);
        var fontSize = style[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE;
        subCell.geometry.width = (maxLeft + maxRight) * 12 * 0.6 + 30;
        var maxheight = (borderNum > rborderNum) ? borderNum : rborderNum;
        subCell.geometry.height = 20 * maxheight;
    } finally {
        graph.model.endUpdate()
    }



    var createSystem = mxUtils.bind(this, function(subCell, changeName) {
        //function createSystem(subCell, changeName) {
        console.log(subCell, changeName);
        graph.model.beginUpdate();
        try {
            var newCell = updatLayers;
            if (newCell == null) {

                var newCell = graph.addCell(new mxCell(this.name), graph.model.root);
                newCell.isOpen = false;
                newCell.layersType = 'system';
                for (var i = 0; i < cells.length; i++) {
                    graph.addCell(cells[i], newCell);
                }

            } else {
                newCell.value = this.name;
                newCell.layersType = 'system';
            }

            subCell.mappingPoint = newCell.id;
            subCell.editorName = editorName;
            newCell.editorName = editorName;
            if (subCell.isLock) {
                newCell.isLock = true;
                var overlay = new mxCellOverlay(
                    new mxImage('/static/graphEditor/images/unlocked.png', 16, 16),
                    'Overlay tooltip');
                graph.addCellOverlay(subCell, overlay);
            }

            if (changeName != null) {
                for (var tLabel in changeName) {
                    if (tLabel != '') {
                        var labelObj = this.labelName[tLabel];
                        if (labelObj != undefined) {
                            for (var i = 0; i < labelObj.length; i++) {
                                let str = labelObj[i].split('.')
                                if (_pssEle[str[0]]) {
                                    //_pssEle[str[0]]['pin'][str[1]]['label']=changeName[tLabel];
                                    var tmpCell = graph.model.getCell(_pssEle[str[0]]['_mid']);
                                    graph.pinChanged(tmpCell, 'pin-' + str[1], changeName[tLabel]);
                                    //tmpCell['pin-'+str[1]]=changeName[tLabel];
                                }
                            }
                        }
                    }

                }
            } else {

            }

            var selectCell = null;
            var mainLayers = _graph.model.getCell(1);
            var parent = graph.getDefaultParent();
            var boundBox = _graph.getBoundingBoxFromGeometry(_graph.getSelectionCells(), true);
            if (!graph.model.isVisible(mainLayers)) {
                //20161026
                if (flag) {
                    var tempMappingCell = [graph.model.getCell(newCell.mappingPoint)];
                    selectCell = graph.importCells([subCell], boundBox.x - subCell.geometry.x, boundBox.y - subCell.geometry.y, mainLayers);
                    graph.removeCells(tempMappingCell);
                    createMessage = mxResources.get('updasuccess');

                } else {
                    selectCell = graph.importCells([subCell], boundBox.x - subCell.geometry.x, boundBox.y - subCell.geometry.y, mainLayers);
                    createMessage = mxResources.get('createsuccess');
                }
                //_graph.addCell(newSystem,mainLayers);
                graph.setDefaultParent(parent);
                graph.model.setVisible(selectCell[0], true);
                graph.model.setVisible(mainLayers, false);

            } else {
                //_graph.addCell(newSystem,defParent);
                selectCell = graph.importCells([subCell], boundBox.x - subCell.geometry.x, boundBox.y - subCell.geometry.y, mainLayers);

                createMessage = mxResources.get('createsuccess');
                graph.model.setVisible(selectCell[0], true);
                graph.model.setVisible(newCell, false);
            }



            var oldEdgeList = [];
            var nextPoint = 0;
            var selectCellChildLength = 0;
            if (selectCell[0].children) {
                selectCellChildLength = selectCell[0].children.length;
            }
            var nums = 2;
            var leftNum = 2;
            var rightnum = 2;
            for (var i = 0; i < selectCellChildLength; i++) {
                ///textArea.value+='</br>'+selectCell[0].children[i].value;
                var str = selectCell[0].children[i].classname.split('.');
                if (_pssEle[str[0]]['pin'][str[1]].label == '') {
                    //_pssEle[str[0]]['pin'][str[1]].label=changeName[selectCell[0].children[i].classname];
                    var tmpCell = graph.model.getCell(_pssEle[str[0]]['_mid']);
                    //tmpCell['pin-'+str[1]]=changeName[selectCell[0].children[i].classname];
                    graph.pinChanged(tmpCell, 'pin-' + str[1], changeName[selectCell[0].children[i].classname]);
                }

                var tmpCN = selectCell[0].children[i].classname;
                if (this.tmpPG[tmpCN] != undefined && this.tmpEdgeObj[this.tmpPG[tmpCN]]) {
                    var tmpEG = this.tmpEdgeObj[this.tmpPG[tmpCN]];
                    var dif = _.difference(this.tmpEC[this.tmpPG[tmpCN]], this.labelName[tmpCN]);
                    dif = _.difference(dif, _.intersection(dif, this.tmpINP));
                    var tmpCEdge = [];
                    for (var j = 0; j < tmpEG.length; j++) {
                        var tmpOE = graph.model.getCell(tmpEG[j]);
                        if (tmpOE.edges) {
                            for (var k = 0; k < tmpOE.edges.length; k++) {
                                tmpCEdge.push(tmpOE.edges[k].id);
                            }
                        }
                    }
                    console.log(tmpCEdge);
                    tmpEG = _.difference(tmpEG, _.intersection(tmpEG, tmpCEdge));
                    if (selectCell[0].children[i].geometry.x) {
                        rightnum++;
                        nums = 10 * rightnum;
                    } else {
                        leftNum++;
                        nums = -10 * leftNum;
                    }
                    for (var l = 0; l < tmpEG.length; l++) {
                        var tmpOE = graph.model.getCell(tmpEG[l]);
                        var tmpNGV = this.tmpNEdge[tmpEG[l]];
                        //	var tmpNE=tmpOE.clone();
                        if (dif.indexOf(tmpNGV.sourceName) >= 0) {

                            graph.connectCell(tmpOE, selectCell[0].children[i], false, new mxConnectionConstraint(new mxPoint(0, 0.5), false));
                            //var t=graph.addCell(tmpNE, graph.getDefaultParent());
                            //	t.vertex=1;
                            tmpOE.geometry.points = [new mxPoint(selectCell[0].geometry.x + nums, selectCell[0].geometry.y)];
                            nums++
                        } else if (dif.indexOf(tmpNGV.targetName) >= 0) {
                            graph.connectCell(tmpOE, selectCell[0].children[i], true, new mxConnectionConstraint(new mxPoint(1, 0.5), false));
                            tmpOE.geometry.points = [new mxPoint(selectCell[0].geometry.x + selectCell[0].geometry.width + nums, selectCell[0].geometry.y)];
                            nums++
                            //	var t=graph.addCell(tmpNE, graph.getDefaultParent());
                            //	t.vertex=1;
                            //console.log(t);
                        }



                    }
                }

            }
            /*for (var i = 0; i < oldEdgeList.length; i++) {
            	graph.removeCells([graph.model.getCell(oldEdgeList[i])], false);
            }*/
            newCell.mappingPoint = selectCell[0].id;
            _pssSystem = (_pssSystem instanceof Array) ? {} : _pssSystem
            _pssSystem[selectCell[0].value] = {
                'id': selectCell[0].id,
                'sym': selectCell[0].value,
                'mid': selectCell[0].id,
                '_mid': newCell.id
            };

            _pssSystemId[selectCell[0].id] = newCell.id;


        } finally {
            graph.model.endUpdate();
        }
    });
    if (mxUtils.confirm(mxResources.get('createDefinedSystemDoc'))) {
        var opendlg = new editorNiconSubSystemPort(ui, this, subCell, createSystem);
        ui.showDialog(opendlg, 860, 475, true, true);
    } else {
        createSystem(subCell);
    }

}

var editorNiconSubSystemPort = function(editorUi, system, systemCell, fun) {

    var fdiv = document.createElement('div');
    var div = document.createElement('div');
    var changeName = {};
    this.tSystem = system;
    this.tSystemCell = systemCell;
    this.cellHeight = 20;
    this.cellWidth = 30;
    div.style.overflow = 'auto';
    div.style.float = 'left';
    div.style.width = '70%';
    div.style.height = '340px';
    div.style.marginBottom = '16px';
    div.style.border = '2px solid #eee';
    var tempthis = editorUi;
    var sidebar = '';
    var pagesize = 0;
    var targetid = 0;
    var title = document.createElement('h3');
    mxUtils.write(title, mxResources.get('Customsubsys'));
    fdiv.appendChild(title);
    //预览窗口
    var previewSystem = document.createElement('div');
    previewSystem.style.float = 'left';
    previewSystem.style.width = '29%';
    previewSystem.style.height = '340px';
    //<div class="sidebar project-bar"><h4 style="padding-left:36px">Simulations</h4>\

    var preview = document.createElement('div');
    preview.class = "sidebar project-bar";
    //var previewtTitle=document.createElement('h4');
    //mxUtils.write(previewtTitle, '创建预览');
    var privateEditor = document.createElement('div');
    //privateEditor.style.width='98%';
    privateEditor.style.border = '2px solid #eee';
    var tempGraph = new Graph(privateEditor, null, null, editorUi.editor.graph.getStylesheet());
    tempGraph.cellRenderer.antiAlias = false;
    tempGraph.resetViewOnRootChange = false;
    tempGraph.foldingEnabled = false;
    tempGraph.setConnectable(false);
    tempGraph.gridEnabled = false;
    tempGraph.autoScroll = false;
    tempGraph.setTooltips(false);
    tempGraph.setEnabled(true);
    tempGraph.setCellsResizable(false);
    //tempGraph.container.style.visibility = 'hidden';
    //tempGraph.container.style.position = 'absolute';
    tempGraph.container.style.overflow = 'hidden';
    tempGraph.container.style.height = '340px';
    tempGraph.container.style.width = '98%';
    var selectCell = tempGraph.importCells([systemCell], (244 - systemCell.geometry.width) / 2, (285 - systemCell.geometry.height) / 2, tempGraph.getDefaultParent());
    //preview.appendChild(previewtTitle);
    var v1 = tempGraph.insertVertex(tempGraph.getDefaultParent(), null, mxResources.get('Preview'),
        57, 0, 130, 50, 'whiteSpace=wrap;overflow=hidden;verticalAlign=baseline;fontSize=30;strokeColor=none;');
    //v1.txt = 1;
    v1.setConnectable(false);
    preview.appendChild(privateEditor);
    previewSystem.appendChild(preview);

    var defDiv = document.createElement('div');
    var setingDiv = document.createElement('div');
    setingDiv.appendChild(previewSystem);
    setingDiv.id = 'setingview';
    setingDiv.style.height = '350px';
    that = this;
    //刷新
    this.refresh = function() {
            tempGraph.model.beginUpdate();
            try {
                tempNewCell = selectCell[0];
                var childrenLength = tempNewCell.children.length;
                var leftNum = 0;
                var rightNum = 0;
                var maxLName = 0;
                var maxRName = 0;
                var newCellChildLength = 0;
                if (tempNewCell.children) {
                    newCellChildLength = tempNewCell.children.length;
                }
                for (var i = 0; i < tempNewCell.children.length; i++) {
                    if (tempNewCell.children[i].visible) {
                        if (tempNewCell.children[i].geometry.offset.x < 0) {
                            tempNewCell.children[i].geometry.offset.y = 20 * leftNum + 2
                            leftNum++;
                            maxLName = (maxLName > tempNewCell.children[i].value.length) ? maxLName : tempNewCell.children[i].value.length;
                        } else {
                            tempNewCell.children[i].geometry.offset.y = 20 * rightNum + 2
                            rightNum++;
                            maxRName = (maxRName > tempNewCell.children[i].value.length) ? maxRName : tempNewCell.children[i].value.length;

                        }
                    } else {}
                }
                var maxheight = (leftNum > rightNum) ? leftNum : rightNum;
                tempNewCell.geometry.height = (maxheight * 20) ? maxheight * 20 : that.cellHeight;
                var fontSize = style[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE;
                tempNewCell.geometry.width = ((maxRName + maxLName) * fontSize * 0.6 + 20 > 30) ? (maxRName + maxLName) * fontSize * 0.6 + 20 : that.cellWidth;
                tempNewCell.geometry.x = (tempGraph.container.scrollWidth - tempNewCell.geometry.width) / 2;

                tempNewCell.geometry.y = (tempGraph.container.scrollHeight - tempNewCell.geometry.height) / 2;
                tempNewCell = tempGraph.moveCells([tempNewCell], 0, 0, false, null)[0];


            } finally {
                tempGraph.model.endUpdate();
                tempGraph.refresh();
                return tempNewCell;
                //toastr["info"](createMessage);
            }
        }
        //边界点

    var tempNewCell = null;
    var externalTable = document.createElement('table');
    externalTable.rules = 'rows';
    externalTable.style.width = '100%';
    externalTable.innerHTML += '<thead><tr style="text-align: center;height: 30px;background: #fafafa;"><td>' + mxResources.get('IsDisplay') + '</td><td>' + mxResources.get('ElePort') + '</td><td>' + mxResources.get('BeforeEdit') + '</td><td>' + mxResources.get('AfterEdit') + '</td><td>' + mxResources.get('position') + '</td></tr><tr><td>' + mxResources.get('BorderPort') + '</td></tr></thead>';
    var systemChildlength = 0;
    if (systemCell.children) {
        systemChildlength = systemCell.children.length;
    }

    for (var i = 0; i < systemChildlength; i++) {
        var tr = document.createElement('tr');
        tr.style['text-align'] = 'center';
        var td = document.createElement('td');
        td.style.width = '10%';
        var inp = document.createElement('input');
        inp.setAttribute('type', 'checkbox');
        inp.setAttribute('title', mxResources.get('IsDisplay'));
        inp.style.marginLeft = '4px';
        inp.style.marginRight = '6px';
        inp.style.marginTop = '4px';
        inp.setAttribute('checked', 'checked');
        inp.cellChildren = i;
        //inp.setAttribute('disabled', 'disabled');
        mxEvent.addListener(inp, 'click', function(evt) {
            // if (tempNewCell != null) {
            // 	tempGraph.getModel().setVisible(tempNewCell[0], false);
            // 	tempGraph.getModel().setVisible(selectCell[0], true);

            // }
            if (this.checked) {
                tempGraph.getModel().setVisible(selectCell[0].children[this.cellChildren], true);
            } else {
                tempGraph.getModel().setVisible(selectCell[0].children[this.cellChildren], false);
            }
            that.refresh();
        });

        td.appendChild(inp);

        tr.appendChild(td);
        //tr=document.createElement('tr');
        td = document.createElement('td');
        td.style.width = '30%';
        //mapping = _graph.model.getCell(selectCell[0].children[i].mappingPoint);
        //mxUtils.write(td, mapping.parent.value + ' 第' + (mapping.pinn + 1) + '端口');
        //if (mapping.pinn != undefined) {
        //mxUtils.write(td, mapping.parent.value + ' 第' + (mapping.pinn + 1) + '端口');
        console.log(selectCell[0].children[i].classname);
        var str = selectCell[0].children[i].classname.split('.');
        if (str[1]) {
            mxUtils.write(td, str[0] + ' ' + mxResources.get('portSeat', str[1]));
        } else {
            mxUtils.write(td, str[0] + '标签的端口');
        }

        //	} else {
        //	mxUtils.write(td, mapping.parent.value + ' ' + (mapping.value) + mxResources.get('eleport'));
        //}
        tr.appendChild(td);

        //tr=document.createElement('tr');
        td = document.createElement('td');
        td.style.width = '20%';
        mxUtils.write(td, systemCell.children[i].value);
        tr.appendChild(td);

        td = document.createElement('td');
        td.id = 'td' + i;
        td.cellChildren = i;
        td.style.width = '25%';
        td.setAttribute('title', mxResources.get('editDbclickTip'));
        var tmpname = system.labelName[selectCell[0].children[i].value] ? selectCell[0].children[i].value : selectCell[0].children[i].classname;
        td.tempName = tmpname;
        changeName[tmpname] = selectCell[0].children[i].value;
        //td.tempName = selectCell[0].children[i].classname;
        //changeName[selectCell[0].children[i].classname] = selectCell[0].children[i].value;
        // if(mapping.value==''){
        // 	changeName[selectCell[0].children[i].mappingPoint]=selectCell[0].children[i].value
        // }else{

        // }
        mxUtils.write(td, selectCell[0].children[i].value);
        var index = i;
        mxEvent.addListener(td, 'dblclick', function(evt, index) {
            // if (tempNewCell != null) {
            // 	tempGraph.getModel().setVisible(tempNewCell[0], false);
            // 	tempGraph.getModel().setVisible(selectCell[0], true);

            // }
            var td = $(this);
            // 根据表格文本创建文本框 并加入表表中--文本框的样式自己调整
            var text = td.text();
            var txt = $("<input type='text'>").val(text);
            txt.blur(function() {
                // 失去焦点，保存值。于服务器交互自己再写,最好ajax
                var newText = $(this).val();

                // 移除文本框,显示新值
                $(this).remove();
                td.text(newText);
                if (td[0].tempName != '')
                    changeName[td[0].tempName] = newText;
                tempGraph.getModel().setValue(selectCell[0].children[td[0].cellChildren], newText);
                that.refresh();
            });
            td.text("");
            td.append(txt);
        });
        tr.appendChild(td);

        (function(cell) {
            td = document.createElement('td');
            td.style.width = '10%';
            var positionSelect = document.createElement('select');
            //positionSelect.style.position = 'absolute';
            // positionSelect.style.width = '180px';
            positionSelect.style.marginTop = '-2px';
            var tStyle = tempGraph.getCellStyle(cell);
            var dfValue = 'left';
            var nxValue = 'right';
            if (tStyle['align'] != dfValue) {
                dfValue = 'right';
                nxValue = 'left';
            }
            var positionOptionEle = document.createElement('option');
            positionOptionEle.setAttribute('value', dfValue);
            mxUtils.write(positionOptionEle, mxResources.get(dfValue));
            positionSelect.appendChild(positionOptionEle);
            positionOptionEle = document.createElement('option');
            positionOptionEle.setAttribute('value', nxValue);
            mxUtils.write(positionOptionEle, mxResources.get(nxValue));
            positionSelect.appendChild(positionOptionEle);

            var tCell = cell;
            mxEvent.addListener(positionSelect, 'change', function(evt) {
                tempGraph.getModel().beginUpdate();
                try {
                    var vals = positionSelect.value;
                    //console.log(cell);
                    var tStyle = tempGraph.getCellStyle(cell);
                    that.maxLeftBorder = (that.maxLeftBorder) ? that.maxLeftBorder : that.tSystemCell.maxLeftBorder;
                    that.maxRightBorder = (that.maxRightBorder) ? that.maxRightBorder : that.tSystemCell.maxRightBorder;
                    if (vals == 'left' && tStyle.align == 'right') {
                        cell.style = 'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;' +
                            'spacingLeft=12;fontColor=#000000;strokeColor=#000000';
                        cell.geometry.x = 0;
                        cell.geometry.offset.x = -cell.geometry.width;
                        cell.geometry.offset.y = 20 * (that.maxLeftBorder) + 2;
                        that.maxLeftBorder++;
                    } else if (vals == 'right' && tStyle.align == 'left') {
                        cell.style = 'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;' +
                            'spacingRight=12;fontColor=#000000;strokeColor=#000000';

                        cell.geometry.x = 1;
                        cell.geometry.offset.x = 0;
                        cell.geometry.offset.y = 20 * (that.maxRightBorder) + 2;
                        that.maxRightBorder++;
                    }
                    that.refresh();
                } finally {
                    tempGraph.getModel().endUpdate();
                    tempGraph.refresh();
                }

                mxEvent.consume(evt);
            });
            td.appendChild(positionSelect);
            tr.appendChild(td);
        })(selectCell[0].children[i]);
        externalTable.appendChild(tr);

    }
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    mxUtils.write(td, mxResources.get('LabelPort'));
    td.setAttribute('colspan', 2);
    tr.appendChild(td);
    externalTable.appendChild(tr);
    //非边界的点
    //externalTable.innerHTML += '<tr style="height: 30px;"><td></td><td>非边界以标签形式存在的端口</td></tr>';
    for (var tLabel in system.labelPort) {
        if (system.borderPoint[tLabel] == undefined) {
            (function(tLabel) {
                this.tLabel = tLabel;
                //	var subThat = this;
                var subThat = {};
                subThat['tLabel'] = tLabel;
                var tr = document.createElement('tr');
                tr.style['text-align'] = 'center';
                var td = document.createElement('td');
                td.style.width = '10%';
                var inp = document.createElement('input');
                inp.id = 'inptd' + i;
                inp.setAttribute('type', 'checkbox');
                inp.setAttribute('title', mxResources.get('IsDisplay'));
                inp.style.marginLeft = '4px';
                inp.style.marginRight = '6px';
                inp.style.marginTop = '4px';
                ///np.setAttribute('checked', 'checked');

                inp.cellChildren = tLabel;
                //inp.setAttribute('disabled', 'disabled');
                mxEvent.addListener(inp, 'click', function(evt) {
                    tempGraph.model.beginUpdate();
                    try {
                        if (this.checked) {
                            if (this.createdCell == undefined) {
                                this.createdCell = 1;
                                subThat['createdCell'] = 1;
                                var portCell = selectCell[0].children[0].clone();
                                that.maxLeftBorder = (that.maxLeftBorder) ? that.maxLeftBorder : that.tSystemCell.maxLeftBorder;
                                that.maxRightBorder = (that.maxRightBorder) ? that.maxRightBorder : that.tSystemCell.maxRightBorder;
                                subThat['selectPotion'] = (subThat.selectPotion) ? subThat.selectPotion : 'left';
                                if (subThat.selectPotion == 'left') {
                                    portCell.geometry.x = 0;
                                    portCell.style = 'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;' +
                                        'spacingLeft=12;fontColor=#000000;strokeColor=#000000';
                                    portCell.geometry.offset = new mxPoint(-portCell.geometry.width, 20 * (that.maxLeftBorder) + 2);
                                    ++that.maxLeftBorder;
                                } else {
                                    portCell.geometry.x = 1;
                                    portCell.style = 'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;' +
                                        'spacingRight=12;fontColor=#000000;strokeColor=#000000';
                                    portCell.geometry.offset = new mxPoint(0, 20 * (that.maxLeftBorder) + 2);
                                    ++that.maxRightBorder;
                                }
                                //portCell.geometry.offset = new mxPoint(-portCell.geometry.width, 20 * (selectCell[0].maxLeftBorder) + 2);
                                portCell.vertex = "1";
                                portCell.value = changeName[this.cellChildren];
                                portCell.mappingPoint = system.labelPort[this.cellChildren][0];
                                portCell.classname = system.labelPort[this.cellChildren][0];
                                var maxheight = (that.maxLeftBorder > that.maxRightBorder) ? that.maxLeftBorder : that.maxRightBorder;
                                var newPort = tempGraph.addCell(portCell, selectCell[0]);
                                this.cellChildren = selectCell[0].children.length - 1;
                                selectCell[0].geometry.height = 20 * (maxheight);
                                subThat['cells'] = newPort;
                            } else
                                tempGraph.getModel().setVisible(selectCell[0].children[this.cellChildren], true);
                        } else {
                            tempGraph.getModel().setVisible(selectCell[0].children[this.cellChildren], false);
                        }
                        that.refresh();
                    } finally {
                        tempGraph.model.endUpdate();
                        //toastr["info"](createMessage);
                    }
                });

                td.appendChild(inp);

                tr.appendChild(td);
                //tr=document.createElement('tr');
                td = document.createElement('td');

                //mxUtils.write(td, '共'+system.labelPort[tLabel].length+ '个端口');
                //portNum
                mxUtils.write(td, mxResources.get('portNum', [system.labelPort[tLabel].length]));
                tr.appendChild(td);
                //tr=document.createElement('tr');
                td = document.createElement('td');
                mxUtils.write(td, tLabel);
                tr.appendChild(td);

                td = document.createElement('td');
                td.id = 'td' + i;
                td.cellChildren = tLabel;
                td.setAttribute('title', mxResources.get('editDbclickTip'));
                changeName[tLabel] = system.name + '.' + tLabel;
                mxUtils.write(td, system.name + '.' + tLabel);
                var index = i;
                mxEvent.addListener(td, 'dblclick', function(evt) {
                    // if (tempNewCell != null) {
                    // 	tempGraph.getModel().setVisible(tempNewCell[0], false);
                    // 	tempGraph.getModel().setVisible(selectCell[0], true);

                    // }
                    var td = $(this);
                    // 根据表格文本创建文本框 并加入表表中--文本框的样式自己调整
                    var text = td.text();
                    var txt = $("<input type='text'>").val(text);
                    txt.blur(function() {
                        // 失去焦点，保存值。于服务器交互自己再写,最好ajax
                        var newText = $(this).val();

                        // 移除文本框,显示新值
                        $(this).remove();
                        td.text(newText);
                        changeName[td[0].cellChildren] = newText;
                        var tempInp = $('#inp' + td[0].id);
                        if (tempInp[0].createdCell != undefined) {
                            tempGraph.getModel().setValue(selectCell[0].children[tempInp[0].cellChildren], newText);
                            that.refresh();
                        }

                        ///tempGraph.getModel().setValue(selectCell[0].children[td[0].cellChildren], newText);

                    });
                    td.text("");
                    td.append(txt);
                });
                tr.appendChild(td);



                //选择
                td = document.createElement('td');
                var positionSelect = document.createElement('select');
                //positionSelect.style.position = 'absolute';
                // positionSelect.style.width = '180px';
                positionSelect.style.marginTop = '-2px';
                //var tStyle = tempGraph.getCellStyle(cell);
                var dfValue = 'left';
                var nxValue = 'right';
                // if (tStyle['align'] != dfValue) {
                // 	dfValue = 'right';
                // 	nxValue = 'left';
                // }
                var positionOptionEle = document.createElement('option');
                positionOptionEle.setAttribute('value', dfValue);
                mxUtils.write(positionOptionEle, mxResources.get(dfValue));
                positionSelect.appendChild(positionOptionEle);
                positionOptionEle = document.createElement('option');
                positionOptionEle.setAttribute('value', nxValue);
                mxUtils.write(positionOptionEle, mxResources.get(nxValue));
                positionSelect.appendChild(positionOptionEle);

                mxEvent.addListener(positionSelect, 'change', function(evt) {
                    tempGraph.getModel().beginUpdate();
                    try {
                        var vals = positionSelect.value;
                        if (subThat.createdCell == undefined) {
                            subThat['selectPotion'] = vals;
                        } else {

                            var cell = subThat.cells;
                            var tStyle = tempGraph.getCellStyle(cell);
                            that.maxLeftBorder = (that.maxLeftBorder) ? that.maxLeftBorder : that.tSystemCell.maxLeftBorder;
                            that.maxRightBorder = (that.maxRightBorder) ? that.maxRightBorder : that.tSystemCell.maxRightBorder;
                            if (vals == 'left' && tStyle.align == 'right') {
                                cell.style = 'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;' +
                                    'spacingLeft=12;fontColor=#000000;strokeColor=#000000';
                                cell.geometry.x = 0;
                                cell.geometry.offset.x = -cell.geometry.width;
                                cell.geometry.offset.y = 20 * (that.maxLeftBorder) + 2;
                                that.maxLeftBorder++;
                            } else if (vals == 'right' && tStyle.align == 'left') {
                                cell.style = 'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;' +
                                    'spacingRight=12;fontColor=#000000;strokeColor=#000000';

                                cell.geometry.x = 1;
                                cell.geometry.offset.x = 0;
                                cell.geometry.offset.y = 20 * (that.maxRightBorder) + 2;
                                that.maxRightBorder++;
                            }
                            that.refresh();
                        }
                    } finally {
                        tempGraph.getModel().endUpdate();
                        tempGraph.refresh();
                    }
                    mxEvent.consume(evt);
                });
                td.appendChild(positionSelect);
                tr.appendChild(td);
                externalTable.appendChild(tr);
            })(tLabel);
        }
    }

    div.appendChild(externalTable);
    setingDiv.appendChild(div);
    var publicDiv = document.createElement('div');
    mxUtils.write(publicDiv, mxResources.get('IsPublic'));
    publicDiv.style.float = 'left';
    //publicDiv.style.width='100%';
    var yesLabel = document.createElement('label');
    yesLabel.style['margin-left'] = '20px';

    var yesinput = document.createElement('input');
    mxUtils.write(yesLabel, mxResources.get('yes'));
    yesinput.style.width = '2em';
    yesinput.type = 'radio';
    yesinput.value = '1';
    yesinput.name = 'share';
    yesinput.setAttribute('checked', 'checked');
    yesLabel.appendChild(yesinput);
    var noLabel = document.createElement('label');
    var noinput = document.createElement('input');
    noLabel.style['margin-left'] = '20px';
    mxUtils.write(noLabel, mxResources.get('no'));
    noinput.style.width = '2em';
    noinput.type = 'radio';
    noinput.name = 'share';
    noinput.value = '0';
    selectCell[0].isLock = false;
    mxEvent.addListener(yesinput, 'click', function(evt) {
        selectCell[0].isLock = false;
    });
    mxEvent.addListener(noinput, 'click', function(evt) {
        selectCell[0].isLock = true;
    });

    noLabel.appendChild(noinput);
    publicDiv.appendChild(yesLabel);
    publicDiv.appendChild(noLabel);


    defDiv.appendChild(setingDiv);
    var btnDiv = document.createElement('div');
    btnDiv.id = 'btnDiv';
    btnDiv.style.height = '40px';
    defDiv.appendChild(btnDiv);
    defDiv.appendChild(publicDiv);
    //
    var genericBtn = mxUtils.button(mxResources.get('create'), function() {
        var newCreat = that.refresh();

        fun(newCreat, changeName);
        editorUi.hideDialog();
    });

    genericBtn.className = 'geBtn gePrimaryBtn';

    defDiv.appendChild(genericBtn);


    //defDiv.appendChild(previewBtn);

    var cancelBtn = mxUtils.button(mxResources.get('Cancel'), function() {
        editorUi.hideDialog();

    });
    cancelBtn.className = 'geBtn';
    defDiv.appendChild(cancelBtn);
    //<div style="float:left;width:27%;">' + mxResources.get('IsPublic') + '</div><div style="float:left;width:70%;margin: 0px 0px 0px 11px;">' + ch + '</div><br>\
    //20170119
    var iconBtn = mxUtils.button('图标', function() {
        var opendlg = new iconDialog(editorUi, function(dir) {
            console.log(dir);
            if (dir) {
                selectCell[0].style += ';image;image=' + dir.replace(window.location.origin, '..');
                // selectCell[0].geometry.width =150;
                //selectCell[0].geometry.height =150;
                that.cellWidth = 80;
                that.cellHeight = 80;
                that.refresh();
                // tempGraph.refresh();
            }
        });
        editorUi.showDialog(opendlg, 400, 300, true, true);



    });
    iconBtn.className = 'geBtn gePrimaryBtn';
    defDiv.appendChild(iconBtn);

    fdiv.appendChild(defDiv);
    return fdiv;
};
