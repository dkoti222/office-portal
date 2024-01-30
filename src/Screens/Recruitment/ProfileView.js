import { View, Text, StyleSheet, TouchableOpacity, Image, Modal,Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { Calendar } from 'react-native-calendars';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const ProfileView = ({ navigation }) => {

  const [nameDetails, setNameDetails] = useState('');
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [statusOptions, setStatusOptions] = useState(['OfferRelease', 'Reject', 'OfferHold']);
  const [date, setDate] = useState(null);


  const storeEmployeeId = async () => {
    const result = await AsyncStorage.getItem('PROFILENAME');
    const parseItem = JSON.parse(result)
    setNameDetails(parseItem)
    setIsLoading(true)
    if (parseItem) {
      const attendanceRef = firebase.firestore().collection('Recruitment');
      const query = attendanceRef
        .where('name', '==', parseItem.name)
      query
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = doc.data();
            const docId = doc.id;
            data.docId = docId;
            setNameDetails(data);

          });
        })
        .catch(error => {
          console.error('Error getting documents:', error);
        });
    }
    setIsLoading(false)
  };

  useEffect(() => {

    storeEmployeeId();
    if (nameDetails.status === 'OfferRelease') {
      setStatusOptions(['Onboarding', 'Reject'])
    }
    else if (nameDetails.status === 'OfferHold') {
      setStatusOptions(['Onboarding', 'Reject']);
    }
    else if (nameDetails.status === 'Onboarding') {
      setStatusOptions(['Fired', 'Resign']);
    }
  }, [nameDetails.status]);

  const updateStatus = () => {
    setIsLoading(true)
    if (status == null) {
      setIsLoading(false)
      console.log('kkkkkkk')
      return;
    }

    if (nameDetails.docId) {
      firestore()
        .collection('Recruitment')
        .doc(nameDetails.docId)
        .update({
          status: status,
          date: date
        })
        .then(() => {
          console.log('User updated!----')

        })
    }
    setIsLoading(false)
    if (status === 'Onboarding') {
      navigation.replace('Onboarding');
    } else {
      navigation.replace('Recruitment');
    }

  }

  const openDocument = async () => {
    console.log(nameDetails.imagedata.fileCopyUri);

    try {
      await FileViewer.open(nameDetails.imagedata.fileCopyUri);
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };


  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    setDate(selectedDate);
    setCalendarVisible(!isCalendarVisible)
    console.log(selectedDate);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f1f1' }}>

      <View style={styles.top}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Recruitment")}
        >
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headtext}>Candidate Info</Text>
        <TouchableOpacity
          onPress={
            openDocument
          }
        >
          <MaterialIcons name="drive-file-move" size={30} color="white" />

        </TouchableOpacity>
      </View>

       
       <View style={{flexDirection:'row',width:wp(100),alignItems:'center',paddingVertical:hp(2)}}>
       <View style={styles.circle}>
            <Image
              style={styles.empolyeimage}
           source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgI3cUdSnwYykjaVMjDjGgk28b2Gr91_bAEQ&usqp=CAU'}}
            />
        </View>
        <View style={{ marginLeft:wp(8)}}>
        <Text style={styles.nametext}>Duddu Koti</Text>
        <TouchableOpacity style={styles.status}>
            <Text style={styles.statustext}>Status</Text>
          </TouchableOpacity>
        </View>
        

       </View>


       <Text style={styles.subheader}>Personal Information</Text>
             
      <View style={{ marginLeft:wp(5)}}> 
        
         <View style={styles.rowicon}>
             <View style={styles.circle2}>
             <Ionicons name="call-outline" size={20} color="white" />
             </View>
          
            <Text style={styles.text}>{nameDetails.phone}</Text>
          </View>
          <View style={styles.rowicon}>
          <View style={styles.circle2}>
            <Fontisto name="email" size={20} color="white" />
            </View>
            <Text style={styles.text}>{nameDetails.email}</Text>
          </View>
       
     
        
          <View style={styles.rowicon}>
          <View style={styles.circle2}>
            <FontAwesome5 name="toolbox" size={19} color="white" />
            </View>
            <Text style={styles.text}>Experience: {nameDetails.experience} years</Text>
          </View>
        
          <View style={styles.rowicon}>
          <View style={styles.circle2}>
            <FontAwesome6 name="location-dot" size={20} color="white" />
            </View>
            <Text style={styles.text}>{nameDetails.address},INDIA</Text>
          </View>
        </View>




      {nameDetails.status !== 'Reject' && nameDetails.status !== 'Fired' && nameDetails.status !== 'Resign' ? (
        <SelectDropdown
          data={statusOptions}
          onSelect={(selectedItem, index) => {
            setStatus(selectedItem)
            setCalendarVisible(!isCalendarVisible)
          }}
          buttonTextAfterSelection={(selectedItem, index) => selectedItem}
          defaultButtonText="status"
          rowStyle={{
            borderRadius: wp(2),
            backgroundColor: '#f1f1f1',
            marginTop: hp(1),
            paddingHorizontal: wp(4),
            borderWidth: 1,
            borderColor: '#E97724'
          }}
          rowTextStyle={{ textAlign: 'left' }}
          buttonStyle={{
            paddingHorizontal: wp(4),
            paddingVertical: hp(1.5),
            width: wp(90),
            backgroundColor: 'white',
            marginTop: hp(2),
            borderRadius: wp(2),
            borderWidth: 1,
            borderColor: '#E97724',
       alignSelf:'center'
          }}
          dropdownStyle={{
            backgroundColor: '#d1d8e0',
            borderRadius: wp(2),
            paddingVertical: hp(2),
            paddingHorizontal: wp(3),
            borderWidth: 1,
            borderColor: '#E97724',
            height: hp(30)
          }}
          buttonTextStyle={{ color: 'black', textAlign: 'left', fontSize: hp(2) }}
          renderDropdownIcon={() => {
            return (
              <View>
                <Entypo name="chevron-down" size={30} color="black" />
              </View>
            );
          }}
        />
      ) : null}

      {status === 'Onboarding' &&
        <Modal transparent={true} visible={isCalendarVisible} animationType="slide">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: wp(80), backgroundColor: '#1E5B70', borderRadius: 10 }}>
              <TouchableOpacity
                onPress={() => setCalendarVisible(!isCalendarVisible)} >
                <Entypo
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: wp(4), paddingVertical: hp(1)
                  }}
                  name="circle-with-cross"
                  size={35}
                  color="white"
                />
              </TouchableOpacity>
              <Calendar
                onDayPress={(day) => handleDayPress(day)}
              />
            </View>


          </View>
        </Modal>
      }
      {nameDetails.status !== 'Reject' && nameDetails.status !== 'Fired' && nameDetails.status !== 'Resign' ? (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.button}
          onPress={updateStatus}
        >
          <Text style={styles.logintext}>UPDATE STATUS</Text>
        </TouchableOpacity>
      ) : null}

      <View style={{ position: 'absolute', top: hp(45), left: wp(44) }}>
        {isLoading && <ActivityIndicator size={45} animating={true} color={'#1E5B70'} />}
      </View>


    </View>
  )
}

