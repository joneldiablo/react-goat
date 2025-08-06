import React from 'react';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import eventHandler from 'dbl-utils/event-handler';
import withRouteWrapper from '../src/react-router-schema/with-route-wrapper';

jest.useFakeTimers();

jest.mock('dbl-utils/event-handler', () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  dispatch: jest.fn(),
}));

describe('withRouteWrapper', () => {
  test('adds body classes and re-renders on location events', () => {
    const Dummy = jest.fn(() => null);
    const route: any = { name: 'demo', path: '/' };
    const Wrapped = withRouteWrapper(Dummy, route);
    const { unmount } = render(
      <MemoryRouter initialEntries={['/']}>
        <Wrapped name="demo" />
      </MemoryRouter>
    );
    expect(document.body.classList.contains('demo-view')).toBe(true);

    act(() => {
      const cb = (eventHandler.subscribe as jest.Mock).mock.calls[0][1];
      cb({ pathname: '/other' });
      jest.runAllTimers();
    });
    expect(Dummy).toHaveBeenCalledTimes(2);

    unmount();
    expect(document.body.classList.contains('demo-view')).toBe(false);
  });
});
