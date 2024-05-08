import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Profil = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
       
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity style={styles.editButton}>
          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.profileImageContainer}>
          <Image source={require('../../../assets/profil.png')} style={styles.profileImage} />
        </View>
        <Text style={styles.username}>Kullanıcı Adı</Text>
        <Text style={styles.fullName}>Ad Soyad</Text>
        <Text style={styles.email}>kullanici@mail.com</Text>
        <TouchableOpacity style={styles.logoutButton}>
          <AntDesign name="logout" size={24} color="white" />
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'tomato',
    borderRadius: 75,
    padding: 5,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fullName: {
    fontSize: 18,
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: 'tomato',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 5,
  },
});

export default Profil;
