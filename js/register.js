
function getUser() {
    return axios({
        method: 'get',
        url: `https://shop.cyberlearn.vn/api/Users/getProfile`
        ,
    })
}
function dangKy() {
    let username = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let gender = document.querySelector('input[name="gender"]:checked').value;

    if (confirmPassword === password) {
        let user = {
            "email": email,
            "password": password,
            "name": username,
            "gender": gender === "male",
            "phone": phone
        };
        axios.post('https://shop.cyberlearn.vn/api/Users/signup', user)
            .then(function (response) {
                console.log('Đăng ký thành công:', response.data);
                alert('Đăng ký thành công!');
            })
            .catch(function (error) {
                console.error('Đăng ký thất bại:', error.response.data);
                alert('Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.');
            });
    } else {
        console.log("Mật khẩu xác nhận không khớp!");
    }
}
function dangNhap() {
    let email = document.getElementById("usernameDN").value;
    let password = document.getElementById("passwordDN").value;
    let user = {
        "email": email,
        "password": password,
    };
    axios.post('https://shop.cyberlearn.vn/api/Users/signin', user)
        .then(function (response) {
            console.log('Đăng Nhập thành công:', response.data);
            alert('Đăng Nhập thành công!');

        })
        .catch(function (error) {
            console.error('Đăng Nhập thất bại:', error.response.data);
            alert('Đăng Nhập thất bại! Vui lòng kiểm tra lại thông tin.');
        });
}

window.dangKy = dangKy;
window.dangNhap = dangNhap;
