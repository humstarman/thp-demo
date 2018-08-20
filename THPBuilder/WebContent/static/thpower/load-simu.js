/*
 * Added by wugh
 * loadSimu -->  loadProject
*载入编辑功能
*/

function loadProject(simuid, editorUi){
		
    spinner.spin(document.body);
    
    //localStorage
	var jsonProject = localStorage.getItem("thpcloud.projects");
	var objProject = JSON.parse(jsonProject);
	
	simuId = GetQueryString("proid");
	simuName = GetQueryString("proname");
	
	if(objProject.total<=0 )
	{
        spinner.stop();
        
	}else 
	{
		if(simuId=="")
		{
			simuId = objProject.data[0].id;
		}
		
		for(var x=0; x<objProject.total; x++)
		{
			if(simuId == objProject.data[x].id)
			{
				simuId = objProject.data[x].id;
				simuName = objProject.data[x].name;		
			}			
		}		
	
	    $.get(
	        '/THPBuilder/loadProject',
	        {proid: simuId},
	        function(response, status, jxhr){         	
	            if( status == "success" )
	            {  
	            	//Shoud Inited When Enter this Page;            	
	            	//for test
	                //response.diagram = appdiagram;
	
	                setProjectVar(response, editorUi);  
	                
	            }else{
	                alert("load project error!");
	            }
	            
	            spinner.stop();
	            
	        },
	        'json'
	    );
	}
    
}

/**
 * setSimuVar   -->  setProjectVar
 */
function setProjectVar(data, editorUi){
	
    // var doc = mxUtils.parseXml(data['diagram']);

	// 仿真数据
	 _simuPARAM = data.simuparam||{}
	 _simuPARAM['_isSet'] = false;

	 data.simuparam&&updateSimuParamContainer(data.simuparam);

	// ~ deepCopy(_simuPARAM,data.simuparam);

	// 元件符号记录列表
	 _pssEle=data.component;
	 for(var key in _pssEle){
	 mxUtils.createProxy(_pssEle[key]);
	 }
	 _pssEleCount=data.elecount;

	// 控制元件记录
	 _pssCtrl=data.ctrl;
	 _pssCtrlCount=data.ctrlcount;

	// 量测元件的记录
	_pssMsr = data.msr;
	_pssMsrCount = data.msrcount;

	// 模块的记录
	_pssMod = data.module;
	_pssModCount = data.modcount;
	
	_pssDspgrp = data.dspgrp

    
    _timeLien=data.timeline?data.timeline:{};
    _simuUnique=data.simuunique?data.simuunique:{};
    
    for(var i=0;i<appRoots.length;i++){
        for (var key in _timeLien['layersParam']) {
            if(appRoots[i].name== _timeLien['layersParam'][key]['Application Name']){
                _layersParam[i]= _timeLien['layersParam'][key];
                break;
            }
        }
    }

    // 非电气用数据
    _simuProp['name'] = data.name;
    //~ _simuProp['folder'] = data.folder; //临时注释掉
    _simuProp['simuno'] = data.simuno;
    _simuProp['desc'] = data.desc;
    _simuProp['share'] = data.share;
    _simuProp['owned'] = data.owned;
    
    if (_simuPARAM.mod_param!=undefined){
        _mod_param = _simuPARAM.mod_param ;
    }    
    
    //重要
    _editorUI.loadAppFile(data['diagram']);
     
     //10.20子系统
    if(data.system!=undefined){
        _pssSystem=data.system;
        _pssSystemCount=data.systemcount;
        for(var tKey in _pssSystem){
           var tsysCell=_graph.model.getCell(_pssSystem[tKey]['id'])
           if(tsysCell&&tsysCell.isLock){
                var overlays = _graph.getCellOverlays(tKey);

                if(overlays==null){
                    if(tsysCell.editorName==editorName){
                        var overlay = new mxCellOverlay(
                                new mxImage('images/unlocked.png', 16, 16),
                                'Lock');
                        _graph.addCellOverlay(tsysCell, overlay);   
                    }else{
                        var overlay = new mxCellOverlay(
                                new mxImage('images/locked.png', 16, 16),
                                'Lock');
                        _graph.addCellOverlay(tsysCell, overlay);  
                    }
                    
                }
                
           }
        }
    }
    
    
    // var model = new mxGraphModel();
    // var codec = new mxCodec(doc);
    // codec.decode(doc.documentElement, _graph.getModel());
    _graph.center();
    
    updateSimuinfoContainer();
    
}


