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

export interface IMovieDetail extends IMovie {
    homepage: string;
    production_countries: {
        iso_3166_1: string;
        name: string
    }[];
    credits: {
        cast: {
            name: string;
        }[];
        crew: {
            job: string;
            name: string
        }[];
    };
    release_dates: {
        results: {
            iso_3166_1: string;
            release_dates: {
                certification: string;
            }[];
        }[];
    };
    runtime: number;
    providers: {id: number, results: any};
}

export interface IGenreRequest {
    genres: IGenre[];
}

export interface IGenre {
    id: number;
    name: string;
}

export interface IMoviesByGenre {
    genre_name: string;
    results: IMovie[];
}