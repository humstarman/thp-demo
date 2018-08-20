/**
 * 复制黏贴重写
 */

Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getXml() {

    var xx = '<?xml version="1.0"?>';
    var encoder = new mxCodec();
    var node = encoder.encode(_graph.getModel());

    var xml = mxUtils.getXml(node);
    //var tt = encoder.encodeCell(_graph.getModel(),xx,true);
    //console.log(tt);return;
    console.log(mxUtils.getPrettyXml(node), true);

}


// 载入指定id的元件
function getCompById(id, addr) {
    var x = '';
    $.ajax({
        type: "get",
        url: '/editor/' + (addr ? addr : 'getComponent') + '/?id=' + id,
        data: '',
        dataType: "json",
        async: false,
        success: function(data) {
            if (data.status != 0) {
                alert(data.msg);
                return false;
            }
            x = data;
        },
        error: function() {
            alert('暂时未能获取元件信息');
            return false;
        }
    });
    return x;
}


// 载入指定id的元件
// sym :元件符号，nn
function getCompBySym(sym) {
    var x = '';
    $.ajax({
        type: "get",
        url: '/editor/getComponentBySym/?sym=' + sym + '&mod=' + _curModSym,
        data: '',
        dataType: "json",
        async: false,
        success: function(data) {
            if (data.status != 0) {
                alert(data.msg);
                return false;
            }
            x = data;
        },
        error: function() {
            alert('暂时未能获取元件信息')
            return false;
        }
    });
    return x;
}


// 元件面板显示切换
function toggleCompPanel(self) {
    var show = $(self).data('show') >> 0;
    if (show == 1) {
        _wndList.Comp.hide();
        $(self).removeClass('shown').data('show', 0);
    } else {
        _wndList.Comp.show();
        $(self).addClass('shown').data('show', 1);
    }
}

function toggleCtrlPanel(self) {
    var show = $(self).data('show') >> 0;
    if (show == 1) {
        _wndList.Ctrl.hide();
        $(self).removeClass('shown').data('show', 0);
    } else {
        _wndList.Ctrl.show();
        $(self).addClass('shown').data('show', 1);
    }
}

function toggleMsrPanel(self) {
    var show = $(self).data('show') >> 0;
    if (show == 1) {
        _wndList.Msr.hide();
        $(self).removeClass('shown').data('show', 0);
    } else {
        _wndList.Msr.show();
        $(self).addClass('shown').data('show', 1);
    }
}

//模块面板显示切换
function toggleModulePanel(self) {
    var show = $(self).data('show') >> 0;
    if (show == 1) {
        _wndList.Module.hide();
        $(self).removeClass('shown').data('show', 0);
    } else {
        _wndList.Module.show();
        $(self).addClass('shown').data('show', 1);
    }
}

//我的模块面板显示切换
function toggleMyModulePanel(self) {
    var show = $(self).data('show') >> 0;
    if (show == 1) {
        _wndList.Mymod.hide();
        $(self).removeClass('shown').data('show', 0);
    } else {
        _wndList.Mymod.show();
        $(self).addClass('shown').data('show', 1);
    }
}

//统信息面板显示切换
function toggleSysInfo(self) {
    var show = $(self).data('show') >> 0;
    if (show == 1) {
        _wndList.wInfo.hide();
        $(self).removeClass('shown').data('show', 0);
    } else {
        _wndList.wInfo.show();
        $(self).addClass('shown').data('show', 1);
    }
}

//缩略图导航
function toggleOutline(self) {
    var show = $(self).data('show') >> 0;
    if (show == 1) {
        _wndList.Outline.hide();
        $(self).removeClass('shown').data('show', 0);
    } else {
        _wndList.Outline.show();
        $(self).addClass('shown').data('show', 1);
    }
}



// 载入控制元件列表，参数：页码

// 载入量测元件列表，参数：页码

/** 设置拖拽的预览 **/
function setDragElt(w, h, bg) {
    dragElt.style.width = w + 'px';
    dragElt.style.height = h + 'px';
    dragElt.style.backgroundImage = 'url(' + bg + ')';
}

