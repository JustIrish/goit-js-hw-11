const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30708131-dca16e544fe536739b53ab461';
const per_page = 40;

export async function getPictures(value, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: per_page,
    page: page,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  const data = await response.data;

  return data;
}
