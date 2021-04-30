import { IMovie, IMoviesByGenre } from "./movie-types";
export interface IToken {
    uuid: string;
    pollId: number;
    used: boolean;
}
export interface IPoll {
    id?: number;
    name: string;
    movies: {
        movieId: number,
        movie?: IMovie,
        voteCount?: number
    }[];
    tokens?: IToken[];
    isOpen?: boolean;
    createdAt?: Date | string;
    endsAt?: Date;
};

interface ITopMoviesFilters {
    year: string;
}
export interface ITopMovies {
    filters: ITopMoviesFilters,
    moviesByGenres: IMoviesByGenre[]
}

export interface IRemoveMovie {
    movieId: number;
    pollId: number;
}
  
export interface IPoll_PATCH {
    name?: string;
    isOpen?: boolean;
    endsAt?: Date;
}