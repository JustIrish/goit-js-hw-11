const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30708131-dca16e544fe536739b53ab461';
const options = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export async function getPictures(value) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${value}&per_page=10&page=1`,
      options
    );
    console.log(response.data.hits);
    if (response.data.hits.length === 0) {
      throw new Error('');
    }
    return await response.data.hits;
  } catch (error) {
    console.log('error');
    // Notify.failure(
    //   'Sorry, there are no images matching your search query. Please try again.'
    // );
  }
}
