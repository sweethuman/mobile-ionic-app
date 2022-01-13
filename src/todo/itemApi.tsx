import axios from 'axios';
import {baseUrl, getLogger} from '../core';
import {StudentProps} from './StudentProps';

const log = getLogger('itemApi');


const itemUrl = `http://${baseUrl}/student`;

interface ResponseProps<T> {
  data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
  log(`${fnName} - started`);
  return promise
    .then(res => {
      log(`${fnName} - succeeded`);
      return Promise.resolve(res.data);
    })
    .catch(err => {
      log(`${fnName} - failed`);
      return Promise.reject(err);
    });
}

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};
const authConfig = (token?: string) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export function getItems(filter: string, token: string): Promise<StudentProps[]> {
  return withLogs(axios.get(`${itemUrl}?filter=${filter}`, authConfig(token)), 'getItems');
}

export function getAllFilters( token: string): Promise<string[]> {
  return withLogs(axios.get( `http://${baseUrl}/studentfilter`, authConfig(token)), 'getAllFilters');
}

export const createItem: (item: StudentProps, token: string) => Promise<StudentProps[]> = (item, token) => {
  return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
}

export const updateItem: (item: StudentProps, token: string) => Promise<StudentProps[]> = (item, token) => {
  return withLogs(axios.put(`${itemUrl}/${item.id}`, item, authConfig(token)), 'updateItem');
}

interface MessageData {
  event: string;
  payload: {
    item: StudentProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`)
  ws.onopen = () => {
    log('web socket onopen');
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
