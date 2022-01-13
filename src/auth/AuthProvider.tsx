import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import { login as loginApi } from "./authApi";
import { Storage } from "@capacitor/storage";
import { useHistory } from "react-router";

const log = getLogger("AuthProvider");

type LoginFn = (username?: string, password?: string) => void;
type LogoutFn = () => void;

export interface AuthState {
  authenticationError: Error | null | any;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login?: LoginFn;
  logout?: LogoutFn;
  pendingAuthentication?: boolean;
  username?: string;
  password?: string;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  token: "",
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const history = useHistory();
  const [state, setState] = useState<AuthState>(initialState);
  const {
    isAuthenticated,
    isAuthenticating,
    authenticationError,
    pendingAuthentication,
    token,
  } = state;

  const login = useCallback<LoginFn>(loginCallback, []);

  const logout = useCallback<LogoutFn>(logoutCallback, []);

  useEffect(authenticationEffect, [pendingAuthentication]);
  useEffect(loadUser, []);
  const value = {
    isAuthenticated,
    login,
    logout,
    isAuthenticating,
    authenticationError,
    token,
  };
  log("render");
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  function loginCallback(username?: string, password?: string): void {
    log("login");
    setState({
      ...state,
      pendingAuthentication: true,
      username,
      password,
    });
  }

  function logoutCallback(): void {
    (async () =>
      await Storage.remove({ key: "token" }).then(async () => {
        await Storage.remove({ key: "sneakers" }).then(() => {
          setState({
            ...state,
            isAuthenticating: false,
            isAuthenticated: false,
            authenticationError: null,
            token: "",
          });
        });
      }))();
  }

  function loadUser() {
    let canceled = false;
    load();
    return () => {
      canceled = true;
    };

    async function load() {
      const res = await Storage.get({ key: "token" });
      if (res.value) {
        setState({
          ...state,
          token: res.value,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });
        history.push("/items");
      }
    }
  }

  function authenticationEffect() {
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    };

    async function authenticate() {
      if (!pendingAuthentication) {
        log("authenticate, !pendingAuthentication, return");
        return;
      }
      try {
        log("authenticate...");
        setState({
          ...state,
          isAuthenticating: true,
        });
        const { username, password } = state;
        const { token } = await loginApi(username, password);
        if (canceled) {
          return;
        }
        log("authenticate succeeded");
        setState({
          ...state,
          token,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });
        await Storage.set({
          key: "token",
          value: token,
        });
      } catch (error) {
        if (canceled) {
          return;
        }
        log("authenticate failed");
        setState({
          ...state,
          authenticationError: error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });
      }
    }
  }
};
