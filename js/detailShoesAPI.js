import { getListAPI, getDetailAPI } from "./shoesService.js";

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
                                <a class="shoes__title" href="./../views/detail.html?id=${shoes.id}">
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
function hienThiDetail(shoes) {
  let quantity = '1';
  function tangSoLuongDT() {
    let quantity = parseInt(document.getElementById('quantityDisplay').innerText, 10);

    quantity += 1;
    document.getElementById('quantityDisplay').innerText = quantity;
    showCartInModal();
    addToCart(id)
  }
  function giamSoLuongDT() {
    let quantity = parseInt(document.getElementById('quantityDisplay').innerText, 10);

    if (quantity > 1) {
      quantity -= 1;
      document.getElementById('quantityDisplay').innerText = quantity;
    }
    showCartInModal();
    addToCart(id)
  }
  function chonSize(button) {
    document.querySelectorAll('.size-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  }


  let contentCard = `
      <div class="container my-5">
        <div class="row">
          <div class="col-md-6 d-flex justify-content-center">
          <div class=" product_Shoes">
            <div class="product_ShoesImg">
                            <img src="${shoes.image}" class="card-img-top" alt="">
                        </div></div>
          </div>
          <div class="col-md-6">
            <h2 class="text-primary font-weight-bold mb-3">${shoes.name}</h2>
            <p class="shoes__text">${shoes.description}</p>

            
            <h5 class="text-secondary">Kích thước:</h5>
            <div class="mb-3" >
              ${shoes.size.map(size => `
                <button onclick="chonSize(this)" type="button" class="btn btn-outline-info mx-1 size-button" >${size}</button>
              `).join('')}
            </div>

            <h3 class="text-danger font-weight-bold mb-4">$${shoes.price}</h3>
            
            <div class="d-flex align-items-center mb-4">
              <button onclick="giamSoLuongDT(${shoes.id})" class="btn btn-outline-secondary">-</button>
               <span id="quantityDisplay" class="mx-3">${quantity}</span>
              <button onclick="tangSoLuongDT(${shoes.id})" class="btn btn-outline-secondary">+</button>
            </div>

            <button data-bs-toggle="modal" onclick="addToCart('${shoes.id
    }')" data-bs-target="#exampleModal" class="btn btn-success btn-lg w-100 ">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  document.getElementById("detailShoes").innerHTML = contentCard;
  window.tangSoLuongDT = tangSoLuongDT;
  window.giamSoLuongDT = giamSoLuongDT;
  window.chonSize = chonSize;

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
function getDetailList($id) {
  let axiosObj = getDetailAPI($id);
  axiosObj
    .then(function (result) {
      hienThiDetail(result.data.content);
    })
    .catch(function (error) {
      console.log(error);
    });
}
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
getDetailList(id);

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

function showCartInModal() {
  let cart = getCart();
  let cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = '';
  document.querySelector(".soluong_alert").innerHTML = `${cart.length}`
  
  if (cart.length > 0) {
    let tableContent = `
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

    let total = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity; 
      total += itemTotal;
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
      <div class="text-end me-5">
        <h4 >Tổng tiền: <span class="text-danger"> $${total.toLocaleString()}</span></h4>
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
}


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