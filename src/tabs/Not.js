import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../../firebaseconfig';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';

const Not = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminDocSnap = await getDoc(adminDocRef);

          if (adminDocSnap.exists()) {
            const adminData = adminDocSnap.data();
            const notifications = adminData.notifications || [];
            const updatedNotifications = await Promise.all(
              notifications.map(async (notification) => {
                const userPhone = await getUserPhone(notification.userId);
                const userEmail = await getUserEmail(notification.userId);
                const itemName = await getItemName(notification.items[0].itemId);
                const itemImage = await getItemImage(notification.items[0].itemId);
                return { ...notification, userPhone, userEmail, itemName, itemImage };
              })
            );

            setNotifications(updatedNotifications);
          } else {
            console.log('Yönetici bulunamadı');
          }
        } else {
          console.log('Kullanıcı kimlik doğrulaması yapılmadı');
        }
      } catch (error) {
        console.error('Bildirimler alınırken bir hata oluştu:', error);
      }
    };

    fetchNotifications();
  }, []);

  const getUserPhone = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.phone;
      } else {
        console.log('Kullanıcı bulunamadı');
        return null;
      }
    } catch (error) {
      console.error('Kullanıcı verisi alınırken hata oluştu:', error);
      return null;
    }
  };

  const getUserEmail = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.email;
      } else {
        console.log('Kullanıcı bulunamadı');
        return null;
      }
    } catch (error) {
      console.error('Kullanıcı verisi alınırken hata oluştu:', error);
      return null;
    }
  };

  const getItemName = async (itemId) => {
    try {
      const itemDocRef = doc(db, 'items', itemId);
      const itemDocSnap = await getDoc(itemDocRef);

      if (itemDocSnap.exists()) {
        const itemData = itemDocSnap.data();
        return itemData.name;
      } else {
        console.log('Ürün bulunamadı');
        return null;
      }
    } catch (error) {
      console.error('Ürün verisi alınırken hata oluştu:', error);
      return null;
    }
  };

  const getItemImage = async (itemId) => {
    try {
      const itemDocRef = doc(db, 'items', itemId);
      const itemDocSnap = await getDoc(itemDocRef);

      if (itemDocSnap.exists()) {
        const itemData = itemDocSnap.data();
        return itemData.imageUrl;
      } else {
        console.log('Ürün bulunamadı');
        return null;
      }
    } catch (error) {
      console.error('Ürün verisi alınırken hata oluştu:', error);
      return null;
    }
  };

  const deleteNotification = async (index) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
          const adminData = adminDocSnap.data();
          const updatedNotifications = [...adminData.notifications];
          updatedNotifications.splice(index, 1);

          await updateDoc(adminDocRef, { notifications: updatedNotifications });
          setNotifications(updatedNotifications);
        } else {
          console.log('Yönetici bulunamadı');
        }
      } else {
        console.log('Kullanıcı kimlik doğrulaması yapılmadı');
      }
    } catch (error) {
      console.error('Bildirim silinirken hata oluştu:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bildirimler</Text>
      <View style={styles.divider} />

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz bir bildirim yok</Text>
          <Image source={require('../../assets/not1.png')} style={styles.emptyNotImage} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item, index }) => (
            <View style={styles.notificationView}>
              <Text style={styles.notificationText}>Ürün: {item.itemName || 'N/A'}</Text>
              <Text style={styles.notificationText}>Kullanıcı E-posta: {item.userEmail || 'N/A'}</Text>
              <Text style={styles.notificationText}>Kullanıcı Telefon: {item.userPhone || 'N/A'}</Text>
              <Text style={styles.notificationText}>Zaman: {new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
              <TouchableOpacity style={styles.deleteIcon} onPress={() => deleteNotification(index)}>
                <AntDesign name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'black',
  },
  notificationView: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    position: 'relative',
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity:0.6,
  },
  emptyNotImage: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
    marginBottom: 20,
    opacity: 0.6,
  },
});

export default Not;