//抓包工具
var request = require('request');
var cheerio = require('cheerio');
var db = require("./db");
request('http://fontawesome.dashgame.com/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    callback(body)
  }
})

function callback(html) {
  //使用load方法，参数是刚才获取的html源代码数据
  var $ = cheerio.load(html);
  var iconArr = [];

  //写法和jQuery一模一样，有没有觉得很cool
  $('div.fontawesome-icon-list').each(function (index, element) {
    var fArr = $(element).find('.fa');
    console.log(fArr)
    for (var key in fArr) {
      try {
        if ($(fArr[key]).attr("class") && $(fArr[key]).attr("class").indexOf("row fontawesome-icon-list") === -1) {
          iconArr.push($(fArr[key]).attr("class").split(" ")[1]);
        }
      } catch (e) {

      }
    }
  });
  let data = [];
  unique4(iconArr).forEach(ele => {
    data.push({ "si_icon": ele });
  });

  let c = {
    coll: "sys_icons",
    json: data
  }
  /* db.eval("sys_import", c, (err, res) => {
    console.log(res);
  }) */
}

function unique4(array) {
  array.sort();
  var re = [array[0]];
  for (var i = 1; i < array.length; i++) {
    if (array[i] !== re[re.length - 1]) {
      re.push(array[i]);
    }
  }
  return re;
} 