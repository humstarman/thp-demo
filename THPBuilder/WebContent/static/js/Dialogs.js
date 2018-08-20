/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new open dialog.
 */
var OpenDialog = function()
{
	var iframe = document.createElement('iframe');
	iframe.style.backgroundColor = 'transparent';
	iframe.allowTransparency = 'true';
	iframe.style.borderStyle = 'none';
	iframe.style.borderWidth = '0px';
	iframe.style.overflow = 'hidden';
	iframe.frameBorder = '0';
	
	// Adds padding as a workaround for box model in older IE versions
	var dx = (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8)) ? 20 : 0;
	
	iframe.setAttribute('width', (((Editor.useLocalStorage) ? 640 : 320) + dx) + 'px');
	iframe.setAttribute('height', (((Editor.useLocalStorage) ? 480 : 220) + dx) + 'px');
	iframe.setAttribute('src', OPEN_FORM);
	
	this.container = iframe;
};

/**
 * Constructs a new color dialog.
 */
var ColorDialog = function(editorUi, color, apply, cancelFn)
{
	this.editorUi = editorUi;
	
	var input = document.createElement('input');
	input.style.marginBottom = '10px';
	input.style.width = '216px';
	
	// Required for picker to render in IE
	if (mxClient.IS_IE)
	{
		input.style.marginTop = '10px';
		document.body.appendChild(input);
	}
	
	this.init = function()
	{
		if (!mxClient.IS_TOUCH)
		{
			input.focus();
		}
	};

	var picker = new jscolor.color(input);
	picker.pickerOnfocus = false;
	picker.showPicker();

	var div = document.createElement('div');
	jscolor.picker.box.style.position = 'relative';
	jscolor.picker.box.style.width = '230px';
	jscolor.picker.box.style.height = '100px';
	jscolor.picker.box.style.paddingBottom = '10px';
	div.appendChild(jscolor.picker.box);

	var center = document.createElement('center');
	
	function createRecentColorTable()
	{
		var table = addPresets((ColorDialog.recentColors.length == 0) ? ['FFFFFF'] :
					ColorDialog.recentColors, 11, 'FFFFFF', true);
		table.style.marginBottom = '8px';
		
		return table;
	};
	
	function addPresets(presets, rowLength, defaultColor, addResetOption)
	{
		rowLength = (rowLength != null) ? rowLength : 12;
		var table = document.createElement('table');
		table.style.borderCollapse = 'collapse';
		table.setAttribute('cellspacing', '0');
		table.style.marginBottom = '20px';
		table.style.cellSpacing = '0px';
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		var rows = presets.length / rowLength;
		
		for (var row = 0; row < rows; row++)
		{
			var tr = document.createElement('tr');
			
			for (var i = 0; i < rowLength; i++)
			{
				(function(clr)
				{
					var td = document.createElement('td');
					td.style.border = '1px solid black';
					td.style.padding = '0px';
					td.style.width = '16px';
					td.style.height = '16px';
					
					if (clr == null)
					{
						clr = defaultColor;
					}
					
					if (clr == 'none')
					{
						td.style.background = 'url(\'' + Dialog.prototype.noColorImage + '\')';
					}
					else
					{
						td.style.backgroundColor = '#' + clr;
					}
					
					tr.appendChild(td);

					if (clr != null)
					{
						td.style.cursor = 'pointer';
						
						mxEvent.addListener(td, 'click', function()
						{
							if (clr == 'none')
							{
								picker.fromString('ffffff');
								input.value = 'none';
							}
							else
							{
								picker.fromString(clr);
							}
						});
					}
				})(presets[row * rowLength + i]);
			}
			
			tbody.appendChild(tr);
		}
		
		if (addResetOption)
		{
			var td = document.createElement('td');
			td.setAttribute('title', mxResources.get('reset'));
			td.style.border = '1px solid black';
			td.style.padding = '0px';
			td.style.width = '16px';
			td.style.height = '16px';
			td.style.backgroundImage = 'url(\'' + Dialog.prototype.closeImage + '\')';
			td.style.backgroundPosition = 'center center';
			td.style.backgroundRepeat = 'no-repeat';
			td.style.cursor = 'pointer';
			
			tr.appendChild(td);

			mxEvent.addListener(td, 'click', function()
			{
				ColorDialog.resetRecentColors();
				table.parentNode.replaceChild(createRecentColorTable(), table);
			});
		}
		
		center.appendChild(table);
		
		return table;
	};

	div.appendChild(input);
	mxUtils.br(div);
	
	// Adds recent colors
	createRecentColorTable();
		
	// Adds presets
	var table = addPresets(this.presetColors);
	table.style.marginBottom = '8px';
	table = addPresets(this.defaultColors);
	table.style.marginBottom = '16px';

	div.appendChild(center);

	var buttons = document.createElement('div');
	buttons.style.textAlign = 'right';
	buttons.style.whiteSpace = 'nowrap';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}
	
	var applyFunction = (apply != null) ? apply : this.createApplyFunction();
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		var color = input.value;
		ColorDialog.addRecentColor(color, 12);
		
		if (color != 'none' && color.charAt(0) != '#')
		{
			color = '#' + color;
		}

		applyFunction(color);
		editorUi.hideDialog();
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	buttons.appendChild(applyBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}
	
	if (color != null)
	{
		if (color == 'none')
		{
			picker.fromString('ffffff');
			input.value = 'none';
		}
		else
		{
			picker.fromString(color);
		}
	}
	
	div.appendChild(buttons);
	this.picker = picker;
	this.colorInput = input;

	// LATER: Only fires if input if focused, should always
	// fire if this dialog is showing.
	mxEvent.addListener(div, 'keydown', function(e)
	{
		if (e.keyCode == 27)
		{
			editorUi.hideDialog();
			
			if (cancelFn != null)
			{
				cancelFn();
			}
			
			mxEvent.consume(e);
		}
	});
	
	this.container = div;
};

/**
 * Creates function to apply value
 */
ColorDialog.prototype.presetColors = ['E6D0DE', 'CDA2BE', 'B5739D', 'E1D5E7', 'C3ABD0', 'A680B8', 'D4E1F5', 'A9C4EB', '7EA6E0', 'D5E8D4', '9AC7BF', '67AB9F', 'D5E8D4', 'B9E0A5', '97D077', 'FFF2CC', 'FFE599', 'FFD966', 'FFF4C3', 'FFCE9F', 'FFB570', 'F8CECC', 'F19C99', 'EA6B66']; 

/**
 * Creates function to apply value
 */
ColorDialog.prototype.defaultColors = ['none', 'FFFFFF', 'E6E6E6', 'CCCCCC', 'B3B3B3', '999999', '808080', '666666', '4D4D4D', '333333', '1A1A1A', '000000', 'FFCCCC', 'FFE6CC', 'FFFFCC', 'E6FFCC', 'CCFFCC', 'CCFFE6', 'CCFFFF', 'CCE5FF', 'CCCCFF', 'E5CCFF', 'FFCCFF', 'FFCCE6',
		'FF9999', 'FFCC99', 'FFFF99', 'CCFF99', '99FF99', '99FFCC', '99FFFF', '99CCFF', '9999FF', 'CC99FF', 'FF99FF', 'FF99CC', 'FF6666', 'FFB366', 'FFFF66', 'B3FF66', '66FF66', '66FFB3', '66FFFF', '66B2FF', '6666FF', 'B266FF', 'FF66FF', 'FF66B3', 'FF3333', 'FF9933', 'FFFF33',
		'99FF33', '33FF33', '33FF99', '33FFFF', '3399FF', '3333FF', '9933FF', 'FF33FF', 'FF3399', 'FF0000', 'FF8000', 'FFFF00', '80FF00', '00FF00', '00FF80', '00FFFF', '007FFF', '0000FF', '7F00FF', 'FF00FF', 'FF0080', 'CC0000', 'CC6600', 'CCCC00', '66CC00', '00CC00', '00CC66',
		'00CCCC', '0066CC', '0000CC', '6600CC', 'CC00CC', 'CC0066', '990000', '994C00', '999900', '4D9900', '009900', '00994D', '009999', '004C99', '000099', '4C0099', '990099', '99004D', '660000', '663300', '666600', '336600', '006600', '006633', '006666', '003366', '000066',
		'330066', '660066', '660033', '330000', '331A00', '333300', '1A3300', '003300', '00331A', '003333', '001933', '000033', '190033', '330033', '33001A'];

/**
 * Creates function to apply value
 */
ColorDialog.prototype.createApplyFunction = function()
{
	return mxUtils.bind(this, function(color)
	{
		var graph = this.editorUi.editor.graph;
		
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(this.currentColorKey, color);
			this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [this.currentColorKey],
				'values', [color], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
};

/**
 * 
 */
ColorDialog.recentColors = [];

/**
 * Adds recent color for later use.
 */
ColorDialog.addRecentColor = function(color, max)
{
	if (color != null)
	{
		mxUtils.remove(color, ColorDialog.recentColors);
		ColorDialog.recentColors.splice(0, 0, color);
		
		if (ColorDialog.recentColors.length >= max)
		{
			ColorDialog.recentColors.pop();
		}
	}
};

/**
 * Adds recent color for later use.
 */
ColorDialog.resetRecentColors = function()
{
	ColorDialog.recentColors = [];
};

/**
 * Constructs a new about dialog.
 */
var AboutDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('about') + ' Scada');
	div.appendChild(h3);
	var img = document.createElement('img');
	img.style.border = '0px';
	img.setAttribute('width', '176');
	img.setAttribute('width', '151');
	img.setAttribute('src', IMAGE_PATH + '/logo.png');
	div.appendChild(img);
	mxUtils.br(div);
	mxUtils.write(div, 'Powered by THPower'); /// + mxClient.VERSION);
	mxUtils.br(div);
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.thpower.com/');
	link.setAttribute('target', '_blank');
	mxUtils.write(link, 'www.thpower.com');
	div.appendChild(link);
	mxUtils.br(div);
	mxUtils.br(div);
	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});
	closeBtn.className = 'geBtn gePrimaryBtn';
	div.appendChild(closeBtn);
	
	this.container = div;
};

/**
 * Constructs a new filename dialog.
 */
var FilenameDialog = function(editorUi, filename, buttonText, fn, label, validateFn, content, helpLink, closeOnBtn, cancelFn)
{
	closeOnBtn = (closeOnBtn != null) ? closeOnBtn : true;
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.style.marginTop = '8px';
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.whiteSpace = 'nowrap';
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	mxUtils.write(td, (label || mxResources.get('filename')) + ':');
	
	row.appendChild(td);
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', filename || '');
	nameInput.style.marginLeft = '4px';
	nameInput.style.width = '180px';
	
	var genericBtn = mxUtils.button(buttonText, function()
	{
		if (validateFn == null || validateFn(nameInput.value))
		{
			if (closeOnBtn)
			{
				editorUi.hideDialog();
			}
			
			var newValue = nameInput.value;
			
            renameMenu(newValue);
			
			fn(nameInput.value);
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	
	this.init = function()
	{
		if (label == null && content != null)
		{
			return;
		}
		
		nameInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			nameInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
		
		// Installs drag and drop handler for links
		if (Graph.fileSupport)
		{
			// Setup the dnd listeners
			var dlg = table.parentNode;
			var graph = editorUi.editor.graph;
			var dropElt = null;
				
			mxEvent.addListener(dlg, 'dragleave', function(evt)
			{
				if (dropElt != null)
			    {
					dropElt.style.backgroundColor = '';
			    	dropElt = null;
			    }
			    
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt)
			{
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
				{
					dropElt = nameInput;
					dropElt.style.backgroundColor = '#ebf2f9';
				}
				
				evt.stopPropagation();
				evt.preventDefault();
			}));
					
			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
			{
			    if (dropElt != null)
			    {
					dropElt.style.backgroundColor = '';
			    	dropElt = null;
			    }

			    if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
			    {
			    	nameInput.value = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
			    	genericBtn.click();
			    }

			    evt.stopPropagation();
			    evt.preventDefault();
			}));
		}
	};

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	if (label != null || content == null)
	{
		tbody.appendChild(row);
	}
	
	if (content != null)
	{
		row = document.createElement('tr');
		td = document.createElement('td');
		td.colSpan = 2;
		td.appendChild(content);
		row.appendChild(td);
		tbody.appendChild(row);
	}
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '10px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	if (helpLink != null)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			window.open(helpLink);
		});
		
		helpBtn.className = 'geBtn';	
		td.appendChild(helpBtn);
	}

	mxEvent.addListener(nameInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			genericBtn.click();
		}
	});
	
	td.appendChild(genericBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	
	this.container = table;
};

/**
 * Constructs a new textarea dialog.
 */
var TextareaDialog = function(editorUi, title, url, fn, cancelFn, cancelTitle, w, h, addButtons, noHide, noWrap, applyTitle)
{
	w = (w != null) ? w : 300;
	h = (h != null) ? h : 120;
	noHide = (noHide != null) ? noHide : false;
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, title);
	
	row.appendChild(td);
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');

	var nameInput = document.createElement('textarea');
	
	if (noWrap)
	{
		nameInput.setAttribute('wrap', 'off');
	}
	
	nameInput.setAttribute('spellcheck', 'false');
	nameInput.setAttribute('autocorrect', 'off');
	nameInput.setAttribute('autocomplete', 'off');
	nameInput.setAttribute('autocapitalize', 'off');
	
	mxUtils.write(nameInput, url || '');
	nameInput.style.resize = 'none';
	nameInput.style.width = w + 'px';
	nameInput.style.height = h + 'px';
	
	this.textarea = nameInput;

	this.init = function()
	{
		nameInput.focus();
		nameInput.scrollTop = 0;
	};

	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.style.paddingTop = '14px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');
	
	var cancelBtn = mxUtils.button(cancelTitle || mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	if (addButtons != null)
	{
		addButtons(td);
	}
	
	if (fn != null)
	{
		var genericBtn = mxUtils.button(applyTitle || mxResources.get('apply'), function()
		{
			if (!noHide)
			{
				editorUi.hideDialog();
			}
			
			fn(nameInput.value);
		});
		
		genericBtn.className = 'geBtn gePrimaryBtn';	
		td.appendChild(genericBtn);
	}
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new edit file dialog.
 */
var EditDiagramDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.style.textAlign = 'right';
	var textarea = document.createElement('textarea');
	textarea.setAttribute('wrap', 'off');
	textarea.setAttribute('spellcheck', 'false');
	textarea.setAttribute('autocorrect', 'off');
	textarea.setAttribute('autocomplete', 'off');
	textarea.setAttribute('autocapitalize', 'off');
	textarea.style.overflow = 'auto';
	textarea.style.resize = 'none';
	textarea.style.width = '600px';
	textarea.style.height = '370px';
	textarea.style.marginBottom = '16px';
	
	textarea.value = mxUtils.getPrettyXml(editorUi.editor.getGraphXml());
	div.appendChild(textarea);
	
	this.init = function()
	{
		textarea.focus();
	};
	
	// Enables dropping files
	if (Graph.fileSupport)
	{
		function handleDrop(evt)
		{
		    evt.stopPropagation();
		    evt.preventDefault();
		    
		    if (evt.dataTransfer.files.length > 0)
		    {
    			var file = evt.dataTransfer.files[0];
    			var reader = new FileReader();
				
				reader.onload = function(e)
				{
					textarea.value = e.target.result;
				};
				
				reader.readAsText(file);
    		}
		    else
		    {
		    	textarea.value = editorUi.extractGraphModelFromEvent(evt);
		    }
		};
		
		function handleDragOver(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();
		};

		// Setup the dnd listeners.
		textarea.addEventListener('dragover', handleDragOver, false);
		textarea.addEventListener('drop', handleDrop, false);
	}
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		div.appendChild(cancelBtn);
	}
	
	var select = document.createElement('select');
	select.style.width = '180px';
	select.className = 'geBtn';

	if (editorUi.editor.graph.isEnabled())
	{
		var replaceOption = document.createElement('option');
		replaceOption.setAttribute('value', 'replace');
		mxUtils.write(replaceOption, mxResources.get('replaceExistingDrawing'));
		select.appendChild(replaceOption);
	}

	var newOption = document.createElement('option');
	newOption.setAttribute('value', 'new');
	mxUtils.write(newOption, mxResources.get('openInNewWindow'));
	
	if (EditDiagramDialog.showNewWindowOption)
	{
		select.appendChild(newOption);
	}

	if (editorUi.editor.graph.isEnabled())
	{
		var importOption = document.createElement('option');
		importOption.setAttribute('value', 'import');
		mxUtils.write(importOption, mxResources.get('addToExistingDrawing'));
		select.appendChild(importOption);
	}

	div.appendChild(select);

	var okBtn = mxUtils.button(mxResources.get('ok'), function()
	{
		// Removes all illegal control characters before parsing
		var data = editorUi.editor.graph.zapGremlins(mxUtils.trim(textarea.value));
		var error = null;
		
		if (select.value == 'new')
		{
			window.openFile = new OpenFile(function()
			{
				editorUi.hideDialog();
				window.openFile = null;
			});
			
			window.openFile.setData(data, null);
			window.open(editorUi.getUrl());
		}
		else if (select.value == 'replace')
		{
			editorUi.editor.graph.model.beginUpdate();
			try
			{
				editorUi.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
				// LATER: Why is hideDialog between begin-/endUpdate faster?
				editorUi.hideDialog();
			}
			catch (e)
			{
				error = e;
			}
			finally
			{
				editorUi.editor.graph.model.endUpdate();				
			}
		}
		else if (select.value == 'import')
		{
			editorUi.editor.graph.model.beginUpdate();
			try
			{
				var doc = mxUtils.parseXml(data);
				var model = new mxGraphModel();
				var codec = new mxCodec(doc);
				codec.decode(doc.documentElement, model);
				
				var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
				editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(children));
				
				// LATER: Why is hideDialog between begin-/endUpdate faster?
				editorUi.hideDialog();
			}
			catch (e)
			{
				error = e;
			}
			finally
			{
				editorUi.editor.graph.model.endUpdate();				
			}
		}
			
		if (error != null)
		{
			mxUtils.alert(error.message);
		}
	});
	okBtn.className = 'geBtn gePrimaryBtn';
	div.appendChild(okBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		div.appendChild(cancelBtn);
	}

	this.container = div;
};

/**
 * 
 */
EditDiagramDialog.showNewWindowOption = true;

/**
 * Constructs a new export dialog.
 */
var ExportDialog = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	
	var width = Math.ceil(bounds.width / scale);
	var height = Math.ceil(bounds.height / scale);

	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.setAttribute('cellpadding', (mxClient.IS_SF) ? '0' : '2');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, mxResources.get('filename') + ':');
	
	row.appendChild(td);
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
	nameInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);
		
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('format') + ':');
	
	row.appendChild(td);
	
	var imageFormatSelect = document.createElement('select');
	imageFormatSelect.style.width = '180px';

	var pngOption = document.createElement('option');
	pngOption.setAttribute('value', 'png');
	mxUtils.write(pngOption, mxResources.get('formatPng'));
	imageFormatSelect.appendChild(pngOption);

	var gifOption = document.createElement('option');
	
	if (ExportDialog.showGifOption)
	{
		gifOption.setAttribute('value', 'gif');
		mxUtils.write(gifOption, mxResources.get('formatGif'));
		imageFormatSelect.appendChild(gifOption);
	}
	
	var jpgOption = document.createElement('option');
	jpgOption.setAttribute('value', 'jpg');
	mxUtils.write(jpgOption, mxResources.get('formatJpg'));
	imageFormatSelect.appendChild(jpgOption);

	var pdfOption = document.createElement('option');
	pdfOption.setAttribute('value', 'pdf');
	mxUtils.write(pdfOption, mxResources.get('formatPdf'));
	imageFormatSelect.appendChild(pdfOption);
	
	var svgOption = document.createElement('option');
	svgOption.setAttribute('value', 'svg');
	mxUtils.write(svgOption, mxResources.get('formatSvg'));
	imageFormatSelect.appendChild(svgOption);
	
	if (ExportDialog.showXmlOption)
	{
		var xmlOption = document.createElement('option');
		xmlOption.setAttribute('value', 'xml');
		mxUtils.write(xmlOption, mxResources.get('formatXml'));
		imageFormatSelect.appendChild(xmlOption);
	}

	td = document.createElement('td');
	td.appendChild(imageFormatSelect);
	row.appendChild(td);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('zoom') + ' (%):');
	
	row.appendChild(td);
	
	var zoomInput = document.createElement('input');
	zoomInput.setAttribute('type', 'number');
	zoomInput.setAttribute('value', '100');
	zoomInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(zoomInput);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('width') + ':');
	
	row.appendChild(td);
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('value', width);
	widthInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(widthInput);
	row.appendChild(td);

	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('height') + ':');
	
	row.appendChild(td);
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('value', height);
	heightInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(heightInput);
	row.appendChild(td);

	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('background') + ':');
	
	row.appendChild(td);
	
	var transparentCheckbox = document.createElement('input');
	transparentCheckbox.setAttribute('type', 'checkbox');
	transparentCheckbox.checked = graph.background == null || graph.background == mxConstants.NONE;

	td = document.createElement('td');
	td.appendChild(transparentCheckbox);
	mxUtils.write(td, mxResources.get('transparent'));
	
	row.appendChild(td);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('borderWidth') + ':');
	
	row.appendChild(td);
	
	var borderInput = document.createElement('input');
	borderInput.setAttribute('type', 'number');
	borderInput.setAttribute('value', ExportDialog.lastBorderValue);
	borderInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(borderInput);
	row.appendChild(td);

	tbody.appendChild(row);
	table.appendChild(tbody);
	
	// Handles changes in the export format
	function formatChanged()
	{
		var name = nameInput.value;
		var dot = name.lastIndexOf('.');
		
		if (dot > 0)
		{
			nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
		}
		else
		{
			nameInput.value = name + '.' + imageFormatSelect.value;
		}
		
		if (imageFormatSelect.value === 'xml')
		{
			zoomInput.setAttribute('disabled', 'true');
			widthInput.setAttribute('disabled', 'true');
			heightInput.setAttribute('disabled', 'true');
			borderInput.setAttribute('disabled', 'true');
		}
		else
		{
			zoomInput.removeAttribute('disabled');
			widthInput.removeAttribute('disabled');
			heightInput.removeAttribute('disabled');
			borderInput.removeAttribute('disabled');
		}
		
		if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg')
		{
			transparentCheckbox.removeAttribute('disabled');
		}
		else
		{
			transparentCheckbox.setAttribute('disabled', 'disabled');
		}
	};
	
	mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
	formatChanged();

	function checkValues()
	{
		if (widthInput.value * heightInput.value > MAX_AREA || widthInput.value <= 0)
		{
			widthInput.style.backgroundColor = 'red';
		}
		else
		{
			widthInput.style.backgroundColor = '';
		}
		
		if (widthInput.value * heightInput.value > MAX_AREA || heightInput.value <= 0)
		{
			heightInput.style.backgroundColor = 'red';
		}
		else
		{
			heightInput.style.backgroundColor = '';
		}
	};

	mxEvent.addListener(zoomInput, 'change', function()
	{
		var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
		zoomInput.value = parseFloat((s * 100).toFixed(2));
		
		if (width > 0)
		{
			widthInput.value = Math.floor(width * s);
			heightInput.value = Math.floor(height * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});

	mxEvent.addListener(widthInput, 'change', function()
	{
		var s = parseInt(widthInput.value) / width;
		
		if (s > 0)
		{
			zoomInput.value = parseFloat((s * 100).toFixed(2));
			heightInput.value = Math.floor(height * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});

	mxEvent.addListener(heightInput, 'change', function()
	{
		var s = parseInt(heightInput.value) / height;
		
		if (s > 0)
		{
			zoomInput.value = parseFloat((s * 100).toFixed(2));
			widthInput.value = Math.floor(width * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.setAttribute('align', 'right');
	td.style.paddingTop = '22px';
	td.colSpan = 2;
	
	var saveBtn = mxUtils.button(mxResources.get('export'), mxUtils.bind(this, function()
	{
		if (parseInt(zoomInput.value) <= 0)
		{
			mxUtils.alert(mxResources.get('drawingEmpty'));
		}
		else
		{
	    	var name = nameInput.value;
			var format = imageFormatSelect.value;
	    	var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
			var b = Math.max(0, parseInt(borderInput.value));
			var bg = graph.background;
			
			if ((format == 'svg' || format == 'png') && transparentCheckbox.checked)
			{
				bg = null;
			}
			else if (bg == null || bg == mxConstants.NONE)
			{
				bg = '#ffffff';
			}
			
			ExportDialog.lastBorderValue = b;
			ExportDialog.exportFile(editorUi, name, format, bg, s, b);
		}
	}));
	saveBtn.className = 'geBtn gePrimaryBtn';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
		td.appendChild(saveBtn);
	}
	else
	{
		td.appendChild(saveBtn);
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Remembers last value for border.
 */
ExportDialog.lastBorderValue = 0;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showGifOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showXmlOption = true;

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.exportFile = function(editorUi, name, format, bg, s, b)
{
	var graph = editorUi.editor.graph;
	
	if (format == 'xml')
	{
    	ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(editorUi.editor.getGraphXml()), name, format);
	}
    else if (format == 'svg')
	{
		ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(graph.getSvg(bg, s, b)), name, format);
	}
    else
    {
    	var bounds = graph.getGraphBounds();
    	
		// New image export
		var xmlDoc = mxUtils.createXmlDocument();
		var root = xmlDoc.createElement('output');
		xmlDoc.appendChild(root);
		
	    // Renders graph. Offset will be multiplied with state's scale when painting state.
		var xmlCanvas = new mxXmlCanvas2D(root);
		xmlCanvas.translate(Math.floor((b / s - bounds.x) / graph.view.scale),
			Math.floor((b / s - bounds.y) / graph.view.scale));
		xmlCanvas.scale(s / graph.view.scale);
		
		var imgExport = new mxImageExport()
	    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);
	    
		// Puts request data together
		var param = 'xml=' + encodeURIComponent(mxUtils.getXml(root));
		var w = Math.ceil(bounds.width * s / graph.view.scale + 2 * b);
		var h = Math.ceil(bounds.height * s / graph.view.scale + 2 * b);
		
		// Requests image if request is valid
		if (param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA)
		{
			editorUi.hideDialog();
			var req = new mxXmlRequest(EXPORT_URL, 'format=' + format +
				'&filename=' + encodeURIComponent(name) +
				'&bg=' + ((bg != null) ? bg : 'none') +
				'&w=' + w + '&h=' + h + '&' + param);
			req.simulate(document, '_blank');
		}
		else
		{
			mxUtils.alert(mxResources.get('drawingTooLarge'));
		}
	}
};

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.saveLocalFile = function(editorUi, data, filename, format)
{
	if (data.length < MAX_REQUEST_SIZE)
	{
		editorUi.hideDialog();
		var req = new mxXmlRequest(SAVE_URL, 'xml=' + encodeURIComponent(data) + '&filename=' +
			encodeURIComponent(filename) + '&format=' + format);
		req.simulate(document, '_blank');
	}
	else
	{
		mxUtils.alert(mxResources.get('drawingTooLarge'));
		mxUtils.popup(xml);
	}
};

/**
 * Constructs a new metadata dialog.
 */
var EditDataDialog = function(ui, cell)
{
	var div = document.createElement('div');
	var graph = ui.editor.graph;

	div.style.height = '310px';
	div.style.overflow = 'auto';
	
	var value = graph.getModel().getValue(cell);
	
	// Converts the value to an XML node
	if (!mxUtils.isNode(value))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}

	// Creates the dialog contents
	var form = new mxForm('properties');
	form.table.style.width = '100%';
	form.table.style.paddingRight = '20px';

	var attrs = value.attributes;
	var names = [];
	var texts = [];
	var count = 0;
	
	// FIXME: Fix remove button for quirks mode
	var addRemoveButton = function(text, name)
	{
		text.parentNode.style.marginRight = '12px';
		
		var removeAttr = document.createElement('a');
		var img = mxUtils.createImage(Dialog.prototype.closeImage);
		img.style.height = '9px';
		img.style.fontSize = '9px';
		img.style.marginBottom = (mxClient.IS_IE11) ? '-1px' : '5px';
		
		removeAttr.className = 'geButton';
		removeAttr.setAttribute('title', mxResources.get('delete'));
		removeAttr.style.margin = '0px';
		removeAttr.style.width = '14px';
		removeAttr.style.height = '14px';
		removeAttr.style.fontSize = '14px';
		removeAttr.style.cursor = 'pointer';
		removeAttr.style.marginLeft = '6px';
		removeAttr.appendChild(img);
		
		var removeAttrFn = (function(name)
		{
			return function()
			{
				var count = 0;
				
				for (var j = 0; j < names.length; j++)
				{
					if (names[j] == name)
					{
						texts[j] = null;
						form.table.deleteRow(count);
						
						break;
					}
					
					if (texts[j] != null)
					{
						count++;
					}
				}
			};
		})(name);
		
		mxEvent.addListener(removeAttr, 'click', removeAttrFn);
		
		text.parentNode.style.whiteSpace = 'nowrap';
		text.parentNode.appendChild(removeAttr);
	};
	
	var addTextArea = function(index, name, value)
	{
		names[index] = name;
		texts[index] = form.addTextarea(names[count] + ':', value, 2);
		texts[index].style.width = '100%';
		
		addRemoveButton(texts[index], name);
	};
	
	var temp = [];

	for (var i = 0; i < attrs.length; i++)
	{
		if (attrs[i].nodeName != 'label' && attrs[i].nodeName != 'placeholders')
		{
			temp.push({name: attrs[i].nodeName, value: attrs[i].nodeValue});
		}
	}
	
	// Sorts by name
	temp.sort(function(a, b)
	{
	    if (a.name < b.name)
	    {
	    	return -1;
	    }
	    else if (a.name > b.name)
	    {
	    	return 1;
	    }
	    else
	    {
	    	return 0;
	    }
	});
	
	for (var i = 0; i < temp.length; i++)
	{
		addTextArea(count, temp[i].name, temp[i].value);
		count++;
	}
	
	div.appendChild(form.table);

	var newProp = document.createElement('div');
	newProp.style.whiteSpace = 'nowrap';
	newProp.style.marginTop = '6px';

	var nameInput = document.createElement('input');
	nameInput.setAttribute('placeholder', mxResources.get('enterPropertyName'));
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('size', (mxClient.IS_IE || mxClient.IS_IE11) ? '18' : '22');
	nameInput.style.marginLeft = '2px';

	newProp.appendChild(nameInput);
	div.appendChild(newProp);
	
	var addBtn = mxUtils.button(mxResources.get('addProperty'), function()
	{
		var name = nameInput.value;

		// Avoid ':' in attribute names which seems to be valid in Chrome
		if (name.length > 0 && name != 'label' && name != 'placeholders' && name.indexOf(':') < 0)
		{
			try
			{
				var idx = mxUtils.indexOf(names, name);
				
				if (idx >= 0 && texts[idx] != null)
				{
					texts[idx].focus();
				}
				else
				{
					// Checks if the name is valid
					var clone = value.cloneNode(false);
					clone.setAttribute(name, '');
					
					if (idx >= 0)
					{
						names.splice(idx, 1);
						texts.splice(idx, 1);
					}

					names.push(name);
					var text = form.addTextarea(name + ':', '', 2);
					text.style.width = '100%';
					texts.push(text);
					addRemoveButton(text, name);

					text.focus();
				}

				nameInput.value = '';
			}
			catch (e)
			{
				mxUtils.alert(e);
			}
		}
		else
		{
			mxUtils.alert(mxResources.get('invalidName'));
		}
	});
	
	this.init = function()
	{
		if (texts.length > 0)
		{
			texts[0].focus();
		}
		else
		{
			nameInput.focus();
		}
	};
	
	addBtn.setAttribute('disabled', 'disabled');
	addBtn.style.marginLeft = '10px';
	addBtn.style.width = '144px';
	newProp.appendChild(addBtn);

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		ui.hideDialog.apply(ui, arguments);
	});
	cancelBtn.className = 'geBtn';
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		try
		{
			ui.hideDialog.apply(ui, arguments);
			
			// Clones and updates the value
			value = value.cloneNode(true);
			var removeLabel = false;
			
			for (var i = 0; i < names.length; i++)
			{
				if (texts[i] == null)
				{
					value.removeAttribute(names[i]);
				}
				else
				{
					value.setAttribute(names[i], texts[i].value);
					removeLabel = removeLabel || (names[i] == 'placeholder' &&
						value.getAttribute('placeholders') == '1');
				}
			}
			
			// Removes label if placeholder is assigned
			if (removeLabel)
			{
				value.removeAttribute('label');
			}
			
			// Updates the value of the cell (undoable)
			graph.getModel().setValue(cell, value);
		}
		catch (e)
		{
			mxUtils.alert(e);
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	
	function updateAddBtn()
	{
		if (nameInput.value.length > 0)
		{
			addBtn.removeAttribute('disabled');
		}
		else
		{
			addBtn.setAttribute('disabled', 'disabled');
		}
	};

	mxEvent.addListener(nameInput, 'keyup', updateAddBtn);
	
	// Catches all changes that don't fire a keyup (such as paste via mouse)
	mxEvent.addListener(nameInput, 'change', updateAddBtn);
	
	var buttons = document.createElement('div');
	buttons.style.marginTop = '18px';
	buttons.style.textAlign = 'right';
	
	if (ui.editor.graph.getModel().isVertex(cell) || ui.editor.graph.getModel().isEdge(cell))
	{
		var replace = document.createElement('span');
		replace.style.marginRight = '10px';
		var input = document.createElement('input');
		input.setAttribute('type', 'checkbox');
		input.style.marginRight = '6px';
		
		if (value.getAttribute('placeholders') == '1')
		{
			input.setAttribute('checked', 'checked');
			input.defaultChecked = true;
		}
	
		mxEvent.addListener(input, 'click', function()
		{
			if (value.getAttribute('placeholders') == '1')
			{
				value.removeAttribute('placeholders');
			}
			else
			{
				value.setAttribute('placeholders', '1');
			}
		});
		
		replace.appendChild(input);
		mxUtils.write(replace, mxResources.get('placeholders'));
		
		if (EditDataDialog.placeholderHelpLink != null)
		{
			var link = document.createElement('a');
			link.setAttribute('href', EditDataDialog.placeholderHelpLink);
			link.setAttribute('title', mxResources.get('help'));
			link.setAttribute('target', '_blank');
			link.style.marginLeft = '10px';
			link.style.cursor = 'help';
			
			var icon = document.createElement('img');
			icon.setAttribute('border', '0');
			icon.setAttribute('valign', 'middle');
			icon.style.marginTop = (mxClient.IS_IE11) ? '0px' : '-4px';
			icon.setAttribute('src', Editor.helpImage);
			link.appendChild(icon);
			
			replace.appendChild(link);
		}
		
		buttons.appendChild(replace);
	}
	
	if (ui.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(applyBtn);
	}
	else
	{
		buttons.appendChild(applyBtn);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;
};

/**
 * Optional help link.
 */
EditDataDialog.placeholderHelpLink = null;

/**
 * Constructs a new link dialog.
 */
var LinkDialog = function(editorUi, initialValue, btnLabel, fn)
{
	var div = document.createElement('div');
	mxUtils.write(div, mxResources.get('editLink') + ':');
	
	var inner = document.createElement('div');
	inner.className = 'geTitle';
	inner.style.backgroundColor = 'transparent';
	inner.style.borderColor = 'transparent';
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.cursor = 'default';
	
	if (!mxClient.IS_VML)
	{
		inner.style.paddingRight = '20px';
	}
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', initialValue);
	linkInput.setAttribute('placeholder', 'http://www.example.com/');
	linkInput.setAttribute('type', 'text');
	linkInput.style.marginTop = '6px';
	linkInput.style.width = '400px';
	linkInput.style.backgroundImage = 'url(\'' + Dialog.prototype.clearImage + '\')';
	linkInput.style.backgroundRepeat = 'no-repeat';
	linkInput.style.backgroundPosition = '100% 50%';
	linkInput.style.paddingRight = '14px';
	
	var cross = document.createElement('div');
	cross.setAttribute('title', mxResources.get('reset'));
	cross.style.position = 'relative';
	cross.style.left = '-16px';
	cross.style.width = '12px';
	cross.style.height = '14px';
	cross.style.cursor = 'pointer';

	// Workaround for inline-block not supported in IE
	cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
	cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';
	
	// Needed to block event transparency in IE
	cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';

	mxEvent.addListener(cross, 'click', function()
	{
		linkInput.value = '';
		linkInput.focus();
	});
	
	inner.appendChild(linkInput);
	inner.appendChild(cross);
	div.appendChild(inner);
	
	this.init = function()
	{
		linkInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			linkInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};
	
	var btns = document.createElement('div');
	btns.style.marginTop = '18px';
	btns.style.textAlign = 'right';

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			editorUi.hideDialog();
			fn(linkInput.value);
		}
	});

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	var mainBtn = mxUtils.button(btnLabel, function()
	{
		editorUi.hideDialog();
		fn(linkInput.value);
	});
	mainBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(mainBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * 
 */
var OutlineWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;
	
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width = '100%';
	div.style.height = '100%';
	div.style.border = '1px solid whiteSmoke';
	div.style.overflow = 'hidden';

	this.window = new mxWindow(mxResources.get('outline'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	this.window.setLocation = function(x, y)
	{
		var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		
		x = Math.max(0, Math.min(x, iw - this.table.clientWidth));
		y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48));

		if (this.getX() != x || this.getY() != y)
		{
			mxWindow.prototype.setLocation.apply(this, arguments);
		}
	};
	
	mxEvent.addListener(window, 'resize', mxUtils.bind(this, function()
	{
		var x = this.window.getX();
		var y = this.window.getY();
		
		this.window.setLocation(x, y);
	}));

	var outline = editorUi.createOutline(this.window);

	this.window.addListener(mxEvent.RESIZE, mxUtils.bind(this, function()
   	{
		outline.update(false);
		outline.outline.sizeDidChange();
   	}));
	
	this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
	{
		outline.suspended = false;
		outline.outline.refresh();
		outline.update();
	}));
	
	this.window.addListener(mxEvent.HIDE, mxUtils.bind(this, function()
	{
		outline.suspended = true;
	}));
	
	this.window.addListener(mxEvent.NORMALIZE, mxUtils.bind(this, function()
	{
		outline.suspended = false;
		outline.update();
	}));
			
	this.window.addListener(mxEvent.MINIMIZE, mxUtils.bind(this, function()
	{
		outline.suspended = true;
	}));

	var outlineCreateGraph = outline.createGraph;
	outline.createGraph = function(container)
	{
		var g = outlineCreateGraph.apply(this, arguments);
		g.gridEnabled = false;
		g.pageScale = graph.pageScale;
		g.pageFormat = graph.pageFormat;
		g.background = graph.background;
		g.pageVisible = graph.pageVisible;
		
		var current = mxUtils.getCurrentStyle(graph.container);
		div.style.backgroundColor = current.backgroundColor;
		
		return g;
	};
	
	function update()
	{
		outline.outline.pageScale = graph.pageScale;
		outline.outline.pageFormat = graph.pageFormat;
		outline.outline.pageVisible = graph.pageVisible;
		outline.outline.background = graph.background;
		
		var current = mxUtils.getCurrentStyle(graph.container);
		div.style.backgroundColor = current.backgroundColor;
		
		if (graph.view.backgroundPageShape != null && outline.outline.view.backgroundPageShape != null)
		{
			outline.outline.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
		}
		
		outline.outline.refresh();
	};

	outline.init(div);

	editorUi.editor.addListener('resetGraphView', update);
	editorUi.addListener('pageFormatChanged', update);
	editorUi.addListener('backgroundColorChanged', update);
	editorUi.addListener('backgroundImageChanged', update);
	editorUi.addListener('pageViewChanged', function()
	{
		update();
		outline.update(true);
	});
	
	if (outline.outline.dialect == mxConstants.DIALECT_SVG)
	{
		var zoomInAction = editorUi.actions.get('zoomIn');
		var zoomOutAction = editorUi.actions.get('zoomOut');
		
		mxEvent.addMouseWheelListener(function(evt, up)
		{
			var outlineWheel = false;
			var source = mxEvent.getSource(evt);
	
			while (source != null)
			{
				if (source == outline.outline.view.canvas.ownerSVGElement)
				{
					outlineWheel = true;
					break;
				}
	
				source = source.parentNode;
			}
	
			if (outlineWheel)
			{
				if (up)
				{
					zoomInAction.funct();
				}
				else
				{
					zoomOutAction.funct();
				}
	
				mxEvent.consume(evt);
			}
		});
	}
};

/**
 * 
 */
var LayersWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;
	
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.background = 'whiteSmoke';
	div.style.border = '1px solid whiteSmoke';
	div.style.height = '100%';
	div.style.marginBottom = '10px';
	div.style.overflow = 'auto';

	var tbarHeight = (!EditorUi.compactUi) ? '30px' : '26px';
	
	var listDiv = document.createElement('div')
	listDiv.style.backgroundColor = '#e5e5e5';
	listDiv.style.position = 'absolute';
	listDiv.style.overflow = 'auto';
	listDiv.style.left = '0px';
	listDiv.style.right = '0px';
	listDiv.style.top = '0px';
	listDiv.style.bottom = (parseInt(tbarHeight) + 7) + 'px';
	div.appendChild(listDiv);
	
	var dragSource = null;
	var dropIndex = null;
	
	mxEvent.addListener(div, 'dragover', function(evt)
	{
		evt.dataTransfer.dropEffect = 'move';
		dropIndex = 0;
		evt.stopPropagation();
		evt.preventDefault();
	});
	
	// Workaround for "no element found" error in FF
	mxEvent.addListener(div, 'drop', function(evt)
	{
		evt.stopPropagation();
		evt.preventDefault();
	});

	var layerCount = null;
	var selectionLayer = null;
	
	var ldiv = document.createElement('div');
	
	ldiv.className = 'geToolbarContainer';
	ldiv.style.position = 'absolute';
	ldiv.style.bottom = '0px';
	ldiv.style.left = '0px';
	ldiv.style.right = '0px';
	ldiv.style.height = tbarHeight;
	ldiv.style.overflow = 'hidden';
	ldiv.style.padding = (!EditorUi.compactUi) ? '1px' : '4px 0px 3px 0px';
	ldiv.style.backgroundColor = 'whiteSmoke';
	ldiv.style.borderWidth = '1px 0px 0px 0px';
	ldiv.style.borderColor = '#c3c3c3';
	ldiv.style.borderStyle = 'solid';
	ldiv.style.display = 'block';
	ldiv.style.whiteSpace = 'nowrap';
	
	if (mxClient.IS_QUIRKS)
	{
		ldiv.style.filter = 'none';
	}
	
	var link = document.createElement('a');
	link.className = 'geButton';
	
	if (mxClient.IS_QUIRKS)
	{
		link.style.filter = 'none';
	}
	
	var removeLink = link.cloneNode();
	removeLink.innerHTML = '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>';

	mxEvent.addListener(removeLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			graph.model.beginUpdate();
			try
			{
				var index = graph.model.root.getIndex(selectionLayer);
				graph.removeCells([selectionLayer], false);
				
				// Creates default layer if no layer exists
				if (graph.model.getChildCount(graph.model.root) == 0)
				{
					graph.model.add(graph.model.root, new mxCell());
					graph.setDefaultParent(null);
				}
				else if (index > 0 && index <= graph.model.getChildCount(graph.model.root))
				{
					graph.setDefaultParent(graph.model.getChildAt(graph.model.root, index - 1));
				}
				else
				{
					graph.setDefaultParent(null);
				}
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		removeLink.className = 'geButton mxDisabled';
	}
	
	ldiv.appendChild(removeLink);

	var insertLink = link.cloneNode();
	insertLink.innerHTML = '<div class="geSprite geSprite-insert" style="display:inline-block;"></div>';
	
	mxEvent.addListener(insertLink, 'click', function(evt)
	{
		if (graph.isEnabled() && !graph.isSelectionEmpty())
		{
			graph.moveCells(graph.getSelectionCells(), 0, 0, false, selectionLayer);
		}
	});

	ldiv.appendChild(insertLink);
	
	var renameLink = link.cloneNode();
	renameLink.innerHTML = '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>';
	renameLink.setAttribute('title', mxResources.get('rename'));
	
	function renameLayer(layer)
	{
		if (graph.isEnabled() && layer != null)
		{
			var dlg = new FilenameDialog(editorUi, layer.value || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function(newValue)
			{
				if (newValue != null)
				{
					graph.getModel().setValue(layer, newValue);
				}
			}), mxResources.get('enterName'));
			editorUi.showDialog(dlg.container, 300, 100, true, true);
			dlg.init();
		}
	};
	
	mxEvent.addListener(renameLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			renameLayer(selectionLayer);
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		renameLink.className = 'geButton mxDisabled';
	}
	
	ldiv.appendChild(renameLink);
	
	var duplicateLink = link.cloneNode();
	duplicateLink.innerHTML = '<div class="geSprite geSprite-duplicate" style="display:inline-block;"></div>';
	
	mxEvent.addListener(duplicateLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			var newCell = null;
			graph.model.beginUpdate();
			try
			{
				newCell = graph.cloneCells([selectionLayer])[0];
				newCell.value = mxResources.get('untitledLayer');
				newCell.setVisible(true);
				newCell = graph.addCell(newCell, graph.model.root);
				graph.setDefaultParent(newCell);
			}
			finally
			{
				graph.model.endUpdate();
			}

			if (newCell != null && !graph.isCellLocked(newCell))
			{
				graph.selectAll(newCell);
			}
		}
	});
	
	if (!graph.isEnabled())
	{
		duplicateLink.className = 'geButton mxDisabled';
	}

	ldiv.appendChild(duplicateLink);

	var addLink = link.cloneNode();
	addLink.innerHTML = '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>';
	addLink.setAttribute('title', mxResources.get('addLayer'));
	
	mxEvent.addListener(addLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			graph.model.beginUpdate();
			
			try
			{
				var cell = graph.addCell(new mxCell(mxResources.get('untitledLayer')), graph.model.root);
				graph.setDefaultParent(cell);
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		addLink.className = 'geButton mxDisabled';
	}
	
	ldiv.appendChild(addLink);

	div.appendChild(ldiv);	
	
	function refresh()
	{
		layerCount = graph.model.getChildCount(graph.model.root)
		listDiv.innerHTML = '';

		function addLayer(index, label, child, defaultParent)
		{
			var ldiv = document.createElement('div');
			ldiv.className = 'geToolbarContainer';

			ldiv.style.overflow = 'hidden';
			ldiv.style.position = 'relative';
			ldiv.style.padding = '4px';
			ldiv.style.height = '22px';
			ldiv.style.display = 'block';
			ldiv.style.backgroundColor = 'whiteSmoke';
			ldiv.style.borderWidth = '0px 0px 1px 0px';
			ldiv.style.borderColor = '#c3c3c3';
			ldiv.style.borderStyle = 'solid';
			ldiv.style.whiteSpace = 'nowrap';
			
			var left = document.createElement('div');
			left.style.display = 'inline-block';
			left.style.width = '100%';
			left.style.textOverflow = 'ellipsis';
			left.style.overflow = 'hidden';
			
			mxEvent.addListener(ldiv, 'dragover', function(evt)
			{
				evt.dataTransfer.dropEffect = 'move';
				dropIndex = index;
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(ldiv, 'dragstart', function(evt)
			{
				dragSource = ldiv;
				
				// Workaround for no DnD on DIV in FF
				if (mxClient.IS_FF)
				{
					// LATER: Check what triggers a parse as XML on this in FF after drop
					evt.dataTransfer.setData('Text', '<layer/>');
				}
			});
			
			mxEvent.addListener(ldiv, 'dragend', function(evt)
			{
				if (dragSource != null && dropIndex != null)
				{
					graph.addCell(child, graph.model.root, dropIndex);
				}

				dragSource = null;
				dropIndex = null;
				evt.stopPropagation();
				evt.preventDefault();
			});

			var btn = document.createElement('img');
			btn.setAttribute('draggable', 'false');
			btn.setAttribute('align', 'top');
			btn.setAttribute('border', '0');
			btn.style.cursor = 'pointer';
			btn.style.padding = '4px';
			btn.setAttribute('title', mxResources.get('lockUnlock'));

			var state = graph.view.getState(child);
    		var style = (state != null) ? state.style : graph.getCellStyle(child);

			if (mxUtils.getValue(style, 'locked', '0') == '1')
			{
				btn.setAttribute('src', Dialog.prototype.lockedImage);
			}
			else
			{
				btn.setAttribute('src', Dialog.prototype.unlockedImage);
			}
			
			mxEvent.addListener(btn, 'click', function(evt)
			{
				if (graph.isEnabled())
				{
					var value = null;
					graph.getModel().beginUpdate();
					try
					{
			    		value = (mxUtils.getValue(style, 'locked', '0') == '1') ? null : '1';
			    		graph.setCellStyles('locked', value, [child]);
					}
					finally
					{
						graph.getModel().endUpdate();
					}

					if (value == '1')
					{
						graph.removeSelectionCells(graph.getModel().getDescendants(child));
					}
					
					mxEvent.consume(evt);
				}
			});

			left.appendChild(btn);

			var inp = document.createElement('input');
			inp.setAttribute('type', 'checkbox');
			inp.setAttribute('title', mxResources.get('hideIt', [child.value || mxResources.get('background')]));
			inp.style.marginLeft = '4px';
			inp.style.marginRight = '6px';
			inp.style.marginTop = '4px';
			left.appendChild(inp);
			
			if (!graph.isEnabled())
			{
				inp.setAttribute('disabled', 'disabled');
			}

			if (graph.model.isVisible(child))
			{
				inp.setAttribute('checked', 'checked');
				inp.defaultChecked = true;
			}

			mxEvent.addListener(inp, 'click', function(evt)
			{
				if (graph.isEnabled())
				{
					graph.model.setVisible(child, !graph.model.isVisible(child));
					mxEvent.consume(evt);
				}
			});

			mxUtils.write(left, label);
			ldiv.appendChild(left);
			
			if (graph.isEnabled())
			{
				// Fallback if no drag and drop is available
				if (mxClient.IS_TOUCH || mxClient.IS_POINTER || mxClient.IS_VML ||
					(mxClient.IS_IE && document.documentMode < 10))
				{
					var right = document.createElement('div');
					right.style.display = 'block';
					right.style.textAlign = 'right';
					right.style.whiteSpace = 'nowrap';
					right.style.position = 'absolute';
					right.style.right = '6px';
					right.style.top = '6px';
		
					// Poor man's change layer order
					if (index > 0)
					{
						var img2 = document.createElement('a');
						
						img2.setAttribute('title', mxResources.get('toBack'));
						
						img2.className = 'geButton';
						img2.style.cssFloat = 'none';
						img2.innerHTML = '&#9660;';
						img2.style.width = '14px';
						img2.style.height = '14px';
						img2.style.fontSize = '14px';
						img2.style.margin = '0px';
						img2.style.marginTop = '-1px';
						right.appendChild(img2);
						
						mxEvent.addListener(img2, 'click', function(evt)
						{
							if (graph.isEnabled())
							{
								graph.addCell(child, graph.model.root, index - 1);
							}
							
							mxEvent.consume(evt);
						});
					}
		
					if (index >= 0 && index < layerCount - 1)
					{
						var img1 = document.createElement('a');
						
						img1.setAttribute('title', mxResources.get('toFront'));
						
						img1.className = 'geButton';
						img1.style.cssFloat = 'none';
						img1.innerHTML = '&#9650;';
						img1.style.width = '14px';
						img1.style.height = '14px';
						img1.style.fontSize = '14px';
						img1.style.margin = '0px';
						img1.style.marginTop = '-1px';
						right.appendChild(img1);
						
						mxEvent.addListener(img1, 'click', function(evt)
						{
							if (graph.isEnabled())
							{
								graph.addCell(child, graph.model.root, index + 1);
							}
							
							mxEvent.consume(evt);
						});
					}
					
					ldiv.appendChild(right);
				}
				
				if (mxClient.IS_SVG && (!mxClient.IS_IE || document.documentMode >= 10))
				{
					ldiv.setAttribute('draggable', 'true');
					ldiv.style.cursor = 'move';
				}
			}

			mxEvent.addListener(ldiv, 'dblclick', function(evt)
			{
				var nodeName = mxEvent.getSource(evt).nodeName;
				
				if (nodeName != 'INPUT' && nodeName != 'IMG')
				{
					renameLayer(child);
					mxEvent.consume(evt);
				}
			});

			if (graph.getDefaultParent() == child)
			{
				ldiv.style.background = '#e6eff8';
				ldiv.style.fontWeight = 'bold';
				selectionLayer = child;
			}
			else
			{
				mxEvent.addListener(ldiv, 'click', function(evt)
				{
					if (graph.isEnabled())
					{
						graph.setDefaultParent(defaultParent);
						graph.view.setCurrentRoot(null);
						refresh();
					}
				});
			}
			
			listDiv.appendChild(ldiv);
		};
		
		// Cannot be moved or deleted
		for (var i = layerCount - 1; i >= 0; i--)
		{
			(mxUtils.bind(this, function(child)
			{
				addLayer(i, child.value || mxResources.get('background'), child, child);
			}))(graph.model.getChildAt(graph.model.root, i));
		}
		
		removeLink.setAttribute('title', mxResources.get('removeIt', [selectionLayer.value || mxResources.get('background')]));
		insertLink.setAttribute('title', mxResources.get('moveSelectionTo', [selectionLayer.value || mxResources.get('background')]));
		duplicateLink.setAttribute('title', mxResources.get('duplicateIt', [selectionLayer.value || mxResources.get('background')]));
		renameLink.setAttribute('title', mxResources.get('renameIt', [selectionLayer.value || mxResources.get('background')]));
		
		if (graph.isSelectionEmpty())
		{
			insertLink.className = 'geButton mxDisabled';
		}
	};

	refresh();
	graph.model.addListener(mxEvent.CHANGE, function()
	{
		refresh();
	});

	graph.selectionModel.addListener(mxEvent.CHANGE, function()
	{
		if (graph.isSelectionEmpty())
		{
			insertLink.className = 'geButton mxDisabled';
		}
		else
		{
			insertLink.className = 'geButton';
		}
	});

	this.window = new mxWindow(mxResources.get('layers'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	// Make refresh available via instance
	this.refreshLayers = refresh;
	
	this.window.setLocation = function(x, y)
	{
		var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		
		x = Math.max(0, Math.min(x, iw - this.table.clientWidth));
		y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48));

		if (this.getX() != x || this.getY() != y)
		{
			mxWindow.prototype.setLocation.apply(this, arguments);
		}
	};
	
	mxEvent.addListener(window, 'resize', mxUtils.bind(this, function()
	{
		var x = this.window.getX();
		var y = this.window.getY();
		
		this.window.setLocation(x, y);
	}));
};






/**
 * Added by wugh
 * Constructs a new open simulation dialog ver2
 */
var OpensimuDialogv2 = function(editorUi,type)
{
	var targetid = 0;
	var fdiv = document.createElement('div');
	var div = document.createElement('div');
	div.id = 'simucontent';
	div.style.overflow = 'auto';
	div.style.float = 'left';
	div.style.width = '70%';
	div.style.height = '340px';
	div.style.marginBottom = '16px';
	div.style.border = '2px solid #eee';
	var tempthis = editorUi;
	var this_ = this;
	var setsync = $.ajaxSettings.async;
	var html = '';
	var sidebar = '';
	var pagesize = 1024;
	var targetid = 0;


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


	var width50percentdiv = document.createElement('div');
	width50percentdiv.style.width = '50%';
/*	if (setsync) {
		$.ajaxSettings.async = false;
	}*/
	$.get("/data/simulation/item/count/", {}, function(result) {
		if (result.success == true) {
			pagesize = result.data.all;
		} else {
			html += '<p>获取仿真数量失败</p>';
			div.innerHTML = html;
			$.ajaxSettings.async = setsync;
			return div;
		}
	});
	$.ajaxSettings.async = true;
	var titileh3 = document.createElement('h3');
	mxUtils.write(titileh3,mxResources.get('OpenASimulation'));
	var navigation_div = document.createElement('div');
	var mysimu_div = document.createElement('div');
	var sidebar_div = document.createElement('div');
	var simucontent_div = document.createElement('div');
	var simumarket_div = document.createElement('div');
	var simumarket = document.createElement('div');
	fdiv.appendChild(titileh3);
	fdiv.appendChild(navigation_div);
	mysimu_div.appendChild(sidebar_div);
	mysimu_div.appendChild(simucontent_div);
	//var width50percentdivcp = width50percentdiv.cloneNode(false);
	//mysimu_div.appendChild(width50percentdivcp);
	simumarket_div.appendChild(simumarket);
	//var width50percentdivcp2 = width50percentdiv.cloneNode(false);
	//simumarket_div.appendChild(width50percentdivcp2);
	simumarket_div.style.width = '100%';
	fdiv.appendChild(simumarket_div);
	fdiv.appendChild(mysimu_div);

	//navigation
	navigation_div.style.height = '35px';
	var nav_mysimu = document.createElement('div');
	nav_mysimu.style.display = 'inline';
	nav_mysimu.style.background = 'transparent!important';
	nav_mysimu.style.padding = '16px 4px 10px 4px';
	nav_mysimu.style.margin = '-2px 0px';
	nav_mysimu.className = 'dia-tab-hover';
		var mySimu_tab_div = document.createElement('div');
		mySimu_tab_div.style.display = 'inline-block';
		mySimu_tab_div.style.fontSize = '14px' ;
		mySimu_tab_div.style.verticalAlign = 'middle' ;
		mySimu_tab_div.style.cursor = 'pointer' ;
		mySimu_tab_div.id = 'mySimu_tab';
		mySimu_tab_div.className = 'active-dia-tab';
		var simuPform_tab_div = mySimu_tab_div.cloneNode(false);
		simuPform_tab_div.id = 'simuPform_tab';
		simuPform_tab_div.className = 'unactive-dia-tab';
		mxUtils.write(mySimu_tab_div,mxResources.get('MySimulations'));
		mxUtils.write(simuPform_tab_div,mxResources.get('SimulationPlatform'));
	var nav_simumk = nav_mysimu.cloneNode(false);
	nav_simumk.className = '';
	nav_simumk.style.margin = '-2px 12px';
	nav_mysimu.appendChild(mySimu_tab_div);
	nav_simumk.appendChild(simuPform_tab_div);
	navigation_div.appendChild(nav_mysimu);
	navigation_div.appendChild(nav_simumk);


	var searchdiv = document.createElement('div');
	searchdiv.style.float = 'right';
	searchdiv.width = '30%';
	var searchinput = document.createElement('input');
	searchinput.setAttribute('placeholder', 'Find');
	searchinput.setAttribute('type', 'text');
	searchinput.setAttribute('id','searchele');
	searchinput.style.fontSize = '12px';
	searchinput.style.overflow = 'hidden';
	searchinput.style.boxSizing = 'border-box';
	searchinput.style.border = 'solid 1px #d5d5d5';
	searchinput.style.borderRadius = '4px';
	searchinput.style.width = '90%';
	searchinput.style.outline = 'none';
	searchinput.style.padding = '6px';
	searchinput.style.paddingRight = '20px'
	var searchimg = document.createElement('img');
	var searchimage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/search.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEaSURBVHjabNGxS5VxFIfxz71XaWuQUJCG/gCHhgTD9VpEETg4aMOlQRp0EoezObgcd220KQiXmpretTAHQRBdojlQEJyukPdt+b1ywfvAGc7wnHP4nlZd1yKijQW8xzNc4Su+ZOYfQ3T6/f4YNvEJYzjELXp4VVXVz263+7cR2niBxAFeZ2YPi3iHR/gYERPDwhpOsd6sz8x/mfkNG3iOlWFhFj8y89J9KvzGXER0GuEaD42mgwHqUtoljbcRsTBCeINpfM/MgZLKPpaxFxGbOCqDXmILN7hoJrTKH+axhxmcYRxP0MIDnOBDZv5q1XUNIuJxifJp+UNV7t7BFM6xeic0RMQ4Bpl5W/ol7GISx/eEUUTECrbx+f8A8xhiZht9zsgAAAAASUVORK5CYII=';
	searchimg.setAttribute('src',searchimage);
	searchimg.setAttribute('title', mxResources.get('search'));
	searchimg.style.position = 'relative';
	searchimg.style.left = '-20px';

	searchdiv.appendChild(searchinput);
	searchdiv.appendChild(searchimg);
	navigation_div.appendChild(searchdiv);


	//listerner
	mxEvent.addListener(nav_mysimu, 'click', mxUtils.bind(this, function(){
			if(simumarket.style.display == 'none'){
				return;
			}
			simumarket.style.display = 'none';
			mysimu_div.style.display = '';
			mySimu_tab_div.className = 'active-dia-tab';
			simuPform_tab_div.className = 'unactive-dia-tab';
			nav_mysimu.className = 'dia-tab-hover';
			nav_simumk.className = '';
			$('#target_open').addClass('disabled');
			$('#target_open_simu').addClass('disabled');
			$('#target_open_new_simu').addClass('disabled');

	}));
	mxEvent.addListener(nav_simumk, 'click', mxUtils.bind(this, function(){
			if(mysimu_div.style.display == 'none'){
				return;
			}
			simumarket.style.display = '';
			mysimu_div.style.display = 'none';
			mySimu_tab_div.className = 'unactive-dia-tab';
			simuPform_tab_div.className = 'active-dia-tab';
			nav_simumk.className = 'dia-tab-hover';
			nav_mysimu.className = '';
			$('#target_open').addClass('disabled');
			$('#target_open_simu').addClass('disabled');
			$('#target_open_new_simu').addClass('disabled');

	}));
	$(mySimu_tab_div).mouseover(function(){
		if(mySimu_tab_div.className != 'unactive-dia-tab'){
			return;
		}
		$(mySimu_tab_div).parent().addClass('dia-tab-hover');
	});
	$(mySimu_tab_div).mouseout(function(){
		if(mySimu_tab_div.className != 'unactive-dia-tab'){
			return;
		}
		$(mySimu_tab_div).parent().removeClass('dia-tab-hover');
	});
	$(simuPform_tab_div).mouseover(function(){
		if(simuPform_tab_div.className != 'unactive-dia-tab'){
			return;
		}
		$(simuPform_tab_div).parent().addClass('dia-tab-hover');
	});
	$(simuPform_tab_div).mouseout(function(){
		if(simuPform_tab_div.className != 'unactive-dia-tab'){
			return;
		}
		$(simuPform_tab_div).parent().removeClass('dia-tab-hover');
	});




	//mysimu_div
	mysimu_div.style.display = 'block';
	mysimu_div.id = 'mysimu';

	sidebar_div.style.float = 'left';
	sidebar_div.style.width = '20%';
	var sidebar_project_bar = document.createElement('div');
	sidebar_project_bar.className = 'sidebar project-bar';
	var menu_div = document.createElement('div');
	menu_div.style.overflow = 'auto';
	menu_div.style.height = '300px';
	menu_div.width = '90%';
	var folder_ul_div = document.createElement('ul');
	folder_ul_div.style.display = 'block';
	folder_ul_div.className = 'sidebar-dropdown';
	//folder_ul_div.style.position = 'relative';
	sidebar_div.appendChild(sidebar_project_bar);
	sidebar_project_bar.appendChild(menu_div);
	menu_div.appendChild(folder_ul_div);

	simucontent_div.id = 'simucontent';
	simucontent_div.style.overflow = 'auto';
	simucontent_div.style.float = 'left';
	simucontent_div.style.width = '30%';
	simucontent_div.style.height = '340px';
	simucontent_div.style.marginBottom = '16px';
	simucontent_div.style.border = '2px solid rgb(238, 238, 238)';
	var simucontent_table = document.createElement('table');
	var simucontent_table_thead = document.createElement('thead');
	var simucontent_table_thead_tr = document.createElement('tr');
	var simucontent_table_tbody = document.createElement('tbody');
	simucontent_table.setAttribute('rules', 'rows');
	simucontent_table.style.width = '100%';
	simucontent_table_thead_tr.style.height = '30px';
	simucontent_table_thead_tr.style.background = '#fafafa';
	simucontent_table_thead_tr.innerHTML = '<td>'+mxResources.get('Name') +'</td>';
	simucontent_table_thead.appendChild(simucontent_table_thead_tr);
	simucontent_table.appendChild(simucontent_table_thead);
	simucontent_table.appendChild(simucontent_table_tbody);
	simucontent_div.appendChild(simucontent_table);




	//simumarket
	simumarket.id = 'simumarket';
	simumarket.style.overflow = 'auto';
	simumarket.style.float = 'left';
	simumarket.style.width = '50%';
	simumarket.style.height = '340px';
	simumarket.style.marginBottom = '16px';
	simumarket.style.border = '2px solid rgb(238, 238, 238)';
	simumarket.style.display = 'none';
	var simumarket_table = document.createElement('table');
	var simumarket_table_thead = document.createElement('thead');
	var simumarket_table_thead_tr = document.createElement('tr');
	var simumarket_table_tbody = document.createElement('tbody');
	simumarket_table.setAttribute('rules', 'rows');
	simumarket_table.style.width = '100%';
	simumarket_table_thead_tr.style.height = '30px';
	simumarket_table_thead_tr.style.background = '#fafafa';
	simumarket_table_thead_tr.innerHTML = '<td>'+mxResources.get('Name') +'</td><td>'+mxResources.get('Owner') +'</td>';
	simumarket_table_thead.appendChild(simumarket_table_thead_tr);
	simumarket_table.appendChild(simumarket_table_thead);
	simumarket_table.appendChild(simumarket_table_tbody);
	simumarket.appendChild(simumarket_table);


	//searchlistenner
	searchinput.addEventListener("input", function(e){
		//console.log(this.value);
		search(simucontent_table,this);
		search(simumarket_table,this);
		function search(table,input)
		{
			var oTab=table;
			var oBt=input;
			$(table).find('tr:gt(0)').css('display','none');
			//$('#listTable tr:gt(0)').css('display','none');
			for(var i=0;i<oTab.tBodies[0].rows.length;i++)
			{
			var str1=oTab.tBodies[0].rows[i].cells[0].innerHTML.toUpperCase();
			var str2=oBt.value.toUpperCase();
			//使用string.toUpperCase()(将字符串中的字符全部转换成大写)或string.toLowerCase()(将字符串中的字符全部转换成小写)
			//所谓忽略大小写的搜索就是将用户输入的字符串全部转换大写或小写，然后把信息表中的字符串的全部转换成大写或小写，最后再去比较两者转换后的字符就行了
			/*******************************JS实现表格忽略大小写搜索*********************************/
			if(str1==str2){
			 //oTab.tBodies[0].rows[i].style.background='red';
			 oTab.tBodies[0].rows[i].style.display='';
			}
			else{
			  oTab.tBodies[0].rows[i].style.background='';
			}
			/***********************************JS实现表格的模糊搜索*************************************/
			//表格的模糊搜索的就是通过JS中的一个search()方法，使用格式，string1.search(string2);如果
			//用户输入的字符串是其一个子串，就会返回该子串在主串的位置，不匹配则会返回-1，故操作如下
			if(str1.search(str2)!=-1){
			//oTab.tBodies[0].rows[i].style.background='red';
			oTab.tBodies[0].rows[i].style.display='';}
			else{oTab.tBodies[0].rows[i].style.background='';}
			/***********************************JS实现表格的多关键字搜索********************************/
			//表格的多关键字搜索，加入用户所输入的多个关键字之间用空格隔开，就用split方法把一个长字符串以空格为标准，分成一个字符串数组，
			//然后以一个循环将切成的数组的子字符串与信息表中的字符串比较
			var arr=str2.split(' ');
			for(var j=0;j<arr.length;j++)
			{
			if(str1.search(arr[j])!=-1){
			    //oTab.tBodies[0].rows[i].style.background='red';
			    oTab.tBodies[0].rows[i].style.display='';}
			}
			}
		}

	}, false);
	//btn
	var opensimubtn = document.createElement('span');
	opensimubtn.className ='btn btnchange btnsave disabled';
	opensimubtn.id = 'target_open_simu';
	opensimubtn.style.position = 'absolute';
	opensimubtn.style.top = '470px';
	opensimubtn.style.left = '30px';
	opensimubtn.style.width='35px'
	opensimubtn.style.textAlign='center';
	mxUtils.write(opensimubtn, mxResources.get('Open'));
	mxEvent.addListener(opensimubtn, 'click',  function(e){
		editorUi.hideDialog();
		window.location.href = "/editor?id=" + targetid;
	});
	var opennewsimubtn = document.createElement('span');
	opennewsimubtn.className ='btn btnchange btnsave disabled';
	opennewsimubtn.style.marginLeft = '7px';
	opennewsimubtn.id = 'target_open_new_simu';
	opennewsimubtn.style.position = 'absolute';
	opennewsimubtn.style.top = '470px';
	opennewsimubtn.style.left = '93px';
	opennewsimubtn.style.width='130px';
	opennewsimubtn.style.textAlign='center';
	mxUtils.write(opennewsimubtn,mxResources.get('OpenInNewWindow') );
	mxEvent.addListener(opennewsimubtn, 'click',  function(e){
		editorUi.hideDialog();
		window.open("/editor?id=" + targetid);
	});
	var cancelbtn = document.createElement('span');
	cancelbtn.className ='btn btncancel';
	cancelbtn.id = 'target_close';
	cancelbtn.style.position = 'absolute';
	cancelbtn.style.top = '470px';
	cancelbtn.style.left = '256px';
	cancelbtn.style.marginLeft = '7px';
	mxUtils.write(cancelbtn, mxResources.get('Cancel'));
	mxEvent.addListener(cancelbtn, 'click',  function(e){
		editorUi.hideDialog();
	});
	var importbtn = document.createElement('span');
	importbtn.className ='btn btnchange btnsave disabled';
	importbtn.id = 'target_open';
	importbtn.style.position = 'absolute';
	importbtn.style.top = '470px';
	importbtn.style.left = '30px';
	mxUtils.write(importbtn, mxResources.get('Open'));
	mxEvent.addListener(importbtn, 'click',  function(e){
		importOtherSimu(targetid);
		editorUi.hideDialog();
	});
	var cancelbtn2 = document.createElement('span');
	cancelbtn2.className ='btn btncancel';
	cancelbtn2.id = 'target_close';
	cancelbtn2.style.position = 'absolute';
	cancelbtn2.style.top = '470px';
	cancelbtn2.style.left = '90px';
	cancelbtn2.style.marginLeft = '7px';
	mxUtils.write(cancelbtn2, mxResources.get('Cancel'));
	mxEvent.addListener(cancelbtn2, 'click',  function(e){
		editorUi.hideDialog();
	});
	if(type == 1){
		fdiv.appendChild(opensimubtn);
		fdiv.appendChild(opennewsimubtn);
		fdiv.appendChild(cancelbtn);
	}else{
		fdiv.appendChild(importbtn);
		fdiv.appendChild(cancelbtn2);
	}

	this.graphdiv = new newgraphdialog(_editorUI);
	fdiv.appendChild(this.graphdiv.testdiv);
	this.fillAllmysimu = function(page)
	{
		page = page==null?1:page;
		var url = '/data/simulation/mine/list/?type=create&page=1&pagesize=' + pagesize;
		//var url = '/data/simulation/mine/list/?type=create&page=1&pagesize=10';
		$(simucontent_table_tbody).children().remove();
		$.get(url, {}, function(result) {
			if (result.success == true) {
				for (var x = 0; x < result.total; x++) {
					function addtr(){
						var tr = document.createElement('tr');
						var td1 = document.createElement('td');
						//var td2 = document.createElement('td');
						td1.style.width ='75%';
						mxUtils.write(td1,result.simulations[x].name);
						//mxUtils.write(td2,result.simulations[x].last_modified);
						tr.appendChild(td1);
						//tr.appendChild(td2);
						tr.lastmodifiedtime =result.simulations[x].last_modified;
						tr.data_id = result.simulations[x].id;
						tr.setAttribute('class', 'mySimu_table_tr');
						tr.style.cursor = 'pointer';
						tr.style.borderBottom = '1px solid #eee';
						tr.style.height = '30px';
						mxEvent.addListener(tr, 'click', mxUtils.bind(this, function(){
							//console.log($.ajaxSettings.async);
							$.ajaxSettings.async = true;
							spinner.spin(this_.graphdiv.testdiv.childNodes[0]);
							targetid = tr.data_id;
							//console.log(tr.data_id);
							$('.active_tr').removeClass('active_tr');
							$(tr).addClass('active_tr');
							$('#target_open').removeClass('disabled');
							$('#target_open_simu').removeClass('disabled');
							$('#target_open_new_simu').removeClass('disabled');
							var url = '/editor/loadSimu4thumb/?id='+targetid;
							$.get(url, {}, function(result){
								//console.log(result);
								//tr.lastmodifiedtime =result.simulations[x].last_modified;
								if(result.status == 0){
									this_.graphdiv.updategraph(result.diagram);
									spinner.stop();
									this_.graphdiv.updateTimediv(tr.lastmodifiedtime);
									//console.log(tr.lastmodifiedtime);
								}

							});
						}));
						simucontent_table_tbody.appendChild(tr);
					}
					addtr();
				}
			} else {
				html += '<p>获取仿真失败</p>';
				simucontent_table.innerHTML = html;
				return;
			}
		});
	}

	this.fillMysimu4folder = function(size,id)
	{
		var url = '/data/simulation/mine/list/?type=folder&folder=' + id + '&page=1&pagesize=' + size;
		$(simucontent_table_tbody).children().remove();
		$.get(url, {}, function(result) {
			if (result.success == true) {
				for (var x = 0; x < result.total; x++) {
					function addtr(){
						var tr = document.createElement('tr');
						var td1 = document.createElement('td');
						//var td2 = document.createElement('td');
						td1.style.width ='75%';
						mxUtils.write(td1,result.simulations[x].name);
						//mxUtils.write(td2,result.simulations[x].last_modified);
						tr.appendChild(td1);
						//tr.appendChild(td2);
						tr.data_id = result.simulations[x].id;
						tr.lastmodifiedtime =result.simulations[x].last_modified;
						tr.setAttribute('class', 'mySimu_table_tr');
						tr.style.cursor = 'pointer';
						tr.style.borderBottom = '1px solid #eee';
						tr.style.height = '30px';
						mxEvent.addListener(tr, 'click', mxUtils.bind(this, function(){
							targetid = tr.data_id;
							//console.log(tr.data_id);
							$('.active_tr').removeClass('active_tr');
							$(tr).addClass('active_tr');
							$('#target_open').removeClass('disabled');
							$('#target_open_simu').removeClass('disabled');
							$('#target_open_new_simu').removeClass('disabled');
							var url = '/editor/loadSimu4thumb/?id='+targetid;
							$.get(url, {}, function(result){
								//console.log(result);
								//tr.lastmodifiedtime =result.simulations[x].last_modified;
								if(result.status == 0){
									this_.graphdiv.updategraph(result.diagram);
									this_.graphdiv.updateTimediv(tr.lastmodifiedtime);
									//console.log(tr.lastmodifiedtime);
								}

							});
						}));
						simucontent_table_tbody.appendChild(tr);
					}
					addtr();
				}
			} else {
				html += '<p>获取仿真失败</p>';
				simucontent_table.innerHTML = html;
				return;
			}
		});
	}

	this.fillsidebar = function()
	{
	var tmpthis = this;
	var spinner_ = new Spinner(opts);
	spinner_.spin(folder_ul_div);
	$.get('/data/simulation/folder/list/', {}, function(result) {

		var folder = '';
		var li_all = document.createElement('li');
		var a_all = document.createElement('a');
		a_all.setAttribute('href','javascript:void(0)');
		a_all.data_size = pagesize;
		a_all.className = 'item-file';
		mxUtils.write(a_all,mxResources.get('AllSimulations'));
		mxEvent.addListener(a_all, 'click', mxUtils.bind(this, function(){
			tmpthis.fillAllmysimu();
		}));
		li_all.appendChild(a_all);
		folder_ul_div.appendChild(li_all);
		for (var x = 0; x < result.data.length; x++) {
				var li = document.createElement('li');
				var a = document.createElement('a');
				a.setAttribute('href','javascript:void(0)');
				a.data_size = result.data[x].size;
				a.data_id = result.data[x].id;
				a.className = 'item-file';
				mxUtils.write(a, result.data[x].name + '(' + result.data[x].size + ')');
				mxEvent.addListener(a, 'click', function(e){
					tmpthis.fillMysimu4folder(this.data_size,this.data_id);
				});
				li.appendChild(a);
				folder_ul_div.appendChild(li);
		}
		spinner_.stop();
		//console.log(folder);
	});

	}



	this.fillsimumarket = function(page)
	{
		page = page==null?1:page;
		var url = '/data/simulation/market/list/?type=create&page='+page+'&pagesize=20';
		if(page==1){
			$(simumarket_table_tbody).children().remove();
		}else {
			//$(simumarket_table_tbody).find('.load_more').remove();
		}
		$.get(url, {}, function(result) {
			if (result.success == true) {
				if(result.simulations.length==0){
					var tip = $('<tr class="mySimu_table_tr "><td><a style=";color: #4285f4;" >'+mxResources.get('noMoreResults')+'</a></td></tr>');
					simumarket_table_tbody.appendChild(tip[0]);
					$(simumarket_table_tbody).find('.load_more').remove();
					return;
				}
				for (var x = 0; x < result.simulations.length; x++) {
					var tr = document.createElement('tr');
					var td1 = document.createElement('td');
					var td2 = document.createElement('td');
					//var td3 = document.createElement('td');
					td1.style.width = '55%';
					td2.style.width = '25%';
					mxUtils.write(td1,result.simulations[x].name);
					mxUtils.write(td2,result.simulations[x].user.username);
					//mxUtils.write(td3,result.simulations[x].last_modified);
					tr.appendChild(td1);
					tr.appendChild(td2);
					//tr.appendChild(td3);
					tr.data_id = result.simulations[x].id;
					tr.lastmodifiedtime =result.simulations[x].last_modified;
					tr.setAttribute('class', 'mySimu_table_tr');
					tr.style.cursor = 'pointer';
					tr.style.borderBottom = '1px solid #eee';
					tr.style.height = '30px';
					mxEvent.addListener(tr, 'click', function(e){
							$.ajaxSettings.async = true;
							spinner.spin(this_.graphdiv.testdiv.childNodes[0]);
							targetid = this.data_id;
							var lmtime = this.lastmodifiedtime;
							$('.active_tr').removeClass('active_tr');
							$(this).addClass('active_tr');
							$('#target_open').removeClass('disabled');
							$('#target_open_simu').removeClass('disabled');
							$('#target_open_new_simu').removeClass('disabled');
							var url = '/editor/loadSimu4thumb/?id='+targetid;
							$.get(url, {}, function(result){
								//console.log(result);
								//tr.lastmodifiedtime =result.simulations[x].last_modified;
								if(result.status == 0){
									this_.graphdiv.updategraph(result.diagram);
									spinner.stop();
									this_.graphdiv.updateTimediv(lmtime);
									//console.log(tr.lastmodifiedtime);
								}

							});
					});
					simumarket_table_tbody.appendChild(tr);
				}
				if(page==1){
					//$(simumarket_table_tbody).children().remove();
				}else {
					$(simumarket_table_tbody).find('.load_more').remove();
				}
				var addmore = $('<tr class="mySimu_table_tr load_more"><td><a style="position:relative;cursor:pointer;color: #4285f4;text-decoration:underline" >'+mxResources.get('loadmore')+'</a></td></tr>');
				addmore.find('a').click(function(){
					var opts = {
						lines: 11, // The number of lines to draw
						length: 2, // The length of each line
						width: 2, // The line thickness
						radius: 3, // The radius of the inner circle
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
					$(this).html('&nbsp;');
					spinner.spin(this);
					function loaddata(){
						this_.fillsimumarket(page+1);
					}
					setTimeout(loaddata, 1);
				});
				simumarket_table_tbody.appendChild(addmore[0]);
			}
		});

	}






	//fill graph


	//this.fillsidebar();
	$.ajaxSettings.async = setsync;
	//this.fillAllmysimu();
	//this.fillsimumarket();
	this.div4dialog = fdiv;
	//return fdiv;
		/*

		var opendlg = new OpensimuDialogv2(_editorUI);
		_editorUI.showDialog(opendlg.div4dialog, 860, 450, true, true);
		opendlg.fillsidebar();
		opendlg.fillAllmysimu();
		opendlg.fillsimumarket();


		*/


}


var newgraphdialog = function(editorUi,containerWidth,containerHeight,containerTop,containerLeft,infoTop,infoLeft,timeTop,timeLeft){

	//init param
	containerWidth =  (containerWidth != null)?containerWidth:510;
	containerHeight = (containerHeight !=null)?containerHeight:340;
	containerTop = (containerTop != null)?containerTop:118;
	containerLeft = (containerLeft != null)?containerLeft:565;
	infoTop = (infoTop !=null)?infoTop:433;
	infoLeft = (infoLeft !=null)?infoLeft:565;
	timeTop = (timeTop !=null)?timeTop:439;
	timeLeft = (timeLeft != null)?timeLeft:924;

	var div =document.createElement('div');
	var container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.border = '1px solid lightGray';
	container.style.left = containerLeft+'px';
	container.style.top = containerTop+'px';
	container.style.width = containerWidth + 'px';
	container.style.height = containerHeight + 'px';
	container.style.overflow = 'hidden';
	mxEvent.disableContextMenu(container);
	div.appendChild(container);


	var graph = new Graph(container, null, null, editorUi.editor.graph.getStylesheet());
	graph.setEnabled(false);
	graph.setPanning(true);
	graph.panningHandler.ignoreCell = true;
	graph.panningHandler.useLeftButtonForPanning = true;
	graph.minFitScale = null;
	graph.maxFitScale = null;
	graph.centerZoom = true;

	var currentPage = 0;
	var diagrams = null;
	var realPage = 0;
	var graphGetGlobalVariable = graph.getGlobalVariable;
	graph.getLinkForCell = function()
	{
		return null;
	};
	if (Editor.MathJaxRender)
	{
		graph.addListener(mxEvent.SIZE, mxUtils.bind(this, function(sender, evt)
		{
			// LATER: Math support is used if current graph has math enabled
			// should use switch from history instead but requires setting the
			// global mxClient.NO_FO switch
			if (editorUi.editor.graph.mathEnabled)
			{
				Editor.MathJaxRender(graph.container);
			}
		}));
	}
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
	//var spinner = new Spinner(opts);

	//var file = editorUi.getCurrentFile();

	var currentRow = null;
	var currentRev = null;
	var currentDoc = 1;
	var currentXml = null;

	var zoomInBtn = mxUtils.button('', function()
	{
		if (currentDoc != null)
		{
			graph.zoomIn();
		}
	});
	zoomInBtn.className = 'geSprite geSprite-zoomin';
	zoomInBtn.setAttribute('title', mxResources.get('zoomIn'));
	zoomInBtn.style.outline = 'none';
	zoomInBtn.style.border = 'none';
	zoomInBtn.style.margin = '2px';
	zoomInBtn.setAttribute('disabled', 'disabled');
	mxUtils.setOpacity(zoomInBtn, 20);

	var zoomOutBtn = mxUtils.button('', function()
	{
		if (currentDoc != null)
		{
			graph.zoomOut();
		}
	});
	zoomOutBtn.className = 'geSprite geSprite-zoomout';
	zoomOutBtn.setAttribute('title', mxResources.get('zoomOut'));
	zoomOutBtn.style.outline = 'none';
	zoomOutBtn.style.border = 'none';
	zoomOutBtn.style.margin = '2px';
	zoomOutBtn.setAttribute('disabled', 'disabled');
	mxUtils.setOpacity(zoomOutBtn, 20);

	var zoomFitBtn = mxUtils.button('', function()
	{
		if (currentDoc != null)
		{
			graph.maxFitScale = 8;
			graph.fit(8);
			graph.center();
		}
	});
	zoomFitBtn.className = 'geSprite geSprite-fit';
	zoomFitBtn.setAttribute('title', mxResources.get('fit'));
	zoomFitBtn.style.outline = 'none';
	zoomFitBtn.style.border = 'none';
	zoomFitBtn.style.margin = '2px';
	zoomFitBtn.setAttribute('disabled', 'disabled');
	mxUtils.setOpacity(zoomFitBtn, 20);

	var zoomActualBtn = mxUtils.button('', function()
	{
		if (currentDoc != null)
		{
			graph.zoomActual();
			graph.center();
		}
	});
	zoomActualBtn.className = 'geSprite geSprite-actualsize';
	zoomActualBtn.setAttribute('title', mxResources.get('actualSize'));
	zoomActualBtn.style.outline = 'none';
	zoomActualBtn.style.border = 'none';
	zoomActualBtn.style.margin = '2px';
	zoomActualBtn.setAttribute('disabled', 'disabled');
	mxUtils.setOpacity(zoomActualBtn, 20);

	var infodiv  = document.createElement('div');
	infodiv.style.position = 'absolute';
	infodiv.style.left = infoLeft+'px';
	infodiv.style.top = infoTop+'px';
	var timediv = document.createElement('div');
	timediv.style.position = 'absolute';
	timediv.style.left = timeLeft+'px';
	timediv.style.top = timeTop+'px';
	timediv.style.color = 'gray';
	timediv.style.maxWidth = '150px';
	timediv.setAttribute('title', mxResources.get('LastModified'));
	//mxUtils.write(timediv,'9/12/2016 5:40:55 PM');
	infodiv.appendChild(zoomInBtn);
	infodiv.appendChild(zoomOutBtn);
	infodiv.appendChild(zoomFitBtn);
	infodiv.appendChild(zoomActualBtn);
	div.appendChild(timediv);
	div.appendChild(infodiv);

	this.updateTimediv = function(timeinfo){
		//mxUtils.write(timediv,'9/12/2016 5:40:55 PM');
		timediv.innerHTML = '';
		mxUtils.write(timediv,timeinfo);
	}
	this.updategraph = function(otherdigram){
			var node = (otherdigram != null && otherdigram.length > 0) ? mxUtils.parseXml(otherdigram).documentElement : null;
			var tmp = (node != null) ? _editorUI.editor.extractGraphModel(node, true) : null;

			if (tmp != null) {
				node = tmp;
			}
			if (node != null && node.nodeName == 'mxfile') {
				var nodes = node.getElementsByTagName('mxGraphModel');
				var model = new mxGraphModel();
				var codec = new mxCodec(nodes[0].ownerDocument);
				codec.decode(nodes[0], graph.getModel());
				//var codec = new mxCodec(nodes[0],graph.getModel());
				var bg = node.getAttribute('background');
				if (bg == null || bg == '' || bg == mxConstants.NONE)
				{
					bg = '#ffffff';
				}
				container.style.backgroundColor = bg;
				graph.maxFitScale = 1;
				graph.fit(8);
				graph.center();
				//model.root = codec.decode(nodes[0]).root;
				//codec.decode(doc.documentElement, model);

			}else{
				var codec = new mxCodec(node.ownerDocument);
				var model = new mxGraphModel();
				codec.decode(node, graph.getModel());
				var bg = node.getAttribute('background');
				if (bg == null || bg == '' || bg == mxConstants.NONE)
				{
					bg = '#ffffff';
				}
				container.style.backgroundColor = bg;
				graph.maxFitScale = 1;
				graph.fit(8);
				graph.center();
			}
			mxUtils.setOpacity(zoomInBtn, 100);
			mxUtils.setOpacity(zoomOutBtn, 100);
			mxUtils.setOpacity(zoomFitBtn, 100);
			mxUtils.setOpacity(zoomActualBtn, 100);
			zoomInBtn.removeAttribute('disabled');
			zoomOutBtn.removeAttribute('disabled');
			zoomFitBtn.removeAttribute('disabled');
			zoomActualBtn.removeAttribute('disabled');
	}
	this.testdiv = div;
	/*
var opendlg = new newgraphdialog(_editorUI);
_editorUI.showDialog(opendlg.testdiv, 860, 450, true, true);
opendlg.updategraph(diagram2);

	*/
}


/**
 * 
 * 
 * Added by wugh
 * Constructs a new open simulation dialog
****/
var OpensimuDialog = function(editorUi) {
	var fdiv = document.createElement('div');
	var div = document.createElement('div');
	div.id = 'simucontent';
	div.style.overflow = 'auto';
	div.style.float = 'left';
	div.style.width = '70%';
	div.style.height = '340px';
	div.style.marginBottom = '16px';
	div.style.border = '2px solid #eee';
	var tempthis = editorUi;
	var setsync = $.ajaxSettings.async;
	var html = '';
	var sidebar = '';
	var pagesize = 0;
	var targetid = 0;
	if (setsync) {
		$.ajaxSettings.async = false;
	}
	$.get("/data/simulation/item/count/", {}, function(result) {
		if (result.success == true) {
			pagesize = result.data.all;
		} else {
			html += '<p>获取仿真数量失败</p>';
			div.innerHTML = html;
			$.ajaxSettings.async = setsync;
			return div;
		}
	});

	$.get('/data/simulation/folder/list/', {}, function(result) {
		var folder = '';
		for (var x = 0; x < result.data.length; x++) {
			folder += '<li><a href="javascript:void(0)" data-size="' + result.data[x].size + '" data-id="' + result.data[x].id + '" class="item-file ">' + result.data[x].name + '(' + result.data[x].size + ')</a></li>';
		}
		//console.log(folder);
		sidebar = ' <div style="float:left;width:27%">\
				<div class="sidebar project-bar"><h4 style="padding-left:36px">' + mxResources.get('Simulations') + '</h4>\
				<div class="menu"style="overflow:auto;height:300px;width:90%">\
				<ul id="folder_ul" class="sidebar-dropdown" style="display: block;">\
				<li><a href="javascript:void(0)" data-size="' + pagesize + '"  id="all-file">' + mxResources.get('AllSimulations') + '</a></li>\
				' + folder + '</ul></div></div></div></div>';

	});
	html += ('<h3>' + mxResources.get('OpenASimulation') + '</h3>');
	html += '<div style="height:35px">\
	<div  class="dia-tab-hover"  style="display:inline;background:transparent!important;padding-bottom: 10px;padding:16px 4px 7px;margin:-2px 0px;"><div style="display: inline-block;font-size: 14px;vertical-align: middle;cursor:pointer" id="mySimu_tab" class="active-dia-tab">' + mxResources.get('MySimulations') + '</div></div>\
	<div style="display:inline;background: transparent!important;padding-bottom: 10px;padding:16px 4px 7px;margin:-2px 12px;"><div style="display: inline-block;font-size: 14px;vertical-align: middle;cursor:pointer" id="simuPform_tab" class="unactive-dia-tab">' + mxResources.get('SimulationPlatform') + '</div></div></div>';
	fdiv.innerHTML += html;
	var url = '/data/simulation/mine/list/?type=create&page=1&pagesize=' + pagesize;
	$.get(url, {}, function(result) {
		if (result.success == true) {
			var table = document.createElement('table');
			table.rules = 'rows';
			table.style.width = '100%';
			//table.id = 'mySimu_table';
			table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
			for (var x = 0; x < result.total; x++) {
				var tr = document.createElement('tr');
				var td = '<td style="width:75%">' + result.simulations[x].name + '</td><td>' + result.simulations[x].last_modified + '</td>';
				tr.setAttribute('data-id', result.simulations[x].id);
				tr.setAttribute('class', 'mySimu_table_tr');
				tr.style.borderBottom = '1px solid #eee';
				tr.style.height = '30px';
				tr.innerHTML += td;
				table.appendChild(tr);
				/*a = document.createElement('a');
				a.innerHTML = result.simulations[x].name;
				a.setAttribute('onclick','importOtherSimu('+result.simulations[x].id+');');
				a.setAttribute('href','#');
				//a.onclick = importOtherSimu(result.simulations[x].id);
				mxEvent.addListener(a, 'click', mxUtils.bind(this, function()
				{
					editorUi.hideDialog(true);
				}));
				div.appendChild(a);
				br = document.createElement('br');
				div.appendChild(br);*/
				/*html+='<a href = "#" onclick = "importOtherSimu(tempthis,'+result.simulations[x].id+')">'+result.simulations[x].name+'</a><br/>';*/
			}
			div.appendChild(table);
			//div.innerHTML = html;
			//fdiv.innerHTML += sidebar;
			//fdiv.appendChild(div);
		} else {
			html += '<p>获取仿真失败</p>';
			div.innerHTML = html;
			$.ajaxSettings.async = setsync;
			return div;
		}
	});

	var mysimudiv = document.createElement('div');
	mysimudiv.id = 'mysimu';
	mysimudiv.innerHTML += sidebar;
	mysimudiv.appendChild(div);
	fdiv.appendChild(mysimudiv);
	getSimuMarket();
	fdiv.innerHTML += '<span id="target_open" class="btn btnchange btnsave disabled">' + mxResources.get('Open') + '</span>  <span id="target_close"  style="margin-left:5px" class="btn btncancel">' + mxResources.get('Cancel') + '</span>';
	if ($('body').attr('initImport') != 1) {
		initImport();
	}
	$.ajaxSettings.async = setsync;
	//funtion
	function getSimuMarket() {
		var url = '/data/simulation/market/list/?type=create&page=1&pagesize=1024';
		var simumarketdiv = document.createElement('div');
		simumarketdiv.id = 'simumarket';
		simumarketdiv.style.overflow = 'auto';
		simumarketdiv.style.float = 'left';
		simumarketdiv.style.width = '100%';
		simumarketdiv.style.height = '340px';
		simumarketdiv.style.marginBottom = '16px';
		simumarketdiv.style.border = '2px solid #eee';
		simumarketdiv.style.display = 'none';
		var setsync = $.ajaxSettings.async;
		if (setsync) {
			$.ajaxSettings.async = false;
		}
		$.get(url, {}, function(result) {
			if (result.success == true) {
				/*for (var x= 0;x<result.total;x++){
						var a = document.createElement('a');
						a.innerHTML = result.simulations[x].name;
						a.setAttribute('onclick','importOtherSimu('+result.simulations[x].id+');');
						a.setAttribute('href','#');
						//a.onclick = importOtherSimu(result.simulations[x].id);
						mxEvent.addListener(a, 'click', mxUtils.bind(this, function()
						{
							editorUi.hideDialog(true);
						}));
						simumarketdiv.appendChild(a);
						var br = document.createElement('br');
						simumarketdiv.appendChild(br);
					}*/
				var table = document.createElement('table');
				table.rules = 'rows';
				table.style.width = '100%';
				//table.id = 'mySimu_table';
				table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('Owner') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
				for (var x = 0; x < result.total; x++) {
					var tr = document.createElement('tr');
					var td = '<td style="width:55%">' + result.simulations[x].name + '</td><td style="width:25%">' + result.simulations[x].user.username + '</td><td>' + result.simulations[x].last_modified + '</td>';
					tr.setAttribute('data-id', result.simulations[x].id);
					tr.setAttribute('class', 'mySimu_table_tr');
					tr.style.borderBottom = '1px solid #eee';
					tr.style.height = '30px';
					tr.innerHTML += td;
					table.appendChild(tr);
				}
				simumarketdiv.appendChild(table);
				fdiv.appendChild(simumarketdiv);
			}
		});

	}

	function initImport() {
		$('body').attr('initImport', '1');
		$("body").on('mouseover', ".unactive-dia-tab", function() {
			var simu = $(this);
			simu.parent().addClass('dia-tab-hover');
			//simu.parent().css('border-bottom', '2px solid #4d90fe');

		});
		$("body").on('mouseout', ".unactive-dia-tab", function() {
			var simu = $(this);
			simu.parent().removeClass('dia-tab-hover');
			//simu.parent().css('border-bottom', '');
		});
		$("body").on('click', ".unactive-dia-tab", function() {
			var simu = $(this);
			var id = simu.attr('id');
			//console.log('21');
			var t = $('.active-dia-tab');
			t.removeClass('active-dia-tab');
			t.addClass('unactive-dia-tab');
			//t.parent().css('border-bottom', '');
			t.parent().removeClass('dia-tab-hover');
			//add active
			simu.removeClass('unactive-dia-tab');
			simu.addClass('active-dia-tab');
			//simu.parent().css('border-bottom', '2px solid #4d90fe');
			simu.parent().addClass('dia-tab-hover');
			if (id != 'mySimu_tab') {
				clearstatus();
				$('#mysimu').hide();
				$('#simumarket').show();
			} else {
				clearstatus();
				$('#simumarket').hide();
				$('#mysimu').show();

			}
		});
		/*		$("body").on('click', "#simuPform_tab", function () {
				                var simu = $(this);
				                simu.parent().css('border-bottom','2px solid #4d90fe');

				            });*/
		$("body").on('click', ".item-file", function() {
			var item = $(this);
			var pagesize = item.attr('data-size');
			var id = item.attr('data-id');
			getFolderContent(pagesize, id);
			clearstatus();


		});
		$("body").on('click', "#all-file", function() {
			var item = $(this);
			var pagesize = item.attr('data-size');
			getAllContent(pagesize);


		});
		$("body").on('click', ".mySimu_table_tr", function() {
			var item = $(this);
			//console.log(item.attr('data-id'));
			targetid = item.attr('data-id');
			$('.active_tr').removeClass('active_tr');
			item.addClass('active_tr');
			$('#target_open').removeClass('disabled');
			$('#target_open_simu').removeClass('disabled');
			$('#target_open_new_simu').removeClass('disabled');
		});
		$("body").on('click', "#target_close", function() {
			editorUi.hideDialog(true);
		});
		$("body").on('click', "#target_open", function() {
			//console.log(targetid);
			importOtherSimu(targetid);
			editorUi.hideDialog(true);
		});
		$("body").on('click', "#target_open_simu", function() {
			//console.log(targetid);
			//importOtherSimu(targetid);
			window.location.href = "/editor?id=" + targetid;
			editorUi.hideDialog(true);
		});
		$("body").on('click', "#target_open_new_simu", function() {
			//console.log(targetid);
			//importOtherSimu(targetid);
			window.open("/editor?id=" + targetid);
			editorUi.hideDialog(true);
		});
	}

	function getAllContent(pagesize) {
		var setsync = $.ajaxSettings.async;
		if (setsync) {
			$.ajaxSettings.async = false;
		}
		var url = '/data/simulation/mine/list/?type=create&page=1&pagesize=' + pagesize;
		$.get(url, {}, function(result) {
			if (result.success == true) {
				$('#simucontent').html('');
				var simucontent = document.getElementById('simucontent');
				var table = document.createElement('table');
				table.rules = 'rows';
				table.style.width = '100%';
				//table.id = 'mySimu_table';
				table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
				for (var x = 0; x < result.total; x++) {
					var tr = document.createElement('tr');
					var td = '<td style="width:75%">' + result.simulations[x].name + '</td><td>' + result.simulations[x].last_modified + '</td>';
					//<img src="/static/template/img/item-all.png" />
					tr.setAttribute('data-id', result.simulations[x].id);
					tr.setAttribute('class', 'mySimu_table_tr');
					tr.style.borderBottom = '1px solid #eee';
					tr.style.height = '30px';
					tr.innerHTML += td;
					table.appendChild(tr);
				}
				simucontent.appendChild(table);
				/*for (var x= 0;x<result.total;x++){
						a = document.createElement('a');
						a.innerHTML = result.simulations[x].name;
						a.setAttribute('onclick','importOtherSimu('+result.simulations[x].id+');');
						a.setAttribute('href','#');
						//a.onclick = importOtherSimu(result.simulations[x].id);
						mxEvent.addListener(a, 'click', mxUtils.bind(this, function()
						{
							editorUi.hideDialog(true);
						}));
						simucontent.appendChild(a);
						br = document.createElement('br');
						simucontent.appendChild(br);
					}
*/
			} else {
				html += '<p>获取仿真失败</p>';
				simucontent.innerHTML = html;
				$.ajaxSettings.async = setsync;
				return;
			}
		});
		$.ajaxSettings.async = setsync;
	}

	function getFolderContent(pagesize, id) {
		//console.log('1');
		var setsync = $.ajaxSettings.async;
		if (setsync) {
			$.ajaxSettings.async = false;
		}
		var url = '/data/simulation/mine/list/?type=folder&folder=' + id + '&page=1&pagesize=' + pagesize;
		$.get(url, {}, function(result) {
			$('#simucontent').html('');
			var simucontent = document.getElementById('simucontent');
			var table = document.createElement('table');
			table.rules = 'rows';
			table.style.width = '100%';
			//table.id = 'mySimu_table';
			table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
			for (var x = 0; x < result.total; x++) {
				var tr = document.createElement('tr');
				var td = '<td style="width:75%">' + result.simulations[x].name + '</td><td>' + result.simulations[x].last_modified + '</td>';
				tr.setAttribute('data-id', result.simulations[x].id);
				tr.setAttribute('class', 'mySimu_table_tr');
				tr.style.borderBottom = '1px solid #eee';
				tr.style.height = '30px';
				tr.innerHTML += td;
				table.appendChild(tr);
			}
			simucontent.appendChild(table);

		});
		$.ajaxSettings.async = setsync;
	}

	function disableBtn() {
		targetid = 0;
		$('#target_open').addClass('disabled');
	}

	function clearstatus() {
		targetid = 0;
		$('.active_tr').removeClass('active_tr');
		disableBtn();
	}
	//fdiv.appendChild(div);
	return fdiv;



}


var OpenNewsimuDialog = function(editorUi) {
		var fdiv = document.createElement('div');
		var div = document.createElement('div');
		div.id = 'simucontent';
		div.style.overflow = 'auto';
		div.style.float = 'left';
		div.style.width = '70%';
		div.style.height = '340px';
		div.style.marginBottom = '16px';
		div.style.border = '2px solid #eee';
		var tempthis = editorUi;
		var setsync = $.ajaxSettings.async;
		var html = '';
		var sidebar = '';
		var pagesize = 0;
		var targetid = 0;
		if (setsync) {
			$.ajaxSettings.async = false;
		}
		$.get("/data/simulation/item/count/", {}, function(result) {
			if (result.success == true) {
				pagesize = result.data.all;
			} else {
				html += '<p>获取仿真数量失败</p>';
				div.innerHTML = html;
				$.ajaxSettings.async = setsync;
				return div;
			}
		});

		$.get('/data/simulation/folder/list/', {}, function(result) {
			var folder = '';
			for (var x = 0; x < result.data.length; x++) {
				folder += '<li><a href="javascript:void(0)" data-size="' + result.data[x].size + '" data-id="' + result.data[x].id + '" class="item-file ">' + result.data[x].name + '(' + result.data[x].size + ')</a></li>';
			}
			//console.log(folder);
			sidebar = ' <div style="float:left;width:27%">\
				<div class="sidebar project-bar"><h4 style="padding-left:36px">' + mxResources.get('Simulations') + '</h4>\
				<div class="menu"style="overflow:auto;height:300px;width:90%">\
				<ul id="folder_ul" class="sidebar-dropdown" style="display: block;">\
				<li><a href="javascript:void(0)" data-size="' + pagesize + '"  id="all-file">' + mxResources.get('AllSimulations') + '</a></li>\
				' + folder + '</ul></div></div></div></div>';

		});
		html += '<h3>' + mxResources.get('OpenASimulation') + '</h3>';
		html += '<div style="height:35px">\
	<div class="dia-tab-hover" style="display:inline;background:transparent!important;padding-bottom: 10px;padding:16px 4px 7px;margin:-2px 0px;"><div style="display: inline-block;font-size: 14px;vertical-align: middle;cursor:pointer" id="mySimu_tab" class="active-dia-tab">' + mxResources.get('MySimulations') + '</div></div>\
	<div style="display:inline;background: transparent!important;padding-bottom: 10px;padding:16px 4px 7px;margin:-2px 12px;"><div style="display: inline-block;font-size: 14px;vertical-align: middle;cursor:pointer" id="simuPform_tab" class="unactive-dia-tab">' + mxResources.get('SimulationPlatform') + '</div></div></div>';
		fdiv.innerHTML += html;
		var url = '/data/simulation/mine/list/?type=create&page=1&pagesize=' + pagesize;
		$.get(url, {}, function(result) {
			if (result.success == true) {
				var table = document.createElement('table');
				table.rules = 'rows';
				table.style.width = '100%';
				//table.id = 'mySimu_table';
				table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
				for (var x = 0; x < result.total; x++) {
					var tr = document.createElement('tr');
					var td = '<td style="width:75%">' + result.simulations[x].name + '</td><td>' + result.simulations[x].last_modified + '</td>';
					tr.setAttribute('data-id', result.simulations[x].id);
					tr.setAttribute('class', 'mySimu_table_tr');
					tr.style.borderBottom = '1px solid #eee';
					tr.style.height = '30px';
					tr.innerHTML += td;
					table.appendChild(tr);
					/*a = document.createElement('a');
					a.innerHTML = result.simulations[x].name;
					a.setAttribute('onclick','importOtherSimu('+result.simulations[x].id+');');
					a.setAttribute('href','#');
					//a.onclick = importOtherSimu(result.simulations[x].id);
					mxEvent.addListener(a, 'click', mxUtils.bind(this, function()
					{
						editorUi.hideDialog(true);
					}));
					div.appendChild(a);
					br = document.createElement('br');
					div.appendChild(br);*/
					/*html+='<a href = "#" onclick = "importOtherSimu(tempthis,'+result.simulations[x].id+')">'+result.simulations[x].name+'</a><br/>';*/
				}
				div.appendChild(table);
				//div.innerHTML = html;
				//fdiv.innerHTML += sidebar;
				//fdiv.appendChild(div);
			} else {
				html += '<p>获取仿真失败</p>';
				div.innerHTML = html;
				$.ajaxSettings.async = setsync;
				return div;
			}
		});

		var mysimudiv = document.createElement('div');
		mysimudiv.id = 'mysimu';
		mysimudiv.innerHTML += sidebar;
		mysimudiv.appendChild(div);
		fdiv.appendChild(mysimudiv);
		getSimuMarket();
		fdiv.innerHTML += '<span id="target_open_simu" class="btn btnchange btnsave disabled">' + mxResources.get('Open') + '</span> <span id="target_open_new_simu" style="margin-left:7px" class="btn btnchange btnsave disabled">' + mxResources.get('OpenInNewWindow') + '</span>   <span id="target_close"  style="margin-left:5px" class="btn btncancel">' + mxResources.get('Cancel') + '</span>';
		if ($('body').attr('initImport') != 1) {
			initImport();
		}
		$.ajaxSettings.async = setsync;
		//funtion
		function initImport() {
			$('body').attr('initImport', '1');
			$("body").on('mouseover', ".unactive-dia-tab", function() {
				var simu = $(this);
				//simu.parent().css('border-bottom', '2px solid #4d90fe');
				simu.parent().addClass('dia-tab-hover');

			});
			$("body").on('mouseout', ".unactive-dia-tab", function() {
				var simu = $(this);
				simu.parent().removeClass('dia-tab-hover');
				//simu.parent().css('border-bottom', '');
			});
			$("body").on('click', ".unactive-dia-tab", function() {
				var simu = $(this);
				var id = simu.attr('id');
				//console.log('21');
				var t = $('.active-dia-tab');
				t.removeClass('active-dia-tab');
				t.addClass('unactive-dia-tab');
				//t.parent().css('border-bottom', '');
				t.parent().removeClass('dia-tab-hover');
				//add active
				simu.removeClass('unactive-dia-tab');
				simu.addClass('active-dia-tab');
				//simu.parent().css('border-bottom', '2px solid #4d90fe');
				simu.parent().addClass('dia-tab-hover');
				if (id != 'mySimu_tab') {
					clearstatus();
					$('#mysimu').hide();
					$('#simumarket').show();
				} else {
					clearstatus();
					$('#simumarket').hide();
					$('#mysimu').show();

				}
			});
			/*		$("body").on('click', "#simuPform_tab", function () {
					                var simu = $(this);
					                simu.parent().css('border-bottom','2px solid #4d90fe');

					            });*/
			$("body").on('click', ".item-file", function() {
				var item = $(this);
				var pagesize = item.attr('data-size');
				var id = item.attr('data-id');
				getFolderContent(pagesize, id);
				clearstatus();


			});
			$("body").on('click', "#all-file", function() {
				var item = $(this);
				var pagesize = item.attr('data-size');
				getAllContent(pagesize);


			});
			$("body").on('click', ".mySimu_table_tr", function() {
				var item = $(this);
				//console.log(item.attr('data-id'));
				targetid = item.attr('data-id');
				$('.active_tr').removeClass('active_tr');
				item.addClass('active_tr');
				$('#target_open').removeClass('disabled');
				$('#target_open_simu').removeClass('disabled');
				$('#target_open_new_simu').removeClass('disabled');
			});
			$("body").on('click', "#target_close", function() {
				editorUi.hideDialog(true);
			});
			$("body").on('click', "#target_open", function() {
				//console.log(targetid);
				importOtherSimu(targetid);
				editorUi.hideDialog(true);
			});
			$("body").on('click', "#target_open_simu", function() {
				//console.log(targetid);
				//importOtherSimu(targetid);
				window.location.href = "/editor?id=" + targetid;
				editorUi.hideDialog(true);
			});
			$("body").on('click', "#target_open_new_simu", function() {
				//console.log(targetid);
				//importOtherSimu(targetid);
				window.open("/editor?id=" + targetid);
				editorUi.hideDialog(true);
			});
		}

		function getSimuMarket() {
			var url = '/data/simulation/market/list/?type=create&page=1&pagesize=1024';
			var simumarketdiv = document.createElement('div');
			simumarketdiv.id = 'simumarket';
			simumarketdiv.style.overflow = 'auto';
			simumarketdiv.style.float = 'left';
			simumarketdiv.style.width = '100%';
			simumarketdiv.style.height = '340px';
			simumarketdiv.style.marginBottom = '16px';
			simumarketdiv.style.border = '2px solid #eee';
			simumarketdiv.style.display = 'none';
			var setsync = $.ajaxSettings.async;
			if (setsync) {
				$.ajaxSettings.async = false;
			}
			$.get(url, {}, function(result) {
				if (result.success == true) {
					/*for (var x= 0;x<result.total;x++){
							var a = document.createElement('a');
							a.innerHTML = result.simulations[x].name;
							a.setAttribute('onclick','importOtherSimu('+result.simulations[x].id+');');
							a.setAttribute('href','#');
							//a.onclick = importOtherSimu(result.simulations[x].id);
							mxEvent.addListener(a, 'click', mxUtils.bind(this, function()
							{
								editorUi.hideDialog(true);
							}));
							simumarketdiv.appendChild(a);
							var br = document.createElement('br');
							simumarketdiv.appendChild(br);
						}*/
					var table = document.createElement('table');
					table.rules = 'rows';
					table.style.width = '100%';
					//table.id = 'mySimu_table';
					table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('Owner') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
					for (var x = 0; x < result.total; x++) {
						var tr = document.createElement('tr');
						var td = '<td style="width:55%">' + result.simulations[x].name + '</td><td style="width:25%">' + result.simulations[x].user.username + '</td><td>' + result.simulations[x].last_modified + '</td>';
						tr.setAttribute('data-id', result.simulations[x].id);
						tr.setAttribute('class', 'mySimu_table_tr');
						tr.style.borderBottom = '1px solid #eee';
						tr.style.height = '30px';
						tr.innerHTML += td;
						table.appendChild(tr);
					}
					simumarketdiv.appendChild(table);
					fdiv.appendChild(simumarketdiv);
				}
			});

		}

		function getAllContent(pagesize) {
			var setsync = $.ajaxSettings.async;
			if (setsync) {
				$.ajaxSettings.async = false;
			}
			var url = '/data/simulation/mine/list/?type=create&page=1&pagesize=' + pagesize;
			$.get(url, {}, function(result) {
				if (result.success == true) {
					$('#simucontent').html('');
					var simucontent = document.getElementById('simucontent');
					var table = document.createElement('table');
					table.rules = 'rows';
					table.style.width = '100%';
					//table.id = 'mySimu_table';
					table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
					for (var x = 0; x < result.total; x++) {
						var tr = document.createElement('tr');
						var td = '<td style="width:75%">' + result.simulations[x].name + '</td><td>' + result.simulations[x].last_modified + '</td>';
						//<img src="/static/template/img/item-all.png" />
						tr.setAttribute('data-id', result.simulations[x].id);
						tr.setAttribute('class', 'mySimu_table_tr');
						tr.style.borderBottom = '1px solid #eee';
						tr.style.height = '30px';
						tr.innerHTML += td;
						table.appendChild(tr);
					}
					simucontent.appendChild(table);
					/*for (var x= 0;x<result.total;x++){
						a = document.createElement('a');
						a.innerHTML = result.simulations[x].name;
						a.setAttribute('onclick','importOtherSimu('+result.simulations[x].id+');');
						a.setAttribute('href','#');
						//a.onclick = importOtherSimu(result.simulations[x].id);
						mxEvent.addListener(a, 'click', mxUtils.bind(this, function()
						{
							editorUi.hideDialog(true);
						}));
						simucontent.appendChild(a);
						br = document.createElement('br');
						simucontent.appendChild(br);
					}
*/
				} else {
					html += '<p>获取仿真失败</p>';
					simucontent.innerHTML = html;
					$.ajaxSettings.async = setsync;
					return;
				}
			});
			$.ajaxSettings.async = setsync;
		}

		function getFolderContent(pagesize, id) {
			//console.log('1');
			var setsync = $.ajaxSettings.async;
			if (setsync) {
				$.ajaxSettings.async = false;
			}
			var url = '/data/simulation/mine/list/?type=folder&folder=' + id + '&page=1&pagesize=' + pagesize;
			$.get(url, {}, function(result) {
				$('#simucontent').html('');
				var simucontent = document.getElementById('simucontent');
				var table = document.createElement('table');
				table.rules = 'rows';
				table.style.width = '100%';
				//table.id = 'mySimu_table';
				table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
				for (var x = 0; x < result.total; x++) {
					var tr = document.createElement('tr');
					var td = '<td style="width:75%">' + result.simulations[x].name + '</td><td>' + result.simulations[x].last_modified + '</td>';
					tr.setAttribute('data-id', result.simulations[x].id);
					tr.setAttribute('class', 'mySimu_table_tr');
					tr.style.borderBottom = '1px solid #eee';
					tr.style.height = '30px';
					tr.innerHTML += td;
					table.appendChild(tr);
				}
				simucontent.appendChild(table);

			});
			$.ajaxSettings.async = setsync;
		}

		function disableBtn() {
			targetid = 0;
			$('#target_open_simu').addClass('disabled');
			$('#target_open_new_simu').addClass('disabled');
		}

		function clearstatus() {
			targetid = 0;
			$('.active_tr').removeClass('active_tr');
			disableBtn();
		}
		//fdiv.appendChild(div);
		return fdiv;



	}



/**
 * Constructs a new export dialog.
 */

var ExportDialog = function(editorUi) {
	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;

	var width = Math.ceil(bounds.width / scale);
	var height = Math.ceil(bounds.height / scale);

	var row, td;

	var table = document.createElement('table');
	var tbody = document.createElement('tbody');

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, mxResources.get('filename') + ':');

	row.appendChild(td);

	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
	nameInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('format') + ':');

	row.appendChild(td);

	var imageFormatSelect = document.createElement('select');
	imageFormatSelect.style.width = '180px';

	var pngOption = document.createElement('option');
	pngOption.setAttribute('value', 'png');
	mxUtils.write(pngOption, mxResources.get('formatPng'));
	imageFormatSelect.appendChild(pngOption);

	var gifOption = document.createElement('option');

	if (ExportDialog.showGifOption) {
		gifOption.setAttribute('value', 'gif');
		mxUtils.write(gifOption, mxResources.get('formatGif'));
		imageFormatSelect.appendChild(gifOption);
	}

	var jpgOption = document.createElement('option');
	jpgOption.setAttribute('value', 'jpg');
	mxUtils.write(jpgOption, mxResources.get('formatJpg'));
	imageFormatSelect.appendChild(jpgOption);

	var pdfOption = document.createElement('option');
	pdfOption.setAttribute('value', 'pdf');
	mxUtils.write(pdfOption, mxResources.get('formatPdf'));
	imageFormatSelect.appendChild(pdfOption);

	var svgOption = document.createElement('option');
	svgOption.setAttribute('value', 'svg');
	mxUtils.write(svgOption, mxResources.get('formatSvg'));
	imageFormatSelect.appendChild(svgOption);

	if (ExportDialog.showXmlOption) {
		var xmlOption = document.createElement('option');
		xmlOption.setAttribute('value', 'xml');
		mxUtils.write(xmlOption, mxResources.get('formatXml'));
		imageFormatSelect.appendChild(xmlOption);
	}

	td = document.createElement('td');
	td.appendChild(imageFormatSelect);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('backgroundColor') + ':');

	row.appendChild(td);

	var backgroundInput = document.createElement('input');
	var tmp = (graph.background == null || graph.background == mxConstants.NONE) ? '#ffffff' : graph.background;
	backgroundInput.setAttribute('value', tmp);
	backgroundInput.style.width = '80px';

	var backgroundCheckbox = document.createElement('input');
	backgroundCheckbox.setAttribute('type', 'checkbox');
	backgroundCheckbox.checked = graph.background == null || graph.background == mxConstants.NONE;

	td = document.createElement('td');
	td.appendChild(backgroundInput);
	td.appendChild(backgroundCheckbox);
	mxUtils.write(td, mxResources.get('transparent'));

	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('width') + ':');

	row.appendChild(td);

	var widthInput = document.createElement('input');
	widthInput.setAttribute('value', width);
	widthInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(widthInput);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('height') + ':');

	row.appendChild(td);

	var heightInput = document.createElement('input');
	heightInput.setAttribute('value', height);
	heightInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(heightInput);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('borderWidth') + ':');

	row.appendChild(td);

	var borderInput = document.createElement('input');
	borderInput.setAttribute('value', width);
	borderInput.style.width = '180px';
	borderInput.value = '0';

	td = document.createElement('td');
	td.appendChild(borderInput);
	row.appendChild(td);

	tbody.appendChild(row);
	table.appendChild(tbody);

	// Handles changes in the export format
	function formatChanged() {
		var name = nameInput.value;
		var dot = name.lastIndexOf('.');

		if (dot > 0) {
			nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
		} else {
			nameInput.value = name + '.' + imageFormatSelect.value;
		}

		if (imageFormatSelect.value === 'xml') {
			widthInput.setAttribute('disabled', 'true');
			heightInput.setAttribute('disabled', 'true');
			borderInput.setAttribute('disabled', 'true');
		} else {
			widthInput.removeAttribute('disabled');
			heightInput.removeAttribute('disabled');
			borderInput.removeAttribute('disabled');
		}

		if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg') {
			backgroundCheckbox.removeAttribute('disabled');
		} else {
			backgroundCheckbox.setAttribute('disabled', 'disabled');
		}
	};

	mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
	formatChanged();

	function checkValues() {
		if (widthInput.value * heightInput.value > MAX_AREA || widthInput.value <= 0) {
			widthInput.style.backgroundColor = 'red';
		} else {
			widthInput.style.backgroundColor = '';
		}

		if (widthInput.value * heightInput.value > MAX_AREA || heightInput.value <= 0) {
			heightInput.style.backgroundColor = 'red';
		} else {
			heightInput.style.backgroundColor = '';
		}
	};

	mxEvent.addListener(widthInput, 'change', function() {
		if (width > 0) {
			heightInput.value = Math.ceil(parseInt(widthInput.value) * height / width);
		} else {
			heightInput.value = '0';
		}

		checkValues();
	});

	mxEvent.addListener(heightInput, 'change', function() {
		if (height > 0) {
			widthInput.value = Math.ceil(parseInt(heightInput.value) * width / height);
		} else {
			widthInput.value = '0';
		}

		checkValues();
	});

	// Resuable image export instance
	var imgExport = new mxImageExport();

	function getSvg() {
		var b = Math.max(0, parseInt(borderInput.value)) + 1;
		var scale = parseInt(widthInput.value) / width;
		var bg = null;

		if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE && !backgroundCheckbox.checked) {
			bg = backgroundInput.value;
		}

		return graph.getSvg(bg, scale, b);
	};

	function getXml() {
		return mxUtils.getXml(editorUi.editor.getGraphXml());
	};

	row = document.createElement('tr');
	td = document.createElement('td');
	td.setAttribute('align', 'right');
	td.style.paddingTop = '24px';
	td.colSpan = 2;

	var saveBtn = mxUtils.button(mxResources.get('export'), mxUtils.bind(this, function() {
		if (parseInt(widthInput.value) <= 0 && parseInt(heightInput.value) <= 0) {
			mxUtils.alert(mxResources.get('drawingEmpty'));
		} else {
			var format = imageFormatSelect.value;
			var name = nameInput.value;

			if (format == 'xml') {
				editorUi.hideDialog();
				ExportDialog.saveLocalFile(getXml(), name, format);
			} else if (format == 'svg') {
				var xml = mxUtils.getXml(getSvg());

				if (xml.length < MAX_REQUEST_SIZE) {
					editorUi.hideDialog();
					ExportDialog.saveLocalFile(xml, name, format);
				} else {
					mxUtils.alert(mxResources.get('drawingTooLarge'));
					mxUtils.popup(xml);
				}
			} else {
				var param = null;
				var w = parseInt(widthInput.value) || 0;
				var h = parseInt(heightInput.value) || 0;
				var b = Math.max(0, parseInt(borderInput.value)) + 1;

				var exp = ExportDialog.getExportParameter(editorUi, format);

				if (typeof exp == 'function') {
					param = exp();
				} else {
					var scale = parseInt(widthInput.value) / width;
					var bounds = graph.getGraphBounds();
					var vs = graph.view.scale;

					// New image export
					var xmlDoc = mxUtils.createXmlDocument();
					var root = xmlDoc.createElement('output');
					xmlDoc.appendChild(root);

					// Renders graph. Offset will be multiplied with state's scale when painting state.
					var xmlCanvas = new mxXmlCanvas2D(root);
					xmlCanvas.translate(Math.floor((b / scale - bounds.x) / vs), Math.floor((b / scale - bounds.y) / vs));
					xmlCanvas.scale(scale / vs);
					imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

					// Puts request data together
					w = Math.ceil(bounds.width * scale / vs + 2 * b);
					h = Math.ceil(bounds.height * scale / vs + 2 * b);
					param = 'xml=' + encodeURIComponent(mxUtils.getXml(root));
				}

				// Requests image if request is valid
				if (param != null && param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA) {
					var bg = '&bg=none';

					if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE &&
						(format != 'png' || !backgroundCheckbox.checked)) {
						bg = '&bg=' + backgroundInput.value;
					}

					editorUi.hideDialog();
					var data = decodeURIComponent(param.substring(param.indexOf('=') + 1));
					ExportDialog.saveRequest(data, name, format,
						function(newTitle, base64) {
							// Base64 not used in this example
							return new mxXmlRequest(EXPORT_URL, 'format=' + format + '&base64=' + (base64 || '0') +
								((newTitle != null) ? '&filename=' + encodeURIComponent(newTitle) : '') +
								bg + '&w=' + w + '&h=' + h + '&border=' + b + '&' + param);
						});
				} else {
					mxUtils.alert(mxResources.get('drawingTooLarge'));
				}
			}
		}
	}));
	saveBtn.className = 'geBtn gePrimaryBtn';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst) {
		td.appendChild(cancelBtn);
		td.appendChild(saveBtn);
	} else {
		td.appendChild(saveBtn);
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Global switches for the export dialog.
 */
ExportDialog.showGifOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showXmlOption = true;

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */

ExportDialog.saveLocalFile = function(data, filename, format) {
	new mxXmlRequest(SAVE_URL, 'xml=' + encodeURIComponent(data) + '&filename=' +
		encodeURIComponent(filename) + '&format=' + format).simulate(document, '_blank');
};


/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */

ExportDialog.saveRequest = function(data, filename, format, fn) {
	fn(filename).simulate(document, '_blank');
};


/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */

ExportDialog.getExportParameter = function(ui, format) {
	return null;
};


/**
 * Constructs a new metadata dialog.
 */

var EditDataDialog = function(ui, cell) {
	var div = document.createElement('div');
	var graph = ui.editor.graph;

	div.style.height = '310px';
	div.style.overflow = 'auto';

	var value = graph.getModel().getValue(cell);

	// Converts the value to an XML node
	if (!mxUtils.isNode(value)) {
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}

	// Creates the dialog contents
	var form = new mxForm('properties');
	form.table.style.width = '100%';
	form.table.style.paddingRight = '20px';

	var attrs = value.attributes;
	var names = [];
	var texts = [];
	var count = 0;

	// FIXME: Fix remove button for quirks mode
	var addRemoveButton = function(text, name) {
		text.parentNode.style.marginRight = '12px';

		var removeAttr = document.createElement('a');
		var img = mxUtils.createImage(Dialog.prototype.closeImage);
		img.style.height = '9px';
		img.style.fontSize = '9px';
		img.style.marginBottom = '7px';

		removeAttr.className = 'geButton';
		removeAttr.setAttribute('title', mxResources.get('delete'));
		removeAttr.style.margin = '0px';
		removeAttr.style.width = '14px';
		removeAttr.style.height = '14px';
		removeAttr.style.fontSize = '14px';
		removeAttr.style.cursor = 'pointer';
		removeAttr.style.marginLeft = '6px';
		removeAttr.appendChild(img);

		var removeAttrFn = (function(name) {
			return function() {
				var count = 0;

				for (var j = 0; j < names.length; j++) {
					if (names[j] == name) {
						texts[j] = null;
						form.table.deleteRow(count);

						break;
					}

					if (texts[j] != null) {
						count++;
					}
				}
			};
		})(name);

		mxEvent.addListener(removeAttr, 'click', removeAttrFn);

		text.parentNode.style.whiteSpace = 'nowrap';
		text.parentNode.appendChild(removeAttr);
	};

	var addTextArea = function(index, name, value) {
		names[index] = name;
		texts[index] = form.addTextarea(names[count] + ':', value, 2);
		texts[index].style.width = '100%';

		addRemoveButton(texts[index], name);
	};

	for (var i = 0; i < attrs.length; i++) {
		if (attrs[i].nodeName != 'label' && attrs[i].nodeName != 'placeholders') {
			addTextArea(count, attrs[i].nodeName, attrs[i].nodeValue);
			count++;
		}
	}

	div.appendChild(form.table);

	var newProp = document.createElement('div');
	newProp.style.whiteSpace = 'nowrap';
	newProp.style.marginTop = '6px';

	var nameInput = document.createElement('input');
	nameInput.setAttribute('placeholder', mxResources.get('enterPropertyName'));
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('size', (mxClient.IS_QUIRKS) ? '18' : '22');
	nameInput.style.marginLeft = '2px';

	newProp.appendChild(nameInput);
	div.appendChild(newProp);

	var addBtn = mxUtils.button(mxResources.get('addProperty'), function() {
		if (nameInput.value.length > 0) {
			var name = nameInput.value;

			if (name != null && name.length > 0 && name != 'label' && name != 'placeholders') {
				try {
					var idx = mxUtils.indexOf(names, name);

					if (idx >= 0 && texts[idx] != null) {
						texts[idx].focus();
					} else {
						// Checks if the name is valid
						var clone = value.cloneNode(false);
						clone.setAttribute(name, '');

						if (idx >= 0) {
							names.splice(idx, 1);
							texts.splice(idx, 1);
						}

						names.push(name);
						var text = form.addTextarea(name + ':', '', 2);
						text.style.width = '100%';
						texts.push(text);
						addRemoveButton(text, name);

						text.focus();
					}

					nameInput.value = '';
				} catch (e) {
					mxUtils.alert(e);
				}
			}
		} else {
			mxUtils.alert(mxResources.get('invalidName'));
		}
	});

	this.init = function() {
		if (texts.length > 0) {
			texts[0].focus();
		} else {
			nameInput.focus();
		}
	};

	addBtn.setAttribute('disabled', 'disabled');
	addBtn.style.marginLeft = '10px';
	addBtn.style.width = '144px';
	newProp.appendChild(addBtn);

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		ui.hideDialog.apply(ui, arguments);
	});
	cancelBtn.className = 'geBtn';

	var applyBtn = mxUtils.button(mxResources.get('apply'), function() {
		try {
			ui.hideDialog.apply(ui, arguments);

			// Clones and updates the value
			value = value.cloneNode(true);

			for (var i = 0; i < names.length; i++) {
				if (texts[i] == null) {
					value.removeAttribute(names[i]);
				} else {
					value.setAttribute(names[i], texts[i].value);
				}
			}

			// Updates the value of the cell (undoable)
			graph.getModel().setValue(cell, value);
		} catch (e) {
			mxUtils.alert(e);
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';

	function updateAddBtn() {
		if (nameInput.value.length > 0) {
			addBtn.removeAttribute('disabled');
		} else {
			addBtn.setAttribute('disabled', 'disabled');
		}
	};

	mxEvent.addListener(nameInput, 'keyup', updateAddBtn);

	// Catches all changes that don't fire a keyup (such as paste via mouse)
	mxEvent.addListener(nameInput, 'change', updateAddBtn);

	var buttons = document.createElement('div');
	buttons.style.marginTop = '18px';
	buttons.style.textAlign = 'right';

	if (ui.editor.graph.getModel().isVertex(cell) || ui.editor.graph.getModel().isEdge(cell)) {
		var replace = document.createElement('span');
		replace.style.marginRight = '10px';
		var input = document.createElement('input');
		input.setAttribute('type', 'checkbox');
		input.style.marginRight = '6px';

		if (value.getAttribute('placeholders') == '1') {
			input.setAttribute('checked', 'checked');
			input.defaultChecked = true;
		}

		mxEvent.addListener(input, 'click', function() {
			if (value.getAttribute('placeholders') == '1') {
				value.removeAttribute('placeholders');
			} else {
				value.setAttribute('placeholders', '1');
			}
		});

		replace.appendChild(input);
		mxUtils.write(replace, mxResources.get('placeholders'));

		if (EditDataDialog.placeholderHelpLink != null) {
			var link = document.createElement('a');
			link.setAttribute('href', EditDataDialog.placeholderHelpLink);
			link.setAttribute('title', mxResources.get('help'));
			link.setAttribute('target', '_blank');
			link.style.marginLeft = '10px';
			link.style.cursor = 'pointer';

			var icon = document.createElement('img');
			icon.setAttribute('border', '0');
			icon.setAttribute('valign', 'middle');
			icon.style.marginTop = '-4px';
			icon.setAttribute('src', Editor.helpImage);
			link.appendChild(icon);

			replace.appendChild(link);
		}

		buttons.appendChild(replace);
	}

	if (ui.editor.cancelFirst) {
		buttons.appendChild(cancelBtn);
		buttons.appendChild(applyBtn);
	} else {
		buttons.appendChild(applyBtn);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;
};

var ValueChangeDialog = function(ui, cell) {
	var div = document.createElement('div');
	var graph = ui.editor.graph;
	
	div.style.height = '500px';
	div.style.overflow = 'auto';
	
	var value = graph.getModel().getValue(cell);
	
	// Converts the value to an XML node
	if (!mxUtils.isNode(value)) {
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}
	
	// Creates the dialog contents
	var form = new mxForm('properties');
	form.table.style.width = '100%';
	form.table.style.paddingRight = '20px';
	
	var attrs = value.attributes;
	var names = [];
	var texts = [];
	var count = 0;
	
	// FIXME: Fix remove button for quirks mode
	
	for (var i = 0; i < attrs.length; i++) {
		if (attrs[i].nodeName != 'label' && attrs[i].nodeName != 'placeholders') {
			addTextArea(count, attrs[i].nodeName, attrs[i].nodeValue);
			count++;
		}
	}
	
	div.appendChild(form.table);
	
	var newProp = document.createElement('div');
	newProp.style.whiteSpace = 'nowrap';
	newProp.style.marginTop = '6px';
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('placeholder', mxResources.get('enterPropertyName'));
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('size', (mxClient.IS_QUIRKS) ? '18' : '22');
	nameInput.style.marginLeft = '2px';
	
	newProp.appendChild(nameInput);
	div.appendChild(newProp);
	
	var addBtn = mxUtils.button(mxResources.get('addProperty'), function() {
		if (nameInput.value.length > 0) {
			var name = nameInput.value;
			
			if (name != null && name.length > 0 && name != 'label' && name != 'placeholders') {
				try {
					var idx = mxUtils.indexOf(names, name);
					
					if (idx >= 0 && texts[idx] != null) {
						texts[idx].focus();
					} else {
						// Checks if the name is valid
						var clone = value.cloneNode(false);
						clone.setAttribute(name, '');
						
						if (idx >= 0) {
							names.splice(idx, 1);
							texts.splice(idx, 1);
						}
						
						names.push(name);
						var text = form.addTextarea(name + ':', '', 2);
						text.style.width = '100%';
						texts.push(text);
						addRemoveButton(text, name);
						
						text.focus();
					}
					
					nameInput.value = '';
				} catch (e) {
					mxUtils.alert(e);
				}
			}
		} else {
			mxUtils.alert(mxResources.get('invalidName'));
		}
	});
	
	this.init = function() {
		if (texts.length > 0) {
			texts[0].focus();
		} else {
			nameInput.focus();
		}
	};
	
	addBtn.setAttribute('disabled', 'disabled');
	addBtn.style.marginLeft = '10px';
	addBtn.style.width = '144px';
	newProp.appendChild(addBtn);
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		ui.hideDialog.apply(ui, arguments);
	});
	cancelBtn.className = 'geBtn';
	
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function() {
		try {
			ui.hideDialog.apply(ui, arguments);
			
			// Clones and updates the value
			value = value.cloneNode(true);
			
			for (var i = 0; i < names.length; i++) {
				if (texts[i] == null) {
					value.removeAttribute(names[i]);
				} else {
					value.setAttribute(names[i], texts[i].value);
				}
			}
			
			// Updates the value of the cell (undoable)
			graph.getModel().setValue(cell, value);
		} catch (e) {
			mxUtils.alert(e);
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	
	function updateAddBtn() {
		if (nameInput.value.length > 0) {
			addBtn.removeAttribute('disabled');
		} else {
			addBtn.setAttribute('disabled', 'disabled');
		}
	};
	
	mxEvent.addListener(nameInput, 'keyup', updateAddBtn);
	
	// Catches all changes that don't fire a keyup (such as paste via mouse)
	mxEvent.addListener(nameInput, 'change', updateAddBtn);
	
	var buttons = document.createElement('div');
	buttons.style.marginTop = '18px';
	buttons.style.textAlign = 'right';
	
	if (ui.editor.graph.getModel().isVertex(cell) || ui.editor.graph.getModel().isEdge(cell)) {
		var replace = document.createElement('span');
		replace.style.marginRight = '10px';
		var input = document.createElement('input');
		input.setAttribute('type', 'checkbox');
		input.style.marginRight = '6px';
		
		if (value.getAttribute('placeholders') == '1') {
			input.setAttribute('checked', 'checked');
			input.defaultChecked = true;
		}
		
		mxEvent.addListener(input, 'click', function() {
			if (value.getAttribute('placeholders') == '1') {
				value.removeAttribute('placeholders');
			} else {
				value.setAttribute('placeholders', '1');
			}
		});
		
		replace.appendChild(input);
		mxUtils.write(replace, mxResources.get('placeholders'));
		
		if (EditDataDialog.placeholderHelpLink != null) {
			var link = document.createElement('a');
			link.setAttribute('href', EditDataDialog.placeholderHelpLink);
			link.setAttribute('title', mxResources.get('help'));
			link.setAttribute('target', '_blank');
			link.style.marginLeft = '10px';
			link.style.cursor = 'pointer';
			
			var icon = document.createElement('img');
			icon.setAttribute('border', '0');
			icon.setAttribute('valign', 'middle');
			icon.style.marginTop = '-4px';
			icon.setAttribute('src', Editor.helpImage);
			link.appendChild(icon);
			
			replace.appendChild(link);
		}
		
		buttons.appendChild(replace);
	}
	
	if (ui.editor.cancelFirst) {
		buttons.appendChild(cancelBtn);
		buttons.appendChild(applyBtn);
	} else {
		buttons.appendChild(applyBtn);
		buttons.appendChild(cancelBtn);
	}
	
	div.appendChild(buttons);
	this.container = div;
};
var ValueChangeDialogEX = function(ui, cell) {
    this.init = function() {
        console.log(cell);
    };
//    console.log(cell.value);
    var tIndex=0, T_MIN_VAL=0,T_MAX_VAL=500;
    var gObj = cell.value;
//    var graph = ui.editor.graph;
    var deNormalSatus=new GModel.TextDrawStyle("#F00",false);
    if(gObj.multiStatus && gObj.multiStatus.deNormalSatus){
    	var t=gObj.multiStatus.deNormalSatus;
    	deNormalSatus=new GModel.TextDrawStyle(t.textColor,t.bBLink);
    }
    var normalStatus=[new GModel.DataDrawingDef(T_MIN_VAL,T_MAX_VAL,new GModel.TextDrawStyle("#F00",false))];
    if(gObj.multiStatus && gObj.multiStatus.normalStatus && gObj.multiStatus.normalStatus.length){
    	var list=gObj.multiStatus.normalStatus;
    	normalStatus=[];
    	for(var i=0;i<list.length;i++){
    		var t=list[i].drawStyle;
    		normalStatus.push(new GModel.DataDrawingDef(list[i].lower,list[i].upper,new GModel.TextDrawStyle(t.textColor,t.bBLink)));
    	}
        T_MIN_VAL=normalStatus[0].lower;
        T_MAX_VAL=normalStatus[normalStatus.length-1].upper;
    }
    //模板
    var containerdiv = document.createElement('div');
    containerdiv.style.display = 'table';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '240px';
    containerdiv.style.height = '25px';
    var div = document.createElement('div');
    div.style.height = '500px';
    div.style.overflow = 'auto';
    //添加标题
    var titlediv = document.createElement('div');
    titlediv.style.background = '#eee';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '设置多态');
    div.appendChild(titlediv);
    
    //内容
    var con = document.createElement('div');
    con.style.height = '60%';
    con.style.width = '100%';
    con.style.overflow = 'auto';
    div.appendChild(con);
    //测点
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '指定测点id：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var valueinputMeasId = document.createElement('input');
    valueinputMeasId.className = 'param-inpt';
    valueinputMeasId.value = gObj.multiStatus?gObj.multiStatus.msMeasId:'';
    valueinputMeasId.style.width = '100px';
    valuespan2.appendChild(valueinputMeasId);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.style.height = '30px';
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //无效数据颜色
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '无效数据：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var btn = document.createElement('div');
    var apply = function (color) {
        btn.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+(color != null ? color : '#f00') + ';"></div>';
        deNormalSatus.textColor = color;
    };
	btn = mxUtils.button('', mxUtils.bind(this, function(evt){
		ui.pickColor(deNormalSatus.textColor, apply);
		mxEvent.consume(evt);
	}));
	btn.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+deNormalSatus.textColor+';"></div>';
	btn.className = 'geColorBtn';
    var rspan = document.createElement('span');
    rspan.style.marginLeft = '10px';
    mxUtils.write(rspan, '闪动：');
    var radio = document.createElement('input');
    radio.type = 'checkbox';
    radio.checked=deNormalSatus.bBLink;
    mxEvent.addListener(radio, 'click', function () {
    	deNormalSatus.bBLink = this.checked;
    });
    valuespan2.appendChild(btn);
    valuespan2.appendChild(rspan);
    valuespan2.appendChild(radio);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.style.height = '30px';
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //状态数量
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '状态数量：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
	var input = document.createElement('input');
	input.value = normalStatus.length;
	input.style.textAlign = 'right';
	input.style.width = '40px';
	input.style.height = '20px';
	input.style.position = 'absolute';
	valuespan2.appendChild(input);
	function updataVal() {
		var vLen=parseInt(input.value);
		if(isNaN(vLen) || vLen<1){
            input.value='1';
            vLen=1;
		}
		if(vLen>=normalStatus.length){
			for(var i=vLen-normalStatus.length;i>0;i--){
                normalStatus.push(new GModel.DataDrawingDef(T_MAX_VAL,T_MAX_VAL,new GModel.TextDrawStyle("#F00",false)));
			}
		}else{
            for(var i=normalStatus.length-vLen;i>0;i--){
                T_MAX_VAL=normalStatus.pop().lower;
            }
        }

    	var select=document.getElementById('dttSelect');
    	select.innerHTML='';
        for(var i=0;i<normalStatus.length;i++){
        	var op=document.createElement('option');
        	op.value=i;
        	op.innerHTML=i+1;
        	select.appendChild(op);
        }
        initDtbar();
    }
    mxEvent.addListener(input, 'change', updataVal);
	var stepper = createStepper(input, updataVal, 1, 9);
	stepper.style.position = 'absolute';
	stepper.style.marginLeft = '40px';
	valuespan2.appendChild(stepper);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.style.height = '30px';
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //表头
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.style.height = '30px';
    tempDiv.innerHTML='<div style="display:table-cell;width:40px;padding-left:5px">状态</div>'
    	+'<div style="display:table-cell;width:100px;padding-left:12px">取值范围</div>'
    	+'<div style="display:table-cell;width:60px;padding-left:10px">颜色</div>'
    	+'<div style="display:table-cell;width:40px;padding-left:10px">闪动</div>';
    con.appendChild(tempDiv);
    //状态
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.style.height = '30px';
    con.appendChild(tempDiv);
    var tdDiv=document.createElement('div');
    tdDiv.style.display='table-cell';
    tdDiv.style.width='40px';
    tempDiv.appendChild(tdDiv);
    var select=document.createElement('select');
    select.id='dttSelect';
    for(var i=0;i<normalStatus.length;i++){
    	var op=document.createElement('option');
    	op.value=i;
    	op.innerHTML=i+1;
    	select.appendChild(op);
    }
    tdDiv.appendChild(select);
    mxEvent.addListener(select, 'change', function (evt) {
    	tIndex=parseInt(select.value);
    	var min=document.getElementById('dttMin');
    	min.value=normalStatus[tIndex].lower;
    	var max=document.getElementById('dttMax');
    	max.value = normalStatus[tIndex].upper;
    	var bntC=document.getElementById('dttBtnC');
    	btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+normalStatus[tIndex].drawStyle.textColor+';"></div>';
    	var radioC=document.getElementById('dttRadioC');
    	radioC.checked=normalStatus[tIndex].drawStyle.bBLink;
    });
    //
    var tdDiv2=document.createElement('div');
    tdDiv2.style.display='table-cell';
    tdDiv2.style.width='100px';
    tempDiv.appendChild(tdDiv2);
	var min = document.createElement('input');
	min.id='dttMin';
	min.value = normalStatus[tIndex].lower;
	min.style.textAlign = 'right';
	min.style.width = '40px';
	min.style.height = '20px';
    mxEvent.addListener(min, 'change', function (evt) {
    	var val=parseInt(min.value);
    	if(!isNaN(val)){
    		val=val;
    	}else{
    		val=T_MIN_VAL;
    		this.value=T_MIN_VAL;
    	}
        min.value=val;
        if(val>T_MAX_VAL){	T_MAX_VAL=val;	}
        if(val<T_MIN_VAL){	T_MIN_VAL=val;	}
    	for(var i=0;i<tIndex;i++){
    		if(normalStatus[i].lower>val){
    			normalStatus[i].lower=val;
    		}
    		if(normalStatus[i].upper>val){
    			normalStatus[i].upper=val;
    		}
    	}
    	if(tIndex-1>=0 && val>normalStatus[tIndex-1].upper){
    		normalStatus[tIndex-1].upper=val;
    	}
    	normalStatus[tIndex].lower=val;
    	if(normalStatus[tIndex].upper<val){
    		normalStatus[tIndex].upper=val;
        	var max=document.getElementById('dttMax');
        	max.value = val;
        	for(var i=tIndex+1;i<normalStatus.length;i++){
        		if(normalStatus[i].lower<val){
        			normalStatus[i].lower=val;
        		}
        		if(normalStatus[i].upper<val){
        			normalStatus[i].upper=val;
        		}
        	}
    	}
    	initDtbar();
    });
	tdDiv2.appendChild(min);
	var max = document.createElement('input');
	max.id='dttMax'
	max.value = normalStatus[tIndex].upper;
	max.style.textAlign = 'right';
	max.style.width = '40px';
	max.style.height = '20px';
    mxEvent.addListener(max, 'change', function (evt) {
    	var val=parseInt(max.value);
    	if(!isNaN(val)){
    		val=val;
    	}else{
    		val=T_MAX_VAL;
    		this.value=T_MAX_VAL;
    	}
        max.value=val;
        if(val>T_MAX_VAL){	T_MAX_VAL=val;	}
        if(val<T_MIN_VAL){	T_MIN_VAL=val;	}
    	for(var i=tIndex+1;i<normalStatus.length;i++){
    		if(normalStatus[i].lower<val){
    			normalStatus[i].lower=val;
    		}
    		if(normalStatus[i].upper<val){
    			normalStatus[i].upper=val;
    		}
    	}
    	if(tIndex+1<normalStatus.length && val<normalStatus[tIndex+1].lower){
    		normalStatus[tIndex+1].lower=val;
    	}
    	normalStatus[tIndex].upper=val;
    	if(normalStatus[tIndex].lower>val){
    		normalStatus[tIndex].lower>val;
        	var min=document.getElementById('dttMin');
        	min.value=normalStatus[tIndex].lower;
        	for(var i=0;i<tIndex;i++){
        		if(normalStatus[i].lower>val){
        			normalStatus[i].lower=val;
        		}
        		if(normalStatus[i].upper>val){
        			normalStatus[i].upper=val;
        		}
        	}
    	}
    	initDtbar();
    });
	tdDiv2.appendChild(max);
	//
    var tdDiv3=document.createElement('div');
    tdDiv3.style.display='table-cell';
    tdDiv3.style.width='60px';
    tempDiv.appendChild(tdDiv3);
    var btnC = document.createElement('div');
    btnC.id='dttBtnC';
    var applyC = function (color) {
    	btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+(color != null ? color : '#f00') + ';"></div>';
        normalStatus[tIndex].drawStyle.textColor = color;
        initDtbar();
    };
	btnC = mxUtils.button('', mxUtils.bind(this, function(evt){
		ui.pickColor(normalStatus[tIndex].drawStyle.textColor, applyC);
		mxEvent.consume(evt);
	}));
	btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+normalStatus[tIndex].drawStyle.textColor+';"></div>';
	btnC.className = 'geColorBtn';
	tdDiv3.appendChild(btnC);
	//
    var tdDiv4=document.createElement('div');
    tdDiv4.style.display='table-cell';
    tdDiv4.style.width='40px';
    tempDiv.appendChild(tdDiv4);
    var radioC = document.createElement('input');
    radioC.id='dttRadioC'
    radioC.type = 'checkbox';
    radioC.style.position='absolute';
    radioC.style.marginLeft='15px';
    radioC.checked=normalStatus[tIndex].drawStyle.bBLink;
    mxEvent.addListener(radioC, 'click', function () {
    	normalStatus[tIndex].drawStyle.bBLink = this.checked;
    });
    tdDiv4.appendChild(radioC);
    //颜色条
    var dtbar=document.createElement('div');
    dtbar.className = 'dtbar';
    dtbar.id = 'dtbar';
	var html='';
	for(var i=0;i<normalStatus.length;i++){
		html+='<div style="width:'+(normalStatus[i].upper-normalStatus[i].lower)/T_MAX_VAL*100+'%;height:100%;background-color:'+normalStatus[i].drawStyle.textColor+';float:left;"></div>';
	}
	dtbar.innerHTML=html;
	con.appendChild(dtbar);
    function initDtbar(){
    	var dtbar=document.getElementById('dtbar');
    	var html='';
        T_MIN_VAL=normalStatus[0].lower;
        T_MAX_VAL=normalStatus[normalStatus.length-1].upper;
    	var num=(T_MAX_VAL-T_MIN_VAL)?T_MAX_VAL-T_MIN_VAL:1;
    	for(var i=0;i<normalStatus.length;i++){
    		html+='<div style="width:'+(normalStatus[i].upper-normalStatus[i].lower)/num*100+'%;height:100%;background-color:'+normalStatus[i].drawStyle.textColor+';float:left;"></div>';
    	}
    	dtbar.innerHTML=html;
    }
    
    //按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		ui.hideDialog.apply(ui, arguments);
	});
	cancelBtn.className = 'geBtn';
	var applyBtn = mxUtils.button(mxResources.get('apply'), function() {
		console.log('apply');
		var msMeasId=valueinputMeasId.value;
		if(msMeasId && msMeasId!=''){
			if(!gObj.multiStatus){
                gObj.multiStatus={};
			}
			gObj.multiStatus.deNormalSatus=deNormalSatus;
			gObj.multiStatus.normalStatus=normalStatus;
            gObj.multiStatus.msMeasId=msMeasId;
			ui.hideDialog.apply(ui, arguments);
		}else{
			alert('必须指定测点id');
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
    var buttons = document.createElement('div');
    buttons.style.marginTop = '18px';
    buttons.style.textAlign = 'right';
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(buttons);
    this.container = div;
};
var ImgUpdataDialogEX = function(ui, cell) {
	var graph = GModel.graph;
    //模板
    var containerdiv = document.createElement('div');
    containerdiv.style.display = 'table';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '240px';
    containerdiv.style.height = '25px';
    var div = document.createElement('div');
    div.style.height = '380px';
    div.style.overflow = 'auto';
    //添加标题
    var titlediv = document.createElement('div');
    titlediv.style.background = '#eee';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '选择图片');
    div.appendChild(titlediv);

    //内容
    var con = document.createElement('div');
    div.appendChild(con);
    con.innerHTML = '<input type="button" value="显示图片" onclick="showPic()"style="float:left"/>'
    	+'<form id="upload" enctype="multipart/form-data" method="post">'
    	+'<input type="file" name="file" value="上传图片" id="pic" multiple="multiple" style="float:left" '
    	+'accept="image/x-png, image/jpg, image/jpeg, image/gif">'
    	+'<input type="button" value="提交" onclick="uploadPic();"/>'
    	+'</form><div id="img_show_pics" style="height:200px;border:1px solid black;overflow-y:auto"></div>';
    var picUrl=document.createElement('div');
    picUrl.id='img_updata_dialog_picurl';
    picUrl.innerHTML='';
    picUrl.style.display='none';
    div.appendChild(picUrl);
    //按钮
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = mxUtils.button(mxResources.get('apply'), function() {
    	if(picUrl.innerHTML==''){
    		alert('未选择图片');
    	}else{
    		var purl=document.getElementById('input_image_picurl');
    		purl.value=picUrl.innerHTML;
        	graph.getModel().beginUpdate();
        	try{
        		cell.value.setAttribute('url',picUrl.innerHTML);
        	}finally{
				graph.getModel().endUpdate();
			}
    		ui.hideDialog.apply(ui, arguments);
    	}
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    var buttons = document.createElement('div');
    buttons.style.marginTop = '18px';
    buttons.style.textAlign = 'right';
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(buttons);
    this.container = div;
};
var DataIdPieDialogEX = function(ui, cell, index) {
    var graph = GModel.graph;
    var gObj = cell.value;
    if(!gObj.pieColor || gObj.pieColor.length!=gObj.dataIds.length){
    	gObj.pieColor=[];
    	for(var i=0;i<gObj.dataIds.length;i++){
    		gObj.pieColor.push('');
    	}
    }
    var pieColorList=[];
	for(var i=0;i<gObj.pieColor.length;i++){
		pieColorList.push(gObj.pieColor[i]);
	}
    //模板
    var containerdiv = document.createElement('div');
    containerdiv.style.display = 'table';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '240px';
    containerdiv.style.height = '25px';
    var div = document.createElement('div');
    div.style.height = '380px';
    div.style.overflow = 'auto';
    //添加标题
    var titlediv = document.createElement('div');
    titlediv.style.background = '#eee';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '饼图测点设置');
    div.appendChild(titlediv);

    //内容
    var con = document.createElement('div');
    div.appendChild(con);
    //测点
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '指定测点：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var select=document.createElement('select');
    select.style.width='100px';
    var opList=gObj.dataIds;
    for(var i=0;i<opList.length;i++){
        var op=document.createElement('option');
        op.value=opList[i];
        op.innerHTML='测点'+(i+1)+'：'+opList[i];
        if(index==i){
        	op.selected='selected';
        }
        select.appendChild(op);
    }
    mxEvent.addListener(select, 'change', function (evt) {
        for(var i=0;i<opList.length;i++){
            if(select.value==opList[i]){
            	index=i;
            	break;
            }
        }
        var btn=document.getElementById('pie_dataId_color');
        btn.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+pieColorList[index]+';"></div>';
    });
    valuespan2.appendChild(select);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.style.height = '30px';
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //颜色
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '颜色：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var btnC = document.createElement('button');
    var applyC = function (color) {
    	btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+(color != null ? color : '#f00') + ';"></div>';
        pieColorList[index]=color;
    };
	btnC = mxUtils.button('', mxUtils.bind(this, function(evt){
		ui.pickColor(pieColorList[index], applyC);
		mxEvent.consume(evt);
	}));
	btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+pieColorList[index]+';"></div>';
	btnC.className = 'geColorBtn';
	btnC.id='pie_dataId_color';
    valuespan2.appendChild(btnC);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.style.height = '30px';
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //按钮
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = mxUtils.button(mxResources.get('apply'), function() {
    	gObj.pieColor=pieColorList;
    	ui.hideDialog.apply(ui, arguments);
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    var buttons = document.createElement('div');
    buttons.style.marginTop = '18px';
    buttons.style.textAlign = 'right';
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(buttons);
    this.container = div;
};
var DataIdTrendDialogEX = function(ui, cell, index) {
    var graph = GModel.graph;
    var gObj = cell.value;
    if(!gObj.dataStyleList || gObj.dataStyleList.length!=gObj.dataIds.length){
        gObj.dataStyleList=[];
        for(var i=0;i<gObj.dataIds.length;i++){
            gObj.dataStyleList.push({color:'',border:'solid',width:'1',mark:'0'});
        }
    }
    var dataStyleList=[];
    for(var i=0;i<gObj.dataStyleList.length;i++){
        dataStyleList.push(gObj.dataStyleList[i]);
    }
    var bTempList=['solid','dotted','dashed','bold'];
    var wTempList=['1','2','3','4','5'];
    var mTempList=['●','○','◆','◇','■','□','▲','△','+','✕','✲'];
    //模板
    var containerdiv = document.createElement('div');
    containerdiv.className='table_div';
    var div = document.createElement('div');
    div.style.height = '380px';
    div.style.overflow = 'auto';
    //添加标题
    var titlediv = document.createElement('div');
    titlediv.style.background = '#eee';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '趋势图测点设置');
    div.appendChild(titlediv);

    //内容
    var con = document.createElement('div');
    div.appendChild(con);
    //测点
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '指定测点：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var select=document.createElement('select');
    select.style.width='100px';
    var opList=gObj.dataIds;
    for(var i=0;i<opList.length;i++){
        var op=document.createElement('option');
        op.value=opList[i];
        op.innerHTML='测点'+(i+1)+'：'+opList[i];
        if(index==i){
            op.selected='selected';
        }
        select.appendChild(op);
    }
    mxEvent.addListener(select, 'change', function (evt) {
        for(var i=0;i<opList.length;i++){
            if(select.value==opList[i]){
                index=i;
                break;
            }
        }
        document.getElementById('pie_dataId_color').innerHTML='<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+dataStyleList[index].color+';"></div>';
        document.getElementById("dt_border_style").innerHTML='<span class="'+dataStyleList[index].border+'"></span>';
        document.getElementById("dt_border_width").innerHTML='<span style="border-bottom:'+dataStyleList[index].width+'px solid #666;"></span>';
        document.getElementById("dt_border_mark").innerHTML=mTempList[dataStyleList[index].mark];
    });
    valuespan2.appendChild(select);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //标记类型
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '标记类型：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var bLine=document.createElement('div');
    bLine.className='borderul show-line';
    bLine.style.textAlign='center';
    bLine.id='dt_border_mark';
    bLine.innerHTML=mTempList[dataStyleList[index].mark];
    mxEvent.addListener(bLine, 'click', function (evt) {
        document.getElementById("dt_border_mark_list").style.display="inline";
    });
    var bBox=document.createElement('div');
    bBox.className='borderul show-box';
    bBox.style.textAlign='center';
    bBox.id='dt_border_mark_list';
    var ul=document.createElement('ul');
    bBox.appendChild(ul);
    for(var i=0;i<mTempList.length;i++){
        var li=document.createElement('li');
        li.name=i;
        li.innerHTML=mTempList[i];
        mxEvent.addListener(li, 'click', function (evt) {
            document.getElementById("dt_border_mark").innerHTML=mTempList[this.name];
            dataStyleList[index].mark=this.name;
            document.getElementById("dt_border_mark_list").style.display="none";
        });
        ul.appendChild(li);
	}
    valuespan2.appendChild(bLine);
    valuespan2.appendChild(bBox);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //颜色
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '颜色：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var btnC = document.createElement('button');
    var applyC = function (color) {
        btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+(color != null ? color : '#f00') + ';"></div>';
        dataStyleList[index].color=color;
    };
    btnC = mxUtils.button('', mxUtils.bind(this, function(evt){
        ui.pickColor(dataStyleList[index].color, applyC);
        mxEvent.consume(evt);
    }));
    btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+dataStyleList[index].color+';"></div>';
    btnC.className = 'geColorBtn';
    btnC.id='pie_dataId_color';
    valuespan2.appendChild(btnC);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //曲线样式
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '曲线样式：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var bLine=document.createElement('div');
    bLine.className='borderul show-line';
    bLine.id='dt_border_style';
    bLine.innerHTML='<span class="'+dataStyleList[index].border+'"></span>';
    mxEvent.addListener(bLine, 'click', function (evt) {
        document.getElementById("dt_border_style_list").style.display="inline";
    });
    var bBox=document.createElement('div');
    bBox.className='borderul show-box';
    bBox.id='dt_border_style_list';
    var ul=document.createElement('ul');
    bBox.appendChild(ul);
    bTempList.forEach(function (styleName) {
        var li=document.createElement('li');
        li.name=styleName;
        li.innerHTML='<span class="'+styleName+'"></span>';
        mxEvent.addListener(li, 'click', function (evt) {
            document.getElementById("dt_border_style").innerHTML='<span class="'+this.name+'"></span>';
            dataStyleList[index].border=this.name;
            document.getElementById("dt_border_style_list").style.display="none";
        });
        ul.appendChild(li);
    });
    valuespan2.appendChild(bLine);
    valuespan2.appendChild(bBox);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //线宽
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '线宽：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var bLine=document.createElement('div');
    bLine.className='borderul show-line';
    bLine.id='dt_border_width';
    bLine.innerHTML='<span style="border-bottom:'+dataStyleList[index].width+'px solid #666;"></span>';
    mxEvent.addListener(bLine, 'click', function (evt) {
        document.getElementById("dt_border_width_list").style.display="inline";
    });
    var bBox=document.createElement('div');
    bBox.className='borderul show-box';
    bBox.id='dt_border_width_list';
    var ul=document.createElement('ul');
    bBox.appendChild(ul);
    wTempList.forEach(function (width) {
        var li=document.createElement('li');
        li.name=width;
        li.innerHTML='<span style="border-bottom:'+width+'px solid #666;"></span>';
        mxEvent.addListener(li, 'click', function (evt) {
            document.getElementById("dt_border_width").innerHTML='<span style="border-bottom:'+this.name+'px solid #666;"></span>';
            dataStyleList[index].width=this.name;
            document.getElementById("dt_border_width_list").style.display="none";
        });
        ul.appendChild(li);
    });
    valuespan2.appendChild(bLine);
    valuespan2.appendChild(bBox);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //按钮
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = mxUtils.button(mxResources.get('apply'), function() {
        gObj.dataStyleList=dataStyleList;
        ui.hideDialog.apply(ui, arguments);
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    var buttons = document.createElement('div');
    buttons.style.marginTop = '18px';
    buttons.style.textAlign = 'right';
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(buttons);
    this.container = div;
};
function createStepper (input, update, step, height, minVal, maxVal) {
	if(!minVal){
        minVal=1;
	}
    if(!maxVal){
        maxVal=100;
    }
    step = (step != null) ? step : 1;
    height = (height != null) ? height : 8;
    var stepper = document.createElement('div');
    mxUtils.setPrefixedStyle(stepper.style, 'borderRadius', '3px');
    stepper.style.border = '1px solid rgb(192, 192, 192)';
    stepper.style.width = '12px';
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
    mxEvent.addListener(down, 'click', function (evt) {
        if (input.value == '') {
            input.value = '2';
        }
        var val = parseInt(input.value);
        if (!isNaN(val)) {
            if (val-step>=minVal){
            	input.value = val - step;
                if (update != null) {
                    update(evt);
                }
            }
        }
        mxEvent.consume(evt);
    });
    mxEvent.addListener(up, 'click', function (evt) {
        if (input.value == '') {
            input.value = '0';
        }
        var val = parseInt(input.value);
        if (!isNaN(val)) {
            if (val+step<=maxVal){
                input.value = val + step;
                if (update != null) {
                    update(evt);
                }
            }
        }
        mxEvent.consume(evt);
    });
    return stepper;
};
var lineDynamicStyleDialogEX = function(ui, cell) {
    var graph = GModel.graph;
    var gObj = cell;
    var lineDynamicStyle={
        msMeasId:'',
        direction:'5200',
        speed:'normal',
        type:'electric',
        style:'dashed',
        color:'#f00'
	};
    if(gObj.lineDynamicStyle){
        lineDynamicStyle={
            msMeasId:gObj.lineDynamicStyle.msMeasId,
            direction:gObj.lineDynamicStyle.direction,
            speed:gObj.lineDynamicStyle.speed,
            type:gObj.lineDynamicStyle.type,
            style:gObj.lineDynamicStyle.style,
            color:gObj.lineDynamicStyle.color
        };
    }
    //模板
    var containerdiv = document.createElement('div');
    containerdiv.style.display = 'table';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '240px';
    containerdiv.style.height = '30px';
    var div = document.createElement('div');
    div.style.height = '380px';
    div.style.overflow = 'auto';
    //添加标题
    var titlediv = document.createElement('div');
    titlediv.style.background = '#eee';
    titlediv.style.marginBottom = '8px';
    titlediv.style.fontWeight = 'bold';
    mxUtils.write(titlediv, '线路动态样式');
    div.appendChild(titlediv);

    //内容
    var con = document.createElement('div');
    div.appendChild(con);
    //测点
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '测点：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var valueinputMeasId = document.createElement('input');
    valueinputMeasId.className = 'param-inpt';
    valueinputMeasId.value = lineDynamicStyle.msMeasId;
    valueinputMeasId.style.width = '100px';
    mxEvent.addListener(valueinputMeasId, 'change', function () {
        lineDynamicStyle.msMeasId=this.value;
    });
    valuespan2.appendChild(valueinputMeasId);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //方向
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '方向：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var leftImg = document.createElement('img');
    leftImg.src='static/images/triangle-left.png';
    leftImg.style.width='15px';
    leftImg.style.height='23px';
    leftImg.style.marginRight='5px';
    valuespan2.appendChild(leftImg);
    var direction = document.createElement('input');
    direction.className = 'param-inpt';
    direction.value = lineDynamicStyle.direction;
    direction.style.width = '60px';
    mxEvent.addListener(direction, 'change', function () {
        lineDynamicStyle.direction=this.value;
    });
    valuespan2.appendChild(direction);
    var rightImg = document.createElement('img');
    rightImg.src='static/images/triangle-right.png';
    rightImg.style.width='15px';
    rightImg.style.height='23px';
    rightImg.style.marginLeft='5px';
    valuespan2.appendChild(rightImg);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //速度
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '速度：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var select=document.createElement('select');
    select.style.width='100px';
    var opList=['slow','normal','fast'];
    for(var i=0;i<opList.length;i++){
        var op=document.createElement('option');
        op.value=opList[i];
        op.innerHTML=mxResources.get(opList[i]);
        if(opList[i]==lineDynamicStyle.speed){
            op.selected='selected';
        }
        select.appendChild(op);
    }
    mxEvent.addListener(select, 'change', function (evt) {
        lineDynamicStyle.speed=this.value;
    });
    valuespan2.appendChild(select);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //类型
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '类型：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var select=document.createElement('select');
    select.style.width='100px';
    var opList=['electric','water','gas','steam','compress','cold','heat'];
    for(var i=0;i<opList.length;i++){
        var op=document.createElement('option');
        op.value=opList[i];
        op.innerHTML=mxResources.get(opList[i]);
        if(opList[i]==lineDynamicStyle.type){
            op.selected='selected';
        }
        select.appendChild(op);
    }
    mxEvent.addListener(select, 'change', function (evt) {
        lineDynamicStyle.type=this.value;
    });
    valuespan2.appendChild(select);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //样式
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '类型：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var select=document.createElement('select');
    select.style.width='100px';
    var opList=['dashed','block','circular'];
    for(var i=0;i<opList.length;i++){
        var op=document.createElement('option');
        op.value=opList[i];
        op.innerHTML=mxResources.get(opList[i]);
        if(opList[i]==lineDynamicStyle.style){
            op.selected='selected';
        }
        select.appendChild(op);
    }
    mxEvent.addListener(select, 'change', function (evt) {
        lineDynamicStyle.style=this.value;
    });
    valuespan2.appendChild(select);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);
    //颜色
    var valuespan = document.createElement('div');
    valuespan.style.lineHeight = '25px';
    valuespan.style.display = 'table-cell';
    valuespan.style.width = '80px';
    mxUtils.write(valuespan, '颜色：');
    var valuespan2 = document.createElement('div');
    valuespan2.style.display = 'table-cell';
    var btnC = document.createElement('button');
    var applyC = function (color) {
        btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+(color != null ? color : '#f00') + ';"></div>';
        lineDynamicStyle.color=color;
    };
    btnC = mxUtils.button('', mxUtils.bind(this, function(evt){
        ui.pickColor(lineDynamicStyle.color, applyC);
        mxEvent.consume(evt);
    }));
    btnC.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+lineDynamicStyle.color+';"></div>';
    btnC.className = 'geColorBtn';
    valuespan2.appendChild(btnC);
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(valuespan);
    tempDiv.appendChild(valuespan2);
    con.appendChild(tempDiv);

    //按钮
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = mxUtils.button(mxResources.get('apply'), function() {
    	gObj.lineDynamicStyle=lineDynamicStyle;
    	ui.hideDialog.apply(ui, arguments);
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    var buttons = document.createElement('div');
    buttons.style.marginTop = '18px';
    buttons.style.textAlign = 'right';
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(buttons);
    this.container = div;
};
/**
 * 组合图元面板编辑窗
 */
var LibraryDialogEX = function (sidebar, metaId, itemname, filename, content, cellList, file, mode) {
    var editorUi=sidebar.editorUi;
    var outer = document.createElement('div');
    outer.style.height = '100%';

    var header = document.createElement('div');
    header.style.whiteSpace = 'nowrap';
    header.style.height = '40px';
    outer.appendChild(header);
    mxUtils.write(header, mxResources.get('filename') + ':');
    var nameInput = document.createElement('input');
    nameInput.setAttribute('value', filename);
    nameInput.style.marginRight = '20px';
    nameInput.style.marginLeft = '10px';
    nameInput.style.width = '500px';
    header.appendChild(nameInput);

    var div = document.createElement('div');
    div.style.borderWidth = '1px 0px 1px 0px';
    div.style.borderColor = '#d3d3d3';
    div.style.borderStyle = 'solid';
    div.style.marginTop = '6px';
    div.style.overflow = 'auto';
    div.style.height = '340px';
    div.style.backgroundPosition = 'center center';
    div.style.backgroundRepeat = 'no-repeat';

    var stopEditing = null;
    var stopWrapper = function (evt) {
        var source = mxEvent.getSource(evt);

        if (source.getAttribute('contentEditable') != 'true' && stopEditing != null) {
            stopEditing();
            stopEditing = null;

            mxEvent.consume(evt);
        }
    };
    mxEvent.addListener(div, 'mousedown', stopWrapper);
    mxEvent.addListener(div, 'pointerdown', stopWrapper);
    mxEvent.addListener(div, 'touchstart', stopWrapper);
    function addButton(node, w, h, entry) {
        var iw = w;
        var ih = h;
        var wrapper = document.createElement('div');
        wrapper.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
        wrapper.style.position = 'relative';
        wrapper.style.cursor = 'move';
        mxUtils.setPrefixedStyle(wrapper.style, 'transition', 'transform .1s ease-in-out');

        var elt = document.createElement('div');
        elt.className = 'geItem';
        elt.style.cursor = 'auto';
        elt.style.overflow = 'hidden';
        elt.style.width = iw + 'px';
        elt.style.height = ih + 'px';
        elt.style.margin = '10px';
        elt.appendChild(node);
        wrapper.appendChild(elt);

        var rem = document.createElement('img');
        rem.setAttribute('src', IMAGE_PATH + '/delete2.png');
        rem.setAttribute('border', '0');
        rem.setAttribute('title', mxResources.get('delete'));
        rem.setAttribute('align', 'top');
        rem.style.paddingTop = '4px';
        rem.style.marginLeft = '-22px';
        rem.style.cursor = 'pointer';
        rem.style.position = 'relative';
        mxEvent.addListener(rem, 'click', function (evt) {
        	for(var i=0;i<cellList.length;i++){
        		if(entry==cellList[i]){
                    cellList.splice(i, 1);
                    break;
				}
			}
            wrapper.parentNode.removeChild(wrapper);
            mxEvent.consume(evt);
        });
        mxEvent.addListener(rem, 'dblclick', function (evt) {
            mxEvent.consume(evt);
        });
        wrapper.appendChild(rem);
        wrapper.style.marginBottom = '30px';

        var label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.boxSizing = 'border-box';
        label.style.bottom = '-18px';
        label.style.left = '10px';
        label.style.right = '10px';
        label.style.backgroundColor = '#ffffff';
        label.style.overflow = 'hidden';
        label.style.textAlign = 'center';
        function updateLabel() {
            label.innerHTML = '';
            label.style.cursor = 'pointer';
            label.style.whiteSpace = 'nowrap';
            label.style.textOverflow = 'ellipsis';
            mxUtils.write(label, (entry.title!=null&&entry.title!='') ? entry.title : mxResources.get('untitled'));
            if (entry.title == null || entry.title=='') {
                label.style.color = '#d0d0d0';
            } else {
                label.style.color = '';
            }
        };
        mxEvent.addListener(label, 'keydown', function (evt) {
            if (evt.keyCode == 13 && stopEditing != null) {
                stopEditing();
                stopEditing = null;
                mxEvent.consume(evt);
            }
        });
        updateLabel();
        wrapper.appendChild(label);
        div.appendChild(wrapper);

        var startEditing = function (evt) {
            // Workaround for various issues in IE
            if (!mxClient.IS_IOS && !mxClient.IS_QUIRKS && !mxClient.IS_FF && (document.documentMode == null || document.documentMode > 9)) {
                if (label.getAttribute('contentEditable') != 'true') {
                    if (stopEditing != null) {
                        stopEditing();
                        stopEditing = null;
                    }
                    if (entry.title == null || entry.title.length == 0) {
                        label.innerHTML = '';
                    }

                    label.style.textOverflow = '';
                    label.style.whiteSpace = '';
                    label.style.cursor = 'text';
                    label.style.color = '';
                    label.setAttribute('contentEditable', 'true');
                    label.focus();
                    document.execCommand('selectAll', false, null);

                    stopEditing = function () {
                        label.removeAttribute('contentEditable');
                        label.style.cursor = 'pointer';
                        entry.title = label.innerHTML;
                        updateLabel();
                    };
                    mxEvent.consume(evt);
                }
            } else {
                var dlg = new FilenameDialog(editorUi, entry.title || '', mxResources.get('ok'), function (newTitle) {
                    if (newTitle != null) {
                        entry.title = newTitle;
                        updateLabel();
                    }
                }, mxResources.get('enterValue'));
                editorUi.showDialog(dlg.container, 300, 80, true, true);
                dlg.init();
                mxEvent.consume(evt);
            }
        };
        mxEvent.addListener(label, 'click', startEditing);
        mxEvent.addListener(wrapper, 'dblclick', startEditing);
    }
    if (cellList != null) {
        var width=120,height=100;
        for (var i = 0; i < cellList.length; i++) {
        	var cell=cellList[i];
        	sidebar.graph.labelsVisible=true;
            sidebar.graph.view.scaleAndTranslate(1, 0, 0);
            sidebar.graph.addCells([cell]);
            var bounds = sidebar.graph.getGraphBounds();
            var s = Math.floor(Math.min((width - 2 * sidebar.thumbBorder) / bounds.width,
                        (height - 2 * sidebar.thumbBorder) / bounds.height) * 100) / 100;
            sidebar.graph.view.scaleAndTranslate(s, Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
                Math.floor((height - bounds.height * s) / 2 / s - bounds.y));
            var node = sidebar.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
            sidebar.graph.getModel().clear();
            addButton(node, width, height, cell);
        }
    }
    outer.appendChild(div);

    var btns = document.createElement('div');
    btns.style.textAlign = 'right';
    btns.style.marginTop = '20px';
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog(true);
    });
    cancelBtn.setAttribute('id', 'btnCancel');
    cancelBtn.className = 'geBtn';
    btns.appendChild(cancelBtn);

    var btn = mxUtils.button(mxResources.get('export'), function () {
        if (stopEditing != null) {
            stopEditing();
            stopEditing = null;
        }
        var data = editorUi.editor.graph.compress(mxUtils.getXml(editorUi.editor.graph.encodeCells(cellList)));
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([data], {type: 'text/xml'}));
        a.download = nameInput.value;
        document.body.appendChild(a);
        try {
            window.setTimeout(function () {
                URL.revokeObjectURL(a.href);
            }, 0);
            a.click();
            a.parentNode.removeChild(a);
        }
        catch (e) {
            // ignore
        }
    });
    btn.setAttribute('id', 'btnDownload');
    btn.className = 'geBtn';
    btns.appendChild(btn);

    var fileInput = document.createElement('input');
    fileInput.setAttribute('multiple', 'multiple');
    fileInput.setAttribute('type', 'file');
    mxEvent.addListener(fileInput, 'change', function (evt) {
        var resultFile = fileInput.files[0];
        if (resultFile) {
            var reader = new FileReader();
            reader.readAsText(resultFile,'UTF-8');
            reader.onloadstart = function(){
                console.log('load start...');  //开始读取
            };
            reader.onload = function (e) {
                var urlData = this.result;
                var cells=sidebar.editorUi.stringToCells(urlData);
                if(cells && cells.length){
                	while(cellList.length){
                        cellList.pop();
					}
					cells.forEach(function (cell) {
                        cellList.push(cell);
                    });
                    sidebar.initCustomData(content, cellList);
                    if(itemname){
                        localStorage.setItem(itemname, urlData);
                    }
                    if(metaId){
                        sidebar.updataModelPaletteByMetaId(metaId, urlData);
                    }
				}else{
                	alert('读取失败，文件数据损坏');
				}
                editorUi.hideDialog(true);
            };
        }
        div.scrollTop = div.scrollHeight;
    });
    var btn = mxUtils.button(mxResources.get('import'), function () {
        if (stopEditing != null) {
            stopEditing();
            stopEditing = null;
        }
        fileInput.click();
    });
    btn.setAttribute('id', 'btnAddImage');
    btn.className = 'geBtn';
    btns.appendChild(btn);

    var btn = mxUtils.button(mxResources.get('save'), mxUtils.bind(this, function () {
        if (stopEditing != null) {
            stopEditing();
            stopEditing = null;
        }
        sidebar.initCustomData(content, cellList);
        var xml = editorUi.editor.graph.compress(mxUtils.getXml(editorUi.editor.graph.encodeCells(cellList)));
        if(itemname){
            localStorage.setItem(itemname, xml);
        }
        if(metaId){
            sidebar.updataModelPaletteByMetaId(metaId, xml);
        }
        editorUi.hideDialog(true);
    }));
    btn.setAttribute('id', 'btnSave');
    btn.className = 'geBtn gePrimaryBtn';
    btns.appendChild(btn);

    outer.appendChild(btns);

    this.container = outer;
};
/**
 * 图元模型编辑面板
 */
var graphEditDialog = function(ui, cells, borderLength, sidebar, metaId, sidebarContentDiv) {
    var editorUi=ui;
    var outer = document.createElement('div');
    outer.style.height = '100%';
    //用于初始化select标签
    function setSelectOp(select, opList, selected) {
        select.innerHTML='';
        for(var i=0;i<opList.length;i++){
            var op=document.createElement('option');
            op.value=opList[i];
            op.innerHTML=mxResources.get(opList[i]);
            if(opList[i]==selected){
                op.selected='selected';
            }
            select.appendChild(op);
        }
    }
    var devObj={
    	devName:'未命名',
        gobjType:'GElectric',
		devStatus:'noStatus',
		statusList:[new GModel.StatusDrawingDef('0', 'noStatus')]
	};
    //模型宽高
    var boundsWidth=60,boundsHeight=80;
//头部标题
    var header = document.createElement('div');
    header.style.whiteSpace = 'nowrap';
    header.style.height = '40px';
    outer.appendChild(header);
    mxUtils.write(header, '测试窗口');
//中部
    var mainDiv = document.createElement('div');
    mainDiv.style.borderWidth = '1px 0px 1px 0px';
    mainDiv.style.borderColor = '#d3d3d3';
    mainDiv.style.borderStyle = 'solid';
    mainDiv.style.marginTop = '6px';
    mainDiv.style.overflow = 'auto';
    mainDiv.style.height = '340px';
    mainDiv.style.backgroundPosition = 'center center';
    mainDiv.style.backgroundRepeat = 'no-repeat';
    outer.appendChild(mainDiv);
    var leftDiv=document.createElement('div');
    leftDiv.style.height='100%';
    leftDiv.style.width='45%';
    leftDiv.style.float='left';
    mainDiv.appendChild(leftDiv);
    var rightDiv=document.createElement('div');
    rightDiv.style.height='100%';
    rightDiv.style.width='55%';
    rightDiv.style.float='left';
    // rightDiv.style.backgroundColor='#00f';
    mainDiv.appendChild(rightDiv);
    //模板
    var containerdiv = document.createElement('div');
    containerdiv.style.display = 'table';
    containerdiv.style.overflow = 'hidden';
    containerdiv.style.whiteSpace = 'nowrap';
    containerdiv.style.width = '240px';
    containerdiv.style.height = '26px';
//左侧
//图元名称
    var label = document.createElement('div');
    label.style.lineHeight = '25px';
    label.style.display = 'table-cell';
    label.style.width = '80px';
    mxUtils.write(label, '图元名称：');
    var valuespan = document.createElement('div');
    valuespan.style.display = 'table-cell';
    var input = document.createElement('input');
    input.className = 'param-inpt';
    input.value = devObj.devName;
    input.style.width = '100px';
    input.style.height = '22px';
    valuespan.appendChild(input);
    mxEvent.addListener(input, 'change', function () {
    	devObj.devName=this.value;
    });
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(label);
    tempDiv.appendChild(valuespan);
    leftDiv.appendChild(tempDiv);
//设备类别
    var label = document.createElement('div');
    label.style.lineHeight = '25px';
    label.style.display = 'table-cell';
    label.style.width = '80px';
    mxUtils.write(label, '设备类别：');
    var valuespan = document.createElement('div');
    valuespan.style.display = 'table-cell';
    var selectTypy=document.createElement('select');
    selectTypy.style.width='100px';
    var opList=[];
    for(var key in GModel.EnumElectricType){
        opList.push(GModel.EnumElectricType[key]);
    }
    setSelectOp(selectTypy, opList, devObj.devType);
    valuespan.appendChild(selectTypy);
    mxEvent.addListener(selectTypy, 'change', function (evt) {
        devObj.gobjType=this.value;
        //设备类型影响状态列表
        if(devObj.gobjType=='GElectricSwitch'){//开关模型
            devObj.devStatus='on';
            setSelectOp(selectStatus, ['on', 'off'], devObj.devStatusv);
            devObj.statusList=[];
            devObj.statusList.push(new GModel.StatusDrawingDef('0', 'on', cells));
            devObj.statusList.push(new GModel.StatusDrawingDef('1', 'off', cells));
        }else{//通用模型
            devObj.devStatus='noStatus';
            setSelectOp(selectStatus, ['noStatus'], devObj.devStatusv);
            devObj.statusList=[];
            devObj.statusList.push(new GModel.StatusDrawingDef('0', 'noStatus', cells));
		}
    });
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(label);
    tempDiv.appendChild(valuespan);
    leftDiv.appendChild(tempDiv);
//状态列表
    var label = document.createElement('div');
    label.style.lineHeight = '25px';
    label.style.display = 'table-cell';
    label.style.width = '80px';
    mxUtils.write(label, '状态列表：');
    var valuespan = document.createElement('div');
    valuespan.style.display = 'table-cell';
    var selectStatus=document.createElement('select');
    selectStatus.style.width='100px';
    setSelectOp(selectStatus, ['noStatus'], devObj.devStatusv);
    valuespan.appendChild(selectStatus);
    mxEvent.addListener(selectStatus, 'change', function (evt) {
    	//记录当前状态
        for(var i=0;i<devObj.statusList.length;i++){
            if(devObj.statusList[i].statusName==devObj.devStatus){
                devObj.statusList[i]=new GModel.StatusDrawingDef(i, devObj.devStatus, cells);
                break;
            }
        }
        //状态变更
        devObj.devStatus=this.value;
		//绘制新状态
        for(var i=0;i<devObj.statusList.length;i++){
            if(devObj.statusList[i].statusName==devObj.devStatus){
                graph.model.clear();
                graph.addCells(devObj.statusList[i].shapeList);
                cells=devObj.statusList[i].shapeList;
                break;
            }
        }
    });
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(label);
    tempDiv.appendChild(valuespan);
    leftDiv.appendChild(tempDiv);
//模型宽高
    var label = document.createElement('div');
    label.style.lineHeight = '25px';
    label.style.display = 'table-cell';
    label.style.width = '80px';
    mxUtils.write(label, '模型宽高：');
    var valuespan = document.createElement('div');
    valuespan.style.display = 'table-cell';
    var inputWidth = document.createElement('input');
    inputWidth.className = 'param-inpt';
    inputWidth.value = boundsWidth;
    inputWidth.style.width = '30px';
    inputWidth.style.height = '22px';
    valuespan.appendChild(inputWidth);
    mxEvent.addListener(inputWidth, 'change', function () {
        if(!isNaN(parseInt(this.value))){
            boundsWidth=this.value;
            graph.view.validateBackground(true);
        }
    });
    var inputHeight = document.createElement('input');
    inputHeight.className = 'param-inpt';this.value;
    inputHeight.value = boundsHeight;
    inputHeight.style.width = '30px';
    inputHeight.style.height = '22px';
    valuespan.appendChild(inputHeight);
    mxEvent.addListener(inputHeight, 'change', function () {
        if(!isNaN(parseInt(this.value))){
            boundsHeight=this.value;
            graph.view.validateBackground(true);
        }
    });
    var tempDiv = containerdiv.cloneNode(false);
    tempDiv.appendChild(label);
    tempDiv.appendChild(valuespan);
    leftDiv.appendChild(tempDiv);
//视图
    var container = document.createElement('div');
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.style.width = borderLength+'px';
    container.style.height = borderLength+'px';
    container.style.cursor = 'default';
    container.style.borderStyle = 'solid';
    container.style.borderWidth = '1px';
    document.body.appendChild(container);
    var graph = new Graph(container, null, null, editorUi.editor.graph.getStylesheet());
    //绘制网格,立即執行函數防止变量污染
    (function () {
        try {
            var canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0px';
            canvas.style.left = '0px';
            canvas.style.zIndex = -1;
            graph.container.appendChild(canvas);
            var ctx = canvas.getContext('2d');
            var mxGraphViewIsContainerEvent = mxGraphView.prototype.isContainerEvent;
            mxGraphView.prototype.isContainerEvent = function (evt) {
                return mxGraphViewIsContainerEvent.apply(this, arguments) ||
                    mxEvent.getSource(evt) == canvas;
            };
            var s = 0;
            var gs = 0;
            var tr = new mxPoint();
            var w = 0;
            var h = 0;
            function repaintGrid(isRedraw) {
                if (ctx != null) {
                    var bounds = graph.getGraphBounds();
                    var width = Math.max(bounds.x + bounds.width, graph.container.clientWidth);
                    var height = Math.max(bounds.y + bounds.height, graph.container.clientHeight);
                    var sizeChanged = width != w || height != h;

                    if (graph.view.scale != s || graph.view.translate.x != tr.x || graph.view.translate.y != tr.y ||
                        gs != graph.gridSize || sizeChanged || isRedraw) {
                        tr = graph.view.translate.clone();
                        s = graph.view.scale;
                        gs = graph.gridSize;
                        w = width;
                        h = height;

                        // Clears the background if required
                        if (!sizeChanged) {
                            ctx.clearRect(0, 0, w, h);
                        }
                        else {
                            canvas.setAttribute('width', w);
                            canvas.setAttribute('height', h);
                        }

                        var tx = tr.x * s;
                        var ty = tr.y * s;

                        // Sets the distance of the grid lines in pixels
                        var minStepping = graph.gridSize;
                        var stepping = minStepping * s;

                        if (stepping < minStepping) {
                            var count = Math.round(Math.ceil(minStepping / stepping) / 2) * 2;
                            stepping = count * stepping;
                        }

                        var xs = Math.floor((0 - tx) / stepping) * stepping + tx;
                        var xe = Math.ceil(w / stepping) * stepping;
                        var ys = Math.floor((0 - ty) / stepping) * stepping + ty;
                        var ye = Math.ceil(h / stepping) * stepping;

                        xe += Math.ceil(stepping);
                        ye += Math.ceil(stepping);

                        var ixs = Math.round(xs);
                        var ixe = Math.round(xe);
                        var iys = Math.round(ys);
                        var iye = Math.round(ye);

                        // Draws the actual grid
                        ctx.strokeStyle = '#f6f6f6';
                        ctx.beginPath();

                        for (var x = xs; x <= xe; x += stepping) {
                            x = Math.round((x - tx) / stepping) * stepping + tx;
                            var ix = Math.round(x);

                            ctx.moveTo(ix + 0.5, iys + 0.5);
                            ctx.lineTo(ix + 0.5, iye + 0.5);
                        }

                        for (var y = ys; y <= ye; y += stepping) {
                            y = Math.round((y - ty) / stepping) * stepping + ty;
                            var iy = Math.round(y);

                            ctx.moveTo(ixs + 0.5, iy + 0.5);
                            ctx.lineTo(ixe + 0.5, iy + 0.5);
                        }

                        ctx.closePath();
                        ctx.stroke();
                        // Draws the model bounds
                        var bdx=(borderLength-boundsWidth*s)/2-0.5,
							bdy=(borderLength-boundsHeight*s)/2-0.5;
                        if(bdx>=0 && bdy>=0){
                            ctx.strokeStyle = '#d22';
                            // ctx.lineWidth = 2;
                            ctx.strokeRect(bdx,bdy,boundsWidth*s,boundsHeight*s);
                        }
                    }
                }
            };
        }
        catch (e) {
            mxLog.show();
            mxLog.debug('Using background image');
            container.style.backgroundImage = 'url(\''+IMAGE_PATH+'/grid.gif\')';
        }
        var mxGraphViewValidateBackground = mxGraphView.prototype.validateBackground;
        mxGraphView.prototype.validateBackground = function (isRedraw) {
            mxGraphViewValidateBackground.apply(this, arguments);
            repaintGrid(isRedraw);
        };
    })();
    graph.gridSize = 5;
    graph.setConnectable(false);
    graph.allowAutoPanning=false;
    graph.model.clear();
    graph.addCells(cells);
    graph.dblClick=function (evt) {};//Graph默认dblClick事件会强制添加cell
    graph.getSelectionModel().addListener(mxEvent.CHANGE, initShapeProperty);
    graph.getModel().addListener(mxEvent.CHANGE, initShapeProperty);
    leftDiv.appendChild(container);
    var viewZoom = document.createElement('div');
    viewZoom.style.position = 'relative';
    viewZoom.style.top = (2-borderLength)+'px';
    viewZoom.style.left = '2px';
    viewZoom.appendChild(mxUtils.button('+', function () {
        graph.zoomIn();
    }));
    viewZoom.appendChild(mxUtils.button('-', function () {
        graph.zoomOut();
    }));
    leftDiv.appendChild(viewZoom);
//底层按钮
    var btns = document.createElement('div');
    btns.style.textAlign = 'right';
    btns.style.marginTop = '20px';
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog(true);
    });
    cancelBtn.setAttribute('id', 'btnCancel');
    cancelBtn.className = 'geBtn';
    btns.appendChild(cancelBtn);
    var btn = mxUtils.button(mxResources.get('save'), mxUtils.bind(this, function () {
        var modelBounds=new mxCell('', new mxGeometry((borderLength-boundsWidth)/2, (borderLength-boundsHeight)/2, boundsWidth, boundsHeight), 'rounded=0;whiteSpace=wrap;html=1;strokeColor=none;');
        modelBounds.vertex = true;
        //记录当前状态
        for(var i=0;i<devObj.statusList.length;i++){
            if(devObj.statusList[i].statusName==devObj.devStatus){
                devObj.statusList[i]=new GModel.StatusDrawingDef(i, devObj.devStatus, cells);
                break;
            }
        }
    	var gObj=null;
        //格式化位置（组内相对坐标）
        devObj.statusList[0].shapeList.push(modelBounds.clone());
        var groupCell = graph.groupCells(null, 0, devObj.statusList[0].shapeList);
        groupCell.title=devObj.devName;
        groupCell.geometry.width=boundsWidth;
        groupCell.geometry.height=boundsHeight;
        groupCell.geometry.x=0;
        groupCell.geometry.y=0;
        if (devObj.gobjType == 'GElectric') {
            gObj = new GModel.GElectric(groupCell);
        } else if (devObj.gobjType == 'GElectricSwitch') {
            devObj.statusList[1].shapeList.push(modelBounds.clone());
            graph.groupCells(null, 0, devObj.statusList[1].shapeList);
            gObj = new GModel.GElectricSwitch(groupCell, devObj.statusList);
            //格式化图形列表，便于存储和读取
            gObj.statusShapeList.forEach(function (sdd) {
				sdd.encodeShapeList();
            });
        }
        //保存到数据库
        sidebar.getModelPaletteXML('ElectricPalette', function (sidebar, metaId, metaContent, metaName) {
            var cellList = editorUi.stringToCells(metaContent);
            cellList.push(gObj.mxCell);
            sidebar.initCustomData(sidebarContentDiv, cellList);
            var xml = graph.compress(mxUtils.getXml(graph.encodeCells(cellList)));
            sidebar.updataModelPaletteByMetaId(metaId, xml);
        });
        // var cellList = editorUi.stringToCells(localStorage.getItem('ElectricPalette'));
        // cellList.push(gObj.mxCell);
        // //刷新图元工具列表
        // sidebar.initCustomData(sidebarContentDiv, cellList);
        // var xml = graph.compress(mxUtils.getXml(graph.encodeCells(cellList)));
        // localStorage.setItem('ElectricPalette', xml);
        editorUi.hideDialog(true);
    }));
    btn.setAttribute('id', 'btnSave');
    btn.className = 'geBtn gePrimaryBtn';
    btns.appendChild(btn);
    outer.appendChild(btns);
    initShapeProperty();
    this.container = outer;
    function initShapeProperty() {
        var statusDrawingDef=null;
        for(var i=0;i<devObj.statusList.length;i++){
        	if(devObj.statusList[i].statusName==devObj.devStatus){
                statusDrawingDef=devObj.statusList[i];
                break;
			}
		}
        var cells = graph.getSelectionCells();
        rightDiv.innerHTML='';
        if(cells.length>0){
            // console.log(cells);
            var tempCell=cells[0].clone();//用于临时记录样式信息
            var isEdge=false;//判断是否存在线
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].edge) {
                    isEdge = true;
                    break;
                }
            }
			//线形
            var titlediv = document.createElement('div');
            titlediv.style.background = '#eee';
            titlediv.style.marginBottom = '8px';
            titlediv.style.fontWeight = 'bold';
            mxUtils.write(titlediv, '线形');
            rightDiv.appendChild(titlediv);
            ////线条颜色
            var label = document.createElement('div');
            label.style.lineHeight = '25px';
            label.style.display = 'table-cell';
            label.style.width = '80px';
            mxUtils.write(label, '线条颜色：');
            var valuespan = document.createElement('div');
            valuespan.style.display = 'table-cell';
            var btnStrokeColor = document.createElement('button');
            var strokeColor=statusDrawingDef.getStyleAttribute(tempCell, 'strokeColor', '#000');
            btnStrokeColor = mxUtils.button('', mxUtils.bind(this, function(evt){
                ui.pickColor(strokeColor, function (color) {
                    if(color=='none'){
                        color='#000';
                    }
                    btnStrokeColor.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+ color + ';"></div>';
                    var cells = graph.getSelectionCells();
                    cells.forEach(function (cell) {
                        statusDrawingDef.setStyleAttribute(cell, 'strokeColor', color, graph);
                    });
                });
                mxEvent.consume(evt);
            }));
            btnStrokeColor.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+strokeColor+';"></div>';
            btnStrokeColor.className = 'geColorBtn';
            valuespan.appendChild(btnStrokeColor);
            var tempDiv = containerdiv.cloneNode(false);
            tempDiv.appendChild(label);
            tempDiv.appendChild(valuespan);
            rightDiv.appendChild(tempDiv);
            //线条宽度
            var label = document.createElement('div');
            label.style.lineHeight = '25px';
            label.style.display = 'table-cell';
            label.style.width = '80px';
            mxUtils.write(label, '线条宽度：');
            var valuespan = document.createElement('div');
            valuespan.style.display = 'table-cell';
            var input = document.createElement('input');
            input.value = statusDrawingDef.getStyleAttribute(tempCell, 'strokeWidth', 2);
            input.style.textAlign = 'right';
            input.style.width = '40px';
            input.style.height = '20px';
            input.style.position = 'absolute';
            valuespan.appendChild(input);
            mxEvent.addListener(input, 'change', function (evt) {
                var vLen=parseInt(input.value);
                if(isNaN(vLen) || vLen<1 || vLen>100){
                    input.value='1';
                    vLen=1;
                }
                var cells = graph.getSelectionCells();
                cells.forEach(function (cell) {
                    statusDrawingDef.setStyleAttribute(cell, 'strokeWidth', vLen, graph);
                });
            });
            var stepper = createStepper(input, function (evt) {
                var cells = graph.getSelectionCells();
                cells.forEach(function (cell) {
                    statusDrawingDef.setStyleAttribute(cell, 'strokeWidth', input.value, graph);
                });
            }, 1, 9);
            stepper.style.position = 'absolute';
            stepper.style.marginLeft = '40px';
            valuespan.appendChild(stepper);
            var tempDiv = containerdiv.cloneNode(false);
            tempDiv.style.height = '30px';
            tempDiv.appendChild(label);
            tempDiv.appendChild(valuespan);
            rightDiv.appendChild(tempDiv);
            ////样式
            var label = document.createElement('div');
            label.style.lineHeight = '25px';
            label.style.display = 'table-cell';
            label.style.width = '80px';
            mxUtils.write(label, '线条样式：');
            var valuespan = document.createElement('div');
            valuespan.style.display = 'table-cell';
            var selectLineStyle=document.createElement('select');
            selectLineStyle.style.width='50px';
            setSelectOp(selectLineStyle, ['straight','dashed'], statusDrawingDef.getStyleAttribute(tempCell, 'dashed')?'dashed':'straight');
            valuespan.appendChild(selectLineStyle);
            mxEvent.addListener(selectLineStyle, 'change', function (evt) {
                var cells = graph.getSelectionCells();
                if(this.value=='straight'){
                    cells.forEach(function (cell) {
                        statusDrawingDef.setStyleAttribute(cell, 'dashed', null, graph);
                    });
				}else{
                    cells.forEach(function (cell) {
                        statusDrawingDef.setStyleAttribute(cell, 'dashed', '1', graph);
                    });
				}
            });
            var tempDiv = containerdiv.cloneNode(false);
            tempDiv.appendChild(label);
            tempDiv.appendChild(valuespan);
            rightDiv.appendChild(tempDiv);
            if(!isEdge){//图形
                var titlediv = document.createElement('div');
                titlediv.style.background = '#eee';
                titlediv.style.marginBottom = '8px';
                titlediv.style.fontWeight = 'bold';
                mxUtils.write(titlediv, '图形');
                rightDiv.appendChild(titlediv);
                ////填充颜色
                var label = document.createElement('div');
                label.style.lineHeight = '25px';
                label.style.display = 'table-cell';
                label.style.width = '80px';
                mxUtils.write(label, '填充颜色：');
                var valuespan = document.createElement('div');
                valuespan.style.display = 'table-cell';
                var btnFillColor = document.createElement('button');
                var fillColor=statusDrawingDef.getStyleAttribute(tempCell, 'fillColor');
                btnFillColor = mxUtils.button('', mxUtils.bind(this, function(evt){
                    ui.pickColor(fillColor, function (color) {
                        btnFillColor.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+ color + ';"></div>';
                        var cells = graph.getSelectionCells();
                        cells.forEach(function (cell) {
                            statusDrawingDef.setStyleAttribute(cell, 'fillColor', color, graph);
                        });
                    });
                    mxEvent.consume(evt);
                }));
                btnFillColor.innerHTML = '<div style="width:36px;height:12px;margin:3px;border:1px solid black;background-color:'+fillColor+';"></div>';
                btnFillColor.className = 'geColorBtn';
                valuespan.appendChild(btnFillColor);
                var tempDiv = containerdiv.cloneNode(false);
                tempDiv.appendChild(label);
                tempDiv.appendChild(valuespan);
                rightDiv.appendChild(tempDiv);
                //旋转角度
                var label = document.createElement('div');
                label.style.lineHeight = '25px';
                label.style.display = 'table-cell';
                label.style.width = '80px';
                mxUtils.write(label, '旋转角度：');
                var valuespan = document.createElement('div');
                valuespan.style.display = 'table-cell';
                var input = document.createElement('input');
                input.value = statusDrawingDef.getStyleAttribute(tempCell, 'rotation', '0');
                input.style.textAlign = 'right';
                input.style.width = '40px';
                input.style.height = '20px';
                input.style.position = 'absolute';
                valuespan.appendChild(input);
                mxEvent.addListener(input, 'change', function (evt) {
                    var vLen=parseInt(input.value);
                    if(isNaN(vLen) || vLen<-180 || vLen>180){
                        input.value='0';
                        vLen=0;
                    }
                    var cells = graph.getSelectionCells();
                    cells.forEach(function (cell) {
                        statusDrawingDef.setStyleAttribute(cell, 'strokeWidth', vLen, graph);
                    });
                });
                var stepper = createStepper(input, function (evt) {
                    var cells = graph.getSelectionCells();
                    cells.forEach(function (cell) {
                        statusDrawingDef.setStyleAttribute(cell, 'rotation', input.value, graph);
                    });
                }, 1, 9, -180, 180);
                stepper.style.position = 'absolute';
                stepper.style.marginLeft = '40px';
                valuespan.appendChild(stepper);
                var tempDiv = containerdiv.cloneNode(false);
                tempDiv.style.height = '30px';
                tempDiv.appendChild(label);
                tempDiv.appendChild(valuespan);
                rightDiv.appendChild(tempDiv);
            }
        }else{
            var div = document.createElement('div');
            div.style.height = '100%';
            div.style.backgroundPosition = 'center center';
            div.style.backgroundRepeat = 'no-repeat';
            div.style.backgroundImage = 'url(\'' + IMAGE_PATH + '/photo.png\')';
            rightDiv.appendChild(div);
            var bg = document.createElement('div');
            bg.style.position = 'absolute';
            bg.style.width = '50%';
            bg.style.top = '260px';
            bg.style.textAlign = 'center';
            bg.style.fontSize = '22px';
            bg.style.color = '#a0c3ff';
            mxUtils.write(bg, mxResources.get('noGraphicsWereSelected'));
            rightDiv.appendChild(bg);
		}
    }
};
/**
 * Optional help link.
 */
EditDataDialog.placeholderHelpLink = null;

/**
 * Constructs a new link dialog.
 */
var LinkDialog = function(editorUi, initialValue, btnLabel, fn) {
	var div = document.createElement('div');
	mxUtils.write(div, mxResources.get('editLink') + ':');

	var inner = document.createElement('div');
	inner.className = 'geTitle';
	inner.style.backgroundColor = 'transparent';
	inner.style.borderColor = 'transparent';
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.cursor = 'default';

	if (!mxClient.IS_VML) {
		inner.style.paddingRight = '20px';
	}

	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', initialValue);
	linkInput.setAttribute('placeholder', 'http://www.example.com/');
	linkInput.setAttribute('type', 'text');
	linkInput.style.marginTop = '6px';
	linkInput.style.width = '400px';
	linkInput.style.backgroundImage = 'url(\'' + Dialog.prototype.clearImage + '\')';
	linkInput.style.backgroundRepeat = 'no-repeat';
	linkInput.style.backgroundPosition = '100% 50%';
	linkInput.style.paddingRight = '14px';

	var cross = document.createElement('div');
	cross.setAttribute('title', mxResources.get('reset'));
	cross.style.position = 'relative';
	cross.style.left = '-16px';
	cross.style.width = '12px';
	cross.style.height = '14px';
	cross.style.cursor = 'pointer';

	// Workaround for inline-block not supported in IE
	cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
	cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';

	// Needed to block event transparency in IE
	cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';

	mxEvent.addListener(cross, 'click', function() {
		linkInput.value = '';
		linkInput.focus();
	});

	inner.appendChild(linkInput);
	inner.appendChild(cross);
	div.appendChild(inner);

	this.init = function() {
		linkInput.focus();

		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS) {
			linkInput.select();
		} else {
			document.execCommand('selectAll', false, null);
		}
	};

	var btns = document.createElement('div');
	btns.style.marginTop = '18px';
	btns.style.textAlign = 'right';

	mxEvent.addListener(linkInput, 'keypress', function(e) {
		if (e.keyCode == 13) {
			editorUi.hideDialog();
			fn(linkInput.value);
		}
	});

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst) {
		btns.appendChild(cancelBtn);
	}

	var mainBtn = mxUtils.button(btnLabel, function() {
		editorUi.hideDialog();
		fn(linkInput.value);
	});
	mainBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(mainBtn);

	if (!editorUi.editor.cancelFirst) {
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 *
 */

var OutlineWindow = function(editorUi, x, y, w, h) {
	var graph = editorUi.editor.graph;

	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width = '100%';
	div.style.height = '100%';
	div.style.border = '1px solid whiteSmoke';
	div.style.overflow = 'hidden';

	this.window = new mxWindow(mxResources.get('outline'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);

	this.window.setLocation = function(x, y) {
		x = Math.max(0, x);
		y = Math.max(0, y);
		mxWindow.prototype.setLocation.apply(this, arguments);
	};

	mxEvent.addListener(window, 'resize', mxUtils.bind(this, function() {
		var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		var x = this.window.getX();
		var y = this.window.getY();

		if (x + this.window.table.clientWidth > iw) {
			x = Math.max(0, iw - this.window.table.clientWidth);
		}

		if (y + this.window.table.clientHeight > ih) {
			y = Math.max(0, ih - this.window.table.clientHeight);
		}

		if (this.window.getX() != x || this.window.getY() != y) {
			this.window.setLocation(x, y);
		}
	}));

	var outline = editorUi.createOutline(this.window);

	this.window.addListener(mxEvent.RESIZE, mxUtils.bind(this, function() {
		outline.update(false);
		outline.outline.sizeDidChange();
	}));

	this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function() {
		outline.suspended = false;
		outline.outline.refresh();
		outline.update();
	}));

	this.window.addListener(mxEvent.HIDE, mxUtils.bind(this, function() {
		outline.suspended = true;
	}));

	this.window.addListener(mxEvent.NORMALIZE, mxUtils.bind(this, function() {
		outline.suspended = false;
		outline.update();
	}));

	this.window.addListener(mxEvent.MINIMIZE, mxUtils.bind(this, function() {
		outline.suspended = true;
	}));

	var outlineCreateGraph = outline.createGraph;
	outline.createGraph = function(container) {
		var g = outlineCreateGraph.apply(this, arguments);
		g.gridEnabled = false;
		g.pageScale = graph.pageScale;
		g.pageFormat = graph.pageFormat;
		g.background = graph.background;
		g.pageVisible = graph.pageVisible;

		var current = mxUtils.getCurrentStyle(graph.container);
		div.style.backgroundColor = current.backgroundColor;

		return g;
	};

	function update() {
		outline.outline.pageScale = graph.pageScale;
		outline.outline.pageFormat = graph.pageFormat;
		outline.outline.pageVisible = graph.pageVisible;
		outline.outline.background = graph.background;

		var current = mxUtils.getCurrentStyle(graph.container);
		div.style.backgroundColor = current.backgroundColor;

		if (graph.view.backgroundPageShape != null && outline.outline.view.backgroundPageShape != null) {
			outline.outline.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
		}

		outline.outline.refresh();
	};

	outline.init(div);

	editorUi.editor.addListener('resetGraphView', update);
	editorUi.addListener('pageFormatChanged', update);
	editorUi.addListener('backgroundColorChanged', update);
	editorUi.addListener('backgroundImageChanged', update);
	editorUi.addListener('pageViewChanged', function() {
		update();
		outline.update(true);
	});

	if (outline.outline.dialect == mxConstants.DIALECT_SVG) {
		var zoomInAction = editorUi.actions.get('zoomIn');
		var zoomOutAction = editorUi.actions.get('zoomOut');

		mxEvent.addMouseWheelListener(function(evt, up) {
			var outlineWheel = false;
			var source = mxEvent.getSource(evt);

			while (source != null) {
				if (source == outline.outline.view.canvas.ownerSVGElement) {
					outlineWheel = true;
					break;
				}

				source = source.parentNode;
			}

			if (outlineWheel) {
				if (up) {
					zoomInAction.funct();
				} else {
					zoomOutAction.funct();
				}

				mxEvent.consume(evt);
			}
		});
	}
};

/**
 *
 */
var LayersWindow = function(editorUi, x, y, w, h) {
	var graph = editorUi.editor.graph;

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.background = 'whiteSmoke';
	div.style.border = '1px solid whiteSmoke';
	div.style.height = '100%';
	div.style.marginBottom = '10px';
	div.style.overflow = 'auto';

	var tbarHeight = (!EditorUi.compactUi) ? '30px' : '26px';

	var listDiv = document.createElement('div')
	listDiv.style.backgroundColor = '#e5e5e5';
	listDiv.style.position = 'absolute';
	listDiv.style.overflow = 'auto';
	listDiv.style.left = '0px';
	listDiv.style.right = '0px';
	listDiv.style.top = '0px';
	listDiv.style.bottom = tbarHeight;
	div.appendChild(listDiv);

	var dragSource = null;
	var dropIndex = null;

	mxEvent.addListener(div, 'dragover', function(evt) {
		evt.dataTransfer.dropEffect = 'move';
		dropIndex = null;
		evt.stopPropagation();
		evt.preventDefault();
	});

	var layerCount = null;
	var selectionLayer = null;

	var ldiv = document.createElement('div');

	ldiv.className = 'geToolbarContainer';
	ldiv.style.position = 'absolute';
	ldiv.style.bottom = '0px';
	ldiv.style.left = '0px';
	ldiv.style.right = '0px';
	ldiv.style.height = tbarHeight;
	ldiv.style.overflow = 'hidden';
	ldiv.style.padding = (!EditorUi.compactUi) ? '1px' : '4px 0px 3px 0px';
	ldiv.style.backgroundColor = 'whiteSmoke';
	ldiv.style.borderWidth = '1px 0px 0px 0px';
	ldiv.style.borderColor = '#c3c3c3';
	ldiv.style.borderStyle = 'solid';
	ldiv.style.display = 'block';
	ldiv.style.whiteSpace = 'nowrap';

	if (mxClient.IS_QUIRKS) {
		ldiv.style.filter = 'none';
	}

	var link = document.createElement('a');
	link.className = 'geButton';

	if (mxClient.IS_QUIRKS) {
		link.style.filter = 'none';
	}

	//delete 删除图层
	var removeLink = link.cloneNode();
	removeLink.innerHTML = '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>';

	mxEvent.addListener(removeLink, 'click', function(evt) {
		if (graph.isEnabled()) {
			graph.model.beginUpdate();
			try {
				var index = graph.model.root.getIndex(selectionLayer);
				graph.removeCells([selectionLayer], false);

				// Creates default layer if no layer exists
				if (graph.model.getChildCount(graph.model.root) == 0) {
					graph.model.add(graph.model.root, new mxCell());
					graph.setDefaultParent(null);
				} else if (index > 0 && index <= graph.model.getChildCount(graph.model.root)) {
					graph.setDefaultParent(graph.model.getChildAt(graph.model.root, index - 1));
				} else {
					graph.setDefaultParent(null);
				}
			} finally {
				graph.model.endUpdate();
			}
		}

		mxEvent.consume(evt);
	});

	if (!graph.isEnabled()) {
		removeLink.className = 'geButton mxDisabled';
	}

	ldiv.appendChild(removeLink);

	//第二个标签
	var insertLink = link.cloneNode();
	insertLink.innerHTML = '<div class="geSprite geSprite-insert" style="display:inline-block;"></div>';

	mxEvent.addListener(insertLink, 'click', function(evt) {
		if (graph.isEnabled() && !graph.isSelectionEmpty()) {
			graph.moveCells(graph.getSelectionCells(), 0, 0, false, selectionLayer);
		}
	});

	ldiv.appendChild(insertLink);

	//重命名标签
	var renameLink = link.cloneNode();
	renameLink.innerHTML = '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>';
	renameLink.setAttribute('title', mxResources.get('rename'));

	function renameLayer(layer) {
		if (graph.isEnabled() && layer != null) {
			var dlg = new FilenameDialog(editorUi, layer.value || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function(newValue) {
				if (newValue != null) {
					graph.getModel().setValue(layer, newValue);
				}
			}), mxResources.get('enterName'));
			editorUi.showDialog(dlg.container, 300, 100, true, true);
			dlg.init();
		}
	};

	mxEvent.addListener(renameLink, 'click', function(evt) {
		if (graph.isEnabled()) {
			renameLayer(selectionLayer);
		}

		mxEvent.consume(evt);
	});

	if (!graph.isEnabled()) {
		renameLink.className = 'geButton mxDisabled';
	}

	ldiv.appendChild(renameLink);

	//复制图层
	var duplicateLink = link.cloneNode();
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

	ldiv.appendChild(duplicateLink);

	//添加图层
	var addLink = link.cloneNode();
	addLink.innerHTML = '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>';
	addLink.setAttribute('title', mxResources.get('addLayer'));

	mxEvent.addListener(addLink, 'click', function(evt) {
		if (graph.isEnabled()) {
			graph.model.beginUpdate();

			try {
				var cell = graph.addCell(new mxCell(mxResources.get('untitledLayer')), graph.model.root);
				graph.setDefaultParent(cell);
			} finally {
				graph.model.endUpdate();
			}
		}

		mxEvent.consume(evt);
	});

	if (!graph.isEnabled()) {
		addLink.className = 'geButton mxDisabled';
	}

	ldiv.appendChild(addLink);

	div.appendChild(ldiv);

	//刷新
	function refresh() {
		//console.log('test11');
		layerCount = graph.model.getChildCount(graph.model.root)
		listDiv.innerHTML = '';

		function addLayer(index, label, child, defaultParent) {
			var ldiv = document.createElement('div');
			ldiv.className = 'geToolbarContainer';

			ldiv.style.overflow = 'hidden';
			ldiv.style.position = 'relative';
			ldiv.style.padding = '4px';
			ldiv.style.height = '22px';
			ldiv.style.display = 'block';
			ldiv.style.backgroundColor = 'whiteSmoke';
			ldiv.style.borderWidth = '0px 0px 1px 0px';
			ldiv.style.borderColor = '#c3c3c3';
			ldiv.style.borderStyle = 'solid';
			ldiv.style.whiteSpace = 'nowrap';

			var left = document.createElement('div');
			left.style.display = 'inline-block';
			left.style.width = '100%';
			left.style.textOverflow = 'ellipsis';
			left.style.overflow = 'hidden';

			mxEvent.addListener(ldiv, 'dragover', function(evt) {
				evt.dataTransfer.dropEffect = 'move';
				dropIndex = index;
				evt.stopPropagation();
				evt.preventDefault();
			});

			mxEvent.addListener(ldiv, 'dragstart', function(evt) {
				dragSource = ldiv;

				// Workaround for no DnD on DIV in FF
				if (mxClient.IS_FF) {
					// LATER: Check what triggers a parse as XML on this in FF after drop
					evt.dataTransfer.setData('Text', '<layer/>');
				}
			});

			mxEvent.addListener(ldiv, 'dragend', function(evt) {
				if (dragSource != null) {
					graph.addCell(child, graph.model.root, dropIndex);
					dragSource = null;
					dropIndex = null;
				}

				evt.stopPropagation();
				evt.preventDefault();
			});

			//lock锁
			var btn = document.createElement('img');
			btn.setAttribute('draggable', 'false');
			btn.setAttribute('align', 'top');
			btn.setAttribute('border', '0');
			btn.style.cursor = 'pointer';
			btn.style.padding = '4px';
			btn.setAttribute('title', mxResources.get('lockUnlock'));

			var state = graph.view.getState(child);
			var style = (state != null) ? state.style : graph.getCellStyle(child);

			if (mxUtils.getValue(style, 'locked', '0') == '1') {
				btn.setAttribute('src', Dialog.prototype.lockedImage);
			} else {
				btn.setAttribute('src', Dialog.prototype.unlockedImage);
			}

			mxEvent.addListener(btn, 'click', function(evt) {
				if (graph.isEnabled()) {
					var value = null;
					graph.getModel().beginUpdate();
					try {
						value = (mxUtils.getValue(style, 'locked', '0') == '1') ? null : '1';
						graph.setCellStyles('locked', value, [child]);
					} finally {
						graph.getModel().endUpdate();
					}

					if (value == '1') {
						graph.removeSelectionCells(graph.getModel().getDescendants(child));
					}

					mxEvent.consume(evt);
				}
			});

			left.appendChild(btn);

			//checkbox 选择框
			var inp = document.createElement('input');
			inp.setAttribute('type', 'checkbox');
			inp.setAttribute('title', mxResources.get('hideIt', [child.value || mxResources.get('background')]));
			inp.style.marginLeft = '4px';
			inp.style.marginRight = '6px';
			inp.style.marginTop = '4px';
			//left.appendChild(inp);

			if (!graph.isEnabled()) {
				inp.setAttribute('disabled', 'disabled');
			}

			if (graph.model.isVisible(child)) {
				inp.setAttribute('checked', 'checked');
				inp.defaultChecked = true;
			}

			mxEvent.addListener(inp, 'click', function(evt) {
				if (graph.isEnabled()) {
					graph.model.setVisible(child, !graph.model.isVisible(child));
					mxEvent.consume(evt);
				}
			});

			mxUtils.write(left, label);
			ldiv.appendChild(left);

			if (graph.isEnabled()) {
				// Fallback if no drag and drop is available
				if (mxClient.IS_TOUCH || mxClient.IS_POINTER || mxClient.IS_VML ||
					(mxClient.IS_IE && document.documentMode < 10)) {
					var right = document.createElement('div');
					right.style.display = 'block';
					right.style.textAlign = 'right';
					right.style.whiteSpace = 'nowrap';
					right.style.position = 'absolute';
					right.style.right = '6px';
					right.style.top = '6px';

					// Poor man's change layer order
					if (index > 0) {
						var img2 = document.createElement('a');

						img2.setAttribute('title', mxResources.get('toBack'));

						img2.className = 'geButton';
						img2.style.cssFloat = 'none';
						img2.innerHTML = '&#9650;';
						img2.style.width = '14px';
						img2.style.height = '14px';
						img2.style.fontSize = '14px';
						img2.style.margin = '0px';
						img2.style.marginTop = '-1px';
						right.appendChild(img2);

						mxEvent.addListener(img2, 'click', function(evt) {
							if (graph.isEnabled()) {
								graph.addCell(child, graph.model.root, index - 1);
							}

							mxEvent.consume(evt);
						});
					}

					if (index >= 0 && index < layerCount - 1) {
						var img1 = document.createElement('a');

						img1.setAttribute('title', mxResources.get('toFront'));

						img1.className = 'geButton';
						img1.style.cssFloat = 'none';
						img1.innerHTML = '&#9660;';
						img1.style.width = '14px';
						img1.style.height = '14px';
						img1.style.fontSize = '14px';
						img1.style.margin = '0px';
						img1.style.marginTop = '-1px';
						right.appendChild(img1);

						mxEvent.addListener(img1, 'click', function(evt) {
							if (graph.isEnabled()) {
								graph.addCell(child, graph.model.root, index + 1);
							}

							mxEvent.consume(evt);
						});
					}

					ldiv.appendChild(right);
				}

				if (mxClient.IS_SVG && (!mxClient.IS_IE || document.documentMode >= 10)) {
					ldiv.setAttribute('draggable', 'true');
					ldiv.style.cursor = 'move';
				}
			}

			mxEvent.addListener(ldiv, 'dblclick', function(evt) {
				var nodeName = mxEvent.getSource(evt).nodeName;

				if (nodeName != 'INPUT' && nodeName != 'IMG') {
					renameLayer(child);
					mxEvent.consume(evt);
				}
			});

			if (graph.getDefaultParent() == child) {
				ldiv.style.background = '#e6eff8';
				selectionLayer = child;
			} else {
				//console.log('test2', graph.model.isVisible(child));
				if (graph.model.isVisible(child)) {
					graph.model.setVisible(child, !graph.model.isVisible(child));
					//console.log('test1', graph.model.isVisible(child));
				}
				mxEvent.addListener(ldiv, 'click', function(evt) {
					if (graph.isEnabled()) {

						graph.setDefaultParent(defaultParent);
						graph.view.setCurrentRoot(null);

						refresh();
						graph.model.setVisible(child, !graph.model.isVisible(child));
					}
				});
			}

			listDiv.appendChild(ldiv);
		};

		// Cannot be moved or deleted
		for (var i = 0; i < layerCount; i++) {
			(mxUtils.bind(this, function(child) {
				addLayer(i, child.value || mxResources.get('background'), child, child);
			}))(graph.model.getChildAt(graph.model.root, i));
		}

		removeLink.setAttribute('title', mxResources.get('removeIt', [selectionLayer.value || mxResources.get('background')]));
		insertLink.setAttribute('title', mxResources.get('moveSelectionTo', [selectionLayer.value || mxResources.get('background')]));
		duplicateLink.setAttribute('title', mxResources.get('duplicateIt', [selectionLayer.value || mxResources.get('background')]));
		renameLink.setAttribute('title', mxResources.get('renameIt', [selectionLayer.value || mxResources.get('background')]));

		if (graph.isSelectionEmpty()) {
			insertLink.className = 'geButton mxDisabled';
		}
	};

	refresh();
	graph.model.addListener(mxEvent.CHANGE, function() {
		refresh();
	});

	graph.selectionModel.addListener(mxEvent.CHANGE, function() {
		if (graph.isSelectionEmpty()) {
			insertLink.className = 'geButton mxDisabled';
		} else {
			insertLink.className = 'geButton';
		}
	});

	this.window = new mxWindow(mxResources.get('layers'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);

	// Make refresh available via instance
	this.refreshLayers = refresh;

	this.window.setLocation = function(x, y) {
		x = Math.max(0, x);
		y = Math.max(0, y);
		mxWindow.prototype.setLocation.apply(this, arguments);
	};

	mxEvent.addListener(window, 'resize', mxUtils.bind(this, function() {
		var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		var x = this.window.getX();
		var y = this.window.getY();

		if (x + this.window.table.clientWidth > iw) {
			x = Math.max(0, iw - this.window.table.clientWidth);
		}

		if (y + this.window.table.clientHeight > ih) {
			y = Math.max(0, ih - this.window.table.clientHeight);
		}

		if (this.window.getX() != x || this.window.getY() != y) {
			this.window.setLocation(x, y);
		}
	}));
};


var applicationGridModel={		
	    "grid":{
	        "floor":"eleFloor",
	        "defaultparam":{
	            "工程名称：":"新工程",
	            "工程描述：":"城乡配电网"
	        },
	        "dec":"城乡配电网"
	    },		
	    "incremental":{
	        "floor":"eleFloor",
	        "defaultparam":{
	            "工程名称：":"新工程",
	            "工程描述：":"增量配电网"
	        },
	        "dec":"增量配电网"
	    },		
	    "park":{
	        "floor":"eleFloor",
	        "defaultparam":{
	            "工程名称：":"新工程",
	            "工程描述：":"园区电网"
	        },
	        "dec":"园区电网"
	    },		
	    "enterprise":{
	        "floor":"eleFloor",
	        "defaultparam":{
	            "工程名称：":"新工程",
	            "工程描述：":"企业电网"
	        },
	        "dec":"企业电网"
	    }
		
		
}

var applicationModel={
    "EMTP":{
        "floor":"eleFloor",
        "defaultparam":{
            "Application Name":"EMTPAPP1",
            "Type":"EMTP",
            "deltaT":"50e-6"
        },
        "dec":"电气原理EMTP"
    },
    "SFA":{
        "floor":"eleFloor",
        "defaultparam":{
            "Application Name":"SFAAPP1",
            "Type":"SFA",
            "deltaT":"50e-6"
        },
        "dec":"电气原理SFA"
    },
    "CPS":{
        "floor":"CPSFloor",
        "defaultparam":{
            "Application Name":"CPSAPP1",
            "Type":"CPS",
            "deltaT":"50e-6"
        },
        "dec":"CPS"
    },
    "ENG":{
        "floor":"engFloor",
        "defaultparam":{
            "Application Name":"ENGAPP1",
            "Type":"ENG",
            "deltaT":"50e-6"
        },
        "dec":"能源耦合"
    },
    "CPF":{
        "floor":"CPFFloor",
        "defaultparam":{
            "Application Name":"CPFAPP1",
            "Type":"CPF",
            "err":"1e-5",
            "maxiter":"100",
            "Sbase":"100",
             "filename": "testdata.txt",
            "frequency":"60"
        },
        "dec":"潮流计算"
    },
    "TABLE":{
        "floor":"tableFloor",
        "dec":"数据可视化",
        "defaultparam":{
            "Application Name":"TABLEAPP1",
            "Type":"TABLE"
        },
        "only":true
    },
    "MULTIRUN":{
        "floor":"moreFloor",
        "dec":"多场景",
        "defaultparam":{
            "Application Name":"MULTIRUNAPP1",
            "Type":"MULTIRUN"
        },
        "only":true
    },

    "TIME":{
        "floor":"timeFloor",
        "dec":"时序计算",
        "defaultparam":{
            "Application Name":"TIMEAPP1",
            "Type":"TIME"
        },
        "only":true
    },"GIS":{
        "floor":"gisFloor",
        "disable":true,
        "dec":"地理信息"
    }
}




var addNewAppRoot = function(editorUi, filename, buttonText, fn, label, validateFn) {
    var s_div = document.createElement('div');
    var properties_div = document.createElement('div');
    var positionSelect = document.createElement('select');
    positionSelect.className = "geButton geColorBtn";
    positionSelect.style.width = '180px';

    mxEvent.addListener(positionSelect, 'change', function(e) {
		createParam(applicationModel[this.value]['defaultparam'])
    })
    
    var row, td;
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    row = document.createElement('tr');
    td = document.createElement('td');
    td.style.fontSize = '10pt';
    td.style.width = '120px';
    mxUtils.write(td, (mxResources.get('selectFloor')) + ':');
    row.appendChild(td);
    
    for(var key in applicationGridModel){
        var positionOptionEle = document.createElement('option');
        positionOptionEle.setAttribute('value',key);
        mxUtils.write(positionOptionEle, applicationGridModel[key]['dec']);
        
        positionSelect.appendChild(positionOptionEle);
        if( applicationGridModel[key]['disable']){
            positionOptionEle.setAttribute('disabled', 'true');
        }
    }
    
    td = document.createElement('td');
    td.appendChild(positionSelect);
    row.appendChild(td);
    tbody.appendChild(row);

    //参数表
    var param_div = document.createElement('div');
    param_div.style.height = '180px';
	param_div.style['overflow-x'] = 'hidden';
	param_div.style['overflow-y'] = 'auto';
    var paramTable=document.createElement('table');
    paramTable.style['margin-top'] = '8px';
	paramTable.setAttribute('id', 'layerParam');
	param_div.appendChild(paramTable);
	
	var paramTbody = document.createElement('tbody');
	
    function createParam(param){
    	
        $(paramTbody).empty();
        
        if(param){

            for(var key in param){
                var tr2 = document.createElement('tr');
                var td2 = document.createElement('td');
                var paramInput = document.createElement('input');
                paramInput.setAttribute('value', key);
                paramInput.setAttribute('disabled', 'disabled');
                paramInput.className = 'param-inpt';
                td2.appendChild(paramInput);
                tr2.appendChild(td2);
                td2 = document.createElement('td');
                var valueInPut = document.createElement('input');
                valueInPut.setAttribute('value',param[key]);
                valueInPut.className = 'param-inpt';
                td2.appendChild(valueInPut);
                tr2.appendChild(td2);
                paramTbody.appendChild(tr2);
            }
            paramTable.appendChild(paramTbody);
        }
    }
    
    createParam(applicationGridModel['grid'].defaultparam);
    
    //按钮div
    var op_div = document.createElement('div');
	op_div.style['margin-top'] = '15px';
	
    //生成按钮
    var genericBtn = mxUtils.button(buttonText, function() {
        if (validateFn == null) {
            var appKey=positionSelect.value;
            if(applicationGridModel[appKey]['only']){
                if (!_simuUnique['hasTimeLine']) {
					_simuUnique['hasTimeLine'] = 1;
					//layer_param[key1] = value1;
				} else {
					toastr['info']('该应用仅能使用一个');
					return;
				}
            }

			var layer_param = {};
			if (true) {
				$('#layerParam').find("tr").each(function() {
					var tdArr = $(this).children();
					var key1 = tdArr.eq(0).find('input').val();
					var value1 = tdArr.eq(1).find('input').val();
					if (key1 != '' && value1 != '') {
						layer_param[key1] = value1;
					}
				});
                for (var x in _layersParam) {
					if (_layersParam[x]['Application Name'] == layer_param['Application Name']) {
						toastr['info']('APPLICATION名称不允许重复');
						return;
					}
				}
            }

			editorUi.hideDialog();
			fn(appKey,applicationGridModel[appKey]['floor'], layer_param);
		}
    });

    //添加参数
    var addparamBtn = mxUtils.button('add', function() {
		var html = '<tr><td><input class="param-inpt" style="width: 95%;" placeholder="Key"></td><td><input style="width: 95%;" placeholder="Value"></td></tr>';
		$('#layerParam tbody tr:last').after(html);
	});
	addparamBtn.setAttribute('class', 'geBtn gePrimaryBtn');
    //取消
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		editorUi.hideDialog();
	});
    
    //op_div.appendChild(addparamBtn);
    op_div.appendChild(cancelBtn);
    op_div.appendChild(genericBtn);


	cancelBtn.className = 'geBtn';
    genericBtn.className = 'geBtn gePrimaryBtn';
    table.appendChild(tbody);
    properties_div.appendChild(table);
    s_div.appendChild(properties_div);
    s_div.appendChild(param_div);
    s_div.appendChild(op_div);
    
    this.container = s_div;

}


//*添加应用
var addNewAppRoot1 = function(editorUi, filename, buttonText, fn, label, validateFn) {
	//update layerParam
	var s_div = document.createElement('div');
	var properties_div = document.createElement('div');
	//properties_div.style.float = 'left';
	var param_div = document.createElement('div');
	var op_div = document.createElement('div');
	op_div.style['margin-top'] = '15px';
	param_div.style.height = '180px';
	param_div.style['overflow-x'] = 'hidden';
	param_div.style['overflow-y'] = 'auto';
	//param_div.style.float = 'right';
	var right_table = document.createElement('table');
	right_table.style['margin-top'] = '8px';
	right_table.setAttribute('id', 'layerParam');
	param_div.appendChild(right_table);
	var tbody2 = document.createElement('tbody');
	var tr2 = document.createElement('tr');
	var tr3 = document.createElement('tr');
	var tr4 = document.createElement('tr');
	var td2 = document.createElement('td');
	var td3 = td2.cloneNode(false);
	var td4 = td2.cloneNode(false);
	var td5 = td2.cloneNode(false);
	var td6 = td2.cloneNode(false);
	var td7 = td2.cloneNode(false);
	var paramInput = document.createElement('input');
	paramInput.setAttribute('value', 'Application Name');
	paramInput.className = 'param-inpt';
	var valueInPut = document.createElement('input');
	valueInPut.setAttribute('value', 'app1');
	valueInPut.className = 'param-inpt';
	var paramInput2 = document.createElement('input');
	paramInput2.className = 'param-inpt';
	paramInput2.setAttribute('value', 'Type');
	var valueInPut2 = document.createElement('input');
	valueInPut2.className = 'param-inpt';
	valueInPut2.setAttribute('value', 'EMTP');
	var paramInput3 = document.createElement('input');
	paramInput3.className = 'param-inpt';
	paramInput3.setAttribute('value', 'deltaT');
	var valueInPut3 = document.createElement('input');
	valueInPut3.className = 'param-inpt';
	valueInPut3.setAttribute('value', '50e-6');
	paramInput.style.width = '95%';
	valueInPut.style.width = '95%';
	paramInput2.style.width = '95%';
	valueInPut2.style.width = '95%';
	paramInput3.style.width = '95%';
	valueInPut3.style.width = '95%';
	td2.appendChild(paramInput);
	td3.appendChild(valueInPut);
	td4.appendChild(paramInput2);
	td5.appendChild(valueInPut2);
	td6.appendChild(paramInput3);
	td7.appendChild(valueInPut3);
	tr2.appendChild(td2);
	tr2.appendChild(td3);
	tr3.appendChild(td4);
	tr3.appendChild(td5);
	tr4.appendChild(td6);
	tr4.appendChild(td7);
	tbody2.appendChild(tr2);
	tbody2.appendChild(tr3);
	tbody2.appendChild(tr4);
	right_table.appendChild(tbody2);


	var addparamBtn = mxUtils.button('add', function() {
		var html = '<tr><td><input class="param-inpt" style="width: 95%;" placeholder="Key"></td><td><input style="width: 95%;" placeholder="Value"></td></tr>';
		$('#layerParam tbody tr:last').after(html);
	});
	addparamBtn.setAttribute('class', 'geBtn gePrimaryBtn');
	//end
	var row, td;

	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.style.marginTop = '8px';

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	mxUtils.write(td, (label || mxResources.get('filename')) + ':');

	row.appendChild(td);

	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', filename || '');
	nameInput.style.width = '180px';

	td = document.createElement('td');
	//td.appendChild(nameInput);


	//row.appendChild(positionSelect);
	//row.appendChild(td);

	//tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	mxUtils.write(td, (mxResources.get('selectFloor')) + ':');
	row.appendChild(td);

	var positionSelect = document.createElement('select');
	positionSelect.className = "geButton geColorBtn";
	//positionSelect.style.position = 'absolute';
	positionSelect.style.width = '180px';
	//positionSelect.style.marginTop = '-2px';


	mxEvent.addListener(positionSelect, 'change', function(e) {
		if (this.value == 'eleFloor' || this.value == 'engFloor'||this.value == 'CPSFloor') {
			//add param option
			param_div.style.display = '';
			$('.geDialog').css('height', '260px');
			addparamBtn.style.display = '';
			// nameInput.setAttribute('value', filename || '');
			// nameInput.disabled = false;
		} else if (this.value == 'timeFloor') {
			param_div.style.display = 'none';
			$('.geDialog').css('height', '150px');
			addparamBtn.style.display = 'none';
			console.log('timeFloor');
			// nameInput.setAttribute('value', 'TimeLine');
			// nameInput.disabled = true;
		} else {
			param_div.style.display = 'none';
			$('.geDialog').css('height', '150px');
			addparamBtn.style.display = 'none';
			// nameInput.setAttribute('value', filename || '');
			// nameInput.disabled = false;
			//remove param option
		}
	});

	var positionOptionEle = document.createElement('option');
	positionOptionEle.setAttribute('value', 'eleFloor');
	mxUtils.write(positionOptionEle, mxResources.get('eleFloor'));
	positionSelect.appendChild(positionOptionEle);

	var positionOptionTable = document.createElement('option');
	positionOptionTable.setAttribute('value', 'tableFloor');
	mxUtils.write(positionOptionTable, mxResources.get('tableFloor'));
	positionSelect.appendChild(positionOptionTable);

	var positionOptionTime = document.createElement('option');
	positionOptionTime.setAttribute('value', 'engFloor');
	//mxUtils.write(positionOptionTable, mxResources.get('tableFloor'));
	mxUtils.write(positionOptionTime, mxResources.get('engFloor'));
	positionSelect.appendChild(positionOptionTime);

	var positionOptionCPS = document.createElement('option');
	positionOptionCPS.setAttribute('value', 'CPSFloor');
	//mxUtils.write(positionOptionTable, mxResources.get('tableFloor'));
	mxUtils.write(positionOptionCPS, 'CPS');
	positionSelect.appendChild(positionOptionCPS);

	var positionOptionTime = document.createElement('option');
	positionOptionTime.setAttribute('value', 'timeFloor');
	//mxUtils.write(positionOptionTable, mxResources.get('tableFloor'));
	mxUtils.write(positionOptionTime, mxResources.get('timeLine'));
	positionSelect.appendChild(positionOptionTime);

	var positionOptionTime = document.createElement('option');
	positionOptionTime.setAttribute('value', 'moreFloor');
	//mxUtils.write(positionOptionTable, mxResources.get('tableFloor'));
	mxUtils.write(positionOptionTime, '多场景');
	positionSelect.appendChild(positionOptionTime);

	var positionOptionGis = document.createElement('option');
	positionOptionGis.setAttribute('value', 'gisFloor');
	mxUtils.write(positionOptionGis, mxResources.get('gisFloor'));
	positionOptionGis.setAttribute('disabled', 'true');
	positionSelect.appendChild(positionOptionGis);

	td = document.createElement('td');
	td.appendChild(positionSelect);

	row.appendChild(td);
	tbody.appendChild(row);



	var calculateSelect = document.createElement('select');
	calculateSelect.className = "geButton geColorBtn";
	calculateSelect.style.position = 'absolute';
	calculateSelect.style.width = '180px';
	calculateSelect.style.marginTop = '-2px';

	var genericBtn = mxUtils.button(buttonText, function() {

		if (validateFn == null) {
			var layer_param = {};
			if (positionSelect.value == 'eleFloor' || positionSelect.value == 'engFloor'||positionSelect.value == 'CPSFloor') {
				$('#layerParam').find("tr").each(function() {
					var tdArr = $(this).children();
					var key1 = tdArr.eq(0).find('input').val();
					var value1 = tdArr.eq(1).find('input').val();
					if (key1 != '' && value1 != '') {
						layer_param[key1] = value1;
					}
				});
				for (var x in _layersParam) {
					if (_layersParam[x]['Application Name'] == layer_param['Application Name']) {
						toastr['info']('APPLICATION名称不允许重复');
						return;
					}
				}

			}
			if (positionSelect.value == 'timeFloor') {
				if (!_simuUnique['hasTimeLine']) {
					_simuUnique['hasTimeLine'] = 1;
					//layer_param[key1] = value1;
				} else {
					toastr['info']('已有TimeLine图层');
					return;
				}
			} else {

			}

			editorUi.hideDialog();
			fn('', positionSelect.value, layer_param);
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';

	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	op_div.appendChild(addparamBtn);
	if (editorUi.editor.cancelFirst) {
		op_div.appendChild(cancelBtn);
	}



	mxEvent.addListener(nameInput, 'keypress', function(e) {
		if (e.keyCode == 13) {
			genericBtn.click();
		}
	});

	op_div.appendChild(genericBtn);

	if (!editorUi.editor.cancelFirst) {
		op_div.appendChild(cancelBtn);
	}

	row.appendChild(td);
	//tbody.appendChild(row);
	table.appendChild(tbody);

	properties_div.appendChild(table);
	param_div.appendChild(right_table);
	s_div.appendChild(properties_div);
	s_div.appendChild(param_div);
	s_div.appendChild(op_div);
	this.container = s_div;
}



var addNewLayers = function(editorUi, filename, buttonText, fn, label, validateFn) {
	//update layerParam
	var s_div = document.createElement('div');
	var properties_div = document.createElement('div');
	//properties_div.style.float = 'left';
	var op_div = document.createElement('div');
	op_div.style['margin-top'] = '15px';

	//end
	var row, td;

	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.style.marginTop = '8px';

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	mxUtils.write(td, (label || mxResources.get('filename')) + ':');

	row.appendChild(td);

	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', filename || '');
	nameInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(nameInput);


	//row.appendChild(positionSelect);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	mxUtils.write(td, (mxResources.get('selectAppRoot')) + ':');
	row.appendChild(td);

	var positionSelect = document.createElement('select');
	positionSelect.className = "geButton geColorBtn";
	// positionSelect.style.position = 'absolute';
	positionSelect.style.width = '180px';
	// positionSelect.style.marginTop = '-2px';


	mxEvent.addListener(positionSelect, 'change', function(e) {

	});

	for (var key in _layersParam) {
		var positionOptionTable = document.createElement('option');
		positionOptionTable.setAttribute('value', _layersParam[key]['Application Name']);
		//mxUtils.write(positionOptionTable, mxResources.get('tableFloor'));
		mxUtils.write(positionOptionTable, _layersParam[key]['Application Name']);
		positionSelect.appendChild(positionOptionTable);
	}


	td = document.createElement('td');
	td.appendChild(positionSelect);

	row.appendChild(td);
	//tbody.appendChild(row);

	var genericBtn = mxUtils.button(buttonText, function() {

		if (validateFn == null || validateFn(nameInput.value)) {

//			if (_simuUnique[nameInput.value]) {
//				toastr['info']('子图名称不允许重复');
//				return;
//			} else {
//				_simuUnique[nameInput.value] = 1;
//			}
			var newValue = nameInput.value;
			
            insertNewMenu(newValue);
			
			editorUi.hideDialog();
			
			fn(nameInput.value, positionSelect.value);
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';

	this.init = function() {
		nameInput.focus();

		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS) {
			nameInput.select();
		} else {
			document.execCommand('selectAll', false, null);
		}

		// Installs drag and drop handler for links
		if (Graph.fileSupport) {
			// Setup the dnd listeners
			var dlg = table.parentNode;
			var graph = editorUi.editor.graph;
			var dropElt = null;

			mxEvent.addListener(dlg, 'dragleave', function(evt) {
				if (dropElt != null) {
					dropElt.style.backgroundColor = '';
					dropElt = null;
				}

				evt.stopPropagation();
				evt.preventDefault();
			});

			mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt) {
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10)) {
					dropElt = nameInput;
					dropElt.style.backgroundColor = '#ebf2f9';
				}

				evt.stopPropagation();
				evt.preventDefault();
			}));

			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt) {
				if (dropElt != null) {
					dropElt.style.backgroundColor = '';
					dropElt = null;
				}

				if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0) {
					nameInput.value = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
					genericBtn.click();
				}

				evt.stopPropagation();
				evt.preventDefault();
			}));
		}
	};



	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst) {
		op_div.appendChild(cancelBtn);
	}



	mxEvent.addListener(nameInput, 'keypress', function(e) {
		if (e.keyCode == 13) {
			genericBtn.click();
		}
	});

	op_div.appendChild(genericBtn);

	if (!editorUi.editor.cancelFirst) {
		op_div.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);

	properties_div.appendChild(table);
	s_div.appendChild(properties_div);
	s_div.appendChild(op_div);
	this.container = s_div;
}


var addOtherSimu = function(simuData, x, y, w, h) {

	// var loadApp = {
	// 	simuData: simuData
	// };
	// openSimu(loadApp)
	var graph = new Graph();
	var selectLayers = {};
	var doc = mxUtils.parseXml(simuData['diagram']);
	var model = new mxGraphModel();
	var codec = new mxCodec(doc);
	codec.decode(doc.documentElement, graph.getModel());
	// var graph = editorUi.editor.graph;

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.background = 'whiteSmoke';
	div.style.border = '1px solid whiteSmoke';
	div.style.height = '100%';
	div.style.marginBottom = '10px';
	div.style.overflow = 'auto';

	var tbarHeight = '30px';

	var listDiv = document.createElement('div')
	listDiv.style.padding = '35px 0px 0px 0px ';
	listDiv.style.backgroundColor = '#e5e5e5';
	listDiv.style.position = 'absolute';
	listDiv.style.overflow = 'auto';
	listDiv.style.left = '0px';
	listDiv.style.right = '0px';
	listDiv.style.top = '0px';
	listDiv.style.bottom = tbarHeight;
	div.appendChild(listDiv);

	var dragSource = null;
	var dropIndex = null;

	mxEvent.addListener(div, 'dragover', function(evt) {
		evt.dataTransfer.dropEffect = 'move';
		dropIndex = null;
		evt.stopPropagation();
		evt.preventDefault();
	});

	var layerCount = null;
	var selectionLayer = null;

	var ldiv = document.createElement('div');

	ldiv.className = 'geToolbarContainer';
	ldiv.style.position = 'absolute';
	ldiv.style.bottom = '0px';
	ldiv.style.left = '0px';
	ldiv.style.right = '0px';
	ldiv.style.height = tbarHeight;
	ldiv.style.overflow = 'hidden';
	ldiv.style.padding = '4px 0px 3px 0px';
	ldiv.style.backgroundColor = 'whiteSmoke';
	ldiv.style.borderWidth = '1px 0px 0px 0px';
	ldiv.style.borderColor = '#c3c3c3';
	ldiv.style.borderStyle = 'solid';
	ldiv.style.display = 'block';
	ldiv.style.whiteSpace = 'nowrap';

	if (mxClient.IS_QUIRKS) {
		ldiv.style.filter = 'none';
	}
	var genericBtn = mxUtils.button(mxResources.get('load'), function() {

		///console.log(selectLayers);

		_editorUI.hideDialog();
		addSimuToNewLayers(simuData, selectLayers, graph);
		for (x in selectLayers) {
			toastr['info']('Load ' + simuData.name + '. ' + x);
			setLogInfo('Load ' + simuData.name + '. ' + x);
		}

	});
	genericBtn.className = 'geBtn gePrimaryBtn';

	ldiv.appendChild(genericBtn);

	div.appendChild(ldiv);
	//刷新
	function refresh() {
		///console.log('test11');
		layerCount = graph.model.getChildCount(graph.model.root)
		listDiv.innerHTML = '';

		function addLayer(index, label, child, defaultParent) {
			var ldiv = document.createElement('div');
			ldiv.className = 'geToolbarContainer';

			ldiv.style.overflow = 'hidden';
			ldiv.style.position = 'relative';
			ldiv.style.padding = '4px';
			ldiv.style.height = '22px';
			ldiv.style.display = 'block';
			ldiv.style.backgroundColor = 'whiteSmoke';
			ldiv.style.borderWidth = '0px 0px 1px 0px';
			ldiv.style.borderColor = '#c3c3c3';
			ldiv.style.borderStyle = 'solid';
			ldiv.style.whiteSpace = 'nowrap';

			var left = document.createElement('div');
			left.style.display = 'inline-block';
			left.style.width = '100%';
			left.style.textOverflow = 'ellipsis';
			left.style.overflow = 'hidden';

			mxEvent.addListener(ldiv, 'dragover', function(evt) {
				evt.dataTransfer.dropEffect = 'move';
				dropIndex = index;
				evt.stopPropagation();
				evt.preventDefault();
			});
			mxEvent.addListener(ldiv, 'dragstart', function(evt) {
				dragSource = ldiv;

				// Workaround for no DnD on DIV in FF
				if (mxClient.IS_FF) {
					// LATER: Check what triggers a parse as XML on this in FF after drop
					evt.dataTransfer.setData('Text', '<layer/>');
				}
			});
			mxEvent.addListener(ldiv, 'dragend', function(evt) {
				if (dragSource != null) {
					graph.addCell(child, graph.model.root, dropIndex);
					dragSource = null;
					dropIndex = null;
				}

				evt.stopPropagation();
				evt.preventDefault();
			});
			//checkbox 选择框
			var inp = document.createElement('input');
			inp.setAttribute('type', 'checkbox');
			inp.setAttribute('title', mxResources.get('hideIt', [child.value || mxResources.get('background')]));
			inp.style.marginLeft = '4px';
			inp.style.marginRight = '6px';
			inp.style.marginTop = '4px';
			inp.style.width = '20px';
			// label
			var label_html = document.createElement('label');
			label_html.appendChild(inp);
			label_html.innerHTML += label;
			left.appendChild(label_html);


			//left.appendChild(inp);



			mxEvent.addListener(label_html, 'click', function(evt) { //console.log(label_html.firstChild);

				if (label_html.firstChild.checked) {
					//console.log('checked');
					selectLayers[label] = child;

				} else {
					//console.log('unchecked');
					delete selectLayers[label];
				}

			});

			//mxUtils.write(left, label);
			ldiv.appendChild(left)

			listDiv.appendChild(ldiv);
		};
		for (var i = 0; i < layerCount; i++) {
			(mxUtils.bind(this, function(child) {
				addLayer(i, child.value || mxResources.get('background'), child, child);
			}))(graph.model.getChildAt(graph.model.root, i));
		}
	};

	refresh();
	_editorUI.showDialog(div, w, h, true, true);
	this.refreshLayers = refresh;
}

var editorSubSystemPort = function(editorUi, system, systemCell, fun) {

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
		mapping = _graph.model.getCell(selectCell[0].children[i].mappingPoint);
		//mxUtils.write(td, mapping.parent.value + ' 第' + (mapping.pinn + 1) + '端口');
		if (mapping.pinn != undefined) {
			//mxUtils.write(td, mapping.parent.value + ' 第' + (mapping.pinn + 1) + '端口');
			mxUtils.write(td, mapping.parent.value + ' ' + mxResources.get('portSeat', [(mapping.pinn + 1)]));
		} else {
			mxUtils.write(td, mapping.parent.value + ' ' + (mapping.value) + mxResources.get('eleport'));
		}
		tr.appendChild(td);

		//tr=document.createElement('tr');
		td = document.createElement('td');
		td.style.width = '20%';
		mxUtils.write(td, mapping.value);
		tr.appendChild(td);

		td = document.createElement('td');
		td.id = 'td' + i;
		td.cellChildren = i;
		td.style.width = '25%';
		td.setAttribute('title', mxResources.get('editDbclickTip'));
		td.tempName = mapping.value;
		changeName[mapping.value] = selectCell[0].children[i].value;
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
					// if (tempNewCell != null) {
					// 	tempGraph.getModel().setVisible(tempNewCell[0], false);
					// 	tempGraph.getModel().setVisible(selectCell[0], true);

					// }
					var vals = positionSelect.value;
					//console.log(cell);
					var tStyle = tempGraph.getCellStyle(cell);
					that.maxLeftBorder = (that.maxLeftBorder) ? that.maxLeftBorder : that.tSystemCell.maxLeftBorder;
					that.maxRightBorder = (that.maxRightBorder) ? that.maxRightBorder : that.tSystemCell.maxRightBorder;
					if (vals == 'left' && tStyle.align == 'right') {
						//align=left;
						//routingCenterX=-0.5
						//spacingLeft=12

						// delete tStyle['spacingRight'];
						// tStyle['align']='left';
						// tStyle['routingCenterX']=0.5;
						// tStyle['spacingLeft']=12;
						cell.style = 'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;' +
							'spacingLeft=12;fontColor=#000000;strokeColor=#000000';
						cell.geometry.x = 0;
						cell.geometry.offset.x = -cell.geometry.width;
						cell.geometry.offset.y = 20 * (that.maxLeftBorder) + 2;
						//tempGraph.setCellStyles('align','left',[cell]);
						//tempGraph.setCellStyles('routingCenterX',-0.5,[cell]);
						//tempGraph.setCellStyles('spacingLeft',12,[cell]);
						//cell.geometry.offset = new mxPoint(-cell.geometry.width, 20 * (that.maxLeftBorder) + 2);
						that.maxLeftBorder++;
					} else if (vals == 'right' && tStyle.align == 'left') {
						//align=right;
						//routingCenterX=0.5
						//spacingRight=12
						// delete tStyle['spacingLeft'];
						// tStyle['align']='right';
						// tStyle['routingCenterX']=0.5;
						// tStyle['spacingRight']=12;
						cell.style = 'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;' +
							'spacingRight=12;fontColor=#000000;strokeColor=#000000';

						cell.geometry.x = 1;
						cell.geometry.offset.x = 0;
						cell.geometry.offset.y = 20 * (that.maxRightBorder) + 2;
						// tempGraph.setCellStyles('align','right',[cell]);
						// tempGraph.setCellStyles('routingCenterX',0.5,[cell]);
						// tempGraph.setCellStyles('spacingRight',12,[cell]);
						//cell.geometry.offset = new mxPoint(0, 20 * (that.maxRightBorder) + 2);
						//var 	new mxPoint(0, 20 * (that.maxRightBorder) + 2);
						that.maxRightBorder++;
					}
					that.refresh();
					//	tempGraph.model.setStyle(cell,tStyle);
					//tempGraph.setCellStyles(tStyle,[cell]);
					// var maxheight = (that.maxLeftBorder > that.maxRightBorder) ? that.maxLeftBorder : that.maxRightBorder;
					// cell.parent.geometry.height = 20 * (maxheight);
					// console.log(tStyle);
					// console.log(vals);
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
								portCell.mappingPoint = system.labelPort[this.cellChildren][0].id;

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
				var newName=''
				if(system.oldName){
					newName=tLabel.replace(system.oldName,system.name)
				}else{
					newName=system.name+'.'+tLabel
				}

				changeName[tLabel] = newName;
				mxUtils.write(td, newName);
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
		//fun();
		var newCreat = tempGraph.model.cloneCell(selectCell[0]);
		var leftNum = 0;
		var rightNum = 0;
		var maxLName = 0;
		var maxRName = 0;
		var newCreatChildLength = 0;
		if (newCreat.children) {
			newCreatChildLength = newCreat.children.length;
		}
		for (var i = 0; newCreat.children && i < newCreat.children.length;) {
			if (newCreat.children[i].visible) {
				//var tempSytle=tempGraph.getCellStyle(tempNewCell.children[i]);
				if (newCreat.children[i].geometry.offset.x < 0) {
					newCreat.children[i].geometry.offset.y = 20 * leftNum + 2
					leftNum++;
					maxLName = (maxLName > newCreat.children[i].value.length) ? maxLName : newCreat.children[i].value.length;
				} else {
					newCreat.children[i].geometry.offset.y = 20 * rightNum + 2
					rightNum++;
					maxRName = (maxRName > newCreat.children[i].value.length) ? maxRName : newCreat.children[i].value.length;

				}

				i++;
			} else {
				newCreat.remove(i);
			}
		}
		var maxheight = (leftNum > rightNum) ? leftNum : rightNum;
		newCreat.geometry.height = (maxheight * 20) ? maxheight * 20 : that.cellHeight;
		var fontSize = style[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE;
		newCreat.geometry.width = ((maxRName + maxLName) * fontSize * 0.6 + 20 > 30) ? (maxRName + maxLName) * fontSize * 0.6 + 20 : that.cellWidth;
		fun(newCreat, changeName);
		editorUi.hideDialog();
	});

	genericBtn.className = 'geBtn gePrimaryBtn';

	defDiv.appendChild(genericBtn);

	var previewBtn = mxUtils.button(mxResources.get('Refresh'), function() {
		tempGraph.model.beginUpdate();
		try {

			if (tempNewCell != null) {
				tempGraph.removeCells(tempNewCell);
				tempNewCell = null;
			}
			tempNewCell = tempGraph.model.cloneCell(selectCell[0]);

			var childrenLength = tempNewCell.children.length;
			var leftNum = 0;
			var rightNum = 0;
			var maxLName = 0;
			var maxRName = 0;
			//var newCellChildLength = 0;
			// if (tempNewCell.children) {
			// 	newCellChildLength = tempNewCell.children.length;
			// }
			for (var i = 0; i < tempNewCell.children.length;) {
				if (tempNewCell.children[i].visible) {
					//var tempSytle=tempGraph.getCellStyle(tempNewCell.children[i]);
					if (tempNewCell.children[i].geometry.offset.x < 0) {
						tempNewCell.children[i].geometry.offset.y = 20 * leftNum + 2
						leftNum++;
						maxLName = (maxLName > tempNewCell.children[i].value.length) ? maxLName : tempNewCell.children[i].value.length;
					} else {
						tempNewCell.children[i].geometry.offset.y = 20 * rightNum + 2
						rightNum++;
						maxRName = (maxRName > tempNewCell.children[i].value.length) ? maxRName : tempNewCell.children[i].value.length;

					}

					i++;
				} else {
					tempNewCell.remove(i);
				}
			}
			var maxheight = (leftNum > rightNum) ? leftNum : rightNum;
			tempNewCell.geometry.height = (maxheight * 20) ? maxheight * 20 : 20;
			var fontSize = style[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE;
			tempNewCell.geometry.width = ((maxRName + maxLName) * fontSize * 0.525 + 20 > 30) ? (maxRName + maxLName) * fontSize * 0.525 + 20 : 30;
			tempNewCell = tempGraph.importCells([tempNewCell], 0, 0, tempGraph.getDefaultParent());
			tempGraph.getModel().setVisible(tempNewCell[0], true);
			tempGraph.getModel().setVisible(selectCell[0], false);

		} finally {
			tempGraph.model.endUpdate();
			//toastr["info"](createMessage);
		}
	});

	previewBtn.className = 'geBtn gePrimaryBtn';

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
			if (dir) {
				selectCell[0].style += ';image;image=' + dir.replace(window.location.origin, '');
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



var MessgeConfirm = function(editorUi, title, options, cancelFn, apply,lable, otherbtnName, otherFn) {
	var graph = editorUi.editor.graph;
	var row, td;

	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.height = '100%';
	var tbody = document.createElement('tbody');

	row = document.createElement('tr');
	td = document.createElement('td');
	td.style.fontSize = '16px';
	mxUtils.write(td, ' ' + mxResources.get(title));
    td.setAttribute('colspan',"2");
	row.appendChild(td);
	tbody.appendChild(row);

	if (options) {
		row = document.createElement('tr');
		td = document.createElement('td');
		////选择框
		var positionSelect = document.createElement('select');
		//positionSelect.style.position = 'absolute';
		// positionSelect.style.width = '180px';
		positionSelect.style.marginTop = '-2px';
		for (var i = 0; i < options.length; i++) {
			var positionOptionEle = document.createElement('option');
			positionOptionEle.setAttribute('value', options[i]);
			mxUtils.write(positionOptionEle, mxResources.get(options[i]));
			positionSelect.appendChild(positionOptionEle);

		}

		td.appendChild(positionSelect);
		row.appendChild(td);
		tbody.appendChild(row);
	}
	if(lable){
        row = document.createElement('tr');
		td = document.createElement('td');
       // var span=document.createElement('span');
        mxUtils.write(td, ' ' + lable);
       // td.appendChild(span);
		row.appendChild(td);
        td = document.createElement('td');
        var input=document.createElement('input');
        input.val=3;
        td.appendChild(input);
		row.appendChild(td);
		tbody.appendChild(row);
    }


	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.setAttribute('align', 'right');

	// Overall scale for print-out to account for print borders in dialogs etc

	//if (cancelFn) {
		var cancelBtn = mxUtils.button(mxResources.get('cancel'), cancelFn||function() {
			editorUi.hideDialog();
		});
		cancelBtn.className = 'geBtn';

		if (editorUi.editor.cancelFirst) {
			td.appendChild(cancelBtn);
		}
	//}


	if (otherbtnName) {
		var otherBtn = mxUtils.button(mxResources.get(otherbtnName), function() {
			editorUi.hideDialog();
			otherFn();
		});
		previewBtn.className = 'geBtn';
		td.appendChild(previewBtn);
	}

	var printBtn = mxUtils.button(mxResources.get('ok'), function() {
		editorUi.hideDialog();
		if (options) {
			apply(positionSelect.value);
		} else if(lable){
			apply(input.value);
		}else{
            apply(true);
        }

	});
	printBtn.className = 'geBtn gePrimaryBtn';
	td.appendChild(printBtn);

	if (!editorUi.editor.cancelFirst) {
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);

	table.appendChild(tbody);
	return table;
};


var SaveSimuDialog = function(editorUi) {
	var setsync = $.ajaxSettings.async;
	if (setsync) {
		$.ajaxSettings.async = false;
	}
	var div = document.createElement('div');
	//div.style.overflow = 'auto';
	var _folder = '';
	for (var i = 0; i < userFolder.length; i++) {
		if (userFolder[i] == _simuProp['folder'])
			_folder += '<option value="' + userFolder[i]['id'] + '" selected>' + userFolder[i]['folder'] + '</option>';
		else
			_folder += '<option value="' + userFolder[i]['id'] + '">' + userFolder[i]['folder'] + '</option>';
	}
	if (_simuProp['share'] == 0) {
		var ch = '<label><input style="width:2em" type="radio" name="share" value="1" />是</label> <label><input style="width:2em" type="radio" name="share" value="0" checked />否</label>';
	} else {
		var ch = '<label><input style="width:2em" type="radio" name="share" checked value="1" />是</label> <label><input style="width:2em" type="radio" name="share" value="0" />否</label>';
	}
	var sidebar = '';

	$.get('/data/simulation/folder/list/', {}, function(result) {
		var folder = '';
		for (var x = 0; x < result.data.length; x++) {
			if (x == 0) {
				folder += '<li><a href="javascript:void(0)" onclick = "getFolderContent_save(\'' + result.data[x].size + '\',\'' + result.data[x].id + '\',this)" data-size="' + result.data[x].size + '" data-id="' + result.data[x].id + '" class="item-file-save fistfolder" >' + result.data[x].name + '</a></li>';
			} else {
				folder += '<li><a href="javascript:void(0)" onclick = "getFolderContent_save(\'' + result.data[x].size + '\',\'' + result.data[x].id + '\',this)" data-size="' + result.data[x].size + '" data-id="' + result.data[x].id + '" class="item-file-save " >' + result.data[x].name + '</a></li>';
			}

		}
		//console.log(folder);
		sidebar = ' <div style="float:left;width:27%;border: 2px solid rgb(238, 238, 238);">\
                <div class="sidebar project-bar"><h4 style="padding-left:36px">' + mxResources.get('chooseFolder') + '</h4></div>\
                <div class="menu"style="overflow:auto;height:170px;width:90%">\
                <ul id="folder_ul" class="sidebar-dropdown" style="display: block;">\
                ' + folder + '</ul></div></div><div style="width:70%;height:226px;float:left;margin-left: 5px;margin-bottom: 16px;border: 2px solid rgb(238, 238, 238);overflow:auto" id ="simucontent"></div><br>';
	});

	div.innerHTML = '\
    <h2>' + mxResources.get('save') + '</h2>\
    <div class="simu-param">\
    <form method="post" action="/editor/savesimu/" id="form_simusave" >\
    <input type="hidden" name="saveas" value="0" id="saveas" />\
    <input type="hidden" name="id" value="' + simuId + '" id="simuid" />\
    <input type="hidden" name="task_id" value="' + _task_id + '" id="simuid" />\
    <input type="hidden" name="csrfmiddlewaretoken" value="" id="csrf" />\
    <input type="hidden" name="simuparam" value="" id="psimuparam" />\
    <input type="hidden" name="diagram" value="" id="pdia" />\
    <input type="hidden" name="component" value="" id="pcomp" />\
    <input type="hidden" name="elecount" value="" id="pelecount" />\
    <input type="hidden" name="ctrl" value="" id="pctrl" />\
    <input type="hidden" name="ctrlcount" value="" id="pctrlcount" />\
    <input type="hidden" name="msr" value="" id="pmsr" />\
    <input type="hidden" name="msrcount" value="" id="pmsrcount" />\
    <input type="hidden" name="module" value="" id="pmod" />\
    <input type="hidden" name="modname" value="" id="pmodname" />\
    <input type="hidden" name="modcount" value="" id="pmodcount" />\
    <input type="hidden" name="meters" value="" id="pmeters" />\
    <input type="hidden" name="dspgrp" value="" id="pdspgrp" />\
    <input type="hidden" name="system" value="" id="psystem" />\
    <input type="hidden" name="systemname" value="" id="psystemname" />\
    <input type="hidden" name="systemcount" value="" id="psystemcount" />\
    <input type="hidden" name="timeline" value="" id="ptimeline" />\
    <input type="hidden" name="simuunique" value="" id="psimuunique" />\
    <div style="float:left;width:27%;">' + mxResources.get('SimuName') + '</div><div style="float:left;width:70%;"><input style="padding: 0px 0px 0px 9px;margin: 0px 0px 0px 11px;"class="param-inpt" value="' + _simuProp['name'] + '" name="name" /></div><br>\
    <div style="display:none">' + mxResources.get('SimuFolder') + '</div><div style="display:none"><select id="folderselect" class="folder" name="folder" >' + _folder + '</select>\</div><br>\
    ' + sidebar + '\
    <div style="float:left;width:27%;">' + mxResources.get('SimuNo') + '</div><div style="float:left;width:70%;"><input style="padding: 0px 0px 0px 9px;margin: 0px 0px 0px 11px;"class="param-inpt" value="' + _simuProp['folder'] + '" name="simuno"/></div><br>\
    <div style="float:left;width:27%;">' + mxResources.get('SimuDesc') + '</div><div style="float:left;width:70%;"><textarea style="padding: 0px 0px 0px 9px;margin: 15px 0px 0px 11px;height:80px"name="desc" class="param-inpt" >' + _simuProp['desc'] + '</textarea></div><br>\
    <div style="float:left;width:27%;">' + mxResources.get('IsPublic') + '</div><div style="float:left;width:70%;margin: 0px 0px 0px 11px;">' + ch + '</div><br>\
    <div style="float:left;width:27%;"><br><span class="btn btnsave" onclick="saveSimu(event)" >' + mxResources.get('SaveSimu') + '</span> <span class="btn btncancel" onclick="discardSimu(event)">' + mxResources.get('Cancel') + '</span><br></div>\
    </form>\
  </div>';

	$.ajaxSettings.async = setsync;
	this.div = div;
	//return div;
}

var SaveSimuDialogAs = function(editorUi) {
	var setsync = $.ajaxSettings.async;
	if (setsync) {
		$.ajaxSettings.async = false;
	}
	var div = document.createElement('div');
	//div.style.overflow = 'auto';
	var _folder = '';
	for (var i = 0; i < userFolder.length; i++) {
		if (userFolder[i] == _simuProp['folder'])
			_folder += '<option value="' + userFolder[i]['id'] + '" selected>' + userFolder[i]['folder'] + '</option>';
		else
			_folder += '<option value="' + userFolder[i]['id'] + '">' + userFolder[i]['folder'] + '</option>';
	}
	if (_simuProp['share'] == 0) {
		var ch = '<label><input style="width:2em" type="radio" name="share" value="1" />是</label> <label><input style="width:2em" type="radio" name="share" value="0" checked />否</label>';
	} else {
		var ch = '<label><input style="width:2em" type="radio" name="share" checked value="1" />是</label> <label><input style="width:2em" type="radio" name="share" value="0" />否</label>';
	}
	var sidebar = '';

	$.get('/data/simulation/folder/list/', {}, function(result) {
		var folder = '';
		for (var x = 0; x < result.data.length; x++) {
			if (x == 0) {
				folder += '<li><a href="javascript:void(0)" onclick = "getFolderContent_save(\'' + result.data[x].size + '\',\'' + result.data[x].id + '\',this)" data-size="' + result.data[x].size + '" data-id="' + result.data[x].id + '" class="item-file-save fistfolder" >' + result.data[x].name + '</a></li>';
			} else {
				folder += '<li><a href="javascript:void(0)" onclick = "getFolderContent_save(\'' + result.data[x].size + '\',\'' + result.data[x].id + '\',this)" data-size="' + result.data[x].size + '" data-id="' + result.data[x].id + '" class="item-file-save " >' + result.data[x].name + '</a></li>';
			}

		}
		//console.log(folder);
		sidebar = ' <div style="float:left;width:27%;border: 2px solid rgb(238, 238, 238);">\
                <div class="sidebar project-bar"><h4 style="padding-left:36px">' + mxResources.get('chooseFolder') + '</h4></div>\
                <div class="menu"style="overflow:auto;height:170px;width:90%">\
                <ul id="folder_ul" class="sidebar-dropdown" style="display: block;">\
                ' + folder + '</ul></div></div><div style="width:70%;height:226px;float:left;margin-left: 5px;margin-bottom: 16px;border: 2px solid rgb(238, 238, 238);overflow:auto" id ="simucontent"></div><br>';
	});

	div.innerHTML = '\
    <h2>' + mxResources.get('save') + '</h2>\
    <div class="simu-param">\
    <form method="post" action="/editor/savesimu/" id="form_simusave" >\
    <input type="hidden" name="saveas" value="1" id="saveas" />\
    <input type="hidden" name="id" value="' + simuId + '" id="simuid" />\
    <input type="hidden" name="task_id" value="' + _task_id + '" id="simuid" />\
    <input type="hidden" name="csrfmiddlewaretoken" value="" id="csrf" />\
    <input type="hidden" name="simuparam" value="" id="psimuparam" />\
    <input type="hidden" name="diagram" value="" id="pdia" />\
    <input type="hidden" name="component" value="" id="pcomp" />\
    <input type="hidden" name="elecount" value="" id="pelecount" />\
    <input type="hidden" name="ctrl" value="" id="pctrl" />\
    <input type="hidden" name="ctrlcount" value="" id="pctrlcount" />\
    <input type="hidden" name="msr" value="" id="pmsr" />\
    <input type="hidden" name="msrcount" value="" id="pmsrcount" />\
    <input type="hidden" name="module" value="" id="pmod" />\
    <input type="hidden" name="modname" value="" id="pmodname" />\
    <input type="hidden" name="modcount" value="" id="pmodcount" />\
    <input type="hidden" name="meters" value="" id="pmeters" />\
    <input type="hidden" name="dspgrp" value="" id="pdspgrp" />\
    <input type="hidden" name="system" value="" id="psystem" />\
    <input type="hidden" name="systemname" value="" id="psystemname" />\
    <input type="hidden" name="systemcount" value="" id="psystemcount" />\
    <input type="hidden" name="timeline" value="" id="ptimeline" />\
    <input type="hidden" name="simuunique" value="" id="psimuunique" />\
    <div style="float:left;width:27%;">' + mxResources.get('SimuName') + '</div><div style="float:left;width:70%;"><input style="padding: 0px 0px 0px 9px;margin: 0px 0px 0px 11px;"class="param-inpt" value="' + _simuProp['name'] + '" name="name" /></div><br>\
    <div style="display:none">' + mxResources.get('SimuFolder') + '</div><div style="display:none"><select id="folderselect" class="folder" name="folder" >' + _folder + '</select>\</div><br>\
    ' + sidebar + '\
    <div style="float:left;width:27%;">' + mxResources.get('SimuNo') + '</div><div style="float:left;width:70%;"><input style="padding: 0px 0px 0px 9px;margin: 0px 0px 0px 11px;"class="param-inpt" value="' + _simuProp['folder'] + '" name="simuno"/></div><br>\
    <div style="float:left;width:27%;">' + mxResources.get('SimuDesc') + '</div><div style="float:left;width:70%;"><textarea style="padding: 0px 0px 0px 9px;margin: 15px 0px 0px 11px;height:80px"name="desc" class="param-inpt" >' + _simuProp['desc'] + '</textarea></div><br>\
    <div style="float:left;width:27%;">' + mxResources.get('IsPublic') + '</div><div style="float:left;width:70%;margin: 0px 0px 0px 11px;">' + ch + '</div><br>\
    <div style="float:left;width:27%;"><br><span class="btn btnsave" onclick="saveSimu(event)" >' + mxResources.get('SaveSimu') + '</span> <span class="btn btncancel" onclick="discardSimu(event)">' + mxResources.get('Cancel') + '</span><br></div>\
    </form>\
  </div>';

	$.ajaxSettings.async = setsync;
	this.div = div;
	//return div;
}

function getFolderContent_save(pagesize, id, x) {
	//console.log('1');
	//console.log(x.innerHTML);
	$("#folderselect").val(id);
	//$('#folderselect').find("option[text='"+x.innerHTML+"']").attr("selected",true);
	//clearstatus
	$('.item-file-save').removeClass('active');
	x.className += ' active';
	var setsync = $.ajaxSettings.async;
	if (setsync) {
		$.ajaxSettings.async = false;
	}
	var url = '/data/simulation/mine/list/?type=folder&folder=' + id + '&page=1&pagesize=' + pagesize;
	$.get(url, {}, function(result) {
		$('#simucontent').html('');
		var simucontent = document.getElementById('simucontent');
		var table = document.createElement('table');
		table.rules = 'rows';
		table.style.width = '100%';
		//table.id = 'mySimu_table';
		table.innerHTML += '<thead><tr style="height: 30px;background: #fafafa;"><td>' + mxResources.get('Name') + '</td><td>' + mxResources.get('LastModified') + '</th></td></thead>';
		for (var x = 0; x < result.total; x++) {
			var tr = document.createElement('tr');
			var td = '<td style="width:75%">' + result.simulations[x].name + '</td><td>' + result.simulations[x].last_modified + '</td>';
			//tr.setAttribute('data-id', result.simulations[x].id);
			//tr.setAttribute('class', 'mySimu_table_tr');
			tr.style.borderBottom = '1px solid #eee';
			tr.style.height = '30px';
			tr.innerHTML += td;
			table.appendChild(tr);
		}
		simucontent.appendChild(table);

	});
	$.ajaxSettings.async = setsync;
}


var paramTable =function(){
	var div = document.createElement('div');
	var listcomponent = document.createElement('div');
	var listpin = document.createElement('div');
	var listtype = document.createElement('div');
	var title = document.createElement('div');
	var html ='';
	title.style.height = '35px';
	//title content
	var a = document.createElement('div');
	//a.innerHTML = 'COMPONENT';
	a.innerHTML = mxResources.get('COMPONENT');
	//a.setAttribute('href','JavaScript:Void(0);');
	a.style.cursor = 'pointer';
	a.style['font-size'] = '14px';
	a.style.float = 'left';
	a.style.height = '20px';
	a.setAttribute('class','dia-tab-hover');
	mxEvent.addListener(a, 'click', mxUtils.bind(this, function() {
			//console.log('component');
			a.setAttribute('class','dia-tab-hover');
			b.setAttribute('class','');
			c.setAttribute('class','');
			listpin.style.display = 'none';
			listtype.style.display = 'none';
			listcomponent.style.display = '';
			$('.listcomtable tr:eq(1) td').click();
		}));
	var b = document.createElement('div');
	//b.innerHTML = 'PIN';
	b.innerHTML = mxResources.get('PIN');
	//b.setAttribute('href','JavaScript:Void(0);');
	b.style.cursor = 'pointer';
	b.style['font-size'] = '14px';
	b.style.float = 'left';
	b.style.height = '20px';
	b.style.margin = '0px 0px 0px 30px';
	mxEvent.addListener(b, 'click', mxUtils.bind(this, function() {
			b.setAttribute('class','dia-tab-hover');
			a.setAttribute('class','');
			c.setAttribute('class','');
			listcomponent.style.display = 'none';
			listtype.style.display = 'none';
			listpin.style.display = '';
			$('.listpintable tr:eq(1) td').click();
			//console.log('PIn');
		}));
	var c = document.createElement('div');
	//c.innerHTML = 'Type';
	c.innerHTML = mxResources.get('Type');
	//a.setAttribute('href','JavaScript:Void(0);');
	c.style.cursor = 'pointer';
	c.style['font-size'] = '14px';
	c.style.float = 'left';
	c.style.height = '20px';
	c.style.margin = '0px 0px 0px 30px';
	mxEvent.addListener(c, 'click', mxUtils.bind(this, function() {
			//console.log('component');
			c.setAttribute('class','dia-tab-hover');
			a.setAttribute('class','');
			b.setAttribute('class','');
			listpin.style.display = 'none';
			listcomponent.style.display = 'none';
			listtype.style.display = '';
			//listcomponent.style.display = '';
			//$('.listcomtable tr:eq(1) td').click();
		}));
	//content
	listcomponent.style.height = '400px';
	//listcomponent.style['background-color'] = 'green';
	var leftdiv = document.createElement('div');
	var rightdiv = document.createElement('div');
	var listcomtable = document.createElement('table');
	var right_top_div = document.createElement('div');
	var right_buttom_div = document.createElement('div');
	leftdiv.style.float = 'left';
	leftdiv.style.width = '30%';
	leftdiv.style.height = '400px';
	leftdiv.style.overflow = 'auto';
	leftdiv.style.border = '1px solid rgb(204, 204, 204)';
	rightdiv.style.float = 'left';
	rightdiv.style.width = '66%';
	rightdiv.style.height = '100%';
	rightdiv.style['margin-left'] = '5px';
	rightdiv.style.border = '1px solid rgb(204, 204, 204)';
	//rightdiv.style['background-color'] = 'yellow';


	right_top_div.style.height = '200px';
	right_top_div.setAttribute('id','connect_comp');
	right_top_div.style['border-bottom'] = '1px solid #cccccc';
	right_buttom_div.style.height = '180px';
	right_buttom_div.style.overflow = 'auto';
	right_buttom_div.setAttribute('id','comp_param_detail');
	listcomtable.innerHTML = '<thead><tr style="height: 30px;background: #bebebe;"><td>'+mxResources.get("COMPONENTLIST")+'</td></tr></thead>';
	listcomtable.setAttribute('rules','rows');
	listcomtable.setAttribute('class','listcomtable');
	listcomtable.style.width = "92%";
	listcomtable.style.margin = '10px';

	//
	_rpssEle = [];
	var vts =[];
	var parents=_graph.model.getChildCells(_graph.model.root);
	for(var i=0;i<parents.length;i++){
	   var parent=_graph.model.getChildVertices(parents[i]);
	   for( var x in parent){
	      vts.push(parent[x]);
	  }
	}

	   // var vts = _graph.getChildVertices();
	var vtsName = _.pluck( vts,'value');
	for( var x in _pssEle){
	    if( vtsName.indexOf( x )>= 0){
		     _rpssEle.push( x );
	    }
	}
	_rpssEle.sort();
	//
	var ta = _rpssEle;
	//var ta = [];
/*	for (x in listComponent_a){
		ta.push(x);
	}*/
	ta.sort();
	for (var x = 0 ; x < ta.length; x++){
		function createtable(){
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.innerHTML = ta[x] ;
			tr.style.height = '30px';
			td.style.cursor = 'pointer';
			tr.appendChild(td);
			listcomtable.appendChild(tr);
			mxEvent.addListener(td, 'click', mxUtils.bind(this, function() {
				//console.log(td.innerHTML);
				var t = $('.active_tr');
				t.removeClass('active_tr');
				$(td).addClass('active_tr');
				component_param_table_detail(td.innerHTML);
			}));
		}

		createtable();
	}
	leftdiv.appendChild(listcomtable);
	rightdiv.appendChild(right_top_div);
	rightdiv.appendChild(right_buttom_div);
	listcomponent.appendChild(leftdiv);
	listcomponent.appendChild(rightdiv);
	//end listcomponet


	listpin.style.height = '400px';
	//listpin.style['background-color'] = 'red';
	listpin.style.display = 'none';

	var leftdiv2 = document.createElement('div');
	var rightdiv2 = document.createElement('div');
	var listpintable = document.createElement('table');
	var right_top_div2 = document.createElement('div');
	var right_buttom_div2 = document.createElement('div');
	leftdiv2.style.float = 'left';
	leftdiv2.style.width = '30%';
	leftdiv2.style.height = '400px';
	leftdiv2.style.overflow = 'auto';
	leftdiv2.style.border = '1px solid rgb(204, 204, 204)';
	rightdiv2.style.float = 'left';
	rightdiv2.style.width = '66%';
	rightdiv2.style.height = '100%';
	rightdiv2.style['margin-left'] = '5px';
	rightdiv2.style.border = '1px solid rgb(204, 204, 204)';
	right_top_div2.style.height = '200px';
	right_top_div2.setAttribute('id','pin_comp');
	right_top_div2.style['border-bottom'] = '1px solid #cccccc';
	right_buttom_div2.style.height = '180px';
	right_buttom_div2.style.overflow = 'auto';
	right_buttom_div2.setAttribute('id','pin_comp_param_detail');
	listpintable.innerHTML = '<thead><tr style="height: 30px;background: #bebebe;"><td>'+mxResources.get("COMPONENTLIST")+'</td></tr></thead>';
	listpintable.setAttribute('rules','rows');
	listpintable.setAttribute('class','listpintable');
	listpintable.style.width = "92%";
	listpintable.style.margin = '10px';

	for (var x =0 ; x < listPin_a.length; x++){
		function createtable(){
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.innerHTML = 'PIN '+ (x+1) ;
			td.setAttribute('N',x);
			tr.style.height = '30px';
			td.style.cursor = 'pointer';
			tr.appendChild(td);
			listpintable.appendChild(tr);
			mxEvent.addListener(td, 'click', function(){
				var t = $('.active_tr');
				t.removeClass('active_tr');
				$(td).addClass('active_tr');
				pin_param_table_detail(td.getAttribute('N'));
			});
		}
		createtable();
	}
	leftdiv2.appendChild(listpintable);
	rightdiv2.appendChild(right_top_div2);
	rightdiv2.appendChild(right_buttom_div2);
	listpin.appendChild(leftdiv2);
	listpin.appendChild(rightdiv2);
	//end listpin
	//list class
	listtype.style.height = '400px';
	//listtype.style['background-color'] = 'red';
	listtype.style.display = 'none';

	var leftdiv3 = document.createElement('div');
	var rightdiv3 = document.createElement('div');
	var listtypetable = document.createElement('table');
	var right_top_div3 = document.createElement('div');
	var right_buttom_div3 = document.createElement('div');
	leftdiv3.style.float = 'left';
	leftdiv3.style.width = '30%';
	leftdiv3.style.height = '400px';
	leftdiv3.style.overflow = 'auto';
	leftdiv3.style.border = '1px solid rgb(204, 204, 204)';
	leftdiv3.setAttribute('class','geSidebarContainer');
	leftdiv3.style.position = 'relative';
	rightdiv3.style.float = 'left';
	rightdiv3.style.width = '66%';
	rightdiv3.style.height = '100%';
	rightdiv3.style['margin-left'] = '5px';
	rightdiv3.style.border = '1px solid rgb(204, 204, 204)';
	right_top_div3.style.height = '400px';
	right_top_div3.style.overflow='auto';
	right_top_div3.setAttribute('id','type_comp');
/*	right_top_div3.style['border-bottom'] = '1px solid #cccccc';
	right_buttom_div3.style.height = '180px';
	right_buttom_div3.style.overflow = 'auto';
	right_buttom_div3.setAttribute('id','pin_comp_param_detail');*/
	listtypetable.innerHTML = '<thead><tr style="height: 30px;background: #bebebe;"><td>'+mxResources.get("COMPONENTLIST")+'</td></tr></thead>';
	//listtypetable.setAttribute('rules','rows');
	listtypetable.setAttribute('class','listtypetable');
	listtypetable.style.width = "92%";
	listtypetable.style.margin = '10px';

	var typecom = {};
	var collapsestyle = (!mxClient.IS_SVG) ? IMAGE_PATH + '/collapsed.gif' : 'data:image/gif;base64,R0lGODlhDQANAIABAJmZmf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNUQyRTJFNjZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNUQyRTJFNzZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFERjc3MEUxNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFERjc3MEUyNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhSMj6lrwAjcC1GyahV+dcZJgeIIFgA7';

	var expandstyle = (!mxClient.IS_SVG) ? IMAGE_PATH + '/expanded.gif' : 'data:image/gif;base64,R0lGODlhDQANAIABAJmZmf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxREY3NzBERjZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxREY3NzBFMDZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFERjc3MERENkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFERjc3MERFNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7';
	for (x in ta){
		var typec = ta[x].split('-')[0];
		if (typecom[typec] == undefined){
			typecom[typec] = [];
		}
		typecom[typec].push(ta[x]);
	}
	for (x in typecom){
		function createtable(){
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			var a = document.createElement('a');
			var cdiv = document.createElement('div');
			td.style.padding = '0px';
/*			td.innerHTML = 'PIN '+ (x+1) ;
			td.setAttribute('N',x);
			tr.style.height = '30px';
			td.style.cursor = 'pointer';*/
			a.innerHTML = x ;
			a.value = x ;
			a.setAttribute('href','javascript:void(0);');
			a.setAttribute('class','geTitle');
			a.style.backgroundImage = 'url(\'' + collapsestyle + '\')';
			a.style.backgroundRepeat = 'no-repeat';
			a.style.backgroundPosition = '0% 50%';
			a.expand = 0;
			//a.setAttribute('style',shrinkstyle);
			for (y in typecom[x]){
				function addtypecom(){
				var portraitCheckBox = document.createElement('input');
					portraitCheckBox.setAttribute('name', 'format');
					portraitCheckBox.setAttribute('type', 'checkbox');
					portraitCheckBox.setAttribute('value', typecom[x][y]);
					portraitCheckBox.style.width = '20px';
					var label = document.createElement('label');
					label.appendChild(portraitCheckBox);
					mxUtils.write(label, typecom[x][y] );
					var br = document.createElement('br');
					cdiv.appendChild(label);
					cdiv.appendChild(br);
					mxEvent.addListener(portraitCheckBox, 'click', function(evt) {
						if(portraitCheckBox.checked == true){
							console.log('add'+portraitCheckBox.value);
							addTypeComParam(portraitCheckBox.value);
						}else{
							removeTypeComParam(portraitCheckBox.value);
						}

					});
				}
				addtypecom();
					//cdiv.innerHTML += typecom[x][y] +'<br/>';
			}
			cdiv.style.display ='none';
			td.appendChild(a);
			td.appendChild(cdiv);
			tr.appendChild(td);
			listtypetable.appendChild(tr);
			mxEvent.addListener(a, 'click', function(){
				a.choosen = 1;
				var alla = $('.listtypetable').find('a');
				for (var x=0 ;x <alla.length;x++){
					if(alla[x].choosen!=1){
						if(alla[x].expand==1){
							alla[x].click();
						}
					}
				}
				a.choosen = 0;
				if (a.expand == 0){
					a.style.backgroundImage = 'url(\'' + expandstyle + '\')';
					initTypeComParam(a.value+'-1');
					cdiv.style.display = '';
					var t = $(cdiv).find('input');
					for (var ii=0 ; ii<t.length; ii++){
						t[ii].click();
					}
					a.expand=1;
				}else{
					a.style.backgroundImage = 'url(\'' + collapsestyle + '\')';
					cdiv.style.display = 'none';
					var t = $(cdiv).find('input');
					for (var ii=0 ; ii<t.length; ii++){
						if(t[ii].checked){
							t[ii].click();
						}

					}
					a.expand=0;
				}
			});
		}
		createtable();
	}


	leftdiv3.appendChild(listtypetable);
	rightdiv3.appendChild(right_top_div3);
	//rightdiv3.appendChild(right_buttom_div3);
	listtype.appendChild(leftdiv3);
	listtype.appendChild(rightdiv3);

	//list class end
	title.appendChild(a);
	title.appendChild(b);
	title.appendChild(c);
	div.appendChild(title);
	div.appendChild(listcomponent);
	div.appendChild(listpin);
	div.appendChild(listtype);
	return div;
}



function component_param_table_detail(cellname){
	var connection = '';
	var t = listComponent_a[cellname];
	var cona = [];
	if (t!=undefined){
		for (var x in t){
			for (var y = 0 ; y < t[x].length ; y ++){
				var sp = t[x][y].split('.')[0];
				cona.push(sp);
			}
		}
		cona = uniquea(cona);
	}
	connection += '<div style="margin-left:20px"><h3>Connecting COMPONENT:</h3></div><hr><div style="height:158px;overflow: auto">';
	for(var x = 0; x < cona.length ; x++){
		connection += '<a style="margin: 10px;color: #4285f4;font-size: 18px;" href="#" onclick="component_param_table_detail(\''+cona[x]+'\')">'+cona[x]+' '+'</a>';
	}
	connection += '</div>';
	$('#connect_comp').html(connection);

	var p = _pssEle[cellname];
	if (p==undefined){
		$('#comp_param_detail').html('无参数');
		return;
	}
	var pp = p.param;
	var table = document.createElement('table');
	table.innerHTML = '<thead><tr style="height: 30px;background: #bebebe;"><td>param</td><td>value</td><td>unit</td><td>desc</td></tr></thead>';
	table.style.width = "100%";
	table.setAttribute('rules','rows');
	for (var x = 0; x < p.param.length ;x++) {
		function createtable(){
			var tr = document.createElement('tr');
			var td1 = document.createElement('td');
			var td2 = document.createElement('td');
			var td3 = document.createElement('td');
			var td4 = document.createElement('td');
			td1.innerHTML = p.param[x].label ;
			td2.innerHTML = p.param[x].value ;
			td3.innerHTML = p.param[x].unit ;
			if (p.param.desc == undefined){
				//td4.innerHTML = '';
			}else {
				td4.innerHTML = p.param.desc;
			}
			td1.style.width = '25%';
			td2.style.width = '25%';
			td3.style.width = '25%';
			td2.setAttribute('N',x);
			//addListener
			mxEvent.addListener(td2, 'dblclick', function(evt, index) {
			var td = $(this);
			// 根据表格文本创建文本框 并加入表表中--文本框的样式自己调整
			var text = td.text();
			var numb = td.attr('N');
			var txt = $("<input type='text'>").val(text);
			txt.blur(function() {
				var newText = $(this).val();
				$(this).remove();
				td.text(text);
				//console.log('save');
				if(p.param[numb].value!=newText){
					if( p.param[numb]['type'] == 'num' &&( isNaN(newText) || newText.trim().length < 1) ){
					setSysInfo('参数 '+p.param[numb]['label']+' 只能为数字，且不为空','error');
					toastr["error"]('参数 '+p.param[numb]['label']+' 只能为数字，且不为空','error');
					//alert('参数 '+p.param[numb]['label']+' 只能为数字，且不为空');
						return;
					}
					if( p.param[numb]['type'] == 'str' && newText.trim().length < 1 ){
					setSysInfo('参数 '+p.param[numb]['label']+' 不能为空','error');
					toastr["error"]('参数 '+p.param[numb]['label']+' 不能为空');
					//alert('参数 '+p.param[numb]['label']+' 不能为空');
					return;
					}
					if(newText.trim().length < 1 ){
					setSysInfo('参数 '+p.param[numb]['label']+' 不能为空','error');
					//alert('参数 '+p.param[numb]['label']+' 不能为空');
					toastr["error"]('参数 '+p.param[numb]['label']+' 不能为空');
					return;
					}
					td.text(newText);
					p.param[numb].value=newText;
					toastr["info"](p.param[numb].label+' value ->'+newText);
				}
			});
			td.text("");
			td.append(txt);
			});
			//
			tr.style.height = '30px';
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tr.appendChild(td4);
			table.appendChild(tr);

		}
		createtable();
	};
	$('#comp_param_detail').html('');
	document.getElementById('comp_param_detail').append(table);
}


function pin_param_table_detail(number){
	var connection = '';
	var p = listPin_a[number];
	var tp = [];
	connection += '<div style="margin-left:20px"><h3>Connecting COMPONENT:</h3></div><hr><div style="height:158px;overflow: auto">';
	for(var x = 0 ; x < p.length; x++){
		connection += '<a style="margin: 10px;color: #4285f4;font-size: 18px;" href="#" onclick="pin_comp_param_detail_table(\''+p[x].split('.')[0]+'\')">'+p[x].split('.')[0]+' '+'</a>';
	}
	connection += '</div>';
	$('#pin_comp').html(connection);
}


function pin_comp_param_detail_table(cellname){
	var p = _pssEle[cellname];
	if (p==undefined){
		$('#pin_comp_param_detail').html('无参数');
		return;
	}
	var pp = p.param;
	var table = document.createElement('table');
	table.innerHTML = '<thead><tr style="height: 30px;background: #bebebe;"><td>param</td><td>value</td><td>unit</td><td>desc</td></tr></thead>';
	table.style.width = "100%";
	table.setAttribute('rules','rows');
	for (var x = 0; x < p.param.length ;x++) {
		function createtable(){
			var tr = document.createElement('tr');
			var td1 = document.createElement('td');
			var td2 = document.createElement('td');
			var td3 = document.createElement('td');
			var td4 = document.createElement('td');
			td1.innerHTML = p.param[x].label ;
			td2.innerHTML = p.param[x].value ;
			td3.innerHTML = p.param[x].unit ;
			if (p.param.desc == undefined){
				//td4.innerHTML = '';
			}else {
				td4.innerHTML = p.param.desc;
			}
			td1.style.width = '25%';
			td2.style.width = '25%';
			td3.style.width = '25%';
			td2.setAttribute('N',x);
			//addListener
			mxEvent.addListener(td2, 'dblclick', function(evt, index) {
			var td = $(this);
			// 根据表格文本创建文本框 并加入表表中--文本框的样式自己调整
			var text = td.text();
			var numb = td.attr('N');
			var txt = $("<input type='text'>").val(text);
			txt.blur(function() {
				// 失去焦点，保存值。于服务器交互自己再写,最好ajax
				var newText = $(this).val();
				// 移除文本框,显示新值
				$(this).remove();
				td.text(text);
				//console.log('save');
				if(p.param[numb].value!=newText){
					if( p.param[numb]['type'] == 'num' &&( isNaN(newText) || newText.trim().length < 1) ){
					setSysInfo('参数 '+p.param[numb]['label']+' 只能为数字，且不为空','error');
					toastr["error"]('参数 '+p.param[numb]['label']+' 只能为数字，且不为空','error');
					//alert('参数 '+p.param[numb]['label']+' 只能为数字，且不为空');
						return;
					}
					if( p.param[numb]['type'] == 'str' && newText.trim().length < 1 ){
					setSysInfo('参数 '+p.param[numb]['label']+' 不能为空','error');
					toastr["error"]('参数 '+p.param[numb]['label']+' 不能为空');
					//alert('参数 '+p.param[numb]['label']+' 不能为空');
					return;
					}
					if(newText.trim().length < 1 ){
					setSysInfo('参数 '+p.param[numb]['label']+' 不能为空','error');
					//alert('参数 '+p.param[numb]['label']+' 不能为空');
					toastr["error"]('参数 '+p.param[numb]['label']+' 不能为空');
					return;
					}
					td.text(newText);
					p.param[numb].value=newText;
					toastr["info"](p.param[numb].label+' value ->'+newText);
				}
			});
			td.text("");
			td.append(txt);
			});
			//
			tr.style.height = '30px';
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tr.appendChild(td4);
			table.appendChild(tr);

		}
		createtable();
	};
	$('#pin_comp_param_detail').html('');
	document.getElementById('pin_comp_param_detail').append(table);
}


function initTypeComParam(cellname){
	var table = document.createElement('table');
	table.style.width = '100%';
	table.setAttribute('id','typeCompParamTable');
	var html = '<thead><tr style="height: 30px;background: #bebebe;"><td>Name</td>';
	var html_end = '</tr></thead>';
	var p = _pssEle[cellname].param;
	for (var x = 0 ; x < p.length ; x++ ){
		html += '<td>'+ p[x].label +'</td>';
	}
	html += html_end ;
	table.innerHTML = html;
	$('#type_comp').html('');
	document.getElementById('type_comp').appendChild(table);
}


function addTypeComParam(cellname){
	var div = document.createElement('div');
	var table = document.createElement('table');
	var p = _pssEle[cellname].param;
	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	td1.innerHTML = cellname;
	tr.appendChild(td1);
	tr.setAttribute('id','comp_'+cellname);
	for (var x = 0 ; x < p.length ; x++){
		function createtable(){
			var td2 = document.createElement('td');
			td2.innerHTML = p[x].value;
			td2.setAttribute('N',x);
			tr.appendChild(td2);
			mxEvent.addListener(td2, 'dblclick', function(evt, index) {
			var td = $(this);
			// 根据表格文本创建文本框 并加入表表中--文本框的样式自己调整
			var text = td.text();
			var numb = td.attr('N');
			var txt = $("<input type='text'>").val(text);
			txt.blur(function() {
				// 失去焦点，保存值。于服务器交互自己再写,最好ajax
				var newText = $(this).val();
				// 移除文本框,显示新值
				$(this).remove();
				td.text(text);
				//console.log('save');
				if(p[numb].value!=newText){
					if( p[numb]['type'] == 'num' &&( isNaN(newText) || newText.trim().length < 1) ){
					setSysInfo('参数 '+p[numb]['label']+' 只能为数字，且不为空','error');
					toastr["error"]('参数 '+p[numb]['label']+' 只能为数字，且不为空','error');
					//alert('参数 '+p.param[numb]['label']+' 只能为数字，且不为空');
						return;
					}
					if( p[numb]['type'] == 'str' && newText.trim().length < 1 ){
					setSysInfo('参数 '+p[numb]['label']+' 不能为空','error');
					toastr["error"]('参数 '+p[numb]['label']+' 不能为空');
					//alert('参数 '+p.param[numb]['label']+' 不能为空');
					return;
					}
					if(newText.trim().length < 1 ){
					setSysInfo('参数 '+p[numb]['label']+' 不能为空','error');
					//alert('参数 '+p.param[numb]['label']+' 不能为空');
					toastr["error"]('参数 '+p[numb]['label']+' 不能为空');
					return;
					}
					td.text(newText);
					p[numb].value=newText;
					toastr["info"](p[numb].label+' value ->'+newText);
				}
			});
			td.text("");
			td.append(txt);
			});

		}
		createtable();
	}
	document.getElementById('typeCompParamTable').appendChild(tr);

}

function removeTypeComParam(cellname){
	$('#comp_'+cellname).remove();
}


var listPin_a = [];
var listComponent_a = {};

function uniquea(a){
	a.sort(); //先排序
	var res = [a[0]];
	for(var i = 1; i < a.length; i++){
		if(a[i] !== res[res.length - 1]){
			res.push(a[i]);
		}
	}
	return res;
}

var iconDialog = function(editorUi, fct) {
	var iconlog = document.createElement('div');
	var title = document.createElement('h4');
	title.innerHTML = '子图层图标样式';
	iconlog.appendChild(title);
	var iconDiv = document.createElement('div');
	iconDiv.style.overflow = 'auto';
	iconDiv.style.height = '210px'
	var iconTable = document.createElement('table');
	iconTable.style.heigth = '210px';
	var icontr = document.createElement('tr');
	var icontd = document.createElement('td');
	var lineCount = 0;
	var selectTd = null;
	$.getJSON(STENCIL_PATH + "/icon.json", function(data) {

		var iconDir = data['chartIcon']['iconDir'];
		var iconList = data['chartIcon']['iconName'];

		//icontr=document.createElement('tr');
		for (var i = 0; i < iconList.length; i++) {
			(function(dir) {
				icontd = document.createElement('td');
				icontd.style.height = '75px';
				lineCount++;

				var img = document.createElement('img');
				img.src = STENCIL_PATH + '/' + iconDir + '/' + dir;
				img.style.height = '55px';
				icontd.appendChild(img);
				icontr.appendChild(icontd);
				if (lineCount >= 5) {
					lineCount = 0;
					icontr = document.createElement('tr');
					iconTable.appendChild(icontr);
				}
				mxEvent.addListener(img, 'click', function(evt) {
					if (selectTd == null) {
						selectTd = this;
						this.style.border = 'rgba(99, 77, 23, 0.38) solid 3px';
					} else {
						selectTd.style.border = '';
						selectTd = this;
						this.style.border = 'rgba(99, 77, 23, 0.38) solid 3px';
					}
				})
			})(iconList[i])

		}
	})
	iconTable.appendChild(icontr);
	iconDiv.appendChild(iconTable);
	iconlog.appendChild(iconDiv);
	var genericBtn = mxUtils.button(mxResources.get('create'), function() {
		editorUi.hideDialog();
		console.log(selectTd.src);
		fct(selectTd.src);
	})
	genericBtn.className = 'geBtn gePrimaryBtn';
	genericBtn.style.position = 'relative';
	genericBtn.style.top = '7px';
	iconlog.appendChild(genericBtn);
	var cancelBtn = mxUtils.button(mxResources.get('Cancel'), function() {
		editorUi.hideDialog();

	});
	cancelBtn.className = 'geBtn';
	cancelBtn.style.position = 'relative';
	cancelBtn.style.top = '7px';
	iconlog.appendChild(cancelBtn);

	return iconlog;

}


var EditShapeDialog = function(editorUi, cell, title, w, h) {
	w = (w != null) ? w : 300;
	h = (h != null) ? h : 120;
	var row, td;

	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.style.cellPadding = '4px';

	row = document.createElement('tr');

	td = document.createElement('td');
	td.setAttribute('colspan', '2');
	td.style.fontSize = '10pt';
	mxUtils.write(td, title);

	row.appendChild(td);
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');

	var nameInput = document.createElement('textarea');
	nameInput.style.outline = 'none';
	nameInput.style.resize = 'none';
	nameInput.style.width = (w - 200) + 'px';
	nameInput.style.height = h + 'px';

	this.textarea = nameInput;

	this.init = function() {
		nameInput.focus();
		nameInput.scrollTop = 0;
	};

	td.appendChild(nameInput);
	row.appendChild(td);

	td = document.createElement('td');

	var container = document.createElement('div');
	container.style.position = 'relative';
	container.style.border = '1px solid gray';
	container.style.top = '6px';
	container.style.width = '200px';
	container.style.height = (h + 4) + 'px';
	container.style.overflow = 'hidden';
	container.style.marginBottom = '16px';
	mxEvent.disableContextMenu(container);
	td.appendChild(container);

	var graph = new Graph(container);
	graph.setEnabled(false);

	var clone = editorUi.editor.graph.cloneCells([cell])[0];
	graph.addCells([clone]);

	var state = graph.view.getState(clone);
	var stencil = '';

	if (state.shape != null && state.shape.stencil != null) {
		stencil = mxUtils.getPrettyXml(state.shape.stencil.desc);
	}

	mxUtils.write(nameInput, stencil || '');

	var b = graph.getGraphBounds();
	var ns = Math.min((200 - 40) / b.width, (h - 40) / b.height);
	graph.view.scaleAndTranslate(ns, 20 / ns - b.x, 20 / ns - b.y);

	row.appendChild(td);
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.setAttribute('colspan', '2');
	td.style.paddingTop = '2px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst) {
		td.appendChild(cancelBtn);
	}

	/*	if (!editorUi.isOffline())
		{
			var helpBtn = mxUtils.button(mxResources.get('help'), function()
			{
				window.open('https://desk.draw.io/support/solutions/articles/16000052874-how-to-create-and-edit-shapes-');
			});

			helpBtn.className = 'geBtn';
			td.appendChild(helpBtn);
		}*/

	var updateShape = function(targetGraph, targetCell, hide) {
		var newValue = nameInput.value;

		// Checks if XML has changed (getPrettyXml "normalizes" DOM)
		var doc = mxUtils.parseXml(newValue);
		newValue = mxUtils.getPrettyXml(doc.documentElement);

		// Checks for validation errors
		// LATER: Validate against XSD
		var errors = doc.documentElement.getElementsByTagName('parsererror');

		if (errors != null && errors.length > 0) {
			editorUi.showError(mxResources.get('error'), mxResources.get('containsValidationErrors'), mxResources.get('ok'));
		} else {
			if (hide) {
				editorUi.hideDialog();
			}

			var isNew = !targetGraph.model.contains(targetCell);

			if (!hide || isNew || newValue != stencil) {
				// Transform XML value to be used in cell style
				newValue = editorUi.editor.graph.compress(newValue);

				targetGraph.getModel().beginUpdate();
				try {
					// Inserts cell if required
					if (isNew) {
						var pt = editorUi.editor.graph.getInsertPoint();
						targetCell.geometry.x = pt.x;
						targetCell.geometry.y = pt.y;
						targetGraph.addCell(targetCell)
					}

					targetGraph.setCellStyles(mxConstants.STYLE_SHAPE, 'stencil(' + newValue + ')', [targetCell]);
				} catch (e) {
					throw e;
				} finally {
					// Updates the display
					targetGraph.getModel().endUpdate();
				}

				// Updates selection after stencil was created for rendering
				if (isNew) {
					targetGraph.setSelectionCell(targetCell);
				}
			}
		}
	};

	var previewBtn = mxUtils.button(mxResources.get('preview'), function() {
		updateShape(graph, clone, false);
	});

	previewBtn.className = 'geBtn';
	td.appendChild(previewBtn);

	var applyBtn = mxUtils.button(mxResources.get('apply'), function() {
		updateShape(editorUi.editor.graph, cell, true);
	});

	applyBtn.className = 'geBtn gePrimaryBtn';
	td.appendChild(applyBtn);

	if (!editorUi.editor.cancelFirst) {
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

//查看修改上传文件
function ShowUpDialog(ui,param){
	var dialogDiv=document.createElement('div');
    var table=document.createElement('table');
    table.id='uptable';
    var data=param.value;
    if((typeof data)=='object'&&data[0].length>0){
        this.isCreate=true;
        var headList=data[0];
        this.columns=[];
        this.group=data[0]
        var thead=document.createElement('thead');
        var tr = document.createElement('tr');
        for(var i=0;i<this.group[0].length;i++){

			var td = document.createElement('td');
            mxUtils.write(td,'data'+i)
            tr.appendChild(td);
        }
		thead.appendChild(tr);
        table.appendChild(thead);
        var tbody=document.createElement('tbody');
        var that=this;
        function createCloumn(index,column){
            tr = document.createElement('tr');
           // tr._index=index;
            for(var j=0;j<column.length;j++){
                (function (row,col){
					td = document.createElement('td');
                    mxUtils.write(td,column[col]);
                    mxEvent.addListener(td, 'dblclick', function(evt, index) {
                        var td = $(this);
                        // 根据表格文本创建文本框 并加入表表中--文本框的样式自己调整
                        var text = td.text();

                        var txt = $("<input type='text'>").val(text);

                        txt.blur(function() {
                            // 失去焦点，保存值。于服务器交互自己再写,最好ajax
                            var newText = $(this).val();

                            // 移除文本框,显示新值
                            $(this).remove();
                            console.log(newText)
                            console.log(row,col)

                            console.log(param);
                            if(newText!==''){
                                td.text(newText);
                                param.value[0][row][col]=newText;
                            }else{
                                td.text(param.value[0][row][col])
                            }

                        });
                        td.text("");
                        td.append(txt);
                        txt.focus();
                        txt.select();
                    });

                    tr.appendChild(td);
                })(index,j)
            }
            mxEvent.addListener(tr, 'click', function() {
                if ( $(this).hasClass('selected') ) {
            		$(this).removeClass('selected');
                }
                else {
                    $('#uptable').DataTable().$('tr.selected').removeClass('selected');
                   // table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            })

            tbody.appendChild(tr);
            return tr;
        }
        for(var i=0;i<this.group.length;i++){
            var column=this.group[i];
            createCloumn(i,column);
        }
         table.appendChild(tbody);
        console.log('test')
        //$(table).DataTable();
    }else{
        this.isCreate=false;
    }
    this.init=function(){
        var tableObj = document.getElementById('uptable').rows[0];
        if(tableObj){


        $('#uptable').dataTable( {
          	"scrollX": true,
            "scrollY": 350,
            "autoWidth": false,
            "oLanguage": {
               "oAria": {
                   "sSortAscending": " - click/return to sort ascending",
                   "sSortDescending": " - click/return to sort descending"
               },
               "sLengthMenu": "显示 _MENU_ 记录",
               "sZeroRecords": "对不起，查询不到任何相关数据",
               "sEmptyTable": "未有相关数据",
               "sLoadingRecords": "正在加载数据-请等待...",
               "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
               "sInfoEmpty": "当前显示0到0条，共0条记录",
               "sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
               "sProcessing": "<img src='../resources/user_share/row_details/select2-spinner.gif'/> 正在加载数据...",
               "sSearch": "模糊查询：",
               "sUrl": "",
               //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
               "oPaginate": {
                   "sFirst": "首页",
                   "sPrevious": " 上一页 ",
                   "sNext": " 下一页 ",
                   "sLast": " 尾页 "
               }
           }
           // "lengthChange": false
        } );
            }
    }


    dialogDiv.appendChild(table);

     var deleteBtn = mxUtils.button(mxResources.get('delete'), function() {
         that.group.splice($('#uptable').DataTable().row('.selected').index(),1);
		 $('#uptable').DataTable().row('.selected').remove().draw( false );

	});
    deleteBtn.className = 'geBtn gePrimaryBtn';
    var addBtn = mxUtils.button(mxResources.get('insert'), function() {
		var length=that.group.length;
        var newList=[];
        for(var i=0;i<that.group[0].length;i++){
            newList.push(0);
        }
        that.group.push(newList);
		var row=createCloumn(length,that.group[length]);
      	$('#uptable').DataTable().row.add(row).draw();
	});
     addBtn.className = 'geBtn gePrimaryBtn';
    dialogDiv.appendChild(deleteBtn);
    dialogDiv.appendChild(addBtn);
    this.container= dialogDiv;

}

var StorageDialog = function(editorUi, fn, rowLimit,runApp)
{
	rowLimit = (rowLimit != null) ? rowLimit : 3;

	var div = document.createElement('div');
	div.style.textAlign = 'center';
	div.style.whiteSpace = 'nowrap';
	div.style.paddingTop = '0px';
	div.style.paddingBottom = '20px';

	//var elt = editorUi.addLanguageMenu(div);
	var bottom = '28px';

	// if (elt != null)
	// {
	// 	elt.style.bottom = bottom;
	// }

	/*if (!editorUi.isOffline() && editorUi.getServiceCount() > 1)
	{
		var help = document.createElement('a');
		help.setAttribute('href', 'https://support.draw.io/display/DO/Selecting+Storage');
		help.setAttribute('title', mxResources.get('help'));
		help.setAttribute('target', '_blank');
		help.style.position = 'absolute';
		help.style.textDecoration = 'none';
		help.style.cursor = 'pointer';
		help.style.fontSize = '12px';
		help.style.bottom = bottom;
		help.style.left = '26px';
		help.style.color = 'gray';
		mxUtils.write(help, mxResources.get('help'));

		div.appendChild(help);
	}*/

	var demo = document.createElement('div');
	demo.style.position = 'absolute';
	demo.style.cursor = 'pointer';
	demo.style.fontSize = '12px';
	demo.style.bottom = bottom;
	demo.style.color = 'gray';
	mxUtils.write(demo, mxResources.get('cancel'));

	/*if (editorUi.isOfflineApp())
	{
		demo.style.right = '20px';
	}
	else
	{*/
		mxUtils.setPrefixedStyle(demo.style, 'transform', 'translate(-50%,0)');
		demo.style.left = '50%';
	//}

	this.init = function()
	{
		if (mxClient.IS_QUIRKS || document.documentMode == 8)
		{
			demo.style.marginLeft = -Math.round(demo.clientWidth / 2) + 'px';
		}
	};

	div.appendChild(demo);

	mxEvent.addListener(demo, 'click', function()
	{
		editorUi.hideDialog();
	});

	var buttons = document.createElement('div');

	if (mxClient.IS_QUIRKS)
	{
		buttons.style.whiteSpace = 'nowrap';
		buttons.style.cssFloat = 'left';
	}

	buttons.style.border = '1px solid #d3d3d3';
	buttons.style.borderWidth = '1px 0px 1px 0px';
	buttons.style.padding = '18px 0px 18px 0px';

	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.setAttribute('checked', 'checked');
	cb.defaultChecked = true;
	var count = 0;

	function addLogo(img, title, mode, clientName)
	{
		var button = document.createElement('a');
		button.style.overflow = 'hidden';

		var logo = document.createElement('img');
		logo.setAttribute('src', img);
		logo.setAttribute('border', '0');
		logo.setAttribute('align', 'absmiddle');
		logo.style.width = '60px';
		logo.style.height = '60px';
		logo.style.paddingBottom = '6px';
		button.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
		button.className = 'geBaseButton';
		button.style.position = 'relative';
		button.style.margin = '4px';
		button.style.padding = '8px 10px 12px 10px';
		button.style.whiteSpace = 'nowrap';

		// Workaround for quirks is a vertical list (limited to max 2 items)
		if (mxClient.IS_QUIRKS)
		{
			button.style.cssFloat = 'left';
			button.style.zoom = '1';
		}

		button.appendChild(logo);

		var label = document.createElement('div');
		button.appendChild(label);
		label.style.height = '20px';
		title_span = document.createElement('span');
		title_span.style.lineHeight = '20px';
		mxUtils.write(title_span, title);
		label.appendChild(title_span);

		function initButton()
		{
			mxEvent.addListener(button, 'click', function()
			{
				runApp=runApp?runApp:appRoots;
				// Special case: Redirect all drive users to draw.io pro
				if(clientName=='old'){
					startSimu();
				}else{
					editorUi.simuCheck.genConnectionInfo(runApp);
				}

        		$('#startsimu').addClass('disabled');
        		editorUi.hideDialog();
			});
		};

		// Supports lazy loading
		/*if (clientName != null && editorUi[clientName] == null)
		{
			logo.style.visibility = 'hidden';
			mxUtils.setOpacity(label, 10);
			var size = 12;

			var spinner = new Spinner({
				lines: 12, // The number of lines to draw
				length: size, // The length of each line
				width: 5, // The line thickness
				radius: 10, // The radius of the inner circle
				rotate: 0, // The rotation offset
				color: '#000', // #rgb or #rrggbb
				speed: 1.5, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				top: '40%',
				zIndex: 2e9 // The z-index (defaults to 2000000000)
			});
			spinner.spin(button);

			// Timeout after 30 secs
			var timeout = window.setTimeout(function()
			{
				if (editorUi[clientName] == null)
				{
					spinner.stop();
					button.style.display = 'none';
				}
			}, 30000);

			editorUi.addListener('clientLoaded', mxUtils.bind(this, function()
			{
				if (editorUi[clientName] != null)
				{
					window.clearTimeout(timeout);
					mxUtils.setOpacity(label, 100);
					logo.style.visibility = '';
					spinner.stop();
					initButton();
				}
			}));
		}
		else
		{*/
			initButton();
		//}

		buttons.appendChild(button);

		if (++count >= rowLimit)
		{
			mxUtils.br(buttons);
			count = 0;
		}
	};

	var hd = document.createElement('p');
	hd.style.fontSize = '16pt';
	hd.style.padding = '0px';
	hd.style.paddingTop = '4px';
	hd.style.paddingBottom = '16px';
	hd.style.margin = '0px';
	hd.style.color = 'gray';
	mxUtils.write(hd,mxResources.get('selectcalcnode'));
	div.appendChild(hd);


	addLogo('/static/template/img/13ca99717cb360e613f1e697a70f9a02.png', mxResources.get('cloudpss'), 'cloudpss', 'old');
	//addLogo('/static/template/img/13ca99717cb360e613f1e697a70f9a02.png','热工', 'cloudpss', 'old');
	addLogo('/static/icons/20170508-363e91035904438c8464510b16b6f232.jpg', '清华节点', '清华节点', 'old');


	div.appendChild(buttons);

	var p2 = document.createElement('p');
	p2.style.marginTop = '12px';
	p2.style.marginBottom = '10px';
	p2.appendChild(cb);

	var span = document.createElement('span');
	span.style.color = 'gray';
	span.style.fontSize = '12px';
	mxUtils.write(span, ' ' + mxResources.get('rememberThisSetting'));
	p2.appendChild(span);
	mxUtils.br(p2);

	//var recent = editorUi.getRecent();
	var recent=null;
	if (recent != null && recent.length > 0)
	{
		var recentSelect = document.createElement('select');
		recentSelect.style.marginTop = '14px';
		recentSelect.style.width = '140px';

		var titleOption = document.createElement('option');
		titleOption.setAttribute('value', '');
		titleOption.setAttribute('selected', 'selected');
		titleOption.style.textAlign = 'center';
		mxUtils.write(titleOption, mxResources.get('openRecent') + '...');
		recentSelect.appendChild(titleOption);

		for (var i = 0; i < recent.length; i++)
		{
			(function(entry)
			{
				var modeKey = entry.mode;

				// Google and oneDrive use different keys
				if (modeKey == App.MODE_GOOGLE)
				{
					modeKey = 'googleDrive';
				}
				else if (modeKey == App.MODE_ONEDRIVE)
				{
					modeKey = 'oneDrive';
				}

				var entryOption = document.createElement('option');
				entryOption.setAttribute('value', entry.id);
				mxUtils.write(entryOption, entry.title + ' (' + mxResources.get(modeKey) + ')');
				recentSelect.appendChild(entryOption);
			})(recent[i]);
		}

		p2.appendChild(recentSelect);

		mxEvent.addListener(recentSelect, 'change', function(evt)
		{
			if (recentSelect.value != '')
			{
				editorUi.loadFile(recentSelect.value);
			}
		});
	}
	else
	{
		p2.style.marginTop = '20px';
		buttons.style.padding = '30px 0px 26px 0px';
	}

	mxEvent.addListener(span, 'click', function(evt)
	{
		cb.checked = !cb.checked;
		mxEvent.consume(evt);
	});

	this.container = div;
};
function ShowParamDialog(ui, paramList) {
	var dialogDiv = document.createElement('div');
	var table = document.createElement('table');
	table.id = 'ShowParam';

	this.isCreate = true;
	var thead = document.createElement('thead');
	var tr = document.createElement('tr');
	//列数
	for (var i = 0; i < paramList.length; i++) {
		var td = document.createElement('td');
		mxUtils.write(td, paramList[i].label)
		tr.appendChild(td);
	}
	thead.appendChild(tr);
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	var that = this;
	//创建一行和单元格 行号 列数
	function createCloumn(index, column) {
		tr = document.createElement('tr');
		// tr._index=index;
		for (var j = 0; j < column; j++) {
			(function(row, col) {
				td = document.createElement('td');
				mxUtils.write(td, paramList[col]['value'][row]?paramList[col]['value'][row]:0);
				mxEvent.addListener(td, 'dblclick', function(evt, index) {
					var td = $(this);
					// 根据表格文本创建文本框 并加入表表中--文本框的样式自己调整
					var text = td.text();

					var txt = $("<input type='text'>").val(text);

					txt.blur(function() {
						// 失去焦点，保存值。于服务器交互自己再写,最好ajax
						var newText = $(this).val();

						// 移除文本框,显示新值
						$(this).remove();
						if (newText !== '') {
							td.text(newText);
							paramList[col]['value'][row] = newText;
							//param.value[0][row][col]=newText;
						} else {
							td.text(paramList[col]['value'][row])
						}

					});
					td.text("");
					td.append(txt);
					txt.focus();
					txt.select();
				});

				tr.appendChild(td);
			})(index, j)
		}
		mxEvent.addListener(tr, 'click', function() {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				$('#ShowParam').DataTable().$('tr.selected').removeClass('selected');
				// table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		})

		tbody.appendChild(tr);
		return tr;
	}
	for (var i = 0; i < paramList[0].value.length; i++) {
		createCloumn(i, paramList.length);
	}
	table.appendChild(tbody);
	console.log('test')

	this.init = function() {
		var tableObj = document.getElementById('ShowParam').rows[0];
		if (tableObj) {
			$('#ShowParam').DataTable({
				"scrollX": true,
				"scrollY": 350,
				"autoWidth": false,
				"oLanguage": {
					"oAria": {
						"sSortAscending": " - click/return to sort ascending",
						"sSortDescending": " - click/return to sort descending"
					},
					"sLengthMenu": "显示 _MENU_ 记录",
					"sZeroRecords": "对不起，查询不到任何相关数据",
					"sEmptyTable": "未有相关数据",
					"sLoadingRecords": "正在加载数据-请等待...",
					"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
					"sInfoEmpty": "当前显示0到0条，共0条记录",
					"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
					"sProcessing": "<img src='../resources/user_share/row_details/select2-spinner.gif'/> 正在加载数据...",
					"sSearch": "模糊查询：",
					"sUrl": "",
					//多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
					"oPaginate": {
						"sFirst": "首页",
						"sPrevious": " 上一页 ",
						"sNext": " 下一页 ",
						"sLast": " 尾页 "
					}
				}
				// "lengthChange": false
			});
		}
	}


	dialogDiv.appendChild(table);

	var deleteBtn = mxUtils.button(mxResources.get('delete'), function() {
		//   that.group.splice($('#uptable').DataTable().row('.selected').index(),1);
		var rowIndex = $('#ShowParam').DataTable().row('.selected').index();
		for (var i = 0; i < paramList.length; i++) {
			paramList[i].value.splice(rowIndex, 1);
		}
		$('#ShowParam').DataTable().row('.selected').remove().draw(false);

	});
	deleteBtn.className = 'geBtn gePrimaryBtn';
	var addBtn = mxUtils.button(mxResources.get('insert'), function() {
		for (var i = 0; i < paramList.length; i++) {
			paramList[i].value.push(0);
		}
		var row = createCloumn(paramList[0].value.length - 1, paramList.length);
		$('#ShowParam').DataTable().row.add(row).draw()
			//$('#uptable').DataTable();
	});
	addBtn.className = 'geBtn gePrimaryBtn';
	dialogDiv.appendChild(deleteBtn);
	dialogDiv.appendChild(addBtn);
	this.container = dialogDiv;
}

var OpenShareResultDL = function(editorUi,type){
	var container=document.createElement('div');

}


var OpenModuleDialog = function(editorUi,type)
{
	var targetid = 0;
	var fdiv = document.createElement('div');
	var div = document.createElement('div');
	div.id = 'simucontent';
	div.style.overflow = 'auto';
	div.style.float = 'left';
	div.style.width = '70%';
	div.style.height = '340px';
	div.style.marginBottom = '16px';
	div.style.border = '2px solid #eee';
	var tempthis = editorUi;
	var this_ = this;
	// var setsync = $.ajaxSettings.async;
	var html = '';
	var sidebar = '';
	var pagesize = 10;
	var page=1
	var targetid = 0;


	spinner = new Spinner(opts);


	var width50percentdiv = document.createElement('div');
	width50percentdiv.style.width = '50%';

	// $.ajaxSettings.async = true;
	var titileh3 = document.createElement('h3');
	mxUtils.write(titileh3,mxResources.get('OpenASimulation'));
	var navigation_div = document.createElement('div');
	var mysimu_div = document.createElement('div');
	var simucontent_div = document.createElement('div');
	fdiv.appendChild(titileh3);
	fdiv.appendChild(navigation_div);
	mysimu_div.appendChild(simucontent_div);
	fdiv.appendChild(mysimu_div);

	//navigation
	navigation_div.style.height = '35px';
	var nav_mysimu = document.createElement('div');
	nav_mysimu.style.display = 'inline';
	nav_mysimu.style.background = 'transparent!important';
	nav_mysimu.style.padding = '16px 4px 10px 4px';
	nav_mysimu.style.margin = '-2px 0px';
	nav_mysimu.className = 'dia-tab-hover';
		var mySimu_tab_div = document.createElement('div');
		mySimu_tab_div.style.display = 'inline-block';
		mySimu_tab_div.style.fontSize = '14px' ;
		mySimu_tab_div.style.verticalAlign = 'middle' ;
		mySimu_tab_div.style.cursor = 'pointer' ;
		mySimu_tab_div.id = 'mySimu_tab';
		mySimu_tab_div.className = 'active-dia-tab';
		var simuPform_tab_div = mySimu_tab_div.cloneNode(false);
		simuPform_tab_div.id = 'simuPform_tab';
		simuPform_tab_div.className = 'unactive-dia-tab';
		mxUtils.write(mySimu_tab_div,mxResources.get('MySimulations'));
		mxUtils.write(simuPform_tab_div,mxResources.get('SimulationPlatform'));
	nav_mysimu.appendChild(mySimu_tab_div);
	navigation_div.appendChild(nav_mysimu);


	var searchdiv = document.createElement('div');
	searchdiv.style.float = 'right';
	searchdiv.width = '30%';
	var searchinput = document.createElement('input');
	searchinput.setAttribute('placeholder', 'Find');
	searchinput.setAttribute('type', 'text');
	searchinput.setAttribute('id','searchele');
	searchinput.style.fontSize = '12px';
	searchinput.style.overflow = 'hidden';
	searchinput.style.boxSizing = 'border-box';
	searchinput.style.border = 'solid 1px #d5d5d5';
	searchinput.style.borderRadius = '4px';
	searchinput.style.width = '90%';
	searchinput.style.outline = 'none';
	searchinput.style.padding = '6px';
	searchinput.style.paddingRight = '20px'
	var searchimg = document.createElement('img');
	var searchimage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/search.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEaSURBVHjabNGxS5VxFIfxz71XaWuQUJCG/gCHhgTD9VpEETg4aMOlQRp0EoezObgcd220KQiXmpretTAHQRBdojlQEJyukPdt+b1ywfvAGc7wnHP4nlZd1yKijQW8xzNc4Su+ZOYfQ3T6/f4YNvEJYzjELXp4VVXVz263+7cR2niBxAFeZ2YPi3iHR/gYERPDwhpOsd6sz8x/mfkNG3iOlWFhFj8y89J9KvzGXER0GuEaD42mgwHqUtoljbcRsTBCeINpfM/MgZLKPpaxFxGbOCqDXmILN7hoJrTKH+axhxmcYRxP0MIDnOBDZv5q1XUNIuJxifJp+UNV7t7BFM6xeic0RMQ4Bpl5W/ol7GISx/eEUUTECrbx+f8A8xhiZht9zsgAAAAASUVORK5CYII=';
	searchimg.setAttribute('src',searchimage);
	searchimg.setAttribute('title', mxResources.get('search'));
	searchimg.style.position = 'relative';
	searchimg.style.left = '-20px';

	searchdiv.appendChild(searchinput);
	searchdiv.appendChild(searchimg);
	navigation_div.appendChild(searchdiv);






	//mysimu_div
	mysimu_div.style.display = 'block';
	mysimu_div.id = 'mysimu';


	simucontent_div.id = 'simucontent';
	simucontent_div.style.overflow = 'auto';
	simucontent_div.style.float = 'left';
	simucontent_div.style.width = '33%';
	simucontent_div.style.height = '340px';
	simucontent_div.style.marginBottom = '16px';
	simucontent_div.style.border = '2px solid rgb(238, 238, 238)';
	var simucontent_table = document.createElement('table');
	var simucontent_table_thead = document.createElement('thead');
	var simucontent_table_thead_tr = document.createElement('tr');
	var simucontent_table_tbody = document.createElement('tbody');
	simucontent_table.setAttribute('rules', 'rows');
	simucontent_table.style.width = '100%';
	simucontent_table_thead_tr.style.height = '30px';
	simucontent_table_thead_tr.style.background = '#fafafa';
	simucontent_table_thead_tr.innerHTML = '<td>'+mxResources.get('Name') +'</td>';
	simucontent_table_thead.appendChild(simucontent_table_thead_tr);
	simucontent_table.appendChild(simucontent_table_thead);
	simucontent_table.appendChild(simucontent_table_tbody);
	simucontent_div.appendChild(simucontent_table);
	// $(simucontent_div).scroll(function(){
	// 	var srollPos = $(simucontent_div).scrollTop();  
	// 	console.log(srollPos ,$(simucontent_div).height())

	// });



	//searchlistenner
	searchinput.addEventListener("input", function(e){
		//console.log(this.value);
		search(simucontent_table,this);
		function search(table,input)
		{
			var oTab=table;
			var oBt=input;
			$(table).find('tr:gt(0)').css('display','none');
			//$('#listTable tr:gt(0)').css('display','none');
			for(var i=0;i<oTab.tBodies[0].rows.length;i++)
			{
			var str1=oTab.tBodies[0].rows[i].cells[0].innerHTML.toUpperCase();
			var str2=oBt.value.toUpperCase();
			//使用string.toUpperCase()(将字符串中的字符全部转换成大写)或string.toLowerCase()(将字符串中的字符全部转换成小写)
			//所谓忽略大小写的搜索就是将用户输入的字符串全部转换大写或小写，然后把信息表中的字符串的全部转换成大写或小写，最后再去比较两者转换后的字符就行了
			/*******************************JS实现表格忽略大小写搜索*********************************/
			if(str1==str2){
			 //oTab.tBodies[0].rows[i].style.background='red';
			 oTab.tBodies[0].rows[i].style.display='';
			}
			else{
			  oTab.tBodies[0].rows[i].style.background='';
			}
			/***********************************JS实现表格的模糊搜索*************************************/
			//表格的模糊搜索的就是通过JS中的一个search()方法，使用格式，string1.search(string2);如果
			//用户输入的字符串是其一个子串，就会返回该子串在主串的位置，不匹配则会返回-1，故操作如下
			if(str1.search(str2)!=-1){
			//oTab.tBodies[0].rows[i].style.background='red';
			oTab.tBodies[0].rows[i].style.display='';}
			else{oTab.tBodies[0].rows[i].style.background='';}
			/***********************************JS实现表格的多关键字搜索********************************/
			//表格的多关键字搜索，加入用户所输入的多个关键字之间用空格隔开，就用split方法把一个长字符串以空格为标准，分成一个字符串数组，
			//然后以一个循环将切成的数组的子字符串与信息表中的字符串比较
			var arr=str2.split(' ');
			for(var j=0;j<arr.length;j++)
			{
			if(str1.search(arr[j])!=-1){
			    //oTab.tBodies[0].rows[i].style.background='red';
			    oTab.tBodies[0].rows[i].style.display='';}
			}
			}
		}

	}, false);
	//btn
	var opensimubtn = document.createElement('span');
	opensimubtn.className ='btn btnchange btnsave disabled';
	opensimubtn.id = 'target_open_simu';
	opensimubtn.style.position = 'absolute';
	opensimubtn.style.top = '470px';
	opensimubtn.style.left = '30px';
	opensimubtn.style.width='35px'
	opensimubtn.style.textAlign='center';
	mxUtils.write(opensimubtn, mxResources.get('Open'));
	mxEvent.addListener(opensimubtn, 'click',  function(e){
		editorUi.hideDialog();
		window.location.href = "/editor?id=" + targetid;
	});
	var opennewsimubtn = document.createElement('span');
	opennewsimubtn.className ='btn btnchange btnsave disabled';
	opennewsimubtn.style.marginLeft = '7px';
	opennewsimubtn.id = 'target_open_new_simu';
	opennewsimubtn.style.position = 'absolute';
	opennewsimubtn.style.top = '470px';
	opennewsimubtn.style.left = '93px';
	opennewsimubtn.style.width='130px';
	opennewsimubtn.style.textAlign='center';
	mxUtils.write(opennewsimubtn,mxResources.get('OpenInNewWindow') );
	mxEvent.addListener(opennewsimubtn, 'click',  function(e){
		editorUi.hideDialog();
		window.open("/editor?id=" + targetid);
	});
	var cancelbtn = document.createElement('span');
	cancelbtn.className ='btn btncancel';
	cancelbtn.id = 'target_close';
	cancelbtn.style.position = 'absolute';
	cancelbtn.style.top = '470px';
	cancelbtn.style.left = '256px';
	cancelbtn.style.marginLeft = '7px';
	mxUtils.write(cancelbtn, mxResources.get('Cancel'));
	mxEvent.addListener(cancelbtn, 'click',  function(e){
		editorUi.hideDialog();
	});

	fdiv.appendChild(opensimubtn);
	fdiv.appendChild(opennewsimubtn);
	fdiv.appendChild(cancelbtn);

	this.graphdiv = new newgraphdialog(_editorUI,null,null,null,307);
	fdiv.appendChild(this.graphdiv.testdiv);
	this.fillAllmysimu = function()
	{
		var url = '/data/module/mine/list/?page=1&pagesize=' + pagesize;
		$(simucontent_table_tbody).children().remove();
		$.get(url, {}, function(result) {
			if (result.success == true) {
				for (var x = 0; x < result.total; x++) {
					function addtr(){
						var tr = document.createElement('tr');
						var td1 = document.createElement('td');
						//var td2 = document.createElement('td');
						td1.style.width ='75%';
						mxUtils.write(td1,result.modules[x].name);
						//mxUtils.write(td2,result.modules[x].last_modified);
						tr.appendChild(td1);
						//tr.appendChild(td2);
						tr.lastmodifiedtime =result.modules[x].last_modified;
						tr.data_id = result.modules[x].id;
						tr.setAttribute('class', 'mySimu_table_tr');
						tr.style.cursor = 'pointer';
						tr.style.borderBottom = '1px solid #eee';
						tr.style.height = '30px';
						mxEvent.addListener(tr, 'click', mxUtils.bind(this, function(){
							//console.log($.ajaxSettings.async);
							$.ajaxSettings.async = true;
							spinner.spin(this_.graphdiv.testdiv.childNodes[0]);
							targetid = tr.data_id;
							//console.log(tr.data_id);
							$('.active_tr').removeClass('active_tr');
							$(tr).addClass('active_tr');
							$('#target_open').removeClass('disabled');
							$('#target_open_simu').removeClass('disabled');
							$('#target_open_new_simu').removeClass('disabled');
							var url = '/editor/loadSimu4thumb/?id='+targetid;
							$.get(url, {}, function(result){
								//console.log(result);
								//tr.lastmodifiedtime =result.modules[x].last_modified;
								if(result.status == 0){
									this_.graphdiv.updategraph(result.diagram);
									spinner.stop();
									this_.graphdiv.updateTimediv(tr.lastmodifiedtime);
									//console.log(tr.lastmodifiedtime);
								}

							});
						}));
						simucontent_table_tbody.appendChild(tr);
					}
					addtr();
				}
			} else {
				html += '<p>获取仿真失败</p>';
				simucontent_table.innerHTML = html;
				return;
			}
		});
	}
	// $.ajaxSettings.async = setsync;
	this.div4dialog = fdiv;


}

