/*
 * 初始化工作台部分界面操作，主要时连接线样式
 * */

var _editorUI = null;


// 初始化主编辑器
//initMainEditor start
function initMainEditor(editorui) {
  if (!mxClient.isBrowserSupported()) { //如果浏览器不支持
    mxUtils.error('您的浏览器过旧，请更新浏览器来使用本程序。', 200, false);
    return;
  }
  
  var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
  if (isChrome) {
        //alert("是Chrome浏览器");
    } else {
        alert("检查到您使用的浏览器不是Chrome浏览器，可能导致部分功能无法使用。\n请使用Chrome浏览器以获得最佳体验。");
  }
  
  //var container = document.getElementById('mainEditor');
  //_editor = new mxEditor();
  iniParam();
  // initEleParam();

  
  _editorUI = editorui;
  _editor = editorui.editor;
  _graph = _editor.graph;

  
  var model = _graph.getModel();

  var config = mxUtils.load('static/editor/keyhandler-commons.xml').getDocumentElement();
  _graph.setPanning(true);
  _graph.setConnectable(true);
  _graph.setConnectableEdges(true);
  _graph.setDisconnectOnMove(false);
  
  _graph.panningHandler.isPopupTrigger = function() {
    return false;
  };
  
  //from mxClient.js
  new mxRubberband(_graph);
  
  /*****/
  var ports = [];
  ports['n'] = {
    x: 0.5,
    y: 0.5,
    perimeter: true,
    constraint: 'north'
  };
  
  mxShape.prototype.getPorts = function() {
    return ports;
  };
  
  mxLine.prototype.getPorts = function() {
      var ports = {};
      if (this.style.align == 'left') {
        ports['n'] = {
          x: 0,
          y: 0.5,
          perimeter: true,
          constraint: 'north'
        };
      } else if (this.style.align == 'right') {
        ports['n'] = {
          x: 1,
          y: 0.5,
          perimeter: true,
          constraint: 'north'
        };
      } else {
        ports = null;
      }

      return ports;
  };
  
  
	// Disables floating connections (only connections via ports allowed)
	_graph.connectionHandler.isConnectableCell = function(cell)
	{
	
	   if (this.graph.getModel().isEdge(cell))
	  {
	    return true;
	  }else{
	    // var geo = (cell != null) ? this.graph.getCellGeometry(cell) : null;
	    var isbus= (cell != null)?cell.isBus:false
	    return isbus;
	    //return (geo != null) ? geo.relative : false;
	  }
	};
	
	mxEdgeHandler.prototype.isConnectableCell = function(cell){
	  return _graph.connectionHandler.isConnectableCell(cell);
	};

  // _graph.isCellResizable= function(cell)
  // {
  //   if( cell['txt']>>0 == 1 ){

  //     return true;
  //   }else{

  //     if( cell.thutype && cell.value !=''){
  //       return true;
  //     }{
  //       return false;
  //     }
  //     return false;
  //   }
  // };
	
	
  // Disables existing port functionality
  _graph.view.getTerminalPort = function(state, terminal, source) {
    return terminal;
  };

  // // Returns all possible ports for a given terminal
  // _graph.getAllConnectionConstraints = function(terminal, source) {
  //   if (terminal != null && terminal.shape != null &&
  //     terminal.shape.stencil != null) {
  //     // for stencils with existing constraints...
  //     if (terminal.shape.stencil != null) {
  //       return terminal.shape.stencil.constraints;
  //     }
  //   } else if (terminal != null && this.model.isVertex(terminal.cell)) {
  //     if (terminal.shape != null) {
  //       var ports = terminal.shape.getPorts();
  //       var cstrs = new Array();

  //       for (var id in ports) {
  //         var port = ports[id];

  //         var cstr = new mxConnectionConstraint(new mxPoint(port.x, port.y), port.perimeter);
  //         cstr.id = id;
  //         cstrs.push(cstr);
  //       }

  //       return cstrs;
  //     }
  //   }

  //   return null;
  // };

  // Sets the port for the given connection
  // _graph.setConnectionConstraint = function(edge, terminal, source, constraint) {
  //   if (constraint != null) {
  //     var key = (source) ? mxConstants.STYLE_SOURCE_PORT : mxConstants.STYLE_TARGET_PORT;

  //     if (constraint == null || constraint.id == null) {
  //       this.setCellStyles(key, null, [edge]);
  //     } else if (constraint.id != null) {
  //       this.setCellStyles(key, constraint.id, [edge]);
  //     }
  //   }
  // };

  
  // Returns the port for the given connection
  var graphgetConnectionConstraint=_graph.getConnectionConstraint;
  
  _graph.getConnectionConstraint = function(edge, terminal, source) {

    if (terminal && terminal.cell.edge) {
      return new mxConnectionConstraint(null, null);
    } else {
      return graphgetConnectionConstraint(edge, terminal, source);
    }
  };

  var labelBackground = '#FFFFFF';
  var fontColor = '#000000';
  var strokeColor = '#000000';
  var fillColor = '#FFFFFF';

  var style = _graph.getStylesheet().getDefaultEdgeStyle();
  delete style['endArrow'];
  style[mxConstants.STYLE_ROUNDED] = false;
  style['strokeColor'] = strokeColor;
  style['labelBackgroundColor'] = labelBackground;
//  style['edgeStyle'] = 'wireEdgeStyle'; //default edge style is straight line
  style['fontColor'] = fontColor;
  style['fontSize'] = '9';
  style['movable'] = '0';
  style['strokeWidth'] = MAIN.strokeWidth;
  //style['rounded'] = '10';

  // Sets join node size
  style['startSize'] = MAIN.joinNode;
  style['endSize'] = MAIN.joinNode;
  // style['endArrow']='oval';
  // style['endFill']=1;
  //style['startArrow']='oval'
  //style['startFill']=1;
  style = _graph.getStylesheet().getDefaultVertexStyle();
  style['gradientDirection'] = 'south';
  //style['gradientColor'] = '#909090';
  style['strokeColor'] = strokeColor;
  style['fillColor'] = '#e0e0e0';
  style['fillColor'] = 'none';
  style['fontColor'] = fontColor;
  style['fontStyle'] = '1';
  style['fontSize'] = '12';
  // style['resizable'] = '0';
  style['rounded'] = '1';
  style['strokeWidth'] = MAIN.strokeWidth;

  //~ style['rounded'] = '1';
  //~ style[mxConstants.STYLE_STROKEWIDTH] = MAIN.strokeWidth;

  undoManager = new mxUndoManager();
  
  var listener = function(sender, evt) {
    undoManager.undoableEditHappened(evt.getProperty('edit'));
  };
  
  _graph.getModel().addListener(mxEvent.UNDO, listener);
  
  _graph.getView().addListener(mxEvent.UNDO, listener);

  var outln = new mxOutline(_graph, document.getElementById('graphOutLine'));
 
  /**
   * [connectionHandlerMouseUp description]
   * @type {[type]}
   */
  var connectionHandlerMouseUp = _graph.connectionHandler.mouseUp;
  
  mxConnectionHandler.prototype.waypointsEnabled = true;
  
  _graph.connectionHandler.mouseUp = function(sender, me) {

    if (this.first != null && this.previous != null) {
      sender.popupMenuHandler.inTolerance = false;
      var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
      var dx = Math.abs(point.x - this.first.x);
      var dy = Math.abs(point.y - this.first.y);

      if (dx < this.graph.tolerance && dy < this.graph.tolerance) {
        return;
      }
    }
    mxClipboard.insertCount = 1;
    connectionHandlerMouseUp.apply(this, arguments);
  };
  
  //toastparam
  toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": true,
      "progressBar": false,
      /*"positionClass": "toast-bottom-center",*/
      "positionClass": "toast-top-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "3000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
  
} 


