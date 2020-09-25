import Request from '../req/request.js'
class Guide extends Request {
    fetchGuideList(data) {
        return super.request({
            url: 'http://localhost:8082/guides',
            method: 'get',
            data: data
        })
    }
}

const guide = new Guide()
export default guide
