import { searchTrailer } from "@/api/api";
import { API_KEY, API_URL } from "@/constants";
import { MoviesContext } from "@/store/MoviesContext";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import YouTubeIframe from "react-native-youtube-iframe";

interface IFullMovie {
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  Director: string;
  Actors: string;
  imdbRating: string;
  Genre: string;
  Runtime: string;
  Trailer: string;
  imdbID: string;
  Type: string;
}

const MovieDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<IFullMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMovieFavorite, setIsMovieFavorite] = useState(false);
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { addFavorite, removeFavorite, isFavorite } =
    useContext(MoviesContext)!;

  const fetchAllData = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const movieResponse = await axios.get(API_URL, {
        params: {
          i: id,
          apikey: API_KEY,
        },
      });

      const fetchedMovie: IFullMovie = movieResponse.data;
      setMovie(fetchedMovie);
      setIsMovieFavorite(isFavorite(id as string));

      if (fetchedMovie && fetchedMovie.Title) {
        const trailerID = await searchTrailer(fetchedMovie.Title);
        setTrailerId(trailerID);
      }
    } catch (error) {
      console.error("Ошибка fetchAllData", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setIsMovieFavorite(isFavorite(id as string));
    }

    fetchAllData();
  }, [id, isFavorite]);

  const handleFavoritePress = async () => {
    if (isMovieFavorite) {
      await removeFavorite(id as string);
      setIsMovieFavorite(false);
    } else {
      if (movie) {
        await addFavorite(movie);
        setIsMovieFavorite(true);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Фильм не найден.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.poster}
        source={{
          uri:
            movie.Poster !== "N/A"
              ? movie.Poster
              : "",
        }}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.genre}>
          {movie.Genre} • {movie.Runtime} • {movie.Year}
        </Text>
        <Text style={styles.plot}>{movie.Plot}</Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Режиссер:</Text> {movie.Director}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>В ролях:</Text> {movie.Actors}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Рейтинг IMDb:</Text> {movie.imdbRating}
        </Text>

        {trailerId ? (
          <Pressable
            style={styles.trailerButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.favoriteButtonText}>Смотреть трейлер</Text>
          </Pressable>
        ) : (
          <View>
            <Text style={styles.trailerExtra}>Трейлер к данному фильму отсутствует</Text>
          </View>
        )}

        <Pressable
          style={[
            styles.favoriteButton,
            isMovieFavorite && styles.favoriteButtonActive,
          ]}
          onPress={handleFavoritePress}
        >
          <Text style={styles.favoriteButtonText}>
            {isMovieFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          </Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <YouTubeIframe height={300} play={true} videoId={trailerId} />
          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  poster: {
    width: "100%",
    height: 450,
    resizeMode: "contain",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  detailsContainer: {},
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  genre: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  favoriteButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  favoriteButtonActive: {
    backgroundColor: "red",
  },
  favoriteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  trailerButton: {
    backgroundColor: "#a5eda5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#a5eda5",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  trailerExtra: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ec8080",
    borderRadius: 5,
  },
});

export default MovieDetailsScreen;
