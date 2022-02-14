
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const $tvShowsList = document.querySelector('.tv-shows__list');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const menu = document.querySelector('.menu');


class DBService {

  constructor(){
    this.SERVER = 'https://api.themoviedb.org/3';
    this.API_KEY = '2dd22b687a0ad86506fb9e3b98ddd631';
    }
  
  getData = async (url) => {
        
    const res = await fetch(url);
    if (res.ok) {
        return res.json();
    } else {
        console.log(`Не удалось получить данные по адресу ${url}`);
    }
    
  }

  getTvShow = (id) => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);

  getSearchResult = (query) => {
     this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
    return this.getData(this.temp);
    }
    getToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);

    getWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
    getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);

    getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);

};

const dbservice = new DBService();


searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  console.log(value);
  if(value) {
    dbservice.getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = '';
});


const renderCard = (res) =>{

  $tvShowsList.textContent = '';

  res.results.forEach(item => {

    const {
        name: title,
        poster_path: poster,
        vote_average: vote,
        id
        } = item;


    const card = document.createElement('li');
    card.idTV = id;
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" id="${id}" class="tv-card">
      <span class="tv-card__vote">${vote}</span>        
      <img class="tv-card__img"
            src="${IMG_URL + poster}"
            alt=${title}>
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    $tvShowsList.insertAdjacentElement('afterbegin' ,card);
})

};

menu.addEventListener('click', event =>{
  event.preventDefault();
  const target = event.target;

      if (target.closest('#top-rated')) {
          dbservice.getTopRated().then((res) => renderCard(res));
      }
      if (target.closest('#popular')) {
          dbservice.getPopular().then((res) => renderCard(res));
      }
      if (target.closest('#week')) {
        dbservice.getWeek().then((res) => renderCard(res));
    }
    if (target.closest('#today')) {
        dbservice.getToday().then((res) => renderCard(res));

    }
});