//initMainEditor end


/**
 * 重写mouseUp函数解决元件内部元素被单独拖动的问题
 *
 */
mxGraphHandler.prototype.mouseUp = function(sender, me) {
  if (!me.isConsumed()) {
    var graph = this.graph;

    if (this.cell != null && this.first != null && this.shape != null &&
      this.currentDx != null && this.currentDy != null) {
      var cell = me.getCell();


      if (this.connectOnDrop && this.target == null && cell != null && graph.getModel().isVertex(cell) &&
        graph.isCellConnectable(cell) && graph.isEdgeValid(null, this.cell, cell)) {
        graph.connectionHandler.connect(this.cell, cell, me.getEvent());
      } else {
        //var clone = graph.isCloneEvent(me.getEvent()) && graph.isCellsCloneable() && this.isCloneEnabled();
        var clone = false;
        var scale = graph.getView().scale;
        var dx = this.roundLength(this.currentDx / scale);
        var dy = this.roundLength(this.currentDy / scale);
        var target = this.target;

        if (graph.isSplitEnabled() && graph.isSplitTarget(target, this.cells, me.getEvent())) {
          graph.splitEdge(target, this.cells, null, dx, dy);
        } else {
          var parentList = graph.getSelectParents();
          //var parentList = _graph.getSelectParents();//这是原版，会导致不同画布下对象选取bug
          this.moveCells(parentList, dx, dy, clone, this.target, me.getEvent());
        }
      }
    } else if (this.isSelectEnabled() && this.delayedSelection && this.cell != null) {
      this.selectDelayed(me);
    }
  }
  // Consumes the event if a cell was initially clicked
  if (this.cellWasClicked) {
    me.consume();
  }

  
  this.reset();
  
}; //endmouseUp


