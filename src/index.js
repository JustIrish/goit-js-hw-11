import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPictures } from './fetchPictures';
import markup from './templates/markup.hbs';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();
  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    return;
  }

  getPictures(searchQuery)
    .then(data => {
      if (data.hits.length === 0) {
        throw new Error('');
      }
      console.log(data);
      gallery.insertAdjacentHTML('beforeend', markup(data.hits));
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}
