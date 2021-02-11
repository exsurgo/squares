import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './game/styles.css';
import { Main } from './game/main';
import reportPerformance from './performance';

ReactDOM.render(
  <StrictMode>
    <Main />
  </StrictMode>,
  document.getElementById('root'),
);

reportPerformance();
