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