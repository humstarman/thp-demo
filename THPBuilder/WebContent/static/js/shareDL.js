
var OpenShareResultDL = function(editorUi, type) {
	
    var container = document.createElement('div');
    var ckedirotDiv = document.createElement('div');
    var titleDiv = document.createElement('div');
    var titleSpan = document.createElement('span');
    mxUtils.write(titleSpan, mxResources.get('inputtitle')+ ':');
    titleDiv.appendChild(titleSpan);
    var titleInput = document.createElement('input');
    titleInput.value = _simuProp.name ? _simuProp.name + mxResources.get('document') :  mxResources.get('untitledDocument');
    titleInput.className = 'sharetitle'
    titleDiv.appendChild(titleInput);

    container.appendChild(titleDiv);
    ckedirotDiv.id = 'ckeditor';
    for (var key in imgUrl) {
        var titleP = document.createElement('p');
        var title = document.createElement('span');
        title.style['font-size'] = '20px';

        function addImg(imgData) {
            for (var i = 0; i < imgData.length; i++) {
                var simuImg = document.createElement('img');
                simuImg.src = imgData[i];
                simuImg.setAttribute('type', 'ckeditorimg');
                simuImg.onload = function() {
                    if (this.width > 600) {
                        this.width = 600;
                    }
                };
                if (simuImg.width > window.innerWidth * 0.8) {
                    simuImg.width = window.innerWidth * 0.8;
                }
                ckedirotDiv.appendChild(simuImg);
            }
        }
        titleP.appendChild(title);
        ckedirotDiv.appendChild(titleP);
        if (key == 'simu') {
            mxUtils.write(title, mxResources.get('topoShow') +':');
            for (var ikey in imgUrl[key]) {
                if (appRoots.length > 1) {


                    var tAppP = document.createElement('p');
                    var tApp = document.createElement('span');
                    tApp.style['font-size'] = '15px';
                    if (ikey == 'TimeLine') {
                        mxUtils.write(tApp, mxResources.get('timingrelationship')+':');
                    } else {
                        mxUtils.write(tApp, mxResources.get('apply') + ikey + ':');
                    }

                    tAppP.appendChild(tApp);
                    ckedirotDiv.appendChild(tAppP);
                }
                addImg(imgUrl[key][ikey]);
            }
        } else {
            if(imgUrl[key].length>0){
                 mxUtils.write(title, mxResources.get('resultShow')+':');
                addImg(imgUrl[key]);
            }
           
            // tite.html='结果如下所示:';
        }
    }
    // var simuLocaDiv=document.createElement('span');
    if (simuId){
        var simulocap = document.createElement('p');
        var simuloca=document.createElement('a');
        simuloca.style.color='#e74c3c';
        mxUtils.write(simuloca,  mxResources.get('clickBackSimu'));
        // var simulocaLink=document.createElement('a');
        simuloca.href=window.location.pathname+window.location.search;
        // mxUtils.write(simulocaLink, window.location.href);
        simulocap.appendChild(simuloca);
        ckedirotDiv.appendChild(simulocap);
    }
    

    container.appendChild(ckedirotDiv);
    var sharebtnDiv = document.createElement('div');
    var that = this;
    var btn = mxUtils.button(mxResources.get('publishdoc'), function() {
        spinner.spin(container);
        var ndata = that.cke.getData();
        var titleText = $('.sharetitle').val();
        var img = null;
        if($(that.cke.getData()).find('img')){
            img = $(that.cke.getData()).find('img').eq(0).attr('src');
        }
        //         var compressed = LZString.compressToUint8Array(ndata);
        //  var compressed = LZString.compress(ndata);
        $.post(
            '/editor/setShareData/', {
                "csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val(),
                "data": ndata,
                "title": titleText,
                "img":img
            },
            function(re) {
                window.open(re.url + '\\' + re.key);
                spinner.stop();
            }, 'json'

        );
    });
    titleDiv.appendChild(btn);
    btn.style.float = 'right';
    btn.className = 'btn btnclose';
    btn.style['margin-top'] = ' 5px';
    this.init = mxUtils.bind(this, function() {
        this.cke = CKEDITOR.replace('ckeditor', {
            height: window.innerHeight * 0.7,
            width: 900,
        });
    })

    //     container.appendChild(sharebtnDiv);
    this.container = container;
}

