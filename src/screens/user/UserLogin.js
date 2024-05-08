import { StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { colors,titles,btn1 , hr90 } from '../globals/style'
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase/app'; 
import { auth } from '../../../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth";


const UserLogin = ({navigation}) => {
  const [emailfocus, setEmailFocus] = useState(false);
  const [passwordfocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customError, setCustomError] = useState('');

  const handleLogin = () => {
      signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              navigation.navigate('home');
          })
          .catch((error) => {
              var errorMessage = error.message;
              console.log(errorMessage);
              if (errorMessage === 'Firebase: The email address is badly formatted. (auth/invalid-email)') {
                  setCustomError('Please enter a valid email address');
              } else {
                  setCustomError('Incorrect email or password');
              }
          });
  }

  return (
      <View style={styles.container}>
          <Text style={styles.head1}>User Login</Text>
          {customError !== '' && <Text style={styles.errormsg}>{customError}</Text>}
          <View style={styles.inputout}>
              <AntDesign name="user" size={24} color={emailfocus ? colors.text1 : colors.text2} />
              <TextInput
                  style={styles.input}
                  placeholder={'Enter Email'}
                  onFocus={() => {
                      setEmailFocus(true);
                      setPasswordFocus(false);
                      setShowPassword(false);
                      setCustomError('');
                  }}
                  onChangeText={(text) => setEmail(text)}
              />
          </View>
          <View style={styles.inputout}>
              <MaterialCommunityIcons name="lock-outline" size={24} color={passwordfocus ? colors.text1 : colors.text2} />
              <TextInput
                  style={styles.input}
                  placeholder={'Enter Password'}
                  onFocus={() => {
                      setEmailFocus(false);
                      setPasswordFocus(true);
                      setCustomError('');
                  }}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={!showPassword}
              />
              <Octicons
                  name={showPassword ? "eye-closed" : "eye"}
                  size={24}
                  color="black"
                  onPress={() => setShowPassword(!showPassword)}
              />
          </View>
          <TouchableOpacity style={styles.btn1} onPress={() => handleLogin()}>
              <Text style={{ color: colors.col1, fontSize: titles.btnText, fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
          <View style={hr90}></View>
          <Text style={styles.signup} onPress={() => navigation.navigate('usersignup')}>
              Don't have an account? <Text style={{ color: colors.text1 }}>Sign Up</Text>
          </Text>
      </View>
  );
}




const styles= StyleSheet.create({
 container:{


    flex:1,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
 },
 head1:{


    fontSize: titles.title1,
    color:colors.text1,
    textAlign:'center',
    marginVertical:10,

 },




inputout:{


    flexDirection:'row',
    width:'80%',
    marginVertical:10,
    backgroundColor: colors.col1,
    borderRadius:10,
    paddingHorizontal:10,
    paddingVertical:10,
    alignSelf:'center',
    elevation:20,
    fontSize:18,
    marginLeft:10,
    
    /*paddingLeft: 20,
    height :50,
    alignSelf:'center',
    marginTop: 30,
    borderWidth:0.5,
    borderRadius: 10,
    width:'90%',*/
},
input:{

fontSize:18,
marginLeft:10,
width:'80%',

},
/*loginBtn: {
    backgroundColor: 'red',
    width:'80%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 50,
    justifyContent:'center',
    alignItems:'center',

  },*/

  btnText:{

    fontSize:18,
    fontWeight:'600',
    color:'#000',
  },

  signup:{

color:colors.text1,


    },
})

export default UserLogin