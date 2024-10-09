
const menuDisplayer=document.getElementById('menuDisplayer')
const checkbox=document.getElementById('checkbox');
// const menuShow=document.querySelector('.menuShow');
// const menuHide=document.querySelector('.menuHide');
const bars=document.querySelector('.bars');
const slider=document.querySelector('.slider')
bars.addEventListener('click',viewSubMenu)

function viewSubMenu(){
    if(checkbox.checked==false)
        {
            menuDisplayer.classList.remove="menuHide"
            menuDisplayer.classList.add="menuShow";
            checkbox.checked=true;
            slider.style.display='block';
            menuDisplayer.style.height='100%'
        }
    else
    {
        checkbox.checked=false;
        slider.style.display='none';
        menuDisplayer.style.height='3rem'

    }
}