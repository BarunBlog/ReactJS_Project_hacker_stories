import React from 'react';
//import logo from './logo.svg';
import './App.css';


const initialStories = [
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

const storiesReducer = (state, action) =>{
  switch (action.type){
    case 'SET_STORIES':
      /*The new state is simply the payload*/
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
        story => action.payload.objectID !== story.objectID
      );
    default:
    throw new Error();
  }
};

const getAsyncStories = () => 
  new Promise(resolve => 
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );


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
    []
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories().then(result => {
      dispatchStories({
        type: 'SET_STORIES',
        payload: result.data.stories,
      });
      setIsLoading(false);
    })
      .catch(() => setIsError(true));
  }, []);


  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };


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

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>


      <hr/>

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ): (
        /*Rendering the list here*/
        /* Instance of List component used in the App component */
        <List
          list={searchedStories}
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
