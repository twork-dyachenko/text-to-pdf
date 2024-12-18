import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    blob: () => Promise.resolve(new Blob()),
  })
);

test('renders the app and converts text to PDF', async () => {
  render(<App />);

  expect(screen.getByText('Конвертація тексту в PDF')).toBeInTheDocument();
  const textArea = screen.getByPlaceholderText('Введіть текст для конвертації');
  expect(textArea).toBeInTheDocument();

  fireEvent.change(textArea, { target: { value: 'Test text' } });
  fireEvent.click(screen.getByText('Конвертувати в PDF'));

  await waitFor(() => {
    expect(screen.getByText('Завантажити')).toBeInTheDocument();
    expect(screen.getByText('Створити новий файл')).toBeInTheDocument();
  });
});
