<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html style="width:100%; height:100%">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Hello Toolbar</title>
<link href="css/div.css" rel="stylesheet" />
<link href="css/blue.css" rel="stylesheet" type="text/css" />

<script type="text/javascript">
	mxBasePath = 'src';
</script>


<script type="text/javascript" src="src/js/mxClient.js"></script>

<script type="text/javascript" src="css/blue.js"></script>

<script type="text/javascript">
	function main(container) {
		if (!mxClient.isBrowserSupported()) {
			mxUtils.error('Browser is not supported!', 200, false);
		} else {
			//mxEvent.disableContextMenu(container);			

			var graph = new mxGraph(container);

			// Disables tooltips on touch devices
			graph.setTooltips(!mxClient.IS_TOUCH);

			// Stops editing on enter or escape keypress
			var keyHandler = new mxKeyHandler(graph);

			// Installs a popupmenu handler using local function (see below).
			graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
				return createPopupMenu(graph, menu, cell, evt);
			};

			var parent = graph.getDefaultParent();

			graph.getModel().beginUpdate();

			try {
				var v1 = graph.insertVertex(parent, null, 'Hello', 200, 40, 80,
						40);

				var v2 = graph.insertVertex(parent, null, 'World', 300, 80, 80,
						40);

				var e1 = graph.insertEdge(parent, null, '', v1, v2);
				
				

			} finally {
				graph.getModel().endUpdate();
			}

// 			var content = document.createElement('div');
// 			content.style.padding = '4px';

// 			var tb = new mxToolbar(content);

// 			tb.addItem('放大', 'pic/zoom_in.png', function(evt) {
// 				graph.zoomIn();
// 			});

// 			tb.addItem('缩小', 'pic/zoom_out.png', function(evt) {
// 				graph.zoomOut();
// 			});

// 			tb.addItem('打印', 'pic/printer.png', function(evt) {
// 				var preview = new mxPrintPreview(graph, 1);
// 				preview.open();
// 			});

// 			tb.addItem('保存', 'pic/save.png', function(evt) {
// 				var enc = new mxCodec(mxUtils.createXmlDocument());
// 				var node = enc.encode(graph.getModel());
				
// 				var xml = mxUtils.getXml(node);
				
// 				alert(xml);

// 				var graph = designer.graph;
// 				var xmlDoc = mxUtils.createXmlDocument();
// 				var root = xmlDoc.createElement('output');
// 				xmlDoc.appendChild(root);

// 				var xmlCanvas = new mxXmlCanvas2D(root);
// 				var imgExport = new mxImageExport();
// 				imgExport.drawState(graph.getView().getState(graph.model.root),
// 						xmlCanvas);

// 				var bounds = graph.getGraphBounds();
// 				var w = Math.round(bounds.x + bounds.width + 4);
// 				var h = Math.round(bounds.y + bounds.height + 4);

// 				var xml = mxUtils.getXml(root);
// 				xml = encodeURIComponent(xml);	

// 			});

// 			wnd = new mxWindow('工具栏', content, 10, 200, 200, 50, false);
// 			wnd.setMaximizable(false);
// 			wnd.setScrollable(false);
// 			wnd.setResizable(false);
// 			wnd.setVisible(true);

			var tbContainer = document.createElement('div');
			tbContainer.style.padding = '4px';

			var toolbar = new mxToolbar(tbContainer);

			var addVertex = function(icon, w, h, style) {
				var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
				vertex.setVertex(true);

				addToolbarItem(graph, toolbar, vertex, icon);
			};

			addVertex('editors/images/rectangle.gif', 100, 40, '');
			addVertex('editors/images/rounded.gif', 100, 40, 'shape=rounded');
			addVertex('editors/images/ellipse.gif', 40, 40, 'shape=ellipse');
			addVertex('editors/images/rhombus.gif', 40, 40, 'shape=rhombus');
			addVertex('editors/images/triangle.gif', 40, 40, 'shape=triangle');
			addVertex('editors/images/cylinder.gif', 40, 40, 'shape=cylinder');
			addVertex('editors/images/actor.gif', 30, 40, 'shape=actor');
			toolbar.addLine();

			wnd = new mxWindow('基本形状', tbContainer, 10, 260, 200, 100, false);
			wnd.setMaximizable(false);
			wnd.setScrollable(false);
			wnd.setResizable(false);
			wnd.setVisible(true);

			//////////
			
			// Adds an option to view the XML of the graph
			document.body.appendChild(mxUtils.button('Save XML', function() {
				var encoder = new mxCodec();
				var node = encoder.encode(graph.getModel());
				
				var dxml = mxUtils.getPrettyXml(node);
				
				//mxUtils.popup(dxml, true);
				
				StandardPost('savexml', {'name': 'thpower', 'value': dxml});
				//ajaxString(dxml);
			}));		

			
			// Adds an option to view the JSON of the graph
			document.body.appendChild(mxUtils.button('Save JSON', function() {
				var encoder = new mxCodec();
				var node = encoder.encode(graph.getModel());
				
				var djson = mxUtils.getXml(node);
				
				mxUtils.popup(node, true);
				
				//mxUtils.popup(djson, true);
				
				StandardPost('savejson', {'name': 'thpower', 'value': djson});
				
			}));

			// Exporting to SVG using EchoServlet
			document.body.appendChild(mxUtils.button('Export SVG', function() {
				var background = '#ffffff';
				var scale = 1;
				var border = 1;

				var imgExport = new mxImageExport();
				var bounds = graph.getGraphBounds();
				var vs = graph.view.scale;

				// Prepares SVG document that holds the output
				var svgDoc = mxUtils.createXmlDocument();
				var root = (svgDoc.createElementNS != null) ? svgDoc
						.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc
						.createElement('svg');

				if (background != null) {
					if (root.style != null) {
						root.style.backgroundColor = background;
					} else {
						root.setAttribute('style', 'background-color:'
								+ background);
					}
				}

				if (svgDoc.createElementNS == null) {
					root.setAttribute('xmlns', mxConstants.NS_SVG);
					root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
				} else {
					// KNOWN: Ignored in IE9-11, adds namespace for each image element instead. No workaround.
					root.setAttributeNS('http://www.w3.org/2000/xmlns/',
							'xmlns:xlink', mxConstants.NS_XLINK);
				}

				root.setAttribute('width', (Math
						.ceil(bounds.width * scale / vs) + 2 * border)
						+ 'px');
				root.setAttribute('height', (Math.ceil(bounds.height * scale
						/ vs) + 2 * border)
						+ 'px');
				root.setAttribute('version', '1.1');

				// Adds group for anti-aliasing via transform
				var group = (svgDoc.createElementNS != null) ? svgDoc
						.createElementNS(mxConstants.NS_SVG, 'g') : svgDoc
						.createElement('g');
				group.setAttribute('transform', 'translate(0.5,0.5)');
				root.appendChild(group);
				svgDoc.appendChild(root);

				// Renders graph. Offset will be multiplied with state's scale when painting state.
				var svgCanvas = new mxSvgCanvas2D(group);
				svgCanvas.translate(Math
						.floor((border / scale - bounds.x) / vs), Math
						.floor((border / scale - bounds.y) / vs));
				svgCanvas.scale(scale / vs);

				// Displayed if a viewer does not support foreignObjects (which is needed to HTML output)
				svgCanvas.foAltText = '[Not supported by viewer]';
				imgExport.drawState(graph.getView().getState(graph.model.root),
						svgCanvas);

				var xml = encodeURIComponent(mxUtils.getXml(root));

				new mxXmlRequest('/Export', 'filename=export.svg&format=svg'
						+ '&xml=' + xml).simulate(document, '_blank');
			}));

			function exportFile(format) {
				var bg = '#ffffff';
				var scale = 1;
				var b = 1;

				var imgExport = new mxImageExport();
				var bounds = graph.getGraphBounds();
				var vs = graph.view.scale;

				// New image export
				var xmlDoc = mxUtils.createXmlDocument();
				var root = xmlDoc.createElement('output');
				xmlDoc.appendChild(root);

				// Renders graph. Offset will be multiplied with state's scale when painting state.
				var xmlCanvas = new mxXmlCanvas2D(root);
				xmlCanvas.translate(Math.floor((b / scale - bounds.x) / vs),
						Math.floor((b / scale - bounds.y) / vs));
				xmlCanvas.scale(scale / vs);

				imgExport.drawState(graph.getView().getState(graph.model.root),
						xmlCanvas);

				// Puts request data together
				var w = Math.ceil(bounds.width * scale / vs + 2 * b);
				var h = Math.ceil(bounds.height * scale / vs + 2 * b);

				var xml = mxUtils.getXml(root);

				if (bg != null) {
					bg = '&bg=' + bg;
				}

				new mxXmlRequest('/Export', 'filename=export.' + format
						+ '&format=' + format + bg + '&w=' + w + '&h=' + h
						+ '&xml=' + encodeURIComponent(xml)).simulate(document,
						'_blank');
			}

			// Exporting to bitmap using ExportServlet
			document.body.appendChild(mxUtils.button('Export PNG', function() {
				exportFile('png');
			}));

			// Exporting to PDF using ExportServlet
			document.body.appendChild(mxUtils.button('Export PDF', function() {
				exportFile('pdf');
			}));
		}

	};

	// Function to create the entries in the popupmenu
	function createPopupMenu(graph, menu, cell, evt) {
		var model = graph.getModel();

		if (cell != null) {
			if (model.isVertex(cell)) {
				menu.addItem('Add child', 'pic/user.png', function() {
					alert('Add child');
				});
				menu.addSeparator();
			}
		}
		menu.addItem('Print', 'pic/printer.png', function() {
			alert('Print');
		});
	};

	function addToolbarItem(graph, toolbar, prototype, image) {
		// Function that is executed when the image is dropped on
		// the graph. The cell argument points to the cell under
		// the mousepointer if there is one.
		var funct = function(graph, evt, cell) {
			graph.stopEditing(false);

			var pt = graph.getPointForEvent(evt);
			var vertex = graph.getModel().cloneCell(prototype);
			vertex.geometry.x = pt.x;
			vertex.geometry.y = pt.y;

			graph.addCell(vertex);
			graph.setSelectionCell(vertex);
		}

		// Creates the image which is used as the drag icon (preview)
		var img = toolbar.addMode(null, image, funct);
		mxUtils.makeDraggable(img, graph, funct);
	};	
	

	function StandardPost(url, args) {

		var myForm = document.createElement("form");
		myForm.method = "post";
		myForm.action = url;
		for ( var k in args) {
			var myInput = document.createElement("input");
			myInput.setAttribute("name", k);
			myInput.setAttribute("value", args[k]);
			myForm.appendChild(myInput);
		}

		document.body.appendChild(myForm);
		myForm.submit();
		document.body.removeChild(myForm);
	}
	
	function ajaxString(){
	    $.ajax({
	        type: 'post',
	        url: 'ajaxString',
	        data: {sa: 'ajaxString_a', sb: 'ajaxString_b'},
	        success: function(res){
	            alert(res);
	        }
	    });
	}

	function ajaxInteger(){
	    $.ajax({
	        type: 'post',
	        url: 'ajaxInteger',
	        data: {ia: 10010, ib: 10012},
	        success: function(res){
	            alert(res);
	        }
	    });
	}

	function ajaxList(){
	    var myList = new Array();
	    myList[0] = 'parameter_1';
	    myList[1] = 'parameter_2';
	    myList[2] = '参数3';
	    var myMap = {
	            'key1': 'value1',
	            'key2': 'value2',
	            'key3': 'value3'
	    }
	    $.ajax({
	        type: 'post',
	        url: 'ajaxList',
	        dataType: 'json', //表示返回值的数据类型
	        contentType: 'application/json;charset=UTF-8', //内容类型
	        traditional: true, //使json格式的字符串不会被转码
	        data: JSON.stringify({gid: 10001, myList:  myList, myMap: myMap}),
	        success: function(res){
	            alert(res.gid);
	            alert(res.myList);
	        }
	    });
	}
</script>

</head>
<body onload="main(document.getElementById('graphEditor'))"
	style="width: 100%; height: 100%">
	<div id="graphEditor"
		style="overflow: hidden; width: 100%; height: 100%; background: url('editors/images/grid.gif'); cursor: default;">
	</div>

<%
if ((String)request.getAttribute("str") == "true") {
%>
<script>
	alert("操作成功！");
</script>
<%
 }
%>

<%
 if ((String)request.getAttribute("str") == "false") {
 %>
 <script>
 alert("操作失败！");
 </script>
 <%
 }
 %>
</body>
</html>