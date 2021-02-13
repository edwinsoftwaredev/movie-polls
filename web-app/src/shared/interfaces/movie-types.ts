export interface IMovieRequest {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    genre_names: string[]; // this is a custom property
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    key: number; // this is a custom property
}

export interface IGenreRequest {
    genres: IGenre[];
}

export interface IGenre {
    id: number;
    name: string;
}
