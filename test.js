var obj = '{"success":1,"data":{"sell":"1917702","buy":"1906011","high":"2020731","low":"1803078","last":"1906011","vol":"304.2223","timestamp":1515477721405}}';
var json = JSON.parse(obj);
console.log(json.success)