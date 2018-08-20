
// 初始化信息面板
function initInfoPanel(){
  //~ var con = document.createElement('div');
  _wndInfoCon.innerHTML='<center class="info">欢迎使用THPower Scada Cloud</center>'
  _wndList.wInfo = new mxWindow('系统信息', _wndInfoCon, _WIN.width-320, _WIN.height-170,300,150, true, true);

  _wndList.wInfo.w=300;
  _wndList.wInfo.h=150;
  _wndList.wInfo.x= _WIN.width-320;
  _wndList.wInfo.y=_WIN.height-170;
  _wndList.wInfo.dir=0;

  _wndList.wInfo.setMinimizable(true);
  _wndList.wInfo.setResizable(true);
  _wndList.wInfo.setMaximizable(true);
  _wndList.wInfo.setVisible(true);
  _wndList.wInfo.setScrollable(true);

}// initInfoPanel end


// 设置系统信息
function setSysInfo(info,type){
  var time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
  var $container = $('#sysInfoContainer');
  switch(type){
    case "warning":
      $container.prepend('<span class="warning"  style="font-size: 15px;"><img class="info-icon" src="static/icons/warning.png" style="margin-top: 7px;width: 15px;padding-top: 2px;" /> '+time1+'</span><div class="info-content" style="padding-top: 3px;padding-bottom: 3px;font-size: 15px;">'+info+'</div>');
      break;
    case "error":
      $container.prepend('<span class="error" style="font-size: 15px;"  ><img class="info-icon" src="static/icons/error.png" style="margin-top: 7px;width: 15px;padding-top: 2px;" /> '+time1+'</span><div class="info-content" style="padding-top: 3px;padding-bottom: 3px;font-size: 15px;">'+info+'</div>');
      break;
    case "info":
      $container.prepend('<span class="info" style="font-size: 15px;"><img class="info-icon" src="static/icons/info.png" style="margin-top: 7px;width: 15px;padding-top: 2px;" /> '+time1+'</span><div class="info-content" style="padding-top: 3px;padding-bottom: 3px;font-size: 15px;">'+info+'</div>');
      break;
    default:
      $container.prepend('<span class="info" style="font-size: 15px;"><img class="info-icon" src="static/icons/info.png" style="margin-top: 7px;width: 15px;padding-top: 2px;" /> '+time1+'</span><div class="info-content" style="padding-top: 3px;padding-bottom: 3px;font-size: 15px;">'+info+'</div>');
      break;;
  }
}

function clearInfo(){
    $('#sysInfoContainer').html('');
}
