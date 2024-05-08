import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import OfferSlider from './OfferSlider';

const HScreen = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    // Arama işlemleri burada gerçekleştirilebilir
    console.log('Aranan metin:', searchText);
  };

  return (
    <View style={styles.container}>
      {/* Arama bileşeni */}
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={24} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ara..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Text style={styles.searchButton}>Ara</Text>
        </TouchableOpacity>
      </View>
      <OfferSlider/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20, // Arama bileşeninin üst kısmına boşluk ekler
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 10,
    width:'90%',
    elevation:10,
    margin:20,
  },
  searchIcon: {
    marginRight: 10, // Arama simgesi ile metin girişi arasına boşluk ekler
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchButton: {
    color: 'tomato', // İsteğinize göre düğme rengini değiştirebilirsiniz
    marginLeft: 10, // Metin girişi ile düğme arasına boşluk ekler
  },
});

export default HScreen;
