import logo from './logo.svg';
import './App.css';

//const title = 'React';
const welcome = {
  greeting: 'Hello',
  title: 'React',
};

function getTitle(title){
  return title;
}

function App() {
  return (

    <div>
      <h1>
        {welcome.greeting} {getTitle('React')} 
        {/* everything in curly braces in JSX can be used for JavaScript expressions (e.g. function execution) */}
      </h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text"/>
    </div>

    /*<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/
  );
}

export default App;
