import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CartScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sepetim</Text>
      <View style={styles.cartItems}>
        <View style={styles.cartItem}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>Ürün Adı</Text>
          </View>
          <TouchableOpacity style={styles.removeButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.cartItem}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>Diğer Ürün</Text>
          </View>
          <TouchableOpacity style={styles.removeButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}> Onayla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItems: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    marginLeft: 'auto',
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: 'tomato',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CartScreen;