function flushModRecPush(iid, nn, p) {
	
  _pssModRec = [];

  _pssModRec.push(nn);
  
  //~ _curModId=_pssMod[nn]['id'];
  //~ _curModSym=nn

  $('#modVNav').html('<a onclick="" class="mod-vnav">' + nn + '</a>');
}


// ----------------------------------------------------------------------------------------- //
// Computes the position of edge to edge connection points.
mxGraphView.prototype.updateFixedTerminalPoint = function(edge, terminal, source, constraint) {
  var pt = null;
  if (constraint != null) {
   //if(_editorUI.floorChange==4){
      pt = this.graph.getConnectionPoint(terminal, constraint);
   // }

  }

  if (source) {
    edge.sourceSegment = null;
  } else {
    edge.targetSegment = null;
  }

  if (pt == null) {
    var s = this.scale;
    var tr = this.translate;
    var orig = edge.origin;
    var geo = this.graph.getCellGeometry(edge.cell);
    pt = geo.getTerminalPoint(source);

    // Computes edge-to-edge connection point
    if (pt != null) {
      pt = new mxPoint(s * (tr.x + pt.x + orig.x),
        s * (tr.y + pt.y + orig.y));

      // Finds nearest segment on edge and computes intersection
      if (terminal != null && terminal.absolutePoints != null) {
        var seg = mxUtils.findNearestSegment(terminal, pt.x, pt.y);

        // Finds orientation of the segment
        var p0 = terminal.absolutePoints[seg];
        var pe = terminal.absolutePoints[seg + 1];
        var horizontal = (p0.x - pe.x == 0);

        // Stores the segment in the edge state
        var key = (source) ? 'sourceConstraint' : 'targetConstraint';
        var value = (horizontal) ? 'horizontal' : 'vertical';
        edge.style[key] = value;

        // Keeps the coordinate within the segment bounds
        if (horizontal) {
          pt.x = p0.x;
          pt.y = Math.min(pt.y, Math.max(p0.y, pe.y));
          pt.y = Math.max(pt.y, Math.min(p0.y, pe.y));
        } else {
          pt.y = p0.y;
          pt.x = Math.min(pt.x, Math.max(p0.x, pe.x));
          pt.x = Math.max(pt.x, Math.min(p0.x, pe.x));
        }
      }
    }
    // Computes constraint connection points on vertices and ports
    else if (terminal != null && terminal.cell.geometry.relative) {
      pt = new mxPoint(this.getRoutingCenterX(terminal),
        this.getRoutingCenterY(terminal));
    }

    // Snaps point to grid
    // if (pt != null)
    // {
    //   var tr = this.graph.view.translate;
    //   var s = this.graph.view.scale;

    //   pt.x = (this.graph.snap(pt.x / s - tr.x) + tr.x) * s;
    //   pt.y = (this.graph.snap(pt.y / s - tr.y) + tr.y) * s;
    // }
  }

  edge.setAbsoluteTerminalPoint(pt, source);
};

