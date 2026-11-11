import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to monitor user inactivity and trigger automated session termination.
 * @param {number} timeoutInMinutes Inactivity threshold in minutes (default: 15)
 */
export const useIdleTimer = (timeoutInMinutes = 15) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const timeoutMs = timeoutInMinutes * 60 * 1000;

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (user) {
      timerRef.current = setTimeout(() => {
        handleLogoutOnInactivity();
      }, timeoutMs);
    }
  };

    if (user) {
      // Start timer on initial mount
      resetTimer();

      // Listen to user interactions
      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });
    }

  }, [user, timeoutMs]);
};