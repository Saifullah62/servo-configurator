import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays template selector', () => {
    render(<App />);
    expect(screen.getByText(/Load Template/i)).toBeInTheDocument();
  });

  it('shows Jetson configuration when platform is jetson', () => {
    render(<App />);
    const jetsonConfig = screen.queryByText(/Jetson Orin Configuration/i);
    expect(jetsonConfig).toBeInTheDocument();
  });
});
