<!DOCTYPE html>
<html style="width:100%; height:100%">
<head>
<meta charset="UTF-8">
<title>Hello World! example For mxGraph</title>
<link href="css/div.css" rel="stylesheet" />

<!-- 设置basepath为开发库的路径  -->
<script type="text/javascript">
	mxBasePath='src';
</script>

<!-- 加载并初始化开发库 -->
<script type="text/javascript" src="src/js/mxClient.js"></script>

<!-- 示例代码  -->
<script type="text/javascript">
	 
	 //程序从这里开始
	 //创建dom节点中指定标记的简单图像
	 //方法在文档的onLoad事件处理中被调用
	 function main(container)
	 {
		 //检查浏览器支持
		 if(!mxClient.isBrowserSupported())
		 {
		 	mxUtils.error('Browser is not supported!', 200, false);
		 }
		 else
		{
			//在指定容器中创建图形
			var rootgraph = new mxGraph(container);				

			//激活橡皮圈选择
			new mxRubberband(rootgraph);

			//获得插入单元的默认父节点
			//通常是根节点的第一子节点（如0层）
			var parent = rootgraph.getDefaultParent();

			//加入单元到模型中
			rootgraph.getModel().beginUpdate();

			try {
				var v1 = rootgraph.insertVertex(parent, null, 'Hello', 200, 40, 80, 40);

				//var v2 = rootgraph.insertVertex(parent, null, 'World', 300, 80, 80, 40);
				var v2 = rootgraph.insertVertex(v1, null, 'World', 300, 80, 80, 40);

				//var e1 = rootgraph.insertEdge(parent, null, '', v1, v2);

			} finally {
				rootgraph.getModel().endUpdate();
			}

		}

	}	
</script>

</head>
<body onload="main(document.getElementById('graphEditor'))" style="width:100%; height:100%">
<div id="graphEditor" style="width:100%; height:100%;background: url('editors/images/grid.gif')">
</div>
</body>
</html>