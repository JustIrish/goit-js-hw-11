import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPictures } from './fetchPictures';

const form = document.querySelector('#search-form');

form.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();
  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  console.dir(searchQuery);
  if (searchQuery === '') {
    return;
  }
  getPictures(searchQuery);
}