function resetDragElt() {
    dragElt.style.width = '60px';
    dragElt.style.height = '60px';
    dragElt.style.backgroundImage = 'url()';
}


// // 处理连接事件，电气元件的msrout只能被测量元件连接
mxConnectionHandler.prototype.connect = function(source, target, evt, dropTarget) {
        //~ console.log('---',source.parent.thutype,target.parent.thutype);
        // ele : msr 允许的连接关系
        // ele : ele
        // ctrl : ctrl
        // msr : ctrl
        // msr 包含: msr,pEm,nEm,Im
        var _msr_ = ['msr', 'pEm', 'nEm', 'Im'];
        console.log(source)
        if (target != null || this.isCreateTarget() || this.graph.allowDanglingEdges) {
            // Uses the common parent of source and target or
            // the default parent to insert the edge
            var model = this.graph.getModel();
            var terminalInserted = false;
            var edge = null;

            model.beginUpdate();
            try {
                if (source != null && target == null && this.isCreateTarget()) {
                    target = this.createTargetVertex(evt, source);

                    if (target != null) {
                        dropTarget = this.graph.getDropTarget([target], evt, dropTarget);
                        terminalInserted = true;

                        // Disables edges as drop targets if the target cell was created
                        // FIXME: Should not shift if vertex was aligned (same in Java)
                        if (dropTarget == null || !this.graph.getModel().isEdge(dropTarget)) {
                            var pstate = this.graph.getView().getState(dropTarget);

                            if (pstate != null) {
                                var tmp = model.getGeometry(target);
                                tmp.x -= pstate.origin.x;
                                tmp.y -= pstate.origin.y;
                            }
                        } else {
                            dropTarget = this.graph.getDefaultParent();
                        }

                        this.graph.addCell(target, dropTarget);
                    }
                }

                var parent = this.graph.getDefaultParent();

                if (source != null && target != null &&
                    model.getParent(source) == model.getParent(target) &&
                    model.getParent(model.getParent(source)) != model.getRoot()) {
                    parent = model.getParent(source);

                    if ((source.geometry != null) &&
                        (target.geometry != null)) {
                        parent = model.getParent(parent);
                    }
                }

                // Uses the value of the preview edge state for inserting
                // the new edge into the graph
                var value = null;
                var style = null;

                if (this.edgeState != null) {
                    value = this.edgeState.cell.value;
                    style = this.edgeState.cell.style;
                }

                edge = this.insertEdge(parent, null, value, source, target, style);
                changeLine = changeLine ? changeLine : pipeLine;
                if (_editorUI.floorChange == '4' && changeLine) {
                    var lineParam = JSON.parse(changeLine);
                    _pssEleCount[lineParam.classname] = _pssEleCount[lineParam.classname] ? _pssEleCount[lineParam.classname] : 0;
                    _pssEleCount[lineParam.classname]++;
                    edge.classname = lineParam.classname + '_' + _pssEleCount[lineParam.classname];
                    edge.value= edge.classname;
                    edge.thutype = 'heat';
                    _pssEle[edge.classname] = lineParam;
                }
                if (edge != null) {
                    // Updates the connection constraints
                    this.graph.setConnectionConstraint(edge, source, true, this.sourceConstraint);
                    this.graph.setConnectionConstraint(edge, target, false, this.constraintHandler.currentConstraint);

                    // Uses geometry of the preview edge state
                    if (this.edgeState != null) {
                        model.setGeometry(edge, this.edgeState.cell.geometry);
                    }

                    // Makes sure the edge has a non-null, relative geometry
                    var geo = model.getGeometry(edge);

                    if (geo == null) {
                        geo = new mxGeometry();
                        geo.relative = true;

                        model.setGeometry(edge, geo);
                    }

                    // Uses scaled waypoints in geometry
                    if (this.waypoints != null && this.waypoints.length > 0) {
                        var s = this.graph.view.scale;
                        var tr = this.graph.view.translate;
                        geo.points = [];

                        for (var i = 0; i < this.waypoints.length; i++) {
                            var pt = this.waypoints[i];
                            geo.points.push(new mxPoint(pt.x / s - tr.x, pt.y / s - tr.y));
                        }
                    }

                    if (target == null) {
                        var t = this.graph.view.translate;
                        var s = this.graph.view.scale;
                        var pt = new mxPoint(this.currentPoint.x / s - t.x, this.currentPoint.y / s - t.y);
                        pt.x -= this.graph.panDx / this.graph.view.scale;
                        pt.y -= this.graph.panDy / this.graph.view.scale;
                        geo.setTerminalPoint(pt, false);
                    }

                    this.fireEvent(new mxEventObject(mxEvent.CONNECT, 'cell', edge, 'terminal', target,
                        'event', evt, 'target', dropTarget, 'terminalInserted', terminalInserted));
                }
            } catch (e) {
                mxLog.show();
                mxLog.debug(e.message);
            } finally {
                model.endUpdate();
            }

            if (this.select) {
                this.selectCells(edge, (terminalInserted) ? target : null);
            }
        }
    } // 连接处理 结束
    // 复制事件

