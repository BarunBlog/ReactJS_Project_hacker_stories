import React from 'react';
//import logo from './logo.svg';
import './App.css';


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

  const [searchTerm, setSearchTerm] = React.useState('');

  
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

      <Search onSearch={handleSearch} />

      <hr/>
     
      {/*Rendering the list here*/}
      {/* Instance of List component used in the App component */}
      <List list={searchedStories} /> {/* React props to pass the array to the List component: */}
    </div>
  );
};




const Search = props => (

      <div>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" onChange={props.onSearch}/>

        {/* When the user types into the input field, the input field’s change event is captured by the handler
        with its current internal value. The handler’s logic uses the state updater function to set the
        new state. After the new state is set in a component, the component renders again, meaning the
        component function runs again. The new state becomes the current state and can be displayed in
        the component’s JSX */}
      </div>
);







const List = props =>
  props.list.map(item => (
    
      <div key={item.objectID}>
        <span>
          <a href={item.url}> {item.title} </a>
        </span>
        <span> {item.author} </span>
        <span> {item.num_comments} </span>
        <span> {item.points} </span>
      </div>
  ));


export default App;
