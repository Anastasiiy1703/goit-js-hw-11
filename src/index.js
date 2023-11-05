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

const fetchCards = async (searchQuery, page = 1) => {
    const params = {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: '40',
    };

    try {
        const resp = await axios.get(BASE_URL, { params });
        return resp.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const createMarcup = (arr) => {
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
};

elements.form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const { searchQuery } = evt.currentTarget.elements;
    try {
        const data = await fetchCards(searchQuery.value);
        if (data.hits.length === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.',
                { timeout: 5000, userIcon: false }
            );
        } else {
            elements.cardsList.innerHTML = createMarcup(data.hits);
            elements.loadMoreBtn.classList.remove('load-more-hidden');
        }
    } catch (error) {
        console.error(error);
    }
});

let currentPage = 0; 
elements.loadMoreBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    const searchQuery = elements.inputElement.value;
    currentPage++;
    try {
        const data = await fetchCards(searchQuery, currentPage + 1); 
        if (data.hits.length === 0) {
            elements.loadMoreBtn.classList.add('load-more-hidden');
            return;
        }
        const newMarkup = createMarcup(data.hits);
        elements.cardsList.insertAdjacentHTML('beforeend', newMarkup);
        if (currentPage * 40 >= data.totalHits) {
            elements.loadMoreBtn.classList.remove('load-more-hidden');
        }
        if (!(currentPage * 40 >= data.totalHits)) {
            elements.loadMoreBtn.classList.add('load-more-hidden');
            Notiflix.Notify.failure(
                "We're sorry, but you've reached the end of search results.",
                { timeout: 5000, userIcon: false }
            );
        }
    } catch (error) {
        console.error(error);
    }
});