/**
 * 复制
 * @param  {[type]} a     [description]
 * @param  {[type]} cells [description]
 * @return {[type]}       [description]
 */
mxClipboard.copy = function(a, cells) {
    cells = cells || _graph.getSelectionCells();
    //~ console.log( cells );
    mxClipboard.currentAppID = _editorUI.currentAppID;
    var parent = {} //递归选找父级的cell
    function getSId(obj) {
        if ("0" != obj.parent.parent.id)
            return getSId(obj.parent);
        else {

            return obj
        }
    }
    //多选择状态
    var edgCount = 0;
    for (var i = 0; i < cells.length; i++) {
        tempParent = getSId(cells[i])
        parent[tempParent.id] = tempParent;
        // if (!_graph.model.isEdge(tempParent)) {
        //   parent[tempParent.value] = tempParent;
        // } else {
        //   parent['edg' + edgCount] = tempParent;
        //   edgCount++;
        // }

    }
    var parentList = [];
    for (var p in parent) {
        parentList.push(parent[p]);
    }

    var cellsa = [];
    for (var i = 0; i < parentList.length; i++) {
        //~ if( cells[i].edge == true ) continue;
        // 防止元件内部的元素被复制
        //if ((!parentList[i].thutype) && (!parentList[i].edge)) continue;
        cellsa.push(parentList[i])
    }
    //~ console.log("复制了",cells.value || cells[0].parent.value);
    //~ var result = _graph.getExportableCells(cells);
    //~ console.log( result );
    //~ console.log( cellsa );
    mxClipboard.insertCount = 1;
    mxClipboard.setCells(_graph.cloneCells(cellsa));
    return cellsa;
}


