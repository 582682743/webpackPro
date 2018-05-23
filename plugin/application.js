/**
 * Created by wangjiahao on 18/5/15.
 */
/*配置url*/
+function ($, undefined) {
    $.ucse = $.ucse || {};
    let URL = '';
    let urlType = '';
    let flag = false;
    if(flag){
        URL = 'http://'
    }else{
        URL = 'http://api.bch.xuemao.com/xuemao/public/'
    }
    $.extend($.ucse, {
        CHINACITYCLASS: URL + 'china_city_class.json' + urlType,//列表
    });
}(window.jQuery);

//ajax封装
+function($) {
    $.ucse = $.ucse || {};
    $.extend($.ucse, {
        ajax:function(options){
            var option = $.extend(options, {
                cache: false,
                dataType: 'JSONP',
                traditional: true
            });

            if(isNullOrEmpty(sessionStorage.getItem("fakeId"))){
                var fakeId = "";
            }else{
                var fakeId = sessionStorage.getItem("fakeId");
            }
            if(options.url.indexOf("?") > 0){
                options.url = encodeURI(options.url+"&sid="+fakeId);
            }else{
                options.url = encodeURI(options.url+"?sid="+fakeId);
            }

            function doResponse(data) {
                //去掉数据中null的值，改为空
                $.each(data, function(name, value) {
                    //json格式
                    if (value == 'null' || value == null || value == undefined || value == 'undefined') {
                        data[name] = '';
                    }
                    //数组格式
                    if ($.isArray(data[name])) {
                        $.each(data[name], function(i, value1) {
                            $.each(data[name][i], function(m, value2) {
                                if (value2 == 'null' || value2 == null || value2 == undefined || value2 == 'undefined') {
                                    data[name][i][m] = '';
                                }
                            });
                        });
                    }

                });
                if(data.code == "-11"){ //跳转到登录
                    window.top.location.href ="/user/login";
                }else{
                    options.processResponse(data);
                }
            }
            //ajax success
            if (options.processResponse) {
                $.extend(options, {
                    success: doResponse
                });
            }
            return $.ajax(option);
        }
    })
}(window.jQuery);


//删除输入框前后空格
function trim(str) {
    str = str + "";
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

//删除输入框全部空格
function trimAll(str) {
    var val = str.replace(/\s/g, '');
    return val;
}
//判断是否为null或空
function isNullOrEmpty(prop) {
    if (prop == null || trim(prop) == "" || prop == undefined)
        return true;
    else
        return false;
}

/*
 *
 * new GetTable("请求地址"，"分页id"，"上送参数"，"拼接表格方法名","表格tbody的id").init();
 * new GetTable(url,$("#pageTool"),param,getList,tbodyId).init();
 *
 */
/*加载表格和分页*/
var timePicker = null;
var GetTable = function (doUrl, el, param, listFun, method, tbodyId) {
    this.doUrl = doUrl;
    this.el = el;
    this.param = param;
    this.listFun = listFun;
    this.tbodyId = tbodyId;
    var totalPage = "";
}

GetTable.prototype = {
    //初始化表格
    init: function (doUrl, el, param, listFun, method, tbodyId) {
        var _this = this;
        var param = this.param;
        this.getListAjax(param);
        this.el.parent().find("#nodata").remove();
    },
    //默认加载表格
    getListAjax: function (param) {
        var _this = this;
        var doUrl = this.doUrl;
        var page = this.page;
        var method = this.method;
        _this.tbodyId.html("");
        new Loading($(".maskInTable"), {}, _this.el).init(); //显示加载中提示。。。
        $.kf.ajax({
            type: method,
            url: doUrl,
            data: param,
            dataType: "json",
            processResponse: function (data) {
                new Loading($(".maskInTable"), {}, _this.el).close(); //删除加载中提示。。。
                _this.checkData(data); //检测是否有数据
                totalPage = Number(data.total); //获取总条数
                pageLine = 20; //暂定20
                _this.pageLine = pageLine;
                _this.totalPage = totalPage;
                if (isNullOrEmpty(_this.totalPage)) {
                    _this.totalPage = 0;
                }
                _this.listFun(data); //加载表格
                _this.getPage(page); //加载分页
            }
        });
    },
    //点击分页时，重新加载表格
    getPageAjax: function (param) {
        var _this = this;
        var doUrl = this.doUrl;
        var method = this.method;
        /*new Loading($(".maskInTable"), {}, _this.el).init(); //显示加载中提示。。。*/
        new Loading($(".maskInTable"), {}, _this.el).init(); //删除加载中提示。。。
        $.kf.ajax({
            type: method,
            url: doUrl,
            data: param,
            dataType: "json",
            processResponse: function (data) {
                _this.listFun(data);
                new Loading($(".maskInTable"), {}, _this.el).close(); //删除加载中提示。。。
            }
        });
    },
    //加载分页
    getPage: function (el) {
        var _this = this;
        var tbodyId = this.tbodyId;
        this.el.empty().html("");
        this.el.Paging({
            pagesize: _this.pageLine, //默认表格行数
            count: _this.totalPage,
            callback: function (page, size, count) {//'当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页'
                var param = {"page": page}
                if(timePicker){
                    clearInterval(timePicker);
                }
                _this.tbodyId.html("");
                _this.getPageAjax(param);
                //_this.el.find("ul").prepend("<li class='first-page-li'><span>共" + _this.totalPage + "条</span></li>");
                //_this.el.find(".ui-paging-toolbar").prepend("<span>跳转到:</span>");
            },
            toolbar:true
        });
        //this.el.find("ul").prepend("<li class='first-page-li'><span>共" + _this.totalPage + "条</span></li>");
        //this.el.find(".ui-paging-toolbar").prepend("<span>跳转到:</span>");
    },
    //check表格是否有数据
    checkData: function (data) {
        var _this = this;
        var el = this.el;
        _this.el.parent().find("#nodata").remove();
        _this.el.show();
        if (data.data.length == 0) {
            if(_this.el.attr("id") != "pageToolDeal"){
                var html = "";
                html += "<div id='nodata'>";
                html += "<img src='../../../assets/admin/layout/img/nodata.png' />";
                html += "<p>抱歉，暂未搜到信息</p>";
                html += "<span>请查阅其他栏目</span>";
                html += "</div>";
                _this.el.before(html);

            }
            _this.el.hide();
        };
    }
}
/*加载表格end*/
