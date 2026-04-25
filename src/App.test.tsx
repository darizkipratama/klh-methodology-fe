import { render } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders without crashing', () => {
    // When the App loads, it renders the React Router and a default component
    render(<App />);
    
    // We expect the body to be in the document
    expect(document.body).toBeInTheDocument();
  });
});
