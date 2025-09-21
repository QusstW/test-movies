import { API_KEY, API_URL, YOUTUBE_API_KEY, YOUTUBE_API_URL } from "@/constants";
import axios from "axios";

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<SearchResponse>(API_URL, {
      params: {
        s: query,
        apikey: API_KEY,
      },
    });

    if (response.data.Response === "True") {
      return response.data.Search;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Ошибка при поиске фильмов:", error);
    return [];
  }
};

export const searchTrailer = async (query: string): Promise<string | null> => {
  try {
    const response = await axios.get(
      YOUTUBE_API_URL,
      {
        params: {
          part: "snippet",
          q: `${query} official trailer`,
          type: "video",
          key: YOUTUBE_API_KEY,
          videoEmbeddable: true,
          videoSyndicated: true,
        },
      }
    );

    if (response.data.items.length > 0) {
      return response.data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error("Ошибка при поиске трейлера:", error);
    return null;
  }
};
