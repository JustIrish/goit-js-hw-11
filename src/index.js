import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPictures } from './js/fetchPictures';
import markup from './js/templates/markup.hbs';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

const gallerylightbox = new SimpleLightbox('.photo-card-link');
let page = 1;
let searchQuery = '';

form.addEventListener('submit', onSearch);

async function onSearch(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  if (!searchQuery) {
    gallery.innerHTML = '';
    Notify.failure('Please, enter a query to search!', { clickToClose: true });
    return;
  }
  evt.currentTarget.reset();

  gallery.innerHTML = '';
  page = 1;
  observer.unobserve(guard);

  createGallery(await fetchGallery(searchQuery, page));
  gallerylightbox.refresh();

  return;
}

const options = {
  root: null,
  rootMargin: '10px',
  thresholder: 1,
};
const observer = new IntersectionObserver(onLoad, options);

async function onLoad(entries) {
  const add = await entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchGallery(searchQuery, page).then(obj => {
        gallery.insertAdjacentHTML('beforeend', markup(obj.hits));
        if (obj.hits.length === 0 || page === 13) {
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(guard);
          return;
        }
      });
    }
  });
}

function createGallery(obj) {
  gallery.insertAdjacentHTML('beforeend', markup(obj.hits));
  if (obj.totalHits >= 40) {
    observer.observe(guard);
  }
}

async function fetchGallery(searchQuery, page) {
  const pictures = await getPictures(searchQuery, page)
    .then(data => {
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          { clickToClose: true }
        );
        return data;
      }
      if (page === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      return data;
    })
    .catch(error => {
      console.log(error);
    });
  console.log(pictures);
  return pictures;
}
