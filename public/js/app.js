// hidden form in results page 

$('.form').hide();

$('.show').on('click',function(){

$(this).siblings().toggle();

})

////////////////////////////

// hidden form in details page 

$('.formdet').hide();

$('.showdet').on('click',function(){

$(this).siblings().toggle();

})