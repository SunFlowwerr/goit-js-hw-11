import axios from 'axios';
import Notiflix from 'notiflix';

const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  headers: { 'Content-Type': 'application/json' },
});

export default class ApiService {
  _apiKey = '35432410-5608666ea6b12176b87f6dc6c';
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.totalHits = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get hits() {
    return this.totalHits;
  }

  set hits(newValue) {
    this.totalHits = newValue;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  decrementTotalHits() {
    this.totalHits -= this.page * this.per_page;
  }

  async fetchImages() {
    console.log(this);
    return await instance
      .get(
        `?key=${this._apiKey}&q=${this.searchQuery}&page=${this.page}&per_page=${this.per_page}&image_type=photo&orientation=horizontal&safesearch=true`,
      )
      .then(response => {
        this.hits = response.data.totalHits;
        this.decrementTotalHits();
        return response.data;
      })
      .catch(error => Notiflix.Notify.warning(error));
  }
}
