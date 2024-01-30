import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, {firebase} from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';


const CalenderViewEmpolyee = ({navigation}) => {
  const [nameDetails, setNameDetails] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleDayPress = day => {
    setIsLoading(true)
    const date = day.dateString;
    console.log(date);
    const isSunday = new Date(date).getDay() === 0;

    if (isSunday) {
      setAttendanceData({
        status: 'Holiday',
        checkInTime: 'N/A',
        checkOutTime: 'N/A',
      });
    } else if (nameDetails) {
      firebase
        .firestore()
        .collection('Attendance')
        .where('checkInDate', '==', date)
        .where('name', '==', nameDetails.name)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
              const data = doc.data();
              console.log(data, 'lllllllllll');
              setAttendanceData(data);
            });
          } else {
            setAttendanceData({
              status: 'No Data Available',
              checkInTime: 'N/A',
              checkOutTime: 'N/A',
            });
            setIsLoading(false)
            console.log('No documents found with the specified name.');
          }
        })
        .catch(error => {
          console.error('Error getting documents:', error);
        });
    }
  };

  useEffect(() => {
    
    const nameData = async () => {
      const result = await AsyncStorage.getItem('name');
      const parseItem = JSON.parse(result);
      setNameDetails(parseItem);
      setIsLoading(true)
      if (parseItem) {
        const markedDatesData = {};
        firebase
          .firestore()
          .collection('Attendance')
          .where('name', '==', parseItem.name)
          .get()
          .then(querySnapshot => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach(doc => {
                const data = doc.data();
                const date = data.checkInDate;
                const status = data.status;
                const statusType = data.statusType;
                if (status === 'present' && statusType === 'Late') {
                  markedDatesData[date] = {
                    selected: true,
                    selectedColor: '#2980b9',
                  };
                } else if (status === 'present') {
                  markedDatesData[date] = {marked: true, dotColor: '#50cebb'};
                } else if (status === 'Absent') {
                  markedDatesData[date] = {
                    selected: true,
                    selectedColor: '#e74c3c',
                  };
                } else if (status === 'Holiday') {
                  markedDatesData[date] = {
                    selected: true,
                    selectedColor: '#f1c40f',
                  };
                }
              });
              setMarkedDates(markedDatesData);
              
            } else {
              console.log(markedDatesData, 'lllllllllllllllll');
              console.log('No documents found with the specified name.');
            }
          })
          .catch(error => {
            console.error('Error getting documents:', error);
          });
      }
      setIsLoading(false)
    };
    nameData();
  }, [markedDates]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
          <Text style={styles.headtext}>{nameDetails.name}</Text>
      </View>

      <View
        style={{
          width: wp(100),
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
        }}>
        <View style={{flexDirection: 'row', paddingVertical: hp(1)}}>
          <View style={{flexDirection: 'row', width: wp(40)}}>
            <MaterialCommunityIcons name="circle" size={18} color="#27ae60" />
            <Text style={styles.dottext}>Present</Text>
          </View>

          <View style={{flexDirection: 'row', width: wp(40)}}>
            <MaterialCommunityIcons name="circle" size={18} color="#2980b9" />
            <Text style={styles.dottext}>Late</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', paddingVertical: hp(1)}}>
          <View style={{flexDirection: 'row', width: wp(40)}}>
            <MaterialCommunityIcons name="circle" size={18} color="#e74c3c" />
            <Text style={styles.dottext}>Absent</Text>
          </View>

          <View style={{flexDirection: 'row', width: wp(40)}}>
            <MaterialCommunityIcons name="circle" size={18} color="#f1c40f" />
            <Text style={styles.dottext}>Holiday</Text>
          </View>
        </View>
      </View>
      <Calendar
        style={{paddingVertical: 2}}
        onDayPress={handleDayPress}
        markedDates={markedDates}
      />

      <View style={{width: wp(100)}}>
        <Text style={styles.status}>Status:{attendanceData.status}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: hp(1),
          }}>
          <Text style={styles.time}>CheckIn:{attendanceData.checkInTime} </Text>
          <Text style={styles.time}>
            CheckOut:{attendanceData.checkOutTime}{' '}
          </Text>
        </View>
      </View>
      <View style={{ position: 'absolute', top: hp(45), left: wp(44) }}>
          {isLoading && <ActivityIndicator size={45} animating={true} color={'#1E5B70'} />}
        </View>
    </View>
  );
};

export default CalenderViewEmpolyee;

const styles = StyleSheet.create({
  top: {
    height: hp(8),
    width: wp(100),
    backgroundColor: '#1E5B70',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
  },
  headtext: {
    fontSize: hp(3),
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
    marginLeft:wp(15),
    width:wp(60)
  },
  text: {
    fontSize: hp(2),
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
    marginLeft: wp(20),
  },
  dottext: {
    fontSize: hp(1.8),
    fontFamily: 'OpenSans-Medium',
    marginLeft: widthPercentageToDP(3),
    color: 'black',
  },
  selectedDateDescription: {
    fontSize: hp(3),
    fontFamily: 'OpenSans-Bold',
    color: 'white',
    marginLeft: wp(5),
  },

  time: {
    fontSize: hp(2),
    fontFamily: 'OpenSans-Bold',
    color: '#1E5B70',
  },
  status: {
    textAlign: 'center',
    marginVertical: hp(1),
    fontSize: hp(3),
    color: '#E97724',
  },
});
