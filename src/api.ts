const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  video: boolean;
  vote_average: number;
  release_data: string;
}
export interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  original_language: string;
  overview: string;
  release_date: string;
  adult: boolean;
  name: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetTvResult {
  page: number;
  total_results: number;
  total_pages: number;
  results: ITv[];
}
export type MovieSort = "upcoming" | "top_rated" | "now_playing";

export type TvSort = "on_the_air" | "airing_today" | "top_rated" | "popular";
export function getMovies(movieSort: MovieSort = "now_playing") {
  return fetch(`${BASE_PATH}/movie/${movieSort}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export async function getTv(tvSort: TvSort = "on_the_air", page: number = 1) {
  const json = await fetch(
    `${BASE_PATH}/tv/${tvSort}?api_key=${API_KEY}&page=${page}`
  ).then((response) => response.json());
  console.log(tvSort, json);
  return json;
}

export interface ISearchedItem {
  poster_path: string;
  overview: string;
  release_date: string;
  id: number;
  title: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
}
export interface IGetSearchItems {
  page: number;
  total_pages: number;
  results: ISearchedItem[];
  total_results: number;
}

export async function searchData(query: string) {
  const movieJson = await fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}`
  ).then((response) => response.json());
  const tvJson = await fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}`
  ).then((response) => response.json());

  return { movieJson, tvJson };
}
