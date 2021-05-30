import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import {getIdToken} from '../../firebase-config';

export default class CsrfToken {
  private static _xsrfInterceptorId: number;
  private static _idTokenInterceptorId: number;

  public static setDefaultInterceptors() {
    this.setCSRFTokenInterceptor();
    this.setIDTokenInterceptor();
  }

  /**
   * Adds CSRF-Token header with its value on every request.
   */
  private static setCSRFTokenInterceptor() {
    Axios.interceptors.request.eject(this._xsrfInterceptorId);
    this._xsrfInterceptorId = Axios
      .interceptors
      .request
      .use(async (request: AxiosRequestConfig) => {
        // !!! IF THE REQUEST IS HITTING THE CSRF-TOKEN ENDPOINT
        // THE REQUEST MUST BE IMMEDIATLY RETURNED !!!
        // !!! IF THIS CONDITION IS OMITED THIS INTERCEPTOR WILL BE EXECUTED
        // INDEFINITE TIMES !!!
        if (request.url === `${process.env.REACT_APP_API_SERVER}/api/csrf-token/token`)
          return request;

        let csrfToken = window.sessionStorage.getItem('csrf-token');

        if (!csrfToken) {
          const response = await Axios.get(
            `${process.env.REACT_APP_API_SERVER}/api/csrf-token/token`,
            {withCredentials: true}
          );
          
          csrfToken = response.headers['CSRF-Token'];

          window.sessionStorage.setItem('csrf-token', csrfToken ?? '');

          if (!csrfToken) throw new Error('Error fetching CSRF-TOKEN.');
        }

        request.headers['CSRF-TOKEN'] = csrfToken;
        request.withCredentials = true;

        return request;

      }, (error: AxiosError | Error) => console.log(error.message));
  }

  /**
   * Adds Authorization header with its value on every request.
   */
  private static setIDTokenInterceptor() {
    Axios.interceptors.request.eject(this._idTokenInterceptorId);

    this._idTokenInterceptorId = Axios
      .interceptors
      .request
      .use(async (request: AxiosRequestConfig) => {
        const idToken = await getIdToken();

        request.headers['Authorization'] = `Bearer ${idToken}`;
        request.withCredentials = true;

        return request;

      }, (error: AxiosError) => console.log(error.message));
  }
}