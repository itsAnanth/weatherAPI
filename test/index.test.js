import WeatherAPI from '../src/index.js';

const api = new WeatherAPI('1d48dfc89202ea8053735db209080f50');

api.getWeather('Kerala').then(console.log);
