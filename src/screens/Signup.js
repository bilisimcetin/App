import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { titles, colors, btn1, hr90 } from './globals/style'
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth , db} from '../../firebaseconfig';
import {doc,setDoc} from 'firebase/firestore'
import 'firebase/firestore'

import firebase from 'firebase/app'; 


const Signup = ({ navigation }) => {
    const [emailfocus, setEmailfocus] = useState(false);
    const [passwordfocus, setPasswordfocus] = useState(false);
    const [phonefocus, setPhonefocus] = useState(false);
    const [namefocus, setNamefocus] = useState(false);

    const [showpassword, setShowpassword] = useState(false);
    const [showcpassword, setShowcpassword] = useState(false);
    const [cpasswordfocus, setcPasswordfocus] = useState(false);

    //taking form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setcPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    // console.log(email);

    const [customError, setCustomError] = useState('');
    const [successmsg, setSuccessmsg] = useState(null);

    const getCoordinates = async (address) => {
        const apiKey = 'AIzaSyBu45lcxxeWMAhOjXmPtNS79NNBJTIg04Q';
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
        const data = await response.json();
        const location = data.results[0].geometry.location;
        return {
            latitude: location.lat,
            longitude: location.lng
        };
    };


    const handleSignup = async () => {
        if (password !== cpassword) {
            setCustomError("Şifreler Uyuşmuyor");
            return;
        } else if (phone.length !== 10) {
            setCustomError("Telefon numarası 10 karakter olmalı");
            return;
        }

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials?.user;
            if (user?.uid != null) {
                const role = 'admin';
                const coordinates = await getCoordinates(address);
                await setDoc(doc(db, "admins", user.uid), {
                    email: email,
                    password: password,
                    phone: phone,
                    name: name,
                    address: address,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    role: role,
                    uid: user.uid,
                });
                setSuccessmsg('Restoran başarıyla kaydedildi');
                console.log('Data added to Firestore');
            }
        } catch (error) {
            console.log('Sign up error: ', error.message);
            if (error.message.includes('auth/email-already-in-use')) {
                setCustomError('Email Zaten Kullanılıyor');
            } else if (error.message.includes('auth/invalid-email')) {
                setCustomError('Geçersiz Mail Formatı');
            } else if (error.message.includes('auth/weak-password')) {
                setCustomError('Şifre en az 6 karakter olmalı');
            } else {
                setCustomError(error.message);
            }
        }
    };
    return (
        <View style={styles.container}>
            {successmsg == null ?
                <View style={styles.container}>
                    <Text style={styles.head1}>Restoran Kayıt</Text>
                    {customError !== '' && <Text style={styles.errormsg}>{customError}</Text>}
                    <View style={styles.inputout}>
                        <AntDesign name="user" size={24} color={namefocus === true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder="Restoran İsmi" onFocus={() => {
                            setEmailfocus(false)
                            setPasswordfocus(false)
                            setShowpassword(false)
                            setNamefocus(true)
                            setPhonefocus(false)
                            setCustomError('')
                        }}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>


                    <View style={styles.inputout}>
                        <Entypo name="email" size={24} color={emailfocus === true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder="Mail" onFocus={() => {
                            setEmailfocus(true)
                            setPasswordfocus(false)
                            setShowpassword(false)
                            setNamefocus(false)
                            setPhonefocus(false)
                            setCustomError('')
                        }}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    {/*  */}

                    <View style={styles.inputout}>
                        <Feather name="smartphone" size={24} color={phonefocus === true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder="Telefon Numarası" onFocus={() => {
                            setEmailfocus(false)
                            setPasswordfocus(false)
                            setShowpassword(false)
                            setNamefocus(false)
                            setPhonefocus(true)
                            setCustomError('')
                        }}
                            onChangeText={(text) => setPhone(text)}
                        />
                    </View>



                    {/* password start */}
                    <View style={styles.inputout}>
                        <MaterialCommunityIcons name="lock-outline" size={24} color={passwordfocus == true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder="Şifre" onFocus={() => {
                            setEmailfocus(false)
                            setPasswordfocus(true)
                            setShowpassword(false)
                            setNamefocus(false)
                            setPhonefocus(false)
                            setCustomError('')
                        }}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={showpassword === false ? true : false}
                        />

                        <Octicons name={showpassword == false ? "eye-closed" : "eye"} size={24} color="black" onPress={() => setShowpassword(!showpassword)} />
                    </View>
                    {/*  */}
                    <View style={styles.inputout}>
                        <MaterialCommunityIcons name="lock-outline" size={24} color={cpasswordfocus == true ? colors.text1 : colors.text2} />
                        <TextInput style={styles.input} placeholder="Şifreyi doğrula" onFocus={() => {
                            setEmailfocus(false)
                            setPasswordfocus(false)
                            setShowpassword(true)
                            setNamefocus(false)
                            setPhonefocus(false)
                            setCustomError('')

                        }}
                            onChangeText={(text) => setcPassword(text)}
                            secureTextEntry={showcpassword === false ? true : false}
                        />

                        <Octicons name={showcpassword == false ? "eye-closed" : "eye"} size={24} color="black" onPress={() => setShowcpassword(!showcpassword)} />
                    </View>
                    {/* password end */}

                    <Text style={styles.address}>Lütfen Adresinizi Giriniz</Text>
                    <View style={styles.inputout} >
                        <TextInput style={styles.input1} placeholder="Adresinizi Giriniz" onChangeText={(text) => setAddress(text)}
                            onPress={() => {
                                setEmailfocus(false)
                                setPasswordfocus(false)
                                setShowpassword(false)
                                setNamefocus(false)
                                setPhonefocus(false)
                                setCustomError('')
                            }}
                        />
                    </View>



                    <TouchableOpacity style={btn1} onPress={() => handleSignup()}>
                        <Text style={{ color: colors.col1, fontSize: titles.btntxt, fontWeight: "bold" }}>Kaydol</Text>
                    </TouchableOpacity>


                    {/* <Text style={styles.forgot}>Forgot Password?</Text> */}
               
                    <View style={hr90}></View>
                    <Text> Zaten bir hesabınız var mı?
                        <Text style={styles.signup} onPress={() => navigation.navigate('login')}>Giriş Yap</Text>
                    </Text>
                </View>
                :
                <View style={styles.container1}>
    <Text style={styles.successmessage}>{successmsg}</Text>
    <TouchableOpacity style={styles.successBtn} onPress={() => navigation.navigate('login')}>
        <AntDesign name="login" size={24} color='#32127a'/>
        <Text style={styles.successBtnText}>Giriş Yap</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.successBtn} onPress={() => setSuccessmsg(null)}>
        <AntDesign name="arrowleft" size={24} color='#32127a'/>
        <Text style={styles.successBtnText}>Geri Dön</Text>
    </TouchableOpacity>
</View>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        // justifyContent: 'center',
         marginTop: 60,
    },
    container1: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
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
    },
    input: {
        fontSize: 18,
        marginLeft: 10,
        width: '80%',
    },
    forgot: {
        color: colors.text2,
        marginTop: 20,
        marginBottom: 10,
    },
    or: {
        color: colors.text1,
        marginVertical: 10,
        fontWeight: 'bold',
    },
    gftxt: {
        color: colors.text2,
        marginBottom: 10,
        fontSize: 25,
    },
    gf: {
        flexDirection: 'row'
    },
    gficon: {
        backgroundColor: 'white',
        width: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        elevation: 20,
    },
    signup: {
        color: colors.text1,
    },
    address: {
        fontSize: 18,
        color: colors.text2,
        textAlign: 'center',
        marginTop: 20,
    },
    errormsg: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    successmessage: {
        color: 'green',
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        borderColor: 'green',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    successBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderColor: '#32127a',
        borderWidth: 2,
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        width: '80%',
    },
    successBtnText: {
        color: '#32127a',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10, // İkon ile metin arasındaki boşluğu ayarlamak için
    },
    

})

export default Signup