function loadJs(file) {
    var head = $("head").remove("script[role='reload']");
    $("<scri" + "pt>" + "</scr" + "ipt>").attr({ role: 'reload', src: file, type: 'text/javascript' }).appendTo(head);
}

function createShareDl() {
    if (_running == true) {
        alert(mxResources.get('stopsimufirst'));
        return;
    }
    imgUrl = { 'simu': {}, 'result': [] };
    spinner.spin(document.body);
    var layerLength = down();
    var resultLength = cteateChart();
    var runStatus = setInterval(function() {
        var imgLength = 0;
        for (var key in imgUrl['simu']) {
            imgLength += imgUrl['simu'][key].length;
        }
        if (imgLength == layerLength ) {

            clearInterval(runStatus);
            var opendlg = new OpenShareResultDL(_editorUI, 1);
            _editorUI.showDialog(opendlg.container, 900, window.innerHeight * 0.85, true, true);
            opendlg.init();
            spinner.stop();

        }
    }, 500);
}


EditorUi.prototype.exportToCanvas = function(callback, width, imageCache, background, error, limitHeight,
    ignoreSelection, scale, transparentBackground, addShadow, converter, graph, border, noCrop) {
    limitHeight = (limitHeight != null) ? limitHeight : true;
    ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
    graph = (graph != null) ? graph : this.editor.graph;
    border = (border != null) ? border : 0;

    var bg = (transparentBackground) ? null : graph.background;

    if (bg == mxConstants.NONE) {
        bg = null;
    }

    if (bg == null) {
        bg = background;
    }

    // Handles special case where background is null but transparent is false
    if (bg == null && transparentBackground == false) {
        bg = '#ffffff';
    }

    this.convertImages(graph.getSvg(bg, null, null, noCrop, null, ignoreSelection), mxUtils.bind(this, function(svgRoot) {
        var img = new Image();

        img.onload = mxUtils.bind(this, function() {
            var canvas = document.createElement('canvas');
            var w = parseInt(svgRoot.getAttribute('width'));
            var h = parseInt(svgRoot.getAttribute('height'));
            scale = (scale != null) ? scale : 1;

            if (width != null) {
                scale = (!limitHeight) ? width / w : Math.min(1, Math.min((width * 3) / (h * 4), width / w));
            }

            w = Math.ceil(scale * w) + 2 * border;
            h = Math.ceil(scale * h) + 2 * border;

            canvas.setAttribute('width', w);
            canvas.setAttribute('height', h);
            var ctx = canvas.getContext('2d');

            if (bg != null) {
                ctx.beginPath();
                ctx.rect(0, 0, w, h);
                ctx.fillStyle = bg;
                ctx.fill();
            }

            ctx.scale(scale, scale);
            ctx.drawImage(img, border / scale, border / scale);
            callback(canvas);
        });

        img.onerror = function(e) {

            if (error != null) {
                error(e);
            }
        };

        try {
            if (addShadow) {
                this.editor.addSvgShadow(svgRoot);
            }

            this.convertMath(graph, svgRoot, true, mxUtils.bind(this, function() {
                img.src = this.createSvgDataUri(mxUtils.getXml(svgRoot));
            }));
        } catch (e) {

            if (error != null) {
                error(e);
            }
        }
    }), imageCache, converter);
};
EditorUi.prototype.convertImages = function(svgRoot, callback, imageCache, converter) {
    // Converts images to data URLs for immediate painting
    if (converter == null) {
        converter = this.createImageUrlConverter();
    }

    // Barrier for asynchronous image loading
    var counter = 0;

    function inc() {
        counter++;
    };

    function dec() {
        counter--;

        if (counter == 0) {
            callback(svgRoot);
        }
    };

    var cache = imageCache || new Object();

    var convertImages = mxUtils.bind(this, function(tagName, srcAttr) {
        var images = svgRoot.getElementsByTagName(tagName);

        for (var i = 0; i < images.length; i++) {
            (mxUtils.bind(this, function(img) {
                //var src = converter.convert(img.getAttribute(srcAttr));
                var src = img.getAttribute(srcAttr);
                // Data URIs are pass-through
                if (src != null && src.substring(0, 5) != 'data:') {
                    var tmp = cache[src];

                    if (tmp == null) {
                        inc();

                        this.convertImageToDataUri(src, function(uri) {
                            if (uri != null) {
                                cache[src] = uri;
                                img.setAttribute(srcAttr, uri);
                            }

                            dec();
                        });
                    } else {
                        img.setAttribute(srcAttr, tmp);
                    }
                }
            }))(images[i]);
        }
    });

    // Converts all known image tags in output
    // LATER: Add support for images in CSS
    convertImages('image', 'xlink:href');
    convertImages('img', 'src');

    // All from cache or no images
    if (counter == 0) {
        callback(svgRoot);
    }
};
EditorUi.prototype.createImageUrlConverter = function() {
    var converter = new mxUrlConverter();
    converter.updateBaseUrl();

    // Extends convert to avoid CORS using an image proxy server
    // LATER: Use img.crossOrigin="anonymous" to avoid proxy
    var convert = converter.convert;

    converter.convert = function(src) {
        if (src != null) {
            if ((src.substring(0, 7) == 'http://' || src.substring(0, 8) == 'https://') &&
                src.substring(0, converter.baseUrl.length) != converter.baseUrl) {
                src = PROXY_URL + '?url=' + encodeURIComponent(src);
            } else if (src.substring(0, 19) != 'chrome-extension://') {
                src = convert.apply(this, arguments);
            }
        }

        return src;
    };

    return converter;
};


