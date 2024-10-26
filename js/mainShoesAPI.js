import { ShoessAPI } from "./ShoessAPI.js";
import { getListAPI, getDetailAPI } from "./shoesService.js";

console.log(window.location)
function hienThiCard(arrShoes) {
  let contentCard = "";

  arrShoes.map(function (shoes, index) {
    let cardShoes = `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card ">
                    <div class="card_Shoes">
                        <div class="card_ShoesImg">
                            <img src="${shoes.image}" class="card-img-top" alt="" data-fancybox = "gallery" data-caption="">
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                <a class="shoes__title" href="./views/detail.html?id=${shoes.id}">
                                    <h5 class="text-start">${shoes.name}</h3></a>
                                   
                                </div>
                                <div>
                                    <h3 class="shoes__title">$${shoes.price}</h3>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between">
                                <div class="shoes__rating">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </div>
                                <div>
                                    <button onclick="addToCart('${shoes.id
      }')" class="btnShoes-shadow" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        <i class="fa fa-shopping-cart"></i> Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    contentCard += cardShoes;
  });
  document.getElementById("product-container").innerHTML = contentCard;
}


function getShoesList() {
  let axiosObj = getListAPI();
  axiosObj
    .then(function (result) {
      hienThiCard(result.data.content);
    })
    .catch(function (error) { });
}
getShoesList();

function addToCart(id) {

  let cart = sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart')) : [];
  getDetailAPI(id)
    .then(function (result) {
      const product = result.data.content;

      let existingProduct = cart.find(item => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      sessionStorage.setItem('cart', JSON.stringify(cart));
      showCartInModal();
      console.log('Sản phẩm đã được thêm vào giỏ hàng:', cart);
    })
    .catch(function (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    });
}

let myModal;

function initModal() {
  myModal = new bootstrap.Modal(document.getElementById('cartModal'));
}
function showCartInModal() {
  let cart = getCart();
  let cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = '';
  document.querySelector(".soluong_alert").innerHTML = `${cart.length}`;

  let tableContent = '';

  if (cart.length > 0) {
    tableContent += `
         <div class="table-responsive">
        <table class="table table-hover align-middle text-center">
          <thead class="table-light">
            <tr>
              <th scope="col">Mã</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Tên</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Đơn giá</th>
              <th scope="col">Thành tiền</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
      `;

    cart.forEach(item => {
      tableContent += `
              <tr>
          <td>${item.id}</td>
          <td><img style="width: 60px;" class="img-thumbnail" src="${item.image}" alt="${item.name}" /></td>
          <td>${item.name}</td>
          <td>
            <button onclick="tangSoLuong(${item.id})" class="btn btn-outline-success btn-sm px-3">+</button>
            <span class="mx-2">${item.quantity}</span>
            <button onclick="giamSoLuong(${item.id})" class="btn btn-outline-danger btn-sm px-3">-</button>
          </td>
          <td><strong>$${item.price.toLocaleString()}</strong></td>
          <td><strong>$${(item.price * item.quantity).toLocaleString()}</strong></td>
          <td><button onclick="xoaSanPham(${item.id})" class="btn btn-outline-danger btn-sm">Xóa</button></td>
        </tr>
          `;
    });

    tableContent += `
              </tbody>
        </table>
      </div>
      `;
      cartItemsContainer.innerHTML = tableContent;
    } else {
      cartItemsContainer.innerHTML = `
        <div class="alert alert-warning text-center" role="alert">
          Giỏ hàng trống
        </div>
      `;
    }


  myModal.show();
}

// Khởi tạo modal khi trang được tải
window.onload = initModal;


function getCart() {
  let cart = sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart')) : [];
  return cart;
}
window.addToCart = addToCart

function tangSoLuong(id) {
  let cart = getCart();
  let product = cart.find(item => item.id === id);
  if (product) {
    product.quantity += 1;
    sessionStorage.setItem('cart', JSON.stringify(cart));
    showCartInModal();
  }
}

function giamSoLuong(id) {
  let cart = getCart();
  let product = cart.find(item => item.id === id);
  if (product && product.quantity > 1) {
    product.quantity -= 1;
    sessionStorage.setItem('cart', JSON.stringify(cart));
    showCartInModal();
  }
}

function xoaSanPham(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  sessionStorage.setItem('cart', JSON.stringify(cart));
  showCartInModal();
}

window.tangSoLuong = tangSoLuong;
window.giamSoLuong = giamSoLuong;
window.xoaSanPham = xoaSanPham;

document.getElementById("cart_button").onclick = function () {
  showCartInModal();
}











