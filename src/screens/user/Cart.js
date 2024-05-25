import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../../../firebaseconfig';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ordersRef = collection(db, 'orders');

const Cart = ({ setSelectedTab }) => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setCartItems(userData.cart || []);
        } else {
          console.log('User not found');
        }
      } else {
        console.log('User not authenticated');
      }
    };

    fetchCartItems();
  }, []);

  const removeFromCart = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const updatedCart = userData.cart.filter(item => item.id !== itemId);
          await updateDoc(userDocRef, { cart: updatedCart });
          setCartItems(updatedCart);
        } else {
          console.log('User not found');
        }
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error removing item from cart: ', error);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Sepetinizde ürün bulunmamakta');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Kullanıcı doğrulanamadı');
      return;
    }

    try {
      const adminUid = cartItems[0].data.adminUid;
      const adminDocRef = doc(db, 'admins', adminUid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (!adminDocSnap.exists()) {
        console.error('Admin not found');
        return;
      }

      const adminData = adminDocSnap.data();

      if (!adminData) {
        console.error('Admin data is undefined');
        return;
      }

      const newOrderRef = await addDoc(ordersRef, {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems.map(item => ({
          itemId: item.id,
          itemName: item.data.name,
          itemPrice: item.data.price,
          quantity: 1,
        })),
        adminUid: adminUid,
        adminName: adminData.name,
        adminEmail: adminData.email,
        adminAddress: adminData.address,
        adminPhone: adminData.phone,
        timestamp: new Date(),
      });

      for (const item of cartItems) {
        const itemDocRef = doc(db, 'items', item.id);
        const itemDocSnap = await getDoc(itemDocRef);
        if (itemDocSnap.exists()) {
          const itemData = itemDocSnap.data();
          const newQuantity = itemData.quantity - 1;
          await updateDoc(itemDocRef, { quantity: newQuantity });
        }
      }

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { cart: [] });
      setCartItems([]);

      const newNotification = {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems.map(item => ({
          itemId: item.id,
          itemName: item.data.name,
          itemPrice: item.data.discountPrice,
        })),
        timestamp: new Date(),
      };

      const updatedNotifications = adminData.notifications
        ? [...adminData.notifications, newNotification]
        : [newNotification];

      await updateDoc(adminDocRef, { notifications: updatedNotifications });
      Alert.alert('Sepetiniz onaylandı');
    } catch (error) {
      console.error('Error during checkout: ', error);
    }
  };

  const handleBrowseRestaurants = () => {
    setSelectedTab(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sepetim</Text>
      <View style={styles.divider} />
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Sepetinizde ürün bulunmamakta !</Text>
          <Image source={require('../../../assets/shopping.png')} style={styles.emptyCartImage} />
          <TouchableOpacity style={styles.browseBtn} onPress={handleBrowseRestaurants}>
            <Text style={styles.browseText}>Restoranlara Bak</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={({ item }) => (
              <View style={styles.itemView}>
                <Image source={{ uri: item.data.imageUrl }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.nameText}>{item.data.name}</Text>
                  <View style={styles.priceView}>
                    <Text style={styles.priceText}>{'$' + item.data.discountPrice}</Text>
                    <Text style={styles.discountText}>{'$' + item.data.price}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeFromCartBtn}
                  onPress={() => removeFromCart(item.id)}
                >
                  <AntDesign name="close" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.adminInfoContainer}>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Sepeti Onayla</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Aynı hizalama için üst boşluk ekledik
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24, // Boyutunu büyüttük
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333', // Değiştirilen renk kodu
  },
  divider: {
    borderBottomColor: '#ccc', // Değiştirilen renk kodu
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  itemDetails: {
    flex: 1,
    margin: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    color: 'green',
    fontWeight: '700',
  },
  discountText: {
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  removeFromCartBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtn: {
    backgroundColor: '#32127a',
    bottom: 70,
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 20,
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: '#32127a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  browseText: {
    color: '#fff',
    fontSize: 20,
  },
  emptyCartImage: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 20,
    opacity: 0.6,
  },
});

export default Cart;