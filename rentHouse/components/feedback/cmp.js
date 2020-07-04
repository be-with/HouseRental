import WxValidate from "../../utils/WxValidate";

// components/feedback/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // form表单
    form: {
      uname: '',
      tel: '',
      content: ''
    },
    nFlag: true,//判断姓名格式
    tFlag: true,//判断手机号格式
    max: 300,//textarea最多可以输入的字
    currentWordNumber: 0,//textarea当前字数
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSubmitTap(e) {
      console.log(e);
      var uname = e.detail.value.uname;
      var tel = e.detail.value.tel;
      var content = e.detail.value.content;
      var nFlag = this.judgeName(uname);
      var tFlag = this.judgeTel(tel);
      var currentWordNumber = this.data.currentWordNumber;
      var self = this;
      if (uname == '') {
        this._showToast('姓名不能为空');
        return;
      }
      if (tel == '') {
        this._showToast('手机号不能为空');
        return;
      }
      if (!nFlag) {
        this._showToast('姓名格式不正确');
        return;
      }
      if (!tFlag) {
        this._showToast('手机号格式不正确');
        return;
      }
      if (content == '') {
        this._showToast('问题/建议不能为空');
        return;
      }
      if (currentWordNumber < 10) {
        this._showToast('建议/问题字数最少要10个字');
        return;
      }
      wx.request({
        // url: 'http://xxx/addFeedback',
        url: 'http://xxx/addFeedback',
        method: 'POST',
        data: {
          uname,
          tel,
          content
        },
        header: {
          'content-type': 'application/json'  //这里注意POST请求content-type是小写，大写会报错  
        },
        success: function (res) {
          // console.log(res);
          self._showToast('提交成功');
          var form = {
            uname: '',
            tel: '',
            content: ''
          }
          setTimeout(function () {
            self.setData({
              form
            })
          }, 1100)

        }
      })
    },
    // 判断姓名格式是否正确
    judgeName(nameValue) {
      var newStr = this.delTrim(nameValue);
      var nameReg = /^([\u4e00-\u9fa5·s]{2,20}|[a-zA-Z.s]{2,20})$/g;
      return (nameReg.test(newStr));
    },
    //去掉空格  str 需要去掉空格的字符串
    delTrim(str) {
      var newStr = str.split(' ').filter(function (item) {
        return item;
      }).join('')
      return newStr;
    },
    // 判断手机号格式是否正确
    judgeTel(telValue) {
      var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/g;
      return (telReg.test(telValue));
    },
    _showToast(title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration:1000
      })
    },
    onContentInput(e) {
      // 获取输入框的内容
      var value = e.detail.value;
      // 获取输入框内容的长度
      var len = parseInt(value.length);

      //最多字数限制
      if (len > this.data.max) return;
      // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
      this.setData({
        currentWordNumber: len //当前字数  
      });
    }
  }
})
