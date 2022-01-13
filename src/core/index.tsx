import {AxiosResponse} from "axios";


export const getLogger: (tag: string) => (...args: any) => void =
  tag => (...args) => console.log(tag, ...args);
export const baseUrl = 'localhost:8083';
export const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const log = getLogger('api');

export function withLogs<T>(promise: Promise<AxiosResponse<T>>, fnName: string): Promise<T> {
  log(`${fnName} - started`);
  return promise
    .then(res => {
      log(`${fnName} - succeeded`, res.data);
      return Promise.resolve(res.data);
    })
    .catch(err => {
      log(`${fnName} - failed`);
      return Promise.reject(err);
    });
}