EditorUi.prototype.convertImageToDataUri = function(url, callback) {
    if (/(\.svg)$/i.test(url)) {
        mxUtils.get(url, mxUtils.bind(this, function(req) {
                callback(this.createSvgDataUri(req.getText()));
            }),
            function() {
                callback();
            });
    } else {
        var img = new Image();

        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            callback(canvas.toDataURL());


        };

        img.onerror = function() {
            callback();
        };

        img.src = url;
    }
};

EditorUi.prototype.createSvgDataUri = function(svg) {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
};

EditorUi.prototype.convertMath = function(graph, svgRoot, fixPosition, callback) {
    // FIXME: Only horizontal dash in output so better no conversion at all
    if (false && graph.mathEnabled && typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined') {
        // Workaround for lost gradients in Chrome after remove from DOM
        var elts = svgRoot.getElementsByTagName('*');

        for (var i = 0; i < elts.length; i++) {
            if (elts[i].getAttribute('id') != null) {
                elts[i].setAttribute('id', 'mxTemporaryPrefix-' + elts[i].getAttribute('id'));
            }
        }

        // Temporarily attaches to DOM for rendering
        svgRoot.style.visibility = 'hidden';
        document.body.appendChild(svgRoot);
        Editor.MathJaxRender(svgRoot);

        MathJax.Hub.Queue(mxUtils.bind(this, function() {
            // Removes from DOM
            svgRoot.parentNode.removeChild(svgRoot);
            svgRoot.style.visibility = '';

            // Restores original IDs
            for (var i = 0; i < elts.length; i++) {
                if (elts[i].getAttribute('id') != null) {
                    elts[i].setAttribute('id', elts[i].getAttribute('id').substring('mxTemporaryPrefix-'.length));
                }
            }

            // Keeping scale but moving translate only works for image export which
            // is fine since we do not want the SVG export to contain a workaround.
            // See https://github.com/mathjax/MathJax/issues/279
            if (fixPosition && navigator.userAgent.indexOf('AppleWebKit/') >= 0) {
                var fo = svgRoot.getElementsByTagName('foreignObject');

                for (var i = 0; i < fo.length; i++) {
                    var tr = fo[i].parentNode.parentNode.getAttribute('transform');
                    var translate = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(tr);

                    fo[i].setAttribute('x', Math.round(translate[1]));
                    fo[i].setAttribute('y', Math.round(translate[2]));

                    // Must use translate for crisp rendering
                    fo[i].parentNode.parentNode.setAttribute('transform', 'translate(0.5,0.5)' + tr.substring(tr.indexOf(')') + 1));
                }
            }

            callback();
        }));
    } else {
        callback();
    }
};
var imgUrl = { 'simu': [], 'result': [] };
EditorUi.prototype.saveData = function(filename, format, data, mime, base64Encoded) {
    imgUrl['simu'].push(URL.createObjectURL((base64Encoded) ?
        this.base64ToBlob(data, mime) :
        new Blob([data], { type: mime })));
    return;
    var a = document.createElement('a');

    if (typeof a.download !== 'undefined' || this.isOffline()) {
        a.href = URL.createObjectURL((base64Encoded) ?
            this.base64ToBlob(data, mime) :
            new Blob([data], { type: mimeType }));

        if (typeof a.download !== 'undefined') {
            a.download = filename;
        } else {
            a.setAttribute('target', '_blank');
        }

        document.body.appendChild(a);

        try {
            a.click();

            window.setTimeout(function() {
                URL.revokeObjectURL(a.href);
            }, 0);
            a.parentNode.removeChild(a);
        } catch (e) {
            // ignore
        }
    }
};

