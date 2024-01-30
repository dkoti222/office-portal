import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Calendar} from 'react-native-calendars';
import Alert from '../Alert';
const Onboarding = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const profileGetRequiredName = id => {
    AsyncStorage.setItem('PROFILENAME', JSON.stringify(id));
    navigation.navigate('ProfileView');
  };

  const getItems = async () => {
    setIsLoading(true);
    try {
      firestore()
        .collection('Recruitment')
        .onSnapshot(snap => {
          const temArray = [];
          snap.forEach(item => {
            temArray.push(item.data());
          });
          setItems(temArray);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getItems();
  }, []);

  const OnboardingItems = items.filter(ele => ele.status === 'Onboarding');
  const renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.namesub}>{item.designation}</Text>
          <Text style={styles.namesub}>{item.email}</Text>
          <Text style={styles.namesub}>{item.phone}</Text>
        </View>
        <View>
          {/* <Text style={styles.name}>Offer Released</Text> */}
          <TouchableOpacity
            style={styles.status}
            onPress={() => profileGetRequiredName(item)}
            activeOpacity={1}>
            <Text style={styles.statustext}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
    setCalendarVisible(!isCalendarVisible)
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <View>
        <Text style={styles.headtext}>Onboarding</Text>
        {selectedDate && (
  <Text style={{ color: 'white', fontSize: hp(1.5),textAlign:'center' }}>
    {selectedDate}
  </Text>
)}
        </View>
       
        <TouchableOpacity onPress={toggleCalendar}>
          <Image
            style={styles.empolyeimage}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/2620/2620267.png',
            }}
          />
        </TouchableOpacity>
      </View>

      {/* <Modal visible={isCalendarVisible} animationType="slide">
        <View style={{flex: 1}}>
          <Calendar onDayPress={day => handleDayPress(day)} />
          <TouchableOpacity onPress={toggleCalendar}>
            <Text>Close Calendar</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}

<Modal transparent={true} visible={isCalendarVisible} animationType="slide">
               <View style={{ flex: 1,justifyContent:'center',alignItems:'center'}}>
               <View style={{width:wp(80),backgroundColor:'#1E5B70',borderRadius:10}}>
               <TouchableOpacity
              onPress={() => setCalendarVisible(!isCalendarVisible)} >
              <Entypo
              style={{alignSelf:'flex-end',
            marginRight:wp(4),paddingVertical:hp(1)}}
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

      {OnboardingItems.length > 0 ? (
        <FlatList
          data={
            selectedDate
              ? items.filter(item => item.date === selectedDate)
              : OnboardingItems
          }
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noData}>No data available</Text>
        </View>
      )}

      <View style={{position: 'absolute', top: hp(45), left: wp(44)}}>
        {isLoading && (
          <ActivityIndicator size={45} animating={true} color={'#1E5B70'} />
        )}
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  top: {
    height: hp(8),
    width: wp(100),
    backgroundColor: '#1E5B70',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp(8),
    paddingVertical: hp(1),
    justifyContent: 'space-between',
  },
  headtext: {
    fontSize: hp(2.6),
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    width: wp(95),
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(5),
    marginHorizontal: wp(2),
    borderRadius: wp(1),
    marginTop: hp(0.8),
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(50),
  },
  noData: {
    fontSize: hp(3),
    color: 'black',
  },
  name: {
    fontFamily: 'OpenSans-Bold',
    color: 'black',
    fontSize: hp(2.3),
    paddingVertical: hp(0.5),
  },
  namesub: {
    color: 'grey',
    fontFamily: 'OpenSans-Bold',
    fontSize: hp(2),
    paddingVertical: hp(0.1),
  },
  status: {
    backgroundColor: '#1E5B70',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(0.6),
    borderRadius: 15,
    height:hp(4),
    width:wp(30)
  },
  statustext: {
    color: 'white',
    fontSize: hp(1.7),
  },
  plusButton: {
    position: 'absolute',
    bottom: 40,
    left: wp(45),
  },
  loadingIndicator: {
    position: 'absolute',
    top: hp(45),
    left: wp(44),
  },
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.18,
    height: Dimensions.get('window').width * 0.18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fd9644',
  },
  empolyeimage: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.1,
    height: Dimensions.get('window').width * 0.1,
    resizeMode: 'contain',
  },
});
