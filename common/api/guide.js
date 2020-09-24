import Request from '../req/request.js'
class Guide extends Request {
    fetchGuideList(data) {
        return super.request({
            // url: 'http://localhost:8080/guides',
            url: 'http://localhost:8081/searchHistory/hot',
            method: 'get',
            data: data
        })
    }
}

const guide = new Guide()
export default guide