// Sets source terminal point for edge-to-edge connections.
mxConnectionHandler.prototype.createEdgeState = function(me) {
    if(_editorUI.floorChange == '4'){
      var style = this.graph.createCurrentEdgeStyle();
      var edge = this.graph.createEdge(null, null, null, null, null, style);
    }else{
      var edge = this.graph.createEdge();
      edge.style='';
    }

 // var style = this.graph.createCurrentEdgeStyle();
 // var edge = this.graph.createEdge(null, null, null, null, null, style);
  if (this.sourceConstraint != null && this.previous != null) {
    edge.style += mxConstants.STYLE_EXIT_X + '=' + this.sourceConstraint.point.x + ';' +
      mxConstants.STYLE_EXIT_Y + '=' + this.sourceConstraint.point.y + ';';
  } else if (this.graph.model.isEdge(me.getCell())) {
    var scale = this.graph.view.scale;
    var tr = this.graph.view.translate;
    var pt = new mxPoint(this.graph.snap(me.getGraphX() / scale) - tr.x,
      this.graph.snap(me.getGraphY() / scale) - tr.y);
    edge.geometry.setTerminalPoint(pt, true);
  }

  return this.graph.view.createState(edge);
};

// Uses right mouse button to create edges on background (see also: lines 67 ff)
mxConnectionHandler.prototype.isStopEvent = function(me) {
  return me.getState() != null || mxEvent.isRightMouseButton(me.getEvent());
};

// Updates target terminal point for edge-to-edge connections.
mxConnectionHandlerUpdateCurrentState = mxConnectionHandler.prototype.updateCurrentState;
mxConnectionHandler.prototype.updateCurrentState = function(me) {
  mxConnectionHandlerUpdateCurrentState.apply(this, arguments);

  if (this.edgeState != null) {
    this.edgeState.cell.geometry.setTerminalPoint(null, false);

    if (this.shape != null && this.currentState != null &&
      this.currentState.view.graph.model.isEdge(this.currentState.cell)) {
      var scale = this.graph.view.scale;
      var tr = this.graph.view.translate;
      var pt = new mxPoint(this.graph.snap(me.getGraphX() / scale) - tr.x,
        this.graph.snap(me.getGraphY() / scale) - tr.y);
      this.edgeState.cell.geometry.setTerminalPoint(pt, false);
    }
  }
};

// Updates the terminal and control points in the cloned preview.
mxEdgeSegmentHandler.prototype.clonePreviewState = function(point, terminal) {
  var clone = mxEdgeHandler.prototype.clonePreviewState.apply(this, arguments);
  clone.cell = clone.cell.clone();

  if (this.isSource || this.isTarget) {
    clone.cell.geometry = clone.cell.geometry.clone();

    // Sets the terminal point of an edge if we're moving one of the endpoints
    if (this.graph.getModel().isEdge(clone.cell)) {
      // TODO: Only set this if the target or source terminal is an edge
      clone.cell.geometry.setTerminalPoint(point, this.isSource);
    } else {
      clone.cell.geometry.setTerminalPoint(null, this.isSource);
    }
  }

  return clone;
};

