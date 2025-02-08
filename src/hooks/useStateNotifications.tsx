import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import toast from "react-hot-toast";
import { clearStateLoading, setStateLoading } from "../redux/loadingSlice";

interface StateConfig {
  [key: string]: {
    loadingMessage: string;
    successMessage: string;
    errorPrefix?: string;
  };
}

interface PreviousState {
  status: string;
  timestamp: number;
}
const stateConfig: StateConfig = {
  auth: {
    loadingMessage: "Authenticating...",
    successMessage: "Authentication successful",
    errorPrefix: "Auth error:",
  },
};

export const useStateNotifications = () => {
  const dispatch = useDispatch();
  const previousStates = useRef<Record<string, PreviousState>>({});
  const DEBOUNCE_TIME = 2000;

  const states = useSelector((state: RootState) => ({
    auth: state.auth,
  }));

  useEffect(() => {
    Object.entries(states).forEach(([stateName, state]) => {
      const config = stateConfig[stateName];
      if (!config) return;

      const now = Date.now();
      const prev = previousStates.current[stateName];

      // Skip if same status within debounce time
      if (
        prev &&
        prev.status === state.status &&
        now - prev.timestamp < DEBOUNCE_TIME
      ) {
        return;
      }

      previousStates.current[stateName] = {
        status: state.status,
        timestamp: now,
      };

      // Handle state changes without triggering re-renders
      requestAnimationFrame(() => {
        switch (state.status) {
          case "loading":
            dispatch(setStateLoading(stateName));
            break;
          case "succeeded":
            dispatch(clearStateLoading(stateName));
            //toast.success(config.successMessage);
            break;
          case "failed":
            dispatch(clearStateLoading(stateName));
            toast.error(
              `${config.errorPrefix} ${state.error || "Unknown error"}`
            );
            break;
          case "idle":
            dispatch(clearStateLoading(stateName));
            break;
        }
      });
    });
  }, [states, dispatch]);
};
