import axios from "axios";
import Notiflix from 'notiflix';
const API_KEY = "40348262-2107765f6b36d63fd98d1181e";
const BASE_URL = 'https://pixabay.com/api/';
// axios.defaults.headers.common["x-api-key"] = API_KEY;
const elements = {
    form: document.querySelector('.search-form'),
    button: document.querySelector('.searchBtn'),
    inputElement: document.querySelector('input[name="searchQuery"]'),
    cardsList: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
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
                console.log(data);
                elements.cardsList.innerHTML = createMarcup(data.hits);
            }
        })
        .catch((err) => console.log(err));
}

function fetchCards(searchQuery) {
    const params = {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: '1',
        per_page: '40'
    };
    
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
// function fetchCards( page=1) {
//   const BASE_URL = 'https://pixabay.com/api/';
//     const API_KEY = '40348262-2107765f6b36d63fd98d1181e';
//     const params = new URLSearchParams({
//         key: API_KEY,
//         q: searchQuery,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true
//     });
//     return axios.get(`${BASE_URL}?${params}`)
//            .then(resp => {
//             return resp.data;
//         });
// }
// fetchCards(page)
//   .then((data => {
//     elements.cardsList.insertAdjacentHTML('afterbegin', createMarcup(data.hits))
//     if (data.page < data.totalHits) {
//     elements.loadMoreBtn.classList.remove('load-more-hidden')
//   }
// }))
// .catch((err)=>console.log(err))

