function deepCopy(a, b) {
    var _clone = {},
        i = 0,
        _arg = arguments,
        _co = '',
        len = _arg.length;
    if (!_arg[1]) {
        _clone = this;
    };
    for (; i < len; i++) {
        _co = _arg[i];
        for (var name in _co) {
            //深度拷贝
            if (typeof _co[name] === 'object') {
                _clone[name] = (_co[name].constructor === Array) ? [] : {};
                _clone[name] = deepCopy(_co[name], _clone[name]);
            } else {
                _clone[name] = _co[name];
            }
        }
    }

    return _clone;
};
mxClipboard.paste = function() {
    if (mxClipboard.currentAppID != _editorUI.currentAppID) {
        alert('不同应用之间无法复制');
        return false;
    }
    if (mxClipboard.isEmpty()) return false;
    var pasteCells = _graph.getImportableCells(mxClipboard.getCells());
    var delta = mxClipboard.insertCount * mxClipboard.STEPSIZE;
    var nowParent = _graph.getDefaultParent();
    pasteCells = _graph.importCells(pasteCells, 0, 0, nowParent);
    // 处理参数的复制粘贴时参数的复制问题
    function deepPaste(cells, parent, _tempPssEleCount) {
        var i = 0,
            name = '',
            sym = '',
            symn = '',
            thutype = '';

        for (i = 0; i < cells.length; i++) {
            if (!cells[i]) {
                continue;
            }
            if (cells[i].txt == 1) {
                continue;
            }
            _graph.model.beginUpdate();
            try {
                //~ console.log( '---',cells[i] )
                //~ if( cells[i].parent==null && cells.thutype) continue;
                name = '', sym = '', symn = '', thutype = '';
                name = cells[i].classname ? cells[i].classname : cells[i].value;
                //~ console.log( name );
                thutype = cells[i].thutype || (cells[i].parent && cells[i].parent.thutype);
                switch (thutype) {
                    case 'ele':
                        ;
                    case 'msr':
                        ;
                    case 'gnd':
                        //thutype = _pssEle[name]["thutype"];
                        sym = _pssEle[name]["sym"]; // 获得元件的符号
                        _pssEleCount[sym]++; //元件符号计数+1
                        symn = sym + '-' + _pssEleCount[sym]; // 新的元件名称
                        cells[i].value ? (cells[i].value = symn) : (cells[i].parent.value = symn); //更新视图里的符号显示
                        cells[i].classname = symn;

                        _pssEle[symn] = {};
                        $.extend(true, _pssEle[symn], _pssEle[name]); //深度复制元件参数
                        _pssEle[symn]['_mid'] = cells[i].id;
                        if (_tempPssEleCount && cells[i].value.indexOf('Measure-') < 0) {
                            _tempPssEleCount['copyEle'][name] = symn;
                        }
                        if (cells[i].value.indexOf('Measure-') == 0 && _tempPssEleCount) {
                            _tempPssEleCount['measure'][name] = symn;
                            //_tempPssEleCount['measure'].push(symn);
                        }
                        if (_pssEle[symn].sym == 'oscg' && _tempPssEleCount) {
                            _tempPssEleCount['oscg'][name] = symn;
                            //_tempPssEleCount['measure'].push(symn);
                        }
                        // console.log(cells[i]);
                        if (cells[i].value.indexOf('Measure') >= 0 && _pssCtrl[name]) { //电气系统里的新测试元件，加入到ctrl里，兼容旧的
                            sym = _pssCtrl[name]["sym"]; // 获得元件的符号
                            _pssCtrlCount[sym]++; //元件符号计数+1
                            symn = sym + '-' + _pssCtrlCount[sym]; // 新的元件名称
                            // cells[i].value ? (cells[i].value = symn) : (cells[i].parent.value = symn); //更新视图里的符号显示
                            // cells[i].classname = symn;
                            _pssCtrl[symn] = {};
                            $.extend(true, _pssCtrl[symn], _pssCtrl[name]); //深度复制元件参数
                            _pssCtrl[symn]['_mid'] = cells[i].id;
                        }
                        break;

                    case 'ctrl':
                        //thutype = _pssCtrl[name]["thutype"];
                        sym = _pssCtrl[name]["sym"]; // 获得元件的符号
                        _pssCtrlCount[sym]++; //元件符号计数+1
                        symn = sym + '-' + _pssCtrlCount[sym]; // 新的元件名称
                        cells[i].value ? (cells[i].value = symn) : (cells[i].parent.value = symn); //更新视图里的符号显示
                        cells[i].classname = symn;
                        _pssCtrl[symn] = {};
                        $.extend(true, _pssCtrl[symn], _pssCtrl[name]); //深度复制元件参数
                        _pssCtrl[symn]['_mid'] = cells[i].id;
                        if (_tempPssEleCount) {
                            _tempPssEleCount['copyEle'][name] = symn;
                        }
                        break;
                    case 'pEm':
                        ;
                    case 'nEm':
                        ;
                    case 'Im':
                        sym = _pssCtrl[name]["sym"]; // 获得元件的符号
                        _pssCtrlCount[sym] = (_pssEleCount[sym]) ? ++_pssEleCount[sym] : ++_pssCtrlCount[sym]; //元件符号计数+1
                        symn = sym + '-' + _pssCtrlCount[sym]; // 新的元件名称
                        cells[i].value ? (cells[i].value = symn) : (cells[i].parent.value = symn); //更新视图里的符号显示
                        _pssCtrl[symn] = {};
                        $.extend(true, _pssCtrl[symn], _pssCtrl[name]); //深度复制元件参数
                        _pssCtrl[symn]['_mid'] = cells[i].id;
                        if (_tempPssEleCount) {
                            _tempPssEleCount['copyEle'][name] = symn;
                        }
                        break;

                        // 模块
                    case 'mod':
                        console.log(name)
                        sym = _pssMod[name]["sym"]; // 获得模块的符号
                        _pssModCount[sym]++; //模块符号计数+1
                        symn = sym + '-' + _pssModCount[sym]; // 新的模块名称
                        cells[i].value ? (cells[i].value = symn) : (cells[i].parent.value = symn); //更新视图里的符号显示
                        cells[i].classname = symn;
                        _pssMod[symn] = {};
                        $.extend(true, _pssMod[symn], _pssMod[name]); //深度复制模块参数
                        _pssMod[symn]['_mid'] = cells[i].id;
                        if (_tempPssEleCount) {
                            _tempPssEleCount['copyEle'][name] = symn;
                        }
                        break;
                    case 'heat':
                        sym = _pssEle[cells[i].classname]["classname"]; // 获得模块的符号
                        _pssEleCount[sym]++; //模块符号计数+1
                        symn = sym + '-' + _pssEleCount[sym]; // 新的模块名称

                        _pssEle[symn] = {};
                        $.extend(true, _pssEle[symn], _pssEle[cells[i].classname]); //深度复制模块参数
                        cells[i].classname = symn;
                        _pssEle[symn]['_mid'] = cells[i].id;
                        if (_tempPssEleCount) {
                            _tempPssEleCount['copyEle'][name] = symn;
                        }
                        break;
                    case 'CPS':
                        sym = _pssEle[cells[i].classname]["classname"]; // 获得模块的符号
                        _pssEleCount[sym]++; //模块符号计数+1
                        symn = sym + '-' + _pssEleCount[sym]; // 新的模块名称

                        _pssEle[symn] = {};
                        $.extend(true, _pssEle[symn], _pssEle[cells[i].classname]); //深度复制模块参数
                        cells[i].classname = symn;
                        _pssEle[symn]['_mid'] = cells[i].id;
                        if (_tempPssEleCount) {
                            _tempPssEleCount['copyEle'][name] = symn;
                        }
                        break;
                    case 'pscad':
                        sym = _pssEle[name]["sym"]; 
                        _pssEleCount[sym]++; //模块符号计数+1
                        symn= sym + '-' + _pssEleCount[sym];
                        _pssEle[symn] = {};
                        $.extend(true, _pssEle[symn], _pssEle[cells[i].classname]); //深度复制模块参数
                        cells[i].classname = symn;
                        _pssEle[symn]['_mid'] = cells[i].id;
                        mxUtils.createProxy(_pssEle[symn]);
                        if (_tempPssEleCount) {
                            _tempPssEleCount['copyEle'][name] = symn;
                        }
                        break;
                    case 'system':

                        if (parent.id != 1) {
                            alert(mxResources.get('cantPaste'));
                            _graph.removeCells([cells[i]]);
                            continue;
                        }
                        if (!mxUtils.confirm(mxResources.get('systemLabel'))) {
                            _graph.removeCells([cells[i]]);
                            continue;
                        }
                        //copyCell.subSystem.copySubSystem
                        sym = _pssSystem[name]["sym"];
                        _pssSystemCount[sym] = (_pssSystemCount[sym] == undefined) ? 0 : _pssSystemCount[sym];
                        _pssSystemCount[sym]++;
                        symn = sym + '-' + _pssSystemCount[sym];
                        cells[i].value ? (cells[i].value = symn) : (cells[i].parent.value = symn); //更新视图里的符号显示
                        _pssSystem[symn] = {};
                        $.extend(true, _pssSystem[symn], _pssSystem[name]); //深度复制模块参数
                        _pssSystem[symn]['_mid'] = cells[i].id;
                        var mxGraphModelcloneCellImpl = mxGraphModel.prototype.cloneCellImpl;
                        mxGraphModel.prototype.cloneCellImpl = function(cell, mapping, includeChildren, childrenName) {
                            var clone = this.cellCloned(cell);

                            // Stores the clone in the lookup table
                            mapping[mxObjectIdentity.get(cell)] = clone;

                            if (includeChildren) {
                                var childCount = this.getChildCount(cell);

                                for (var i = 0; i < childCount; i++) {
                                    if (cell.layersType == 'system') {

                                        var cloneChild = this.cloneCellImpl(
                                            this.getChildAt(cell, i), mapping, true, symn);
                                    } else {
                                        var cloneChild = this.cloneCellImpl(
                                            this.getChildAt(cell, i), mapping, true);
                                    }
                                    if (childrenName != null) {
                                        if (cloneChild.value != '') {
                                            if (cloneChild.value.indexOf(name + '.') >= 0) {
                                                cloneChild.value = cloneChild.value.replace(name + '.', childrenName + '.');
                                            } else {
                                                //cloneChild.value = childrenName + '.' + cloneChild.value;
                                            }

                                        }

                                    }

                                    clone.insert(cloneChild);
                                }
                            }

                            return clone;
                        };


                        if (_graph.isEnabled()) {
                            var newCell = null;


                            var mapping = {};
                            var tempSelection = _graph.model.getCell(cells[i].mappingPoint);
                            newCell = _graph.cloneCells([tempSelection], true, mapping)[0];
                            newCell.value = symn;
                            newCell.isOpen = false;
                            newCell.layersType = 'system';
                            newCell.mappingPoint = cells[i].id;
                            //  newCell.setVisible(true);

                            var tempPssEleCount = {
                                'copyEle': {},
                                'measure': {},
                                'oscg':{}
                            };
                            deepPaste(newCell.children, newCell, tempPssEleCount);
                            console.log(tempPssEleCount);
                            for (var key in tempPssEleCount.measure) {
                                _pssEle[tempPssEleCount.measure[key]]['param']['0']['value'] = tempPssEleCount.copyEle[_pssEle[tempPssEleCount.measure[key]]['param']['0']['value']] ? tempPssEleCount.copyEle[_pssEle[tempPssEleCount.measure[key]]['param']['0']['value']] : _pssEle[tempPssEleCount.measure[key]]['param']['0']['value'];
                            }
                            for (var key in tempPssEleCount.oscg) {
                                var value = _pssEle[tempPssEleCount.oscg[key]]['param']['1']['value'];
                                for (var indx = 0; indx < value.length; indx++) {
                                    if (tempPssEleCount.measure[value[indx]]) {
                                        value[indx] = tempPssEleCount.measure[value[indx]];
                                    }
                                }
                            }
                            newCell = _graph.addCell(newCell, _graph.model.root);
                            cells[i].mappingPoint = newCell.id;
                            var maxAddLenth = 0;
                            for (var ti = 0; ti < cells[i].children.length; ti++) {
                                var tempcell = _graph.model.getCell(cells[i].children[ti].mappingPoint);
                                cells[i].children[ti].mappingPoint = mapping[mxObjectIdentity.get(tempcell)].id;
                                if (mapping[mxObjectIdentity.get(tempcell)].value != undefined && mapping[mxObjectIdentity.get(tempcell)].value != '') {
                                    var tempHiValue = cells[i].children[ti].value;
                                    if (mapping[mxObjectIdentity.get(tempcell)].parent.thutype == 'mod') {
                                        cells[i].children[ti].value = mapping[mxObjectIdentity.get(tempcell)].parent.value + '.' + mapping[mxObjectIdentity.get(tempcell)].value;
                                    } else {
                                        cells[i].children[ti].value = mapping[mxObjectIdentity.get(tempcell)].value;
                                    }
                                    //cells[i].children[ti].value = mapping[mxObjectIdentity.get(tempcell)].value;
                                    maxAddLenth = (maxAddLenth > (cells[i].children[ti].value.length - tempHiValue.length)) ? maxAddLenth : (cells[i].children[ti].value.length - tempHiValue.length);
                                }
                            }
                            cells[i].geometry.width += maxAddLenth * 11;


                            _graph.model.setVisible(newCell, false);
                        }
                        break;

                }
            } finally {
                _graph.refresh(cells[i]);
                _graph.model.endUpdate();
            }

        }
    }
    deepPaste(pasteCells, nowParent);
    mxClipboard.insertCount++;
    _graph.setSelectionCells(pasteCells);
    return pasteCells;
}

