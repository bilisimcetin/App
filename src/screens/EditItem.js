import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseconfig';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditItem = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [name, setName] = useState(route.params.data.name);
  const [price, setPrice] = useState(route.params.data.price.toString());
  const [discountPrice, setDiscountPrice] = useState(route.params.data.discountPrice.toString());
  const [quantity, setQuantity] = useState(route.params.data.quantity);

  const pickerItems = Array.from({ length: 100 }, (_, index) => (
    <Picker.Item key={index} label={`${index}`} value={index} />
  ));

  const uploadItem = async () => {
    try {
      const itemDocRef = doc(db, 'items', route.params.id);
      await setDoc(itemDocRef, {
        quantity: quantity,
        name: name,
        price: parseFloat(price),
        discountPrice: parseFloat(discountPrice),
      }, { merge: true });
      console.log('Item updated successfully');
      navigation.goBack();
      Alert.alert('Başarılı', 'Ürün başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating item: ', error);
      Alert.alert('Hata', 'Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ürünü Düzenle</Text>
      <View style={styles.divider} />
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
        value={price}
        onChangeText={(text) => setPrice(text)}
        placeholderTextColor="#32127a"
      />
      <TextInput
        placeholder="Ürün İndirim Fiyatını Girin :"
        style={styles.inputStyle}
        value={discountPrice}
        onChangeText={(text) => setDiscountPrice(text)}
        placeholderTextColor="#32127a"
      />
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
      <TouchableOpacity style={styles.uploadBtn} onPress={uploadItem}>
        <Text style={styles.uploadBtnText}>Güncelle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
        <Text style={styles.cancelBtnText}>İptal</Text>
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
  cancelBtn: {
    backgroundColor: '#fff',
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#32127a',
  },
  cancelBtnText: {
    color: '#32127a',
    fontSize: 18,
  },
});

export default EditItem;
