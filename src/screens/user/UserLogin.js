import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { colors, titles, btn1, hr90 } from '../globals/style';
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const UserLogin = ({ navigation }) => {
  const [emailfocus, setEmailFocus] = useState(false);
  const [passwordfocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customError, setCustomError] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === 'user') {
          navigation.navigate('home');
        } else {
          setCustomError('Bu portala erişim izniniz yok.');
        }
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.log(errorMessage);
        if (errorMessage === 'Firebase: The email address is badly formatted. (auth/invalid-email)') {
          setCustomError('Lütfen geçerli bir e-posta adresi girin.');
        } else {
          setCustomError('Yanlış email veya şifre.');
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.head1}>Kullanıcı Giriş</Text>
      {customError !== '' && <Text style={styles.errormsg}>{customError}</Text>}
      <View style={styles.inputout}>
        <AntDesign name="user" size={24} color={emailfocus ? colors.text1 : colors.text2} />
        <TextInput
          style={styles.input}
          placeholder={'Email gir'}
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
        <MaterialCommunityIcons name="lock-outline" size={24}
        color={passwordfocus == true ? colors.text1 : colors.text2}/>
      <TextInput style={styles.input} placeholder={'Şifre Gir '}
      onFocus={() =>{

        setEmailFocus(false)
        setPasswordFocus(true)
        setCustomError('')
       }} 
       
       secureTextEntry={showPassword === false ? true : false}
       onChangeText={(text) => setPassword(text)}
       />

      <Octicons name={showPassword == false ? "eye-closed" : 
      "eye"} size={24} color="black" onPress={() => 
        setShowpassword(!showPassword)
      }/>
      </View>
      <TouchableOpacity style={btn1} onPress={handleLogin}>
        <Text style={{ color: colors.col1, fontSize: titles.btnText, fontWeight: "bold" }}>Giriş</Text>
      </TouchableOpacity>
      <View style={hr90}></View>
      <Text style={styles.signup} onPress={() => navigation.navigate('usersignup')}>
        Hesabın yok mu? <Text style={{ color: colors.text1 }}> Kaydol</Text>
      </Text>
      <Text style={styles.Text}>ya da</Text>
      <Text style={styles.signup} onPress={() => navigation.navigate('login')}>
        Restoran Girişi
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  head1: {
    fontSize: titles.title1,
    color: colors.text1,
    textAlign: 'center',
    marginVertical: 10,
  },
  inputout: {
    flexDirection: 'row',
    width: '80%',
    marginVertical: 10,
    backgroundColor: colors.col1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignSelf: 'center',
    elevation: 20,
    fontSize: 18,
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  signup: {
    color: colors.text1,
    fontSize: 18,
  },
  Text:{
    color: colors.text1,
    fontSize: 16,
  },
});

export default UserLogin;
