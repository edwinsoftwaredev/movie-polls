import { IPoll, IPoll_PATCH, IRemoveMovie, IVote } from "../shared/interfaces/movie-poll-types";
import Axios from 'axios';

export default class PollService {
  static async createPoll(poll: IPoll): Promise<IPoll> {
    const res = await Axios.post<IPoll>(
      `${process.env.REACT_APP_API_SERVER}/api/polls/poll`,
      poll
    );

    return res.data;
  }

  static async getPolls(): Promise<IPoll[]> {
    const res = await Axios.get<IPoll[]>(
      `${process.env.REACT_APP_API_SERVER}/api/polls/my-polls`
    );
    
    return res.data;
  }

  static async addMovie(pollId: number, movieId: number): Promise<IPoll> {
    const res = await Axios.post<IPoll>(
      `${process.env.REACT_APP_API_SERVER}/api/polls/add-movie`,
      {pollId: pollId, movieId: movieId}
    );

    return res.data;
  }

  static async removeMovie(payload: IRemoveMovie): Promise<IRemoveMovie> {
    const res = await Axios.delete<IRemoveMovie>(
      `${process.env.REACT_APP_API_SERVER}/api/polls/movie/${payload.movieId}`,
      {params: {pollId: payload.pollId}}
    );

    return res.data;
  }

  static async removePoll(pollId: number): Promise<IPoll> {
    const res = await Axios.delete<IPoll>(
      `${process.env.REACT_APP_API_SERVER}/api/polls/poll/${pollId}`
    );

    return res.data;
  }

  static async updatePoll(pollId: number, pollPatch: IPoll_PATCH): Promise<IPoll> {
    const res = await Axios.patch<IPoll>(
      `${process.env.REACT_APP_API_SERVER}/api/polls/poll/${pollId}`,
      pollPatch
    );

    return res.data;
  }

  static async getPollAuthor(pollId: number): Promise<{
    name: string | undefined,
    photoURL: string | undefined,
    uid: string
  }> {
    const res = await Axios.get(
      `${process.env.REACT_APP_API_SERVER}/api/polls/poll/${pollId}/author`,
    );

    return res.data;
  }

  static async getPublicPoll(pollId: number, tokenId: string): Promise<IPoll> {
    const res = await Axios.get(
      `${process.env.REACT_APP_API_SERVER}/api/polls/poll/${pollId}`,
      {params: {tid: tokenId}}
    );

    return res.data;
  }

  static async setVote(pollId: number, tokenId: string, movieId: number): Promise<IVote> {
    const res = await Axios.patch(
      `${process.env.REACT_APP_API_SERVER}/api/polls/poll/${pollId}/vote`,
      {pollId: pollId, movieId: movieId, tokenId: tokenId}
    );

    return res.data;
  }
}