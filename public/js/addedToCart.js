const eye=document.querySelectorAll('.eye')
let likedCount=document.querySelector('.likedCount')
let addToCartCount=document.querySelector('.addToCartCount')
const addedToCartButton=document.querySelectorAll('.addedToCartOrNot');
addedToCartButton.forEach(e=>{
    let id=e.dataset.id
    e.addEventListener('click',addOrRemoveCart.bind(this,id))
})
async function addOrRemoveCart(id)
{
    const response=await fetch(`/addToCart/${id}`)
    const productAddedOrNot=await response.json();
        if(productAddedOrNot.message=='disAppear'){
            let i=0;
            let x=addToCartCount.textContent;
            let newX=parseInt(x)-1;
            addToCartCount.textContent=newX;
    
            console.log('disappear')
            eye.forEach(e=>{
               if(e.dataset.id==id){
                    console.log(i)
                    eye[i].classList.add('hide');
                    addedToCartButton[i].innerHTML=`<i class="fa fa-shopping-basket heart" aria-hidden="true"></i>Add To Cart`;        }
                i++;
            })
    }
    else if(productAddedOrNot.message=='Appear'){
        let i=0;
        let x=addToCartCount.textContent;
        let newX=parseInt(x)+1;
        addToCartCount.textContent=newX;
        console.log('appear')
        eye.forEach(e=>{
            if(e.dataset.id==id){
                console.log(i)
            eye[i].classList.remove("hide");
            addedToCartButton[i].innerHTML=`Add To Cart<i class="fa fa-check" aria-hidden="true"></i>`; 
        }
            i++;
        })
    }
}
