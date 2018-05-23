/**
 * Created by xiaozhiren on 18/5/21.
 */
require('../js/cssStyle.js');
require('../js/common.js');
$(function(){
    //问题列表切换
    $(".question_list").on("click" ,"li",function(){
        var _this = $(this),num = _this.data("num");
        _this.addClass("active").siblings().removeClass("active");
        $("#questionnaire_survey").find(".question_all").hide();
        $("#questionnaire_survey").find(".question_all"+num).show();
    })

    //查看采访者信息
    $(".sign_mark").hover(function(){
        $(".interviewer").show();
    } , function(){
        $(".interviewer").hide();
    })

    //选择选项
    $("#questionnaire_survey").on('click','.radioBox',function(){
        var _this = $(this),
            val = _this.find('.radio').data('val');
        _this.find('.radio').find('i').addClass('active');
        _this.siblings('.radioBox').find('.radio i').removeClass('active');
        _this.siblings('input').val(val);

    })
    //单选
    $("#type_step").on('click','.radio',function(){
        var _this = $(this),
            val = _this.attr('data-name');
        _this.find('i').addClass('active');
        _this.siblings('span').find('i').removeClass('active');
        _this.siblings('input').val(val)
    })

    ////多选
    //$(".anwerobx").on('click','.checkBoxg',function(){
    //    var _this = $(this).find('.checked'),
    //        val = _this.attr('data-val');
    //    _this.find('i').toggleClass('active');
    //    _this.closest('.check_group').siblings('.test_answer').val(val);
    //})

})