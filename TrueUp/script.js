'use strict'

document.querySelector('.button.header__button').addEventListener('click', function(e) {
    e.preventDefault();
});

document.querySelector('.answer__boxes').addEventListener('click', function(e) {
    var el = e.target;

    if (el.classList.contains('box__trigon') || el.classList.contains('box__quest')) {
        el.parentElement.querySelector('.box__text').classList.toggle('box__text--hidden');
        el.parentElement.querySelector('.box__trigon').classList.toggle('box__trigon--active');
    };
});