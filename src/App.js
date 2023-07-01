import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 

  const fetchMoviesHandler = useCallback(async () =>  {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://movieapp-b7ef4-default-rtdb.firebaseio.com/movies.json");
      if (!response.ok) {
        throw new Error("Something went wrong ... Retrying");
      }
      
      const data = await response.json();
    const loadedMovies = [];
    for(const key in data){
      loadedMovies.push({
        id:key,
        title:data[key].title,
        openingText:data[key].openingText,
        releaseDate:data[key].releaseDate,
      })
    }

    
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      
      // setTimeout(()=>(fetchMoviesHandler()),5000)
    }
    setIsLoading(false);
   
  },[]);
  const cancelRetryingHandler = ()=>{
    setError(null)
  }

  useEffect(()=>{
    fetchMoviesHandler();
  } , [fetchMoviesHandler]);

  async function addMovieHandler(movie){
    const response = await fetch("https://movieapp-b7ef4-default-rtdb.firebaseio.com/movies.json",{
      method:'POST',
      body: JSON.stringify(movie),
      headers:{
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data)
  }
   async function removeHandler(e) {
    e.preventDefault()
    const li = e.target.parentElement;
    const id = li.id
    const del = await fetch(`https://movieapp-b7ef4-default-rtdb.firebaseio.com/movies.json/${id}`,{
      method:'DELETE'
    })
    const data = await del.json()
    console.log(data)
  }
  let content = <p>Found no movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} remove={removeHandler} />;
  }

  if (error != null) {
    content = error;
  }

  if (isLoading) {
    content = <p>Loading ...</p>;
  }
  return (
    <React.Fragment>
    
      <section>
      <AddMovie onAddMovie={addMovieHandler}/>
      <br/>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
      <button onClick={cancelRetryingHandler}>Cancel</button>
    </React.Fragment>
  );
}

export default App;
