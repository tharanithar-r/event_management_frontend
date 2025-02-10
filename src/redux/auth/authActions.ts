/* eslint-disable @typescript-eslint/no-explicit-any */
//import { Dispatch, Action } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuth, setAuthError, setAuthLoading } from "./authSlice";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signIn =
  (username: string, password: string, role: "user") =>
  async (dispatch: any) => {
    dispatch(setAuthLoading());
    try {
      const res = await api.post(`${backendURL}/api/v1/${role}/signin`, {
        username,
        password,
      });

      if (res.status === 200) {
        dispatch(setAuth({ id: username, role }));
        return true;
      } else {
        dispatch(setAuthError("Invalid credentials"));
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || `Error during ${role} sign-in`;
      dispatch(setAuthError(errorMessage));
      return false;
    }
  };

export const signUp =
  (username: string, email: string, password: string, role: "user") =>
  async (dispatch: any) => {
    dispatch(setAuthLoading());
    try {
      const res = await api.post(`${backendURL}/api/v1/${role}/signup`, {
        username,
        email,
        password,
      });

      if (res.status === 200) {
        dispatch(setAuth({ id: username, role }));
        return true;
      } else {
        dispatch(setAuthError("Register failed"));
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || `Error during ${role} sign-in`;
      dispatch(setAuthError(errorMessage));
      return false;
    }
  };

export const signOut = () => async (dispatch: any) => {
  dispatch(setAuthLoading());
  try {
    await axios.get(`${backendURL}/api/v1/signout`, {
      withCredentials: true,
    });
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || `Error during sign-out`;
    dispatch(setAuthError(errorMessage));
    return false;
  }
};