var mxEdgeHandlerConnect = mxEdgeHandler.prototype.connect;
mxEdgeHandler.prototype.connect = function(edge, terminal, isSource, isClone, me) {
  var result = null;
  var model = this.graph.getModel();
  var parent = model.getParent(edge);

  model.beginUpdate();
  try {
    result = mxEdgeHandlerConnect.apply(this, arguments);
    var geo = model.getGeometry(result);

    if (geo != null) {
      geo = geo.clone();
      var pt = null;

      if (model.isEdge(terminal)) {
        pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1];
        pt.x = pt.x / this.graph.view.scale - this.graph.view.translate.x;
        pt.y = pt.y / this.graph.view.scale - this.graph.view.translate.y;

        var pstate = this.graph.getView().getState(
          this.graph.getModel().getParent(edge));

        if (pstate != null) {
          pt.x -= pstate.origin.x;
          pt.y -= pstate.origin.y;
        }

        pt.x -= this.graph.panDx / this.graph.view.scale;
        pt.y -= this.graph.panDy / this.graph.view.scale;
      }

      geo.setTerminalPoint(pt, isSource);
      model.setGeometry(edge, geo);
    }
  } finally {
    model.endUpdate();
  }

  return result;
};

mxGraphGetCellStyle = mxGraph.prototype.getCellStyle;
mxGraph.prototype.getCellStyle = function(cell) {
  var style = mxGraphGetCellStyle.apply(this, arguments);

  if (style != null && this.model.isEdge(cell)) {
    style = mxUtils.clone(style);

    if (this.model.isEdge(this.model.getTerminal(cell, true)) || (this.model.getTerminal(cell, true) && this.model.getTerminal(cell, true).parent && (this.model.getTerminal(cell, true).parent.thutype == 'system' || this.model.getTerminal(cell, true).parent.thutype == 'timing'))) {
      style['startArrow'] = 'oval';
    }

    if (this.model.isEdge(this.model.getTerminal(cell, false)) || (this.model.getTerminal(cell, false) && this.model.getTerminal(cell, false).parent && (this.model.getTerminal(cell, false).parent.thutype == 'system' || this.model.getTerminal(cell, false).parent.thutype == 'timing'))) {
      style['endArrow'] = 'oval';
    }
  }

  return style;
};



mxEdgeStyle.WireConnector = function(state, source, target, hints, result) {
  // Creates array of all way- and terminalpoints
  var pts = state.absolutePoints;
  var horizontal = true;
  var hint = null;

  // Gets the initial connection from the source terminal or edge
  if (source != null && state.view.graph.model.isEdge(source.cell)) {
    horizontal = state.style['sourceConstraint'] == 'horizontal';
  } else if (source != null) {
    horizontal = source.style['portConstraint'] != 'vertical';

    // Checks the direction of the shape and rotates
    var direction = source.style[mxConstants.STYLE_DIRECTION];

    if (direction == 'north' || direction == 'south') {
      horizontal = !horizontal;
    }
  }

  // Adds the first point
  // TODO: Should move along connected segment
  var pt = pts[0];

  if (pt == null && source != null) {
    pt = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source));
  } else if (pt != null) {
    pt = pt.clone();
  }

  var first = pt;

  // Adds the waypoints
  if (hints != null && hints.length > 0) {
    // FIXME: First segment not movable
    /*hint = state.view.transformControlPoint(state, hints[0]);
    mxLog.show();
    mxLog.debug(hints.length,'hints0.y='+hint.y, pt.y)

    if (horizontal && Math.floor(hint.y) != Math.floor(pt.y))
    {
      mxLog.show();
      mxLog.debug('add waypoint');

      pt = new mxPoint(pt.x, hint.y);
      result.push(pt);
      pt = pt.clone();
      //horizontal = !horizontal;
    }*/

    for (var i = 0; i < hints.length; i++) {
      horizontal = !horizontal;
      hint = state.view.transformControlPoint(state, hints[i]);

      if (horizontal) {
        if (pt.y != hint.y) {
          pt.y = hint.y;
          result.push(pt.clone());
        }
      } else if (pt.x != hint.x) {
        pt.x = hint.x;
        result.push(pt.clone());
      }
    }
  } else {
    hint = pt;
  }

  // Adds the last point
  pt = pts[pts.length - 1];

  // TODO: Should move along connected segment
  if (pt == null && target != null) {
    pt = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target));
  }

  if (horizontal) {
    if (pt.y != hint.y && first.x != pt.x) {
      result.push(new mxPoint(pt.x, hint.y));
    }
  } else if (pt.x != hint.x && first.y != pt.y) {
    result.push(new mxPoint(hint.x, pt.y));
  }
};
//bug: default Connector is wireEdgeStyle,but runtime is straight
//mxStyleRegistry.putValue('wireEdgeStyle', mxEdgeStyle.WireConnector);

