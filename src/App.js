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

  // A
  const handleSearch = event => {
    // C
    console.log(event.target.value);
  };
  
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search onSearch={handleSearch} />

      <hr/>
     
      {/*Rendering the list here*/}
      {/* Instance of List component used in the App component */}
      <List list={stories} /> {/* React props to pass the array to the List component: */}
    </div>
  );
};




const Search = props => {
    // React state is used to make applications interactive.
    const [searchTerm, setSearchTerm] = React.useState('');
    /*
    React’s useState hook takes an initial state as an argument. We’ll use an empty string, and the
    function will return an array with two values. The first value (searchTerm) represents the current
    state; the second value is a function to update this state (setSearchTerm). 
    */
  
    const handleChange = event => {
      setSearchTerm(event.target.value);

      // B
      props.onSearch(event);
      // Sends event data to the handleSearch method of parent component
    };

    return (
      <div>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" onChange={handleChange}/>

        <p>
          Searching for <strong>{searchTerm}</strong>.
        </p>
        {/* When the user types into the input field, the input field’s change event is captured by the handler
        with its current internal value. The handler’s logic uses the state updater function to set the
        new state. After the new state is set in a component, the component renders again, meaning the
        component function runs again. The new state becomes the current state and can be displayed in
        the component’s JSX */}
      </div>
    );

};





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
