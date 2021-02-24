import { IMovie } from "./movie-types";

export interface IPoll {
    id: number;
    name: string;
    movieList: {
        id: number;
        title: string;
    }[]; // this is temporary
    // movieList: IMovie[]
};