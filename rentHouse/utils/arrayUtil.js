function unique(data) {
  var temp = {}, arr = [], len = data.length;
  for (var i = 0; i < len; i++) {
    if (!temp[data[i]]) {
      temp[data[i]] = 'abc';
      arr.push(data[i]);
    }
  }
  return arr;
}

function contain(arr, str) {
  var index = arr.length;
  while (index--) {
    if (arr[index].includes(str)) {
      return true;
    }
  }
  return false;
}

function frequcy(arr) {
  var obj = {};//记录最终结果的对象
  for (var i = 0; i < arr.length; i++) {
    var temp = arr[i];
    if (!obj[temp]) {
      obj[temp] = 1
    } else {
      obj[temp]++;
    }
  }
  return obj;
}
module.exports = {
  unique: unique,
  contain: contain,
  frequcy: frequcy
}