function objCount(o) {
    var t = typeof o;
    if (t == 'string') {
        return o.length;
    } else if (t == 'object') {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return n;
    }
    return false;
};

/// 左侧与下方的窗口切换
function toggleLeft(self) {
    var dom = document.querySelector('.flip-left')
    var h = dom.clientHeight;
    var dis = dom.getAttribute('data-display') >> 0;
    if (dis == 0) {
        dom.className = 'flip-left show-left';
        dom.setAttribute('data-display', 1);
        self.src = "/static/icons/pin-1.png";
    } else {
        dom.className = 'flip-left';
        dom.setAttribute('data-display', 0);
        self.src = "/static/icons/pin.png";
    }
}

function toggleBottom(self) {
    var dom = document.querySelector('.flip-bottom')
    var h = dom.clientHeight;
    var dis = dom.getAttribute('data-display') >> 0;
    if (dis == 0) {
        dom.className = 'flip-bottom show-bottom';
        dom.setAttribute('data-display', 1);
        self.src = "/static/icons/pin-1.png";
    } else {
        dom.className = 'flip-bottom';
        dom.setAttribute('data-display', 0);
        self.src = "/static/icons/pin.png";
    }
}

function toggleRight(self) {
    var dom = document.querySelector('.component-panel')
        //~ var h = dom.clientHeight;
    var dis = dom.getAttribute('data-display') >> 0;
    if (dis == 0) {
        dom.className = 'component-panel show-right';
        dom.setAttribute('data-display', 1);
        self.src = "/static/icons/pin-1.png";
    } else {
        dom.className = 'component-panel';
        dom.setAttribute('data-display', 0);
        self.src = "/static/icons/pin.png";
    }
}
//更新左侧的已使用模块列表
// action =1 为添加 ，-1 为删除
// modname 要操作的模块名称
function updateModList(modname, action) {
    var ac = action || 1;
    console.log(ac);
    if (ac == 1) {
        _modList.push(modname);
        _modList.sort();
        var _html = '';
        for (var i = 0, l = _modList.length; i < l; i++) {
            _html += '<div class="module-list" onclick="showModProfileFromList(\'' + _modList[i] + '\')">' + _modList[i] + '</div>';
        }
        $('#modList').html(_html);

        //加载模块默认参数
        if ($.ajaxSettings.async == false) {
            add_mod_param_map_value(_mod_param, modname);
        } else {
            $.ajaxSettings.async = false;
            add_mod_param_map_value(_mod_param, modname);
            $.ajaxSettings.async = true;
        }
        //console.log(_mod_param);
        return;
    } else {
        //删除模块参数
        del_mod_param_map_value(_mod_param, modname);
    }


    var modlist = $('#modList').children('div');
    var idx = null;
    for (var i = 0, l = modlist.length; i < l; i++) {
        if (modname == modlist[i].innerHTML) {
            idx = i;
        }
    }
    if (null == idx) {
        return;
    }
    modlist.eq(idx).remove();
    _modList.splice(idx, 1);
}

