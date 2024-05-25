import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from './globals/style'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const LoginEnter = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lütfen Kullanıcı Türünü Seçiniz </Text>

      <TouchableOpacity style={[styles.btn]} onPress={() => {navigation.navigate('login')}}>
        <MaterialIcons name="restaurant" size={24} color="white" />
        <Text style={styles.btnText}> Restoran Giriş</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn]} onPress={() => {navigation.navigate('userlogin')}}>
        <FontAwesome name="user" size={24} color="white" />
        <Text style={styles.btnText}> Kullanıcı Giriş</Text>
      </TouchableOpacity>
    </View>
  )
}

export default LoginEnter

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white', // Aynı renk
    },

    title:{
        fontSize:22,
        fontWeight:'700',
        marginBottom: 30,
    },

    btn:{
        width:'60%',
        borderRadius:10,
        flexDirection: 'row', // Yatay düzen için flex-direction ekledik
        justifyContent:'center',
        alignItems:'center',
        marginBottom: 20,
        paddingVertical: 15,
        backgroundColor:'#32127a', // Aynı renk
    },

    btnText:{
        fontSize:20,
        fontWeight:'600',
        color: '#fff',
        marginLeft: 10, // İkon ile metin arasındaki boşluğu sağlar
    },
})
