import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const fetchCategories = createAsyncThunk(
  "event/fetchCategories",
  async () => {
    try {
      const res = await axios.get(`${backendURL}/api/v1/event/category`, {
        withCredentials: true,
      });

      return [{ categoryname: "All" }, ...res.data];
    } catch (err) {
      console.error("Error fetching categories: ", err);
    }
  }
);

export const fetchEvents = createAsyncThunk(
  "menu/fetchItems",
  async (category: string) => {
    const response = await axios.get(`${backendURL}/api/v1/event/${category}`, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (eventData: {
    title: string;
    description: string;
    date: string;
    endDate: string;
    category: string;
    location: string;
    maxAttendees: number;
    isPublic: boolean;
    imageUrl: string;
  }) => {
    try {
      console.log("image 2", eventData.imageUrl);
      const response = await axios.post(
        `${backendURL}/api/v1/event/new`,
        eventData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }
);
