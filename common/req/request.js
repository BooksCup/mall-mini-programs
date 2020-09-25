import Vue from 'vue'

class Request {
    constructor() {
    }

    request(Param) {

        return new Promise((resolve, reject) => {
            // 请求拦截
            if (typeof this.request.use === 'function') {
                this.request.use(Param)
            }

            uni.request({
                url: Param.url,
                method: Param.method || 'GET',
                data: {
                    ...Param.data
                } || {},
                header: Param.header || {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: (res) => {
                    if (this.response(res)) {
                        resolve(res.data)
                    }
                },
                fail: (err) => {
                    // TODO:错误处理
                    reject(err)
                }
            })
        })
    }

    response(res) {
        let {
            statusCode
        } = res

        // 响应拦截
        if (typeof this.response.use === 'function') {
            this.response.use(res)
        }

        if (statusCode === 200) {
            return true
        }
        return false
    }

}

export default Request