function down() {
    graph = _graph;
    var applayerCount = 0;
    try {
        var currenId = _editorUI.currentAppID;
        for (var k = 0; k < appRoots.length; k++) {
            changeAppRoot(k);
            imgUrl['simu'][appRoots[k].name] = [];
            var layerCount = graph.model.getChildCount(graph.model.root);
            applayerCount += layerCount;
            var defCell = graph.getDefaultParent();
            graph.model.setVisible(defCell, false);
            var oldChild = null;
            for (var i = 0; i < layerCount; i++) {
                var tempchild = graph.model.getChildAt(graph.model.root, i);
                graph.model.setVisible(tempchild, true);
                oldChild = tempchild;
                _editorUI.exportImage(null, null, null, null, null, null, null, null, null, appRoots[k].name);
                graph.model.setVisible(tempchild, false);
            }
            graph.model.setVisible(defCell, true);
        }
        changeAppRoot(currenId);
    } finally {}
    return applayerCount;
}

EditorUi.prototype.base64ToBlob = function(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);

        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }

        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, { type: contentType });
};

EditorUi.prototype.exportImage = function(scale, transparentBackground, ignoreSelection, addShadow, editable, border, noCrop, currentPage, format, appName) {
    format = (format != null) ? format : 'png';

    //if (this.spinner.spin(document.body, mxResources.get('exporting')))
    {
        var selectionEmpty = this.editor.graph.isSelectionEmpty();
        ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;

        // Caches images
        if (this.thumbImageCache == null) {
            this.thumbImageCache = new Object();
        }

        try {
            this.exportToCanvas(mxUtils.bind(this, function(canvas) {
                    //this.spinner.stop();

                    try {
                        this.saveCanvas(canvas, null, format, appName);
                    } catch (e) {
                        // Fallback to server-side image export
                        if (e.message == 'Invalid image') {
                            this.downloadFile(format);
                        } else {
                            this.handleError(e);
                        }
                    }
                }), null, this.thumbImageCache, null, mxUtils.bind(this, function(e) {
                    this.spinner.stop();
                    this.handleError(e);
                }), null, ignoreSelection, scale || 1, transparentBackground,
                addShadow, null, null, border, noCrop);
        } catch (e) {
            this.spinner.stop();
            this.handleError(e);
        }
    }
};


EditorUi.prototype.saveCanvas = function(canvas, xml, format, appName) {

    var ext = (format == 'jpeg') ? 'jpg' : format;
    var data = this.createImageDataUri(canvas, xml, format);

    imgUrl['simu'][appName].push(data);
    // this.saveData('filename', ext, data.substring(data.lastIndexOf(',') + 1), 'image/' + format, true);
};

EditorUi.prototype.createImageDataUri = function(canvas, xml, format) {
    var data = canvas.toDataURL('image/' + format);

    // Checks if output is invalid or empty
    if (data.length <= 6 || data == canvas.cloneNode(false).toDataURL('image/' + format)) {
        throw { message: 'Invalid image' };
    }

    if (xml != null) {
        data = this.writeGraphModelToPng(data, 'zTXt', 'mxGraphModel', atob(this.editor.graph.compress(xml)));
    }

    return data;
};


function cteateChart() {
    var tempcurrentChart = currentChart;
    for (var i = 0; i < Charts.length; i++) {

        showChart(i)
        var svgXml = mxUtils.getXml(Charts[i].container.firstChild);
        var t = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)));
        imgUrl.result.push(t);
    }
    if(Charts.length){
        showChart(tempcurrentChart)
    }
    $("#cal_tab tr:gt(0)").each(function(i) {
 	  var chart = 'chart' + $(this).children("td").eq(1).children('select').val();
      hchart = $('#' + chart).highcharts()
		var svgXml = mxUtils.getXml(hchart.container.firstChild);
        imgUrl.result.push( 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml))));
    });
    return Charts.length+((getTabsize()<0)?0:getTabsize());
}