//added by wugh
//
function insertNewMenu(menuname){
	
	 $.ajax({
		type : 'POST',
		url : 'createMenu',
		data:{proid: simuId, menuname: menuname},
		dataType : 'json',
		async : false,
        success: function(data, textStatus) {
        	if (textStatus=="success") {	        		

            	_editorUI.insertAppFile(data["diagram"]);
                   
                   return false;	                   
               } else {

                   alert("create menu error!");
                   
                   return false;
               }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("请求失败，无法获取分组数据");
		}
     }); 
	
}

function renameMenu(menuname){
	
	var menuid = _editorUI.currentApp.id;
	
	$.ajax({
		type : 'POST',
		url : 'renameMenu',
		data:{menuid: menuid, menuname: menuname},
		dataType : 'json',
		async : false,
		success: function(data, textStatus) {
			if (textStatus=="success") {	        		
				
				_editorUI.renameAppFile(menuid, menuname);
				
				return false;	                   
			} else {
				
				alert("rename menu error!");
				
				return false;
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("请求失败，无法获取分组数据");
		}
	}); 
	
}


function deleteMenu(menuid){
	
	$.ajax({
		type : 'POST',
		url : 'deleteMenu',
		data:{menuid: menuid},
		dataType : 'json',
		async : false,
		success: function(data, textStatus) {
			if (textStatus=="success") {	        		
				
				_editorUI.deleteAppFile(menuid);
				
				return false;	                   
			} else {
				
				alert("delete menu error!");
				
				return false;
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("请求失败，无法获取分组数据");
		}
	}); 
	
}

function updateSimuinfoContainer(){
    var html = mxResources.get('CurrentSimu')+':  '+_simuProp['name'];
    $('#SimuInfotext').html(html);
}

function updateSimuParamContainer(data){
	/*
    $('#simu_start').val(data.start);
    $('#simu_end').val(data.end);
    $('#simu_step').val(data.step);
    $('#simu_switch').val(data.switch);
    */
}

function updataXMl(data){
    var doc = mxUtils.parseXml(data);
    var model = new mxGraphModel();
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, _graph.getModel());
    _graph.center();
}



function loadModule(simuid,editorUi){
    $.get(
        '/editor/loadModule/?id='+simuid,
        function(re,s,jxhr){
            if( 0 == re.status ){
                setModVar(re);
            }else{
                alert(re.msg);
            }
        },'json'
    );
}

function setModVar(data){

    // var doc = mxUtils.parseXml(data['shape']);
    // var model = new mxGraphModel();
    // var codec = new mxCodec(doc);
    // codec.decode(doc.documentElement, _graph.getModel());
    // _graph.center();
    _MOD_DSP = data.dspshape;
     _pssEle=data.eleparam;
     _pssEleCount=data.elecount;
     _pssCtrl=data.ctrlparam;
     _pssCtrlCount=data.ctrlcount;
     _pssMsrCount=data.msrcount;
     _pssModChildName = data.childname;
     _pssModCount = data.modcount;
     _modParam['desc']=data['desc'];
      _modParam['icon']=data['icon'];
      _modParam['name']=data['name'];
      _modParam['sym']=data['sym'];
    if (data.mod_param!=undefined){
        _mod_param = data.mod_param;
    }
    _IO = data.io;

     _editorUI.loadAppFile(data['shape']);
     _graph.center();
    initParamWnd();
    updateModulefoContainer(data.name);
}

function updateModulefoContainer(Name){
    var html = mxResources.get('CurrentModule')+':  '+Name;
    $('#SimuInfotext').html(html);
}

