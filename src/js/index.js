import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './pixabay.js';
import { createMarkup } from './createmarkup.js';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.js-searh-form'),
  searchBtn: document.querySelector('.search-btn'),
  list: document.querySelector('.gallery'),
  anchor: document.querySelector('.target-element'),
};

const { form, searchBtn, list, input, anchor } = refs;

const observer = new IntersectionObserver(
  (entries, observer) => {
    if (entries[0].isIntersecting) {
      loadMoreData();
    }
  },
  {
    root: null,
    rootMargin: '300px',
    threshold: 1,
  }
);

const pixabayAPI = new PixabayAPI(40);

form.addEventListener('submit', handleSubmit);
async function handleSubmit(event) {
  event.preventDefault();
  pixabayAPI.page = 1;
  const searchQuery = event.target.elements['searchQuery'].value.trim();
  pixabayAPI.q = searchQuery;
  if (!searchQuery) {
    list.innerHTML = '';
    return Notify.failure('Sorry! Your query is empty. Please, try again.');
  }

  try {
    const response = await pixabayAPI.getPhotos();

    if (response.data.total) {
      Notify.success(` we find ${Math.ceil(response.data.total / 40)} page`);
    } else {
      Notify.failure(`Sorry! We didn't find your query. Please, try again.`);
    }

    list.innerHTML = createMarkup(response.data.hits);

    if (response.data.hits.length === 0) {
      list.innerHTML = '';

      observer.unobserve(anchor);
    }

    if (response.data.total > pixabayAPI.perPage) {
      observer.observe(anchor);
    }
  } catch (error) {
    console.log(error);
  }
}
async function loadMoreData() {
  try {
    pixabayAPI.page += 1;
    if (pixabayAPI.page > 1) {
      const response = await pixabayAPI.getPhotos();
      list.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));

      if (Math.ceil(response.data.total / 40) === pixabayAPI.page) {
        observer.unobserve(anchor);
        return Notify.success('The end of search.');
      }
    }
  } catch (error) {
    console.log(error);
  }
}