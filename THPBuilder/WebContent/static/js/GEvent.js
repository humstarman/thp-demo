(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GEvent = factory();
    }
}(this, function () {
    /**@desc
     * 全局类（事件）
     * @class
     */
    GEvent = {
        viewDiv: null,
        viewHeight: 300,
        viewWidth: 300
    };
    GEvent.initView = function (x, y) {
        var GEvent=this;
        if (!this.viewDiv) {
            this.viewDiv = document.createElement('div');
            this.viewDiv.style.position = "absolute";
            // this.viewDiv.style.background = "#ddd";
            this.viewDiv.style.background = "#ffffff";
            this.viewDiv.style.border = "1px solid #c0c0c0";
            document.body.appendChild(this.viewDiv);
        }else{
            this.viewDiv.style.display = "block";
        }
        this.viewDiv.style.height = this.viewHeight + 'px';
        this.viewDiv.style.width = this.viewWidth + 'px';
        this.viewDiv.style.left = x + "px";
        this.viewDiv.style.top = y + "px";
        this.viewDiv.innerHTML='';
        var rem = document.createElement('img');
        rem.setAttribute('src', IMAGE_PATH + '/delete2.png');
        rem.setAttribute('border', '0');
        rem.setAttribute('align', 'top');
        rem.style.marginTop = '4px';
        rem.style.marginRight = '6px';
        rem.style.cursor = 'pointer';
        rem.style.float = 'right';
        this.viewDiv.appendChild(rem);
        mxEvent.addListener(rem, 'click', function (evt) {
            GEvent.closeView();
            mxEvent.consume(evt);
        });
    };
    GEvent.closeView = function () {
        if (this.viewDiv) {
            this.viewDiv.style.display = "none";
        }
    };
    GEvent.resetSize = function () {
        this.viewDiv.style.height = this.viewHeight + 'px';
        this.viewDiv.style.width = this.viewWidth + 'px';
    };
    GEvent.Scada_Display_Content = function (cell, x, y) {
        this.viewWidth=600;
        this.viewHeight=250;
        this.initView(x,y);
        //绘制页面内容--详细详细

        var tablename="SCADA_Analog";
        var pointid=cell.value.measId+"";
        CreateTable.create_Table(tablename,this.viewDiv);
        CreateTable.get_tablemodel(tablename,pointid,this.viewDiv) ;

        // var div2 = document.createElement("br");
        //  // div2.innerText = "111111";
        //  this.viewDiv.appendChild(div2);



    };
    GEvent.Scada_Display_Trend = function (cell, x, y) {
        this.viewWidth=700;
        this.viewHeight=500;
        this.initView(x,y);

        var measId=cell.value.measId;
        var measName=cell.value.measName;
        var measTable=cell.value.measTable;

        var points=[];
        var item={};
        item.id=measId+"";
        item.name=measName;
        item.type=measTable;
        points.push(item);
        //绘制页面内容--历史曲线
        Viewchart.createChart(points,this.viewDiv);
    };
    GEvent.Scada_Redirect_TrendPage = function (cell) {
        //一些操作后跳转
        // window.location.href='某个历史曲线页面';
        window.location.href='viewchart.html';
        var item={};
        item.id=cell.value.measId+"";
        item.name=cell.value.measName;
        item.type=cell.value.measTable;
        localStorage.setItem('obj_point', JSON.stringify(item));
    };
    return GEvent;
}));