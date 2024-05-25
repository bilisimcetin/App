import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ShowOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
          );
          const querySnapshot = await getDocs(ordersQuery);
          const ordersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }));
          setOrders(ordersList);
        } else {
          console.log('Kullanıcı doğrulanmadı');
        }
      } catch (error) {
        console.error('Siparişler alınırken hata oluştu: ', error);
      }
    };

    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => {
    return (
      <View style={styles.orderContainer}>
        <Text style={styles.orderTitle}>Sipariş Tarihi: {new Date(item.data.timestamp.toDate()).toLocaleDateString()}</Text>
        {item.data.items.map((orderItem, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>Ürün Adı: {orderItem.itemName}</Text>
            <Text style={styles.itemText}>Adet: {orderItem.quantity}</Text>
            
          </View>
        ))}
        <View style={styles.divider} />
        <Text style={styles.orderDetail}>Admin İsim: {item.data.adminName}</Text>
        <Text style={styles.orderDetail}>Admin Adres: {item.data.adminAddress}</Text>
        <Text style={styles.orderDetail}>Admin E-mail: {item.data.adminEmail}</Text>
        <Text style={styles.orderDetail}>Admin Telefon: {item.data.adminPhone}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Siparişlerim</Text>
      <View style={styles.pageDivider} />
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default ShowOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  pageDivider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginBottom: 20,
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    borderColor: '#ccc', // Kenar rengi gri
    borderWidth: 1, // Kenar kalınlığı
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  orderDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  itemContainer: {
    marginTop: 15,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#444',
  },
  priceText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 10,
  },
  flatListContent: {
    paddingBottom: 80,
  },
});
