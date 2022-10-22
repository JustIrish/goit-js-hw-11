const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30708131-dca16e544fe536739b53ab461';
const options = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export async function getPictures(value) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${value}&per_page=10&page=1`,
    options
  );
  const data = await response.data;
  return data;
}
