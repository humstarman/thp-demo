<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'index.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<style type="text/css">
      a{text-decoration: none;font-size:14px;color:000000;};
    </style>
    <script type="text/javascript">
      function opens(href){
         window.open(href, "auleftFrame");
      }
    </script>
  </head>
  
  <body style="border-right:blue; ">
    <a href="javascript:opens('examples/toolbar.jsp')">工具栏(toolbar)</a></br>
    <a href="javascript:opens('examples/contexticons.jsp')">拖动</a> </br>
    <a href="javascript:opens('examples/wrapping.jsp')">线中文字</a></br>
    <a href="javascript:opens('examples/wires.jsp')">连线</a></br>
    <a href="javascript:opens('examples/windows.jsp')">多窗口</a></br>
    <a href="javascript:opens('examples/validation.jsp')">验证(validation)</a></br>
    <a href="javascript:opens('examples/userobject.jsp')">用户对象(userobject)</a></br>
    <a href="javascript:opens('examples/tree.jsp')">树(tree)</a></br>
    <a href="javascript:opens('examples/thread.jsp')">线(thread)</a></br>
    <a href="javascript:opens('examples/stylesheet.jsp')">样式表(stylesheet)</a></br>
    <a href="javascript:opens('examples/standardsmode.jsp')">标准模板(standardsmode)</a></br>
    <a href="javascript:opens('examples/shape.jsp')">形状(shape)</a></br>
    <a href="javascript:opens('examples/secondlabel.jsp')">第二个标签(secondlabel)</a></br>
    <a href="javascript:opens('examples/scrollbars.jsp')">滚动条(scrollbars)</a></br>
    <a href="javascript:opens('examples/portrefs.jsp')">多边型(portrefs)</a></br>
    <a href="javascript:opens('examples/permissions.jsp')">权限(permissions)</a></br>
    <a href="javascript:opens('examples/perimeter.jsp')">周长(perimeter)</a></br>
    <a href="javascript:opens('examples/pagebreaks.jsp')">分页符(perimeter)</a></br>
    <a href="javascript:opens('examples/overlays.jsp')">覆盖(overlays)</a></br>
    <a href="javascript:opens('examples/orgchart.jsp')">组织结构图(orgchart)</a></br>
    <a href="javascript:opens('examples/offpage.jsp')">旋转流程图(offpage)</a></br>
    <a href="javascript:opens('examples/monitor.jsp')">显示器(monitor)</a></br>
    <a href="javascript:opens('examples/merge.jsp')">合并(merge)</a></br>
    <a href="javascript:opens('examples/menustyle.jsp')">菜单样式(menustyle)</a></br>
    <a href="javascript:opens('examples/markers.jsp')">标志物(markers)</a></br>
    <a href="javascript:opens('examples/layers.jsp')">层(layers)</a></br>
    <a href="javascript:opens('examples/labels.jsp')">标签(labels)</a></br>
    <a href="javascript:opens('examples/labelposition.jsp')">标签位置(labelposition)</a></br>
    <a href="javascript:opens('examples/indicators.jsp')">指标(indicators)</a></br>
    <a href="javascript:opens('examples/hovericons.jsp')">悬停图标(hovericons)</a></br>
    <a href="javascript:opens('examples/hierarchicallayout.jsp')">分层布局(hierarchicallayout)</a></br>
    <a href="javascript:opens('examples/helloport.jsp')">你好端口(helloport)</a></br>
    <a href="javascript:opens('examples/guides.jsp')">导游(guides)</a></br>
    <a href="javascript:opens('examples/groups.jsp')">群体(groups)</a></br>
    <a href="javascript:opens('examples/grid.jsp')">放大/缩小(grid)</a></br>
    <a href="javascript:opens('examples/graphlayout.jsp')">图形布局(graphlayout)</a></br>
    <a href="javascript:opens('examples/fixedpoints.jsp')">固定点(fixedpoints)</a></br>
    <a href="javascript:opens('examples/fixedicon.jsp')">固定图标(fixedicon)</a></br>
    <a href="javascript:opens('examples/events.jsp')">事件(events)</a></br>
    <a href="javascript:opens('examples/editing.jsp')">编辑(editing)</a></br>
    <a href="javascript:opens('examples/edgetolerance.jsp')">边缘宽容(edgetolerance)</a></br>
    <a href="javascript:opens('examples/dynamictoolbar.jsp')">动态工具条(dynamictoolbar)</a></br>
    <a href="javascript:opens('examples/dynamicstyle.jsp')">动感风格(dynamicstyle)</a></br>
    <a href="javascript:opens('examples/dynamicloading.jsp')">动态加载(dynamicloading)</a></br>
    <a href="javascript:opens('examples/dragsource.jsp')">拖动源(dragsource)</a></br>
    <a href="javascript:opens('examples/control.jsp')">删除节点(control)</a></br>
    <a href="javascript:opens('examples/contexticons.jsp')">节点事件(contexticons)</a></br>
    <a href="javascript:opens('examples/contexticons.jsp')">节点事件(contexticons)</a></br>
    <a href="javascript:opens('examples/fileio.html')">文件io(fileio)</a></br>
  </body>
</html>
