'use strict'

function routing() {
    if (location.hash) {
        movie();
    };
    
    if (!location.hash){
        $content.innerHTML = $index;
    }
    
    if (location.hash === '#list') {
        list()
    };

    if (location.hash === '#search') {
        search();
    }
};

function list() {
    fetch('./card.html')
            .then(res => res.text())
            .then(getListOfFilms);
};

function movie() {
    fetch('./movie.html')
            .then(res => res.text())
            .then(getMovie);
};

function search() {
    location.replace('#search');
    const query = document.forms.search.query;
    if (query.value) {
        const list = films.filter(e => e.title.toLowerCase().includes(query.value.toLowerCase()));

        fetch('./card.html')
            .then(res => res.text())
            .then(tpl => {
                const template = _.template(tpl);
                const searchList = list.reduce((a, b) => a + template(b), '');
                $content.innerHTML = searchList;
                query.value = '';
            });
    };
};

function viewModal(data) {
    $divWrap.innerHTML = data;
    document.body.appendChild($divWrap);
    $('#modal').modal('show');
    document.forms.modalForm.poster.addEventListener('change', encodeImageFileAsURL);
    addField();
    closeModal();
    saveModal();
};

function removeFilm(el) {
    const remove = confirm('Вы хотите удалить фильм?');

    if (remove) {
        const $wrapDiv = el.closest('.card.mt-3');
        const filmId = $wrapDiv.id;
        const index = films.findIndex(e => e.idFilm === filmId);
        films.splice(index, 1);
    
        $wrapDiv.remove();
        saveStorage();
    };
};

function addField() {
    let count = 0;
    document.querySelector('.btn-add-field').addEventListener('click', () => {
        const $newField = document.createElement('div');
        $newField.classList.add('form-group', 'row', 'addField');
        $newField.innerHTML = `<div class="col-sm-5">
                                    <input type="text" class="form-control position" name="position${count}" placeholder="Должность">
                                </div>
                                <div class="col-sm-5">
                                    <input type="text" class="form-control creatorName" name="creatorName${count}" placeholder="Имя">
                                </div>
                                <div class="col-sm-2">
                                    <button class="btn btn-danger btn-sm btn-remove-field" type="button"><svg class="octicon octicon-x" viewBox="0 0 14 18" version="1.1" width="14" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg></button>
                                </div>`;
        document.querySelector('fieldset').appendChild($newField);
        count++
    });
};

function saveModal() {
    document.querySelector('#modalForm').addEventListener('submit', (e) => {
        e.preventDefault();

        saveContent();
        closeModal();
        $('#modal').on('hidden.bs.modal', () => {
            saveStorage();
            list();
        });
    });
};

function editModal(el) {
    const $wrapDiv = el.closest('.card.mt-3');
    const filmId = $wrapDiv.id;
    const index = films.findIndex(e => e.idFilm === filmId);
    fetch('./add-new.html')
        .then(res => res.text())
        .then(data => {
            $divWrap.innerHTML = data;
            document.body.appendChild($divWrap);
            $('#modal').modal('show');
            
            addField();
            closeModal();
            $('#modal').on('shown.bs.modal', () => {
                const $form = document.forms.modalForm;
                let info = films[index];
                changeForm($form, info);
                
                document.querySelector('#modalForm').addEventListener('submit', (e) => {
                    e.preventDefault();

                    editContent(info, $form);
                    closeModal();
                });
            });
            $('#modal').on('hidden.bs.modal', () => {
                saveStorage();
                list();
            });
        });
};

function closeModal() {
    $('#modal').modal('hide');
    $('#modal').on('hidden.bs.modal', () => {
        $divWrap.remove();
    });
};

function getListOfFilms(tpl) {
    const template = _.template(tpl);
    const list = films.reduce((a, b) => a + template(b), '');
    $content.innerHTML = list;
};

function getMovie(tpl) {
    const template = _.template(tpl);
    const arr = films.filter(e => e.idFilm === location.hash);
    const movie = arr.reduce((a, b) => a + template(b), '');
    $content.innerHTML = movie;
};

function saveContent() {
    let $form = document.forms.modalForm.elements;
    let film = new Movie($form);
    film.poster = document.body.querySelector('.previewImage').src;
    document.querySelectorAll('.addField').forEach(e => {
        film.creators.push({
            position: e.querySelector('.col-sm-5 .position').value,
            name: e.querySelector('.col-sm-5 .creatorName').value
        });
    });
    films.push(film);
};

