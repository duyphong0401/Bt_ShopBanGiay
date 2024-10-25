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
  
  function showCartInModal() {
    let cart = getCart(); 
    let cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = ''; 
    document.querySelector(".soluong_alert").innerHTML = `${cart.length}`
    
   
    if (cart.length > 0) {
      let tableContent = `
        <table class="table">
          <thead>
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
            <td><img style="width: 60px;" src="${item.image}" alt="${item.name}" /></td>
            <td>${item.name}</td>
            <td>
              <button onclick="tangSoLuong(${item.id})" class='btn btn-success'>+</button>
              <span> ${item.quantity} </span>
              <button onclick="giamSoLuong(${item.id})" class='btn btn-danger'>-</button>
            </td>
            <td>$${item.price.toLocaleString()}</td>
            <td>$${(item.price * item.quantity).toLocaleString()}</td>
            <td><button onclick="xoaSanPham(${item.id})" class='btn btn-danger'>Xóa</button></td>
            
          </tr>
        

        `;
      });
  
      tableContent += `
          </tbody>
        </table>
      `;
  
      cartItemsContainer.innerHTML = tableContent;
    } else {
      cartItemsContainer.innerHTML = '<p>Giỏ hàng trống</p>';
    }
  
    var myModal = new bootstrap.Modal(document.getElementById('cartModal'), {});
    myModal.show();

    
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

 




