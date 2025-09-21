import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Movie } from "../api/api";

interface IMoviesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => Promise<void>;
  removeFavorite: (movieId: string) => Promise<void>;
  isFavorite: (movieId: string) => boolean;
}

export const MoviesContext = createContext<IMoviesContextType | undefined>(
  undefined
);

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (e) {
        console.error("Ошибка при загрузке избранных:", e);
      }
    };
    loadFavorites();
  }, []);

  const addFavorite = async (movie: Movie) => {
    const newFavorites = [...favorites, movie];
    setFavorites(newFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const removeFavorite = async (movieId: string) => {
    const newFavorites = favorites.filter((movie) => movie.imdbID !== movieId);
    setFavorites(newFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const isFavorite = (movieId: string) => {
    return favorites.some((movie) => movie.imdbID === movieId);
  };

  return (
    <MoviesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </MoviesContext.Provider>
  );
};