function editContent(film, form) {
    film.title = form.title.value;
    film.originalTitle = form.originalTitle.value;
    film.poster = document.body.querySelector('.previewImage').src;
    film.year = form.year.value;
    film.country = form.country.value;
    film.slogan = form.slogan.value;
    film.director = form.director.value;
    film.creators = [];
    document.querySelectorAll('.addField').forEach(e => {
        film.creators.push({
            position: e.querySelector('.col-sm-5 .position').value,
            name: e.querySelector('.col-sm-5 .creatorName').value
        });
    });
    film.description = form.description.value;
    film.rate = form.rate.value;
    film.cast = form.cast.value.split(', ')
};

function changeForm(form, film) {
    form.title.value = film.title;
    form.originalTitle.value = film.originalTitle;
    document.body.querySelector('.previewImage').src = film.poster;
    if (document.body.querySelector('.previewImage').src) {
        document.body.querySelector('#loadImage').value = '.';
    } else {
        document.body.querySelector('#loadImage').value = '';
    }
    form.year.value = film.year;
    form.country.value = film.country;
    form.slogan.value = film.slogan;
    form.director.value = film.director;
    form.cast.value = film.cast.join(', ');
    form.rate.value = film.rate;
    form.description.value = film.description;
    addedFields(film);
};

function addedFields(film) {
    let count = 0;
    if (film.creators.length) {
        for (let i = 0; i < film.creators.length; i++) {
            const $newField = document.createElement('div');
            $newField.classList.add('form-group', 'row', 'addField');
            $newField.innerHTML = `<div class="col-sm-5">
                                    <input type="text" class="form-control position" name="position${count}" placeholder="Должность" value="${film.creators[i].position}">
                                </div>
                                <div class="col-sm-5">
                                    <input type="text" class="form-control creatorName" name="creatorName${count}" placeholder="Имя" value="${film.creators[i].name}">
                                </div>
                                <div class="col-sm-2">
                                    <button class="btn btn-danger btn-sm btn-remove-field" type="button"><svg class="octicon octicon-x" viewBox="0 0 14 18" version="1.1" width="14" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg></button>
                                </div>`;
            document.querySelector('fieldset').appendChild($newField);;
        };
    };
};

function saveStorage() {
    localStorage.setItem('films', JSON.stringify(films));
};

function getStorage() {
    films = JSON.parse(localStorage.getItem('films'));
};

function encodeImageFileAsURL() {
    let filesSelected = document.getElementById("upload-poster").files;
    if (filesSelected.length > 0) {
        let fileToLoad = filesSelected[0];
        let image = document.body.querySelector('.previewImage')
        let fileReader = new FileReader();

        fileReader.onload = function(element) {
            image.src = element.target.result;
            if (image.src) {
                document.body.querySelector('#loadImage').value = '.';
            }

        };
        fileReader.readAsDataURL(fileToLoad);
    };
};

function countLike(el) {
    ++el.closest('.likeCount').dataset.count;
        let count = el.closest('.likeCount').dataset.count;
        const idFilm = el.closest('.movie-details').id;
        films.forEach(e => {
            if (e.idFilm === idFilm) {
                e.likeCount = count;
            };
        });
        saveStorage();
};

function countOfDislike(el) {
    ++el.closest('.dislikeCount').dataset.count;
    let count = el.closest('.dislikeCount').dataset.count;
    const idFilm = el.closest('.movie-details').id;
    films.forEach(e => {
        if (e.idFilm === idFilm) {
            e.dislikeCount = count;
        };
    });
    saveStorage();
};

class Movie {
    constructor(form) {
        this.idFilm = `#list-${Date.now()}`,
        this.title = form.title.value,
        this.originalTitle = form.originalTitle.value,
        this.poster = '',
        this.year = form.year.value,
        this.country = form.country.value,
        this.slogan = form.slogan.value,
        this.director = form.director.value,
        this.creators = [],
        this.description = form.description.value,
        this.rate = form.rate.value,
        this.cast = form.cast.value.split(',')
        this.likeCount = 0;
        this.dislikeCount = 0;
    };
};