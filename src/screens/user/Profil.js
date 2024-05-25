import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ImageBackground, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../../../firebaseconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const { height } = Dimensions.get('window');
const headerHeight = height * 0.25;

const Profil = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setEditedData(data);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.log('Error getting document:', error);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('userlogin');
      })
      .catch((error) => alert(error.message));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, editedData);
      setUserData(editedData);
      setIsEditing(false);
      Alert.alert('Başarı', 'Bilgileriniz başarıyla güncellendi.');
    } catch (error) {
      console.log('Error updating document:', error);
      Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu.');
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleChange = (key, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/bacground.png')}
        style={styles.header}
        resizeMode="cover"
      >
        <Text style={styles.headerText}>Profil</Text>
      </ImageBackground>

      <Image source={require('../../../assets/image1.jpg')} style={styles.profileImage} />

      <View style={styles.content}>
        <View style={styles.profileInfo}>
          {userData && (
            <View style={styles.userInfo}>
              <InfoItem
                label="İsim"
                value={editedData.name}
                iconName="user"
                editable={isEditing}
                onChangeText={(text) => handleChange('name', text)}
              />
              <InfoItem
                label="Email"
                value={editedData.email}
                iconName="envelope"
                editable={false}
              />
              <InfoItem
                label="Telefon"
                value={editedData.phone}
                iconName="phone"
                editable={isEditing}
                onChangeText={(text) => handleChange('phone', text)}
              />
              {userData.address && (
                <InfoItem
                  label="Adres"
                  value={editedData.address}
                  iconName="map-marker"
                  editable={isEditing}
                  onChangeText={(text) => handleChange('address', text)}
                />
              )}
            </View>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editButtons}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <FontAwesome name="edit" size={24} color="#32127a" style={styles.actionIcon} />
              <Text style={styles.actionText}>Düzenle</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignOut} style={styles.actionButton}>
              <FontAwesome name="sign-out" size={24} color="#32127a" style={styles.actionIcon} />
              <Text style={styles.actionText}>Çıkış</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const InfoItem = ({ label, value, iconName, editable, onChangeText }) => (
  <View style={styles.infoItem}>
    <FontAwesome name={iconName} size={24} color="#32127a" style={styles.icon} />
    <TextInput
      style={styles.infoText}
      value={value}
      placeholder={`${label}: ${value}`}
      placeholderTextColor="#888"
      editable={editable}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: headerHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
    fontWeight: '700',
    color: 'white',
  },
  profileImage: {
    width: 120,
    height: 120,
    position: 'absolute',
    top: headerHeight - 60,
    alignSelf: 'center',
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 70,
  },
  userInfo: {},
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#888',
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#32127a',
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#32127a',
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#32127a',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#32127a',
    borderRadius: 5,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  actionIcon: {
    marginRight: 10,
  },
  actionText: {
    color: '#32127a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#32127a',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#32127a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profil;
