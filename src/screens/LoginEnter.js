import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from './globals/style'

const LoginEnter = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Login Type</Text>

      <TouchableOpacity style={styles.btn} onPress={() => {navigation.navigate('login')}}>
        <Text style={styles.btnText}>Admin Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => {navigation.navigate('userlogin')}}>
        <Text style={styles.btnText}>User Login</Text>
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
    },

    title:{
        fontSize:20,
        fontWeight:'700',

    },

    btn:{

        backgroundColor:'tomato',
        width:'60%',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:30,

    },

    btnText:{
        fontSize:20,
        
        fontWeight:'600',

    }
})