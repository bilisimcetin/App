import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { colors } from '../screens/globals/style';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../../firebaseconfig';
import { addDoc, collection } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const Add = () => {
  const [quantity, setQuantity] = useState(1);
  const pickerItems = Array.from({ length: 100 }, (_, index) => (
    <Picker.Item key={index} label={`${index}`} value={index} />
  ));

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const resetForm = () => {
    setName('');
    setPrice('');
    setDiscountPrice('');
    setQuantity(1);
    setImage(null);
    setImageUrl('');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Fotoğraflarınıza erişim izni gerekiyor!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Seçilen Görüntü Sonucu:', result);

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      const imageURL = await uploadMedia(result.assets[0].uri);
      setImageUrl(imageURL);
    }
  };

  const uploadMedia = async (uri) => {
    try {
      const imageName = uri.substring(uri.lastIndexOf('/') + 1);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${imageName}`);
      await uploadBytes(storageRef, blob);

      const imageURL = await getDownloadURL(storageRef);
      return imageURL;
    } catch (error) {
      console.error('Resim yüklenirken hata oluştu:', error);
      return null;
    }
  };

  const uploadItem = async () => {
    try {
      if (!imageUrl) {
        throw new Error('Resim yüklenemedi veya URL boş');
      }

      const adminUid = auth.currentUser.uid;

      const docRef = await addDoc(collection(db, 'items'), {
        name: name,
        price: price,
        discountPrice: discountPrice,
        quantity: quantity,
        imageUrl: imageUrl,
        adminUid: adminUid,
      });

      console.log('Yeni öğe eklendi:', docRef.id);
      Alert.alert(
        'Başarılı',
        'Ürün başarıyla yüklendi!',
        [{ text: 'Tamam', onPress: resetForm }]
      );
    } catch (error) {
      console.error('Öğe eklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Ürün yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ürün Ekle</Text>
      <View style={styles.divider} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.inputout}>
        <TextInput
          placeholder="Ürün Adını Girin :"
          style={styles.inputStyle}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholderTextColor="#32127a"
        />
        <TextInput
          placeholder="Ürün Fiyatını Girin :"
          style={styles.inputStyle}
          value={price.toString()}
          onChangeText={(text) => setPrice(text)}
          placeholderTextColor="#32127a"
        />
        <TextInput
          placeholder="Ürün İndirim Fiyatını Girin :"
          style={styles.inputStyle}
          value={discountPrice.toString()}
          onChangeText={(text) => setDiscountPrice(text)}
          placeholderTextColor="#32127a"
        />
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>Miktar Girin:</Text>
        <Picker
          selectedValue={quantity}
          onValueChange={(itemValue) => setQuantity(itemValue)}
          style={styles.picker}
        >
          {pickerItems}
        </Picker>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.pickBtn} onPress={pickImage}>
        <Text style={styles.pickBtnText}>Galeriden Resim Seç</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadBtn} onPress={uploadItem}>
        <Text style={styles.pickBtnText}>Yükle</Text>
      </TouchableOpacity>
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
  inputStyle: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 30,
    alignSelf: 'center',
    color: '#32127a',
    elevation: 10,
    backgroundColor: '#fff',
  },
  inputout: {
    elevation: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 70,
    paddingRight: 70,
  },
  quantityText: {
    marginRight: 20,
    color: '#32127a',
    fontSize: 16,
  },
  picker: {
    width: '40%',
    height: 30,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 10,
    marginRight: 20,
    color: '#32127a',
  },
  pickBtn: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#32127a',
  },
  pickBtnText: {
    color: 'white',
    fontSize: 18,
  },
  uploadBtn: {
    backgroundColor: '#32127a',
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtnText: {
    color: 'white',
    fontSize: 18,
  },
  image: {
    width: '90%',
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default Add;
