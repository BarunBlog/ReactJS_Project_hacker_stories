import React from 'react';
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
  const handleFetchStories = React.useCallback(() => {
    if(!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT'});

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then(response => response.json())
      .then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
    })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
  }, [searchTerm]); // (E)

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


  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>


      <hr/>

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
      <label htmlFor={id}>{children}</label>
      &nbsp; {/* non bracking space*/}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
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
    
  <div>
    <span>
      <a href={item.url}> {item.title} </a>
    </span>
    <span> {item.author} </span>
    <span> {item.num_comments} </span>
    <span> {item.points} </span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
);


export default App;
