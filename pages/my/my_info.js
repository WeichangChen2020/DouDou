const app = getApp()
const https = require('../../util/douban.js')
const apiUrl = require('../../config.js').apiUrl
Page({
  data: {
    userInfo: {},
    sex_array: ['保密', '男', '女'],
    school: ''
  },
  onLoad(e) {
    https.post('', {
      method: 'pingshifen.my.info'
    }).then(res => {
      if (res.data.success == true) {
        if (res.data.data.user_type == 0) {
          wx.navigateTo({
            url: '/pages/app/register/register',
          })
        }
        this.setData({
          'userInfo': res.data.data,
          // 'user_type': res.data.data.user_type,
        })
      } else {
        wx.showToast({
          title: res.data.message,
        })
      }
    })
  },
  onShow(e) {
    https.post('', {
      method: 'pingshifen.my.info'
    }).then(res => {
      if (res.data.success == true) {
        if (res.data.data.user_type == 0) {
          wx.navigateTo({
            url: '/pages/app/register/register',
          })
        }
        this.setData({
          'userInfo': res.data.data,
          // 'user_type': res.data.data.user_type,
        })
      } else {
        wx.showToast({
          title: res.data.message,
        })
      }
    })
  },
  chooseImage: function (e) {
    var that = this
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success: function (res) {
        that.setData({
          [`userInfo.head_img`]: res.tempFilePaths[0]
        })
      }
    })
  },
  bindTapName(e) {
    wx.navigateTo({
      url: 'change?change=name&value=' + e.currentTarget.dataset.value,
    })
  },
  bindTapTel(e) {
    wx.navigateTo({
      url: 'change?change=tel&value=' + e.currentTarget.dataset.value,
    })
  },
  bindTapSex(e) {
    wx.navigateTo({
      url: 'change?change=sex&value=' + e.currentTarget.dataset.value,
    })
  },
  bindTapSchool(e) {
    wx.navigateTo({
      url: '/pages/my/my_school' ,
    })
    console.log(this.data);
    this.setData({
      'userInfo.school' : this.data.school,
    })
  },
  bindTapUserType(e) {
    wx.showToast({
      title: '用户类型暂不支持修改',
      icon: 'none'
    })
  },
  bindTapEnterYear(e) {
    wx.showToast({
      title: '入学年份暂不支持修改',
      icon: 'none'
    })
  },
  bindTapNumber(e) {
    wx.navigateTo({
      url: 'change?change=num&value=' + e.currentTarget.dataset.value,
    })
  }
})