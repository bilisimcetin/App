import { StyleSheet, Text, View,Image } from 'react-native'
import React, { useEffect } from 'react'
import logo from '../../assets/logo.png'
import { colors,hr90 } from './globals/style'

const Splash = ({navigation}) => {


    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('loginenter');
        }, 3000);
    }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AşHanı</Text>
      <View style={styles.logoout}>
        <Image source={logo} style={styles.logo}/>
      </View>
       <View style={hr90}/>
      <Text style={styles.text}>Haydi! Bizimle beraber gıda israfına dur de.</Text>
      <View style={hr90}/>
    </View>
  )
}



const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor:'#32127a',
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
  
      title:{
        fontSize:60,
        color:colors.col1,
        textAlign:'center',
        marginVertical:10,
        fontWeight:'400',
  
  
      },
      logoout: {
        
          marginVertical: 40, 
          width:"90%",
          height:"40%",
          alignItems:'center',
      },
  
      logo:{
          width:'80%',
          height:'90%',
      },
  
      text: {
          fontSize: 15,
          width: '80%',
          color: colors.col1,
          textAlign:'center',
        },
  
});

export default Splash