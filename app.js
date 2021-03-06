//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.setStorageSync('code', res.code)
          wx.getUserInfo({
            success: function (res) {
              wx.request({
                url: 'https://www.lsy3d.com/wx',
                method: 'post',
                data: {
                  code: wx.getStorageSync('code'),
                  iv: res.iv,
                  encryptedData: res.encryptedData
                },
                success: res => {
                  let userid = res.data
                  if(userid !== wx.getStorageSync('userid')){
                    wx.setStorageSync('userid', userid)
                  }
                }
              })
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })

        }
      })
    }
  },
  globalData:{
    userInfo:null
  }

})