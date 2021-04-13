import { IPoll, IRemoveMovie } from "../shared/interfaces/movie-poll-types";
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
}