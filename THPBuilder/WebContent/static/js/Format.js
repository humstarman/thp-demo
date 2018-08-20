/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
Format = function(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.labelIndex = 0;

/**
 * Returns information about the current selection.
 */
Format.prototype.currentIndex = 0;

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	this.update = mxUtils.bind(this, function(sender, evt)
	{
		//before upating formatpane ,checkout saveflag.changed vaule if it needs to be saved
		//
		
		this.clearSelectionState();
		this.refresh();

		//动态数据
        this.AfterRefresh();
		
	});
	
	graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
	graph.addListener(mxEvent.EDITING_STARTED, this.update);
	graph.addListener(mxEvent.EDITING_STOPPED, this.update);
	graph.getModel().addListener(mxEvent.CHANGE, this.update);
	graph.addListener(mxEvent.ROOT, mxUtils.bind(this, function()
	{
		this.refresh();

        this.AfterRefresh();
		
	}));
	
	this.refresh();

    this.AfterRefresh();
	
};


/*动态参数面板配置*/
Format.prototype.AfterRefresh = function() {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var cells = this.editorUi.editor.graph.getSelectionCells();
    

    //var scell = _graph.getSelectionCells();
    var scell = this.editorUi.editor.graph.getSelectionCells();
    //var selectParents = _graph.getSelectParents();
    if (cells.length == 0) {
        return;
    }
    
    //if (cells[0].edge) return;
    var iid = "-1"
    var nn = ''
    var p = {} //被双击的元件的父级
    function getSId(obj) {

        try {
            if ("0" != obj.parent.parent.id) {
                getSId(obj.parent);
            } else {
                iid = obj.id
                nn = obj.getValue()
                p = obj
                return
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    try {
        if (scell[0].parent) {
            getSId(scell[0]);
        }

        var meters = 'Measure';
        var tmpn = p.value.split('-')[0];
    } catch (err) {
        // graph.clearSelection();
        return;
    }


    /*if (tmpn == 'osc') { //示波器
        setMsrStatus();
        //showOscProfile(iid,nn,p);
        return;
    }*/
//    if (cells.length==1 && p.tableName == undefined) {
//    	p.tableName = "analog_value";
//    }    
//    if (cells.length==1 && p.recordId == undefined) {    	
//   	p.recordId = "32";
//    }  
 //   if (cells.length==1 && p.valueChange == undefined) {    	
 //   	p.valueChange = "ita1 = item.getProperty(\"value\");item.setProperty(\"text\",ita1);";
 //   }
    
//    if (p.txt != undefined && p.txt == 3) {
//        if ($('#caltab1').highcharts() == undefined) {
//            getSimuResultFromRedis();
//            $('.highcharts-container').css('position', '');
//        } else {
//            $('.highcharts-container').css('position', '');
//        }
//
//        $(".tab_content").hide(); //Hide all content
//        $("ul.tabs li:first").addClass("active").show(); //Activate first tab
//        $(".tab_content:first").show(); //Show first tab content
//
//        //On Click Event
//        $("ul.tabs li").click(function() {
//            var index = $(this).index();
//            $("ul.tabs li").removeClass("active"); //Remove any "active" class
//            $("ul.tabs li").removeClass("is-active");
//            $(this).addClass("active"); //Add "active" class to selected tab
//            $(this).addClass("is-active");
//            $(".tab_content").hide(); //Hide all tab content
//            var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
//            $(activeTab).show(); //Fade in the active content
//            return false;
//        });
//    }
//
//    if (p.thutype == 'ele' || p.thutype == 'gnd') {
//        var d = $('#ParamElePanel').find('input');
//        d.keydown(function(evt) {
//            if (evt.keyCode == 13 /* Enter */ ) {
//                //console.log(evt.keyCode);
//                $('#spansaveeleparam').click();
//            }
//        });
//    }
    
    
//    //return;
//    /*try {
//            // something
//            if(scell[0].edge) return;
//        } catch(e) {
//            // statements
//            console.log(e);
//             //window.location.href = "http://stackoverflow.com/search?q=[js]"+e.message;
//        }
//
//
//    var iid = "-1"
//    var nn = ''
//    var p = {}//被双击的元件的父级
//    function getSId(obj){
//        if("1" != obj.parent.id)
//          getSId(obj.parent);
//        else{
//          iid = obj.id
//          nn = obj.getValue()
//          p = obj
//          return
//        }
//      }*/
//    //getSId(scell[0]);
//    //~ console.log('----p.thuype',p.value);
//
//    /*    if( tmpn == 'osc' ){ //示波器
//            this.container.appendChild(this.addParamOscProfile(this.createPanel(),iid,nn,p));
//            setMsrStatus();
//          //showOscProfile(iid,nn,p);
//          return;
//        }*/

}


/**
 * Returns information about the current selection.
 */
Format.prototype.clearSelectionState = function()
{
	this.selectionState = null;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.getSelectionState = function()
{
	if (this.selectionState == null)
	{
		this.selectionState = this.createSelectionState();
	}
	
	return this.selectionState;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.createSelectionState = function()
{
	var cells = this.editorUi.editor.graph.getSelectionCells();
	var result = this.initSelectionState();
	
	for (var i = 0; i < cells.length; i++)
	{
		this.updateSelectionStateForCell(result, cells[i], cells);
	}
	
	return result;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.initSelectionState = function()
{
	return {vertices: [], edges: [], x: null, y: null, width: null, height: null, style: {},
		containsImage: false, containsLabel: false, fill: true, glass: true, rounded: true,
		comic: true, autoSize: false, image: true, shadow: true, lineJumps: true};
};

/**
 * Returns information about the current selection.
 */
Format.prototype.updateSelectionStateForCell = function(result, cell, cells)
{
	var graph = this.editorUi.editor.graph;
	
	if (graph.getModel().isVertex(cell))
	{
		result.vertices.push(cell);
		var geo = graph.getCellGeometry(cell);
		
		if (geo != null)
		{
			if (geo.width > 0)
			{
				if (result.width == null)
				{
					result.width = geo.width;
				}
				else if (result.width != geo.width)
				{
					result.width = '';
				}
			}
			else
			{
				result.containsLabel = true;
			}
			
			if (geo.height > 0)
			{
				if (result.height == null)
				{
					result.height = geo.height;
				}
				else if (result.height != geo.height)
				{
					result.height = '';
				}
			}
			else
			{
				result.containsLabel = true;
			}
			
			if (!geo.relative || geo.offset != null)
			{
				var x = (geo.relative) ? geo.offset.x : geo.x;
				var y = (geo.relative) ? geo.offset.y : geo.y;
				
				if (result.x == null)
				{
					result.x = x;
				}
				else if (result.x != x)
				{
					result.x = '';
				}
				
				if (result.y == null)
				{
					result.y = y;
				}
				else if (result.y != y)
				{
					result.y = '';
				}
			}
		}
	}
	else if (graph.getModel().isEdge(cell))
	{
		result.edges.push(cell);
	}

	var state = graph.view.getState(cell);
	
	if (state != null)
	{
		result.autoSize = result.autoSize || this.isAutoSizeState(state);
		result.glass = result.glass && this.isGlassState(state);
		result.rounded = result.rounded && this.isRoundedState(state);
		result.lineJumps = result.lineJumps && this.isLineJumpState(state);
		result.comic = result.comic && this.isComicState(state);
		result.image = result.image && this.isImageState(state);
		result.shadow = result.shadow && this.isShadowState(state);
		result.fill = result.fill && this.isFillState(state);
		
		var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
		result.containsImage = result.containsImage || shape == 'image';
		
		for (var key in state.style)
		{
			var value = state.style[key];
			
			if (value != null)
			{
				if (result.style[key] == null)
				{
					result.style[key] = value;
				}
				else if (result.style[key] != value)
				{
					result.style[key] = '';
				}
			}
		}
	}
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isFillState = function(state)
{
	return state.view.graph.model.isVertex(state.cell) ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'arrow' ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'filledEdge' ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'flexArrow';
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isGlassState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return (shape == 'label' || shape == 'rectangle' || shape == 'internalStorage' ||
			shape == 'ext' || shape == 'umlLifeline' || shape == 'swimlane' ||
			shape == 'process');
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isRoundedState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return (shape == 'label' || shape == 'rectangle' || shape == 'internalStorage' || shape == 'corner' ||
			shape == 'parallelogram' || shape == 'swimlane' || shape == 'triangle' || shape == 'trapezoid' ||
			shape == 'ext' || shape == 'step' || shape == 'tee' || shape == 'process' || shape == 'link' ||
			shape == 'rhombus' || shape == 'offPageConnector' || shape == 'loopLimit' || shape == 'hexagon' ||
			shape == 'manualInput' || shape == 'curlyBracket' || shape == 'singleArrow' || shape == 'callout' ||
			shape == 'doubleArrow' || shape == 'flexArrow' || shape == 'card' || shape == 'umlLifeline');
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isLineJumpState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return shape == 'connector' || shape == 'filledEdge';
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isComicState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return mxUtils.indexOf(['label', 'rectangle', 'internalStorage', 'corner', 'parallelogram', 'note', 'collate',
	                        'swimlane', 'triangle', 'trapezoid', 'ext', 'step', 'tee', 'process', 'link', 'rhombus',
	                        'offPageConnector', 'loopLimit', 'hexagon', 'manualInput', 'singleArrow', 'doubleArrow',
	                        'flexArrow', 'filledEdge', 'card', 'umlLifeline', 'connector', 'folder', 'component', 'sortShape',
	                        'cross', 'umlFrame', 'cube', 'isoCube', 'isoRectangle', 'partialRectangle'], shape) >= 0;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isAutoSizeState = function(state)
{
	return mxUtils.getValue(state.style, mxConstants.STYLE_AUTOSIZE, null) == '1';
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isImageState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return (shape == 'label' || shape == 'image');
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isShadowState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return (shape != 'image');
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.clear = function()
{
	this.container.innerHTML = '';
	
	// Destroy existing panels
	if (this.panels != null)
	{
		for (var i = 0; i < this.panels.length; i++)
		{
			this.panels[i].destroy();
		}
	}
	
	this.panels = [];
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.refresh = function()
{
	// Performance tweak: No refresh needed if not visible
	if (this.container.style.width == '0px')
	{
		return;
	}
	
	this.clear();
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';
	div.style.color = 'rgb(112, 112, 112)';
	div.style.textAlign = 'left';
	div.style.cursor = 'default';
	
	var label = document.createElement('div');
	label.style.border = '1px solid #c0c0c0';
	label.style.borderWidth = '0px 0px 1px 0px';
	label.style.fontWeight = 'bold';
	label.style.overflow = 'hidden';
	label.style.display = 'block';
	label.style.paddingTop = '8px';
	label.style.height = (mxClient.IS_QUIRKS) ? '34px' : '25px';
	label.style.width = '100%';
	this.container.appendChild(div);
	
	if (graph.isSelectionEmpty())
	{
		mxUtils.write(label, mxResources.get('diagram'));
		
		// Adds button to hide the format panel since
		// people don't seem to find the toolbar button
		// and the menu item in the format menu
		var img = document.createElement('img');
		img.setAttribute('border', '0');
		img.setAttribute('src', Dialog.prototype.closeImage);
		img.setAttribute('title', mxResources.get('hide'));
		img.style.position = 'absolute';
		img.style.display = 'block';
		img.style.right = '0px';
		img.style.top = '8px';
		img.style.cursor = 'pointer';
		img.style.marginTop = '1px';
		img.style.marginRight = '17px';
		img.style.border = '1px solid transparent';
		img.style.padding = '1px';
		img.style.opacity = 0.5;
		label.appendChild(img)
		
		mxEvent.addListener(img, 'click', function()
		{
			ui.actions.get('formatPanel').funct();
		});
		
		div.appendChild(label);
		this.panels.push(new DiagramFormatPanel(this, ui, div));
	}
	else if (graph.isEditing())
	{
		mxUtils.write(label, mxResources.get('text'));
		div.appendChild(label);
		this.panels.push(new TextFormatPanel(this, ui, div));
	}
	else
	{
		var containsLabel = this.getSelectionState().containsLabel;
		var currentLabel = null;
		var currentPanel = null;
		
		var addClickHandler = mxUtils.bind(this, function(elt, panel, index)
		{
			var clickHandler = mxUtils.bind(this, function(evt)
			{
				if (currentLabel != elt)
				{
					if (containsLabel)
					{
						this.labelIndex = index;
					}
					else
					{
						this.currentIndex = index;
					}
					
					if (currentLabel != null)
					{
						currentLabel.style.backgroundColor = '#d7d7d7';
						currentLabel.style.borderBottomWidth = '1px';
					}
	
					currentLabel = elt;
					//currentLabel.style.backgroundColor = '';
					//currentLabel.style.borderBottomWidth = '0px';
					
					if (currentPanel != panel)
					{
						if (currentPanel != null)
						{
							currentPanel.style.display = 'none';
						}
						
						currentPanel = panel;
						currentPanel.style.display = '';
					}
				}
			});
			
			mxEvent.addListener(elt, 'click', clickHandler);
			
			if (index == ((containsLabel) ? this.labelIndex : this.currentIndex))
			{
				// Invokes handler directly as a workaround for no click on DIV in KHTML.
				clickHandler();
			}
		});
		
		var idx = 0;

		label.style.backgroundColor = '#d7d7d7';
		label.style.borderLeftWidth = '1px';
		//label.style.width = (containsLabel) ? '50%' : '33.3%';
		label.style.width ='100%';
		var label2 = label.cloneNode(false);
		var label3 = label2.cloneNode(false);
		

		var label4 = label3.cloneNode(false);

		// Workaround for ignored background in IE
		label2.style.backgroundColor = '#d7d7d7';
		label3.style.backgroundColor = '#d7d7d7';
		
		label4.style.backgroundColor = '#d7d7d7';

		
		// Parameter
		if (containsLabel)
		{
			label2.style.borderLeftWidth = '0px';
		}
		else
		{
			label.style.borderLeftWidth = '0px';
			
			//Parameter
			mxUtils.write(label, mxResources.get('parameter'));
			//div.appendChild(label);
			this.container.appendChild(label);

			var paramPanel = div.cloneNode(false);
			paramPanel.style.display = 'none';
			//paramPanel.appendChild(label);
			this.panels.push(new ParameterPanel(this, ui, paramPanel));
			this.container.appendChild(paramPanel);
			
			addClickHandler(label, paramPanel, idx++);
		}
		
		//Style
		mxUtils.write(label2, mxResources.get('style'));
		//div.appendChild(label2);
		this.container.appendChild(label2);
		
		var stylePanel = div.cloneNode(false);
		//stylePanel.appendChild(label2);
		stylePanel.style.display = 'none';
		this.panels.push(new StyleFormatPanel(this, ui, stylePanel));
		
		this.container.appendChild(stylePanel);
		
		// Text
		mxUtils.write(label3, mxResources.get('text'));
		//div.appendChild(label3);
		this.container.appendChild(label3);

		var textPanel = div.cloneNode(false);
		textPanel.style.display = 'none';
		//textPanel.appendChild(label3);
		this.panels.push(new TextFormatPanel(this, ui, textPanel));
		
		this.container.appendChild(textPanel);
		
		// Arrange
		mxUtils.write(label4, mxResources.get('arrange'));
		//div.appendChild(label4);
		this.container.appendChild(label4);

		var arrangePanel = div.cloneNode(false);
		arrangePanel.style.display = 'none';
		//arrangePanel.appendChild(label4);
		this.panels.push(new ArrangePanel(this, ui, arrangePanel));
		
		this.container.appendChild(arrangePanel);		
		
		addClickHandler(label2, stylePanel, idx++);
		addClickHandler(label3, textPanel, idx++);
		addClickHandler(label4, arrangePanel, idx++);
	}
};

/**
 * Base class for format panels.
 */
BaseFormatPanel = function(format, editorUi, container)
{
	this.format = format;
	this.editorUi = editorUi;
	this.container = container;
	this.listeners = [];
};

/**
 * Adds the given color option.
 */
BaseFormatPanel.prototype.getSelectionState = function()
{
	var graph = this.editorUi.editor.graph;
	var cells = graph.getSelectionCells();
	var shape = null;

	for (var i = 0; i < cells.length; i++)
	{
		var state = graph.view.getState(cells[i]);
		
		if (state != null)
		{
			var tmp = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
			
			if (tmp != null)
			{
				if (shape == null)
				{
					shape = tmp;
				}
				else if (shape != tmp)
				{
					return null;
				}
			}
			
		}
	}
	
	return shape;
};

/**
 * Install input handler.
 */
BaseFormatPanel.prototype.installInputHandler = function(input, key, defaultValue, min, max, unit, textEditFallback, isFloat)
{
	unit = (unit != null) ? unit : '';
	isFloat = (isFloat != null) ? isFloat : false;
	
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	min = (min != null) ? min : 1;
	max = (max != null) ? max : 999;
	
	var selState = null;
	var updating = false;
	
	var update = mxUtils.bind(this, function(evt)
	{
		var value = (isFloat) ? parseFloat(input.value) : parseInt(input.value);

		// Special case: angle mod 360
		if (!isNaN(value) && key == mxConstants.STYLE_ROTATION)
		{
			// Workaround for decimal rounding errors in floats is to
			// use integer and round all numbers to two decimal point
			value = mxUtils.mod(Math.round(value * 100), 36000) / 100;
		}
		
		value = Math.min(max, Math.max(min, (isNaN(value)) ? defaultValue : value));
		
		if (graph.cellEditor.isContentEditing() && textEditFallback)
		{
			if (!updating)
			{
				updating = true;
				
				if (selState != null)
				{
					graph.cellEditor.restoreSelection(selState);
					selState = null;
				}
				
				textEditFallback(value);
				input.value = value + unit;
	
				// Restore focus and selection in input
				updating = false;
			}
		}
		else if (value != mxUtils.getValue(this.format.getSelectionState().style, key, defaultValue))
		{
			if (graph.isEditing())
			{
				graph.stopEditing(true);
			}
			
			graph.getModel().beginUpdate();
			try
			{
				graph.setCellStyles(key, value, graph.getSelectionCells());
				
				// Handles special case for fontSize where HTML labels are parsed and updated
				if (key == mxConstants.STYLE_FONTSIZE)
				{
					var cells = graph.getSelectionCells();
					
					for (var i = 0; i < cells.length; i++)
					{
						var cell = cells[i];
							
						// Changes font tags inside HTML labels
						if (graph.isHtmlLabel(cell))
						{
							var div = document.createElement('div');
							div.innerHTML = graph.convertValueToString(cell);
							var elts = div.getElementsByTagName('font');
							
							for (var j = 0; j < elts.length; j++)
							{
								elts[j].removeAttribute('size');
								elts[j].style.fontSize = value + 'px';
							}
							
							graph.cellLabelChanged(cell, div.innerHTML)
						}
					}
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
					'values', [value], 'cells', graph.getSelectionCells()));
		}
		
		input.value = value + unit;
		mxEvent.consume(evt);
	});

	if (textEditFallback && graph.cellEditor.isContentEditing())
	{
		// KNOWN: Arrow up/down clear selection text in quirks/IE 8
		// Text size via arrow button limits to 16 in IE11. Why?
		mxEvent.addListener(input, 'mousedown', function()
		{
			selState = graph.cellEditor.saveSelection();
		});
		
		mxEvent.addListener(input, 'touchstart', function()
		{
			selState = graph.cellEditor.saveSelection();
		});
	}
	
	mxEvent.addListener(input, 'change', update);
	mxEvent.addListener(input, 'blur', update);
	
	return update;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createPanel = function()
{
	var div = document.createElement('div');
	div.style.padding = '12px 0px 12px 18px';
	div.style.borderBottom = '1px solid #c0c0c0';
	
	return div;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createTitle = function(title)
{
	var div = document.createElement('div');
	div.style.padding = '0px 0px 6px 0px';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.width = '200px';
	div.style.fontWeight = 'bold';
	mxUtils.write(div, title);
	
	return div;
};

/**
 * 
 */
BaseFormatPanel.prototype.createStepper = function(input, update, step, height, disableFocus, defaultValue)
{
	step = (step != null) ? step : 1;
	height = (height != null) ? height : 8;
	
	if (mxClient.IS_QUIRKS)
	{
		height = height - 2;
	}
	else if (mxClient.IS_MT || document.documentMode >= 8)
	{
		height = height + 1;
	} 
	
	var stepper = document.createElement('div');
	mxUtils.setPrefixedStyle(stepper.style, 'borderRadius', '3px');
	stepper.style.border = '1px solid rgb(192, 192, 192)';
	stepper.style.position = 'absolute';
	
	var up = document.createElement('div');
	up.style.borderBottom = '1px solid rgb(192, 192, 192)';
	up.style.position = 'relative';
	up.style.height = height + 'px';
	up.style.width = '10px';
	up.className = 'geBtnUp';
	stepper.appendChild(up);
	
	var down = up.cloneNode(false);
	down.style.border = 'none';
	down.style.height = height + 'px';
	down.className = 'geBtnDown';
	stepper.appendChild(down);

	mxEvent.addListener(down, 'click', function(evt)
	{
		if (input.value == '')
		{
			input.value = defaultValue || '2';
		}
		
		var val = parseInt(input.value);
		
		if (!isNaN(val))
		{
			input.value = val - step;
			
			if (update != null)
			{
				update(evt);
			}
		}
		
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(up, 'click', function(evt)
	{
		if (input.value == '')
		{
			input.value = defaultValue || '0';
		}
		
		var val = parseInt(input.value);
		
		if (!isNaN(val))
		{
			input.value = val + step;
			
			if (update != null)
			{
				update(evt);
			}
		}
		
		mxEvent.consume(evt);
	});
	
	// Disables transfer of focus to DIV but also :active CSS
	// so it's only used for fontSize where the focus should
	// stay on the selected text, but not for any other input.
	if (disableFocus)
	{
		var currentSelection = null;
		
		mxEvent.addGestureListeners(stepper,
			function(evt)
			{
				// Workaround for lost current selection in page because of focus in IE
				if (mxClient.IS_QUIRKS || document.documentMode == 8)
				{
					currentSelection = document.selection.createRange();
				}
				
				mxEvent.consume(evt);
			},
			null,
			function(evt)
			{
				// Workaround for lost current selection in page because of focus in IE
				if (currentSelection != null)
				{
					try
					{
						currentSelection.select();
					}
					catch (e)
					{
						// ignore
					}
					
					currentSelection = null;
					mxEvent.consume(evt);
				}
			}
		);
	}
	
	return stepper;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createOption = function(label, isCheckedFn, setCheckedFn, listener)
{
	var div = document.createElement('div');
	div.style.padding = '6px 0px 1px 0px';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.width = '200px';
	//div.style.height = (mxClient.IS_QUIRKS) ? '27px' : '18px';
	div.style.height = (mxClient.IS_QUIRKS) ? '27px' : '24px';
	
	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.style.margin = '0px 6px 0px 0px';
	div.appendChild(cb);

	var span = document.createElement('span');
	mxUtils.write(span, label);
	div.appendChild(span);

	var applying = false;
	var value = isCheckedFn();
	
	var apply = function(newValue)
	{
		if (!applying)
		{
			applying = true;
			
			if (newValue)
			{
				cb.setAttribute('checked', 'checked');
				cb.defaultChecked = true;
				cb.checked = true;
			}
			else
			{
				cb.removeAttribute('checked');
				cb.defaultChecked = false;
				cb.checked = false;
			}
			
			if (value != newValue)
			{
				value = newValue;
				
				// Checks if the color value needs to be updated in the model
				if (isCheckedFn() != value)
				{
					setCheckedFn(value);
				}
			}
			
			applying = false;
		}
	};

	mxEvent.addListener(div, 'click', function(evt)
	{
		// Toggles checkbox state for click on label
		var source = mxEvent.getSource(evt);
		
		if (source == div || source == span)
		{
			cb.checked = !cb.checked;
		}
		
		apply(cb.checked);
	});
	
	apply(value);
	
	if (listener != null)
	{
		listener.install(apply);
		this.listeners.push(listener);
	}

	return div;
};

/**
 * The string 'null' means use null in values.
 */
BaseFormatPanel.prototype.createCellOption = function(label, key, defaultValue, enabledValue, disabledValue, fn, action, stopEditing)
{
	enabledValue = (enabledValue != null) ? ((enabledValue == 'null') ? null : enabledValue) : '1';
	disabledValue = (disabledValue != null) ? ((disabledValue == 'null') ? null : disabledValue) : '0';
	
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	return this.createOption(label, function()
	{
		// Seems to be null sometimes, not sure why...
		var state = graph.view.getState(graph.getSelectionCell());
		
		if (state != null)
		{
			return mxUtils.getValue(state.style, key, defaultValue) != disabledValue;
		}
		
		return null;
	}, function(checked)
	{
		if (stopEditing)
		{
			graph.stopEditing();
		}
		
		if (action != null)
		{
			action.funct();
		}
		else
		{
			graph.getModel().beginUpdate();
			try
			{
				var value = (checked) ? enabledValue : disabledValue;
				graph.setCellStyles(key, value, graph.getSelectionCells());
				
				if (fn != null)
				{
					fn(graph.getSelectionCells(), value);
				}
				
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
					'values', [value], 'cells', graph.getSelectionCells()));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	},
	{
		install: function(apply)
		{
			this.listener = function()
			{
				// Seems to be null sometimes, not sure why...
				var state = graph.view.getState(graph.getSelectionCell());
				
				if (state != null)
				{
					apply(mxUtils.getValue(state.style, key, defaultValue) != disabledValue);
				}
			};
			
			graph.getModel().addListener(mxEvent.CHANGE, this.listener);
		},
		destroy: function()
		{
			graph.getModel().removeListener(this.listener);
		}
	});
};

/**
 * Adds the given color option.
 */
BaseFormatPanel.prototype.createColorOption = function(label, getColorFn, setColorFn, defaultColor, listener, callbackFn, hideCheckbox)
{
	var div = document.createElement('div');
	div.style.padding = '6px 0px 1px 0px';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.width = '200px';
	div.style.height = (mxClient.IS_QUIRKS) ? '27px' : '24px';
	
	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.style.margin = '0px 6px 0px 0px';
	
	if (!hideCheckbox)
	{
		div.appendChild(cb);	
	}

	var span = document.createElement('span');
	mxUtils.write(span, label);
	div.appendChild(span);
	
	var applying = false;
	var value = getColorFn();

	var btn = null;

    var apply = function (color, disableUpdate) {
        if (!applying) {
            applying = true;
            btn.innerHTML = '<div style="width:' + ((mxClient.IS_QUIRKS) ? '30' : '36') +
                'px;height:12px;margin:3px;border:1px solid black;background-color:' +
                ((color != null && color != mxConstants.NONE) ? color : defaultColor) + ';"></div>';

            // Fine-tuning in Firefox, quirks mode and IE8 standards
            if (mxClient.IS_MT || mxClient.IS_QUIRKS || document.documentMode == 8) {
                btn.firstChild.style.margin = '0px';
            }

            if (color != null && color != mxConstants.NONE) {
                cb.setAttribute('checked', 'checked');
                cb.defaultChecked = true;
                cb.checked = true;
            }
            else {
                cb.removeAttribute('checked');
                cb.defaultChecked = false;
                cb.checked = false;
            }

            btn.style.display = (cb.checked || hideCheckbox) ? '' : 'none';

            if (callbackFn != null) {
                callbackFn(color);
            }

            if (!disableUpdate && (hideCheckbox || value != color)) {
                value = color;

                // Checks if the color value needs to be updated in the model
                if (hideCheckbox || getColorFn() != value) {
                    setColorFn(value);
                }
            }

            applying = false;
        }
    };

	btn = mxUtils.button('', mxUtils.bind(this, function(evt)
	{
		this.editorUi.pickColor(value, apply);
		mxEvent.consume(evt);
	}));
	
	btn.style.position = 'absolute';
	btn.style.marginTop = '-4px';
	btn.style.right = (mxClient.IS_QUIRKS) ? '0px' : '20px';
	btn.style.height = '22px';
	btn.className = 'geColorBtn';
	btn.style.display = (cb.checked || hideCheckbox) ? '' : 'none';
	div.appendChild(btn);

	mxEvent.addListener(div, 'click', function(evt)
	{
		var source = mxEvent.getSource(evt);
		
		if (source == cb || source.nodeName != 'INPUT')
		{		
			// Toggles checkbox state for click on label
			if (source != cb)
			{
				cb.checked = !cb.checked;
			}
	
			// Overrides default value with current value to make it easier
			// to restore previous value if the checkbox is clicked twice
			if (!cb.checked && value != null && value != mxConstants.NONE &&
				defaultColor != mxConstants.NONE)
			{
				defaultColor = value;
			}
			
			apply((cb.checked) ? defaultColor : mxConstants.NONE);
		}
	});
	
	apply(value, true);
	
	if (listener != null)
	{
		listener.install(apply);
		this.listeners.push(listener);
	}
	
	return div;
};

/**
 * 
 */
BaseFormatPanel.prototype.createCellColorOption = function(label, colorKey, defaultColor, callbackFn, setStyleFn)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	return this.createColorOption(label, function()
	{
		// Seems to be null sometimes, not sure why...
		var state = graph.view.getState(graph.getSelectionCell());
		
		if (state != null)
		{
			return mxUtils.getValue(state.style, colorKey, null);
		}
		
		return null;
	}, function(color)
	{
		graph.getModel().beginUpdate();
		try
		{
			if (setStyleFn != null)
			{
				setStyleFn(color);
			}
			
			graph.setCellStyles(colorKey, color, graph.getSelectionCells());
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', [colorKey],
				'values', [color], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	}, defaultColor || mxConstants.NONE,
	{
		install: function(apply)
		{
			this.listener = function()
			{
				// Seems to be null sometimes, not sure why...
				var state = graph.view.getState(graph.getSelectionCell());
				
				if (state != null)
				{
					apply(mxUtils.getValue(state.style, colorKey, null));
				}
			};
			
			graph.getModel().addListener(mxEvent.CHANGE, this.listener);
		},
		destroy: function()
		{
			graph.getModel().removeListener(this.listener);
		}
	}, callbackFn);
};

/**
 * 
 */
BaseFormatPanel.prototype.addArrow = function(elt, height)
{
	height = (height != null) ? height : 10;
	
	var arrow = document.createElement('div');
	arrow.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
	arrow.style.padding = '6px';
	arrow.style.paddingRight = '4px';
	
	var m = (10 - height);
	
	if (m == 2)
	{
		arrow.style.paddingTop = 6 + 'px';
	}
	else if (m > 0)
	{
		arrow.style.paddingTop = (6 - m) + 'px';
	}
	else
	{
		arrow.style.marginTop = '-2px';
	}
	
	arrow.style.height = height + 'px';
	arrow.style.borderLeft = '1px solid #a0a0a0';
	arrow.innerHTML = '<img border="0" src="' + ((mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUeNpidHB2ZyAGsACxDRBPIKCuA6TwCBB/h2rABu4A8SYmKCcXiP/iUFgAxL9gCi8A8SwsirZCMQMTkmANEH9E4v+CmsaArvAdyNFI/FlQ92EoBIE+qCRIUz168DBgsU4OqhinQpgHMABAgAEALY4XLIsJ20oAAAAASUVORK5CYII=' :
		IMAGE_PATH + '/dropdown.png') + '" style="margin-bottom:4px;">';
	mxUtils.setOpacity(arrow, 70);
	
	var symbol = elt.getElementsByTagName('div')[0];
	
	if (symbol != null)
	{
		symbol.style.paddingRight = '6px';
		symbol.style.marginLeft = '4px';
		symbol.style.marginTop = '-1px';
		symbol.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
		mxUtils.setOpacity(symbol, 60);
	}

	mxUtils.setOpacity(elt, 100);
	elt.style.border = '1px solid #a0a0a0';
	elt.style.backgroundColor = 'white';
	elt.style.backgroundImage = 'none';
	elt.style.width = 'auto';
	elt.className += ' geColorBtn';
	mxUtils.setPrefixedStyle(elt.style, 'borderRadius', '3px');
	
	elt.appendChild(arrow);
	
	return symbol;
};

/**
 * 
 */
BaseFormatPanel.prototype.addUnitInput = function(container, unit, right, width, update, step, marginTop, disableFocus)
{
	marginTop = (marginTop != null) ? marginTop : 0;
	
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.textAlign = 'right';
	input.style.marginTop = '-2px';
	input.style.right = (right + 12) + 'px';
	input.style.width = width + 'px';
	container.appendChild(input);
	
	var stepper = this.createStepper(input, update, step, null, disableFocus);
	stepper.style.marginTop = (marginTop - 2) + 'px';
	stepper.style.right = right + 'px';
	container.appendChild(stepper);

	return input;
};

/**
 * 
 */
BaseFormatPanel.prototype.createRelativeOption = function(label, key, width, handler, init)
{
	width = (width != null) ? width : 44;
	
	var graph = this.editorUi.editor.graph;
	var div = this.createPanel();
	div.style.paddingTop = '10px';
	div.style.paddingBottom = '10px';
	mxUtils.write(div, label);
	div.style.fontWeight = 'bold';
	
	function update(evt)
	{
		if (handler != null)
		{
			handler(input);
		}
		else
		{
			var value = parseInt(input.value);
			value = Math.min(100, Math.max(0, (isNaN(value)) ? 100 : value));
			var state = graph.view.getState(graph.getSelectionCell());
			
			if (state != null && value != mxUtils.getValue(state.style, key, 100))
			{
				// Removes entry in style (assumes 100 is default for relative values)
				if (value == 100)
				{
					value = null;
				}
				
				graph.setCellStyles(key, value, graph.getSelectionCells());
			}
	
			input.value = ((value != null) ? value : '100') + ' %';
		}
		
		mxEvent.consume(evt);
	};

	var input = this.addUnitInput(div, '%', 20, width, update, 10, -15, handler != null);

	if (key != null)
	{
		var listener = mxUtils.bind(this, function(sender, evt, force)
		{
			if (force || input != document.activeElement)
			{
				var ss = this.format.getSelectionState();
				var tmp = parseInt(mxUtils.getValue(ss.style, key, 100));
				input.value = (isNaN(tmp)) ? '' : tmp + ' %';
			}
		});
		
		mxEvent.addListener(input, 'keydown', function(e)
		{
			if (e.keyCode == 13)
			{
				graph.container.focus();
				mxEvent.consume(e);
			}
			else if (e.keyCode == 27)
			{
				listener(null, null, true);
				graph.container.focus();
				mxEvent.consume(e);
			}
		});
		
		graph.getModel().addListener(mxEvent.CHANGE, listener);
		this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
		listener();
	}

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);
	
	if (init != null)
	{
		init(input);
	}

	return div;
};

/**
 * 
 */
BaseFormatPanel.prototype.addLabel = function(div, title, right, width)
{
	width = (width != null) ? width : 61;
	
	var label = document.createElement('div');
	mxUtils.write(label, title);
	label.style.position = 'absolute';
	label.style.right = right + 'px';
	label.style.width = width + 'px';
	label.style.marginTop = '6px';
	label.style.textAlign = 'center';
	div.appendChild(label);
};

/**
 * 
 */
BaseFormatPanel.prototype.addKeyHandler = function(input, listener)
{
	mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(e)
	{
		if (e.keyCode == 13)
		{
			this.editorUi.editor.graph.container.focus();
			mxEvent.consume(e);
		}
		else if (e.keyCode == 27)
		{
			if (listener != null)
			{
				listener(null, null, true);				
			}

			this.editorUi.editor.graph.container.focus();
			mxEvent.consume(e);
		}
	}));
};

/**
 * 
 */
BaseFormatPanel.prototype.styleButtons = function(elts)
{
	for (var i = 0; i < elts.length; i++)
	{
		mxUtils.setPrefixedStyle(elts[i].style, 'borderRadius', '3px');
		mxUtils.setOpacity(elts[i], 100);
		elts[i].style.border = '1px solid #a0a0a0';
		// elts[i].style.padding = '4px';
		// elts[i].style.paddingTop = '3px';
		// elts[i].style.paddingRight = '1px';
		elts[i].style.margin = '1px';
		elts[i].style.width = '24px';
		elts[i].style.height = '20px';
		elts[i].className += ' geColorBtn';
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
BaseFormatPanel.prototype.destroy = function()
{
	if (this.listeners != null)
	{
		for (var i = 0; i < this.listeners.length; i++)
		{
			this.listeners[i].destroy();
		}
		
		this.listeners = null;
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(ArrangePanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.init = function()
{
	var graph = this.editorUi.editor.graph;
	var ss = this.format.getSelectionState();

	this.container.appendChild(this.addLayerOps(this.createPanel()));
	// Special case that adds two panels
	this.addGeometry(this.container);
	this.addEdgeGeometry(this.container);

	if (!ss.containsLabel || ss.edges.length == 0)
	{
		this.container.appendChild(this.addAngle(this.createPanel()));
	}
	
	if (!ss.containsLabel && ss.edges.length == 0)
	{
		this.container.appendChild(this.addFlip(this.createPanel()));
	}

	if (ss.vertices.length > 1)
	{
		this.container.appendChild(this.addAlign(this.createPanel()));
		this.container.appendChild(this.addDistribute(this.createPanel()));
	}
	
	this.container.appendChild(this.addGroupOps(this.createPanel()));
};

/**
 * 
 */
ArrangePanel.prototype.addLayerOps = function(div)
{
	var ui = this.editorUi;
	
	var btn = mxUtils.button(mxResources.get('toFront'), function(evt)
	{
		ui.actions.get('toFront').funct();
	})
	
	btn.setAttribute('title', mxResources.get('toFront') + ' (' + this.editorUi.actions.get('toFront').shortcut + ')');
	btn.style.width = '100px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('toBack'), function(evt)
	{
		ui.actions.get('toBack').funct();
	})
	
	btn.setAttribute('title', mxResources.get('toBack') + ' (' + this.editorUi.actions.get('toBack').shortcut + ')');
	btn.style.width = '100px';
	div.appendChild(btn);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addGroupOps = function(div)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var cell = graph.getSelectionCell();
	var ss = this.format.getSelectionState();
	var count = 0;
	
	div.style.paddingTop = '8px';
	div.style.paddingBottom = '6px';

	if (graph.getSelectionCount() > 1)
	{
		btn = mxUtils.button(mxResources.get('group'), function(evt)
		{
			ui.actions.get('group').funct();
		})
		
		btn.setAttribute('title', mxResources.get('group') + ' (' + this.editorUi.actions.get('group').shortcut + ')');
		btn.style.width = '202px';
		btn.style.marginBottom = '2px';
		div.appendChild(btn);
		count++;
	}
	else if (graph.getSelectionCount() == 1 && !graph.getModel().isEdge(cell) && !graph.isSwimlane(cell) &&
			graph.getModel().getChildCount(cell) > 0)
	{
		btn = mxUtils.button(mxResources.get('ungroup'), function(evt)
		{
			ui.actions.get('ungroup').funct();
		})
		
		btn.setAttribute('title', mxResources.get('ungroup') + ' (' + this.editorUi.actions.get('ungroup').shortcut + ')');
		btn.style.width = '202px';
		btn.style.marginBottom = '2px';
		div.appendChild(btn);
		count++;
	}
	
	if (graph.getSelectionCount() == 1 && graph.getModel().isVertex(cell) &&
   		graph.getModel().isVertex(graph.getModel().getParent(cell)))
	{
		if (count > 0)
		{
			mxUtils.br(div);
		}
		
		btn = mxUtils.button(mxResources.get('removeFromGroup'), function(evt)
		{
			ui.actions.get('removeFromGroup').funct();
		})
		
		btn.setAttribute('title', mxResources.get('removeFromGroup'));
		btn.style.width = '202px';
		btn.style.marginBottom = '2px';
		div.appendChild(btn);
		count++;
	}
	else if (graph.getSelectionCount() > 0)
	{
		if (count > 0)
		{
			mxUtils.br(div);
		}
		
		btn = mxUtils.button(mxResources.get('clearWaypoints'), mxUtils.bind(this, function(evt)
		{
			this.editorUi.actions.get('clearWaypoints').funct();
		}));
		
		btn.setAttribute('title', mxResources.get('clearWaypoints') + ' (' + this.editorUi.actions.get('clearWaypoints').shortcut + ')');
		btn.style.width = '202px';
		btn.style.marginBottom = '2px';
		div.appendChild(btn);

		count++;
	}
	
	if (graph.getSelectionCount() == 1)
	{

		//不添加编辑数据按钮[editData]
		
		if (count > 0)
		{
			mxUtils.br(div);
		}
		
		btn = mxUtils.button(mxResources.get('editData'), mxUtils.bind(this, function(evt)
		{
			this.editorUi.actions.get('editData').funct();
		}));
		
		btn.setAttribute('title', mxResources.get('editData') + ' (' + this.editorUi.actions.get('editData').shortcut + ')');
		btn.style.width = '100px';
		btn.style.marginBottom = '2px';
		
		//div.appendChild(btn);
		//count++;

		btn = mxUtils.button(mxResources.get('editLink'), mxUtils.bind(this, function(evt)
		{
			this.editorUi.actions.get('editLink').funct();
		}));
		
		btn.setAttribute('title', mxResources.get('editLink'));
		btn.style.width = '100px';
		btn.style.marginLeft = '2px';
		btn.style.marginBottom = '2px';
		
		//div.appendChild(btn);
		//count++;
	}
	
	if (count == 0)
	{
		div.style.display = 'none';
	}
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addAlign = function(div)
{
	var graph = this.editorUi.editor.graph;
	div.style.paddingTop = '6px';
	div.style.paddingBottom = '12px';
	div.appendChild(this.createTitle(mxResources.get('align')));
	
	var stylePanel = document.createElement('div');
	stylePanel.style.position = 'relative';
	stylePanel.style.paddingLeft = '0px';
	stylePanel.style.borderWidth = '0px';
	stylePanel.className = 'geToolbarContainer';
	
	if (mxClient.IS_QUIRKS)
	{
		div.style.height = '60px';
	}
	
	var left = this.editorUi.toolbar.addButton('geSprite-alignleft', mxResources.get('left'),
		function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, stylePanel);
	var center = this.editorUi.toolbar.addButton('geSprite-aligncenter', mxResources.get('center'),
		function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, stylePanel);
	var right = this.editorUi.toolbar.addButton('geSprite-alignright', mxResources.get('right'),
		function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, stylePanel);

	var top = this.editorUi.toolbar.addButton('geSprite-aligntop', mxResources.get('top'),
		function() { graph.alignCells(mxConstants.ALIGN_TOP); }, stylePanel);
	var middle = this.editorUi.toolbar.addButton('geSprite-alignmiddle', mxResources.get('middle'),
		function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, stylePanel);
	var bottom = this.editorUi.toolbar.addButton('geSprite-alignbottom', mxResources.get('bottom'),
		function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, stylePanel);
	
	this.styleButtons([left, center, right, top, middle, bottom]);
	right.style.marginRight = '6px';
	div.appendChild(stylePanel);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addFlip = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	div.style.paddingTop = '6px';
	div.style.paddingBottom = '10px';

	var span = document.createElement('div');
	span.style.marginTop = '2px';
	span.style.marginBottom = '8px';
	span.style.fontWeight = 'bold';
	mxUtils.write(span, mxResources.get('flip'));
	div.appendChild(span);
	
	var btn = mxUtils.button(mxResources.get('horizontal'), function(evt)
	{
		graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false);
	})
	
	btn.setAttribute('title', mxResources.get('horizontal'));
	btn.style.width = '100px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('vertical'), function(evt)
	{
		graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false);
	})
	
	btn.setAttribute('title', mxResources.get('vertical'));
	btn.style.width = '100px';
	div.appendChild(btn);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addDistribute = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	div.style.paddingTop = '6px';
	div.style.paddingBottom = '12px';
	
	div.appendChild(this.createTitle(mxResources.get('distribute')));

	var btn = mxUtils.button(mxResources.get('horizontal'), function(evt)
	{
		graph.distributeCells(true);
	})
	
	btn.setAttribute('title', mxResources.get('horizontal'));
	btn.style.width = '100px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('vertical'), function(evt)
	{
		graph.distributeCells(false);
	})
	
	btn.setAttribute('title', mxResources.get('vertical'));
	btn.style.width = '100px';
	div.appendChild(btn);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addAngle = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.format.getSelectionState();

	div.style.paddingBottom = '8px';
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	span.style.fontWeight = 'bold';
	
	var input = null;
	var update = null;
	var btn = null;
	
	if (ss.edges.length == 0)
	{
		mxUtils.write(span, mxResources.get('angle'));
		div.appendChild(span);
		
		input = this.addUnitInput(div, '°', 20, 44, function()
		{
			update.apply(this, arguments);
		});
		
		mxUtils.br(div);
		div.style.paddingTop = '10px';
	}
	else
	{
		div.style.paddingTop = '8px';
	}

	if (!ss.containsLabel)
	{
		var label = mxResources.get('reverse');
		
		if (ss.vertices.length > 0 && ss.edges.length > 0)
		{
			label = mxResources.get('turn') + ' / ' + label;
		}
		else if (ss.vertices.length > 0)
		{
			label = mxResources.get('turn');
		}

		btn = mxUtils.button(label, function(evt)
		{
			ui.actions.get('turn').funct();
		})
		
		btn.setAttribute('title', label + ' (' + this.editorUi.actions.get('turn').shortcut + ')');
		btn.style.width = '202px';
		div.appendChild(btn);
		
		if (input != null)
		{
			btn.style.marginTop = '8px';
		}
	}
	
	if (input != null)
	{
		var listener = mxUtils.bind(this, function(sender, evt, force)
		{
			if (force || document.activeElement != input)
			{
				ss = this.format.getSelectionState();
				var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_ROTATION, 0));
				input.value = (isNaN(tmp)) ? '' : tmp  + '°';
			}
		});
	
		update = this.installInputHandler(input, mxConstants.STYLE_ROTATION, 0, 0, 360, '°', null, true);
		this.addKeyHandler(input, listener);
	
		graph.getModel().addListener(mxEvent.CHANGE, listener);
		this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
		listener();
	}

	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addGeometry = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var rect = this.format.getSelectionState();
	
	var div = this.createPanel();
	div.style.paddingBottom = '8px';
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '50px';
	span.style.marginTop = '0px';
	span.style.fontWeight = 'bold';
	mxUtils.write(span, mxResources.get('size'));
	div.appendChild(span);

	var widthUpdate, heightUpdate, leftUpdate, topUpdate;
	var width = this.addUnitInput(div, 'pt', 84, 44, function()
	{
		widthUpdate.apply(this, arguments);
	});
	var height = this.addUnitInput(div, 'pt', 20, 44, function()
	{
		heightUpdate.apply(this, arguments);
	});
	
	var autosizeBtn = document.createElement('div');
	autosizeBtn.className = 'geSprite geSprite-fit';
	autosizeBtn.setAttribute('title', mxResources.get('autosize') + ' (' + this.editorUi.actions.get('autosize').shortcut + ')');
	autosizeBtn.style.position = 'relative';
	autosizeBtn.style.cursor = 'pointer';
	autosizeBtn.style.marginTop = '-3px';
	autosizeBtn.style.border = '0px';
	autosizeBtn.style.left = '52px';
	mxUtils.setOpacity(autosizeBtn, 50);
	
	mxEvent.addListener(autosizeBtn, 'mouseenter', function()
	{
		mxUtils.setOpacity(autosizeBtn, 100);
	});
	
	mxEvent.addListener(autosizeBtn, 'mouseleave', function()
	{
		mxUtils.setOpacity(autosizeBtn, 50);
	});

	mxEvent.addListener(autosizeBtn, 'click', function()
	{
		ui.actions.get('autosize').funct();
	});
	
	div.appendChild(autosizeBtn);
	this.addLabel(div, mxResources.get('width'), 84);
	this.addLabel(div, mxResources.get('height'), 20);
	mxUtils.br(div);
	
	var wrapper = document.createElement('div');
	wrapper.style.paddingTop = '8px';
	wrapper.style.paddingRight = '20px';
	wrapper.style.whiteSpace = 'nowrap';
	wrapper.style.textAlign = 'right';
	var opt = this.createCellOption(mxResources.get('constrainProportions'),
		mxConstants.STYLE_ASPECT, null, 'fixed', 'null');
	opt.style.width = '100%';
	wrapper.appendChild(opt);
	div.appendChild(wrapper);
	
	this.addKeyHandler(width, listener);
	this.addKeyHandler(height, listener);

	widthUpdate = this.addGeometryHandler(width, function(geo, value)
	{
		if (geo.width > 0)
		{
			geo.width = Math.max(1, value);
		}
	});
	heightUpdate = this.addGeometryHandler(height, function(geo, value)
	{
		if (geo.height > 0)
		{
			geo.height = Math.max(1, value);
		}
	});
	
	container.appendChild(div);
	
	var div2 = this.createPanel();
	div2.style.paddingBottom = '30px';
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	span.style.fontWeight = 'bold';
	mxUtils.write(span, mxResources.get('position'));
	div2.appendChild(span);
	
	var left = this.addUnitInput(div2, 'pt', 84, 44, function()
	{
		leftUpdate.apply(this, arguments);
	});
	var top = this.addUnitInput(div2, 'pt', 20, 44, function()
	{
		topUpdate.apply(this, arguments);
	});

	mxUtils.br(div2);
	this.addLabel(div2, mxResources.get('left'), 84);
	this.addLabel(div2, mxResources.get('top'), 20);
	
	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		rect = this.format.getSelectionState();

		if (!rect.containsLabel && rect.vertices.length == graph.getSelectionCount() &&
			rect.width != null && rect.height != null)
		{
			div.style.display = '';
			
			if (force || document.activeElement != width)
			{
				width.value = rect.width + ((rect.width == '') ? '' : ' pt');
			}
			
			if (force || document.activeElement != height)
			{
				height.value = rect.height + ((rect.height == '') ? '' : ' pt');
			}
		}
		else
		{
			div.style.display = 'none';
		}
		
		if (rect.vertices.length == graph.getSelectionCount() &&
			rect.x != null && rect.y != null)
		{
			div2.style.display = '';
			
			if (force || document.activeElement != left)
			{
				left.value = rect.x  + ((rect.x == '') ? '' : ' pt');
			}
			
			if (force || document.activeElement != top)
			{
				top.value = rect.y + ((rect.y == '') ? '' : ' pt');
			}
		}
		else
		{
			div2.style.display = 'none';
		}
	});

	this.addKeyHandler(left, listener);
	this.addKeyHandler(top, listener);

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
	
	leftUpdate = this.addGeometryHandler(left, function(geo, value)
	{
		if (geo.relative)
		{
			geo.offset.x = value;
		}
		else
		{
			geo.x = value;
		}
	});
	topUpdate = this.addGeometryHandler(top, function(geo, value)
	{
		if (geo.relative)
		{
			geo.offset.y = value;
		}
		else
		{
			geo.y = value;
		}
	});

	container.appendChild(div2);
};

/**
 * 
 */
ArrangePanel.prototype.addGeometryHandler = function(input, fn)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var initialValue = null;
	
	function update(evt)
	{
		if (input.value != '')
		{
			var value = parseFloat(input.value);

			if (value != initialValue)
			{
				graph.getModel().beginUpdate();
				try
				{
					var cells = graph.getSelectionCells();
					
					for (var i = 0; i < cells.length; i++)
					{
						if (graph.getModel().isVertex(cells[i]))
						{
							var geo = graph.getCellGeometry(cells[i]);
							
							if (geo != null)
							{
								geo = geo.clone();
								fn(geo, value);
								
								graph.getModel().setGeometry(cells[i], geo);
							}
						}
					}
				}
				finally
				{
					graph.getModel().endUpdate();
				}
				
				initialValue = value;
				input.value = value + ' pt';
			}
			else if (isNaN(value)) 
			{
				input.value = initialValue + ' pt';
			}
		}
		
		mxEvent.consume(evt);
	};

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);
	mxEvent.addListener(input, 'focus', function()
	{
		initialValue = input.value;
	});
	
	return update;
};

/**
 * 
 */
ArrangePanel.prototype.addEdgeGeometry = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var rect = this.format.getSelectionState();
	
	var div = this.createPanel();
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	span.style.fontWeight = 'bold';
	mxUtils.write(span, mxResources.get('width'));
	div.appendChild(span);

	var widthUpdate, leftUpdate, topUpdate;
	var width = this.addUnitInput(div, 'pt', 20, 44, function()
	{
		widthUpdate.apply(this, arguments);
	});

	mxUtils.br(div);
	this.addKeyHandler(width, listener);
	
	function widthUpdate(evt)
	{
		// Maximum stroke width is 999
		var value = parseInt(width.value);
		value = Math.min(999, Math.max(1, (isNaN(value)) ? 1 : value));
		
		if (value != mxUtils.getValue(rect.style, 'width', mxCellRenderer.prototype.defaultShapes['flexArrow'].prototype.defaultWidth))
		{
			graph.setCellStyles('width', value, graph.getSelectionCells());
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['width'],
					'values', [value], 'cells', graph.getSelectionCells()));
		}

		width.value = value + ' pt';
		mxEvent.consume(evt);
	};

	mxEvent.addListener(width, 'blur', widthUpdate);
	mxEvent.addListener(width, 'change', widthUpdate);

	container.appendChild(div);
	
	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		rect = this.format.getSelectionState();
		
		if (rect.style.shape == 'link' || rect.style.shape == 'flexArrow')
		{
			div.style.display = '';
			
			if (force || document.activeElement != width)
			{
				var value = mxUtils.getValue(rect.style, 'width',
					mxCellRenderer.prototype.defaultShapes['flexArrow'].prototype.defaultWidth);
				width.value = value + ' pt';
			}
		}
		else
		{
			div.style.display = 'none';
		}
	});

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(TextFormatPanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.init = function()
{
	this.container.style.borderBottom = 'none';
	this.addFont(this.container);
};

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.addFont = function(container)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.format.getSelectionState();
	
	var title = this.createTitle(mxResources.get('font'));
	title.style.paddingLeft = '18px';
	title.style.paddingTop = '10px';
	title.style.paddingBottom = '6px';
	container.appendChild(title);

	var stylePanel = this.createPanel();
	stylePanel.style.paddingTop = '2px';
	stylePanel.style.paddingBottom = '2px';
	stylePanel.style.position = 'relative';
	stylePanel.style.marginLeft = '-2px';
	stylePanel.style.borderWidth = '0px';
	stylePanel.className = 'geToolbarContainer';
	
	if (mxClient.IS_QUIRKS)
	{
		stylePanel.style.display = 'block';
	}

	if (graph.cellEditor.isContentEditing())
	{
		var cssPanel = stylePanel.cloneNode();
		
		var cssMenu = this.editorUi.toolbar.addMenu(mxResources.get('style'),
			mxResources.get('style'), true, 'formatBlock', cssPanel);
		cssMenu.style.color = 'rgb(112, 112, 112)';
		cssMenu.style.whiteSpace = 'nowrap';
		cssMenu.style.overflow = 'hidden';
		cssMenu.style.margin = '0px';
		this.addArrow(cssMenu);
		cssMenu.style.width = '192px';
		cssMenu.style.height = '22px';
		
		var arrow = cssMenu.getElementsByTagName('div')[0];
		arrow.style.cssFloat = 'right';
		container.appendChild(cssPanel);
	}
	
	container.appendChild(stylePanel);
	
	var colorPanel = this.createPanel();
	colorPanel.style.marginTop = '8px';
	colorPanel.style.borderTop = '1px solid #c0c0c0';
	colorPanel.style.paddingTop = '6px';
	colorPanel.style.paddingBottom = '6px';

	var fontMenu = this.editorUi.toolbar.addMenu('Helvetica', mxResources.get('fontFamily'), true, 'fontFamily', stylePanel);
	fontMenu.style.color = 'rgb(112, 112, 112)';
	fontMenu.style.whiteSpace = 'nowrap';
	fontMenu.style.overflow = 'hidden';
	fontMenu.style.margin = '0px';
	
	this.addArrow(fontMenu);
	fontMenu.style.width = '192px';
	fontMenu.style.height = '22px';
	
	// Workaround for offset in FF
	if (mxClient.IS_FF)
	{
		fontMenu.getElementsByTagName('div')[0].style.marginTop = '-18px';
	}
	
	var stylePanel2 = stylePanel.cloneNode(false);
	stylePanel2.style.marginLeft = '-3px';
	var fontStyleItems = this.editorUi.toolbar.addItems(['bold', 'italic', 'underline'], stylePanel2, true);
	fontStyleItems[0].setAttribute('title', mxResources.get('bold') + ' (' + this.editorUi.actions.get('bold').shortcut + ')');
	fontStyleItems[1].setAttribute('title', mxResources.get('italic') + ' (' + this.editorUi.actions.get('italic').shortcut + ')');
	fontStyleItems[2].setAttribute('title', mxResources.get('underline') + ' (' + this.editorUi.actions.get('underline').shortcut + ')');
	
	var verticalItem = this.editorUi.toolbar.addItems(['vertical'], stylePanel2, true)[0];
	
	if (mxClient.IS_QUIRKS)
	{
		mxUtils.br(container);
	}
	
	container.appendChild(stylePanel2);

	this.styleButtons(fontStyleItems);
	this.styleButtons([verticalItem]);
	
	var stylePanel3 = stylePanel.cloneNode(false);
	stylePanel3.style.marginLeft = '-3px';
	stylePanel3.style.paddingBottom = '0px';
	
	var left = this.editorUi.toolbar.addButton('geSprite-left', mxResources.get('left'),
			(graph.cellEditor.isContentEditing()) ?
			function()
			{
				document.execCommand('justifyleft', false, null);
			} : this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT]), stylePanel3);
	var center = this.editorUi.toolbar.addButton('geSprite-center', mxResources.get('center'),
			(graph.cellEditor.isContentEditing()) ?
			function()
			{
				document.execCommand('justifycenter', false, null);
			} : this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER]), stylePanel3);
	var right = this.editorUi.toolbar.addButton('geSprite-right', mxResources.get('right'),
			(graph.cellEditor.isContentEditing()) ?
			function()
			{
				document.execCommand('justifyright', false, null);
			} : this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT]), stylePanel3);

	this.styleButtons([left, center, right]);

	if (graph.cellEditor.isContentEditing())
	{
		var clear = this.editorUi.toolbar.addButton('geSprite-removeformat', mxResources.get('removeFormat'),
			function()
			{
				document.execCommand('removeformat', false, null);
			}, stylePanel2);
		this.styleButtons([clear]);
	}
	
	var top = this.editorUi.toolbar.addButton('geSprite-top', mxResources.get('top'),
		this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_TOP]), stylePanel3);
	var middle = this.editorUi.toolbar.addButton('geSprite-middle', mxResources.get('middle'),
		this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_MIDDLE]), stylePanel3);
	var bottom = this.editorUi.toolbar.addButton('geSprite-bottom', mxResources.get('bottom'),
		this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_BOTTOM]), stylePanel3);
	
	this.styleButtons([top, middle, bottom]);
	
	if (mxClient.IS_QUIRKS)
	{
		mxUtils.br(container);
	}
	
	container.appendChild(stylePanel3);
	
	// Hack for updating UI state below based on current text selection
	// currentTable is the current selected DOM table updated below
	var sub, sup, full, tableWrapper, currentTable, tableCell, tableRow;
	
	if (graph.cellEditor.isContentEditing())
	{
		top.style.display = 'none';
		middle.style.display = 'none';
		bottom.style.display = 'none';
		verticalItem.style.display = 'none';
		
		full = this.editorUi.toolbar.addButton('geSprite-justifyfull', null,
			function()
			{
				document.execCommand('justifyfull', false, null);
			}, stylePanel3);
		this.styleButtons([full,
       		sub = this.editorUi.toolbar.addButton('geSprite-subscript',
       			mxResources.get('subscript') + ' (' + Editor.ctrlKey + '+,)',
			function()
			{
				document.execCommand('subscript', false, null);
			}, stylePanel3), sup = this.editorUi.toolbar.addButton('geSprite-superscript',
				mxResources.get('superscript') + ' (' + Editor.ctrlKey + '+.)',
			function()
			{
				document.execCommand('superscript', false, null);
			}, stylePanel3)]);
		full.style.marginRight = '9px';
		
		var tmp = stylePanel3.cloneNode(false);
		tmp.style.paddingTop = '4px';
		var btns = [this.editorUi.toolbar.addButton('geSprite-orderedlist', mxResources.get('numberedList'),
				function()
				{
					document.execCommand('insertorderedlist', false, null);
				}, tmp),
			this.editorUi.toolbar.addButton('geSprite-unorderedlist', mxResources.get('bulletedList'),
				function()
				{
					document.execCommand('insertunorderedlist', false, null);
				}, tmp),
			this.editorUi.toolbar.addButton('geSprite-outdent', mxResources.get('decreaseIndent'),
					function()
					{
						document.execCommand('outdent', false, null);
					}, tmp),
			this.editorUi.toolbar.addButton('geSprite-indent', mxResources.get('increaseIndent'),
				function()
				{
					document.execCommand('indent', false, null);
				}, tmp),
			this.editorUi.toolbar.addButton('geSprite-code', mxResources.get('html'),
				function()
				{
					graph.cellEditor.toggleViewMode();
				}, tmp)];
		this.styleButtons(btns);
		btns[btns.length - 1].style.marginLeft = '9px';
		
		if (mxClient.IS_QUIRKS)
		{
			mxUtils.br(container);
			tmp.style.height = '40';
		}
		
		container.appendChild(tmp);
	}
	else
	{
		fontStyleItems[2].style.marginRight = '9px';
		right.style.marginRight = '9px';
	}
	
	// Label position
	var stylePanel4 = stylePanel.cloneNode(false);
	stylePanel4.style.marginLeft = '0px';
	stylePanel4.style.paddingTop = '8px';
	stylePanel4.style.paddingBottom = '4px';
	stylePanel4.style.fontWeight = 'normal';
	
	mxUtils.write(stylePanel4, mxResources.get('position'));
	
	// Adds label position options
	var positionSelect = document.createElement('select');
	positionSelect.style.position = 'absolute';
	positionSelect.style.right = '20px';
	positionSelect.style.width = '97px';
	positionSelect.style.marginTop = '-2px';
	
	var directions = ['topLeft', 'top', 'topRight', 'left', 'center', 'right', 'bottomLeft', 'bottom', 'bottomRight'];
	var lset = {'topLeft': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM],
			'top': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM],
			'topRight': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM],
			'left': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE],
			'center': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE],
			'right': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE],
			'bottomLeft': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP],
			'bottom': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP],
			'bottomRight': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP]};

	for (var i = 0; i < directions.length; i++)
	{
		var positionOption = document.createElement('option');
		positionOption.setAttribute('value', directions[i]);
		mxUtils.write(positionOption, mxResources.get(directions[i]));
		positionSelect.appendChild(positionOption);
	}

	stylePanel4.appendChild(positionSelect);
	
	// Writing direction
	var stylePanel5 = stylePanel.cloneNode(false);
	stylePanel5.style.marginLeft = '0px';
	stylePanel5.style.paddingTop = '4px';
	stylePanel5.style.paddingBottom = '4px';
	stylePanel5.style.fontWeight = 'normal';

	mxUtils.write(stylePanel5, mxResources.get('writingDirection'));
	
	// Adds writing direction options
	// LATER: Handle reselect of same option in all selects (change event
	// is not fired for same option so have opened state on click) and
	// handle multiple different styles for current selection
	var dirSelect = document.createElement('select');
	dirSelect.style.position = 'absolute';
	dirSelect.style.right = '20px';
	dirSelect.style.width = '97px';
	dirSelect.style.marginTop = '-2px';

	// NOTE: For automatic we use the value null since automatic
	// requires the text to be non formatted and non-wrapped
	var dirs = ['automatic', 'leftToRight', 'rightToLeft'];
	var dirSet = {'automatic': null,
			'leftToRight': mxConstants.TEXT_DIRECTION_LTR,
			'rightToLeft': mxConstants.TEXT_DIRECTION_RTL};

	for (var i = 0; i < dirs.length; i++)
	{
		var dirOption = document.createElement('option');
		dirOption.setAttribute('value', dirs[i]);
		mxUtils.write(dirOption, mxResources.get(dirs[i]));
		dirSelect.appendChild(dirOption);
	}

	stylePanel5.appendChild(dirSelect);
	
	if (!graph.isEditing())
	{
		container.appendChild(stylePanel4);
		
		mxEvent.addListener(positionSelect, 'change', function(evt)
		{
			graph.getModel().beginUpdate();
			try
			{
				var vals = lset[positionSelect.value];
				
				if (vals != null)
				{
					graph.setCellStyles(mxConstants.STYLE_LABEL_POSITION, vals[0], graph.getSelectionCells());
					graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, vals[1], graph.getSelectionCells());
					graph.setCellStyles(mxConstants.STYLE_ALIGN, vals[2], graph.getSelectionCells());
					graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, vals[3], graph.getSelectionCells());
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			mxEvent.consume(evt);
		});

		// LATER: Update dir in text editor while editing and update style with label
		// NOTE: The tricky part is handling and passing on the auto value
		container.appendChild(stylePanel5);
		
		mxEvent.addListener(dirSelect, 'change', function(evt)
		{
			graph.setCellStyles(mxConstants.STYLE_TEXT_DIRECTION, dirSet[dirSelect.value], graph.getSelectionCells());
			mxEvent.consume(evt);
		});
	}

	// Font size
	var input = document.createElement('input');
	input.style.textAlign = 'right';
	input.style.marginTop = '4px';
	
	if (!mxClient.IS_QUIRKS)
	{
		input.style.position = 'absolute';
		input.style.right = '32px';
	}
	
	input.style.width = '46px';
	input.style.height = (mxClient.IS_QUIRKS) ? '21px' : '17px';
	stylePanel2.appendChild(input);
	
	// Workaround for font size 4 if no text is selected is update font size below
	// after first character was entered (as the font element is lazy created)
	var pendingFontSize = null;

	var inputUpdate = this.installInputHandler(input, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize, 1, 999, ' pt',
	function(fontsize)
	{
		pendingFontSize = fontsize;

		// Workaround for can't set font size in px is to change font size afterwards
		document.execCommand('fontSize', false, '4');
		var elts = graph.cellEditor.textarea.getElementsByTagName('font');
		
		for (var i = 0; i < elts.length; i++)
		{
			if (elts[i].getAttribute('size') == '4')
			{
				elts[i].removeAttribute('size');
				elts[i].style.fontSize = pendingFontSize + 'px';
	
				// Overrides fontSize in input with the one just assigned as a workaround
				// for potential fontSize values of parent elements that don't match
				window.setTimeout(function()
				{
					input.value = pendingFontSize + ' pt';
					pendingFontSize = null;
				}, 0);
				
				break;
			}
		}
	}, true);
	
	var stepper = this.createStepper(input, inputUpdate, 1, 10, true, Menus.prototype.defaultFontSize);
	stepper.style.display = input.style.display;
	stepper.style.marginTop = '4px';
	
	if (!mxClient.IS_QUIRKS)
	{
		stepper.style.right = '20px';
	}
	
	stylePanel2.appendChild(stepper);
	
	var arrow = fontMenu.getElementsByTagName('div')[0];
	arrow.style.cssFloat = 'right';
	
	var bgColorApply = null;
	var currentBgColor = '#ffffff';
	
	var fontColorApply = null;
	var currentFontColor = '#000000';
		
	var bgPanel = (graph.cellEditor.isContentEditing()) ? this.createColorOption(mxResources.get('backgroundColor'), function()
	{
		return currentBgColor;
	}, function(color)
	{
		document.execCommand('backcolor', false, (color != mxConstants.NONE) ? color : 'transparent');
	}, '#ffffff',
	{
		install: function(apply) { bgColorApply = apply; },
		destroy: function() { bgColorApply = null; }
	}, null, true) : this.createCellColorOption(mxResources.get('backgroundColor'), mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, '#ffffff');
	bgPanel.style.fontWeight = 'bold';

	var borderPanel = this.createCellColorOption(mxResources.get('borderColor'), mxConstants.STYLE_LABEL_BORDERCOLOR, '#000000');
	borderPanel.style.fontWeight = 'bold';
	
	var panel = (graph.cellEditor.isContentEditing()) ? this.createColorOption(mxResources.get('fontColor'), function()
	{
		return currentFontColor;
	}, function(color)
	{
		document.execCommand('forecolor', false, (color != mxConstants.NONE) ? color : 'transparent');
	}, '#000000',
	{
		install: function(apply) { fontColorApply = apply; },
		destroy: function() { fontColorApply = null; }
	}, null, true) : this.createCellColorOption(mxResources.get('fontColor'), mxConstants.STYLE_FONTCOLOR, '#000000', function(color)
	{
		if (color == null || color == mxConstants.NONE)
		{
			bgPanel.style.display = 'none';
		}
		else
		{
			bgPanel.style.display = '';
		}
		
		borderPanel.style.display = bgPanel.style.display;
	}, function(color)
	{
		if (color == null || color == mxConstants.NONE)
		{
			graph.setCellStyles(mxConstants.STYLE_NOLABEL, '1', graph.getSelectionCells());
		}
		else
		{
			graph.setCellStyles(mxConstants.STYLE_NOLABEL, null, graph.getSelectionCells());
		}
	});
	panel.style.fontWeight = 'bold';
	
	colorPanel.appendChild(panel);
	colorPanel.appendChild(bgPanel);
	
	if (!graph.cellEditor.isContentEditing())
	{
		colorPanel.appendChild(borderPanel);
	}
	
	container.appendChild(colorPanel);

	var extraPanel = this.createPanel();
	extraPanel.style.paddingTop = '2px';
	extraPanel.style.paddingBottom = '4px';
	
	// LATER: Fix toggle using '' instead of 'null'
	var wwOpt = this.createCellOption(mxResources.get('wordWrap'), mxConstants.STYLE_WHITE_SPACE, null, 'wrap', 'null', null, null, true);
	wwOpt.style.fontWeight = 'bold';
	
	// Word wrap in edge labels only supported via labelWidth style
	if (!ss.containsLabel && !ss.autoSize && ss.edges.length == 0)
	{
		extraPanel.appendChild(wwOpt);
	}
	
	// Delegates switch of style to formattedText action as it also convertes newlines
	var htmlOpt = this.createCellOption(mxResources.get('formattedText'), 'html', '0',
		null, null, null, ui.actions.get('formattedText'));
	htmlOpt.style.fontWeight = 'bold';
	extraPanel.appendChild(htmlOpt);
	
	var spacingPanel = this.createPanel();
	spacingPanel.style.paddingTop = '10px';
	spacingPanel.style.paddingBottom = '28px';
	spacingPanel.style.fontWeight = 'normal';
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	span.style.fontWeight = 'bold';
	mxUtils.write(span, mxResources.get('spacing'));
	spacingPanel.appendChild(span);

	var topUpdate, globalUpdate, leftUpdate, bottomUpdate, rightUpdate;
	var topSpacing = this.addUnitInput(spacingPanel, 'pt', 91, 44, function()
	{
		topUpdate.apply(this, arguments);
	});
	var globalSpacing = this.addUnitInput(spacingPanel, 'pt', 20, 44, function()
	{
		globalUpdate.apply(this, arguments);
	});

	mxUtils.br(spacingPanel);
	this.addLabel(spacingPanel, mxResources.get('top'), 91);
	this.addLabel(spacingPanel, mxResources.get('global'), 20);
	mxUtils.br(spacingPanel);
	mxUtils.br(spacingPanel);

	var leftSpacing = this.addUnitInput(spacingPanel, 'pt', 162, 44, function()
	{
		leftUpdate.apply(this, arguments);
	});
	var bottomSpacing = this.addUnitInput(spacingPanel, 'pt', 91, 44, function()
	{
		bottomUpdate.apply(this, arguments);
	});
	var rightSpacing = this.addUnitInput(spacingPanel, 'pt', 20, 44, function()
	{
		rightUpdate.apply(this, arguments);
	});

	mxUtils.br(spacingPanel);
	this.addLabel(spacingPanel, mxResources.get('left'), 162);
	this.addLabel(spacingPanel, mxResources.get('bottom'), 91);
	this.addLabel(spacingPanel, mxResources.get('right'), 20);
	
	if (!graph.cellEditor.isContentEditing())
	{
		container.appendChild(extraPanel);
		container.appendChild(this.createRelativeOption(mxResources.get('opacity'), mxConstants.STYLE_TEXT_OPACITY));
		container.appendChild(spacingPanel);
	}
	else
	{
		var selState = null;
		var lineHeightInput = null;
		
		container.appendChild(this.createRelativeOption(mxResources.get('lineheight'), null, null, function(input)
		{
			var value = (input.value == '') ? 120 : parseInt(input.value);
			value = Math.max(0, (isNaN(value)) ? 120 : value);

			if (selState != null)
			{
				graph.cellEditor.restoreSelection(selState);
				selState = null;
			}
			
			var selectedElement = graph.getSelectedElement();
			var node = selectedElement;
			
			while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT)
			{
				node = node.parentNode;
			}
			
			if (node != null && node == graph.cellEditor.textarea && graph.cellEditor.textarea.firstChild != null)
			{
				if (graph.cellEditor.textarea.firstChild.nodeName != 'P')
				{
					graph.cellEditor.textarea.innerHTML = '<p>' + graph.cellEditor.textarea.innerHTML + '</p>';
				}
				
				node = graph.cellEditor.textarea.firstChild;
			}
			
			if (node != null && node != graph.cellEditor.textarea)
			{
				node.style.lineHeight = value + '%';
			}
			
			input.value = value + ' %';
		}, function(input)
		{
			// Used in CSS handler to update current value
			lineHeightInput = input;
			
			// KNOWN: Arrow up/down clear selection text in quirks/IE 8
			// Text size via arrow button limits to 16 in IE11. Why?
			mxEvent.addListener(input, 'mousedown', function()
			{
				selState = graph.cellEditor.saveSelection();
			});
			
			mxEvent.addListener(input, 'touchstart', function()
			{
				selState = graph.cellEditor.saveSelection();
			});
			
			input.value = '120 %';
		}));
		
		var insertPanel = stylePanel.cloneNode(false);
		insertPanel.style.paddingLeft = '0px';
		var insertBtns = this.editorUi.toolbar.addItems(['link', 'image'], insertPanel, true);

		var btns = [
		        this.editorUi.toolbar.addButton('geSprite-horizontalrule', mxResources.get('insertHorizontalRule'),
				function()
				{
					document.execCommand('inserthorizontalrule', false, null);
				}, insertPanel),				
				this.editorUi.toolbar.addMenuFunctionInContainer(insertPanel, 'geSprite-table', mxResources.get('table'), false, mxUtils.bind(this, function(menu)
				{
					this.editorUi.menus.addInsertTableItem(menu);
				}))];
		this.styleButtons(insertBtns);
		this.styleButtons(btns);
		
		var wrapper2 = this.createPanel();
		wrapper2.style.paddingTop = '10px';
		wrapper2.style.paddingBottom = '10px';
		wrapper2.appendChild(this.createTitle(mxResources.get('insert')));
		wrapper2.appendChild(insertPanel);
		container.appendChild(wrapper2);
		
		if (mxClient.IS_QUIRKS)
		{
			wrapper2.style.height = '70';
		}
		
		var tablePanel = stylePanel.cloneNode(false);
		tablePanel.style.paddingLeft = '0px';
		
		var btns = [
		        this.editorUi.toolbar.addButton('geSprite-insertcolumnbefore', mxResources.get('insertColumnBefore'),
				function()
				{
					try
					{
			        	if (currentTable != null)
			        	{
			        		graph.selectNode(graph.insertColumn(currentTable, (tableCell != null) ? tableCell.cellIndex : 0));
			        	}
					}
					catch (e)
					{
						alert(e);
					}
				}, tablePanel),
				this.editorUi.toolbar.addButton('geSprite-insertcolumnafter', mxResources.get('insertColumnAfter'),
				function()
				{
					try
					{
						if (currentTable != null)
			        	{
							graph.selectNode(graph.insertColumn(currentTable, (tableCell != null) ? tableCell.cellIndex + 1 : -1));
			        	}
					}
					catch (e)
					{
						alert(e);
					}
				}, tablePanel),
				this.editorUi.toolbar.addButton('geSprite-deletecolumn', mxResources.get('deleteColumn'),
				function()
				{
					try
					{
						if (currentTable != null && tableCell != null)
						{
							graph.deleteColumn(currentTable, tableCell.cellIndex);
						}
					}
					catch (e)
					{
						alert(e);
					}
				}, tablePanel),
				this.editorUi.toolbar.addButton('geSprite-insertrowbefore', mxResources.get('insertRowBefore'),
				function()
				{
					try
					{
						if (currentTable != null && tableRow != null)
						{
							graph.selectNode(graph.insertRow(currentTable, tableRow.sectionRowIndex));
						}
					}
					catch (e)
					{
						alert(e);
					}
				}, tablePanel),
				this.editorUi.toolbar.addButton('geSprite-insertrowafter', mxResources.get('insertRowAfter'),
				function()
				{
					try
					{
						if (currentTable != null && tableRow != null)
						{
							graph.selectNode(graph.insertRow(currentTable, tableRow.sectionRowIndex + 1));
						}
					}
					catch (e)
					{
						alert(e);
					}
				}, tablePanel),
				this.editorUi.toolbar.addButton('geSprite-deleterow', mxResources.get('deleteRow'),
				function()
				{
					try
					{
						if (currentTable != null && tableRow != null)
						{
							graph.deleteRow(currentTable, tableRow.sectionRowIndex);
						}
					}
					catch (e)
					{
						alert(e);
					}
				}, tablePanel)];
		this.styleButtons(btns);
		btns[2].style.marginRight = '9px';
		
		var wrapper3 = this.createPanel();
		wrapper3.style.paddingTop = '10px';
		wrapper3.style.paddingBottom = '10px';
		wrapper3.appendChild(this.createTitle(mxResources.get('table')));
		wrapper3.appendChild(tablePanel);

		if (mxClient.IS_QUIRKS)
		{
			mxUtils.br(container);
			wrapper3.style.height = '70';
		}
		
		var tablePanel2 = stylePanel.cloneNode(false);
		tablePanel2.style.paddingLeft = '0px';
		
		var btns = [
		        this.editorUi.toolbar.addButton('geSprite-strokecolor', mxResources.get('borderColor'),
				mxUtils.bind(this, function()
				{
					if (currentTable != null)
					{
						// Converts rgb(r,g,b) values
						var color = currentTable.style.borderColor.replace(
							    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
							    function($0, $1, $2, $3) {
							        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
							    });
						this.editorUi.pickColor(color, function(newColor)
						{
							if (newColor == null || newColor == mxConstants.NONE)
							{
								currentTable.removeAttribute('border');
								currentTable.style.border = '';
								currentTable.style.borderCollapse = '';
							}
							else
							{
								currentTable.setAttribute('border', '1');
								currentTable.style.border = '1px solid ' + newColor;
								currentTable.style.borderCollapse = 'collapse';
							}
						});
					}
				}), tablePanel2),
				this.editorUi.toolbar.addButton('geSprite-fillcolor', mxResources.get('backgroundColor'),
				mxUtils.bind(this, function()
				{
					// Converts rgb(r,g,b) values
					if (currentTable != null)
					{
						var color = currentTable.style.backgroundColor.replace(
							    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
							    function($0, $1, $2, $3) {
							        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
							    });
						this.editorUi.pickColor(color, function(newColor)
						{
							if (newColor == null || newColor == mxConstants.NONE)
							{
								currentTable.style.backgroundColor = '';
							}
							else
							{
								currentTable.style.backgroundColor = newColor;
							}
						});
					}
				}), tablePanel2),
				this.editorUi.toolbar.addButton('geSprite-fit', mxResources.get('spacing'),
				function()
				{
					if (currentTable != null)
					{
						var value = currentTable.getAttribute('cellPadding') || 0;
						
						var dlg = new FilenameDialog(ui, value, mxResources.get('apply'), mxUtils.bind(this, function(newValue)
						{
							if (newValue != null && newValue.length > 0)
							{
								currentTable.setAttribute('cellPadding', newValue);
							}
							else
							{
								currentTable.removeAttribute('cellPadding');
							}
						}), mxResources.get('spacing'));
						ui.showDialog(dlg.container, 300, 80, true, true);
						dlg.init();
					}
				}, tablePanel2),
				this.editorUi.toolbar.addButton('geSprite-left', mxResources.get('left'),
				function()
				{
					if (currentTable != null)
					{
						currentTable.setAttribute('align', 'left');
					}
				}, tablePanel2),
				this.editorUi.toolbar.addButton('geSprite-center', mxResources.get('center'),
				function()
				{
					if (currentTable != null)
					{
						currentTable.setAttribute('align', 'center');
					}
				}, tablePanel2),
				this.editorUi.toolbar.addButton('geSprite-right', mxResources.get('right'),
				function()
				{
					if (currentTable != null)
					{
						currentTable.setAttribute('align', 'right');
					}
				}, tablePanel2)];
		this.styleButtons(btns);
		btns[2].style.marginRight = '9px';
		
		if (mxClient.IS_QUIRKS)
		{
			mxUtils.br(wrapper3);
			mxUtils.br(wrapper3);
		}
		
		wrapper3.appendChild(tablePanel2);
		container.appendChild(wrapper3);
		
		tableWrapper = wrapper3;
	}
	
	function setSelected(elt, selected)
	{
		if (mxClient.IS_IE && (mxClient.IS_QUIRKS || document.documentMode < 10))
		{
			elt.style.filter = (selected) ? 'progid:DXImageTransform.Microsoft.Gradient('+
            	'StartColorStr=\'#c5ecff\', EndColorStr=\'#87d4fb\', GradientType=0)' : '';
		}
		else
		{
			elt.style.backgroundImage = (selected) ? 'linear-gradient(#c5ecff 0px,#87d4fb 100%)' : '';
		}
	};
	
	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		ss = this.format.getSelectionState();
		var fontStyle = mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSTYLE, 0);
		setSelected(fontStyleItems[0], (fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD);
		setSelected(fontStyleItems[1], (fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC);
		setSelected(fontStyleItems[2], (fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE);
		fontMenu.firstChild.nodeValue = mxUtils.htmlEntities(mxUtils.getValue(ss.style, mxConstants.STYLE_FONTFAMILY, Menus.prototype.defaultFont));

		setSelected(verticalItem, mxUtils.getValue(ss.style, mxConstants.STYLE_HORIZONTAL, '1') == '0');
		
		if (force || document.activeElement != input)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize));
			input.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
		
		var align = mxUtils.getValue(ss.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
		setSelected(left, align == mxConstants.ALIGN_LEFT);
		setSelected(center, align == mxConstants.ALIGN_CENTER);
		setSelected(right, align == mxConstants.ALIGN_RIGHT);
		
		var valign = mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
		setSelected(top, valign == mxConstants.ALIGN_TOP);
		setSelected(middle, valign == mxConstants.ALIGN_MIDDLE);
		setSelected(bottom, valign == mxConstants.ALIGN_BOTTOM);
		
		var pos = mxUtils.getValue(ss.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
		var vpos =  mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
		
		if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_TOP)
		{
			positionSelect.value = 'topLeft';
		}
		else if (pos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_TOP)
		{
			positionSelect.value = 'top';
		}
		else if (pos == mxConstants.ALIGN_RIGHT && vpos == mxConstants.ALIGN_TOP)
		{
			positionSelect.value = 'topRight';
		}
		else if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_BOTTOM)
		{
			positionSelect.value = 'bottomLeft';
		}
		else if (pos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_BOTTOM)
		{
			positionSelect.value = 'bottom';
		}
		else if (pos == mxConstants.ALIGN_RIGHT && vpos == mxConstants.ALIGN_BOTTOM)
		{
			positionSelect.value = 'bottomRight';
		}
		else if (pos == mxConstants.ALIGN_LEFT)
		{
			positionSelect.value = 'left';
		}
		else if (pos == mxConstants.ALIGN_RIGHT)
		{
			positionSelect.value = 'right';
		}
		else
		{
			positionSelect.value = 'center';
		}
		
		var dir = mxUtils.getValue(ss.style, mxConstants.STYLE_TEXT_DIRECTION, mxConstants.DEFAULT_TEXT_DIRECTION);
		
		if (dir == mxConstants.TEXT_DIRECTION_RTL)
		{
			dirSelect.value = 'rightToLeft';
		}
		else if (dir == mxConstants.TEXT_DIRECTION_LTR)
		{
			dirSelect.value = 'leftToRight';
		}
		else if (dir == mxConstants.TEXT_DIRECTION_AUTO)
		{
			dirSelect.value = 'automatic';
		}
		
		if (force || document.activeElement != globalSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING, 2));
			globalSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}

		if (force || document.activeElement != topSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_TOP, 0));
			topSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
		
		if (force || document.activeElement != rightSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_RIGHT, 0));
			rightSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
		
		if (force || document.activeElement != bottomSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_BOTTOM, 0));
			bottomSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
		
		if (force || document.activeElement != leftSpacing)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_LEFT, 0));
			leftSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
	});

	globalUpdate = this.installInputHandler(globalSpacing, mxConstants.STYLE_SPACING, 2, -999, 999, ' pt');
	topUpdate = this.installInputHandler(topSpacing, mxConstants.STYLE_SPACING_TOP, 0, -999, 999, ' pt');
	rightUpdate = this.installInputHandler(rightSpacing, mxConstants.STYLE_SPACING_RIGHT, 0, -999, 999, ' pt');
	bottomUpdate = this.installInputHandler(bottomSpacing, mxConstants.STYLE_SPACING_BOTTOM, 0, -999, 999, ' pt');
	leftUpdate = this.installInputHandler(leftSpacing, mxConstants.STYLE_SPACING_LEFT, 0, -999, 999, ' pt');

	this.addKeyHandler(input, listener);
	this.addKeyHandler(globalSpacing, listener);
	this.addKeyHandler(topSpacing, listener);
	this.addKeyHandler(rightSpacing, listener);
	this.addKeyHandler(bottomSpacing, listener);
	this.addKeyHandler(leftSpacing, listener);

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
	
	if (graph.cellEditor.isContentEditing())
	{
		var updating = false;
		
		var updateCssHandler = function()
		{
			if (!updating)
			{
				updating = true;
			
				window.setTimeout(function()
				{
					var selectedElement = graph.getSelectedElement();
					var node = selectedElement;
					
					while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT)
					{
						node = node.parentNode;
					}
					
					if (node != null)
					{
						// Workaround for commonAncestor on range in IE11 returning parent of common ancestor
						if (node == graph.cellEditor.textarea && graph.cellEditor.textarea.children.length == 1 &&
							graph.cellEditor.textarea.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT)
						{
							node = graph.cellEditor.textarea.firstChild;
						}
						
						var css = mxUtils.getCurrentStyle(node);
						
						if (css != null)
						{
							setSelected(fontStyleItems[0], css.fontWeight == 'bold' || graph.getParentByName(node, 'B', graph.cellEditor.textarea) != null);
							setSelected(fontStyleItems[1], css.fontStyle == 'italic' || graph.getParentByName(node, 'I', graph.cellEditor.textarea) != null);
							setSelected(fontStyleItems[2], graph.getParentByName(node, 'U', graph.cellEditor.textarea) != null);
							setSelected(left, css.textAlign == 'left');
							setSelected(center, css.textAlign == 'center');
							setSelected(right, css.textAlign == 'right');
							setSelected(full, css.textAlign == 'justify');
							setSelected(sup, graph.getParentByName(node, 'SUP', graph.cellEditor.textarea) != null);
							setSelected(sub, graph.getParentByName(node, 'SUB', graph.cellEditor.textarea) != null);
							
							currentTable = graph.getParentByName(node, 'TABLE', graph.cellEditor.textarea);
							tableRow = (currentTable == null) ? null : graph.getParentByName(node, 'TR', currentTable);
							tableCell = (currentTable == null) ? null : graph.getParentByName(node, 'TD', currentTable);
							tableWrapper.style.display = (currentTable != null) ? '' : 'none';
							
							if (document.activeElement != input)
							{
								if (node.nodeName == 'FONT' && node.getAttribute('size') == '4' &&
									pendingFontSize != null)
								{
									node.removeAttribute('size');
									node.style.fontSize = pendingFontSize + 'px';
									pendingFontSize = null;
								}
								else
								{
									input.value = parseFloat(css.fontSize) + ' pt';
								}
								
								var tmp = node.style.lineHeight || css.lineHeight;
								var lh = parseFloat(tmp);
								
								if (tmp.substring(tmp.length - 2) == 'px')
								{
									lh = lh / parseFloat(css.fontSize);
								}
								
								if (tmp.substring(tmp.length - 1) != '%')
								{
									lh *= 100; 
								}
								
								lineHeightInput.value = lh + ' %';
							}
							
							// Converts rgb(r,g,b) values
							var color = css.color.replace(
								    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
								    function($0, $1, $2, $3) {
								        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
								    });
							var color2 = css.backgroundColor.replace(
								    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
								    function($0, $1, $2, $3) {
								        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
								    });
							
							// Updates the color picker for the current font
							if (fontColorApply != null)
							{
								if (color.charAt(0) == '#')
								{
									currentFontColor = color;
								}
								else
								{
									currentFontColor = '#000000';
								}
								
								fontColorApply(currentFontColor, true);
							}
							
							if (bgColorApply != null)
							{
								if (color2.charAt(0) == '#')
								{
									currentBgColor = color2;
								}
								else
								{
									currentBgColor = null;
								}
								
								bgColorApply(currentBgColor, true);
							}
							
							// Workaround for firstChild is null or not an object
							// in the log which seems to be IE8- only / 29.01.15
							if (fontMenu.firstChild != null)
							{
								// Strips leading and trailing quotes
								var ff = css.fontFamily;
								
								if (ff.charAt(0) == '\'')
								{
									ff = ff.substring(1);
								}
								
								if (ff.charAt(ff.length - 1) == '\'')
								{
									ff = ff.substring(0, ff.length - 1);
								}

								if (ff.charAt(0) == '"')
								{
									ff = ff.substring(1);
								}
								
								if (ff.charAt(ff.length - 1) == '"')
								{
									ff = ff.substring(0, ff.length - 1);
								}
								
								fontMenu.firstChild.nodeValue = ff;
							}
						}
					}
					
					updating = false;
				}, 0);
			}
		};
		
		mxEvent.addListener(graph.cellEditor.textarea, 'input', updateCssHandler)
		mxEvent.addListener(graph.cellEditor.textarea, 'touchend', updateCssHandler);
		mxEvent.addListener(graph.cellEditor.textarea, 'mouseup', updateCssHandler);
		mxEvent.addListener(graph.cellEditor.textarea, 'keyup', updateCssHandler);
		this.listeners.push({destroy: function()
		{
			// No need to remove listener since textarea is destroyed after edit
		}});
		updateCssHandler();
	}

	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(StyleFormatPanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.format.getSelectionState();
	
	if (!ss.containsImage || ss.style.shape == 'image')
	{
		this.container.appendChild(this.addFill(this.createPanel()));
	}

	this.container.appendChild(this.addStroke(this.createPanel()));
	this.container.appendChild(this.addLineJumps(this.createPanel()));
	var opacityPanel = this.createRelativeOption(mxResources.get('opacity'), mxConstants.STYLE_OPACITY, 41);
	opacityPanel.style.paddingTop = '8px';
	opacityPanel.style.paddingBottom = '8px';
	this.container.appendChild(opacityPanel);
	this.container.appendChild(this.addEffects(this.createPanel()));
	var opsPanel = this.addEditOps(this.createPanel());
	
	if (opsPanel.firstChild != null)
	{
		mxUtils.br(opsPanel);
	}
	
	this.container.appendChild(this.addStyleOps(opsPanel));
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addEditOps = function(div)
{
	var ss = this.format.getSelectionState();
	var btn = null;
	
	if (this.editorUi.editor.graph.getSelectionCount() == 1)
	{
		btn = mxUtils.button(mxResources.get('editStyle'), mxUtils.bind(this, function(evt)
		{
			this.editorUi.actions.get('editStyle').funct();
		}));
		
		btn.setAttribute('title', mxResources.get('editStyle') + ' (' + this.editorUi.actions.get('editStyle').shortcut + ')');
		btn.style.width = '202px';
		btn.style.marginBottom = '2px';
		
		div.appendChild(btn);
	}
	
	if (ss.image)
	{
		var btn2 = mxUtils.button(mxResources.get('editImage'), mxUtils.bind(this, function(evt)
		{
			this.editorUi.actions.get('image').funct();
		}));
		
		btn2.setAttribute('title', mxResources.get('editImage'));
		btn2.style.marginBottom = '2px';
		
		if (btn == null)
		{
			btn2.style.width = '202px';
		}
		else
		{
			btn.style.width = '100px';
			btn2.style.width = '100px';
			btn2.style.marginLeft = '2px';
		}
		
		div.appendChild(btn2);
	}
	
	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addFill = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = this.format.getSelectionState();
	container.style.paddingTop = '6px';
	container.style.paddingBottom = '6px';

	// Adds gradient direction option
	var gradientSelect = document.createElement('select');
	gradientSelect.style.position = 'absolute';
	gradientSelect.style.marginTop = '-2px';
	gradientSelect.style.right = (mxClient.IS_QUIRKS) ? '52px' : '72px';
	gradientSelect.style.width = '70px';
	
	// Stops events from bubbling to color option event handler
	mxEvent.addListener(gradientSelect, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});

	var gradientPanel = this.createCellColorOption(mxResources.get('gradient'), mxConstants.STYLE_GRADIENTCOLOR, '#ffffff', function(color)
	{
		if (color == null || color == mxConstants.NONE)
		{
			gradientSelect.style.display = 'none';
		}
		else
		{
			gradientSelect.style.display = '';
		}
	});

	var fillKey = (ss.style.shape == 'image') ? mxConstants.STYLE_IMAGE_BACKGROUND : mxConstants.STYLE_FILLCOLOR;
	
	var fillPanel = this.createCellColorOption(mxResources.get('fill'), fillKey, '#ffffff');
	fillPanel.style.fontWeight = 'bold';

	var tmpColor = mxUtils.getValue(ss.style, fillKey, null);
	gradientPanel.style.display = (tmpColor != null && tmpColor != mxConstants.NONE &&
		ss.fill && ss.style.shape != 'image') ? '' : 'none';

	var directions = [mxConstants.DIRECTION_NORTH, mxConstants.DIRECTION_EAST,
	                  mxConstants.DIRECTION_SOUTH, mxConstants.DIRECTION_WEST];

	for (var i = 0; i < directions.length; i++)
	{
		var gradientOption = document.createElement('option');
		gradientOption.setAttribute('value', directions[i]);
		mxUtils.write(gradientOption, mxResources.get(directions[i]));
		gradientSelect.appendChild(gradientOption);
	}
	
	gradientPanel.appendChild(gradientSelect);

	var listener = mxUtils.bind(this, function()
	{
		ss = this.format.getSelectionState();
		var value = mxUtils.getValue(ss.style, mxConstants.STYLE_GRADIENT_DIRECTION, mxConstants.DIRECTION_SOUTH);
		
		// Handles empty string which is not allowed as a value
		if (value == '')
		{
			value = mxConstants.DIRECTION_SOUTH;
		}
		
		gradientSelect.value = value;
		container.style.display = (ss.fill) ? '' : 'none';
		
		var fillColor = mxUtils.getValue(ss.style, mxConstants.STYLE_FILLCOLOR, null);

		if (!ss.fill || ss.containsImage || fillColor == null || fillColor == mxConstants.NONE || ss.style.shape == 'filledEdge')
		{
			gradientPanel.style.display = 'none';
		}
		else
		{
			gradientPanel.style.display = '';
		}
	});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	mxEvent.addListener(gradientSelect, 'change', function(evt)
	{
		graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, gradientSelect.value, graph.getSelectionCells());
		mxEvent.consume(evt);
	});
	
	container.appendChild(fillPanel);
	container.appendChild(gradientPanel);

	if (ss.style.shape == 'swimlane')
	{
		container.appendChild(this.createCellColorOption(mxResources.get('laneColor'), 'swimlaneFillColor', '#ffffff'));
	}

	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addStroke = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = this.format.getSelectionState();
	
	container.style.paddingTop = '4px';
	container.style.paddingBottom = '4px';
	container.style.whiteSpace = 'normal';
	
	var colorPanel = document.createElement('div');
	colorPanel.style.fontWeight = 'bold';
	
	// Adds gradient direction option
	var styleSelect = document.createElement('select');
	styleSelect.style.position = 'absolute';
	styleSelect.style.marginTop = '-2px';
	styleSelect.style.right = '72px';
	styleSelect.style.width = '80px';

	var styles = ['sharp', 'rounded', 'curved'];

	for (var i = 0; i < styles.length; i++)
	{
		var styleOption = document.createElement('option');
		styleOption.setAttribute('value', styles[i]);
		mxUtils.write(styleOption, mxResources.get(styles[i]));
		styleSelect.appendChild(styleOption);
	}
	
	mxEvent.addListener(styleSelect, 'change', function(evt)
	{
		graph.getModel().beginUpdate();
		try
		{
			var keys = [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED];
			// Default for rounded is 1
			var values = ['0', null];
			
			if (styleSelect.value == 'rounded')
			{
				values = ['1', null];
			}
			else if (styleSelect.value == 'curved')
			{
				values = [null, '1'];
			}
			
			for (var i = 0; i < keys.length; i++)
			{
				graph.setCellStyles(keys[i], values[i], graph.getSelectionCells());
			}
			
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', keys,
				'values', values, 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
		
		mxEvent.consume(evt);
	});
	
	// Stops events from bubbling to color option event handler
	mxEvent.addListener(styleSelect, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});

	var strokeKey = (ss.style.shape == 'image') ? mxConstants.STYLE_IMAGE_BORDER : mxConstants.STYLE_STROKECOLOR;
	
	var lineColor = this.createCellColorOption(mxResources.get('line'), strokeKey, '#000000');
	lineColor.appendChild(styleSelect);
	colorPanel.appendChild(lineColor);
	
	// Used if only edges selected
	var stylePanel = colorPanel.cloneNode(false);
	stylePanel.style.fontWeight = 'normal';
	stylePanel.style.whiteSpace = 'nowrap';
	stylePanel.style.position = 'relative';
	stylePanel.style.paddingLeft = '16px'
	stylePanel.style.marginBottom = '2px';
	stylePanel.style.marginTop = '2px';
	stylePanel.className = 'geToolbarContainer';

	var addItem = mxUtils.bind(this, function(menu, width, cssName, keys, values)
	{
		var item = this.editorUi.menus.styleChange(menu, '', keys, values, 'geIcon', null);
	
		var pat = document.createElement('div');
		pat.style.width = width + 'px';
		pat.style.height = '1px';
		pat.style.borderBottom = '1px ' + cssName + ' black';
		pat.style.paddingTop = '6px';

		item.firstChild.firstChild.style.padding = '0px 4px 0px 4px';
		item.firstChild.firstChild.style.width = width + 'px';
		item.firstChild.firstChild.appendChild(pat);
		
		return item;
	});

	var pattern = this.editorUi.toolbar.addMenuFunctionInContainer(stylePanel, 'geSprite-orthogonal', mxResources.get('pattern'), false, mxUtils.bind(this, function(menu)
	{
		addItem(menu, 75, 'solid', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], [null, null]).setAttribute('title', mxResources.get('solid'));
		addItem(menu, 75, 'dashed', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], ['1', null]).setAttribute('title', mxResources.get('dashed'));
		addItem(menu, 75, 'dotted', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], ['1', '1 1']).setAttribute('title', mxResources.get('dotted') + ' (1)');
		addItem(menu, 75, 'dotted', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], ['1', '1 2']).setAttribute('title', mxResources.get('dotted') + ' (2)');
		addItem(menu, 75, 'dotted', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], ['1', '1 4']).setAttribute('title', mxResources.get('dotted') + ' (3)');
	}));
	
	// Used for mixed selection (vertices and edges)
	var altStylePanel = stylePanel.cloneNode(false);
	
	var edgeShape = this.editorUi.toolbar.addMenuFunctionInContainer(altStylePanel, 'geSprite-connection', mxResources.get('connection'), false, mxUtils.bind(this, function(menu)
	{
		this.editorUi.menus.styleChange(menu, '', [mxConstants.STYLE_SHAPE, mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE, 'width'], [null, null, null, null], 'geIcon geSprite geSprite-connection', null, true).setAttribute('title', mxResources.get('line'));
		this.editorUi.menus.styleChange(menu, '', [mxConstants.STYLE_SHAPE, mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE, 'width'], ['link', null, null, null], 'geIcon geSprite geSprite-linkedge', null, true).setAttribute('title', mxResources.get('link'));
		this.editorUi.menus.styleChange(menu, '', [mxConstants.STYLE_SHAPE, mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE, 'width'], ['flexArrow', null, null, null], 'geIcon geSprite geSprite-arrow', null, true).setAttribute('title', mxResources.get('arrow'));
		this.editorUi.menus.styleChange(menu, '', [mxConstants.STYLE_SHAPE, mxConstants.STYLE_STARTSIZE, mxConstants.STYLE_ENDSIZE, 'width'], ['arrow', null, null, null], 'geIcon geSprite geSprite-simplearrow', null, true).setAttribute('title', mxResources.get('simpleArrow')); 
	}));

	var altPattern = this.editorUi.toolbar.addMenuFunctionInContainer(altStylePanel, 'geSprite-orthogonal', mxResources.get('pattern'), false, mxUtils.bind(this, function(menu)
	{
		addItem(menu, 33, 'solid', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], [null, null]).setAttribute('title', mxResources.get('solid'));
		addItem(menu, 33, 'dashed', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], ['1', null]).setAttribute('title', mxResources.get('dashed'));
		addItem(menu, 33, 'dotted', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], ['1', '1 1']).setAttribute('title', mxResources.get('dotted') + ' (1)');
		addItem(menu, 33, 'dotted', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], ['1', '1 2']).setAttribute('title', mxResources.get('dotted') + ' (2)');
		addItem(menu, 33, 'dotted', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN], ['1', '1 4']).setAttribute('title', mxResources.get('dotted') + ' (3)');
	}));
	
	var stylePanel2 = stylePanel.cloneNode(false);

	// Stroke width
	var input = document.createElement('input');
	input.style.textAlign = 'right';
	input.style.marginTop = '2px';
	input.style.width = '41px';
	input.setAttribute('title', mxResources.get('linewidth'));
	
	stylePanel.appendChild(input);
	
	var altInput = input.cloneNode(true);
	altStylePanel.appendChild(altInput);

	function update(evt)
	{
		// Maximum stroke width is 999
		var value = parseInt(input.value);
		value = Math.min(999, Math.max(1, (isNaN(value)) ? 1 : value));
		
		if (value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1))
		{
			graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, value, graph.getSelectionCells());
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_STROKEWIDTH],
					'values', [value], 'cells', graph.getSelectionCells()));
		}

		input.value = value + ' pt';
		mxEvent.consume(evt);
	};

	function altUpdate(evt)
	{
		// Maximum stroke width is 999
		var value = parseInt(altInput.value);
		value = Math.min(999, Math.max(1, (isNaN(value)) ? 1 : value));
		
		if (value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1))
		{
			graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, value, graph.getSelectionCells());
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_STROKEWIDTH],
					'values', [value], 'cells', graph.getSelectionCells()));
		}

		altInput.value = value + ' pt';
		mxEvent.consume(evt);
	};

	var stepper = this.createStepper(input, update, 1, 9);
	stepper.style.display = input.style.display;
	stepper.style.marginTop = '2px';
	stylePanel.appendChild(stepper);
	
	var altStepper = this.createStepper(altInput, altUpdate, 1, 9);
	altStepper.style.display = altInput.style.display;
	altStepper.style.marginTop = '2px';
	altStylePanel.appendChild(altStepper);
	
	if (!mxClient.IS_QUIRKS)
	{
		input.style.position = 'absolute';
		input.style.right = '32px';
		//input.style.height = '15px';
		input.style.height = '17px';
		stepper.style.right = '20px';

		altInput.style.position = 'absolute';
		altInput.style.right = '32px';
		//altInput.style.height = '15px';
		altInput.style.height = '27px';
		altStepper.style.right = '20px';
	}
	else
	{
		//input.style.height = '17px';
		//altInput.style.height = '17px';
		input.style.height = '17px';
		altInput.style.height = '27px';
	}
	
	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);

	mxEvent.addListener(altInput, 'blur', altUpdate);
	mxEvent.addListener(altInput, 'change', altUpdate);
	
	if (mxClient.IS_QUIRKS)
	{
		mxUtils.br(stylePanel2);
		mxUtils.br(stylePanel2);
	}
	
	var edgeStyle = this.editorUi.toolbar.addMenuFunctionInContainer(stylePanel2, 'geSprite-orthogonal', mxResources.get('waypoints'), false, mxUtils.bind(this, function(menu)
	{
		if (ss.style.shape != 'arrow')
		{
			this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], [null, null, null], 'geIcon geSprite geSprite-straight', null, true).setAttribute('title', mxResources.get('straight'));
			this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ['orthogonalEdgeStyle', null, null], 'geIcon geSprite geSprite-orthogonal', null, true).setAttribute('title', mxResources.get('orthogonal'));
			this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ['elbowEdgeStyle', null, null, null], 'geIcon geSprite geSprite-horizontalelbow', null, true).setAttribute('title', mxResources.get('simple'));
			this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ['elbowEdgeStyle', 'vertical', null, null], 'geIcon geSprite geSprite-verticalelbow', null, true).setAttribute('title', mxResources.get('simple'));
			this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ['isometricEdgeStyle', null, null, null], 'geIcon geSprite geSprite-horizontalisometric', null, true).setAttribute('title', mxResources.get('isometric'));
			this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ['isometricEdgeStyle', 'vertical', null, null], 'geIcon geSprite geSprite-verticalisometric', null, true).setAttribute('title', mxResources.get('isometric'));
	
			if (ss.style.shape == 'connector')
			{
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ['orthogonalEdgeStyle', '1', null], 'geIcon geSprite geSprite-curved', null, true).setAttribute('title', mxResources.get('curved'));
			}
			
			this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ['entityRelationEdgeStyle', null, null], 'geIcon geSprite geSprite-entity', null, true).setAttribute('title', mxResources.get('entityRelation'));
		}
	}));

	var lineStart = this.editorUi.toolbar.addMenuFunctionInContainer(stylePanel2, 'geSprite-startclassic', mxResources.get('linestart'), false, mxUtils.bind(this, function(menu)
	{
		if (ss.style.shape == 'connector' || ss.style.shape == 'flexArrow')
		{
			var item = this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.NONE, 0], 'geIcon', null, false);
			item.setAttribute('title', mxResources.get('none'));
			item.firstChild.firstChild.innerHTML = '<font style="font-size:10px;">' + mxUtils.htmlEntities(mxResources.get('none')) + '</font>';

			if (ss.style.shape == 'connector')
			{
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_CLASSIC, 1], 'geIcon geSprite geSprite-startclassic', null, false).setAttribute('title', mxResources.get('classic'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_CLASSIC_THIN, 1], 'geIcon geSprite geSprite-startclassicthin', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_OPEN, 0], 'geIcon geSprite geSprite-startopen', null, false).setAttribute('title', mxResources.get('openArrow'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_OPEN_THIN, 0], 'geIcon geSprite geSprite-startopenthin', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['openAsync', 0], 'geIcon geSprite geSprite-startopenasync', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_BLOCK, 1], 'geIcon geSprite geSprite-startblock', null, false).setAttribute('title', mxResources.get('block'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_BLOCK_THIN, 1], 'geIcon geSprite geSprite-startblockthin', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['async', 1], 'geIcon geSprite geSprite-startasync', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_OVAL, 1], 'geIcon geSprite geSprite-startoval', null, false).setAttribute('title', mxResources.get('oval'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_DIAMOND, 1], 'geIcon geSprite geSprite-startdiamond', null, false).setAttribute('title', mxResources.get('diamond'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_DIAMOND_THIN, 1], 'geIcon geSprite geSprite-startthindiamond', null, false).setAttribute('title', mxResources.get('diamondThin'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_CLASSIC, 0], 'geIcon geSprite geSprite-startclassictrans', null, false).setAttribute('title', mxResources.get('classic'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_CLASSIC_THIN, 0], 'geIcon geSprite geSprite-startclassicthintrans', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_BLOCK, 0], 'geIcon geSprite geSprite-startblocktrans', null, false).setAttribute('title', mxResources.get('block'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_BLOCK_THIN, 0], 'geIcon geSprite geSprite-startblockthintrans', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['async', 0], 'geIcon geSprite geSprite-startasynctrans', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_OVAL, 0], 'geIcon geSprite geSprite-startovaltrans', null, false).setAttribute('title', mxResources.get('oval'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_DIAMOND, 0], 'geIcon geSprite geSprite-startdiamondtrans', null, false).setAttribute('title', mxResources.get('diamond'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], [mxConstants.ARROW_DIAMOND_THIN, 0], 'geIcon geSprite geSprite-startthindiamondtrans', null, false).setAttribute('title', mxResources.get('diamondThin'));
				
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['dash', 0], 'geIcon geSprite geSprite-startdash', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['cross', 0], 'geIcon geSprite geSprite-startcross', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['circlePlus', 0], 'geIcon geSprite geSprite-startcircleplus', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['circle', 1], 'geIcon geSprite geSprite-startcircle', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['ERone', 0], 'geIcon geSprite geSprite-starterone', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['ERmandOne', 0], 'geIcon geSprite geSprite-starteronetoone', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['ERmany', 0], 'geIcon geSprite geSprite-startermany', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['ERoneToMany', 0], 'geIcon geSprite geSprite-starteronetomany', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['ERzeroToOne', 1], 'geIcon geSprite geSprite-starteroneopt', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW, 'startFill'], ['ERzeroToMany', 1], 'geIcon geSprite geSprite-startermanyopt', null, false);
			}
			else
			{
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_STARTARROW], [mxConstants.ARROW_BLOCK], 'geIcon geSprite geSprite-startblocktrans', null, false).setAttribute('title', mxResources.get('block'));
			}
		}
	}));

	var lineEnd = this.editorUi.toolbar.addMenuFunctionInContainer(stylePanel2, 'geSprite-endclassic', mxResources.get('lineend'), false, mxUtils.bind(this, function(menu)
	{
		if (ss.style.shape == 'connector' || ss.style.shape == 'flexArrow')
		{
			var item = this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.NONE, 0], 'geIcon', null, false);
			item.setAttribute('title', mxResources.get('none'));
			item.firstChild.firstChild.innerHTML = '<font style="font-size:10px;">' + mxUtils.htmlEntities(mxResources.get('none')) + '</font>';
			
			if (ss.style.shape == 'connector')
			{
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_CLASSIC, 1], 'geIcon geSprite geSprite-endclassic', null, false).setAttribute('title', mxResources.get('classic'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_CLASSIC_THIN, 1], 'geIcon geSprite geSprite-endclassicthin', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_OPEN, 0], 'geIcon geSprite geSprite-endopen', null, false).setAttribute('title', mxResources.get('openArrow'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_OPEN_THIN, 0], 'geIcon geSprite geSprite-endopenthin', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['openAsync', 0], 'geIcon geSprite geSprite-endopenasync', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_BLOCK, 1], 'geIcon geSprite geSprite-endblock', null, false).setAttribute('title', mxResources.get('block'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_BLOCK_THIN, 1], 'geIcon geSprite geSprite-endblockthin', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['async', 1], 'geIcon geSprite geSprite-endasync', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_OVAL, 1], 'geIcon geSprite geSprite-endoval', null, false).setAttribute('title', mxResources.get('oval'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_DIAMOND, 1], 'geIcon geSprite geSprite-enddiamond', null, false).setAttribute('title', mxResources.get('diamond'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_DIAMOND_THIN, 1], 'geIcon geSprite geSprite-endthindiamond', null, false).setAttribute('title', mxResources.get('diamondThin'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_CLASSIC, 0], 'geIcon geSprite geSprite-endclassictrans', null, false).setAttribute('title', mxResources.get('classic'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_CLASSIC_THIN, 0], 'geIcon geSprite geSprite-endclassicthintrans', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_BLOCK, 0], 'geIcon geSprite geSprite-endblocktrans', null, false).setAttribute('title', mxResources.get('block'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_BLOCK_THIN, 0], 'geIcon geSprite geSprite-endblockthintrans', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['async', 0], 'geIcon geSprite geSprite-endasynctrans', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_OVAL, 0], 'geIcon geSprite geSprite-endovaltrans', null, false).setAttribute('title', mxResources.get('oval'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_DIAMOND, 0], 'geIcon geSprite geSprite-enddiamondtrans', null, false).setAttribute('title', mxResources.get('diamond'));
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], [mxConstants.ARROW_DIAMOND_THIN, 0], 'geIcon geSprite geSprite-endthindiamondtrans', null, false).setAttribute('title', mxResources.get('diamondThin'));

				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['dash', 0], 'geIcon geSprite geSprite-enddash', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['cross', 0], 'geIcon geSprite geSprite-endcross', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['circlePlus', 0], 'geIcon geSprite geSprite-endcircleplus', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['circle', 1], 'geIcon geSprite geSprite-endcircle', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['ERone', 0], 'geIcon geSprite geSprite-enderone', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['ERmandOne', 0], 'geIcon geSprite geSprite-enderonetoone', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['ERmany', 0], 'geIcon geSprite geSprite-endermany', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['ERoneToMany', 0], 'geIcon geSprite geSprite-enderonetomany', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['ERzeroToOne', 1], 'geIcon geSprite geSprite-enderoneopt', null, false);
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW, 'endFill'], ['ERzeroToMany', 1], 'geIcon geSprite geSprite-endermanyopt', null, false);
			}
			else
			{
				this.editorUi.menus.edgeStyleChange(menu, '', [mxConstants.STYLE_ENDARROW], [mxConstants.ARROW_BLOCK], 'geIcon geSprite geSprite-endblocktrans', null, false).setAttribute('title', mxResources.get('block'));
			}
		}
	}));

	this.addArrow(edgeShape, 8);
	this.addArrow(edgeStyle);
	this.addArrow(lineStart);
	this.addArrow(lineEnd);
	
	var symbol = this.addArrow(pattern, 9);
	symbol.className = 'geIcon';
	symbol.style.width = '84px';
	
	var altSymbol = this.addArrow(altPattern, 9);
	altSymbol.className = 'geIcon';
	altSymbol.style.width = '22px';
	
	var solid = document.createElement('div');
	solid.style.width = '85px';
	solid.style.height = '1px';
	solid.style.borderBottom = '1px solid black';
	solid.style.marginBottom = '9px';
	symbol.appendChild(solid);
	
	var altSolid = document.createElement('div');
	altSolid.style.width = '23px';
	altSolid.style.height = '1px';
	altSolid.style.borderBottom = '1px solid black';
	altSolid.style.marginBottom = '9px';
	altSymbol.appendChild(altSolid);

	pattern.style.height = '15px';
	altPattern.style.height = '15px';
	edgeShape.style.height = '15px';
	edgeStyle.style.height = '17px';
	lineStart.style.marginLeft = '3px';
	lineStart.style.height = '17px';
	lineEnd.style.marginLeft = '3px';
	lineEnd.style.height = '17px';

	container.appendChild(colorPanel);
	container.appendChild(altStylePanel);
	container.appendChild(stylePanel);

	var arrowPanel = stylePanel.cloneNode(false);
	arrowPanel.style.paddingBottom = '6px';
	arrowPanel.style.paddingTop = '4px';
	arrowPanel.style.fontWeight = 'normal';
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.marginLeft = '3px';
	span.style.marginBottom = '12px';
	span.style.marginTop = '2px';
	span.style.fontWeight = 'normal';
	span.style.width = '76px';
	
	mxUtils.write(span, mxResources.get('lineend'));
	arrowPanel.appendChild(span);
	
	var endSpacingUpdate, endSizeUpdate;
	var endSpacing = this.addUnitInput(arrowPanel, 'pt', 74, 33, function()
	{
		endSpacingUpdate.apply(this, arguments);
	});
	var endSize = this.addUnitInput(arrowPanel, 'pt', 20, 33, function()
	{
		endSizeUpdate.apply(this, arguments);
	});

	mxUtils.br(arrowPanel);
	
	var spacer = document.createElement('div');
	spacer.style.height = '8px';
	arrowPanel.appendChild(spacer);
	
	span = span.cloneNode(false);
	mxUtils.write(span, mxResources.get('linestart'));
	arrowPanel.appendChild(span);
	
	var startSpacingUpdate, startSizeUpdate;
	var startSpacing = this.addUnitInput(arrowPanel, 'pt', 74, 33, function()
	{
		startSpacingUpdate.apply(this, arguments);
	});
	var startSize = this.addUnitInput(arrowPanel, 'pt', 20, 33, function()
	{
		startSizeUpdate.apply(this, arguments);
	});

	mxUtils.br(arrowPanel);
	this.addLabel(arrowPanel, mxResources.get('spacing'), 74, 50);
	this.addLabel(arrowPanel, mxResources.get('size'), 20, 50);
	mxUtils.br(arrowPanel);
	
	var perimeterPanel = colorPanel.cloneNode(false);
	perimeterPanel.style.fontWeight = 'normal';
	perimeterPanel.style.position = 'relative';
	perimeterPanel.style.paddingLeft = '16px'
	perimeterPanel.style.marginBottom = '2px';
	perimeterPanel.style.marginTop = '6px';
	perimeterPanel.style.borderWidth = '0px';
	perimeterPanel.style.paddingBottom = '18px';
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.marginLeft = '3px';
	span.style.marginBottom = '12px';
	span.style.marginTop = '1px';
	span.style.fontWeight = 'normal';
	span.style.width = '120px';
	mxUtils.write(span, mxResources.get('perimeter'));
	perimeterPanel.appendChild(span);
	
	var perimeterUpdate;
	var perimeterSpacing = this.addUnitInput(perimeterPanel, 'pt', 20, 41, function()
	{
		perimeterUpdate.apply(this, arguments);
	});

	if (ss.edges.length == graph.getSelectionCount())
	{
		container.appendChild(stylePanel2);
		
		if (mxClient.IS_QUIRKS)
		{
			mxUtils.br(container);
			mxUtils.br(container);
		}
		
		container.appendChild(arrowPanel);
	}
	else if (ss.vertices.length == graph.getSelectionCount())
	{
		if (mxClient.IS_QUIRKS)
		{
			mxUtils.br(container);
		}
		
		container.appendChild(perimeterPanel);
	}
	
	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		ss = this.format.getSelectionState();
		var color = mxUtils.getValue(ss.style, strokeKey, null);

		if (force || document.activeElement != input)
		{
			var tmp = parseInt(mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1));
			input.value = (isNaN(tmp)) ? '' : tmp + ' pt';
		}
		
		if (force || document.activeElement != altInput)
		{
			var tmp = parseInt(mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1));
			altInput.value = (isNaN(tmp)) ? '' : tmp + ' pt';
		}
		
		styleSelect.style.visibility = (ss.style.shape == 'connector' || ss.style.shape == 'filledEdge') ? '' : 'hidden';
		
		if (mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == '1')
		{
			styleSelect.value = 'curved';
		}
		else if (mxUtils.getValue(ss.style, mxConstants.STYLE_ROUNDED, null) == '1')
		{
			styleSelect.value = 'rounded';
		}
		
		if (mxUtils.getValue(ss.style, mxConstants.STYLE_DASHED, null) == '1')
		{
			if (mxUtils.getValue(ss.style, mxConstants.STYLE_DASH_PATTERN, null) == null)
			{
				solid.style.borderBottom = '1px dashed black';
			}
			else
			{
				solid.style.borderBottom = '1px dotted black';
			}
		}
		else
		{
			solid.style.borderBottom = '1px solid black';
		}
		
		altSolid.style.borderBottom = solid.style.borderBottom;
		
		// Updates toolbar icon for edge style
		var edgeStyleDiv = edgeStyle.getElementsByTagName('div')[0];
		var es = mxUtils.getValue(ss.style, mxConstants.STYLE_EDGE, null);
		
		if (mxUtils.getValue(ss.style, mxConstants.STYLE_NOEDGESTYLE, null) == '1')
		{
			es = null;
		}

		if (es == 'orthogonalEdgeStyle' && mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == '1')
		{
			edgeStyleDiv.className = 'geSprite geSprite-curved';
		}
		else if (es == 'straight' || es == 'none' || es == null)
		{
			edgeStyleDiv.className = 'geSprite geSprite-straight';
		}
		else if (es == 'entityRelationEdgeStyle')
		{
			edgeStyleDiv.className = 'geSprite geSprite-entity';
		}
		else if (es == 'elbowEdgeStyle')
		{
			edgeStyleDiv.className = 'geSprite ' + ((mxUtils.getValue(ss.style,
				mxConstants.STYLE_ELBOW, null) == 'vertical') ?
				'geSprite-verticalelbow' : 'geSprite-horizontalelbow');
		}
		else if (es == 'isometricEdgeStyle')
		{
			edgeStyleDiv.className = 'geSprite ' + ((mxUtils.getValue(ss.style,
				mxConstants.STYLE_ELBOW, null) == 'vertical') ?
				'geSprite-verticalisometric' : 'geSprite-horizontalisometric');
		}
		else
		{
			edgeStyleDiv.className = 'geSprite geSprite-orthogonal';
		}
		
		// Updates icon for edge shape
		var edgeShapeDiv = edgeShape.getElementsByTagName('div')[0];
		
		if (ss.style.shape == 'link')
		{
			edgeShapeDiv.className = 'geSprite geSprite-linkedge';
		}
		else if (ss.style.shape == 'flexArrow')
		{
			edgeShapeDiv.className = 'geSprite geSprite-arrow';
		}
		else if (ss.style.shape == 'arrow')
		{
			edgeShapeDiv.className = 'geSprite geSprite-simplearrow';
		}
		else
		{
			edgeShapeDiv.className = 'geSprite geSprite-connection';
		}
		
		if (ss.edges.length == graph.getSelectionCount())
		{
			altStylePanel.style.display = '';
			stylePanel.style.display = 'none';
		}
		else
		{
			altStylePanel.style.display = 'none';
			stylePanel.style.display = '';
		}
		
		function updateArrow(marker, fill, elt, prefix)
		{
			var markerDiv = elt.getElementsByTagName('div')[0];
			
			markerDiv.className = ui.getCssClassForMarker(prefix, ss.style.shape, marker, fill);
			
			if (markerDiv.className == 'geSprite geSprite-noarrow')
			{
				markerDiv.innerHTML = mxUtils.htmlEntities(mxResources.get('none'));
				markerDiv.style.backgroundImage = 'none';
				markerDiv.style.verticalAlign = 'top';
				markerDiv.style.marginTop = '5px';
				markerDiv.style.fontSize = '10px';
				markerDiv.nextSibling.style.marginTop = '0px';
			}
			
			return markerDiv;
		};
		
		var sourceDiv = updateArrow(mxUtils.getValue(ss.style, mxConstants.STYLE_STARTARROW, null),
				mxUtils.getValue(ss.style, 'startFill', '1'), lineStart, 'start');
		var targetDiv = updateArrow(mxUtils.getValue(ss.style, mxConstants.STYLE_ENDARROW, null),
				mxUtils.getValue(ss.style, 'endFill', '1'), lineEnd, 'end');

		// Special cases for markers
		if (ss.style.shape == 'arrow')
		{
			sourceDiv.className = 'geSprite geSprite-noarrow';
			targetDiv.className = 'geSprite geSprite-endblocktrans';
		}
		else if (ss.style.shape == 'link')
		{
			sourceDiv.className = 'geSprite geSprite-noarrow';
			targetDiv.className = 'geSprite geSprite-noarrow';
		}

		mxUtils.setOpacity(edgeStyle, (ss.style.shape == 'arrow') ? 30 : 100);			
		
		if (ss.style.shape != 'connector' && ss.style.shape != 'flexArrow')
		{
			mxUtils.setOpacity(lineStart, 30);
			mxUtils.setOpacity(lineEnd, 30);
		}
		else
		{
			mxUtils.setOpacity(lineStart, 100);
			mxUtils.setOpacity(lineEnd, 100);
		}

		if (force || document.activeElement != startSize)
		{
			var tmp = parseInt(mxUtils.getValue(ss.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE));
			startSize.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
		
		if (force || document.activeElement != startSpacing)
		{
			var tmp = parseInt(mxUtils.getValue(ss.style, mxConstants.STYLE_SOURCE_PERIMETER_SPACING, 0));
			startSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}

		if (force || document.activeElement != endSize)
		{
			var tmp = parseInt(mxUtils.getValue(ss.style, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE));
			endSize.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
		
		if (force || document.activeElement != startSpacing)
		{
			var tmp = parseInt(mxUtils.getValue(ss.style, mxConstants.STYLE_TARGET_PERIMETER_SPACING, 0));
			endSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
		
		if (force || document.activeElement != perimeterSpacing)
		{
			var tmp = parseInt(mxUtils.getValue(ss.style, mxConstants.STYLE_PERIMETER_SPACING, 0));
			perimeterSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
		}
	});
	
	startSizeUpdate = this.installInputHandler(startSize, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE, 0, 999, ' pt');
	startSpacingUpdate = this.installInputHandler(startSpacing, mxConstants.STYLE_SOURCE_PERIMETER_SPACING, 0, -999, 999, ' pt');
	endSizeUpdate = this.installInputHandler(endSize, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE, 0, 999, ' pt');
	endSpacingUpdate = this.installInputHandler(endSpacing, mxConstants.STYLE_TARGET_PERIMETER_SPACING, 0, -999, 999, ' pt');
	perimeterUpdate = this.installInputHandler(perimeterSpacing, mxConstants.STYLE_PERIMETER_SPACING, 0, 0, 999, ' pt');

	this.addKeyHandler(input, listener);
	this.addKeyHandler(startSize, listener);
	this.addKeyHandler(startSpacing, listener);
	this.addKeyHandler(endSize, listener);
	this.addKeyHandler(endSpacing, listener);
	this.addKeyHandler(perimeterSpacing, listener);

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	return container;
};

