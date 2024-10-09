const heartButton=document.querySelectorAll('.heartClicked');
const addToCartContainer=document.querySelectorAll('.addToCartContainer')
// let likedCount=document.querySelector('.likedCount')

////
const crossButton=document.querySelectorAll('.crossButton')

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
            location.href=`/deleteProductFromLikedItems/${id}`;
        swal.fire(
          'Deleted!',
          'Your Product has been Removed Successfully.',
          'success',
        )
        }    
    });
}
///
heartButton.forEach(e=>{
    let id=e.dataset.id
    e.addEventListener('click',heartEventListener.bind(this,id))
})

async function heartEventListener(id)
{
    const response=await fetch(`/heart/${id}`)
    const heartLikedOrDisliked=await response.json();
    console.log(heartLikedOrDisliked.message);
        if(heartLikedOrDisliked.message=='disAppear'){
            let i=0;
            let x=likedCount.textContent;
            let newX=parseInt(x)-1;
            likedCount.textContent=newX;

            heartButton.forEach(e=>{
               if(e.dataset.id==id){
                    addToCartContainer[i].lastElementChild.remove();
                    heartButton[i].innerHTML=`<i class="fa fa-heart-o heart"></i>`;        
            }
                i++;
            })

    }
    else if(heartLikedOrDisliked.message=='Appear'){
        const newDiv=document.createElement('div')
        const newPara=document.createElement('p');
        newPara.classList.add("heartWishList");
        newPara.innerHTML=`the product is already in the wishlist!<a href="/heart">Browse Wishlist</a>`;
        newDiv.append(newPara)
        let i=0;
        let x=likedCount.textContent;
        let newX=parseInt(x)+1;
        likedCount.textContent=newX;

        heartButton.forEach(e=>{
           if(e.dataset.id==id){
                addToCartContainer[i].append(newDiv);
                heartButton[i].innerHTML=`<i class="fa fa-heart" aria-hidden="true"></i>`        
            }
            i++;
        })

    }
}