export default ProfileView

const styles = StyleSheet.create({
  top: {
    height: hp(8),
    width: wp(100),
    backgroundColor: '#1E5B70',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp(8),
    paddingVertical: hp(1),
    justifyContent: 'space-between'
  },
  headtext: {
    fontSize: hp(2.7),
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
  },
  button: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderWidth: 1,
    width: wp(70),
    backgroundColor: '#1a6372',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
    borderColor: 'lightgrey',
    alignSelf:'center'
  },
  logintext: {
    fontSize: hp(3),
    color: 'white',
    fontFamily: 'OpenSans-SemiBold'
  },
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.22,
    height: Dimensions.get('window').width * 0.22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:wp(8)
  },

  empolyeimage: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.21,
    height: Dimensions.get('window').width * 0.21,
    resizeMode: 'contain',
  },
  status: {
    backgroundColor: '#1E5B70',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(0.6),
    borderRadius: 15,
    height:hp(3.5),
    width:wp(30),
    marginTop:hp(.5)
  },
  statustext: {
    color: 'white',
    fontSize: hp(1.7),
  },
  nametext:{
    fontSize: hp(2.5),
    color:'#1E5B70',
    textAlign:'center'
  },
  rowicon:{
    flexDirection:'row',
     paddingVertical:hp(.6), 
     marginBottom:hp(.5)
  },
  circle2: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.09,
    height: Dimensions.get('window').width * 0.09,
    backgroundColor: '#1E5B70',
    justifyContent:'center',
    alignItems:'center'
  },
  text: {
    fontSize: hp(2.3),
    color: '#1E5B70',
    marginLeft: wp(2),
    textAlign:'center',
    marginTop:hp(0.5)
  },
  subheader:{
    fontSize:hp(2.7),
    marginLeft:wp(5),
    fontFamily:'OpenSans-Bold',
    paddingVertical:hp(2),
    fontWeight:'700',
    color:'#1E5B70'
  }




})