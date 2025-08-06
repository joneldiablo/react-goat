import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SchemaController from '../src/react-router-schema/react-router-schema';
import Controller from '../src/controllers/controller';
import { addControllers } from '../src/controllers';

class DummyController extends Controller<any> {
  componentDidMount() {}
  render() {
    return <div data-testid="dummy">{this.props.name}</div>;
  }
}

addControllers({ Dummy: DummyController });

describe('SchemaController', () => {
  test('renders provided routes', () => {
    const routes = [
      { path: '/', component: 'Dummy', name: 'home', active: true },
    ];
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <SchemaController routes={routes} />
      </MemoryRouter>
    );
    expect(getByTestId('dummy')).toHaveTextContent('home');
  });

  test('skips inactive routes', () => {
    const routes = [
      { path: '/', component: 'Dummy', name: 'home', active: true },
      { path: '/two', component: 'Dummy', name: 'two', active: false },
    ];
    const { queryByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <SchemaController routes={routes} />
      </MemoryRouter>
    );
    expect(queryByText('home')).toBeInTheDocument();
    expect(queryByText('two')).toBeNull();
  });
});
