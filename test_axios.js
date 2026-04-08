const axios = require('axios');
axios.defaults.baseURL = '/api';
const url = axios.getUri({url: '/products/add'});
console.log('Resulting URL with /products/add:', url);
const url2 = axios.getUri({url: 'products/add'});
console.log('Resulting URL with products/add:', url2);
