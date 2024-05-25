import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Alert, Modal, TouchableOpacity } from 'react-native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'; // Yeni eklenen Ionicons import edildi
import { db, auth } from '../../../firebaseconfig';
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import OfferSlider from './OfferSlider';

const isItemInCart = (itemId, userCart) => {
  return userCart.some(item => item.id === itemId);
};

const HScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState([]);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLatitude !== null && userLongitude !== null) {
      getItems();
    }
  }, [userLatitude, userLongitude]);

  const getUserLocation = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserLatitude(userData.latitude);
        setUserLongitude(userData.longitude);
      } else {
        console.log('Kullanıcı bilgisi bulunamadı');
      }
    } catch (error) {
      console.error('Kullanıcı konumu alınamadı: ', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const getItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const tempData = [];

      querySnapshot.forEach((doc) => {
        tempData.push({
          id: doc.id,
          data: doc.data()
        });
      });

      const nearbyAdminItems = await Promise.all(tempData.map(async (item) => {
        const adminUid = item.data.adminUid;
        const adminDocRef = doc(db, 'admins', adminUid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
          const adminData = adminDocSnap.data();
          const distance = calculateDistance(
            userLatitude,
            userLongitude,
            adminData.latitude,
            adminData.longitude
          );

          if (distance <= 50) {
            return { ...item, adminInfo: adminData };
          } else {
            return null;
          }
        } else {
          console.log('Admin bilgisi bulunamadı');
          return null;
        }
      }));

      const filteredItems = nearbyAdminItems.filter(item => item !== null);
      setItems(filteredItems);
    } catch (error) {
      console.error('Ürünler alınamadı: ', error);
    }
  };

  const handleSearch = () => {
    console.log('Aranan metin:', searchText);
  };

  const onAddToCart = async (item) => {
    try {
      if (!item) {
        console.log('Ürün tanımsız');
        return;
      }

      if (item.data.quantity === 0) {
        Alert.alert('Bu ürün stokta yok.');
        return;
      }

      let userId;
      if (auth.currentUser) {
        userId = auth.currentUser.uid;
      } else {
        console.log('Kullanıcı kimliği bulunamadı');
        return;
      }

      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        if (userData.cart.length > 0) {
          Alert.alert('Sepetinizde zaten bir ürün var. Lütfen önce mevcut ürünü kaldırın.');
          return;
        }

        if (isItemInCart(item.id, userData.cart)) {
          Alert.alert('Bu ürün zaten sepetinizde var.');
          return;
        }

        const updatedCart = [...userData.cart, item];
        await updateDoc(userDocRef, { cart: updatedCart });
        Alert.alert('Ürün sepete başarıyla eklendi.');
        getItems();
      } else {
        console.log('Kullanıcı bulunamadı');
      }
    } catch (error) {
      console.error('Ürün sepete eklenirken hata oluştu: ', error);
    }
  };

  const showAddressOnMap = (adminInfo) => {
    const location = {
      latitude: adminInfo.latitude,
      longitude: adminInfo.longitude,
    };
    setSelectedLocation(location);
    setAdminInfo(adminInfo);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const isOutOfStock = item.data.quantity === 0;
    return (
      <View style={[styles.itemView, isOutOfStock && styles.outOfStockItem]}>
        <Image source={{ uri: item.data.imageUrl }} style={[styles.itemImage, isOutOfStock && styles.outOfStockImage]} />
        <View style={styles.itemDetails}>
          <Text style={[styles.nameText, isOutOfStock && styles.outOfStockText]}>{item.data.name}</Text>
          <View style={styles.priceView}>
            <Text style={[styles.priceText, isOutOfStock && styles.outOfStockText]}>{'$' + item.data.discountPrice}</Text>
            <Text style={[styles.discountText, isOutOfStock && styles.outOfStockText]}>{'$' + item.data.price}</Text>
          </View>
          <Text style={[styles.quantityText, isOutOfStock && styles.outOfStockText]}>Miktar: {item.data.quantity}</Text>
          <TouchableOpacity style={styles.addressButton} onPress={() => showAddressOnMap(item.adminInfo)}>
            <Text style={[styles.addressText, isOutOfStock && styles.outOfStockText]}>Adresi Göster</Text>
            <AntDesign name="arrowright" size={16} color="midnightblue" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => onAddToCart(item)} disabled={isOutOfStock}>
          <Ionicons name="add-circle-outline" size={45} color={isOutOfStock ? 'gray' : 'green'} style={{ alignSelf: 'center' }} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AşHanı</Text>
      <View style={styles.divider} />
      <OfferSlider />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedLocation && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={selectedLocation}
                  title="Adres"
                />
              </MapView>
            )}
            {adminInfo && (
              <View style={styles.adminInfoContainer}>
                <Text style={styles.adminInfoText}><Entypo name="phone" size={24} color="#32127a" /> Telefon: {adminInfo.phone}</Text>
                <Text style={styles.adminInfoText}><Entypo name="user" size={24} color="#32127a" /> İsim: {adminInfo.name}</Text>
                <Text style={styles.adminInfoText}><Entypo name="mail" size={24} color="#32127a" /> Email: {adminInfo.email}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  outOfStockItem: {
    backgroundColor: '#e0e0e0',
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  outOfStockImage: {
    opacity: 0.5,
  },
  itemDetails: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  outOfStockText: {
    color: '#a0a0a0',
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginRight: 10,
  },
  discountText: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'line-through',
    color: 'red',
  },
  quantityText: {
    fontSize: 16,
    marginBottom: 10,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  addressText: {
    fontSize: 16,
    color: 'midnightblue',
    marginRight: 5,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  adminInfoContainer: {
    marginBottom: 20,
  },
  adminInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#32127a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HScreen;
