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

  
});