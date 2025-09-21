import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Movie, searchMovies } from "../../api/api";

const HomeScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("pool");

  useEffect(() => {
    fetchMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchMovies = async () => {
    setLoading(true);
    const fetchedMovies = await searchMovies(query);
    setMovies(fetchedMovies);
    setLoading(false);
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <Link href={`/details/${item.imdbID}`} asChild>
      <Pressable style={styles.movieItem}>
        <Image
          style={styles.poster}
          source={{
            uri:
              item.Poster !== "N/A"
                ? item.Poster
                : "",
          }}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.title}>{item.Title}</Text>
          <Text style={styles.year}>{item.Year}</Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск фильмов..."
        value={query}
        onChangeText={setQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.imdbID}-${index}`}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    paddingTop: 70,
  },
 searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  listContainer: {
    paddingBottom: 20,
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12, 
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  poster: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  movieInfo: {
    padding: 15,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  year: {
    fontSize: 14,
    color: "gray",
  },
});

export default HomeScreen;
