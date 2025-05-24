import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api',
  withCredentials: true, // Ensure cookies are sent along with the request
});


export default instance;


