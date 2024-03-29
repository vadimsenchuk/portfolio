window.addEventListener("DOMContentLoaded", () => {
  "use strict";
  let tab = document.querySelectorAll(".info-header-tab"),
    info = document.querySelector(".info-header"),
    tabContent = document.querySelectorAll(".info-tabcontent");

  function hideTabContent(a) {
    for (let i = a; i < tabContent.length; i++) {
      tabContent[i].classList.remove("show");
      tabContent[i].classList.add("hide");
    }
  }
  hideTabContent(1);

  function showTabContent(b) {
    if (tabContent[b].classList.contains("hide")) {
      tabContent[b].classList.add("show");
      tabContent[b].classList.remove("hide");
    }
  }

  info.addEventListener("click", (event) => {
    let target = event.target;
    if (target && target.classList.contains("info-header-tab")) {
      for (let i = 0; i < tab.length; i++) {
        if (target == tab[i]) {
          hideTabContent(0);
          showTabContent(i);
          break;
        }
      }
    }
  });

  // Timer

  let deadline = "2022-12-31";

  function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date()),
      seconds = Math.floor((t / 1000) % 60),
      minutes = Math.floor((t / 1000 / 60) % 60),
      hours = Math.floor(t / (1000 * 60 * 60));

    return {
      total: t,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function setClock(id, endtime) {
    let timer = document.getElementById(id),
      hours = timer.querySelector(".hours"),
      minutes = timer.querySelector(".minutes"),
      seconds = timer.querySelector(".seconds"),
      timeInterval = setInterval(updateClock, 1000);

    function updateClock() {
      let t = getTimeRemaining(endtime);
      hours.textContent = addZero(t.hours);
      minutes.textContent = addZero(t.minutes);
      seconds.textContent = addZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";
      }
    }
  }
  setClock("timer", deadline);

  // Modal

  let more = document.querySelector(".more"),
    overlay = document.querySelector(".overlay"),
    close = document.querySelector(".popup-close"),
    descriptionBtns = document.querySelectorAll(".description-btn");

  document.body.addEventListener("click", (event) => {
    let target = event.target;

    if (target == more || target.classList.contains("description-btn")) {
      overlay.style.display = "block";
      target.classList.add("more-splash");
      document.body.style.overflow = "hidden";
    }
  });
  close.addEventListener("click", () => {
    overlay.style.display = "none";
    more.classList.remove("more-splash");
    descriptionBtns.forEach(function (btn) {
      btn.classList.remove("more-splash");
    });
    document.body.style.overflow = "";
  });

  // Form

  let message = {
    loading: "Загрузка",
    success: "Спасибо! Скоро мы с Вами свяжимся",
    failure: "Что-то пошло не так...",
  };

  let form = document.querySelector(".main-form"),
    input = form.getElementsByTagName("input"),
    statusMessage = document.createElement("div");

  statusMessage.classList.add("status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    form.appendChild(statusMessage);

    let request = new XMLHttpRequest();
    request.open("POST", "server.php");
    // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    let formData = new FormData(form);

    let obj = {};
    formData.forEach(function (value, key) {
      obj[key] = value;
    });
    let json = JSON.stringify(obj);

    request.send(json);

    request.addEventListener("readystatechange", function () {
      if (request.readyState < 4) {
        statusMessage.textContent = message.loading;
      } else if (request.readyState === 4 && request.status == 200) {
        statusMessage.textContent = message.success;
      } else {
        statusMessage.textContent = message.failure;
      }
    });
    for (let i = 0; i < input.length; i++) {
      input[i].value = "";
    }
  });

  // Slider

  const slides = document.querySelectorAll(".slider-item");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  const dotsWrap = document.querySelector(".slider-dots");
  const dots = document.querySelectorAll(".dot");
  let slideIndex = 1;

  showSlides(slideIndex);

  function showSlides(n) {
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    slides.forEach((slide) => (slide.style.display = "none"));
    dots.forEach((dot) => dot.classList.remove("dot-active"));

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("dot-active");
  }

  function changeSlide(n) {
    showSlides((slideIndex += n));
  }
  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  prev.addEventListener("click", function () {
    changeSlide(-1);
  });
  next.addEventListener("click", function () {
    changeSlide(1);
  });
  dotsWrap.addEventListener("click", function (e) {
    for (let i = 0; i < dots.length + 1; i++) {
      if (e.target.classList.contains("dot") && e.target == dots[i - 1]) {
        currentSlide(i);
      }
    }
  });
});

function addZero(numb) {
  let text = numb + "";

  if (text.length == 1) {
    text = "0" + text;
  }
  return text;
}
