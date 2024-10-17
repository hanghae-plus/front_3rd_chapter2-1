import { something } from '@/somethine';
import ReactDOM from 'react-dom/client';
something();

function App() {
  return <h1>Hello, React!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(<App />);
