
function getListAPI() {
    return axios({
        method: 'get',
        url: 'https://shop.cyberlearn.vn/api/Product',
    });
}
function getDetailAPI(id) {
    return axios({
        method: 'get',
        url: `https://shop.cyberlearn.vn/api/Product/getbyid?id=${id}`
        ,
    })
}


export { getListAPI, getDetailAPI };