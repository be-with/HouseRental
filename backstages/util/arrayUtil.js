
var utils = {
    unique(data) {
        var temp = {}, arr = [], len = data.length;
        for (var i = 0; i < len; i++) {
          if (!temp[data[i]]) {
            temp[data[i]] = 'abc';
            arr.push(data[i]);
          }
        }
        return arr;
      }
}


export default utils; 