// This connector needs an mxEdgeSegmentHandler
mxGraphCreateHandler = mxGraph.prototype.createHandler;
mxGraph.prototype.createHandler = function(state) {
  var result = null;

  if (state != null) {
    if (this.model.isEdge(state.cell)) {
      var style = this.view.getEdgeStyle(state);

      if (style == mxEdgeStyle.WireConnector) {
        return new mxEdgeSegmentHandler(state);
      }
    }
  }

  return mxGraphCreateHandler.apply(this, arguments);
};

//---------------------
mxGraph.prototype.isValidRoot = function() {
  return false;
};

// 重写该方法，防止元素内的元件被移动
mxGraph.prototype.isCellMovable = function(cell) {


  if (cell.thutype == 'chart') {
    return false;
  }
  return true;

}

// Selects descendants before children selection mode
var graphHandlerGetInitialCellForEvent = mxGraphHandler.prototype.getInitialCellForEvent;
mxGraphHandler.prototype.getInitialCellForEvent = function(me) {
  var model = this.graph.getModel();
  var psel = model.getParent(this.graph.getSelectionCell());
  var cell = graphHandlerGetInitialCellForEvent.apply(this, arguments);
  var parent = model.getParent(cell);

  if (psel == null || (psel != cell && psel != parent)) {
      // child cell cannot be selected. --zhanglw 2018.07.26
      while (model.isVertex(parent) && (!this.graph.isValidRoot(parent) || parent.style=='group')) {
          cell = parent;
          parent = model.getParent(cell);
      }
      // while (!this.graph.isCellSelected(cell) && !this.graph.isCellSelected(parent) &&
      //   model.isVertex(parent) && !this.graph.isValidRoot(parent)) {
      //   cell = parent;
      //   parent = this.graph.getModel().getParent(cell);
      // }
      // END --zhanglw 2018.07.26
  }
  return cell;
};

// Selection is delayed to mouseup if child selected
var graphHandlerIsDelayedSelection = mxGraphHandler.prototype.isDelayedSelection;
mxGraphHandler.prototype.isDelayedSelection = function(cell) {
  var result = graphHandlerIsDelayedSelection.apply(this, arguments);
  var model = this.graph.getModel();
  var psel = model.getParent(this.graph.getSelectionCell());
  var parent = model.getParent(cell);

  if (psel == null || (psel != cell && psel != parent)) {
    if (!this.graph.isCellSelected(cell) && model.isVertex(parent) && !this.graph.isValidRoot(parent)) {
      result = true;
    }
  }

  return result;
};

