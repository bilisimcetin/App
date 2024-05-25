import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseconfig';

const EditProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [name, setName] = useState(route.params.user.name);
  const [email, setEmail] = useState(route.params.user.email);
  const [password, setPassword] = useState(route.params.user.password);
  const [address, setAddress] = useState(route.params.user.address);
  const [phone, setPhone] = useState(route.params.user.phone);

  const handleUpdateProfile = async () => {
    try {
      const userDocRef = doc(db, 'admins', route.params.id);
      await setDoc(userDocRef, {
        name: name,
        email: email,
        password: password,
        address: address,
        phone: phone,
      }, { merge: true });
      console.log('Profile updated successfully');
      navigation.goBack();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'Error updating profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
