<script>
    /**
     * 绑定微信用户
     * @param {Object} res
     * @param {Object} authPage
     */
    function bindWechatUser(res, authPage) {
        var me = authPage
        let userInfo = res.detail.userInfo

        if (userInfo) {
            uni.login({
                success: function(res) {
                    if (res.code) {
                        let data = {
                            storeId: me.$common.STORE_ID,
                            storeType: me.$common.getStoreType(),
                            nickName: userInfo.nickName,
                            avatar: userInfo.avatarUrl,
                            sex: userInfo.gender,
                            code: res.code
                        }
                        me.$user.bindWechatUser(data).then(res => {
                            me.showWin = false;
                            let code = res.responseCode
                            if (code == 'BIND_WECHAT_USER_SUCCESS') {
                                uni.showToast({
                                    title: '授权成功',
                                    duration: 1000,
                                    icon: 'none'
                                })
                                // 用户信息存至本地
                                // setStorageSync只支持原生类型、Date、及能够通过JSON.stringify序列化的对象，不能直接传入对象
                                let userinfo = {}
                                userinfo['token'] = res.token
                                userinfo['openid'] = res.wxOpenid
                                userinfo['session_key'] = res.wxSessionKey
                                uni.setStorageSync('userinfo', userinfo)
                                uni.setStorageSync('token', res.token)
                            } else {
                                let msg = res.responseMessage;
                                uni.showToast({
                                    title: msg,
                                    duration: 2000,
                                    icon: 'none'
                                })
                            }
                        }).catch(e => {
                            me.showWin = false
                            uni.showToast({
                                title: e.responseMessage,
                                duration: 1000,
                                icon: 'none'
                            })
                        })
                    } else {
                        console.log('授权失败')
                        me.showWin = false
                        uni.showToast({
                            title: '授权失败',
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                },
            })
        } else {
            console.log('点击了拒绝授权')
            me.showWin = false
        }
    }

    /**
     * 关闭微信后重新登陆来客系统获取相关操作钥匙
     * @param {Object} me
     */
    function reloadToLaikeOS(me, callback, args) {
        return new Promise(function(laikeok, error) {
            uni.login({
                success: function(res) {
                    if (res.code) {
                        let data = {
                            code: res.code,
                            module: 'app',
                            action: 'login',
                            app: 'user',
                            pid: uni.getStorageSync('fatherId'),
                            store_type: 1,
                        }
                        me.$req.post({
                            data
                        }).then(res => {
                            me.showWin = false
                            let access_id = res.access_id
                            let userinfo = {}
                            userinfo['openid'] = res.openid
                            userinfo['session_key'] = res.session_key
                            userinfo['user'] = res.user
                            me.access_id = res.access_id
                            me.$store.state.access_id = res.access_id
                            uni.setStorageSync('userinfo', userinfo)
                            me.access_id1 = true
                            uni.setStorageSync('LoingByHand', false)
                            uni.setStorageSync('laiketuiAccessId', me.access_id)
                            uni.setStorageSync('online', true)
                            me.$emit('pChangeLoginStatus')

                            if (callback && args) {
                                callback(args)
                            } else if (callback) {
                                callback()
                            }
                        })
                    } else {
                        me.showWin = false
                        uni.showToast({
                            title: '重新登陆失败',
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                },
            })
        })
    }

    /**
     * 授权过后，没有失效时
     * @param {Object} obj
     */
    function mp_weixin_load(fromPage, callback, args) {
        var me = fromPage;
        let p = new Promise((resolve, reject) => {
            var userinfo = uni.getStorageSync('userinfo') || []
            if (userinfo['openid']) {
                checkToken(me, userinfo['openid']).then(function(token) {
                    resolve(token)
                })
            } else {
                reloadToLaikeOS(me, callback, args)
            }
        })
        p.then(function(token) {
            var userinfo = uni.getStorageSync('userinfo') || []
            // var headimgurl = userinfo.user.headimgurl || ''
            // me.$store.state.access_id = token
            uni.setStorageSync('token', token)
            // me.access_id = me.$store.state.access_id
            me.login_status = 1
            if (callback && args) {
                callback(args)
            } else if (callback && !args) {
                callback()
            }
        })
    }

    /**
     * 检测accessID 是否过期，若过期则生成新accessid
     * @param {Object} access_id
     */
    function checkToken(me, openid) {
        let data = {
            storeId: me.$common.STORE_ID,
            storeType: me.$common.getStoreType(),
            openid: openid
        }
        return new Promise((resolve, reject) => {
            me.$token.checkToken(data).then(res => {
                let code = res.responseCode
                let token = res.token
                if (code == 'CHECK_TOKEN_SUCCESS' && token) {
                    resolve(token)
                } else {
                    let message = res.responseMessage || '登陆异常，请联系管理员！'
                    uni.showToast({
                        title: message,
                        icon: 'none',
                        duration: 1500
                    })
                }
            }).catch(e => {
                uni.showToast({
                    title: e.responseMessage,
                    duration: 1000,
                    icon: 'none'
                })
            })
        })
        // var data = {
        //     module: 'app',
        //     action: 'login',
        //     app: 'login_access',
        //     openid: openid,
        //     store_type: 1
        // }
        // return new Promise((resolve, reject) => {
        //     uni.request({
        //         url: me.$store.state.url,
        //         data,
        //         success: function(res) {
        //             var code = res.data.code
        //             let token = res.data.access_id
        //             console.log('laikeLoginTimeout：')
        //             console.log(JSON.stringify(res))
        //             if (code == 200 && token) {
        //                 resolve(token)
        //             } else {
        //                 let message = res.data.message || '登陆异常，请联系管理员！'
        //                 uni.showToast({
        //                     title: message,
        //                     icon: 'none',
        //                     duration: 1500
        //                 })
        //             }
        //         }
        //     })
        // })
    }

    /**
     * 检测微信的session是否失效
     * @param {Object} authPage
     * @param {Object} fromPage
     */
    function mp_weixin_checksession(authPage, fromPage, callback, args) {
        var _this = authPage
        var me = fromPage;
        uni.checkSession({
            success: function(res) {
                console.log(res, '登录未过期')
                var token = uni.getStorageSync('token')
                if (!token) {
                    _this.showWin = true;
                    if (!me.fastTap) {
                        me.fastTap = true;
                    }
                } else {
                    _this.showWin = false
                    mp_weixin_load(me, callback, args)
                }
            },
            fail: function(res) {
                console.log(res, '登录过期了')
                _this.showWin = true
            }
        })
    }

    /**
     * 游客类型界面需要检测授权是否过期调用
     * @param {Object} fromPage
     * @param {Object} callback
     * @param {Object} args
     */
    function laiketui_mp_weixin_checkauth(fromPage, callback, args) {
        var me = fromPage
        let LoingByHand = uni.getStorageSync('LoingByHand')
        let needRegister = uni.getStorageSync('needRegister')
        if (needRegister == me.LaiKeTuiCommon.LKT_NRL_TYPE.NRL && !LoingByHand) {
            uni.checkSession({
                success: function(res) {
                    console.log(res, '登录未过期')
                    mp_weixin_load(me, callback, args)
                },
                fail: function(res) {
                    console.log(res, '登录过期了')
                }
            })
        }
    }

    export default {
        bindWechatUser,
        mp_weixin_load,
        mp_weixin_checksession,
        laiketui_mp_weixin_checkauth,
    }
</script>
