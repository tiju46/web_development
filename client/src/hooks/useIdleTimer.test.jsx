import { renderHook } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useIdleTimer } from './useIdleTimer';
import * as AuthContextModule from '../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useIdleTimer Security Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('logs out user and redirects to /login after inactivity timeout', () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { name: 'Tiju', role: 'Manager' },
      logout: mockLogout,
    });

    renderHook(() => useIdleTimer(1), { wrapper: MemoryRouter });

    // Fast-forward 60 seconds
    vi.advanceTimersByTime(60 * 1000);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('resets countdown when user interacts with the page', () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { name: 'Tiju', role: 'Manager' },
      logout: mockLogout,
    });

    renderHook(() => useIdleTimer(1), { wrapper: MemoryRouter });

    // Advance 45 seconds, then simulate mouse movement
    vi.advanceTimersByTime(45 * 1000);
    window.dispatchEvent(new Event('mousemove'));

    // Advance another 30 seconds (75s total, but only 30s since activity)
    vi.advanceTimersByTime(30 * 1000);
    expect(mockLogout).not.toHaveBeenCalled();

    // Advance remaining 30 seconds to trigger timeout
    vi.advanceTimersByTime(30 * 1000);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});