import axios from "axios";
import Notiflix from 'notiflix';
const API_KEY = "40348262-2107765f6b36d63fd98d1181e";
const BASE_URL = 'https://pixabay.com/api/';

const elements = {
    form: document.querySelector('.search-form'),
    button: document.querySelector('.searchBtn'),
    inputElement: document.querySelector('input[name="searchQuery"]'),
    cardsList: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

function fetchCards(searchQuery, page=1) {
    const params = {
        params: {
            key: API_KEY,
            q: searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: page,
            per_page: '40',
        }};
    
    return axios.get(`${BASE_URL}/?`, params)
        .then(resp => {
            return resp.data;
        });
}

function createMarcup(arr) {
    return arr.map(({downloads, comments, views, likes, tags, largeImageURL, webformatURL}) => `
    <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <b>Likes ${likes}</b>
            </p>
            <p class="info-item">
                <b>Views ${views}</b>
            </p>
            <p class="info-item">
                <b>Comments ${comments}</b>
            </p>
            <p class="info-item">
                <b>Downloads ${downloads}</b>
            </p>
        </div>
    </div>
    `).join('');
}

elements.form.addEventListener('submit', handlerForm);
function handlerForm(evt) {
    evt.preventDefault();
    const { searchQuery } = evt.currentTarget.elements;
    fetchCards(searchQuery.value)
        .then((data) => {
            if (data.hits.length === 0) {
                Notiflix.Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.',
                    { timeout: 5000, userIcon: false }
                );
            } else {
                elements.cardsList.innerHTML = createMarcup(data.hits);
                elements.loadMoreBtn.classList.remove('load-more-hidden');
            }
        })
        .catch((err) => console.log(err));
}

let currentPage = 1;
elements.loadMoreBtn.addEventListener('click', loadMoreCards);
function loadMoreCards(evt) {
    evt.preventDefault();
    const searchQuery = elements.inputElement.value;
    currentPage++;
    fetchCards(searchQuery, currentPage)
        .then((data) => {
            if (data.hits.length === 0) {
                elements.loadMoreBtn.classList.add('load-more-hidden');
                return;
            }
            const newMarkup = createMarcup(data.hits);
            elements.cardsList.insertAdjacentHTML('beforeend', newMarkup);
            if (currentPage * 40 >= data.totalHits) {
                elements.loadMoreBtn.classList.remove('load-more-hidden');
            }
            if (!currentPage * 40 >= data.totalHits) {
                elements.loadMoreBtn.classList.add('load-more-hidden'); 
                Notiflix.Notify.failure(
                    "We're sorry, but you've reached the end of search results.",
                    { timeout: 5000, userIcon: false }
                );
            }
        })
        .catch((err) => console.log(err));
}




// fetchCards(searchQuery, page)
//   .then(data => {
//     elements.cardsList.insertAdjacentHTML('afterbegin', createMarcup(data.hits));
//     if (data.page < data.totalHits) {
//       elements.loadMoreBtn.classList.remove('load-more-hidden');
//     }
//   })
//   .catch(err => console.log(err));









