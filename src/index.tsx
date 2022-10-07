import { createRoot } from "react-dom/client";
import { App } from "./components";
import './index.css';

const rootNode = document.getElementById('root')!;

const root = createRoot(rootNode);
root.render(<App />);