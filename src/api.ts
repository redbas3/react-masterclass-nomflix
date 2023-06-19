const API_KEY = "0982b256ea73339e86ad4ea71063ef1f"

const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number,
  backdrop_path: string,
  poster_path: string,
  title: string,
  overview: string,
}

export interface ITv {
  id: number,
  backdrop_path: string,
  poster_path: string,
  name: string,
  overview: string,
}

export interface IGetMoviesResult {
  dates: {
    maximum: string,
    minimum: string,
  },
  page: number,
  results: IMovie[],
  total_pages: number,
  total_results: number,
}

export interface IGetTvResult {
  dates: {
    maximum: string,
    minimum: string,
  },
  page: number,
  results: ITv[],
  total_pages: number,
  total_results: number,
}

export function getNowMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(response => response.json());
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(response => response.json());
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(response => response.json());
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(response => response.json());
}

export function getOnTheAirTv() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(response => response.json());
}

export function getTodayTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(response => response.json());
}

export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(response => response.json());
}

export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(response => response.json());
}

export function getSearchMovies(query:string) {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}`).then(response => response.json());
}

export function getSEarchTv(query:string) {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}`).then(response => response.json());
}

