import React from 'react';
import axios from 'axios';
//import logo from './logo.svg';
import './App.css';


const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) =>{
  switch (action.type){
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      /*The new state is simply the payload*/
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};



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

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  //const [stories, setStories] = React.useState([]);
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError:false }
  );

  /*
  will move all the data fetching logic into a standalone function outside the side-effect (A); 
  wrap it into a useCallback hook (B); and then invoke it in the useEffect hook (C)
  */
  // (A)
  const handleFetchStories = React.useCallback(async () => {
    // To use async/await, our function requires the async keyword.
    dispatchStories({ type: 'STORIES_FETCH_INIT'});
    try {
      const result = await axios.get(url);
      //Actions after the await keyword are not executed until promise resolves, 
      //meaning the code will wait

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
        dispatchStories({ type: 'STORIES_FETCH_FAILER' });
    }

  }, [url]); // (E)

  React.useEffect(() => {
    handleFetchStories(); // (C)
  }, [handleFetchStories]); // (D)
    
  /*
  This useCallback hook creates a memoized function every time its dependency array (E) changes. 
  As a result, the useEffect hook runs again (C) because it depends on the new function (D)
  */


  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };


  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  /*
  the button handler sets the url derived from the current searchTerm and the static
  API URL as a new state
  */
  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
    /*since the handler is used for the form event, it executes preventDefault in React’s
    synthetic event. This prevents the HTML form’s native behavior, which leads to a browser reload.
    */
  };
  /*
   instead of running the data fetching side-effect on every searchTerm change – which would
   happen each time the input field’s value changes – the url is used. The url is set explicitly 
   by the user when the search is confirmed via our new button
  */
  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />


      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ): (
        /*Rendering the list here*/
        /* Instance of List component used in the App component */
        <List
          list={stories.data}
          onRemoveItem={handleRemoveStory}
        />
        /* React props to pass the array to the List component: */
      )}
      
    </div>
  );
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit} className="search-form">
        <InputWithLabel
          id="search"
          value={searchTerm}
          isFocused
          onInputChange={onSearchInput}
        >
          <strong>Search:</strong>
        </InputWithLabel>

        <button className="button button_large" type="submit" disabled={!searchTerm}>
          Submit
        </button>
      </form>

);


/* Everything that’s passed between a component’s elements can be accessed
    as children in the component and be rendered somewhere.*/
const InputWithLabel = ({
  id,
  value, 
  type = 'text',
  onInputChange,
  isFocused,
  children,
 }) => {

  /* ref with React’s useRef hook.*/
  const inputRef = React.useRef();

  React.useEffect(() => {
    if(isFocused && inputRef.current){

      inputRef.current.focus();
    }
  }, [isFocused]);

  
  return(
    <>
      <label htmlFor={id} className="label">{children}</label>
      &nbsp; {/* non bracking space*/}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
}





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
const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
  ));
 
const Item = ({ item, onRemoveItem }) => (
    
  <div className="item">
    <span style={{ width: '40%' }}>
      <a href={item.url}> {item.title} </a>
    </span>
    <span style={{ width: '30%' }}> {item.author} </span>
    <span style={{ width: '10%' }}> {item.num_comments} </span>
    <span style={{ width: '10%' }}> {item.points} </span>
    <span style={{ width: '10%' }}>
      <button
        type="button"
        onClick={() => onRemoveItem(item)}
        className="button button_small"
      >
        Dismiss
      </button>
    </span>
  </div>
);


export default App;
