import { StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { colors,titles,btn1 , hr90 } from './globals/style'
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase/app'; 
import { auth } from '../../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth";
const Login = ({navigation}) => {

    const [emailfocus ,setEmailfocus] = useState(false);
    const [passwordfocus, setPasswordfocus] = useState(false);
    const [showpassword,setShowpassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [customerror, setcustomError] = useState('');

    const handlelogin = () => {
      // console.log(email, password);
      signInWithEmailAndPassword(auth,email, password)
          .then((userCredential) => {
              // Signed in 
              // var user = userCredential.user;
              // console.log(user);
              // ...

              navigation.navigate('dashboard');
          })
          .catch((error) => {
              var errorMessage = error.message;
              console.log(errorMessage);
              if (errorMessage === 'Firebase: The email address is badly formatted. (auth/invalid-email).'
              ) {
                  setcustomError('Please enter a valid email address')
              }
              else {
                  setcustomError('Incorrect email or password')
              }
          })
  }

    
 
  return (
    <View style={styles.container}>
      <Text style={styles.head1}>Admin Login</Text>
      {customerror !== '' && <Text style={styles.errormsg}>{customerror}</Text>}
      <View style={styles.inputout}>
      <AntDesign name="user" size={24} color={emailfocus === true? colors.text1: colors.text2} />
      <TextInput style={styles.input} placeholder={'Enter Email ' }
      onFocus={() =>{

      setEmailfocus(true)
      setPasswordfocus(false)
      setShowpassword(false)
      setcustomError('')
     }}
     onChangeText={(text) => setEmail(text)}
     
     />
       
      </View>
      <View style={styles.inputout}>
        <MaterialCommunityIcons name="lock-outline" size={24}
        color={passwordfocus == true ? colors.text1 : colors.text2}/>
      <TextInput style={styles.input} placeholder={'Enter Password '}
      onFocus={() =>{

        setEmailfocus(false)
        setPasswordfocus(true)
        setcustomError('')
       }} 
       
       secureTextEntry={showpassword === false ? true : false}
       onChangeText={(text) => setPassword(text)}
       />

      <Octicons name={showpassword == false ? "eye-closed" : 
      "eye"} size={24} color="black" onPress={() => 
        setShowpassword(!showpassword)
      }/>
      </View>
      <TouchableOpacity style={btn1} onPress={() => handlelogin()}>
       <Text style={{color: colors.col1 , fontSize: titles.btnText,
    fontWeight: "bold"} } >Login</Text>
      </TouchableOpacity>

      <View style={hr90}></View>
      <Text style={styles.signup} onPress={() => navigation.navigate('signup')}>Don't have an account?
      
      <Text style={{color: colors.text1}}> Sign Up</Text>
      </Text>
      
      
      
    </View>
  )
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

export default Login