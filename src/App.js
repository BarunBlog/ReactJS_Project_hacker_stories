import React from 'react';
//import logo from './logo.svg';
import './App.css';


const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  /*
  the function useEffect(Hook) is called every time the value changes; and it’s also called initially 
  when the component renders for the first time
  */
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {

  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');


  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter( story =>
    story.title.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search search={searchTerm} onSearch={handleSearch} />

      <hr/>
     
      {/*Rendering the list here*/}
      {/* Instance of List component used in the App component */}
      <List list={searchedStories} /> {/* React props to pass the array to the List component: */}
    </div>
  );
};




const Search = ({search, onSearch}) => (

      <div>
        <label htmlFor="search">Search: </label>
        <input 
          id="search" 
          type="text" 
          value={search}
          onChange={onSearch}
        />

        {/* When the user types into the input field, the input field’s change event is captured by the handler
        with its current internal value. The handler’s logic uses the state updater function to set the
        new state. After the new state is set in a component, the component renders again, meaning the
        component function runs again. The new state becomes the current state and can be displayed in
        the component’s JSX */}
      </div>
);





// Variation 1:
/*
const List = ({ list }) =>
  list.map(item => <Item key={item.objectID} item={item} />);
 
const Item = ({ 
  item: {
    title,
    url,
    author,
    num_comments,
    points,
  },
 }) => (
    
  <div>
    <span>
      <a href={url}> {title} </a>
    </span>
    <span> {author} </span>
    <span> {num_comments} </span>
    <span> {points} </span>
  </div>
);
*/

// Variation 2: Spread and Rest Operators
const List = ({ list }) =>
  list.map(({object, ...item}) => <Item key={item.objectID} {...item}/>);
 
const Item = ({ title, url, author, num_comments, points }) => (
    
  <div>
    <span>
      <a href={url}> {title} </a>
    </span>
    <span> {author} </span>
    <span> {num_comments} </span>
    <span> {points} </span>
  </div>
);


export default App;
