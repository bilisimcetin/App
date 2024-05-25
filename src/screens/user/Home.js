import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Profil from './Profil';
import HScreen from './HScreen';
import Cart from './Cart';
import { colors } from '../globals/style';
import ShowOrder from './ShowOrder';

const Home = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  
  return (
    <View style={styles.container}>
      {selectedTab === 0 ? (
        <HScreen />
      ) : selectedTab === 1 ? (
        <Cart setSelectedTab={setSelectedTab} />
      ) : selectedTab === 2 ? (
        <Profil />
      ) : selectedTab === 3 ? (
        <ShowOrder/>
      ) : null}

      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.bottomTab} onPress={() => setSelectedTab(0)}>
          <AntDesign name="home" size={35} color={selectedTab === 0 ? '#32127a' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => setSelectedTab(1)}>
          <AntDesign name="shoppingcart" size={35} color={selectedTab === 1 ? '#32127a' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => setSelectedTab(2)}>
          <FontAwesome name="user-circle-o" size={35} color={selectedTab === 2 ? '#32127a' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => setSelectedTab(3)}>
          <Feather name="box" size={35}  color={selectedTab === 3 ? '#32127a' : 'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  bottomView: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
  },

  bottomTab: {
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
