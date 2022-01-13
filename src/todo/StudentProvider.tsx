import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import {getLogger} from '../core';
import {StudentProps} from './StudentProps';
import {createItem, getAllFilters, getItems, updateItem} from './itemApi';
import {io} from "socket.io-client";
import {AuthContext} from "../auth";

const log = getLogger('ItemProvider');

type SaveStudentFn = (item: StudentProps) => Promise<any>;

export interface StudentState {
  items?: StudentProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
  saveItem?: SaveStudentFn,
  allFilters: string[],
  filter: string,
  setFilter?: Function,
}

interface ActionProps {
  type: string,
  payload?: any,
}

const initialState: StudentState = {
  fetching: false,
  saving: false,
  filter: "",
  allFilters: [],
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: StudentState, action: ActionProps) => StudentState =
  (state, {type, payload}) => {
    console.log(type, payload);
    switch (type) {
      case FETCH_ITEMS_STARTED:
        return {...state, fetching: true, fetchingError: null};
      case FETCH_ITEMS_SUCCEEDED:
        return {...state, items: payload.items, fetching: false};
      case FETCH_ITEMS_FAILED:
        return {...state, fetchingError: payload.error, fetching: false};
      case SAVE_ITEM_STARTED:
        return {...state, savingError: null, saving: true};
      case SAVE_ITEM_SUCCEEDED:
        const items = [...(state.items || [])];
        const item = payload.item;
        const index = items.findIndex(it => it.id === item.id);
        if (index === -1) {
          items.splice(0, 0, item);
        } else {
          items[index] = item;
        }
        return {...state, items, saving: false};
      case SAVE_ITEM_FAILED:
        return {...state, savingError: payload.error, saving: false};
      default:
        return state;
    }
  };

export const StudentContext = React.createContext<StudentState>(initialState);

interface StudentProviderProps {
}

export const StudentProvider: React.FC<StudentProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState<string>("");
  const [allFilters, setAllFilters] = useState<string[]>([]);
  const {items, fetching, fetchingError, saving, savingError} = state;
  const {token} = useContext(AuthContext);
  useEffect(getItemsEffect, [token, filter]);
  useEffect(wsEffect, [token]);
  const saveItem = useCallback<SaveStudentFn>(saveItemCallback, [token]);
  const value = {items, fetching, fetchingError, saving, savingError, filter, setFilter, saveItem, allFilters};
  log('returns');
  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      try {
        log('fetchItems started');
        dispatch({type: FETCH_ITEMS_STARTED});
        const items = await getItems(filter, token);
        const allFilters = await getAllFilters(token);
        setAllFilters(allFilters);
        log('fetchItems succeeded');
        if (!canceled) {
          dispatch({type: FETCH_ITEMS_SUCCEEDED, payload: {items}});
        }
      } catch (error) {
        log('fetchItems failed');
        dispatch({type: FETCH_ITEMS_FAILED, payload: {error}});
      }
    }
  }

  async function saveItemCallback(item: StudentProps) {
    try {
      log('saveItem started');
      dispatch({type: SAVE_ITEM_STARTED});
      const savedItem = await (item.id ? updateItem(item, token) : createItem(item, token));
      log('saveItem succeeded');
      dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {item: savedItem}});
    } catch (error) {
      log('saveItem failed');
      dispatch({type: SAVE_ITEM_FAILED, payload: {error}});
    }
  }

  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    if (!token) return;
    const socket = io("ws://localhost:8083", {
      auth: {token}
    });
    socket.on("student", message => {
      if (canceled) {
        return;
      }
      const {event, payload: {item}} = message;
      console.log("event", event, item);
      log(`ws message, item ${event}`);
      if (event === 'created' || event === 'updated') {
        dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {item}});
      }
    })
    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      // closeWebSocket();
      socket.close();
    }
  }
};
