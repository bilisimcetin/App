import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image , SafeAreaView,Alert} from 'react-native'
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react'
import { colors } from '../screens/globals/style'
import * as ImagePicker from 'expo-image-picker'
import storage, {firebase} from '@react-native-firebase/storage'

import * as FileSystem from 'expo-file-system'

const Add = () => {
  const [quantity, setQuantity] = useState(1);
  const pickerItems = [...Array(100).keys()].map((num) => (
    <Picker.Item key={num} label={`${num + 0}`} value={num + 0} />
  ));
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [discountPrice, setDiscountPrice] = useState(0)
  
  const [image, setImage] = useState(null);
  const[uploading,setUploading] = useState(false);
  const pickImage = async () =>{

     let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect:[4,3],
      quality : 1,
     })
    
     if (!result.canceled){
      setImage(result.assets[0].uri);
     }

  };

  const uploadMedia = async () =>{


    setUploading(true);
  

  try {

    const {uri} = await FileSystem.getInfoAsync(image)
    const blob= await new Promise((resolve, reject) =>{

      const  xhr = new XMLHttpRequest();

      xhr.onload =() => {
        resolve(xhr.response);

      };
      xhr.onerror = (e) =>{
        reject(new TypeError('Network request failed'));
        
        
      };

      xhr.responseType ='blob';
      xhr.open('GET',uri,true);
      xhr.send(null);
    });

    const filename = image.substring(image.lastIndexOf('/') + 1);
    const ref = firebase.storage().ref().child(filename);

    await ref.put(blob);
    setUploading(false);
    Alert.alert('Photo uploaded!');
    setImage(null);
  }catch (error){
    
    console.error(error);
    setUploading(false)
   
  }

};

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Item</Text>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TextInput placeholder="Enter Item Name" style={styles.inputStyle} />
      <TextInput placeholder="Enter Item Price" style={styles.inputStyle} />
      <TextInput placeholder="Enter Item Discount Price" style={styles.inputStyle} />
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>Enter Number:</Text>
        <Picker
          selectedValue={quantity}
          onValueChange={(itemValue) => setQuantity(itemValue)}
          style={styles.picker}
        >
          {pickerItems}
        </Picker>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.pickBtn} onPress={pickImage}>
        <Text>Pick Image From Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadBtn} onPress={uploadMedia}>
        <Text>Upload</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    width: '120%',
    backgroundColor: '#fff',
    elevation: 5,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text1,
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
  },
  picker: {
    width: '40%',
    height: 30,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 10,
    marginRight: 20,
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
    backgroundColor: 'tomato',
  },
  uploadBtn: {
    backgroundColor: 'tomato',
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
