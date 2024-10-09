const container=document.getElementById('carouselExampleIndicators');
const indicators=document.querySelector('ol.carousel-indicators')
const carouselControllerPrevious=document.querySelector('.carousel-control-prev')
const carouselControllerNext=document.querySelector('.carousel-control-next')
container.addEventListener('pointerover',show);
container.addEventListener('pointerout',hide)


function show()
{
    carouselControllerNext.style.display='flex'
    carouselControllerPrevious.style.display='flex'
    indicators.style.display='flex';
}
function hide()
{
    carouselControllerNext.style.display='none'
    carouselControllerPrevious.style.display='none'
    indicators.style.display='none';
}

