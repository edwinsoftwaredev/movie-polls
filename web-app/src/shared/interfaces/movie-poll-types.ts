import { IMovie, IMoviesByGenre } from "./movie-types";
export interface IPoll {
    id?: number;
    name: string;
    movies: {
        movieId: number,
        movie?: IMovie,
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

export interface IRemoveMovie {
    movieId: number;
    pollId: number;
}
  