// 下载仿真结果文件
function downResult() {
    window.open('/static/result/r_' + _task_id);
}


// 重写删除操作
mxGraph.prototype.cellsRemoved = function(cells) {
    if (cells != null && cells.length > 0) {
        var scale = this.view.scale;
        var tr = this.view.translate;

        this.model.beginUpdate();
        try {
            // Creates hashtable for faster lookup
            var hash = new Object();
            for (var i = 0; i < cells.length; i++) {
                // Disconnects edges which are not in cells
                var edges = this.getConnections(cells[i]);

                for (var j = 0; j < edges.length; j++) {
                    var id = mxCellPath.create(edges[j]);

                    if (hash[id] == null) {
                        var geo = this.model.getGeometry(edges[j]);

                        if (geo != null) {
                            var state = this.view.getState(edges[j]);

                            if (state != null) {
                                geo = geo.clone();
                                var source = state.getVisibleTerminal(true) == cells[i];
                                var pts = state.absolutePoints;
                                var n = (source) ? 0 : pts.length - 1;

                                geo.setTerminalPoint(
                                    new mxPoint(pts[n].x / scale - tr.x,
                                        pts[n].y / scale - tr.y), source);
                                this.model.setTerminal(edges[j], null, source);
                                this.model.setGeometry(edges[j], geo);
                            }
                        }
                    }
                }
                // function getSId(obj){
                //     try{
                //       if("0" != obj.parent.parent.id)
                //        return getSId(obj.parent);
                //       else{

                //         return obj
                //       }
                //     }catch(err){
                //       console.log(err);
                //       return null;
                //     }
                //   }
                //   var p=getSId(cells[i])
                //   if(p!=null){
                //
                this.model.remove(cells[i]);
                // }

            }

            this.fireEvent(new mxEventObject(mxEvent.CELLS_REMOVED, 'cells', cells));
        } finally {
            _graph.clearSelection();
            this.model.endUpdate();
        }
        // 从左侧中移除模块列表
        for (var i = 0, l = cells.length; i < l; i++) {
            if (cells[i]) {
                if (cells[i]['thutype'] == 'mod') {
                    updateModList(cells[i]['value'], -1);
                }
            }

        }
    }
}

