import branch1 from '../public/api/branch1.json';
import branch2 from '../public/api/branch2.json';
import branch3 from '../public/api/branch3.json';

import App from './App';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { expect, it } from 'vitest';

const responses = {
  'api/branch1.json': branch1,
  'api/branch2.json': branch2,
  'api/branch3.json': branch3,
  '/api/branch1.json': branch1,
  '/api/branch2.json': branch2,
  '/api/branch3.json': branch3,
};

global.fetch = (endpoint) =>
  Promise.resolve({
    json: () => Promise.resolve(responses[endpoint]),
  });

it('renders without crashing', () => {
  render(<App />);
});

it('renders loading text initially', async () => {
  render(<App />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

it('renders a table after data load', async () => {
  render(<App />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
});

it('renders rows with product name as key', async () => {
  render(<App />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

  expect(screen.getAllByRole('row').at(57)).toHaveTextContent('Hominy');
  expect(screen.getAllByRole('row').at(74)).toHaveTextContent('Lychee');
});

it('renders table that is sorted ascending', async () => {
  render(<App />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

  expect(screen.getByRole('table')).toMatchSnapshot();
});

it('calculates total revenue of all branches', async () => {
  render(<App />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

  expect(
    within(screen.getAllByRole('row').at(-1)).getAllByRole('cell').at(-1)
  ).toHaveTextContent('2,102,619.44');
});

it('filters the displayed products', async () => {
  render(<App />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());

  fireEvent.change(screen.getByLabelText('Search Products'), { target: { value: 'pear' } });
  expect(
    within(screen.getAllByRole('row').at(-1)).getAllByRole('cell').at(-1)
  ).toHaveTextContent('60,681.02');
});
