import ApiService from './js/apiService';
import renderService from './js/renderService';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const api = new ApiService();
const renderMaker = new renderService();

const refs = {
  form: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  fetchDataBtn: document.querySelector('[data-load="getData"]'),
  loader: document.querySelector('[data-loader]'),
};

refs.form.addEventListener('submit', renderImage);

function onScroll() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  const scrolled = window.scrollY;

  const threshold = height - screenHeight / 4;

  const position = scrolled + screenHeight;

  if (position >= threshold) {
    loadMore();
  }
}

function renderImage(e) {
  e.preventDefault();

  api.resetPage();

  api.searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (api.searchQuery === '') {
    return Notiflix.Notify.warning('please enter more query to find!');
  }

  renderMaker.clearGallery();
  toggleLoader();
  api.fetchImages().then(data => {
    if (data.totalHits === 0) {
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    toggleLoader();
    renderMaker.renderImages(data.hits);
    api.incrementPage();

    window.addEventListener('scroll', debounce(onScroll, 500));
  });
}

function loadMore() {
  if (api.totalHits < 0) {
    return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }

  toggleLoader();
  api.fetchImages().then(data => {
    toggleLoader();
    renderMaker.renderImages(data.hits);
    api.incrementPage();
  });
}

function toggleLoader() {
  refs.loader.classList.toggle('.is-hidden');
}
