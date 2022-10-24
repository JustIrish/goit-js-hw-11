import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPictures } from './fetchPictures';
import markup from './templates/markup.hbs';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.guard');
let page = 1;
let searchQuery = '';

form.addEventListener('submit', onSearch);

async function onSearch(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    gallery.innerHTML = '';
    Notify.info('Please, enter...');
    return;
  }
  evt.currentTarget.reset();
  page = 1;
  gallery.innerHTML = '';

  createGallery(await fetchGallery(searchQuery, page));

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
      fetchGallery(searchQuery, page).then(arr => {
        gallery.insertAdjacentHTML('beforeend', markup(arr));
      });
    }
  });
}

function createGallery(arr) {
  gallery.insertAdjacentHTML('beforeend', markup(arr));
  observer.observe(guard);
  new SimpleLightbox('.photo-card-link');
}

async function fetchGallery(searchQuery, page) {
  try {
    const pictures = await getPictures(searchQuery, page)
      .then(data => {
        if (data.hits.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );

          return;
        }
        console.log(data);

        if (page === 1) {
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }

        if (data.totalHits < 40) { 
          return data;
        }
          if (page * 40 > data.totalHits) {
            Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
            observer.unobserve(guard);
            return;
          }

        return data;
      })
      .catch(error => {
        console.log(error);
      });

    return pictures.hits;
  } catch (error) {
    console.log(error.message);
  }
}
