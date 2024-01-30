import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from '../Alert';
import {ActivityIndicator} from 'react-native-paper';
import SmsRetriever from 'react-native-sms-retriever';

const Login = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [showAlert3, setShowAlert3] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const requestPhoneNumber = async () => {
      try {
        const phoneNumber = await SmsRetriever.requestPhoneNumber();
        setPhone(phoneNumber.substring(3));
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    };

    if (isPhoneFocused && !phone) {
      requestPhoneNumber();
    }
  }, [isPhoneFocused, phone]);

  const handleLogin = async () => {
    setIsLoading(true);

    const desiredPhone = phone;
    const desiredPassword = password;

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(desiredPhone)) {
      setIsLoading(false);
      setShowAlert(true);
      return;
    }

    if (desiredPassword.length < 6) {
      setIsLoading(false);
      setShowAlert2(true);
      return;
    }

    firebase
      .firestore()
      .collection('Empolyeelist')
      .where('phone', '==', desiredPhone)
      .where('password', '==', desiredPassword)
      .get()
      .then(querySnapshot => {
        setIsLoading(false);

        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            const data = doc.data(); 
            const rqData = {
              name: data.name,
              designation: data.designation,
              roleId: data?.roleId,
              id: data.id,
              image:data.imageUri
            };
            AsyncStorage.setItem('name', JSON.stringify(rqData));
            navigation.replace('Home');
          });
        } else {
          setShowAlert3(true);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error getting documents:', error);
      });
    setPhone('');
    setPassword('');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{height: '100%', width: '100%'}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(5),
          }}>
          <Image
            style={styles.logoimage}
            source={require('../../assests/images/RTS.png')}
          />
          <View style={{marginTop: hp(1)}}>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              maxLength={10}
              keyboardType="numeric"
              onChangeText={text => setPhone(text)}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
              placeholderTextColor={isPhoneFocused ? '#1E5B70' : 'grey'}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={text => setPassword(text)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              placeholderTextColor={isPasswordFocused ? '#1E5B70' : 'grey'}
            />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button}
            onPress={handleLogin}>
            <Text style={styles.logintext}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <Alert
          isVisible={showAlert}
          title="Invalid Phone Number"
          message="No user found with the specified credentials."
          onClose={() => setShowAlert(false)}
        />
        <Alert
          isVisible={showAlert2}
          title="Invalid Password"
          message="No user found with the specified credentials."
          onClose={() => setShowAlert2(false)}
        />
        <Alert
          isVisible={showAlert3}
          title="Invalid credentials"
          message="No user found with the specified credentials."
          onClose={() => setShowAlert3(false)}
        />
        <View style={{position: 'absolute', top: hp(45), left: wp(44)}}>
          {isLoading && (
            <ActivityIndicator size={45} animating={true} color={'#1E5B70'} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  logoimage: {
    height: hp(28),
    width: wp(50),
    resizeMode: 'contain',
    borderWidth: 1,
    marginTop: hp(10),
  },
  input: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderWidth: 1,
    borderColor: 'lightgrey',
    width: wp(90),
    backgroundColor: 'lightgrey',
    borderRadius: wp(1),
    marginTop: hp(2),
  },
  button: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    width: wp(60),
    backgroundColor: '#1a6372',
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
    elevation: 5,
  },
  logintext: {
    fontSize: hp(3),
    color: 'white',
    fontFamily: 'OpenSans-Bold',
  },
});
