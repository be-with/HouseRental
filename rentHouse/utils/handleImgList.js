  // 处理获取到的图片数据
  function handleImgList(res) {
    var img = [];
    for (var i = 0; i < res.length; i++) {
      img.push(res[i].img.split(','));
    }
    return img;
  }

module.exports = {
    handleImgList:handleImgList
}