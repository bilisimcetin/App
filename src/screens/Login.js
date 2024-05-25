import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { colors, titles, btn1, hr90 } from './globals/style';

const Login = ({ navigation }) => {

  const [emailfocus, setEmailfocus] = useState(false);
  const [passwordfocus, setPasswordfocus] = useState(false);
  const [showpassword, setShowpassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customerror, setCustomError] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // Firestore'dan kullanıcının rolünü kontrol et
        const userDoc = await getDoc(doc(db, "admins", user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          navigation.navigate('dashboard');
        } else {
          setCustomError('Bu portala erişim izniniz yok.');
        }
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.log(errorMessage);
        if (errorMessage === 'Firebase: The email address is badly formatted. (auth/invalid-email).') {
          setCustomError('Lütfen geçerli bir e-posta adresi girin.');
        } else {
          setCustomError('Geçersiz şifre veya mail');
        }
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.head1}>Restoran Giriş</Text>
      {customerror !== '' && <Text style={styles.errormsg}>{customerror}</Text>}
      <View style={styles.inputout}>
        <AntDesign name="user" size={24} color={emailfocus === true ? colors.text1 : colors.text2} />
        <TextInput style={styles.input} placeholder={'Email Gir '}
          onFocus={() => {
            setEmailfocus(true)
            setPasswordfocus(false)
            setShowpassword(false)
            setCustomError('')
          }}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputout}>
        <MaterialCommunityIcons name="lock-outline" size={24} color={passwordfocus == true ? colors.text1 : colors.text2} />
        <TextInput style={styles.input} placeholder={'Şifre Gir '}
          onFocus={() => {
            setEmailfocus(false)
            setPasswordfocus(true)
            setCustomError('')
          }}
          secureTextEntry={showpassword === false ? true : false}
          onChangeText={(text) => setPassword(text)}
        />
        <Octicons name={showpassword == false ? "eye-closed" : "eye"} size={24} color="black" onPress={() => setShowpassword(!showpassword)} />
      </View>
      <TouchableOpacity style={btn1} onPress={() => handleLogin()}>
        <Text style={styles.btnText}>Giriş</Text>
      </TouchableOpacity>
      <View style={hr90}></View>
      <Text style={styles.signup} onPress={() => navigation.navigate('signup')}>
        Hesabın yok mu? <Text style={{ color: colors.text1 }}>Kaydol</Text>
      </Text>
      <Text style={styles.Text}>ya da</Text>
      <Text style={styles.signup} onPress={() => navigation.navigate('userlogin')}>
        Kullanıcı Girişi
      </Text>
    </View>
  )
}

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
    marginLeft: 10,
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
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

export default Login;