function setMsrStatus(){
    var $tr=$('.grptr');
    var $chk = null;
    for( var i=0;i<$tr.length;i++){
        $chk = $($tr[i]).find('input');
        for(var j=0;j<$chk.length;j++){
            var x = _.pluck( _pssDspgrp[i],'comp')
            if( x.indexOf( $chk[j].value ) >= 0 )
                $chk[j].checked=true;
        }
    }
}
function saveDspGrp(s,iid,nn){
/*
 * _pssDspgrp: [
 *  [{'comp':'Im-1','name':'电流测量一'},{'comp':'Im-2','name':'我的测量名称'}],
 *  [{'comp':'Im-1','name':'电流测量一'},{'comp':'Im-2','name':'我的测量名称'}]
 * ]
 * */
    var $tr = $('.grptr'),$in=null;
    var _grpstr = [];var tmp={'comp':'','name':''},tmpar=[];
    var mets = [],met=[200,201,202];
    for(var x in _pssEle){
        if( met.indexOf(_pssEle[x]['type']>>0) >=0 ){
            mets.push( x );
        }
    }
    var tt = null;

    for( var i=0;i<$tr.length;i++){
        $in = $($tr[i]).find('input');tmpar=[];tmp = {'comp':'','name':''};
        for(var j=0;j<$in.length;j++){
            //~ console.log(j,$in[j].checked,$in[j].value);
            tmp = {'comp':'','name':''}
            if( $in[j].checked == true ){
                //~ tmpstr += $in[j].value +',';
                tmp['comp'] = $in[j].value;
                tmp['name'] = _pssEle[ $in[j].value ]['lengend']||tmp['comp'];
                tmpar.push( tmp );
            }

            /*
            // 将中文逗号，中英文空格，英文逗号，中文逗号替换为英文逗号
            tmpstr = $in[j].value.replace(/，| |;|；|　/g,',');
            tt = tmpstr.split(',');
            for( var k=0;k<tt.length;k++){
                if( mets.indexOf( tt[k] ) < 0 ){
                    setSysInfo('warging','您要显示的量测元件'+tt[k]+'不存在');
                    alert('您要显示的量测元件'+tt[k]+'不存在');
                    return;
                }
            }*/
        }
        //~ console.log( 'tmpstr is ',tmpstr)
        //~ tmpstr = tmpstr.substr(0,tmpstr.length-1);
        //~ if( tmpstr.length<1) continue;
        //~ _grpstr += tmpstr;
        //~ _grpstr +=';'
        if( tmpar.length > 0 )
            _grpstr.push( tmpar );
    }

    // todo:检验被测元件是否存在
    //~ _pssDspgrp = _grpstr.substr(0,_grpstr.length-1);//去掉末尾的英文分号

    _pssDspgrp = _grpstr;
    //~ _pssDspgrp = _.uniq( _pssDspgrp );
    //_wndEleParam.hide();
    saveanimate();
}

function del_mod_param_map_value(_mod_param,modname){
    _mod_param[modname] = undefined;
  }