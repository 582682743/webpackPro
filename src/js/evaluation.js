require('./cssStyle.js');
require('./common.js');

$(function(){
    function starInteractive(thisId){
        var _thisParents = $('#'+thisId);
        _thisParents.find('a').on('click',function(){
            if(!$(this).hasClass('iconActive')){
                $(this).addClass('iconActive').parent().prevAll('td').children('a').addClass('iconActive');
            }else{
                $(this).parent().nextAll('td').children('a').removeClass('iconActive');
            }
        })
    }
    starInteractive('starInteractive');
})