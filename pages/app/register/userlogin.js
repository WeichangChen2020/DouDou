var app = getApp();
const loginUrl = require('../../../config.js').loginUrl
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    let that = app;
    let userInfo = e.detail.userInfo
    if (e.detail.userInfo) {
      wx.request({
        url: loginUrl,
        data: {
          nickname: userInfo['nickName'],
          gender: userInfo['gender'],
          city: userInfo['city'],
          province: userInfo['province'],
          country: userInfo['country'],
          avatarUrl: userInfo['avatarUrl']
        },
        header: { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID') },
        method: 'POST',
        success: function (res) {
          that.setUserInfoStorage(res.data.user_info);
        },
        fail: function (res) {
        }
      })
      wx.navigateTo({
        url: '/pages/app/register/register',
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: 'alert',
        content: '取消授权将无法使用应用“国教预约”？',
        showCancel: false,
        cancelText: "否",
        confirmText: "是",
      })
    }
  }
})