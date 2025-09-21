// app/(tabs)/favorites.tsx
import { Link } from 'expo-router';
import React, { useContext } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MoviesContext } from '../../store/MoviesContext';

const FavoritesScreen = () => {
  const { favorites } = useContext(MoviesContext)!;

  const renderMovieItem = ({ item }: { item: any }) => (
    <Link href={`/details/${item.imdbID}`} asChild>
      <Pressable style={styles.movieItem}>
        <Image
          style={styles.poster}
          source={{ uri: item.Poster !== 'N/A' ? item.Poster : '' }}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.title}>{item.Title}</Text>
          <Text style={styles.year}>{item.Year}</Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Избранное</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Пока что здесь пусто.</Text>
          <Text style={styles.emptyText}>Добавляйте фильмы, которые вам нравятся!</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.imdbID}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
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
    justifyContent: 'center',
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
    color: 'gray',
  },
});

export default FavoritesScreen;