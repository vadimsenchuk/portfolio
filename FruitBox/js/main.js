'use srict'

//Scrooling
$('.header__button--primary').click(function(e) {
    e.preventDefault();    
    let target = $(this).attr("href");
    
    $('body, html').animate({ scrollTop: $(target).offset().top}, 500);
    
    return false;
});

$('.header__button--info').click(function(e) {
    e.preventDefault();
    let target = $(this).attr("href");
    
    $('body, html').animate({ scrollTop: $(target).offset().top}, 1000);
    
    return false;
});

//popup

$('#chooseBox').on('click', '.chooseBox__button--info', function (e) {
    e.preventDefault();
    let parent = $(this).parent();
    
    $('.chooseBox__popupWrap', parent).fadeIn(500);
    $('.chooseBox__popupBox', parent).removeClass('transform-out').addClass('transform-in');
});

$('.chooseBox__popupWrap').click((e) => {
    e.preventDefault();
    
    if ($(e.target).hasClass('chooseBox__popupWrap') || $(e.target).hasClass('popup-close')) {
        $('.chooseBox__popupWrap').fadeOut(500);
        $('.chooseBox__popupBox').removeClass('transform-in').addClass('transform-out');
    };
});

//basket 
let count = 0;
let sum = 0;
let price = 0;

document.querySelectorAll('.chooseBox__button--primary').forEach(function(button) {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        let el = e.target;
    
        count++;
        document.querySelector('.header__basket').style.transform = "scale(1)";
        document.querySelector('.header__amount').textContent = count;
        price = +(el.parentElement.querySelector('.card__price').textContent.slice(0, -4).replace(" ", ""));
        sum += price;
        console.log(sum);
    });
});