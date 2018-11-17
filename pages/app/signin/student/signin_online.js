const { Tab, Switch, extend } = require('../../../../dist/index');
const apiUrl = require('../../../../config.js').apiUrl
const https = require('../../../../util/douban.js')
const formatTime = require('../../../../util/util.js').formatTime
Page(extend({}, Tab, Switch, {
  data: {
    signin: {
      list: [{
        id: 'signined',
        title: '已签到（0人）'
      }, {
        id: 'un_signin',
        title: '未签到（0人）',
      }],
      selectedId: 'signined',
      scroll: false,
      height: 45
    },
    current_show: 'signin_record',
    course_id: 0,
    signin_id: 0,
    user_type: 0,
    signin_management: {

    },
    is_checked: true,
    signin_online: {
      now: '',
      location: '',
      latitude: '',
      longitude: '',
    },
    is_locked: false,
    signin_record_items:[],
    signin_record_count:0,
  },
  onLoad(option) {
    let signin_id = option.signin_id
    let signin_name = option.signin_name
    let course_id = wx.getStorageSync('pingshifen_current_course_id')
    // let user_type = wx.getStorageSync('pingshifen_user_type')
    let user_type = '1'
    if (!signin_id ) {
      wx.showToast({ title: 'signin_id参数错误', icon: 'none' })
      return
    } else if (!course_id) {
      wx.showToast({ title: 'course_id参数错误,请尝试切换课程', icon: 'none' })
      return
    }
    wx.setNavigationBarTitle({
      title: signin_name,
    })
    this.setData({ user_type: user_type, signin_id: signin_id, course_id: course_id })
    this.signin_online_view()
    this.signin_record_view()
  },
  onPullDownRefresh() {
    this.signin_record_view()
    wx.stopPullDownRefresh()
  },
  
  handleZanTabChange(e) {
    var selectedId = e.selectedId;
    this.setData({
      [`signin.selectedId`]: selectedId
    });
  },
  bindSigninOnlineShow() {
    this.setData({
      current_show: 'signin_online',
    });
  },
  bindSigninRecordShow() {
    this.setData({
      current_show: 'signin_record',
    });
  },
  bindSigninManageShow() {
    this.signin_manage_view()
    this.setData({
      current_show: 'signin_manage',
    });
  },
  signin_manage_view() {
    let signin_id = this.data.signin_id
    let course_id = this.data.course_id
    wx.request({
      url: apiUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
      },
      method: 'POST',
      data: {
        method: 'pingshifen.signin.get_management',
        signin_id: signin_id,
        course_id: course_id
      },
      success: res => {
        if (res.data.success == false) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        } else {
          this.setData({
            signin_management: res.data.data
          })
        }
      }
    })
  },
  handleZanSwitchChange(e) {
    console.log(e)
  },
  signin_online_view() {
    let obj = this
    let now = new Date().getTime()
    setInterval(function () {
      now += 1000
      obj.setData({
        [`signin_online.now`]: formatTime(now)
      })
    }, 1000)
    wx.getLocation({
      success: function (res) {
        console.log(res)
        obj.setData({
          [`signin_online.latitude`]: res.latitude,
          [`signin_online.longitude`]: res.longitude,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '获取位置信息失败',
          icon: 'none'
        })
      }
    })

  },
  signin_online() {
    if (this.data.is_locked == true) {
      return
    }
    let obj = this
    wx.getSetting({
      success(res) {
        var statu = res.authSetting;
        if (!statu['scope.userLocation']) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //授权成功之后，再调用chooseLocation选择地方
                      wx.getLocation({
                        success: function (res) {
                          obj.setData({
                            [`signin_online.latitude`]: res.latitude,
                            [`signin_online.longitude`]: res.longitude,
                          })
                        },
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              } else {
                obj.setData({ is_locked: false })
                return
              }
            }
          })
        }
      }
    })
    this.setData({is_locked: true})
    wx.showLoading({
      title: '签到中...',
    })
    let that = this
    let course_id = this.data.course_id
    let signin_id = this.data.signin_id
    let latitude = this.data.signin_online.latitude
    let longitude = this.data.signin_online.longitude
    if (!course_id || !signin_id || !latitude || !longitude) {
      wx.showToast({ title: '参数错误', icon: 'none', })
      return
    }
    wx.request({
      url: apiUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
      },
      method: 'POST',
      data: {
        method: 'pingshifen.signin.signin_online',
        signin_id: signin_id,
        course_id: course_id,
        latitude: latitude,
        longitude: longitude,
      },
      success: res => {
        this.setData({is_locked: false})
        wx.hideLoading()
        if (res.data.success == false) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        } else {
          wx.showToast({title: '签到成功'})
          this.setData({
            current_show: 'signin_record',
          });
          this.signin_record_view()
        }
      },
      fail: res => {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  signin_record_view() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: apiUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + wx.getStorageSync('pingshifen_PHPSESSID')
      },
      method: 'POST',
      data:{
        method: 'pingshifen.signin.list_all_record',
        signin_id: this.data.signin_id,
      },
      success: res => {
        if(res.data.success == false) {
          wx.showToast({title: res.data.message,icon: 'none'})
        } else {
          this.setData({
            signin_record_items: res.data.data,
            [`signin.list[0].title`]: '已签到（' + res.data.data.finish.length+'人）',
            [`signin.list[1].title`]: '未签到（' + res.data.data.undo.length + '人）',
            signin_record_count: res.data.total_count,
          })
          wx.hideLoading()
        }
      }
      
    })
  },
}));