// Delayed selection of parent group
mxGraphHandler.prototype.selectDelayed = function(me) {
  var cell = me.getCell();

  if (cell == null) {
    cell = this.cell;
  }

  var model = this.graph.getModel();
  var parent = model.getParent(cell);
    // child cell cannot be selected. --zhanglw 2018.07.26
    while (model.isVertex(parent) && (!this.graph.isValidRoot(parent) || parent.style=='group')) {
        cell = parent;
        parent = model.getParent(cell);
    }
    // while (this.graph.isCellSelected(cell) && model.isVertex(parent) && !this.graph.isValidRoot(parent)) {
    //     cell = parent;
    //     parent = model.getParent(cell);
    // }
    // END --zhanglw 2018.07.26
  this.graph.selectCellForEvent(cell, me.getEvent());
};

// Returns last selected ancestor
mxPopupMenuHandler.prototype.getCellForPopupEvent = function(me) {
  var cell = me.getCell();
  var model = this.graph.getModel();
  var parent = model.getParent(cell);
  while (model.isVertex(parent) && !this.graph.isValidRoot(parent)) {
    if (this.graph.isCellSelected(parent)) {
      cell = parent;
    }
    parent = model.getParent(parent);
  }
  return cell;
};

// 重写该方法，防止元素内的元素被删除
mxGraph.prototype.isCellDeletable = function(cell) {
  return true;
  // var state = this.view.getState(cell);
  // var style = (state != null) ? state.style : this.getCellStyle(cell);
  // if( cell.thutype || cell.edge)
  //        return this.isCellsDeletable() && style[mxConstants.STYLE_DELETABLE] != 0;
  //  else if(cell.txt==1)
  //        return true;
  //  else
  //        return false;
};



function saveanimate() {
  var htmlValue = $('.btnchange').html();
  $('.btnchange').css('background-color', '#BFBFBF');
  $('.btnchange').addClass('disabled');
  $('.btnchange').html(mxResources.get('SavingEle'));
  
  setTimeout(function() {
    $('.btnchange').css('background-color', '');
    $('.btnchange').removeClass('disabled');
    $('.btnchange').html(htmlValue);
  }, 300);
}

//设置一个元件的两端可以相连
mxGraphModel.prototype.maintainEdgeParent = false;


//Added by wugh
//add search
//toolbar
/*
$('.geToolbar').ready(function() {
	
  var html = '<div style="padding: 2px 30px 0px 0px;float: right;width: 218px;white-space: nowrap;text-overflow: clip;padding-bottom: 8px;cursor: default;">\
    <input placeholder="Search Cell" type="text" id="sear" style="font-size: 12px;overflow: hidden;box-sizing: border-box;border: 1px solid rgb(213, 213, 213);border-radius: 4px;width: 100%;outline: none;padding: 6px 20px 6px 6px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEaSURBVHjabNGxS5VxFIfxz71XaWuQUJCG/gCHhgTD9VpEETg4aMOlQRp0EoezObgcd220KQiXmpretTAHQRBdojlQEJyukPdt+b1ywfvAGc7wnHP4nlZd1yKijQW8xzNc4Su+ZOYfQ3T6/f4YNvEJYzjELXp4VVXVz263+7cR2niBxAFeZ2YPi3iHR/gYERPDwhpOsd6sz8x/mfkNG3iOlWFhFj8y89J9KvzGXER0GuEaD42mgwHqUtoljbcRsTBCeINpfM/MgZLKPpaxFxGbOCqDXmILN7hoJrTKH+axhxmcYRxP0MIDnOBDZv5q1XUNIuJxifJp+UNV7t7BFM6xeic0RMQ4Bpl5W/ol7GISx/eEUUTECrbx+f8A8xhiZht9zsgAAAAASUVORK5CYII=" title="Search" style="position: relative; left: -18px; top: 2px; background: url(&quot;data:image/gif;base64,R0lGODlhMAAwAIAAAP///wAAACH5BAEAAAAALAAAAAAwADAAAAIxhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8egpAAA7&quot;);"></div>';

  $('.geToolbar').append(html);

});
*/