/**
 * Adds UI for configuring line jumps.
 */
StyleFormatPanel.prototype.addLineJumps = function(container)
{
	var ss = this.format.getSelectionState();
	
	if (Graph.lineJumpsEnabled && ss.edges.length > 0 &&
		ss.vertices.length == 0 && ss.lineJumps)
	{
		container.style.padding = '8px 0px 24px 18px';
		
		var ui = this.editorUi;
		var editor = ui.editor;
		var graph = editor.graph;
		
		var span = document.createElement('div');
		span.style.position = 'absolute';
		span.style.fontWeight = 'bold';
		span.style.width = '80px';
		
		mxUtils.write(span, mxResources.get('lineJumps'));
		container.appendChild(span);
		
		var styleSelect = document.createElement('select');
		styleSelect.style.position = 'absolute';
		styleSelect.style.marginTop = '-2px';
		styleSelect.style.right = '76px';
		styleSelect.style.width = '62px';

		var styles = ['none', 'arc', 'gap', 'sharp'];

		for (var i = 0; i < styles.length; i++)
		{
			var styleOption = document.createElement('option');
			styleOption.setAttribute('value', styles[i]);
			mxUtils.write(styleOption, mxResources.get(styles[i]));
			styleSelect.appendChild(styleOption);
		}
		
		mxEvent.addListener(styleSelect, 'change', function(evt)
		{
			graph.getModel().beginUpdate();
			try
			{
				graph.setCellStyles('jumpStyle', styleSelect.value, graph.getSelectionCells());
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['jumpStyle'],
					'values', [styleSelect.value], 'cells', graph.getSelectionCells()));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			mxEvent.consume(evt);
		});
		
		// Stops events from bubbling to color option event handler
		mxEvent.addListener(styleSelect, 'click', function(evt)
		{
			mxEvent.consume(evt);
		});
		
		container.appendChild(styleSelect);
		
		var jumpSizeUpdate;
		
		var jumpSize = this.addUnitInput(container, 'pt', 22, 33, function()
		{
			jumpSizeUpdate.apply(this, arguments);
		});
		
		jumpSizeUpdate = this.installInputHandler(jumpSize, 'jumpSize',
			Graph.defaultJumpSize, 0, 999, ' pt');
		
		var listener = mxUtils.bind(this, function(sender, evt, force)
		{
			ss = this.format.getSelectionState();
			styleSelect.value = mxUtils.getValue(ss.style, 'jumpStyle', 'none');

			if (force || document.activeElement != jumpSize)
			{
				var tmp = parseInt(mxUtils.getValue(ss.style, 'jumpSize', Graph.defaultJumpSize));
				jumpSize.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
			}
		});

		this.addKeyHandler(jumpSize, listener);

		graph.getModel().addListener(mxEvent.CHANGE, listener);
		this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
		listener();
	}
	else
	{
		container.style.display = 'none';
	}
	
	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addEffects = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.format.getSelectionState();
	
	div.style.paddingTop = '0px';
	div.style.paddingBottom = '2px';

	var table = document.createElement('table');

	if (mxClient.IS_QUIRKS)
	{
		table.style.fontSize = '1em';
	}

	table.style.width = '100%';
	table.style.fontWeight = 'bold';
	table.style.paddingRight = '20px';
	var tbody = document.createElement('tbody');
	var row = document.createElement('tr');
	row.style.padding = '0px';
	var left = document.createElement('td');
	left.style.padding = '0px';
	left.style.width = '50%';
	left.setAttribute('valign', 'top');
	
	var right = left.cloneNode(true);
	right.style.paddingLeft = '8px';
	row.appendChild(left);
	row.appendChild(right);
	tbody.appendChild(row);
	table.appendChild(tbody);
	div.appendChild(table);

	var current = left;
	var count = 0;
	
	var addOption = mxUtils.bind(this, function(label, key, defaultValue)
	{
		var opt = this.createCellOption(label, key, defaultValue);
		opt.style.width = '100%';
		current.appendChild(opt);
		current = (current == left) ? right : left;
		count++;
	});

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		ss = this.format.getSelectionState();
		
		left.innerHTML = '';
		right.innerHTML = '';
		current = left;
		
		if (ss.rounded)
		{
			addOption(mxResources.get('rounded'), mxConstants.STYLE_ROUNDED, 0);
		}
		
		if (ss.style.shape == 'swimlane')
		{
			addOption(mxResources.get('divider'), 'swimlaneLine', 1);
		}

		if (!ss.containsImage)
		{
			addOption(mxResources.get('shadow'), mxConstants.STYLE_SHADOW, 0);
		}
		
		if (ss.glass)
		{
			addOption(mxResources.get('glass'), mxConstants.STYLE_GLASS, 0);
		}

		if (ss.comic)
		{
			addOption(mxResources.get('comic'), 'comic', 0);
		}
		
		if (count == 0)
		{
			div.style.display = 'none';
		}
	});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	return div;
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addStyleOps = function(div)
{
	div.style.paddingTop = '10px';
	div.style.paddingBottom = '10px';
	
	var btn = mxUtils.button(mxResources.get('setAsDefaultStyle'), mxUtils.bind(this, function(evt)
	{
		this.editorUi.actions.get('setAsDefaultStyle').funct();
	}));
	
	btn.setAttribute('title', mxResources.get('setAsDefaultStyle') + ' (' + this.editorUi.actions.get('setAsDefaultStyle').shortcut + ')');
	btn.style.width = '202px';
	div.appendChild(btn);

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(DiagramFormatPanel, BaseFormatPanel);

/**
 * Specifies if the background image option should be shown. Default is true.
 */
DiagramFormatPanel.prototype.showBackgroundImageOption = true;

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;

	this.container.appendChild(this.addView(this.createPanel()));

	if (graph.isEnabled())
	{
		this.container.appendChild(this.addOptions(this.createPanel()));
		this.container.appendChild(this.addPaperSize(this.createPanel()));
		this.container.appendChild(this.addStyleOps(this.createPanel()));
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addView = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	div.appendChild(this.createTitle(mxResources.get('view')));
	
	// Grid
	this.addGridOption(div);

	if (graph.isEnabled())
	{
		// Guides
		div.appendChild(this.createOption(mxResources.get('guides'), function()
		{
			return graph.graphHandler.guidesEnabled;
		}, function(checked)
		{
			ui.actions.get('guides').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.graphHandler.guidesEnabled);
				};
				
				ui.addListener('guidesEnabledChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));
		
		// Page View
		div.appendChild(this.createOption(mxResources.get('pageView'), function()
		{
			return graph.pageVisible;
		}, function(checked)
		{
			ui.actions.get('pageView').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.pageVisible);
				};
				
				ui.addListener('pageViewChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));
		
		// Background
		var bg = this.createColorOption(mxResources.get('background'), function()
		{
			return graph.background;
		}, function(color)
		{
			var change = new ChangePageSetup(ui, color);
			change.ignoreImage = true;
			
			graph.model.execute(change);
		}, '#ffffff',
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.background);
				};
				
				ui.addListener('backgroundColorChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		});
		
		if (this.showBackgroundImageOption)
		{
			var btn = mxUtils.button(mxResources.get('image'), function(evt)
			{
				ui.showBackgroundImageDialog();
				mxEvent.consume(evt);
			})
		
			btn.style.position = 'absolute';
			btn.className = 'geColorBtn';
			btn.style.marginTop = '-4px';
			btn.style.paddingBottom = (document.documentMode == 11 || mxClient.IS_MT) ? '0px' : '2px';
			btn.style.height = '22px';
			btn.style.right = (mxClient.IS_QUIRKS) ? '52px' : '72px';
			btn.style.width = '56px';
		
			bg.appendChild(btn);
		}
		
		div.appendChild(bg);
	}
	
	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addOptions = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	div.appendChild(this.createTitle(mxResources.get('options')));	

	if (graph.isEnabled())
	{
		// Connection arrows
		div.appendChild(this.createOption(mxResources.get('connectionArrows'), function()
		{
			return graph.connectionArrowsEnabled;
		}, function(checked)
		{
			ui.actions.get('connectionArrows').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.connectionArrowsEnabled);
				};
				
				ui.addListener('connectionArrowsChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));
		
		// Connection points
		div.appendChild(this.createOption(mxResources.get('connectionPoints'), function()
		{
			return graph.connectionHandler.isEnabled();
		}, function(checked)
		{
			ui.actions.get('connectionPoints').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.connectionHandler.isEnabled());
				};
				
				ui.addListener('connectionPointsChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));
	}

	return div;
};

/**
 * 
 */
DiagramFormatPanel.prototype.addGridOption = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.textAlign = 'right';
	input.style.width = '38px';
	input.value = graph.getGridSize() + ' pt';
	
	var stepper = this.createStepper(input, update);
	input.style.display = (graph.isGridEnabled()) ? '' : 'none';
	stepper.style.display = input.style.display;

	mxEvent.addListener(input, 'keydown', function(e)
	{
		if (e.keyCode == 13)
		{
			graph.container.focus();
			mxEvent.consume(e);
		}
		else if (e.keyCode == 27)
		{
			input.value = graph.getGridSize();
			graph.container.focus();
			mxEvent.consume(e);
		}
	});
	
	function update(evt)
	{
		var value = parseInt(input.value);
		value = Math.max(1, (isNaN(value)) ? 10 : value);
		
		if (value != graph.getGridSize())
		{
			graph.setGridSize(value)
		}

		input.value = value + ' pt';
		mxEvent.consume(evt);
	};

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);
	
	if (mxClient.IS_SVG)
	{
		input.style.marginTop = '-2px';
		input.style.right = '84px';
		stepper.style.marginTop = '-16px';
		stepper.style.right = '72px';
	
		var panel = this.createColorOption(mxResources.get('grid'), function()
		{
			var color = graph.view.gridColor;

			return (graph.isGridEnabled()) ? color : null;
		}, function(color)
		{
			if (color == mxConstants.NONE)
			{
				graph.setGridEnabled(false);
				ui.fireEvent(new mxEventObject('gridEnabledChanged'));
			}
			else
			{
				graph.setGridEnabled(true);
				ui.setGridColor(color);
			}

			input.style.display = (graph.isGridEnabled()) ? '' : 'none';
			stepper.style.display = input.style.display;
		}, '#e0e0e0',
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply((graph.isGridEnabled()) ? graph.view.gridColor : null);
				};
				
				ui.addListener('gridColorChanged', this.listener);
				ui.addListener('gridEnabledChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		});

		panel.appendChild(input);
		panel.appendChild(stepper);
		container.appendChild(panel);
	}
	else
	{
		input.style.marginTop = '2px';
		input.style.right = '32px';
		stepper.style.marginTop = '2px';
		stepper.style.right = '20px';
		
		container.appendChild(input);
		container.appendChild(stepper);
		
		container.appendChild(this.createOption(mxResources.get('grid'), function()
		{
			return graph.isGridEnabled();
		}, function(checked)
		{
			graph.setGridEnabled(checked);
			
			if (graph.isGridEnabled())
			{
				graph.view.gridColor = '#e0e0e0';
			}
			
			ui.fireEvent(new mxEventObject('gridEnabledChanged'));
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					input.style.display = (graph.isGridEnabled()) ? '' : 'none';
					stepper.style.display = input.style.display;
					
					apply(graph.isGridEnabled());
				};
				
				ui.addListener('gridEnabledChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addDocumentProperties = function(div)
{
	// Hook for subclassers
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	div.appendChild(this.createTitle(mxResources.get('options')));

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addPaperSize = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	div.appendChild(this.createTitle(mxResources.get('paperSize')));

	var accessor = PageSetupDialog.addPageFormatPanel(div, 'formatpanel', graph.pageFormat, function(pageFormat)
	{
		if (graph.pageFormat == null || graph.pageFormat.width != pageFormat.width ||
			graph.pageFormat.height != pageFormat.height)
		{
			var change = new ChangePageSetup(ui, null, null, pageFormat);
			change.ignoreColor = true;
			change.ignoreImage = true;
			
			graph.model.execute(change);
		}
	});
	
	this.addKeyHandler(accessor.widthInput, function()
	{
		accessor.set(graph.pageFormat);
	});
-	this.addKeyHandler(accessor.heightInput, function()
	{
		accessor.set(graph.pageFormat);	
	});
	
	var listener = function()
	{
		accessor.set(graph.pageFormat);
	};
	
	ui.addListener('pageFormatChanged', listener);
	this.listeners.push({destroy: function() { ui.removeListener(listener); }});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	
	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addStyleOps = function(div)
{
	var btn = mxUtils.button(mxResources.get('editData'), mxUtils.bind(this, function(evt)
	{
		this.editorUi.actions.get('editData').funct();
	}));
	
	btn.setAttribute('title', mxResources.get('editData') + ' (' + this.editorUi.actions.get('editData').shortcut + ')');
	btn.style.width = '202px';
	btn.style.marginBottom = '2px';
	
	//不添加编辑数据按钮[editData]
	//div.appendChild(btn);

	//mxUtils.br(div);
	
	btn = mxUtils.button(mxResources.get('clearDefaultStyle'), mxUtils.bind(this, function(evt)
	{
		this.editorUi.actions.get('clearDefaultStyle').funct();
	}));
	
	btn.setAttribute('title', mxResources.get('clearDefaultStyle') + ' (' + this.editorUi.actions.get('clearDefaultStyle').shortcut + ')');
	btn.style.width = '202px';
	div.appendChild(btn);

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.destroy = function()
{
	BaseFormatPanel.prototype.destroy.apply(this, arguments);
	
	if (this.gridEnabledListener)
	{
		this.editorUi.removeListener(this.gridEnabledListener);
		this.gridEnabledListener = null;
	}
};



//file tree
//add at 12.01
//add by wugh
DiagramFormatPanel.prototype.addTreeMenu = function (div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var selectionLayer = null;

    var treeMenu = document.createElement('ul');
    treeMenu.className = 'filetree';
    treeMenu.id = 'browser';
    // var gisFloor=document.createElement('li');
    //     treeMenu.appendChild(gisFloor);
    // //gis层
    // var gisFloor=document.createElement('li');
    //     treeMenu.appendChild(gisFloor);
    // var gisFloorSpan=document.createElement('span');
    //     gisFloorSpan.className='folder';
    //     mxUtils.write(gisFloorSpan,mxResources.get('gisFloor'));
    //     gisFloor.appendChild(gisFloorSpan);
    // var gischildul=document.createElement('ul');
    // var gischildli=document.createElement('li');
    //     gisFloor.appendChild(gischildul);
    //     gischildul.appendChild(gischildli);
    //电气原理层
    var eleFloor = document.createElement('li');
    treeMenu.appendChild(eleFloor);
    var eleFloorSpan = document.createElement('span');
    eleFloorSpan.className = 'folder';
    mxUtils.write(eleFloorSpan, mxResources.get('eleFloor'));
    eleFloor.appendChild(eleFloorSpan);
    var elechildul = document.createElement('ul');
    var elechildli = document.createElement('li');
    eleFloor.appendChild(elechildul);
    elechildul.appendChild(elechildli);
    //曲线库层20170103
    var tableFloor = document.createElement('li');
    treeMenu.appendChild(tableFloor);
    var tableFloorSpan = document.createElement('span');
    tableFloorSpan.className = 'folder';
    mxUtils.write(tableFloorSpan, mxResources.get('tableFloor'));
    tableFloor.appendChild(tableFloorSpan);
    var tablechildul = document.createElement('ul');
    var tablechildli = document.createElement('li');
    tableFloor.appendChild(tablechildul);
    tablechildul.appendChild(tablechildli);
    //timeline 17-2-21
    var timeFloor = document.createElement('li');
    treeMenu.appendChild(timeFloor);
    var timeFloorSpan = document.createElement('span');
    timeFloorSpan.className = 'folder';
    mxUtils.write(timeFloorSpan, 'TimeLine');
    timeFloor.appendChild(timeFloorSpan);
    var timechildul = document.createElement('ul');
    var timechildli = document.createElement('li');
    timeFloor.appendChild(timechildul);
    var addDiv = document.createElement('div');

    //多场景
    var moreFloor = document.createElement('li');
    treeMenu.appendChild(moreFloor);
    var moreFloorSpan = document.createElement('span');
    moreFloorSpan.className = 'folder';
    mxUtils.write(moreFloorSpan, '多场景');
    moreFloor.appendChild(moreFloorSpan);
    var morechildul = document.createElement('ul');
    var morechildli = document.createElement('li');
    moreFloor.appendChild(morechildul);


    var engFloor = document.createElement('li');
    treeMenu.appendChild(engFloor);
    var engFloorSpan = document.createElement('span');
    engFloorSpan.className = 'folder';
    mxUtils.write(engFloorSpan, mxResources.get('engFloor'));
    engFloor.appendChild(engFloorSpan);
    var engchildul = document.createElement('ul');
    var engchildli = document.createElement('li');
    engFloor.appendChild(engchildul);



    var cpsFloor = document.createElement('li');
    treeMenu.appendChild(cpsFloor);
    var cpsFloorSpan = document.createElement('span');
    cpsFloorSpan.className = 'folder';
    mxUtils.write(cpsFloorSpan, 'CPS');
    cpsFloor.appendChild(cpsFloorSpan);
    var cpschildul = document.createElement('ul');
    var cpschildli = document.createElement('li');
    cpsFloor.appendChild(cpschildul);


    var addDiv = document.createElement('div');
    //addDiv.style.border = '1px solid #c0c0c0';
    addDiv.style.margin = '0px 0px 0px -8px';
    addDiv.style.borderWidth = '0px 0px 1px 0px';
    addDiv.style.textAlign = 'center';
    addDiv.style.fontWeight = 'bold';
    addDiv.style.overflow = 'hidden';
    addDiv.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
    addDiv.style.paddingTop = '8px';
    addDiv.style.height = (mxClient.IS_QUIRKS) ? '34px' : '25px';
    addDiv.style.width = '100%';
    //addDiv.style.backgroundColor = '#d7d7d7';
    addDiv.style.borderLeftWidth = '1px';
    addDiv.setAttribute('class', 'formatLayer');

    var addLink = document.createElement('a');
    addLink.innerHTML = '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>';
    addLink.setAttribute('title', mxResources.get('addLayer'));

    mxEvent.addListener(addLink, 'click', function (evt) {


        if (graph.isEnabled()) {
            var dlg = new addNewLayers(ui, mxResources.get('untitledLayer'), mxResources.get('addFile'), mxUtils.bind(this, function (newValue, floor, layerParam) {
                // if (newValue != null)
                // {
                //    /// graph.getModel().setValue(layer, newValue);
                // }
                console.log(newValue, floor);
                graph.model.beginUpdate();

                try {
                    changeAppRoot(null, floor);
                    var layerCount = graph.model.getChildCount(graph.model.root);
                    var cell = graph.addCell(new mxCell(newValue), graph.model.root);

                    //cell.typeFloor = floor;
                    cell.layerType = floor;
                    //  if(floor == 'eleFloor'){
                    //      cell.layerType = layerParam['Application Name'];
                    // //     _layersParam[cell.id] = layerParam;


                    //  }else if(floor == 'timeFloor'){
                    //      cell.layerType = 'timing';
                    //  }
                    graph.setDefaultParent(cell);
                    for (var i = 0; i < layerCount; i++) {
                        var tempchild = graph.model.getChildAt(graph.model.root, i)
                        if (graph.model.isVisible(tempchild)) {
                            graph.model.setVisible(tempchild, !graph.model.isVisible(tempchild));
                        }
                    }
                    //graph.model.setVisible(cell, !graph.model.isVisible(cell));
                } finally {
                    graph.center();
                    graph.model.endUpdate();
                }

            }), mxResources.get('enterName'));
            ui.showDialog(dlg.container, 320, 120, true, true);
            dlg.init();
        }
        mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
        addLink.className = 'geButton mxDisabled';
    }

    //删除
    var adddelete = document.createElement('a');
    adddelete.innerHTML = '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>';
    // adddelete.setAttribute('title', mxResources.get('removeIt', [selectionLayer.value || mxResources.get('background')]));

    mxEvent.addListener(adddelete, 'click', function (evt) {
        if (mxUtils.confirm('确定删除该图层')) {


            if (graph.isEnabled()) {
                graph.model.beginUpdate();
                try {
                    if (selectionLayer.id != 1) {
                        var index = graph.model.root.getIndex(selectionLayer);


                        if (selectionLayer.mappingPoint) {

                            graph.removeCells([graph.model.getCell(selectionLayer.mappingPoint)]);
                        }
                        graph.removeCells([selectionLayer], false);

                        // Creates default layer if no layer exists
                        if (graph.model.getChildCount(graph.model.root) == 0) {
                            graph.model.add(graph.model.root, new mxCell());
                            graph.setDefaultParent(null);
                            //  tempThis.loadsimu(1);
                        } else if (index > 0 && index <= graph.model.getChildCount(graph.model.root)) {
                            graph.setDefaultParent(graph.model.getChildAt(graph.model.root, index - 1));
                            graph.model.setVisible(graph.model.getChildAt(graph.model.root, index - 1), true);
                        } else {
                            graph.setDefaultParent(null);
                        }

                    } else {
                        toastr["warning"](mxResources.get('undelete'));
                    }
                } finally {
                    graph.center();
                    graph.model.endUpdate();
                }
            }
        }
        mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
        adddelete.className = 'geButton mxDisabled';
    }

    //重命名
    var renameLink = document.createElement('a');
    renameLink.innerHTML = '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>';

    function renameLayer(layer) {
        if (graph.isEnabled() && layer != null) {
            var dlg = new FilenameDialog(ui, layer.value || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function (newValue) {
                if (newValue != null) {
                    graph.getModel().beginUpdate();
                    try {
                        if (layer.layersType == 'system') {
                            var oldName = layer.value;
                            var layerCells = graph.model.getChildVertices(layer);
                            for (var i = 0; i < layerCells.length; i++) {
                                for (var j = 0; j < layerCells[i].children.length; j++) {
                                    if (layerCells[i].children) {
                                        graph.getModel().setValue(layerCells[i].children[j], layerCells[i].children[j].value.replace(oldName + '.', newValue + '.'));
                                        //layerCells[i].children[j].value = cloneChild.value.replace(name, childrenName);
                                    }
                                }
                                var tempPin = _pssEle[layerCells[i].value]['pin'];
                                for (var pinKey in tempPin) {
                                    tempPin[pinKey]['label'] = tempPin[pinKey]['label'].replace(oldName + '.', newValue + '.');
                                }

                            }
                            _pssSystem[newValue] = {}
                            $.extend(true, _pssSystem[newValue], _pssSystem[oldName]); //深度复制模块参数
                            delete _pssSystem[oldName];
                            var mappingCell = graph.getModel().getCell(layer.mappingPoint);
                            for (var i = 0; i < mappingCell.children.length; i++) {
                                graph.getModel().setValue(mappingCell.children[i], mappingCell.children[i].value.replace(oldName + '.', newValue + '.'));
                            }
                            var maxLength = newValue.length - oldName.length;
                            if (maxLength > 0) {
                                mappingCell.geometry.width += maxLength * 13;
                            }
                            graph.getModel().setValue(mappingCell, newValue);
                        }
                        graph.getModel().setValue(layer, newValue);
                    } finally {
                        graph.getModel().endUpdate();
                    }
                }
            }), mxResources.get('enterName'));
            ui.showDialog(dlg.container, 300, 200, true, true);
            dlg.init();
        }
    };
    mxEvent.addListener(renameLink, 'click', function (evt) {
        if (graph.isEnabled()) {
            renameLayer(selectionLayer);
        }

        //mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
        renameLink.className = 'geButton mxDisabled';
    }

    var duplicateLink = document.createElement('a');
    duplicateLink.innerHTML = '<div class="geSprite geSprite-duplicate" style="display:inline-block;"></div>';

    mxEvent.addListener(duplicateLink, 'click', function (evt) {
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


    addDiv.appendChild(adddelete);
    addDiv.appendChild(renameLink);
    addDiv.appendChild(addLink);
    
    var selectLDiv = null;
    var prevSelect = null;
    //刷新
    function refresh() {
        layerCount = graph.model.getChildCount(graph.model.root)
        //  gischildul.innerHTML = '';
        elechildul.innerHTML = '';
        tablechildul.innerHTML = '';
        timechildul.innerHTML = '';
        engchildul.innerHTML = '';
        morechildul.innerHTML = '';
        cpschildul.innerHTML = '';
        var checkf = {};

        function addLayer(index, label, child, defaultParent, appName, appKey) {
            // if(child.layersType=='system'){
            //     return;
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
            var ldiv = document.createElement('div');
            //ldiv.className = 'file';

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
            } else {

                if (checkf[appName] == undefined && appName != undefined) {
                    var t = addfolder(appName);
                    t.appendChild(ldiv);
                    checkf[appName] = t;
                } else if (checkf[appName] != undefined && appName != undefined) {
                    checkf[appName].appendChild(ldiv);
                } else {
                    elechildul.appendChild(ldiv);
                }
            }



            if (graph.getDefaultParent() == child) {
                if (graph.getDefaultParent() != child) {
                    graph.setDefaultParent(child);

                }
                //20170103
                if (appRoots[appKey].typeFloor == 'tableFloor') {
                    console.log('table');

                    if (_graph.pageVisible) {
                        _editorUI.actions.get('pageView').funct();
                    }
                    if (ui.floorChange != 1) {
                        _scale['ele'] = _graph.view.scale;
                        _graph.zoomTo(_scale['table']);
                        var childNodes = ui.sidebarContainer.childNodes;
                        for (var l = 0; l < childNodes.length;) {
                            ui.sidebarContainer.removeChild(childNodes[l]);
                        }
                        ui.createSidebar(ui.sidebarContainer, 2);
                        ui.setEngEdgeStyle(0);
                        ui.toolbar.removeLineSelect();
                        _graph.setConnectableEdges(true);
                    }

                    ui.floorChange = 1;
                } else if (appRoots[appKey].typeFloor == 'timeFloor') {
                    if (ui.floorChange != 2) {
                        _scale['ele'] = _graph.view.scale;
                        _graph.zoomTo(_scale['ele']);
                        var childNodes = ui.sidebarContainer.childNodes;
                        for (var l = 0; l < childNodes.length;) {
                            ui.sidebarContainer.removeChild(childNodes[l]);
                        }
                        ui.createSidebar(ui.sidebarContainer, 3);
                        if (!_graph.pageVisible) {
                            _editorUI.actions.get('pageView').funct();
                        }
                        ui.setEngEdgeStyle(0);
                        ui.toolbar.removeLineSelect();
                        _graph.setConnectableEdges(true);
                    }

                    ui.floorChange = 2;
                } else if (appRoots[appKey].typeFloor == 'engFloor') {
                    if (ui.floorChange != 4) {
                        _scale['ele'] = _graph.view.scale;
                        _graph.zoomTo(_scale['ele']);
                        var childNodes = ui.sidebarContainer.childNodes;
                        for (var l = 0; l < childNodes.length;) {
                            ui.sidebarContainer.removeChild(childNodes[l]);
                        }
                        ui.createSidebar(ui.sidebarContainer, 4);
                        if (!_graph.pageVisible) {
                            _editorUI.actions.get('pageView').funct();
                        }
                        ui.toolbar.addLineSelect();
                        _graph.setConnectableEdges(false);
                    }

                    ui.floorChange = 4;
                } else if (appRoots[appKey].typeFloor == 'moreFloor') {
                    if (ui.floorChange != 5) {
                        _scale['ele'] = _graph.view.scale;
                        _graph.zoomTo(_scale['ele']);
                        var childNodes = ui.sidebarContainer.childNodes;
                        for (var l = 0; l < childNodes.length;) {
                            ui.sidebarContainer.removeChild(childNodes[l]);
                        }
                        ui.createSidebar(ui.sidebarContainer, 5);
                        if (!_graph.pageVisible) {
                            _editorUI.actions.get('pageView').funct();
                        }
                        ui.toolbar.addLineSelect();
                        _graph.setConnectableEdges(false);
                    }

                    ui.floorChange = 5;
                } else if (appRoots[appKey].typeFloor == 'CPSFloor') {
                    if (ui.floorChange != 6) {
                        _scale['ele'] = _graph.view.scale;
                        _graph.zoomTo(_scale['ele']);
                        var childNodes = ui.sidebarContainer.childNodes;
                        for (var l = 0; l < childNodes.length;) {
                            ui.sidebarContainer.removeChild(childNodes[l]);
                        }
                        ui.createSidebar(ui.sidebarContainer, 6);
                        if (!_graph.pageVisible) {
                            _editorUI.actions.get('pageView').funct();
                        }
                        ui.toolbar.addLineSelect();
                        //_graph.setConnectableEdges(false);
                    }

                    ui.floorChange = 6;
                } else {
                    //add SelectLine
                    if (ui.floorChange != 0) {
                        _scale['table'] = _graph.view.scale;
                        _graph.zoomTo(_scale['ele']);
                        var childNodes = ui.sidebarContainer.childNodes;
                        for (var l = 0; l < childNodes.length;) {
                            ui.sidebarContainer.removeChild(childNodes[l]);
                        }
                        ui.createSidebar(ui.sidebarContainer);
                        if (!_graph.pageVisible) {
                            _editorUI.actions.get('pageView').funct();
                        }
                        ui.setEngEdgeStyle(0);
                        ui.toolbar.removeLineSelect()
                        _graph.setConnectableEdges(true);
                    }
                    ui.floorChange = 0;
                }
                ldiv.style.background = '#d7d7d7';
                selectionLayer = child;

            } else {
                mxEvent.addListener(ldiv, 'mouseenter', mxUtils.bind(this, function (evt) {
                    if (!graph.isMouseDown) {
                        ldiv.style.backgroundColor = '#d0d0d0';
                        mxEvent.consume(evt);
                    }
                }));

                mxEvent.addListener(ldiv, 'mouseleave', mxUtils.bind(this, function (evt) {
                    ldiv.style.backgroundColor = '#f5f5f5';
                    mxEvent.consume(evt);
                }));
                mxEvent.addListener(ldiv, 'click', function (evt) {
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
                                for (var i = 0; i < layerCount; i++) {
                                    var tempchild = graph.model.getChildAt(graph.model.root, i)
                                    if (graph.model.isVisible(tempchild)) {
                                        graph.model.setVisible(tempchild, !graph.model.isVisible(tempchild));
                                    }
                                }
                                graph.model.setVisible(child, !graph.model.isVisible(child));
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
        for (var appKey = 0; appKey < appRoots.length; appKey++) {

            var appLayerCount = graph.model.getChildCount(appRoots[appKey].root);
            for (var i = 0; i < appLayerCount; i++) {
                (mxUtils.bind(this, function (child, appName, appKey) {

                    if (child.lastSave) {
                        graph.setDefaultParent(child);
                        child.lastSave = 0;
                    }
                    addLayer(i, child.value || mxResources.get('background'), child, child, appName, appKey);
                }))(graph.model.getChildAt(appRoots[appKey].root, i), appRoots[appKey].name, appKey);
            }
        }

    };
    
    refresh();
    
    //_graph.model.getCell(1).layerType='EMTP';
    graph.model.addListener(mxEvent.CHANGE, function () {
        refresh();
    });
    
    if (selectionLayer != null) {
        renameLink.setAttribute('title', mxResources.get('renameIt', [selectionLayer.value || mxResources.get('background')]));
        adddelete.setAttribute('title', mxResources.get('removeIt', [selectionLayer.value || mxResources.get('background')]));

    }

    div.appendChild(addDiv);

    div.appendChild(treeMenu);

    return div;

}



ParameterPanel = function(format, editorUi, container) {
    BaseFormatPanel.call(this, format, editorUi, container);
    this.init();
};

mxUtils.extend(ParameterPanel, BaseFormatPanel);

ParameterPanel.prototype.init = function() {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    
    //this.container.appendChild(this.addParamTemperatureProfile(this.createPanel()));
    //this.container.appendChild(this.addParamDischargeProfile(this.createPanel()));
    //this.container.appendChild(this.addParamPressProfile(this.createPanel()));
    //this.container.appendChild(this.addParamInfoProfile(this.createPanel()));

    this.container.appendChild(this.addParamTagProfile(this.createPanel()));
}


ParameterPanel.prototype.addParamTagProfile = function(div) {
    var cell = this.editorUi.editor.graph.getSelectionCell();
    var ui = this.editorUi;
    var graph = GModel.graph;
    if (!cell || !cell.value) {
    	//没有参数时 隐藏div
    	div.style.display="none";
        return div;
    }

    //模板
    var containerdiv = document.createElement('div');
    containerdiv.style.padding = '6px 0px 1px';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '180px';
    containerdiv.style.height = '25px';
    
    //添加标题
//    var titlediv = document.createElement('div');
//    titlediv.style.marginTop = '2px';
//    titlediv.style.marginBottom = '8px';
//    titlediv.style.fontWeight = 'bold';
//    mxUtils.write(titlediv, '动态参数');
//    var containerdivcptitle = containerdiv.cloneNode(false);
//    containerdivcptitle.appendChild(titlediv);
//    div.appendChild(containerdivcptitle);
    
    //add editbox for text
    
    //check text
    var sText = cell.style!=null ? cell.style.substring(0, cell.style.indexOf(";")): null;
    
    if(sText == "text")
	{
    	var tag_value="";
    	if(cell.value != undefined ) tag_value = cell.value;
    	var valuespan = document.createElement('span');
        mxUtils.write(valuespan, mxResources.get('content'));
        var valueinput = document.createElement('input');
        //valueinput.className = 'param-inpt';
        valueinput.value =  tag_value;     
        valueinput.style.width = '120px';
        valueinput.style.height = '20px';
        valueinput.style.marginLeft = '5px';
        valueinput.style.float = 'right';
        
        var containerdivcptmpt1 = containerdiv.cloneNode(false);
        containerdivcptmpt1.style.height = '30px';
        containerdivcptmpt1.appendChild(valuespan);
        containerdivcptmpt1.appendChild(valueinput);
        
        function UpdateTagValue()
        {
        	var newvalue = valueinput.value;        	
        	graph.getModel().beginUpdate();
    		//cell.value = valueinput.value;
        	cell.setValue(newvalue);
    		graph.getModel().endUpdate();
        }   
        
        mxEvent.addListener(valueinput, 'change', UpdateTagValue);
        
        div.appendChild(containerdivcptmpt1);
	
	}
    
    
    //检索动态属性类型
    var gObj=cell.value;
    for(var key in GModel.DocumentMap){
    	if(gObj.gobjType==key){
    	    //获取该类型下的所有属性值
    		var pList=GModel.DocumentMap[key];
//    		console.log(gObj,pList);
    		pList.forEach(function (obj) {
                var valuespan = document.createElement('span');
                valuespan.style.lineHeight = '25px';
                mxUtils.write(valuespan, obj.label+'：');
                if(obj.type=="input"){
                	if(!gObj[obj.name] && gObj[obj.name]!==0){
                		gObj[obj.name]='';
                	}
                    var valueinput = document.createElement('input');
                    valueinput.className = 'param-inpt';
                    valueinput.value = gObj[obj.name]===0?'0':(gObj[obj.name]||'');
                    valueinput.style.width = '100px';
                    // valueinput.style.marginLeft = '20px';
                    valueinput.style.float = 'right';
                    valueinput.name = obj.name;
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(valueinput);
                    div.appendChild(tempDiv);
                    mxEvent.addListener(valueinput, 'change', function () {
                    	graph.getModel().beginUpdate();
                    	try{
                    		gObj.setAttribute(this.name,this.value);
                    	}finally{
        					graph.getModel().endUpdate();
        				}
                    });
                }
                if(obj.type=="booleanRadio"){
                    var valueinput = document.createElement('button');
                    valueinput.className = 'auto_set_btn'+(gObj[obj.name]=='on'?' btn_on':' btn_off');
                    valueinput.style.float = 'right';
                    valueinput.name = obj.name;
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(valueinput);
                    div.appendChild(tempDiv);
                    mxEvent.addListener(valueinput, 'click', function () {
                    	this.className = 'auto_set_btn'+(gObj[this.name]!='on'?' btn_on':' btn_off');
                        gObj.setAttribute(this.name,gObj[this.name]=='on'?'off':'on');
                        // gObj.setSwitchStatus(gObj[this.name]=='on'?'off':'on');
                    });
                }
                if(obj.type=="inputImage"){
                    var valueinput = document.createElement('input');
                    valueinput.className = 'param-inpt';
                    valueinput.value = gObj[obj.name]==0?'0':(gObj[obj.name]||'');
                    valueinput.style.width = '70px';
                    valueinput.style.float = 'right';
                    valueinput.name = obj.name;
                    valueinput.id='input_image_picurl';
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(valueinput);
                    var btn = mxUtils.button(mxResources.get('gobjImgUpload'), mxUtils.bind(this, function (evt) {
                		if (cell != null){
                			var dlg = new ImgUpdataDialogEX(ui, cell, graph);
                			ui.showDialog(dlg.container, 500, 380, true, false);
                		}
                    }));
                    btn.style.width = '60px';
                    tempDiv.appendChild(btn);
                    div.appendChild(tempDiv);
                    mxEvent.addListener(valueinput, 'change', function () {
                    	graph.getModel().beginUpdate();
                    	try{
                    		gObj.setAttribute(this.name,this.value);
                    	}finally{
        					graph.getModel().endUpdate();
        				}
                    });
                }
                if(obj.type=="pageSelect"){
                	if(!gObj.pageId){
                		gObj.pageId=appRoots[0].id;
                	}
                    var select=document.createElement('select');
                    select.id='btnPageSelect';
                    select.style.float='right';
                    select.style.width='100px';
                    for(var i=0;i<appRoots.length;i++){
                    	var op=document.createElement('option');
                    	op.value=appRoots[i].id;
                    	op.innerHTML=appRoots[i].name;
                    	if(gObj.pageId==appRoots[i].id){
                    		op.selected='selected';
                    	}
                    	select.appendChild(op);
                    }
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(select);
                    div.appendChild(tempDiv);
                    mxEvent.addListener(select, 'change', function (evt) {
                    	gObj.pageId=select.value;
                    });
                }
                if(obj.type=="chartStyle"){
                	var label1=document.createElement('label');
                	label1.style.marginLeft = '20px';
                    var radio1=document.createElement('input');
                    radio1.type='radio';
                    radio1.value='0';
                    radio1.name='chartStyle';
                    radio1.checked='checked';
                    label1.appendChild(radio1);
                    label1.appendChild(document.createTextNode(mxResources.get('gobjChartStyleR')));
                    var label2=document.createElement('label');
                    label2.style.marginLeft = '20px';
                    var radio2=document.createElement('input');
                    radio2.type='radio';
                    radio2.value='1';
                    radio2.name='chartStyle';
                    label2.appendChild(radio2);
                    label2.appendChild(document.createTextNode(mxResources.get('gobjChartStyleC')));
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(label1);
                    tempDiv.appendChild(label2);
                    div.appendChild(tempDiv);
                }
                if(obj.type=="dataFormat"){
                	if(!gObj[obj.name]){
                		gObj[obj.name]='0.00';
                	}
                    var valueinput = document.createElement('input');
                    valueinput.className = 'param-inpt';
                    valueinput.value = gObj[obj.name]===0?'0':(gObj[obj.name]||'');
                    valueinput.style.width = '100px';
                    // valueinput.style.marginLeft = '20px';
                    valueinput.style.float = 'right';
                    valueinput.name = obj.name;
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(valueinput);
                    div.appendChild(tempDiv);
                    mxEvent.addListener(valueinput, 'keyup', function () {
                    	this.value=this.value.replace(/[^\d.,ao]/g,"")
                    	gObj[this.name]=this.value;
                    });
                }
                if(obj.type=="showFormat"){
                    var select=document.createElement('select');
                    select.style.float='right';
                    select.style.width='100px';
                	var op=document.createElement('option');
                	op.value='scale';
                	op.innerHTML='小刻度';
                	select.appendChild(op);
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(select);
                    div.appendChild(tempDiv);
                }
                if(obj.type=="timeSelect"){
                	if(!gObj[obj.name]){
                		gObj[obj.name]='*';
                	}
                    var select=document.createElement('select');
                    select.style.float='right';
                    select.style.width='100px';
                    var opList=['*','*-1 Hour','*-4 Hour','*-8 Hour','*-1 Day','*-7 Day'];
                	for(var i=0;i<opList.length;i++){
                        var op=document.createElement('option');
                    	op.value=opList[i];
                    	op.innerHTML=opList[i];
                    	if(op.value==gObj[obj.name]){
                    		op.selected='selected';
                    	}
                    	select.appendChild(op);
                	}
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(select);
                    div.appendChild(tempDiv);
                    mxEvent.addListener(select, 'change', function (evt) {
                    	gObj[obj.name]=select.value;
                    });
                }
                if(obj.type=="isInner"){
                	var label1=document.createElement('label');
                	label1.style.marginLeft = '20px';
                    var radio1=document.createElement('input');
                    radio1.type='radio';
                    radio1.value='0';
                    radio1.name='isInner';
                    radio1.checked='checked';
                    label1.appendChild(radio1);
                    label1.appendChild(document.createTextNode(mxResources.get('gobjBtnYes')));
                    var label2=document.createElement('label');
                    label2.style.marginLeft = '20px';
                    var radio2=document.createElement('input');
                    radio2.type='radio';
                    radio2.value='1';
                    radio2.name='isInner';
                    label2.appendChild(radio2);
                    label2.appendChild(document.createTextNode(mxResources.get('gobjBtnNo')));
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(label1);
                    tempDiv.appendChild(label2);
                    div.appendChild(tempDiv);
                }
                if(obj.type=="multipleScale"){
                	var label1=document.createElement('label');
                	label1.style.marginLeft = '20px';
                    var radio1=document.createElement('input');
                    radio1.type='radio';
                    radio1.value='0';
                    radio1.name='isInner';
                    if(gObj[obj.name]){
                    	radio1.checked='checked';
                    }
                    label1.appendChild(radio1);
                    label1.appendChild(document.createTextNode(mxResources.get('gobjBtnYes')));
                    var label2=document.createElement('label');
                    label2.style.marginLeft = '20px';
                    var radio2=document.createElement('input');
                    radio2.type='radio';
                    radio2.value='1';
                    radio2.name='isInner';
                    if(!gObj[obj.name]){
                    	radio2.checked='checked';
                    }
                    label2.appendChild(radio2);
                    label2.appendChild(document.createTextNode(mxResources.get('gobjBtnNo')));
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(label1);
                    tempDiv.appendChild(label2);
                    div.appendChild(tempDiv);
                }
                if(obj.type=="colorInput"){
                	if(!gObj[obj.name]){
                		gObj[obj.name]='';
                	}
                    var btnC = document.createElement('button');
                    var applyC = function (color) {
                    	btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+(color != null ? color : '#f00') + ';"></div>';
                    	gObj[obj.name]=color;
                    };
                	btnC = mxUtils.button('', mxUtils.bind(this, function(evt){
                		ui.pickColor(gObj[obj.name], applyC);
                		mxEvent.consume(evt);
                	}));
                	btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+gObj[obj.name]+';"></div>';
                	btnC.className = 'geColorBtn';
                	btnC.style.marginLeft = '30px';
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(btnC);
                    div.appendChild(tempDiv);
                }
                if(obj.type=="numberInput"){
                	if(!gObj[obj.name] && gObj[obj.name]!==0){
                		gObj[obj.name]='100';
                	}
                	var p=document.createElement('div');
                	p.style.width='100px';
                	p.style.float='right';
                	var input = document.createElement('input');
                	input.value = gObj[obj.name];
                	input.name = obj.name;
                	input.style.textAlign = 'right';
                	input.style.width = '40px';
                	input.style.height = '20px';
                	var stepper = createStepper(input, function(){
                        var val = parseInt(input.value);
                        if (isNaN(val)) {
                            val=0;
                        }
                        if(val<0){
                            val=0;
                        }
                        if(val>100){
                            val=100;
                        }
                        this.value=val;
                        gObj.setAttribute(input.name,val);
                	}, 1, 9);
                	stepper.style.marginLeft = '40px';
                	stepper.style.marginTop = '-20px';
                	p.appendChild(input);
                    p.appendChild(stepper);
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(p);
                    div.appendChild(tempDiv);
                    mxEvent.addListener(input, 'change', function () {
                        var val = parseInt(this.value);
                        if (isNaN(val)) {
                        	val=0;
                        }
                        if(val<0){
                        	val=0;
						}
						if(val>100){
                        	val=100;
						}
                        this.value=val;
                        gObj.setAttribute(this.name,val);
                    });
                }
                if(obj.type=="dataSrc"){
                	if(!gObj.dataIds || gObj.dataIds.length==0){
                        gObj.dataIds=[''];
					}
                    var valueinput = document.createElement('input');
                    valueinput.className = 'param-inpt';
                    valueinput.value = gObj[obj.name]==0?'0':(gObj[obj.name]||'');
                    valueinput.style.width = '68px';
                    // valueinput.style.marginLeft = '20px';
                    valueinput.style.float = 'right';
                    valueinput.name = obj.name;
                    var btnPlus = document.createElement('button');
                    btnPlus.className = 'btn_plus';
                    btnPlus.style.float = 'right';
                    var btnMinus = document.createElement('button');
                    btnMinus.className = 'btn_minus';
                    btnMinus.style.float = 'right';
                    var tempDiv = containerdiv.cloneNode(false);
                    tempDiv.style.height = '30px';
                    tempDiv.appendChild(valuespan);
                    tempDiv.appendChild(btnMinus);
                    tempDiv.appendChild(btnPlus);
                    tempDiv.appendChild(valueinput);
                    div.appendChild(tempDiv);
                    mxEvent.addListener(valueinput, 'change', function () {
                    	gObj.setAttribute(this.name,this.value);
                    });
                    mxEvent.addListener(btnPlus, 'click', function () {
                    	var flag=true;
                    	for(var i=0;i<gObj.dataIds.length;i++){
                    		if(gObj.dataIds[i]===''){
                    			flag=false;
                    			break;
                    		}
                    	}
                    	if(flag){
                    		gObj.dataIds.push('');
                    		var tempDiv=document.getElementById('dataIds_table_list');
                    		initDataIdsArray(gObj.dataIds,tempDiv);
                    	}
                    });
                    mxEvent.addListener(btnMinus, 'click', function () {
                    	if(gObj.dataIds.length-1>0){
                    		gObj.dataIds.pop();
                    		var tempDiv=document.getElementById('dataIds_table_list');
                    		initDataIdsArray(gObj.dataIds,tempDiv);
                    	}
                    });
                }
                if(obj.type=="dataIds"){
                	if(!gObj.dataIds || gObj.dataIds.length==0){
                        gObj.dataIds=[''];
					}
                    var tempDiv = document.createElement('div');
                    tempDiv.id='dataIds_table_list';
                    tempDiv.style.padding = '6px 0px 1px';
                    tempDiv.style.overflow = 'auto';
                    tempDiv.style.whiteSpace = 'nowrap';
                    tempDiv.style.width = '220px';
                    tempDiv.style.height = '90px';
                    initDataIdsArray(gObj.dataIds,tempDiv);
                    div.appendChild(tempDiv);
                }
            });
    		//modify by wugh, 2018.5.2
    		//move code to actions multistate
//    		if(key=='GDataTag'){
//                btn = mxUtils.button('设置多态', mxUtils.bind(this, function (evt) {
//                    this.editorUi.actions.get('valueChange').funct();
//                }));
//                btn.setAttribute('title', '设置多态');
//                btn.style.width = '100px';
//                btn.style.marginBottom = '2px';
//                div.appendChild(btn);
//			}
    		break;
    	}
    }
    
    //如果没有参数，就不添加div
	//没有参数时 隐藏div
    if (!div.hasChildNodes())
    	div.style.display="none";
    
    return div;
    
    
    function initDataIdsArray(idList, body){
    	body.innerHTML='';
        //模板
        var containerdiv = document.createElement('div');
        containerdiv.style.display = 'table';
        containerdiv.style.overflow = 'hidden';
        containerdiv.style.whiteSpace = 'nowrap';
        containerdiv.style.width = '180px';
        containerdiv.style.height = '25px';
        for(var i=0;i<idList.length;i++){
        	//按列表追加测点元素
            var valuespan = document.createElement('div');
            valuespan.style.lineHeight = '25px';
            valuespan.style.display = 'table-cell';
            valuespan.style.width = '80px';
            mxUtils.write(valuespan, '测点'+(i+1)+'：');
            var valuespan2 = document.createElement('div');
            valuespan2.style.display = 'table-cell';
            valuespan2.name=i;
            var valueinputMeasId = document.createElement('input');
            valueinputMeasId.className = 'param-inpt';
            valueinputMeasId.value = idList[i]||'';
            valueinputMeasId.style.width = '62px';
            valuespan2.appendChild(valueinputMeasId);
            var btnLink = document.createElement('button');
            btnLink.className = 'btn_dataIds_link';
            btnLink.style.float = 'right';
            mxEvent.addListener(btnLink, 'click', function () {
                if (cell != null){
                	if(cell.value.gobjType=='GChartPie'){
                        var dlg = new DataIdPieDialogEX(ui, cell, this.parentNode.name);
                        ui.showDialog(dlg.container, 500, 380, true, false);
                    }
                    if(cell.value.gobjType=='GChartTrend' || cell.value.gobjType=='GChartScatter'){
                        var dlg = new DataIdTrendDialogEX(ui, cell, this.parentNode.name);
                        ui.showDialog(dlg.container, 500, 380, true, false);
                    }
                }
            });
            valuespan2.appendChild(btnLink);
            var tempDiv = containerdiv.cloneNode(false);
            tempDiv.style.height = '30px';
            tempDiv.appendChild(valuespan);
            tempDiv.appendChild(valuespan2);
            body.appendChild(tempDiv);
            mxEvent.addListener(valueinputMeasId, 'keyup', function () {
            	idList[parseInt(this.parentNode.name)]=this.value;
            });
        }
    }
}

ParameterPanel.prototype.addParamTemperatureProfile = function(div) {
	
    var containerdiv = document.createElement('div');
    containerdiv.style.padding = '6px 0px 1px';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '200px';
    containerdiv.style.height = '25px';

    var titlediv = document.createElement('div');
    titlediv.style.marginTop = '2px';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '温度');
    
    var containerdivcptitle = containerdiv.cloneNode(false);
    containerdivcptitle.appendChild(titlediv);



    var tmptsstspan = document.createElement('span');
    mxUtils.write(tmptsstspan, '温度设置值');
    var tmptsstinput = document.createElement('input');
    tmptsstinput.className = 'param-inpt';
    tmptsstinput.style.width = '100px'
    tmptsstinput.style.marginLeft = '20px';
    tmptsstinput.style.float = 'right';
    var containerdivcptmpt1 = containerdiv.cloneNode(false);
    containerdivcptmpt1.style.height = '30px';
    containerdivcptmpt1.appendChild(tmptsstspan);
    containerdivcptmpt1.appendChild(tmptsstinput);

    var temptbspan = document.createElement('span');
    mxUtils.write(temptbspan, '壁炉温度');
    var temptbinput = document.createElement('input');
    temptbinput.className = 'param-inpt';
    temptbinput.style.width = '100px'
    temptbinput.style.marginLeft = '20px';
    temptbinput.style.float = 'right';
    var containerdivcptmpt2 = containerdiv.cloneNode(false);
    containerdivcptmpt2.style.height = '30px';
    containerdivcptmpt2.appendChild(temptbspan);
    containerdivcptmpt2.appendChild(temptbinput);


    var bardiv = document.createElement('div');
    bardiv.style.background = '#ddd';
    //bardiv.style.background = '-moz-linear-gradient(right, red, orange, yellow, green, blue)';
    bardiv.style.width = '198px';
    bardiv.style.height = '3px';
    bardiv.style.position = 'relative';
    bardiv.style.marginTop = '5px';
    bardiv.style.marginLeft = '2px';
    var progressdiv = document.createElement('div');
    progressdiv.style.background = '#66D9EF';
    progressdiv.style.position = 'absolute';
    progressdiv.style.height = '3px';
    progressdiv.style.width = '0';
    progressdiv.style.left = '0';
    progressdiv.style.bottom = '0';
    var spanbtn = document.createElement('span');
    spanbtn.style.background = '#aaa';
    spanbtn.style.width = '8px';
    spanbtn.style.height = '16px';
    spanbtn.style.position = 'absolute';
    spanbtn.style.left = '-2px';
    spanbtn.style.top = '-6px';
    spanbtn.style.cursor = 'pointer';
    spanbtn.style.borderRadius = '3px';
    bardiv.appendChild(progressdiv);
    bardiv.appendChild(spanbtn);
    var containerdivcpprogress = containerdiv.cloneNode(false);

    var scale = function(btn, bar, title) {
        this.btn = btn;
        this.bar = bar;
        this.title = title;
        this.step = this.bar.getElementsByTagName("div")[0];
        this.init = function() {
            var f = this,
                g = document,
                b = window,
                m = Math;
            f.btn.onmousedown = function(e) {
                var x = (e || b.event).clientX;
                var l = this.offsetLeft;
                var max = f.bar.offsetWidth - this.offsetWidth;
                g.onmousemove = function(e) {
                    var thisX = (e || b.event).clientX;
                    var to = m.min(max, m.max(-2, l + (thisX - x)));
                    f.btn.style.left = to + 'px';
                    f.ondrag(m.round(m.max(0, to / max) * 100), to);
                    b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                };
                g.onmouseup = new Function('this.onmousemove=null');
            };
        };
        this.ondrag = function(pos, x) {
            this.step.style.width = Math.max(0, x) + 'px';
            this.title.innerHTML = pos + '%';
        };
        this.init();
    }
    containerdivcpprogress.style.height = '30px';
    containerdivcpprogress.appendChild(bardiv);


    var numberdiv = document.createElement('div');
    mxUtils.write(numberdiv, '0%');
    var containerdivcpnumber = containerdiv.cloneNode(false);
    containerdivcpnumber.appendChild(numberdiv);

    div.appendChild(containerdivcptitle);
    div.appendChild(containerdivcptmpt1);
    div.appendChild(containerdivcptmpt2);

    div.appendChild(containerdivcpnumber);
    div.appendChild(containerdivcpprogress);
    var scalebar = new scale(spanbtn, bardiv, numberdiv);
    return div;
}

ParameterPanel.prototype.addParamDischargeProfile = function(div) {
    var containerdiv = document.createElement('div');
    containerdiv.style.padding = '6px 0px 1px';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '200px';
    containerdiv.style.height = '24px';

    var titlediv = document.createElement('div');
    titlediv.style.marginTop = '2px';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '流量');
    var containerdivcptitle = containerdiv.cloneNode(false);
    containerdivcptitle.appendChild(titlediv);

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var addloginfo = function(data1, data2) {
        var tdcph1 = td.cloneNode(false);
        var tdcph2 = td.cloneNode(false);
        var input1 = document.createElement('input');
        input1.setAttribute('type', 'text');
        input1.className = 'param-inpt';
        input1.setAttribute('value', data1);
        var input2 = document.createElement('input');
        input2.setAttribute('type', 'text');
        input2.className = 'param-inpt';
        input2.setAttribute('value', data1);
        tdcph1.appendChild(input1);
        tdcph2.appendChild(input2);
        var trcph = tr.cloneNode(false);
        trcph.appendChild(tdcph1);
        trcph.appendChild(tdcph2);
        tbody.appendChild(trcph);
    }

    var tdcph1 = td.cloneNode(false);
    tdcph1.style.width = '100px';
    tdcph1.style.fontWeight = 'bold';
    var tdcph2 = td.cloneNode(false);
    tdcph2.style.fontWeight = 'bold';
    mxUtils.write(tdcph1, 'Air');
    mxUtils.write(tdcph2, 'CH4');
    var trcph = tr.cloneNode(false);
    trcph.appendChild(tdcph1);
    trcph.appendChild(tdcph2);
    tbody.appendChild(trcph);
    table.appendChild(tbody);



    div.appendChild(containerdivcptitle);
    div.appendChild(table);
    addloginfo(13, 13);
    addloginfo(15, 14);


    return div;
}

ParameterPanel.prototype.addParamPressProfile = function(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var opc = {
        chart: {
            backgroundColor: '#f5f5f5',
            type: 'spline',
            zoomType: 'xy',
            resetZoomButton: {
                position: {
                    // align: 'right', // by default
                    // verticalAlign: 'top', // by default
                    x: 0,
                    y: 0
                }
            },
            width: 200,
            height: 200
        },
        legend: {
            enabled: false,
        },
        credits: {
            enabled: false
        },
        title: {
            text: '',
        },
        xAxis: {
            minTickInterval: 20,
            title: {},
            labels: {
                maxStaggerLines: 500,
                formatter: function() {

                    var now = this.value * _simuPARAM["step"];
                    now = now.toFixed(5);
                    return now + 's';
                }
            },
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                //align: 'left',
                x: -5
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '{series.name}:<b>{point.x}</b> <b>{point.y}</b><br>'
        },

        //series:List
        series: [{
            name: 'Im-1',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: [
                [1, 0],
                [2, 0.6],
                [3, 0.7],
                [4, 0.8],
                [5, 0.6],
                [6, 0.6],
                [7, 0.67],
                [8, 0.81],
                [9, 0.78],
                [10, 0.98],
                [11, 1.84],
                [12, 1.80],
                [13, 1.80],
                [14, 1.92],
                [15, 2.49],
                [16, 2.79],
                [17, 2.73],
                [18, 2.61],
                [19, 2.76],
                [20, 2.82],
                [21, 2.8],
                [22, 2.1],
                [23, 1.1],
                [24, 0.25],
                [25, 0]
            ]
        }, {
            name: 'Im-2',
            data: [
                [1, 0],
                [2, 0.2],
                [3, 0.47],
                [4, 0.55],
                [5, 1.38],
                [6, 1.38],
                [7, 1.38],
                [8, 1.38],
                [9, 1.48],
                [10, 1.5],
                [11, 1.89],
                [12, 2.0],
                [13, 1.94],
                [14, 1.91],
                [15, 1.75],
                [16, 1.6],
                [17, 0.6],
                [18, 0.35],
                [19, 0]
            ]
        }, {
            name: 'Im-3',
            data: [
                [1, 0],
                [2, 0.15],
                [3, 0.35],
                [4, 0.46],
                [5, 0.59],
                [6, 0.58],
                [7, 0.62],
                [8, 0.65],
                [9, 0.77],
                [10, 0.77],
                [11, 0.79],
                [12, 0.86],
                [13, 0.8],
                [14, 0.94],
                [15, 0.9],
                [16, 0.39],
                [17, 0]
            ]
        }]
    };
    var containerdiv = document.createElement('div');
    containerdiv.style.padding = '6px 0px 1px';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '200px';
    containerdiv.style.height = '24px';

    var titlediv = document.createElement('div');
    titlediv.style.marginTop = '2px';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '图表');
    var containerdivcptitle = containerdiv.cloneNode(false);
    containerdivcptitle.appendChild(titlediv);

    var ol = document.createElement('ol');
    ol.style.marginTop = '3px';
    var li = document.createElement('li');
    ol.className = 'breadcrumb';
    var lifirst = li.cloneNode(false);
    lifirst.className = 'active';
    mxUtils.write(lifirst, 'c1');
    //var lisec = li.cloneNode(false);
    //mxUtils.write(lisec,'c2');
    //ol.appendChild(lifirst);
    //ol.appendChild(lisec);


    var chartdiv = document.createElement('div');
    //if (!$(chartdiv).highcharts()) {
    //    $(chartdiv).highcharts(opc);
    //}
    chartdiv.style.width = '200px';
    chartdiv.style.height = '200px';
    var containerdivcpchart = containerdiv.cloneNode(false);
    containerdivcpchart.className = 'ctdhschart';
    containerdivcpchart.style.height = '195px';
    containerdivcpchart.appendChild(chartdiv);
    mxEvent.addListener(lifirst, 'click', function(evt) {
        $('.ctdhschart').hide();
        $(containerdivcpchart).show();
        $(ol).find('li').removeClass('active');
        lifirst.className = 'active';
    });

    var testdata = [{
        name: 'Im-1',
        // Define the data points. All series have a dummy year
        // of 1970/71 in order to be compared on the same x axis. Note
        // that in JavaScript, months start at 0 for January, 1 for February etc.
        data: [
            [1, 2],
            [2, 2.6],
            [3, 0.7],
            [4, 0.8],
            [5, 0.6],
            [6, 0.6],
            [7, 0.67],
            [8, 0.81],
            [9, 0.78],
            [10, 0.98],
            [11, 1.84],
            [12, 1.80],
            [13, 1.80],
            [14, 1.92],
            [15, 2.49],
            [16, 2.79],
            [17, 2.73],
            [18, 2.61],
            [19, 2.76],
            [20, 2.82],
            [21, 2.8],
            [22, 2.1],
            [23, 1.1],
            [24, 0.25],
            [25, 0]
        ]
    }];

    this.addchart = function(data, name) {
        var chartdiv = document.createElement('div');
        opc.series = data;
        if (!$(chartdiv).highcharts()) {
            $(chartdiv).highcharts(opc);
        }
        chartdiv.style.width = '200px';
        chartdiv.style.height = '200px';
        var containerdivcpchartcp = containerdiv.cloneNode(false);
        containerdivcpchartcp.className = 'ctdhschart';
        containerdivcpchartcp.style.height = '195px';
        containerdivcpchartcp.appendChild(chartdiv);
        containerdivcpchartcp.style.display = 'none';

        var licp = li.cloneNode(false);
        mxEvent.addListener(licp, 'click', function(evt) {
            $('.ctdhschart').hide();
            $(containerdivcpchartcp).show();
            $(ol).find('li').removeClass('active');
            licp.className = 'active';
        });
        mxUtils.write(licp, name);
        ol.appendChild(licp);
        div.appendChild(containerdivcpchartcp);
    }
    
    div.appendChild(containerdivcptitle);
    div.appendChild(ol);
    //div.appendChild(containerdivcpchart);
    //this.addchart(testdata,'cs53');
    //fill chart data
    var tcell = graph.getSelectionCell();
//    for (var x = 0; x < datasample.data.length; x++) {
//        if (tcell.classname == datasample.data[x].name) {
//            var testay = [];
//            for (var y in datasample.data[x].data) {
//                testay.push(y);
//            }
//            testay.sort();
//            for (var z = 0; z < testay.length; z++) {
//                var usedata = datasample.data[x].data[testay[z]];
//                var chartname = testay[z];
//                var seriesdata = {};
//                seriesdata.name = tcell.classname + '-' + (z + 1);
//                seriesdata.data = usedata.slice(0);
//                this.addchart([seriesdata], chartname);
//            }
//            break;
//        }
//    }
//    ol.childNodes[0].click();
    return div;
}

ParameterPanel.prototype.addParamControlProfile = function(div) {
    var containerdiv = document.createElement('div');
    containerdiv.style.padding = '6px 0px 1px';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '200px';
    containerdiv.style.height = '24px';

    var titlediv = document.createElement('div');
    titlediv.style.marginTop = '2px';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '控制');
    var containerdivcptitle = containerdiv.cloneNode(false);
    containerdivcptitle.appendChild(titlediv);

    div.appendChild(containerdivcptitle);
    return div;
}

ParameterPanel.prototype.addParamInfoProfile = function(div) {
    var containerdiv = document.createElement('div');
    containerdiv.style.padding = '6px 0px 1px';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '200px';
    containerdiv.style.height = '24px';

    var titlediv = document.createElement('div');
    titlediv.style.marginTop = '2px';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '日志');
    var containerdivcptitle = containerdiv.cloneNode(false);
    containerdivcptitle.appendChild(titlediv);

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var addloginfo = function(time, info) {
        var tdcph1 = td.cloneNode(false);
        var tdcph2 = td.cloneNode(false);
        mxUtils.write(tdcph1, time);
        mxUtils.write(tdcph2, info);
        var trcph = tr.cloneNode(false);
        trcph.appendChild(tdcph1);
        trcph.appendChild(tdcph2);
        tbody.appendChild(trcph);
    }

    var tdcph1 = td.cloneNode(false);
    tdcph1.style.width = '100px';
    var tdcph2 = td.cloneNode(false);
    mxUtils.write(tdcph1, 'TIME');
    mxUtils.write(tdcph2, 'INFO');
    tdcph1.style.fontWeight = 'bold';
    tdcph2.style.fontWeight = 'bold';
    var trcph = tr.cloneNode(false);
    trcph.appendChild(tdcph1);
    trcph.appendChild(tdcph2);
    tbody.appendChild(trcph);
    table.appendChild(tbody);
    div.appendChild(containerdivcptitle);
    div.appendChild(table);
    addloginfo('12.21', 'info');
    return div;
}

FloatFormat = function(editorUi) {
    this.editorUi = editorUi;
    this.init();
};

FloatFormat.prototype.isPanel = false;

FloatFormat.prototype.init = function() {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    this.update = mxUtils.bind(this, function(sender, evt) {
        this.refresh();
    });
    graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
    //graph.addListener(mxEvent.EDITING_STARTED, this.update);
    //graph.addListener(mxEvent.EDITING_STOPPED, this.update);
};
FloatFormat.prototype.destroyListener = function() {
    // body
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    graph.getSelectionModel().removeListener(this.update);
    graph.removeListener(this.update);
    graph.removeListener(this.update);
};
FloatFormat.prototype.refresh = function(argument) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    /*    if (this.cell ==  graph.getSelectionCell()){
            return;
        }*/
    var cell = graph.getSelectionCell();
    this.cell = cell;
    if (!cell) {
        if (this.formatPanel != null && this.formatPanel.div != null) {
            this.formatPanel.fireEvent(new mxEventObject(mxEvent.CLOSE));
            this.formatPanel.destroy();
        }
        return;
    }
    //console.log(cell);
    var coordinate = $(_editorUI.editor.graph.view.getState(cell).shape.node).offset();
    coordinate.cellwidth = cell.geometry.width;
    coordinate.cellheight = cell.geometry.height;
    this.createFormat(coordinate);
};
FloatFormat.prototype.createFormat = function(coordinate) {
    var this_ = this;
    var div = $('<div style="left: 421px;top: 180px;z-index:100;position:absolute;    width: 220px; background: #fff; -webkit-box-shadow: 0 2px 8px 0 rgba(0,0,0,.1); box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);user-select: none; "></div>');
    if (this_.isPanel) {
        console.log(this.formatPanel);
    } else {
        var formatPanel = new mxWindow('', $('<div></div>')[0], 421, 180, 250, null, false, true);
        //formatPanel.setClosable(true);
        this.formatPanel = formatPanel;
        formatPanel.cellid = this.cell.getId();
        formatPanel.addListener(mxEvent.CLOSE, function(e) {
            //console.log('closed');
            this_.isPanel = false;
            this_.removeautoListener();
            //this_.formatPanel = null;
        });

        formatPanel.installCloseHandler();

        function remove(e) {
            if (e.target == this_.formatPanel.closeImg) {
                document.removeEventListener('click', remove);
                return;
            }
            if (e.target == formatPanel.div) return;
            var target = $(e.target);
            var result = $(formatPanel.div).find(e.target);
            var cell = this_.editorUi.editor.graph.model.getCell(this_.formatPanel.cellid);
            var node = this_.editorUi.editor.graph.view.getState(cell).shape.node;
            var cellresult = $('.geDiagramContainer').find(e.target);
            //var cellresult = $(node).find(e.target);
            //console.log(result);
            //console.log(result.length);
            if (this_.isPanel) {
                if (result.length == 0 && cellresult.length == 0) {
                    this_.formatPanel.fireEvent(new mxEventObject(mxEvent.CLOSE));
                    this_.formatPanel.destroy();
                }

            } else {
                this_.isPanel = true;
            }


        }

        document.addEventListener('click', remove);
        this_.removeautoListener = function() {
            document.removeEventListener('click', remove);
        };
        //this_.isPanel = true;


        //init pssele

        formatPanel.setTitle(mxResources.get('setting'));
        formatPanel.title.style.background = 'none';
        formatPanel.title.style.paddingLeft = '10px';
        formatPanel.title.style.borderBottom = '1px solid #d9d9d9';
        formatPanel.title.style.height = '20px';

        var closebtn = $('<a type="btn" style="cursor:pointer;line-height:20px;font-size:15px;" class="icon-cross2"></a>');
        closebtn.click(function() {
            this_.formatPanel.fireEvent(new mxEventObject(mxEvent.CLOSE));
            this_.formatPanel.destroy();
        });

        var setting = $('<a type="btn" style="cursor:pointer;line-height:20px;font-size:15px;" >高级<a   style="cursor:pointer;line-height:20px;font-size:15px;" class="icon-cog"></a></a>');

        var tid = _pssEle[this.editorUi.editor.graph.getSelectionCell().value].id;
        setting.click(function() {
            if ($(formatPanel.div).children().length >= 2) {

            } else {
                this_.createWizard(tid);
            }

        });
        $(formatPanel.buttons).append(setting);
        //$(formatPanel.buttons).append(closebtn);
        this_.isPanel = true;

    }



    var graph = this.editorUi.editor.graph;
    //console.log(cell);
    var scell = graph.getSelectionCells();
    if (scell[0].edge && !scell[0].classname && !_pssEle[scell[0].classname]) {
        return;
    }
    var iid = "-1"
    var nn = ''
    var p = {} //被双击的元件的父级
    function getSId(obj) {

        try {
            if ("0" != obj.parent.parent.id) {
                getSId(obj.parent);
            } else {
                iid = obj.id
                nn = obj.getValue()
                p = obj
                return
            }
        } catch (err) {
            console.log(err);
        }
        /*        if("1" != obj.parent.id)
                  getSId(obj.parent);
                else{
                  iid = obj.id
                  nn = obj.getValue()
                  p = obj
                  return
                }*/
    }
    try {
        getSId(scell[0]);

        if (p.value != undefined && p.value != '') {
            var tmpn = p.value.split('-')[0];
            if (tmpn == '') {
                return;
            }
        }
        if (_pssEle[p.classname]) {
            nn = p.classname;
        }
    } catch (err) {
        //graph.clearSelection();
        return;
    }
    var paramdiv = document.createElement('div');
    this.addParamEleProfile(paramdiv, iid, nn, p)
        //ParamPanel.prototype.addParamEleProfile(paramdiv,iid,nn,p);
    $(this.formatPanel.content).children().remove();
    this.formatPanel.content.appendChild(paramdiv);
    //var div = document.createElement('div');
    //console.log(this.addParamEleProfile(div,iid,nn,p));





    //show
    var x = null,
        y = null;
    /*    if (_WIN.width-coordinate.left < 500){
            x = coordinate.left-250;
        }else{
            x = coordinate.left+coordinate.cellwidth;
        }*/
    x = coordinate.left - 260;
    if (_WIN.height - $(this.formatPanel.div).height() < 200) {
        y = 0;
    } else {
        if (_WIN.height - coordinate.top < $(this.formatPanel.div).height()) {
            var topdata = coordinate.top + coordinate.cellheight - $(this.formatPanel.div).height();
            y = topdata > 0 ? topdata : 0;
        } else {
            y = coordinate.top;
        }
    }
    this.formatPanel.div.style.zIndex = '10005';
    this.formatPanel.div.style.top = y + 'px';
    this.formatPanel.div.style.left = x + 'px';
    this.formatPanel.show();
};
FloatFormat.prototype.addParamEleProfile = function(div, iid, nn, p) {
    div.style.overflowY = 'auto';
    div.style.overflowX = 'hidden';
    div.style.maxHeight = '580px';
    div.style.borderBottom = '1px solid #e5e5e5';
    var ui = this.editorUi;
    var createPart = function() {
        return $('<div class="part"></div>');
    };
    var createContent = function() {
        return $('<div class="panel-body"></div>');
    }
    var createHeader = function(name) {
        var header = $('<header><p class="title">' + name + '</p><div class=" icon-minus"></div></header>');

        header.click(function() {
            /*            if($(this).data('animating')==1){
                            return;
                        }else{
                            $(this).data('animating',1);
                            if(header.next().height() != 0){
                                header.find('.icon-minus').removeClass('icon-minus').addClass('icon-plus');
                                header.next().data('height',header.next().height());
                                header.next().animate({height:"0px"},'20',function(){header.next().css('visibility','hidden');});
                                $(this).data('animating',0);
                            }else {
                                header.find('.icon-plus').removeClass('icon-plus').addClass('icon-minus');
                                var height_ = header.next().data('height');
                                header.next().animate({height:height_},'20');
                                header.next().css('visibility','visible');
                                $(this).data('animating',0);
                            }

                        }*/
            if (!header.next().hasClass('shrink')) {
                header.next().addClass('shrink');
                header.find('.icon-minus').removeClass('icon-minus').addClass('icon-plus');
            } else {
                header.next().removeClass('shrink');
                header.find('.icon-plus').removeClass('icon-plus').addClass('icon-minus');
            }
        });
        return header;
    }
    var createForm = function(i, type, disabled) {
        var template = null;
        switch (type) {
            case 'up':
                // statements_1
                var input = $('<div class="line"><label>' + _pssEle[nn]['param'][i]['label'] + '</label></div>');
                var button = $('<div class="line"><button index=' + i + ' onclick="showUpData(this,\'CP\',0,\'' + iid + '\',\'' + nn + '\')">查看上传' + _pssEle[nn]['param'][i]['label'] + '内容</button></div> ');
                template = input.push(button[0]);
                break;
            default:
                if (disabled != 1) {
                    template = $('<div class="line" title="' + _pssEle[nn]['param'][i]['desc'] + '"><label>' + _pssEle[nn]['param'][i]['label'] + '</label><input type="text"  class="param-inpt" value="' + _pssEle[nn]['param'][i]['value'] + '" /></div>');
                    template.find('input').change(function() {
                        //save();
                        if (_pssEle[nn]['param'][i]['type'] == 'num' && (isNaN($(this).val()) || $(this).val().trim().length < 1)) {
                            setSysInfo('参数 ' + _pssEle[nn]['param'][i]['label'] + ' 只能为数字，且不为空', 'error');
                            alert('参数 ' + _pssEle[nn]['param'][i]['label'] + ' 只能为数字，且不为空');
                            return;
                        }
                        if (_pssEle[nn]['param'][i]['type'] == 'str' && $(this).val().trim().length < 1) {
                            setSysInfo('参数 ' + _pssEle[nn]['param'][i]['label'] + ' 不能为空', 'error');
                            alert('参数 ' + _pssEle[nn]['param'][i]['label'] + ' 不能为空');
                            return;
                        }
                        _pssEle[nn]['param'][i]['value'] = $(this).val();
                    });
                } else {
                    template = $('<div class="line" title="' + _pssEle[nn]['param'][i]['desc'] + '"><label>' + _pssEle[nn]['param'][i]['label'] + '</label><input type="text"  class="param-inpt" value="' + _pssEle[nn]['param'][i]['value'] + '" disabled /></div>');
                }
                break;
            case 'select':
                break;
        }
        return template;

    }
    var createpin = function(i, j) {
        var template = $('<div class="line"><label>' + mxResources.get('pinn', [j]) + '</label><input class="param-inpt" type="text" value="' + _pssEle[nn]['pin'][i].label + '"></div>');
        return template;
    };
    var pins = new Array();
    for (var nKey in _pssEle[nn]['pin']) {
        pins.push(_pssEle[nn]['pin'][nKey].label);
    }


    //param
    var parampart = createPart();
    var content = createContent();
    for (var i = 0, l = _pssEle[nn]['param'].length; i < l; i++) {
        var form = createForm(i, _pssEle[nn]['param'][i]['type'], _pssEle[nn]['param'][i]['disabled']);
        content.append(form);
    }
    var paramheader = createHeader('param');
    parampart.append(paramheader);
    parampart.append(content);
    $(div).append(parampart);

    /*    if (_pssEle[nn]['param'].length > 5 &&_pssEle[nn]['param'][0]['grp'] !='') {
            var currentTitle = _pssEle[nn]['param'][0]['grp'];
            var data ={currentTitle:{'form':[0],'index':0}};
            for (var i = 0, l = _pssEle[nn]['param'].length; i < l; i++) {
                if (_pssEle[nn]['param'][i]['grp'] != currentTitle) {
                    var length = Object.keys(data).length;
                    data[_pssEle[nn]['param'][i]['grp']] = {'form':[i],'index':length}
                    currentTitle = _pssEle[nn]['param'][i]['grp'];
                }else {
                    data[_pssEle[nn]['param'][i]['grp']]['form'].push(i);
                }
            }
            var l = Object.keys(data).length;
            for (var x = 0 ; x < l ; x ++){

            }
        }else {

        }*/

    //pin
    var pinpart = createPart();
    var pincontent = createContent();
    var pinheader = createHeader('pin');
    var j = 1;
    for (var i = 0; i < pins.length; i++, j++) {
        html = '<div class="param-name1 text-right">' + mxResources.get('pinn', [j]) + '</div>：<input type="text"  onchange="changeflag(\'CP\',0,\'' + iid + '\',\'' + nn + '\')" class="param-input" value="' + pins[i] + '" /><br>';
        var pinform = createpin(i, j);
        pincontent.append(pinform);
    }
    pinpart.append(pinheader);
    pinpart.append(pincontent)
    $(div).append(pinpart);



    return div;
};
FloatFormat.prototype.createWizard = function(id) {
    this.formatPanel.table.style.position = 'relative';
    this.formatPanel.table.style.borderRight = '1px solid #c3c3c3';
    this.formatPanel.table.style.float = 'left';
    this.formatPanel.div.style.width = '601px';
    var wizardpage = $('<div style="position:relative;float:right;background:#fff;width:350px;border-left:1px solid #e5e5e5;overflow-y: auto;overflow-x: hidden;max-height: 580px;"></div>');
    $(this.formatPanel.div).append(wizardpage);




    var data = [{ 'name': '单相接地', 'img': '/static/icons/iconACDC/单相接地.png', 'type': 'component', 'id': '25' }, { 'name': '相间短路', 'img': '/static/icons/iconACDC/相间短路.png', 'type': 'component', 'id': '25' }, { 'name': '三相短路', 'img': '/static/icons/iconACDC/三相短路.png', 'type': 'component', 'id': '25' }, ];
    var data2 = [{ 'name': '保护', 'img': '/static/icons/iconACDC/保护.png', 'type': 'mod', 'id': '279' }, { 'name': '控制', 'img': '/static/icons/iconACDC/控制.png', 'type': 'mod', 'id': '279' }];
    var data3 = [{ 'name': '电容', 'img': '/static/upload/background/3bf6dae3d3bb4bb4c6d8f5c8d363fd8a-_=_.svg', 'id': '169' },
        { 'name': '电阻', 'img': '/static/upload/background/c8a05dd99d67d54b53fe4fbf22ba3e48-kresistor.svg', 'type': 'Topology', 'id': '178' },
        { 'name': '电感', 'img': '/static/upload/background/36b7dbcf81c215f58ea5cc915cb441e9-inductor2.svg', 'type': 'Topology', 'id': '179' },
        { 'name': '电感', 'img': '/static/upload/background/36b7dbcf81c215f58ea5cc915cb441e9-inductor2.svg', 'type': 'Topology', 'id': '179' },
        { 'name': '电感', 'img': '/static/upload/background/36b7dbcf81c215f58ea5cc915cb441e9-inductor2.svg', 'type': 'Topology', 'id': '179' },
        { 'name': '电容', 'img': '/static/upload/background/3bf6dae3d3bb4bb4c6d8f5c8d363fd8a-_=_.svg', 'type': 'Topology', 'id': '169' },
        { 'name': '电阻', 'img': '/static/upload/background/c8a05dd99d67d54b53fe4fbf22ba3e48-kresistor.svg', 'type': 'Topology', 'id': '178' },
        { 'name': '电感', 'img': '/static/upload/background/36b7dbcf81c215f58ea5cc915cb441e9-inductor2.svg', 'type': 'Topology', 'id': '179' }
    ];
    var createHeader = function(name) {
        var header = $('<header><p class="title">' + name + '</p></header>');
        return header;
    };
    var createContent = function(data, eletype) {
        var content = $('<ul class="ul"></ul>');

        for (var x = 0; x < data.length; x++) {
            var li = $('<li class="item"><a class="bte"> <span class="spanicon"><img src="' + data[x].pic + '"/></span><span class="spantext">' + data[x].name + '</span></li>');
            content.append(li);
            new createDraggable(li[0], data[x].content, eletype);
        }
        return content;
    }
    var createCard = function() {
        var card = $('<div class="card"></div>');
        return card;
    };
    var createPart = function() {
        return $('<div class="wpart"></div>');
    };


    var getcwdata = function() {
        $.get('/editor/listComponentWizard/?id=' + id, function(result) {
            if (result.success) {

                data3 = result.conmpoents;
                data2 = result.mods;
                data = result.topology;


                var title = createHeader('向导');
                title.css('height', '18px');
                title.css('margin-bottom', '20px');
                title.css('width', '601px');
                title.css('border-bottom', '1px solid #e5e5e5');
                title.css('position', 'fixed');
                wizardpage.append(title);
                wizardpage.append($('<div style="padding-top:28px"></div>'));

                var part = createPart();
                var card = createCard();
                var head = createHeader('常用拓扑');
                var content = createContent(data, 'Topology');
                part.append(head);
                card.append(content);
                part.append(card);
                wizardpage.append(part);

                var part2 = createPart();
                var card2 = createCard();
                var head2 = createHeader('模块选择');
                var content2 = createContent(data2, 'module');
                part2.append(head2);
                card2.append(content2);
                part2.append(card2);
                wizardpage.append(part2);

                var part3 = createPart();
                var card3 = createCard();
                var head3 = createHeader('常连元件');
                var content3 = createContent(data3, 'Comp');
                part3.append(head3);
                card3.append(content3);
                part3.append(card3);
                wizardpage.append(part3);

            } else {
                wizardpage.append('<p>获取数据失败。</p>');
            }
        });
    };
    getcwdata();

    this.wizardpage = wizardpage[0];
};