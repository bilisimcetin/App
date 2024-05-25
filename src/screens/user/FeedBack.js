import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '../../../firebaseconfig';
import { getDoc, doc } from 'firebase/firestore';

const FeedBack = ({ route }) => {
  const { cartItems } = route.params;
  const [adminData, setAdminData] = useState({});
  

  useEffect(() => {
    const fetchAdminData = async () => {
      const adminDataMap = new Map();

      await Promise.all(
        cartItems.map(async (item) => {
          const adminUid = item.data.adminUid;
          if (!adminDataMap.has(adminUid)) {
            try {
              const adminDocSnap = await getDoc(doc(db, 'admins', adminUid));
              if (adminDocSnap.exists()) {
                const adminDocData = adminDocSnap.data();
                adminDataMap.set(adminUid, adminDocData);
              }
            } catch (error) {
              console.error('Error fetching admin data:', error);
            }
          }
        })
      );

      console.log("Admin Data Map:");
      adminDataMap.forEach((value, key) => {
        console.log(`Admin UID: ${key}, Admin Data:`, value);
      });

      setAdminData(adminDataMap);
    };

    fetchAdminData();
  }, [cartItems]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İşlem Başarıyla Gerçekleştirildi</Text>
      <Text style={styles.subtitle}>Alınan Ürünler:</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => {
           
            console.log('Admin Data:', adminData);
            console.log('Item Admin UID:', item.data.adminUid);
            
        
            const admin = adminData[item.data.adminUid];
          
            return (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.data.name}</Text>
                <Text style={styles.itemInfo}>Fiyat: ${item.data.discountPrice}</Text>
                <Text style={styles.itemInfo}>Adet: {item.data.quantity}</Text>
          
                {adminData[item.data.adminUid] && (
  <>
    <Text style={styles.itemInfo}>Admin: {item.data.adminUid.name}</Text>
    <Text style={styles.itemInfo}>Admin Mail: {item.data.adminUid.mail}</Text>
    <Text style={styles.itemInfo}>Admin Telefon: {item.data.adminUid.phone}</Text>
    <Text style={styles.itemInfo}>Admin Adres: {item.data.adminUid.adress}</Text>
  </>
)}

              </View>
            );
          }}
          
          
        
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemInfo: {
    fontSize: 16,
    marginBottom: 3,
  },
});

export default FeedBack;
