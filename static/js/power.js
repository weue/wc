(function () {
    function isMobile() {
        var mobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i) ? true : false;
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i) ? true : false;
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i) ? true : false;
            },
            any: function () {
                return (this.Android() || this.BlackBerry() || this.iOS() || this.Windows());
            }
        };
        return mobile.any();
    }

    function createVideo(swfPath, src, width, height) {
        return '<object type="application/x-shockwave-flash" name="powerPlayback" data="' +
            swfPath +
            '" width="' +
            width +
            '" height="' +
            height +
            '" id="powerPlayback" style="visibility: visible;">' +
            '<param name="allowFullScreen" value="true">' +
            '<param name="wmode" value="opaque">' +
            '<param name="flashvars" value="src=' +
            src +
            '&amp;autoPlay=false&amp;title=2013&amp;breakPoint=0&amp;preroll=&amp;prerollSite=&amp;bannerImageUrl=&amp;bannerUrl=&amp;scaleMode=letterBox&amp;controlBarAutoHide=false&amp;streamType=liveOrRecorded&amp;javascriptCallbackFunction=onJavaScriptBridgeCreated">' +
            '</object>';
    }

    function createWmvVideo(src, width, height) {
        return '<object classid="clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6" id="WindowsMediaPlayer" ' +
            'width="' +
            width +
            '" ' +
            'height="' +
            height +
            '">' +
            '<param name="URL" value="' +
            src +
            '">' +
            '</object>';
    }

    function createIeTooltip(width, height) {
        return '<div style="width:' +
            width +
            'px; height:' +
            height +
            'px; background-color:#000;">' +
            '<p style="width: ' +
            width +
            'px;height: ' +
            height +
            'px;line-height:' +
            height +
            'px; color:#fff; text-align:center;">请使用IE浏览器查看该视频</p></div>';
    }

    function isIe() {
        //判断是否是IE浏览器。
        return !!window.ActiveXObject || 'ActiveXObject' in window;
    }

    function isWmv(src) {
        //判断是否是 .wmv
        return src.toLocaleLowerCase().indexOf('.wmv') > 0;
    }

    function isSwf(src) {
        //判断是否是 .swf
        return src.indexOf('.swf') > 0;
    }

    $(function () {
        var videoSites = [
            'player.youku.com', 'i7.imgs.letv.com', 'static.youku.com', 'share.vrs.sohu.com', 'player.ku6.com',
            'player.pps.tv', 'static.video.qq.com', 'share.vrs.sohu.com', 'qzonestyle.gtimg.cn'
        ];

        function embedUrl(url) {
            if (!isSwf(url)) {
                return false;
            }

            var uri = url.replace(/\w+:\/\//gi, ''),
                result = false;

            $.each(videoSites,
                function (i, n) {
                    if (uri.startsWith(n)) {
                        result = true;
                        return false;
                    }
                });

            return result;
        }

        if (!isMobile()) {
            //视频播放功能JS。
            $("video.edui-upload-video")
                .each(function () {
                    var $this = $(this),
                        width = $this.attr('width'),
                        height = $this.attr('height'),
                        src = $this.prop('src'),
                        swfPath = "/Content/_Common/Base/swf/PowerPlayback.swf",
                        video = '';
                    if (isIe() && isWmv(src)) {
                        video = createWmvVideo(src, width, height);
                    } else if (!isIe() && isWmv(src)) {
                        video = createIeTooltip(width, height);
                    } else {
                        video = createVideo(swfPath, src, width, height);
                    }

                    if (embedUrl(src)) {
                        $this.replaceWith(
                            $(
                                "<embed allowScriptAccess='always' allowFullScreen='true' mode='transparent' type='application/x-shockwave-flash'></embed>")
                            .attr('width', width)
                            .attr('height', height).attr('src', src));
                    } else {
                        $this.replaceWith($(video));
                    }
                });

            $("embed")
                .each(function () {
                        var $this = $(this),
                            width = $this.attr('width'),
                            height = $this.attr('height'),
                            src = $this.prop('src'),
                            swfPath = "/Content/_Common/Base/swf/PowerPlayback.swf",
                            video = '';
                        if (isIe() && isWmv(src)) {
                            video = createWmvVideo(src, width, height);
                        } else if (!isIe() && isWmv(src)) {
                            video = createIeTooltip(width, height);
                        } else {
                            video = createVideo(swfPath, src, width, height);
                        }

                        if (!isSwf(src)) {
                            $this.replaceWith($(video));
                        }
                    }
                );
        } else {
            $("video.edui-upload-video").show();
        }
    });

    $(function () {
        var powerplaybacks = $("div[data-power-ui='powerplayback']");
        if (powerplaybacks.length > 0) {
            $.getScript('/Content/_Common/Assets/Scripts/swfobject.js')
                .done(function () {
                    powerplaybacks.each(function () {
                        var src = $(this).attr('data-url');
                        var title = $(this).attr('data-title');
                        var height = $(this).attr('data-height');
                        var width = $(this).attr('data-width');
                        var autoPlay = $(this).attr('data-autoPlay');
                        var random = parseInt(Math.random() * (99999 - 10000 + 1) + 10000);
                        var id = 'PowerPlay' + random;
                        $(this).attr('id', id);
                        var parameters =
                        {
                            src: src,
                            autoPlay: autoPlay,
                            title: title,
                            controlBarAutoHide: "false",
                            scaleMode: "liveOrRecorded"
                        };
                        swfobject.embedSWF("/Content/_Common/Base/swf/PowerPlayback.swf",
                            id,
                            width,
                            height,
                            "10.1.0",
                            {},
                            parameters,
                            { allowFullScreen: "true", wmode: "opaque" },
                            { name: "powerPlayback" }
                        );
                    });
                });
        }
    });

    //广告。
    $(function () {
        /**
         * 广告漂浮版位。
         */
        function advertisementFloat(floatPositions) {
            //var floatPositions = $("div[data-power-ui='advertisement_float']");
            floatPositions.each(function () {
                var width = $(this).data().width; //版位宽度
                var height = $(this).data().height; //版位高度

                //计算关闭按钮的位置
                var close = $(this).children(".close");
                switch ($(this).data().closeButtonPosition) {
                    case "UpperRight":
                        close.css("left", width - 20);
                        break;
                    case "LowerRight":
                        close.css("left", width - 20).css("top", height - 20);
                        break;
                    case "NoShow":
                        close.hide();
                        break;
                }

                //定时关闭版位
                var time = $(this).data().stopTime;
                if (time > 0) {
                    setTimeout(function () {
                            $(this).hide();
                        },
                        time * 1000);
                }
            });

            return floatPositions;
        }

        var floatPositionsInfo = $("div[data-power-ui='advertisement_float']");
        var floatPositions = advertisementFloat(floatPositionsInfo);
        floatPositions.each(function () {
            var floatPosition = $(this);
            //计算版位的坐标
            var ypos = positionCoordinate($(this));
            //广告随滚动条滚动
            if (floatPosition.data().enableScroll.toLowerCase() === "true") {
                floatPosition.css("top", $(this).scrollTop() + ypos);
                $(window)
                    .scroll(function () {
                        floatPosition.css("top", $(this).scrollTop() + ypos);
                    });
            }
        });

        //浏览器窗口大小改变时
        window.onresize = function () {
            var floatPositionsInfo = $("div[data-power-ui='advertisement_float']");
            var floatPositions = advertisementFloat(floatPositionsInfo);
            floatPositions.each(function () {
                var floatPosition = $(this);
                //计算版位的坐标
                var ypos = positionCoordinate($(this));
                //广告随滚动条滚动
                if (floatPosition.data().enableScroll.toLowerCase() === "true") {
                    $(window)
                        .scroll(function () {
                            floatPosition.css("top", $(this).scrollTop() + ypos);
                        });
                }
            });
        };

        //计算版位的坐标
        function positionCoordinate(floatPosition) {
            var xpos = 0;
            var ypos = 0;
            var width = floatPosition.data().width; //版位宽度
            var height = floatPosition.data().height; //版位高度
            var availWidth = document.documentElement.clientWidth; //浏览器窗口可见宽度
            var availHeight = document.documentElement.clientHeight; //浏览器窗口可见高度
            var verticalMargin = floatPosition.data().verticalMargin / 100;
            var horizontalMargin = floatPosition.data().horizontalMargin / 100;
            switch (floatPosition.data().datumMark) {
                case "UpperLeft":
                    xpos = availWidth * verticalMargin;
                    xpos = xpos === availWidth ? xpos - width : xpos;
                    ypos = availHeight * horizontalMargin;
                    ypos = ypos === availHeight ? ypos - height : ypos;
                    break;
                case "LowerRight":
                    xpos = (availWidth - width) - (availWidth * verticalMargin);
                    xpos = xpos < 0 ? 0 : xpos;
                    ypos = (availHeight - height) - (availHeight * horizontalMargin);
                    ypos = ypos < 0 ? 0 : ypos;
                    break;
                case "Middle":
                    var halfWidth = availWidth / 2;
                    var halfheight = availHeight / 2;
                    xpos = halfWidth + (halfWidth * verticalMargin);
                    xpos = xpos === availWidth ? xpos - width : xpos;
                    ypos = halfheight + (halfheight * horizontalMargin);
                    ypos = ypos === height ? ypos - height : ypos;
                    break;
            }
            floatPosition.css("z-index", 99).css("left", xpos);
            return ypos;
        }

        /**
         * 广告固定板块。
         */
        var fixedCount = 0,
            $fixedList = $("div[data-power-ui='advertisement_fixed']"),
            $fixedNumLinkList = $fixedList.find(".fixedCount a"),
            fixedLength = $fixedNumLinkList.length;

        function advertisementSiblings(element) {
            var $element = $(element),
                index = Number($element.text()) - 1;
            $element.addClass("seld").siblings().removeClass("seld");
            $fixedList.find(".fixedPosition > a")
                .eq(index)
                .fadeIn(300)
                .siblings()
                .fadeOut(300);
        }

        function showAuto() {
            fixedCount = fixedCount > (fixedLength - 1) ? 0 : ++fixedCount;
            advertisementSiblings($fixedNumLinkList.eq(fixedCount));
        }

        if (fixedLength) {
            $fixedList.each(function (i, n) {
                $(this).on('click',
                    ".fixedCount a",
                    function () {
                        advertisementSiblings(this);
                    });
            });

            var fixedCountTime = setInterval(showAuto, 2000);
            $fixedList.hover(function () { clearInterval(fixedCountTime) },
                function () { fixedCountTime = setInterval(showAuto, 2000); });
        }
    });

    // Ajax调用分部视图。
    $(function () {
        function getFunction(code, argNames) {
            var fn = window,
                parts = (code || "").split(".");

            while (fn && parts.length) {
                fn = fn[parts.shift()];
            }

            if (typeof (fn) === "function") {
                return fn;
            }

            argNames.push(code);
            return Function.constructor.apply(null, argNames);
        }

        function loadData($data, pageid) {
            var url = $data.ajaxUrl;
            if (pageid) {
                url = url + '?pageid=' + pageid;
            }
            $.ajax({
                url: url,
                type: $data.ajaxMethod,
                cache: !!$data.ajaxCache,
                data: {
                    partialViewName: $data.ajaxPartialViewName,
                    parameters: JSON.stringify($data.ajaxParameter)
                },
                beforeSend: function (xhr) {
                    getFunction($data.ajaxBegin, ["xhr"]).apply(null, arguments);
                },
                complete: function () {
                    getFunction($data.ajaxComplete, ["xhr", "status"]).apply(null, arguments);
                },
                success: function (response, status, xhr) {
                    var fn = window,
                        parts = ($data.ajaxSuccess || "").split(".");
                    while (fn && parts.length) {
                        fn = fn[parts.shift()];
                    }
                    if (typeof (fn) === "function") {
                        getFunction($data.ajaxSuccess, ["response", "status", "xhr"]).apply(null, arguments);
                    } else {
                        if (response.page) {
                            $data.ajaxDataCount = response.page.DataCount;
                            $data.ajaxPageIndex = response.page.PageIndex;
                            $data.ajaxPageSize = response.page.PageSize;
                            $data.ajaxPagingUrl = response.page.PagingUrl;
                        }

                        $('[data-ajax-data="' + $data.ajaxId + '"]')
                            .each(function () {
                                $(this).trigger('ajaxControlHandler', [response, $data]);
                            });

                        var mode = ($data.ajaxMode || "").toUpperCase();
                        $($data.ajaxUpdate)
                            .each(function (i, update) {
                                var top;
                                switch (mode) {
                                    case "BEFORE":
                                        top = update.firstChild;
                                        $("<div />")
                                            .html(response.html)
                                            .contents()
                                            .each(function () {
                                                update.insertBefore(this, top);
                                            });
                                        break;
                                    case "AFTER":
                                        $("<div />")
                                            .html(response.html)
                                            .contents()
                                            .each(function () {
                                                update.appendChild(this);
                                            });
                                        break;
                                    case "REPLACE-WITH":
                                        $(update).replaceWith(response.html);
                                        break;
                                    default:
                                        $(update).html(response.html);
                                        break;
                                }
                            });
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    getFunction($data.ajaxFailure, ["xhr", "status", "error"]).apply(null, arguments);
                }
            });
        }

        // ajaxpartial 初始化
        $('[data-ui-type="ajaxpartial"]')
            .each(function () {
                var $data = $(this).data();
                $data.ajaxLoadData = loadData;
                loadData($data);
            });

        // ajaxbutton 初始化
        function ajaxButtonControlHandler(response, $data) {
            $('[data-ajax-data="' + $data.ajaxId + '"]')
                .each(function () {
                    if (response.page.PageIndex >= response.page.PageCount) {
                        $(this).hide();
                    }
                });
        }

        $('[data-ui-type="ajaxbutton"]')
            .each(function () {
                var $this = $(this);

                function getData(element) {
                    var id = $(element).data().ajaxData;
                    var input = $('#' + id);
                    var $data = input.data();
                    var pageid = 1;
                    if ($data.ajaxPageIndex) {
                        pageid = $data.ajaxPageIndex + 1;
                    }
                    $data.ajaxLoadData($data, pageid);
                }

                $this.on('ajaxControlHandler',
                    function (event, response, $data) {
                        ajaxButtonControlHandler(response, $data);
                    });

                $this.on('click',
                    function () {
                        getData(this);
                    });
            });
    });

    //编辑器内的表格在前台展示时滚动条的显示
    $(function () {
        var contentwidth = $('[data-power-area="content"]').width();
        if (contentwidth != null) {
            $('[data-power-area="content"] table').wrap('<div class="ueditortable"></div>');
            $(".ueditortable").css("width", contentwidth);
            var ueditortables = $(".ueditortable");
            $.each(ueditortables,
                function () {
                    var table = $(this).find("table")[0];
                    if (table.clientWidth > contentwidth && table.clientHeight > contentwidth) {
                        $(this).css("height", contentwidth);
                    }
                });

            $(".ueditortable").hover(function () {
                    var tablewidth = $(this).find("table")[0].offsetWidth;
                    if (parseInt(tablewidth) > contentwidth && !$(this).hasClass("tablemask")) {
                        $(this)
                            .prepend(
                                '<p class="expandtable"><a id="fullScreen" title="全屏" href="javascript:;"><i class="fa fa-expand"></i></a></p>');
                    }
                },
                function () {
                    $(this).find(".expandtable").remove();
                });

            var $this = $(".ueditortable");
            $(".ueditortable").on("click",
                ".expandtable",
                function () {
                    $this = $(this).parent();
                    fullscreenState();
                });

            $("body").on("click",
                ".compresstable",
                function () {
                    $this = $(this).parent();
                    fullscreenState();
                });

            $("body").on("click",
                ".newwindowtable",
                function () {
                    var b = window.open('');
                    var html = $(".newueditortable").find("table").css("text-align", " center")[0].outerHTML;
                    $(b.document.body).html(html + "<style>td { border: solid;}</style>");
                });

            document.onkeydown = function (ev) {
                var oEvent = ev || event;
                if (oEvent.keyCode == 27) {
                    if ($(".newueditortable").length > 0) {
                        fullscreenState();
                    }
                }
            };
        }

        function fullscreenState() {
            if ($("div").hasClass("tablemask")) {
                $(".tablemask").remove();
                $(".newueditortable").remove();
            } else {
                $("body").prepend('<div class="tablemask"></div>');
                $this.find(".expandtable").remove();
                $("body").append(
                    '<div class="newueditortable">' +
                    $this.html() +
                    '</div>');

                tablemargins();
                $(".newueditortable").hover(function () {
                        $(this)
                            .prepend(
                                '<div class="newclass"><p class="newwindowtable"><a href="javascript:;">打开新窗口表单</a></p><p class="compresstable"><a title="退出全屏" href="javascript:;"><i class="fa fa-compress"></i>&nbsp;退出全屏</a></p></div>');
                        $(".newclass").css("left", $(window).width() / 2.4);
                    },
                    function () {
                        $(this).find(".newclass").remove();
                    });

                $(window).resize(function () {
                    tablemargins();
                });
            }
        }

        function tablemargins() {
            if ($this.find("table").width() > ($(window).width() / 1.1)) {
                $(".newueditortable").css("width", $(window).width() / 1.1);
            } else {
                $(".newueditortable").css("width", "");
            }

            $(".newueditortable").css("left", ($(window).width() - $(".newueditortable").outerWidth()) / 2);
            $(".newclass").css("left", $(window).width() / 2.4);
            if ($this.find("table").height() > $(window).height() / 1.2) {
                $(".newueditortable").css("height", $(window).height() / 1.2);
            } else {
                $(".newueditortable").css("height", "");
            }
        }
    });

    /**
     * 渲染二维码
     * @param {JQuery} $element 要渲染为二维码的jQuery实体。
     */
    function renderQrcode($element) {
        var content = $element.data('content'),
            size = $element.data('size');
        if (!content) {
            content = window.location.href;
        }
        content = encodeURI(content);
        new QRCode($element.get(0),
            {
                text: content,
                width: size,
                height: size
            });

        //qrcode.makeCode();
    }

    $('[data-powertype="qrcode"]').each(function (i, n) {
        renderQrcode($(n));
    });

    updateContentHits();

    /**
     * 更新内容的点击数。
     * @returns {}
     */
    function updateContentHits() {
        $('[data-power-hits-action]').each(function () {
            var $element = $(this);
            var mold = $element.data().powerHitsMold,
                id = $element.data().powerHitsId;

            $.post($element.data().powerHitsAction,
                { "mold": mold, "id": id },
                function (data) {
                    $element.text(data.hits);
                });
        });
    }

    //点击外链询问离开
    /**
     * 获取Host
     * @param {string} url 地址。
     */
    function getHost(url) {
        var host = "null";

        if (typeof url == "undefined" || null == url) {
            url = window.location.href;
        }

        //HTMLHyperlinkElementUtils.host 使用API来获取。
        var anchor = document.createElement("a");
        anchor.href = url;
        if (anchor.hostname) {
            return anchor.hostname;
        }

        var regex = /.*\:\/\/([^\/]*).*/;
        var match = url.match(regex);
        if (typeof match != "undefined" && null != match) {
            host = match[1];
        }
        return host;
    }

    /**
     * 点击外链询问离开
     * @param {this对象} _this this对象。
     * @param {string} type 类型"aLink"为a链接，"select"为select下拉。
     */
    function isExcelLink(_this, type) {
        var o = $(_this);
        var href = "";
        var siteName = $("meta[name ='application-name']").attr("content");
        if (type == "aLink") {
            href = o.attr('href');
        } else if (type == "select" && _this.options[_this.selectedIndex].value != '') {
            href = _this.options[_this.selectedIndex].value;
        }
        var linkHost = getHost(href);

        //设置白名单，excelLinkWhiteList是全局变量，如有需要请写到基础布局页里面。例excelLinkWhiteList = ["www.***.com"]
        if (typeof (excelLinkWhiteList) == "undefined") {
            excelLinkWhiteList = [];
        }
        if (typeof (href) != 'undefined' &&
            linkHost != 'null' &&
            excelLinkWhiteList.indexOf(linkHost) < 0 &&
            location.hostname.replace("www.", "") != linkHost.replace("www.", "").split(":")[0]) {
            o.removeAttr('href');
            var w = '480px';
            var h = '170px';
            if (window.screen.width < 768) {
                w = '90%';
                h = '170px';
            }
            var cf = layer.confirm(
                '<div style="margin-top:30px; font-size:16px;">您访问的链接即将离开“' + siteName + '”门户网站，</br>是否继续？</div>',
                {
                    btn: ['继续访问', '放弃'],
                    title: false,
                    shade: 0.7,
                    area: [w, h],
                    shadeClose: true,
                    end: function () {
                        if (type == "aLink") {
                            o.attr('href', href);
                        }
                    }
                },
                function () {
                    if (type == "aLink") {
                        o.attr('href', href);
                    }
                    layer.close(cf);
                    window.open(href);
                },
                function () {
                    if (type == "aLink") {
                        o.attr('href', href);
                    }
                    layer.close(cf);
                });
        }
    }

    $(document).on('click',
        'a',
        function () {
            isExcelLink(this, "aLink");
        });
    $(document).on('change',
        '[data-power-select-ExcelLink]',
        function () {
            isExcelLink(this, "select");
        });
}());