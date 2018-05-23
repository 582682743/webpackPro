require('../js/cssStyle.js');
require('../js/common.js');
require('../../plugin/paging.js');

/*拼table表格*/
var getList = function (data) {
    let list = data.data;
    let tr = '';
    $('#cnFund').html('');
    $(list).each(function(i){
        tr += "<tr>";
        tr += "<td>" + list[i].id+"</td>";
        tr += "<td>" + list[i].code + "</td>";
        tr += "<td>" + list[i].province  + "</td>";
        tr += "<td>" + list[i].city  + "</td>";
        tr += "<td>" + list[i].parent_id + "</td>";
        tr += "</tr>";
    });
    $('#cnFund').append(tr);
};

var _url = $.ucse.CHINACITYCLASS;
new GetTable(_url,$("#pageTool"),"",getList,"get",$("#cnFund")).init();

