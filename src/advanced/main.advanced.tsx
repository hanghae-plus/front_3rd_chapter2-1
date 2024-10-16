import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('app')!);
root.render(<Main />);

function Main() {
  return <h1>Hello, world</h1>;
}
