import Axios from 'axios';
import { IToken } from '../shared/interfaces/movie-poll-types';

export default class TokenService {
  static async createToken(pollId: number) {
    const res = await Axios.post<IToken>(
      `${process.env.REACT_APP_API_SERVER}/api/polls/poll/${pollId}/token`
    );

    return res.data;
  }

  static async removeToken(pollId: number, tokenId: string) {
    const res = await Axios.delete<IToken>(
      `${process.env.REACT_APP_API_SERVER}/api/polls/poll/${pollId}/${tokenId}`
    );

    return res.data;
  }
}