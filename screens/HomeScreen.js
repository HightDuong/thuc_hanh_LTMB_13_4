import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { SearchBar, Card } from 'react-native-elements';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  { id: '1', name: 'PIZZA', icon: 'local-pizza', color: '#4CAF50' },
  { id: '2', name: 'BURGER', icon: 'fastfood', color: '#E0E0E0' },
  { id: '3', name: 'DRINK', icon: 'local-drink', color: '#E0E0E0' },
  { id: '4', name: 'RICI', icon: 'rice-bowl', color: '#E0E0E0' },
];

const popularItems = [
  { id: '1', name: 'BURGER', image: require('../assets/burger.png'), price: 28 },
  { id: '2', name: 'PIZZA', image: require('../assets/pizza.png'), price: 35 },
];

export default function HomeScreen() {
  const addToCart = async (item) => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      let cartItems = cart ? JSON.parse(cart) : [];
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        cartItems = cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        cartItems.push({ ...item, quantity: 1 });
      }
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      alert(`${item.name} added to cart!`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>YOUR LOCATION</Text>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={16} color="#6200EE" />
            <Text style={styles.location}>Savar, Dhaka</Text>
          </View>
        </View>
        <Icon name="notifications" size={24} color="#000" />
      </View>

      <SearchBar
        placeholder="Search your food"
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.searchInput}
        inputStyle={styles.searchInputText}
        placeholderTextColor="#fff"
        searchIcon={{ name: 'search', color: '#fff' }}
      />

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.categoryItem, { backgroundColor: item.color }]}>
            <Icon name={item.icon} size={24} color={item.color === '#4CAF50' ? '#fff' : '#000'} />
            <Text style={[styles.categoryText, { color: item.color === '#4CAF50' ? '#fff' : '#000' }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <Card containerStyle={styles.banner}>
        <View style={styles.discount}>
          <Text style={styles.discountText}>10% OFF</Text>
        </View>
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>BURGER</Text>
            <Text style={styles.bannerSubtitle}>TODAY'S HOT OFFER</Text>
            <View style={styles.ratingRow}>
              <Image
                source={require('../assets/avatar.png')}
                style={styles.ratingAvatar}
              />
              <Image
                source={require('../assets/avatar.png')}
                style={[styles.ratingAvatar, { marginLeft: -10 }]}
              />
              <Image
                source={require('../assets/avatar.png')}
                style={[styles.ratingAvatar, { marginLeft: -10 }]}
              />
              <Icon name="star" size={16} color="#FFD700" style={styles.ratingStar} />
              <Text style={styles.rating}>4.9 (3K+ Rating)</Text>
            </View>
          </View>
          <Image source={require('../assets/burger.png')} style={styles.bannerImage} />
        </View>
      </Card>

      <View style={styles.popularHeader}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={popularItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card containerStyle={styles.popularItem}>
            <Image source={item.image} style={styles.popularImage} />
            <Text style={styles.popularText}>{item.name}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </Card>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF9C4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  locationContainer: { flex: 1, marginLeft: 10 },
  locationText: { fontSize: 12, color: 'gray' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  location: { fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  searchBar: {
    backgroundColor: '#6200EE',
    borderRadius: 25,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  searchInput: {
    backgroundColor: '#6200EE',
    borderRadius: 25,
  },
  searchInputText: {
    color: '#fff',
  },
  categoryItem: {
    padding: 10,
    borderRadius: 10,
    marginLeft: 16,
    marginVertical: 10,
    alignItems: 'center',
    width: 80,
  },
  categoryText: { fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  banner: {
    borderRadius: 15,
    backgroundColor: '#000',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 15,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  ratingStar: {
    marginLeft: 5,
  },
  rating: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 5,
  },
  bannerImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  discount: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#6200EE',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAll: { fontSize: 14, color: '#6200EE' },
  popularItem: {
    borderRadius: 15,
    width: 120,
    alignItems: 'center',
    marginLeft: 16,
    marginVertical: 10,
    padding: 10,
  },
  popularImage: { width: 80, height: 80, resizeMode: 'contain' },
  popularText: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  addButton: {
    backgroundColor: '#6200EE',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  addButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});