import { IMoviesByGenre } from "./movie-types";
export interface IPoll {
    id?: number;
    name: string;
    movies: {
        movieId: number,
        voteCount?: number
    }[];
    tokens?: {
        uuid: string
    }[];
    isOpen?: boolean;
    createdAt?: Date;
    endsAt?: Date;
};

interface ITopMoviesFilters {
    year: string;
}
export interface ITopMovies {
    filters: ITopMoviesFilters,
    moviesByGenres: IMoviesByGenre[]
}