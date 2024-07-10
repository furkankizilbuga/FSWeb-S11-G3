import React, { useEffect, useState } from 'react';

import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import MovieList from './components/MovieList';
import Movie from './components/Movie';
import EditMovieForm from './components/EditMovieForm';
import MovieHeader from './components/MovieHeader';
import FavoriteMovieList from './components/FavoriteMovieList';
import axios from 'axios';
import useLocalStorage from './hooks/useLocalStorage';
import { AddMovieForm } from './components/AddMovieForm';

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favs, setFavs] = useState([]);

  const history = useHistory();

  const [value, setLocalStorage] = useLocalStorage('s11d3', true);

  const [dark, setDark] = useState(value);

  useEffect(() => {
    axios
      .get('https://nextgen-project.onrender.com/api/s11d3/movies')
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const darkMode = () => {
    const newDark = !dark;
    setDark(newDark);
    setLocalStorage(newDark);
  };

  useEffect(() => {
    const mainContainer = document.getElementById('main-container');
    if (dark) {
      mainContainer.classList.add('dark', 'bg-slate-900', 'h-screen');
    } else {
      mainContainer.classList.remove('dark', 'bg-slate-900', 'h-screen');
    }
  }, [dark]);

  const deleteMovie = (id) => {
    axios
      .delete('https://nextgen-project.onrender.com/api/s11d3/movies/' + id)
      .then((res) => {
        const filtered = movies.filter((movie) => movie.id !== id);
        setMovies(filtered);
        const filteredFavs = favs.filter((fav) => fav.id !== id);
        setFavs(filteredFavs);
        history.push('/movies');
      })
      .catch((err) => console.warn(err));
  };

  const addToFavorites = (movie) => {
    if (!favs.some((fav) => fav.id === movie.id)) {
      setFavs([...favs, movie]);
    }
  };

  return (
    <div id="main-container">
      <nav className=" bg-zinc-800 text-white px-6 py-3 dark:bg-gray-800 ">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>{' '}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            data-testid="darkMode-toggle"
            checked={dark}
            onChange={darkMode}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          {dark ? (
            <span className="ms-3  font-medium text-gray-900 dark:text-gray-300">
              Dark Mode On
            </span>
          ) : (
            <span className="ms-3  font-medium text-gray-900 dark:text-gray-300">
              Dark Mode Off
            </span>
          )}
        </label>
      </nav>
      <div className=" max-w-4xl mx-auto px-3 pb-4 ">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList favs={favs} />
          <Switch>
            <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>
            <Route path="/movies/edit/:id">
              <EditMovieForm />
            </Route>
            <Route path="/movies/:id">
              <Movie
                deleteMovie={deleteMovie}
                addToFavorites={addToFavorites}
              />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies} />
            </Route>
            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
