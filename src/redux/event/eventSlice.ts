import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCategories, fetchEvents } from "./eventAction";
import { RootState } from "../store";

interface Category {
  categoryname: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  category: string;
  imageUrl?: string;
  status: "DRAFT" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  location?: string;
  creatorId: string;
  maxAttendees: number;
  isPublic: boolean;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EventState {
  events: Event[];
  categories: Category[];
  selectedCategory: string;
  selectedEvent: Event | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EventState = {
  events: [],
  categories: [],
  selectedCategory: "All",
  selectedEvent: null,
  status: "idle",
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
      state.error = null;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.error = null;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<Event>) => {
      state.selectedEvent = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload ?? [];
        state.status = "succeeded";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.status = "succeeded";
      });
  },
});

export const { setEvents, setCategories, setSelectedEvent } =
  eventSlice.actions;

export const getCategory = (state: RootState) => state.event.categories;
export const { setSelectedCategory } = eventSlice.actions;
export default eventSlice.reducer;
