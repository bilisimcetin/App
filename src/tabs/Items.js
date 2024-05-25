import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseconfig';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Items = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const adminUid = auth.currentUser.uid;
      const q = query(collection(db, 'items'), where('adminUid', '==', adminUid));
      const querySnapshot = await getDocs(q);
      const tempData = [];
      querySnapshot.forEach((doc) => {
        tempData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setItems(tempData);
    } catch (error) {
      console.error('Error getting items: ', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'items', itemId));
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item: ', error);
      Alert.alert('Hata', 'Öğe silinirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
     <Text style={styles.title}>Yüklenenler</Text>
      <View style={styles.divider} />
      <FlatList
        data={items}
        renderItem={({ item }) => {
          return (
            <View style={styles.itemView}>
              <Image source={{ uri: item.data.imageUrl }} style={styles.itemImage} />
              <View style={styles.nameView}>
                <Text style={styles.nameText}>{item.data.name}</Text>
                <View style={styles.priceView}>
                  <Text style={styles.priceText}>{'$' + item.data.discountPrice}</Text>
                  <Text style={styles.discountText}>{'$' + item.data.price}</Text>
                </View>
                <Text style={styles.quantityText}>Miktar: {item.data.quantity}</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => {
                  navigation.navigate('edititem', {
                    data: item.data,
                    id: item.id,
                  });
                }}>
                  <AntDesign name="edit" size={24} color="black" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <AntDesign name="delete" size={24} color="black" style={[styles.icon, { marginTop: 20 }]} />
                </TouchableOpacity>
              </View>
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
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 20,
    borderRadius: 10,
    height: 100,
    marginBottom: 10,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '50%',
    margin: 10,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
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
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  iconContainer: {
    margin: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Items;
