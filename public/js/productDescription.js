"use strict";

const cartIcon = document.querySelector(".cart_content img");
const cartbox = document.querySelector(".cart_box");
const qtyLable = document.querySelector(".qty_label");
const normalPrice = document.querySelector(".normal_price");
const proContainer = document.querySelector(".pro_content");
const cartEmpty = document.querySelector(".cart_empty");
//btns
const btnAddCart = document.querySelector(".add_cart");
const qty = document.querySelector(".qty_numbers");
const decr = document.querySelector(".decreament");
const increa = document.querySelector(".increament");
const trashCart = document.querySelector(".trash img");
//imgs
const thumImg = document.querySelectorAll(".img_small img");
const imgLarge = document.querySelector(".img_thumbnail img");
//modal
const modalEl = document.querySelector(".modal");
const closeModal = document.querySelector(".close_icon");
const nextImg = document.querySelector(".next img");
const prevImg = document.querySelector(".prev img");
const modalImgs = document.querySelectorAll(".img_small_modal img");
const modalLImg = document.querySelector(".m_img");
const priceOfProduct=document.querySelector(".normal_price")

// let proPrice = priceOfProduct.textContent;
let realProPrice=priceOfProduct.textContent;
realProPrice=realProPrice.replace("₹","");
realProPrice=realProPrice.replaceAll(",","");
// alert(realProPrice);
// let number=2299;
// alert(number.toLocaleString('en-IN'));
let proPrice= parseInt(realProPrice)
// alert(proPrice);
// alert(proPrice.toLocaleString('en-IN'))
// proPrice.toLocaleString('en-IN')
let totalQty = qty.innerHTML;
let totalPrice;
// shoping cart dispaly and hide
// cartIcon.addEventListener("click", () => {
//   cartbox.classList.toggle("displayBox");
// });
//btn cart to increament number
decr.addEventListener("click", () => {
  if (totalQty == 1) {
    totalQty == 1;
  } else {
    totalQty--;
  }
  totalPrice = proPrice * totalQty;
  totalPrice=totalPrice.toLocaleString('en-IN')
  normalPrice.textContent = "₹" + totalPrice;
  qty.textContent = totalQty;
});
//btn cart to increament number
increa.addEventListener("click", () => {
  totalQty++;
  totalPrice = proPrice * totalQty;
  totalPrice=totalPrice.toLocaleString('en-IN')
  normalPrice.textContent = "₹" + totalPrice;
  qty.textContent = totalQty;
});
//add to carts
btnAddCart.addEventListener("click", async() => {
  console.log('here started')
  let quantity=parseInt(qty.textContent)
  const productId=btnAddCart.dataset.id;
  const data={quantity:quantity}
  console.log('here')
  const response=await fetch(`/addCartFromProductDescription/${productId}`,{method:"POST",body:JSON.stringify(data),headers:{"Content-Type":"application/json"}});
  const message=await response.json();
  location.href='/cart';
  // qtyLable.style.display = "block";
  // qtyLable.innerHTML = totalQty;
  // proContainer.innerHTML = "";
  // let html = `<img src="/img/image-product-1-thumbnail.jpg" alt="" />
  // <div class="p_details">
  //   <p class="pro_txt">Fall Limited Edition Sneakers</p>
  //   <p class="price">
  //     $125.00 <span>x</span><span class="times">${totalQty}</span>
  //     $<span class="total">${totalPrice}</span>
  //   </p>
  // </div>
  // <div class="trash">
  //   <img src="/img/icon-delete.svg" alt="" class="trash_img" />
  // </div>`;
  // proContainer.insertAdjacentHTML("afterbegin", html);
  // cartEmpty.innerHTML = "";
  // document.querySelector(".trash_img").addEventListener("click", () => {
  //   cartEmpty.innerHTML = "Your cart is empty :)";
  //   proContainer.innerHTML = "";
  //   qtyLable.style.display = "none";
  // });
});
// display thumbnail img
thumImg.forEach((img, indx) => {
  indx++;
  img.addEventListener("click", (e) => {
    imgLarge.src = `/img/image-product-${indx}.jpg`;
    thumImg.forEach((thumb) => thumb.classList.remove("active"));
    img.classList.add("active");
  });
});
// display modal
imgLarge.addEventListener("click", () => {
  modalEl.style.display = "block";
});
// hide modal modal
closeModal.addEventListener("click", () => {
  modalEl.style.display = "none";
});
// display img in the modal
modalImgs.forEach((mImg, indx) => {
  indx++;
  mImg.addEventListener("click", (e) => {
    modalLImg.src = `/img/image-product-${indx}.jpg`;
    modalImgs.forEach((thuMImg) => thuMImg.classList.remove("active"));
    mImg.classList.add("active");
  });
});
