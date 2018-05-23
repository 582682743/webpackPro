/**
 * Created by xiaozhiren on 18/5/21.
 */
require('../js/cssStyle.js');
require('../js/common.js');
var md5 = require('./plugin/md5.js').md5;
$(function(){
    console.log(123);
    //用户名失焦校验
    $('#userName').blur(function(){
        if(!checkSmsLoginUser()){
            return false;
        }
    });
    $("#post_msg").click(function(){
        var userName = $.trim($('#userName').val()), //登陆名
            passwd = $.trim($('#passWord').val());//密码
        var userInfo = {
            user_name : userName,
            passwd : md5(passwd)
        };
        if(!checkSmsLoginUser()){
            return false;
        }
        if ( !passwd || passwd == "") {
            alert("请输入密码");
            return false;
        }
        $.post('http://openapi.bch.xuemao.com/public/web/?service=Web.User.VideoLogin' ,userInfo , function(res){

        } )

    })


    function checkSmsLoginUser(){
        var userName = $.trim($('#userName').val());
        var user = document.getElementById('userName').value;
        if (userName == null || userName == "") {
            alert("请输入用户名");
            return false;
            //手机号正则
        }else if(!(/(\S)+[@]{1}(\S)+[.]{1}(\w)+/.test(user))) {
            alert("邮箱格式不正确，请重新输入");
            return false;
        }
        return true;
    }
})
