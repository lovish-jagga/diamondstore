const crossButton=document.querySelectorAll('.crossButton')
const CartSubTotal=document.querySelector('.CartSubTotal')
const CartTotal=document.querySelector('.CartTotal')
const update=document.getElementById('update')
const originalPrize=document.querySelectorAll('.originalPrize');
const subTotalContainer=document.querySelectorAll('.subTotal');
const ProductQty=document.querySelectorAll('.ProductQty')
console.log(ProductQty)
let TotalCalculator=0;

update.addEventListener('click',updateButtonClicked)
ProductQty.forEach((e)=>{
    let id=e.dataset.id;
    e.addEventListener('input',updateCalled.bind(this,id));
})
crossButton.forEach((e)=>{
    const id=e.dataset.id;
    e.addEventListener('click',alert.bind(this,id))
})
function alert(id)
{
    swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#333333',
        cancelButtonColor: '#cd9d40',
        confirmButtonText: 'Yes, delete it!',
        background:'black',
        color:'white'
        }).then((result) => {
        if (result.isConfirmed) {
            location.href=`/deleteProductFromCart/${id}`;
        swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        }    
    });
}
let i=0;
originalPrize.forEach((e)=>{
    let prize=e.textContent;
    prize=prize.replace("₹","");
    prize=prize.replaceAll(",","");
    let quantity=ProductQty[i].value;
    let subTotal=prize * quantity;
    TotalCalculator=TotalCalculator+subTotal;
    subTotal=subTotal.toLocaleString('en-IN')
    console.log(TotalCalculator)
    subTotalContainer[i].innerHTML=`<div>₹ ${subTotal}</div>`
    CartSubTotal.innerHTML=`<div>₹ ${TotalCalculator.toLocaleString('en-IN')}</div>`
    CartTotal.innerHTML=`<div>₹ ${TotalCalculator.toLocaleString('en-IN')}</div>`
i++;    
}
);

async function updateQuantityStorer(quantity,productId){
    console.log('updateQuantityStorer called')
    console.log(productId)
    let response=await fetch(`/addToCart/${productId}`,{method:"POST",body:JSON.stringify({quantity:quantity}),headers:{"Content-Type":"application/json"}});
    await response.json()       
}
function prizeConverter(e,i,productId){
    let prize=e.textContent;
    prize=prize.replace("₹","");
    prize=prize.replaceAll(",","");
    let quantity=ProductQty[i].value;
    let subTotal=prize * quantity;
    TotalCalculator=TotalCalculator+subTotal;
    updateQuantityStorer(quantity,productId);
    subTotal=subTotal.toLocaleString('en-IN')
    subTotalContainer[i].innerHTML=`<div>₹ ${subTotal}</div>`
    CartSubTotal.innerHTML=`<div>₹ ${TotalCalculator.toLocaleString('en-IN')}</div>`
    CartTotal.innerHTML=`<div>₹ ${TotalCalculator.toLocaleString('en-IN')}</div>`

}

function updateCalled(id)
{
    update.classList.remove('disabled');
    update.classList.add('enabled');
   console.log('update called')
}
async function updateButtonClicked(){
    TotalCalculator=0;
    let i=0;
    originalPrize.forEach(async(e)=>{
    let productId=e.dataset.id;
    console.log(productId);
    prizeConverter(e,i,productId);
    i++;
});
    update.classList.remove('enabled');
    update.classList.add('disabled');
}


