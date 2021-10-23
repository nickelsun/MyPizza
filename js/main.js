'use strict';
import Swiper from 'https://unpkg.com/swiper@7/swiper-bundle.esm.browser.min.js'

const RED_COLOR = '#ff0000';

// Slider
const optionSlider = {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'coverflow',
  grabCursor: true,
  // cubeEffect: {
  //   shadow: false
  // },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev',
  // },
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  }
}

const swiper = new Swiper('.swiper-container', optionSlider);

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');


let login = localStorage.getItem('gloDelivery');

const cart = JSON.parse(localStorage.getItem(`gloDelivery_${login}`)) || [];

function saveCart() {
  localStorage.setItem(`gloDelivery_${login}`, JSON.stringify(cart));
}

function downloadCart() {
  if(localStorage.getItem(`gloDelivery_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`gloDelivery_${login}`));
    cart.push(...data);
  }
}

const getData = async function(url) {
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус  ошибки ${response.status}!`);
  }
  return await response.json();
}

function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{0,20}$/;
  return regName.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  if(modalAuth.classList.contains('is-open')) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function authorized() {

  function logOut() {
    login = null;
    cart.length = 0;
    localStorage.removeItem('gloDelivery');
    checkAuth();

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);

  }

  console.log('authorized');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('not authorized');

  function logIn(){
    event.preventDefault();
    
    if(validName(loginInput.value)){
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      downloadCart();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn)
      logInForm.reset();
      checkAuth();
    
    } else {
      // alert("Type in your login!");
      loginInput.style.borderColor = RED_COLOR;
      loginInput.value = '';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn)
  modalAuth.addEventListener('click', function(event) {
    if(event.target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  })
}

function checkAuth() {
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant({ 
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery }) {

    const cardRestaurant = document.createElement('a');
    cardRestaurant.className = 'card card-restaurant';
    cardRestaurant.products = products;
    cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery} мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

function createCardGood({ description, image, name, price, id }) {

  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="${name}" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <p class="ingredients">${description}</p>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);

  console.log(card);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;

  if(login) {
    const restaurant = target.closest(".card-restaurant");

    if(restaurant) {
      cardsMenu.textContent = '';

      containerPromo.classList.add('hide');
      swiper.destroy(false);
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      const { name, kitchen, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function(data){
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if(buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = card.id;

    const food = cart.find( item => item.id === id );

    if (food) {
      food.count ++;
    } else {
      cart.push({ id, title, cost, count: 1 });
    }
  }
  saveCart();
}

function renderCart() {
  modalBody.textContent = '';

  cart.forEach(({ id, title, cost, count }) => {
    const itemCart = `
        <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id="${id}">-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id="${id}">+</button>
					</div>
				</div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce( (result, item) => result + parseFloat(item.cost)*item.count, 0);
  modalPrice.textContent = totalPrice + ' ₽';
}

function changeCount(event) {
  const target = event.target;

  if(target.classList.contains('counter-button')) {
    const food = cart.find(item => item.id === target.dataset.id);
    if(target.classList.contains('counter-minus')) { 
      food.count--;
      if(food.count === 0) {
        cart.splice( cart.indexOf(food), 1 );
      }
    }
    if(target.classList.contains('counter-plus' )) {
      food.count++
    }
    renderCart();
    saveCart();
  }
}

function init() {

  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant);
  });
  
  cartButton.addEventListener("click", () => {
    renderCart();
    toggleModal();
  });

buttonClearCart.addEventListener('click', () => {
  cart.length = 0;
  renderCart();
})

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);
  
  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    swiper.init(optionSlider);
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });
  
  checkAuth();

  inputSearch.addEventListener('keypress', function(event) {
    if(event.charCode === 13) {

      const value = event.target.value.trim();
      if(!value) {
        event.target.style.backgroundColor = RED_COLOR;
        event.target.value = '';
        setTimeout(() => event.target.style.backgroundColor = '', 1000);
        return;
      }

      getData('./db/partners.json').then(function(data){
        return data.map(function(partner) {
          return partner.products;
        });
      })
      .then(function(linksProduct) {
        cardsMenu.textContent = '';
        linksProduct.forEach(function(link) {
          getData(`./db/${link}`)
            .then(function(data) {

              const resultSearch = data.filter( item => {
                const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              })

              containerPromo.classList.add('hide');
              swiper.destroy(false);
              restaurants.classList.add('hide');
              menu.classList.remove('hide');
        
              restaurantTitle.textContent = 'Результат поиска';
              restaurantRating.textContent = '';
              restaurantPrice.textContent = '';
              restaurantCategory.textContent = 'Разная кухня';

              resultSearch.forEach(createCardGood);
            })  
        });
      })
    }
  })
}

init();

