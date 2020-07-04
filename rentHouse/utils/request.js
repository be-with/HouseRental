

class Request {

    // baseUrl = "http://localhost:12306";
    // baseUrl = "http://xxx";
    baseUrl = "http://xxx";

    getData({url, method = 'GET', data = {}}) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                method: method,
                data: data,
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success(res) {
                    // console.log(res);
                    if (res.statusCode == 200) {
                        resolve(res.data.data);
                    } else {
                        wx.showToast({
                            title: "请求错误",
                            icon: "none"
                        })
                    }
                },
                fail(err){
                    wx.showToast({
                        title: "请求错误",
                        icon: "none"
                    })
                }
            })
        })
    }

    // showError() {
    //     wx.showToast({
    //         title: "请求错误",
    //         icon: "none"
    //     })
    // }
}

export { Request };
