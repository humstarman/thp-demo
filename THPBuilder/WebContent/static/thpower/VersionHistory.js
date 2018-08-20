VersionHistory = function(editorUi)
{
    this.editorUi = editorUi;

};
VersionHistory.prototype.init = function ()
{
    var ui = this.editorUi;
    var graph = ui.editor.graph;


}
VersionHistory.prototype.save = function (){
    var ui = this.editorUi;
    var graph = ui.editor.graph;

    if (simuId == 0){
        // alert('请先保存算例后使用此功能！');
        return;
    }
        // window.open(ui.getUrl());
        //console.log('quicksave');
    var savediv = $('<div style = "display:none"></div>');
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
    var remark;
    if ($('#historyremark').val()==''){
        //remark = _simuProp['desc'];
        remark = 'autosave';
    }else {
        remark = $('#historyremark').val();
    }
    var html =  '\
        <div class="simu-param">\
        <form method="post" action="/editor/savesimuVH/" id="form_simusave" >\
        <input type="hidden" name="saveas" value="1" id="saveas" />\
        <input type="hidden" name="id" value="' + simuId + '" id="simuid" />\
        <input type="hidden" name="task_id" value="' + _task_id + '" id="simuid" />\
        <input type="hidden" name="main_id" value="' + simuId + '" id="simuid" />\
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
        <div style="float:left;width:27%;">'+mxResources.get('SimuName')+'</div><div style="float:left;width:70%;"><input style="padding: 0px 0px 0px 9px;margin: 0px 0px 0px 11px;"class="param-inpt" value="' + _simuProp['name'] + '" name="name" /></div><br>\
        <div style="display:none">'+mxResources.get('SimuFolder')+'</div><div style="display:none"><select id="folderselect" class="folder" name="folder" >' + _folder + '</select>\</div><br>\
        <div style="float:left;width:27%;">'+mxResources.get('SimuNo')+'</div><div style="float:left;width:70%;"><input style="padding: 0px 0px 0px 9px;margin: 0px 0px 0px 11px;"class="param-inpt" value="' + _simuProp['folder'] + '" name="simuno"/></div><br>\
        <div style="float:left;width:27%;">'+mxResources.get('SimuDesc')+'</div><div style="float:left;width:70%;"><textarea style="padding: 0px 0px 0px 9px;margin: 15px 0px 0px 11px;height:80px"name="desc" class="param-inpt" >' + remark + '</textarea></div><br>\
        <div style="float:left;width:27%;">'+mxResources.get('IsPublic')+'</div><div style="float:left;width:70%;margin: 0px 0px 0px 11px;">'+ch+'</div><br>\
        <div style="float:left;width:27%;"><br><span class="btn btnsave" onclick="saveSimu(event)" >'+mxResources.get('SaveSimu')+'</span> <span class="btn btncancel" onclick="discardSimu(event)">'+mxResources.get('Cancel')+'</span><br></div>\
        </form>\
        </div>';
    savediv.html(html);
    $('body').append(savediv);
    event.preventDefault();
    var vts = _graph.getChildVertices();
    for (var i = 0, l = vts.length; i < l; i++) {
        if ('io' == vts[i].thutype) {
            alert('请删除图中的端口，再保存算例');
            return false;
        }
    }
        // 如果是载入的仿真，则修改一下id
        //~ if( simuId > 0){
        //~ $('#simuid').val( simuId );
        //~ }
        /*** 准备数据 ***/
/*    var encoder = new mxCodec();
    var node = encoder.encode(_graph.getModel());
    var xml = mxUtils.getXml(node);*/
    var xml = _editorUI.saveAppFile();
    _timeLien['layersParam'] = _layersParam;
    $('#csrf').val($('input[name="csrfmiddlewaretoken"]').val());
    //~ $('#psimubo').val( );
    $('#pdia').val(xml);
    $('#pcomp').val(JSON.stringify(_pssEle));
    $('#pelecount').val(JSON.stringify(_pssEleCount));

    $('#pctrl').val(JSON.stringify(_pssCtrl));
    $('#pctrlcount').val(JSON.stringify(_pssCtrlCount));

    $('#pmsr').val(JSON.stringify(_pssMsr));
    $('#pmsrcount').val(JSON.stringify(_pssMsrCount));

    $('#pmod').val(JSON.stringify(_pssMod));
    $('#pmodname').val(JSON.stringify(modnames));
    $('#pmodcount').val(JSON.stringify(_pssModCount));
    //psimuparam
    _simuPARAM['mod_param'] = _mod_param;
    $('#psimuparam').val(JSON.stringify(_simuPARAM));
    $('#pmeters').val(JSON.stringify(_pssMeters));
    $('#pdspgrp').val(JSON.stringify(_pssDspgrp));
        //10.20
    $('#psystem').val(JSON.stringify(_pssSystem));
    $('#psystemname').val(JSON.stringify(systemNames));
    $('#psystemcount').val(JSON.stringify(_pssSystemCount));
    $('#ptimeline').val(JSON.stringify(_timeLien));
    _simuUnique._pssDspgrp = _pssDspgrp_sum;
    _simuUnique._pssDspgrpName = _pssDspgrp_sum_Name;
    $('#psimuunique').val(JSON.stringify(_simuUnique));
    var option = {
        success: function(re) {
            if (0 != re.status) {
            setSysInfo(re['msg'], re['msgtype']);
            toastr['warning'](re.msg);
            //alert(re.msg);
            savediv.remove();
            return;
            }
            //alert('保存成功');
            toastr['success'](mxResources.get('SaveSuccess'));
            $('#simuid').val(re.id);
            savediv.remove();
        },
        error: function() {
            alert('暂时未能保存，请稍后再试');
            savediv.remove();
            //_wndSave.hide();
        },
        dataType: 'json'
    }
    $('#form_simusave').ajaxSubmit(option);
    _graph.setEnabled(true);
}
VersionHistory.prototype.dialog = function(argument){
    var html = '<div class="dock_view dock_view_history" style="right: 45px;display: block;">\
            <div class="dock_view_header">'+mxResources.get('historyVersion')+'<div class="ico ico_dock_collapse"></div></div>\
            <div class="dock_content" style="padding: 0px;">\
                <div class="history_bar"><div class="area_history">\
                        <div id="btn_history_add" class="toolbar_button active" style="padding: 0px 10px 0px 3px"><div class="ico ico_plus" style="float: left;"></div>创建历史版本</div>\
                        <div id="btn_history_restore" class="toolbar_button active disabled" original-title="恢复到此版本"><div class="ico ico_restore"></div></div>\
                    </div>\
                    <div id="area_history_add" class="area_history">\
                        <textarea id="history_remark" class="input_text" placeholder="填写注释..." style="width: 188px; height: 36px; margin-bottom: 5px;"></textarea>\
                        <div class="toolbar_button active" style="width: 70px;display: inline-block;" onclick="Dock.addHistory()">确定</div>\
                        <div class="toolbar_button active" style="width: 70px;display: inline-block;" onclick="Dock.toggleAddHistory()">取消</div>\
                    </div>\
                </div>\
                <div class="dock_devider"></div>\
        <div id="history_container" style="min-height: 120px;">\
        <ul id="history_versions" style="height: auto;">\
            <li vid="587ed5cce4b087b116079f2c" def="587ed5cce4b087b116079f2b" ind="0">\
                <div class="version_time">2017-01-18 10:41<span class="ico dlg_close dock_history_remove"></span>\
                </div>\
                <div class="version_name">Nearlyone</div>\
                <div class="history_remark"></div>\
            </li>\
        </ul>\
    </div></div>\
    </div>';
    if($('#vh_window').attr('id')!=undefined){
        return
    }
    var this_ = this;
    var contentdiv = document.createElement('div');
    var createVH = document.createElement('div');
    createVH.setAttribute('id', 'btn_history_add');
    createVH.style.padding = '9px 0px 9px 14px';
    createVH.style.cursor = 'pointer';
    createVH.innerHTML = '<div style="background:url(\'/static/template/img/item-create.png\') no-repeat top left ;float:left;width:20px;height:20px"></div>add';
    mxEvent.addListener(createVH, 'click', function(){
        $('#btn_history_add').hide();
        $('#area_history').show();
    });

    //devider
/*    height: 0px;
    border-width: 1px 0px;
    border-style: solid;
    border-top-color: #c4c4c4;
    border-bottom-color: #fff;
    margin-top: 10px;
    clear: both;*/
    var devider = document.createElement('div');
    devider.style.height = '0px';
    devider.style.clear = 'both';
    devider.style['border-width'] = '1px 0px';
    devider.style['border-style'] = 'solid';
    devider.style['border-top-color'] = '#c4c4c4';
    devider.style['border-bottom-color'] = '#fff';
    devider.style['margin-top'] ='10px';



    //
    var area_history = document.createElement('div');
    area_history.style.display = 'none';
    area_history.setAttribute('id', 'area_history');
    var historyremark = document.createElement('textarea');
    var br = document.createElement('br');
    historyremark.style.width='90%';
    historyremark.style.margin = '0px 0px 0px 11px';
    historyremark.setAttribute('id', 'historyremark');
    historyremark.setAttribute('placeholder', '填写注释...');
    var comfirmbtn = mxUtils.button('comfirm', mxUtils.bind(this, function(evt) {
            var setsync = $.ajaxSettings.async;
            if (setsync){$.ajaxSettings.async = false;}
            var temps = _task_id;
            _task_id = -1;
            this.save();
            _task_id = temps;
            $('#historyremark').val('');
            $('#area_history').hide();
            $('#btn_history_add').show();
            $('#list_history').html('');
            this_.getcurrentVH();
            $.ajaxSettings.async = setsync;
    }));
    comfirmbtn.style.padding = '6px 12px 6px 12px';
    comfirmbtn.style.margin = '6px 24px 6px 24px';
    var cancelbtn = mxUtils.button('cancel', mxUtils.bind(this, function(evt) {
        $('#historyremark').val('');
        $('#area_history').hide();
        $('#btn_history_add').show();
        //console.log('cancel');
    }));
    cancelbtn.style.padding = '6px 12px 6px 12px';
    cancelbtn.style.margin = '6px 24px 6px 24px';
    area_history.appendChild(historyremark);
    area_history.appendChild(br);
    area_history.appendChild(comfirmbtn);
    area_history.appendChild(cancelbtn);


    var list_history = document.createElement('div');
    list_history.setAttribute('id', 'list_history');
    contentdiv.appendChild(createVH);
    contentdiv.appendChild(area_history);
    contentdiv.appendChild(devider);
    contentdiv.appendChild(list_history);
    contentdiv.id = 'vh_window';




    var _wndVH= new mxWindow('', contentdiv, 250, 100, 250, 590, false, true);
    _wndVH.setLocation = function(x, y)
    {
        x = Math.max(0, x);
        y = Math.max(0, y);
        mxWindow.prototype.setLocation.apply(this, arguments);
    };
    _wndVH.setTitle(mxResources.get('historyVersion'));
    _wndVH.setClosable(true);
    _wndVH.show();
    this.getcurrentVH();
    //$('body').append(html);
};
VersionHistory.prototype.getcurrentVH = function(){
    var devider = document.createElement('div');
    devider.style.height = '0px';
    devider.style.clear = 'both';
    devider.style['border-width'] = '1px 0px';
    devider.style['border-style'] = 'solid';
    devider.style['border-top-color'] = '#c4c4c4';
    devider.style['border-bottom-color'] = '#fff';
    var list_history_ = document.getElementById('list_history');
    var this_ = this;
    $.get('/editor/getSimuVHC/?main_id='+simuId,
        function(re,s,jxhr){
            if( 0 == re[0].status ){
                for (var x = 0 ; x < re.length ;x++){
                    function addlist(){
                        var list = document.createElement('div');
                        var time_ = re[x].time.split('.')[0];
                        var div01 = document.createElement('div');
                        div01.style['margin-left'] = '20px';
                        var p = document.createElement('p');
                        p.innerHTML = time_;
                        p.style['margin-bottom'] = '0.5rem';
                        div01.appendChild(p);
                        var div02 = document.createElement('div');
                        div02.setAttribute('class', 'close_icon icon');
                        var div03 = document.createElement('div');
                        div03.style.color = 'grey';
                        div03.style['margin-left'] = '20px';
                        div03.style['margin-bottom'] = '0.5rem';
                        div03.innerHTML = re[x].name;
                        var div04 = document.createElement('div');
                        div04.style['margin-left'] = '20px';
                        div04.innerHTML = re[x].desc;
                        list.appendChild(div01);
                        list.appendChild(div02);
                        list.appendChild(div03);
                        list.appendChild(div04);
                        //createsimuresultdiv
                        //console.log(JSON.parse(re[x].simuunique)._pssDspgrp);
                        var div05 = document.createElement('div');
                        var result_a = document.createElement('a');
                        if(re[x]['result_file']!=''&&JSON.parse(re[x].simuunique)._pssDspgrp.length!=0){
                            //mxUtils.write(div05,'仿真结果');
                            mxUtils.write(result_a,mxResources.get('result'));
                            div05.appendChild(result_a);
                            div05.style.marginTop = '5px';
                            div05.style.marginLeft = '20px';
                            div05.style.color = '#4285f4';
                            div05.style.textDecoration = 'underline';
                            result_a.result_file = re[x]['result_file'];
                            result_a._pssDspgrp = JSON.parse(re[x].simuunique)._pssDspgrp;
                            result_a._pssDspgrpName = JSON.parse(re[x].simuunique)._pssDspgrpName;
                            mxEvent.addListener(result_a, 'click', function(event){
                                //console.log(this.result_file);
                                //console.log(this._pssDspgrp);
                                _pssDspgrp_sum = this._pssDspgrp;
                                _pssDspgrp_sum_Name = this._pssDspgrpName;
                                var temp_moresimufile = _moreSimuFile;
                                _moreSimuFile= [123];
                                initChartWnd();
                                _task_id = Date.parse(new Date())/ 1000;
                                _pssTid = _task_id;
                                same_before_flag = this.result_file;
                                initWebSck4Sql();
                                _moreSimuFile = temp_moresimufile;
                            });
                            list.appendChild(div05);
                        }

                        /*list.innerHTML = '<div style="margin-left:20px"><p style="margin-bottom: 0.5rem;">'+time_+'</p></div><div class="close_icon icon"></div><div style="color:grey;margin-left:20px;margin-bottom: 0.5rem;">'+re[x].name+'</div><div style="margin-left:20px;">'+re[x].desc+'</div>';*/
                        list.setAttribute('class', 'list_history_item');
                        list.style.padding = '8px 0px 8px 0px';
                        list.setAttribute('time', x);
                        list.style.cursor = 'pointer';
                        mxEvent.addListener(list, 'click', function(event){
                            if(event.target != div02&&event.target != result_a){
                            var time = list.getAttribute('time');
                            this_.loadVH(time);
                            }

                        });
/*                        mxEvent.addListener(div01, 'click', function(event){
                            var time = list.getAttribute('time');
                            this_.loadVH(time);
                        });
                        mxEvent.addListener(div03, 'click', function(event){
                            var time = list.getAttribute('time');
                            this_.loadVH(time);
                        });
                        mxEvent.addListener(div04, 'click', function(event){
                            var time = list.getAttribute('time');
                            this_.loadVH(time);
                        });*/

                        $('#list_history')[0].appendChild(list);
                        $('#list_history')[0].appendChild(devider.cloneNode(true));
                    }
                    addlist();
                }
                $('.close_icon').click(function(){
                    var time = $(this).closest('.list_history_item')[0].getAttribute('time');
                    this_.delcurrentVH(time,$(this));
                    //$(this).closest('.list_history_item').remove();
                    //toastr["info"]('删除成功');
                });
                //console.log(re[0]);
                //console.log(re);
                //setSimuVar(re,editorUi);
            }else{
                console.log(re[0].status);
                console.log(re[0]);
            }
        },'json'
    );
}
VersionHistory.prototype.delcurrentVH = function (time,icon){
    $.get('/editor/removeSimuVH/?main_id='+simuId+'&time='+time,
        function(re,s,jxhr){
            if(re.success){
                icon.closest('.list_history_item').next().remove();
                icon.closest('.list_history_item').remove();
                $('.list_history_item').each(function(index){
                    this.setAttribute('time',index);
                });
                toastr["info"]('删除成功');
            }else {
                toastr['warning'](re.reason);
            }
        },'json'
        );
}
function setAutoSaveSimu(){
    if(_editor.modified){
        toastr["info"]('autosave');
        _editor.modified(false);
    }
}
VersionHistory.prototype.loadVH = function(time){
    $.get('/editor/loadSimuVH/?main_id='+simuId+'&time='+time,
        function(re,s,jxhr){
            if( 0 == re.status ){
                //console.log(re.status);
                //console.log(re);
                appRoots = [];
                setSimuVar(re,_editorUI);
            }else{
                console.log(re.status);
                //console.log(re);
            }
        },'json'
    );
}
