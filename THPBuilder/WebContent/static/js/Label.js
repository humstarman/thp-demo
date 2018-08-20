/*
* @Author: wuguanhui
* @Date:   2017-11-09
*/
Label = function(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
};

Label.prototype.init = function()
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var container=this.container;


	div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';
	div.style.color = 'rgb(112, 112, 112)';
	div.style.textAlign = 'left';
	div.style.cursor = 'default';

	container.appendChild(div);
	var selectionLayer = null;


	//重命名Tab:重命名对话框
	function renameLayer(layer)
	{
		if (graph.isEnabled() && layer != null)
		{
			var dlg = new FilenameDialog(ui, layer.value || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function(newValue)
			{
				if (newValue != null)
				{
					graph.getModel().beginUpdate();
		            try
		            {   
		            	if(layer.layersType=='system'){
			            	var oldName=layer.value;
			            	var layerCells=graph.model.getChildVertices(layer);
			            	for(var i=0;i<layerCells.length;i++){
			            		for(var j=0;j<layerCells[i].children.length;j++){
			            			if(layerCells[i].children){
			            				graph.getModel().setValue(layerCells[i].children[j],layerCells[i].children[j].value.replace(oldName+'.',newValue+'.' ));
			            				//layerCells[i].children[j].value = cloneChild.value.replace(name, childrenName);
			            			}
			            		}	
			            		var tempPin=_pssEle[layerCells[i].value]['pin'];
			            		for(var pinKey in tempPin){
			            			tempPin[pinKey]['label']=tempPin[pinKey]['label'].replace(oldName+'.',newValue+'.' );
			            		}

			            	}
			            	var maxLength=newValue.length-oldName.length;

			            	_pssSystem[newValue]={}
		            		$.extend(true, _pssSystem[newValue], _pssSystem[oldName]); //深度复制模块参数
		            		delete _pssSystem[oldName];
			            	var mappingCell=graph.getModel().getCell(layer.mappingPoint);
			            	for(var i=0;i<mappingCell.children.length;i++){
			            		graph.getModel().setValue(mappingCell.children[i],mappingCell.children[i].value.replace(oldName+'.',newValue+'.' ));
			            	}
			            	if(maxLength>0){
			            		mappingCell.geometry.width +=maxLength*13;
			            	}
			            	graph.getModel().setValue(mappingCell,newValue);
			            }
						graph.getModel().setValue(layer, newValue);

					}
		            finally
		            {
		                graph.getModel().endUpdate();
		            }
					//graph.getModel().setValue(layer, newValue);
				}
			}), mxResources.get('enterName'));
			
			ui.showDialog(dlg.container, 300, 150, true, true);
			//dlg.init();
		}
	};
	
	
	//刷新tab status
	//addLayer:  添加 Tab, img: click, label: dblclick 
	//
	function refresh()
	{		
		layerCount = graph.model.getChildCount(graph.model.root);
		div.innerHTML = '';
		var openNum=0;
		
		function addLayer(index, labelname, child, defaultParent)
		{
			//定义Tab名称
			var label = document.createElement('div');			
			
			label.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
			label.style.whiteSpace = 'nowrap';
			// label.style.boxSizing = 'border-box';
			// label.style.position = 'relative';
			// label.style.cursor = 'default';
			label.style.marginLeft = '1px';
			label.style.overflow = 'hidden';
			label.style.padding = '1px 1px 1px 1px';
			//label.style.paddingTop = '8px';
			label.style.border = '1px solid #c0c0c0';
			label.style.borderWidth = '0px 0px 1px 0px';			
			label.style.borderBottomStyle = 'solid';
			label.style.borderLeftWidth = '1px';
			label.style.backgroundColor = '#BCD2EE';
			label.style.color = 'black';
			label.style.fontWeight = 'bold';
			label.style.textAlign = 'center';
			label.style.height = (mxClient.IS_QUIRKS) ? '34px' : '25px';
			
			if(CurrentID!=null && CurrentID==index)
			{
				label.style.backgroundColor = '#FFD700';
			}

			if(openNum<10){
				label.style.width = '10%';
			}else{
				label.style.width =95/(openNum+1)+'%'
			}

			//mxUtils.write(label, labelname);
			div.appendChild(label);

			var left = document.createElement('div');
			left.id = 'label'+index;
			left.style.display = 'inline-block';
			left.style.padding = '4px 2px 4px 2px';
			left.style.width = '90%';
			left.style.textAlign = 'center'
			left.style.textOverflow = 'ellipsis';
			left.style.overflow = 'hidden';
			mxUtils.write(left, labelname);
	        label.appendChild(left);

			var img = document.createElement('img');
	        img.setAttribute('border', '0');
	        img.setAttribute('src', Dialog.prototype.closeImage);
	        img.setAttribute('title', mxResources.get('hide'));
	        //img.style.display = 'block';
	        img.style.position = 'relative';
	       	img.style.right = '8px';
	        img.style.top = '-12px';
	        img.style.cursor = 'pointer';
	        img.style.marginTop = '0px';
	        img.style.marginRight = '0px';
	        img.style.border = '1px solid transparent';
	        img.style.padding = '1px';
	        img.value=index;
	        //img.style.opacity = 0.5;	        
	        
	        //禁止首页关闭
	        //if(i!=0){
	        //	label.appendChild(img);
	        //}
	        label.appendChild(img);   
	        
	        //关闭小图标点击事件
			mxEvent.addListener(img, 'click', function(evt)
			{
				if (graph.isEnabled())
				{
					//从Labels中移除, 并赋值CurrentID, nextID
					//this === img
					var labelindex = appLabels.indexOf(this.value);
					
					if (labelindex>-1)
					{
						if( labelindex==0 && (appLabels.length-1)==0)
						{
							//只有一个Label
							CurrentID = null;					
						}else if(labelindex < appLabels.length-1){
							//多个Label,且没有用点击最后一个
							CurrentID = appLabels[labelindex+1];
						}else if(labelindex == appLabels.length-1)
						{
							//多个Label，但	点击了最后一个
							CurrentID = appLabels[labelindex-1];		
						}
						
						//remove closed Label
						appLabels.splice(labelindex, 1);
						
					}else
					{
						CurrentID = null;
					}
					
					//console.log(appLabels);
					
					//var index = graph.model.root.getIndex(selectionLayer);
					if(CurrentID == null){
						graph.view.clear();
					}
					else
					{
						//绘画
						//var id = this.id;
						//var index = parseInt(id.substr('label'.length)) ;
						
						graph.setDefaultParent(defaultParent);
						graph.view.setCurrentRoot(null);

						//refresh();
//						for (var i = 0; i < layerCount; i++) {
//							var tempchild = graph.model.getChildAt(graph.model.root, i)
//							if (graph.model.isVisible(tempchild)) {
//								graph.model.setVisible(tempchild, !graph.model.isVisible(tempchild));
//							}
//						}
//
//						graph.model.setVisible(child, !graph.model.isVisible(child));
						
						if (CurrentID != _editorUI.currentAppID) {
				            changeAppRoot(CurrentID);
				        }
						
						for (var i = 0; i < appRoots.length; i++) {
                        	if(CurrentID ==i )
                    		{                        		
                        		var node = appRoots[i].root;                            
                        		//this.editor.setGraphXml(node);
                        		var newValue;                                		
                        		graph.getModel().setValue(node, newValue);
                    		}
                        }						
						
						graph.center();

						/*graph.model.beginUpdate();						
						
						try {
							var openIndex = 0;
							for (var i = 0; i < layerCount - 1; i++) {	
								if (graph.model.getChildAt(graph.model.root, i + 1) == child) {
									if (graph.model.getChildAt(graph.model.root, i + 1).isVisible()) {
	
										var tempchild = graph.model.getChildAt(graph.model.root, openIndex);
	
										graph.setDefaultParent(tempchild);
										graph.view.setCurrentRoot(null);
										tempchild.isOpen = 1;
										graph.model.setVisible(tempchild, !graph.model.isVisible(tempchild));
									}
									break;
								} else if (graph.model.getChildAt(graph.model.root, i + 1).isOpen) {
									openIndex++;
								}
							}
							child.isOpen = 0;
							if (graph.model.isVisible(child)) {
								graph.model.setVisible(child, !graph.model.isVisible(child));	
							}
							
						} finally {
							graph.model.endUpdate();
						}*/
						
					}
					//else
					//{
					//	child.isOpen = 0;
					//	//refresh();
					//}					
					
					refresh();
					
					//mxEvent.consume(evt);
				}
				
			});


			//Tab双击事件
			mxEvent.addListener(label, 'dblclick', function(evt)
			{
				if(document.getElementById('testMap1')!=null)
				{
                	ui.container.removeChild(document.getElementById('testMap1')); 
               	}else{
               		var nodeName = mxEvent.getSource(evt).nodeName;
				
					if (nodeName != 'INPUT' && nodeName != 'IMG')
					{
						renameLayer(child);
						mxEvent.consume(evt);
					}
               	}
				
			});
			
			//是否显示，并添加鼠标移入和移除效果
			/*if(graph.model.isVisible(child)){

				if (graph.getDefaultParent() != child)
				{
					graph.setDefaultParent(child);
					
				}
				//label.style.background = '#e6eff8';
				label.style.background = '#eeeeee';
				selectionLayer = child;
			}
			else*/
			{

				mxEvent.addListener(label, 'mouseenter', mxUtils.bind(this, function(evt)
				{
					if (!graph.isMouseDown)
					{
						label.style.backgroundColor = '#FFD700';
						mxEvent.consume(evt);
					}
				}));
				
				mxEvent.addListener(label, 'mouseleave', mxUtils.bind(this, function(evt)
				{
					label.style.backgroundColor = '#BCD2EE';
					mxEvent.consume(evt);
				}));
				
				// if (graph.model.isVisible(child)) {
				// 	 graph.model.setVisible(child, !graph.model.isVisible(child));
				// }
				
				mxEvent.addListener(left, 'click', function(evt) {
					if (graph.isEnabled()) {
						
						var id = this.id;
						var index = parseInt(id.substr('label'.length)) ;
						
						//click 切换 label color
						CurrentID = index;
						
						graph.setDefaultParent(defaultParent);
						graph.view.setCurrentRoot(null);

						//refresh();
//						for (var i = 0; i < layerCount; i++) {
//							var tempchild = graph.model.getChildAt(graph.model.root, i)
//							if (graph.model.isVisible(tempchild)) {
//								graph.model.setVisible(tempchild, !graph.model.isVisible(tempchild));
//							}
//						}
//
//						graph.model.setVisible(child, !graph.model.isVisible(child));
						
						if (index != _editorUI.currentAppID) {
				            changeAppRoot(index);
				        }
						
						for (var i = 0; i < appRoots.length; i++) {
                        	if(index ==i )
                    		{                        		
                        		var node = appRoots[i].root;                            
                        		//this.editor.setGraphXml(node);
                        		var newValue;                                		
                        		graph.getModel().setValue(node, newValue);
                    		}
                        }
						
						
						graph.center();

					}
					mxEvent.consume(evt);
				});
			}

		};
		
		//for (var i = 0; i < layerCount; i++)
		//{
		//	if(graph.model.getChildAt(graph.model.root, 0).isOpen != null
		//		&& graph.model.getChildAt(graph.model.root, 0).isOpen){
		//		//if(true){
		//		openNum++;
		//	}
		//}
		
		// Cannot be moved or deleted
		//for (var i = 0; i < layerCount; i++)
		//{
		//	(mxUtils.bind(this, function(child)
		//	{			
		//		 if(child.isOpen){
		//			if(child.editorName==editorName||!child.isLock){					
		//				
		//				addLayer(i, child.value || mxResources.get('NewPage'), child, child);
		//			}					
		//		}
		//		
		//	}))(graph.model.getChildAt(graph.model.root, 0));
		//}
		
		//if(nextID == null && appRoots.length>0){
		//	var i= currentID;
		//	
		//	var node= appRoots[i];
		//	var name = node.name;
		//	var child = node.root;
		//	addLayer(i, name || mxResources.get('NewPage'), child, child);				
		//}else if(nextID != null)
		//{			
			for( var i=0; i< appRoots.length; i++)
			{
				if( $.inArray(i, appLabels)>=0)
				//if(i == nextID)
				{
					var node= appRoots[i];
					var name = node.name;
					var child = node.root;
					addLayer(i, name || mxResources.get('NewPage'), child, child);	
				}			
			}
		//}

		
	};
	
	
	refresh();
	
	
	graph.model.addListener(mxEvent.CHANGE, function()
	{
		refresh();
	});
	
	
	//Label 双击事件
	graph.dblClick = function(evt, cell){

		if(cell==null){
			return ;
		}
		function getSId(obj){
			if("0" != obj.parent.parent.id)
			 	return getSId(obj.parent);
			else{

			  return obj;
			}
		}

		cell=getSId(cell);
		
		if(cell.classname&&_pssEle[cell.classname].dblchick){
			graph.model.beginUpdate();

			try {
				var shape=_pssEle[cell.classname].classname;
				  if(_pssEle[cell.classname].dblchick=='1'){
				    shape=shape+1;
				    _pssEle[cell.classname].dblchick='2';
				  }else{
				  	_pssEle[cell.classname].dblchick='1';
				  }
				  _graph.setCellStyles('shape',shape, [cell]);
			  } finally {
				graph.model.endUpdate();
			}
		}
		if (cell.thutype == "system"||cell.thutype=='oscChart') {
			if(cell.thutype=='oscChart'){
				if(cell.value.indexOf('风机')<0){
					return ;
				}
			}
			
			graph.model.beginUpdate();

			try {
				var layerCount = this.model.getChildCount(this.model.root);
				var layersChild = [];
				var va=null;
				for (var i = 0; i < layerCount; i++) {
					var tempCells = this.model.getChildAt(this.model.root, i);
					layersChild[tempCells.value] = tempCells;
					if(!va&&tempCells.value&&tempCells.value.indexOf('风机')>=0){
						va=tempCells.value;
					}	
				}
				var child ;
				if(cell.thutype=='oscChart'){
					child= layersChild[va];
				}else{
					child=this.model.getCell(cell.mappingPoint);
				}
				

				
				if(child.editorName==editorName||!child.isLock){

					this.setDefaultParent(child);
					this.view.setCurrentRoot(null);
					child.isOpen = 1;
					//refresh();
					for (var i = 0; i < layerCount; i++) {
						var tempchild = this.model.getChildAt(this.model.root, i)
						if (this.model.isVisible(tempchild)) {
							this.model.setVisible(tempchild, !this.model.isVisible(tempchild));
						}
					}
					this.model.setVisible(child, !this.model.isVisible(child));
				}else{
					alert(mxResources.get('graphLock'));
				}

			} finally {
				graph.model.endUpdate();
			}
				graph.center();
		}
	}	
	
}
