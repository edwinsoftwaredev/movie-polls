import { IMoviesByGenre } from "./movie-types";

export interface IPoll {
    id: number;
    name: string;
    movieList: {
        id: number;
        title: string;
    }[]; // this is temporary
    // movieList: IMovie[]
};

interface ITopMoviesFilters {
    year: string;
}
export interface ITopMovies {
    filters: ITopMoviesFilters,
    moviesByGenres: IMoviesByGenre[]
}