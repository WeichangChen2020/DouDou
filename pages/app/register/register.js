const Zan = require('../../../dist/index');
const getUserTelUrl = require('../../../config.js').getUserTelUrl;
const apiUrl = require('../../../config.js').apiUrl;
var app = getApp();
Page(Object.assign({}, Zan.Field, Zan.Tab, Zan.TopTips, {
  data: {
    role_list: {
      list: [
        {
          id: 'student',
          title: '学生用户'
        }, {
          id: 'teacher',
          title: '教师用户'
        }],
      selectedId: 'student'
    },
    year: [2014, 2015, 2016, 2017, 2018],
    yearIndex: 2,
    name: '',
    tel: '',
    school: '',
    num: '',
    invitationCode: '', //邀请码
  },
  onLoad: function (options) {
    if (options.code && options.code != 0) {
      this.setData({
        [`role_list.selectedId`]: 'teacher',
        invitationCode: options.code
      });
    }
  },
  onShow() {
    
  },
  handleZanTabChange(e) {
    var selectedId = e.selectedId;
    this.setData({
      [`role_list.selectedId`]: selectedId
    });
  },

  // 选择入学年份
  onyearChange(e) {
    this.setData({
      yearIndex: e.detail.value
    });
  },
  // 获取手机号码
  getUserTel(e) {
    this.setData({
      tel: e.detail.value
    })
    // var rd3_session = wx.getStorageSync('pingshifen_3rd_session')
    // var obj = this
    // wx.request({
    //   url: getUserTelUrl,
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //     'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
    //   },
    //   data: {
    //     rd3_session: rd3_session,
    //     encryptedData: e.detail.encryptedData,
    //     iv: e.detail.iv,
    //   },

    //   success: function (res) {
    //     //检验服务端用户是否过期
    //     console.log(res)
    //     if (res.data.success == true) {
    //       obj.setData({
    //         tel: res.data.data.data.purePhoneNumber
    //       })
    //       console.log(res.data.data)
    //     } else {
    //       wx.showToast({
    //         title: res.data.message + '请重新进入小程序',
    //         icon:'none',
    //       })
    //     }
    //   },
    // })
  },
  getUserSchool() {
    wx.navigateTo({
      url: '/pages/my/my_school',
    })
  },
  changeName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  changeNum(e) {
    this.setData({
      num: e.detail.value
    })
  },
  // 用户验证码
  changeInvitationCode(e) {
    this.setData({
      invitationCode: e.detail.value,
    })
  },
  bindSubmit(e) {
    if (!this.data.name) {
      this.showZanTopTips('姓名不能为空');
      return
    }
    if (!this.data.tel) {
      this.showZanTopTips('手机号不能为空');
      return
    } else {
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      let tel = this.data.tel;
      if (!myreg.test(tel)) {
        this.showZanTopTips('请输入正确的手机号');
        return false;
      }
    }
    if (!this.data.school) {
      this.showZanTopTips('学校不能为空');
      return
    }
    if (this.data.role_list.selectedId == 'student') {
      if (!this.data.num) {
        this.showZanTopTips('学号不能为空');
        return
      }
      wx.showLoading({
        title: '绑定中',
      })
      // 注册成为学生用户
      wx.request({
        url: apiUrl,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
        },
        data: {
          method: 'pingshifen.student.bind',
          name: this.data.name,
          tel: this.data.tel,
          school: this.data.school,
          num: this.data.num,
          enter_year: this.data.year[this.data.yearIndex],
          user_type: this.data.role_list.selectedId,
        },
        method: 'POST',
        success: res => {
          wx.hideLoading()
          if (res.data.success == true) {
            wx.showToast({
              title: res.data.message,
              icon:'success',
            })
            wx.setStorageSync('pingshifen_user_type', '1')
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        },
        fail: res => {
          wx.hideLoading()
          wx.showToast({
            title: '绑定失败',
            icon:'none'
          })
        },
        conplete: res => {
          wx.hideLoading()
        }
      })
    }
    else {
      //教师端跟学生端分离了，这边全注释掉---2018-8-10
      // // 注册成为教师用户
      // if (!this.data.invitationCode) {
      //   this.showZanTopTips('请输入邀请码')
      //   return
      // }
      // console.log(this.data)
      // wx.showLoading({
      //   title: '绑定中',
      // })
      // wx.request({
      //   url: apiUrl,
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded',
      //     'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
      //   },
      //   data: {
      //     method: 'pingshifen.teacher.bind',
      //     name: this.data.name,
      //     tel: this.data.tel,
      //     school: this.data.school,
      //     invitation_code: this.data.invitationCode,
      //     user_type: this.data.role_list.selectedId,
      //   },
      //   method: 'POST',
      //   success: res => {
      //     wx.hideLoading()
      //     if (res.data.success == true) {
      //       wx.showToast({
      //         title: res.data.message,
      //         icon: 'success',
      //       })
      //       wx.setStorageSync('pingshifen_user_type', '2')
      //       wx.reLaunch({
      //         url: '/pages/index/index',
      //       })
      //     } else {
      //       wx.showToast({
      //         title: res.data.message,
      //         icon:'none',
      //         duration: 2000
      //       })
      //     }
      //   }
      // })
    }
  },
}));
