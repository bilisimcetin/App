import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Profil from './Profil';
import HScreen from './HScreen';
import Cart from './Cart';
import { colors } from '../globals/style';



const Home = () => {

  const [selectedTab, setSelectedTab] = useState(0)
  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.headerText}>Aşhanı</Text>
      </View>
        
        {selectedTab === 0 ? ( 
          <Cart/>
        ) : selectedTab === 1 ? (
          <HScreen/>
        ) : selectedTab === 2 ? ( 
          <Profil/>
        ) : null}

        <View style={styles.bottomView}>

            <TouchableOpacity style={styles.bottomTab} onPress={() => setSelectedTab(0)}>

            <AntDesign name="shoppingcart" size={35} color={ selectedTab == 0? 'tomato' :'black'} />

            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomTab} onPress={() => setSelectedTab(1)}>

            <AntDesign name="home" size={35} color={ selectedTab == 1? 'tomato' :'black'} />

            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomTab} onPress={() => setSelectedTab(2)}>

                <FontAwesome name="user-circle-o" size={35} color={ selectedTab == 2? 'tomato' :'black'}/>

            </TouchableOpacity>

        </View>
      
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  header:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'center',
    alignItems: 'flex-end', // Başlık konteynerini aşağıya kaydırır
    padding: 10,
    padding:10,
    elevation:20,
    backgroundColor:colors.col1,
   

  },

  headerText:{
    
    color:colors.text1,
    fontSize:24,
  },

  bottomView: {
    width: '100%',
    height: 60,
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
})

export default Home
