'use strict'

const $content = document.querySelector('#content');
const $index = $content.innerHTML;
const $divWrap = document.createElement('div');
$divWrap.classList.add('modal-wrap');
let films = [];

if (localStorage.length != 0) {
    getStorage();
};

window.addEventListener('hashchange', routing);
routing();
closeModal();

document.querySelector('#add-new').addEventListener('click', () => {
    fetch('./add-new.html')
        .then(res => res.text())
        .then(viewModal);
});

document.forms.search.addEventListener('submit', (e) => {
    e.preventDefault();

    search();
});

document.body.addEventListener('click', ({target: el}) => {
    if (el.classList.contains('btn-remove-field') || el.closest('.btn-remove-field')) {
        el.closest('.form-group.row').remove();
    };

    if (el.classList.contains('btn-edit') || el.closest('.btn-edit')) {
        editModal(el);
    };

    if (el.classList.contains('btn-delete') || el.closest('.btn-delete')) {
        removeFilm(el);
    };

    if (el.classList.contains('likeCount') || el.closest('.likeCount')) {
        countLike(el);
    };

    if (el.classList.contains('dislikeCount') || el.closest('.dislikeCount')) {
        countOfDislike(el);
    };
});