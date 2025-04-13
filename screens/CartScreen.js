import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if (cart) {
        setCartItems(JSON.parse(cart));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateCart = async (updatedCart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 6.2;
    return (subtotal + deliveryFee).toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <View style={[styles.header, { paddingTop: 40 }]}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity onPress={() => updateCart([])}>
          <Icon name="delete" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {cartItems.map((item) => (
        <Card key={item.id} containerStyle={styles.cartItem}>
          <View style={styles.discount}>
            <Text style={styles.discountText}>10% OFF</Text>
          </View>
          <View style={styles.cartImages}>
            <Image source={require('../assets/burger.png')} style={styles.cartImage} />
          </View>
          <View style={styles.cartDetails}>
            <View style={styles.cartInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>4.9 (3K+ Rating)</Text>
              </View>
            </View>
            <View style={styles.cartPrice}>
              <Text style={styles.price}>${item.price}</Text>
              <View style={styles.quantity}>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Icon name="delete" size={20} color="#6200EE" />
          </TouchableOpacity>
        </Card>
      ))}

      <View style={styles.infoSection}>
        <View style={[styles.infoBox, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="location-on" size={20} color="#000" />
          <Text style={styles.infoText}>Dhaka, Bangladesh</Text>
        </View>
        <TouchableOpacity>
          <Icon name="edit" size={20} color="#6200EE" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <View style={[styles.infoBox, { backgroundColor: '#EDE7F6' }]}>
          <Icon name="credit-card" size={20} color="#000" />
          <Text style={styles.infoText}>**** **** **** 1234</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Checkout Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({cartItems.length})</Text>
          <Text style={styles.summaryValue}>
            ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>$6.20</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Payable Total</Text>
          <Text style={styles.totalValue}>${calculateTotal()}</Text>
        </View>
      </View>

      <Button
        title="Confirm Order"
        buttonStyle={styles.confirmButton}
        titleStyle={styles.confirmButtonText}
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
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  cartItem: {
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 15,
    overflow: 'hidden',
  },
  discount: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#6200EE',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  discountText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  cartImages: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  cartImage: { width: 100, height: 100, resizeMode: 'contain' },
  cartDetails: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  cartInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  rating: { color: '#000', fontSize: 14, marginLeft: 5 },
  cartPrice: { alignItems: 'flex-end' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#6200EE' },
  quantity: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  quantityBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6200EE',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: { fontSize: 18, color: '#6200EE' },
  quantityText: { fontSize: 16, marginHorizontal: 10, fontWeight: 'bold' },
  removeButton: { position: 'absolute', top: 10, right: 10 },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  infoText: { fontSize: 14, fontWeight: 'bold', marginLeft: 10 },
  editIcon: { marginLeft: 10 },
  changeText: { color: '#6200EE', fontSize: 14, marginLeft: 10, fontWeight: 'bold' },
  summary: { marginHorizontal: 16, marginVertical: 20 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 }, // Sửa lỗi: thêm dấu } và giá trị hợp lý
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  summaryLabel: { fontSize: 14, color: 'gray' },
  summaryValue: { fontSize: 14, fontWeight: 'bold' },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#6200EE' },
  confirmButton: {
    backgroundColor: '#6200EE',
    borderRadius: 25,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  confirmButtonText: { fontSize: 16, fontWeight: 'bold' },
});