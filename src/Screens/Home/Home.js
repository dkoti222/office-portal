import { runOnJS } from 'react-native-reanimated';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,Dimensions,
FlatList,ImageBackground
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, {firebase} from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import {ActivityIndicator} from 'react-native-paper';
import Alert from '../Alert';
import { PanGestureHandler } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, { Extrapolate, interpolate, useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';



const data = [
  { id: 1, screen:'EmpolyeList',title: 'Empolyees',imageUri: 'https://cdn-icons-png.flaticon.com/128/6186/6186048.png' },
  { id: 2,screen:'Recruitment', title: 'Recruitment', imageUri: 'https://cdn-icons-png.flaticon.com/128/2303/2303847.png' },
  { id: 3, screen:'Onboarding',title: 'OnBoarding', imageUri: 'https://cdn-icons-png.flaticon.com/128/9139/9139457.png' },
  { id: 4, screen:'Attendance',title: 'Attendance', imageUri: 'https://cdn-icons-png.flaticon.com/128/3125/3125856.png' },
  { id: 5, title: 'Accounts', imageUri: 'https://cdn-icons-png.flaticon.com/128/2942/2942269.png' },
  { id: 6, title: 'Events', imageUri: 'https://cdn-icons-png.flaticon.com/128/1069/1069071.png' },
  { id: 7, title: 'Status', imageUri: 'https://cdn-icons-png.flaticon.com/128/6791/6791368.png' },
  { id: 8, title: 'Chat', imageUri: 'https://cdn-icons-png.flaticon.com/128/610/610413.png'},
  { id: 8, title: 'Others', imageUri: 'https://cdn-icons-png.flaticon.com/128/10156/10156115.png'},
];

const dataE = [
  { id: 1, screen:'CalenderViewEmpolyee',title: 'Attendance',imageUri: 'https://cdn-icons-png.flaticon.com/128/11473/11473518.png' },
  { id: 2, title: 'Leaves', imageUri: 'https://cdn-icons-png.flaticon.com/128/3387/3387188.png' },
  { id: 3, title: 'Status', imageUri: 'https://cdn-icons-png.flaticon.com/128/6791/6791368.png' },
  { id: 4, title: 'Chat', imageUri: 'https://cdn-icons-png.flaticon.com/128/610/610413.png' },
  { id: 5, title: 'Others', imageUri: 'https://cdn-icons-png.flaticon.com/128/10156/10156115.png' },
  { id: 6, title: 'Events', imageUri: 'https://cdn-icons-png.flaticon.com/128/1069/1069071.png' },
];


const Home = ({navigation}) => {
  const [nameDetails, setNameDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');

  const changeScreen=(item)=>{
    if(item.screen){
      navigation.navigate(item.screen)
    } else{
       setShowAlert(true)
    }
  }

  const renderItem = ({ item}) => (
    <TouchableOpacity style={styles.card}
    onPress={()=>changeScreen(item)} 
    >
       <View style={styles.circularImage}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
  
    </TouchableOpacity>
    
  );
  

  useEffect(() => {
    const nameData = async () => {
      const result = await AsyncStorage.getItem('name');
      console.log(result,'intial checkkkkkkkkkkk')
      const parseItem = JSON.parse(result);
      
      // console.log(parseItem,'kkkkkkkkkk')
      setNameDetails(parseItem);
      setIsLoading(false);
      if (parseItem && parseItem.id) {
        const attendanceRef = firebase.firestore().collection('Attendance');
        const query = attendanceRef
          .where('id', '==', parseItem.id)
          .where('checkInDate', '==', new Date().toISOString().split('T')[0]);

        query
          .get()
          .then(querySnapshot => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.checkInDate) {
                  if (!data.checkOutTime) {
                    setIsCheckIn(false);
                    setIsCheckOut(true);
                    setCheckInTime(data.checkInTime);
                  } else {
                    setIsCheckIn(false);
                    setIsCheckOut(false);
                    setCheckInTime(data.checkInTime);
                    setCheckOutTime(data.checkOutTime);
                  }
                } else {
                  setIsCheckIn(true);
                  setIsCheckOut(false);
                  setCheckInTime('');
                  setCheckOutTime('');
                }
              });
            } else {
              setIsCheckIn(true);
              setCheckInTime('');
              setCheckOutTime('');
            }
          })
          .catch(error => {
            console.error('Error getting documents:', error);
          });
      }
    };
    setIsLoading(true);

    nameData();
  }, []);
  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to function properly.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
  };

  const checkIn = async () => {
    checkIngetLocation();
  };

  const checkIngetLocation = async () => {
    const hasLocationPermission = await getPermission();
    if (hasLocationPermission) {
      setIsLoading(true);
      Geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          if (latitude && longitude) {
            setAttendanceData(latitude, longitude);
          }
        },
        error => {
          console.error('Error getting location:', error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }
  };

  const setAttendanceData = async (latitude, longitude) => {
    const timeStamp = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    const checkInTime = new Date(Date.now()).toLocaleTimeString(
      'en-US',
      options,
    );

    const attendanceData = {
      id: nameDetails.id,
      name: nameDetails.name,
      status: 'present',
      statusType: '',
      attendanceTimeStamp: timeStamp.toISOString(),
      checkInDate: new Date().toISOString().split('T')[0],
      checkInTime: checkInTime,
      checkOutTime: '',
      checkInlatitude: latitude,
      checkInlongitude: longitude,
    };

    const attendanceRef = await firestore()
      .collection('Attendance')
      .add(attendanceData);
    const docId = attendanceRef.id;
    console.log('Document ID:', docId);

    setIsCheckIn(false);
    setIsCheckOut(true);
    setCheckInTime(checkInTime); 
    setCheckOutTime(''); 
    setIsLoading(false);
  };

  const checkOut = async () => {
    setIsLoading(true);
    checkOutgetLocation();
  };

  const checkOutgetLocation = async () => {
    const hasLocationPermission = await getPermission();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const latitude2 = position.coords.latitude;
          const longitude2 = position.coords.longitude;
          console.log(latitude2, longitude2, 'second location');
          if (latitude2 && longitude2) {
            updateCheckout(latitude2, longitude2);
          }
        },
        error => {
          console.error('Error getting location:', error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }
  };

  const updateCheckout = async (latitude2, longitude2) => {
    if (nameDetails && nameDetails.id) {
      const attendanceRef = firebase.firestore().collection('Attendance');
      const query = attendanceRef
        .where('id', '==', nameDetails.id)
        .where('checkInDate', '==', new Date().toISOString().split('T')[0]);

      query
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = doc.data();
            const docId = doc.id;

            const options = {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            };
            const checkOutTime = new Date(Date.now()).toLocaleTimeString(
              'en-US',
              options,
            );

            firestore()
              .collection('Attendance')
              .doc(docId)
              .update({
                checkOutTime: checkOutTime,
                checkOutlatitude: latitude2,
                checkOutlongitude: longitude2,
              })
              .then(() => {
                setIsCheckOut(false);
                setCheckOutTime(checkOutTime);
                setIsLoading(false);
              })
              .catch(err => {
                console.log(err);
              });

            console.log('Document ID:', docId);
          });
        })
        .catch(error => {
          console.error('Error getting documents:', error);
        });
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const currentDate = new Date()
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = daysOfWeek[currentDate.getDay()];


  const X = useSharedValue(10)
  const boxValue=useSharedValue(0)


  const AnimatedGestureHandler = useAnimatedGestureHandler({
    onActive: e => {
    
      X.value = e.translationX;
    },
    onEnd: () => {
      if (X.value > 150) {
        X.value = withSpring(230, undefined, () => {
          // Call non-worklet function using runOnJS
          runOnJS(checkIn)();
          X.value = withSpring(10);
        });
      } else {
        X.value = withSpring(10);
      }
    },
  });  

  const AnimatedGestureHandler2 = useAnimatedGestureHandler({
    onActive: e => {
      X.value = e.translationX;
    },
    onEnd: () => {
      if (X.value > 150) {
        X.value = withSpring(230, undefined, () => {
          runOnJS(checkOut)();
          X.value = withSpring(10);
        });
      } else {
        X.value = withSpring(10);
      }
    },
  });  

 const animatedStyle=useAnimatedStyle(()=>{
   return{transform:[{translateX:X.value}]}
 })

 const textStyle=useAnimatedStyle(()=>{
   return{
     opacity:interpolate(X.value,[0,150],[0.8,0],Extrapolate.CLAMP),
     transform:[{translateX:interpolate(X.value,[0,150],[0,200,Extrapolate.CLAMP])}],
   }
 })
 const animatedStyle2=useAnimatedStyle(()=>{
  return{transform:[{translateX:X.value}]}
})

const textStyle2=useAnimatedStyle(()=>{
  return{
    opacity:interpolate(X.value,[0,150],[0.8,0],Extrapolate.CLAMP),
    transform:[{translateX:interpolate(X.value,[0,150],[0,200,Extrapolate.CLAMP])}],
  }
})
  
  return (
     <SafeAreaView  style={{flex:1,alignItems:'center'}}>

      

      
      {/* <View style={styles.header}> */}

      <ImageBackground 
      source={require('../../assests/images/nameb.jpeg')}
      style={styles.header} >
           <View style={styles.top}>
         {nameDetails.image && (
  <Image
    style={styles.profileImage}
    source={{ uri: nameDetails.image }}
  />
)}
           <Image
          style={styles.headerlogo}
          source={require('../../assests/images/RTS.png')}
        />
         <TouchableOpacity onPress={handleLogout}>
          <Image
            style={styles.logoutimage}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/11019/11019316.png',
            }}
          />
        </TouchableOpacity>
         </View>
      <Text style={styles.name}>{nameDetails.name}</Text>
        <Text style={styles.namesub}>{nameDetails.designation}</Text>
      </ImageBackground>


        

      {/* </View> */}
         <View style={styles.flatListView}>
        {nameDetails.roleId === 5  && ( 
          <FlatList
          data={dataE}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
        />
        )} 
         {nameDetails.roleId !== 5  && ( 
          <FlatList
          data={data}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
        />
        )} 
       
         
         </View>
         <View style={styles.time}>
          <View style={{flexDirection:'row'}}>
          <AntDesign name="clockcircleo" size={30} color="white" style={{marginTop:hp(1)}} />
         <View style={{marginLeft:wp(3)}}>
         <Text style={styles.timeName}>{currentDate.toString().slice(8,10) +" " + currentDate.toString().slice(4,7) +" " + currentDate.toString().slice(11,15)}</Text>
         <Text style={styles.timeName}>{currentDay} | General</Text>
         </View>

          </View>
         

        
           <View>
           { checkInTime &&  checkIn &&
          <View style={{flexDirection:'row'}} >
            <Text style={styles.signText}>Check In</Text>
           <Text style={styles.timeName}>{checkInTime }</Text>
         </View>
          }

         { checkOutTime &&  checkOut &&
          <View style={{flexDirection:'row'}}  >
             <Text style={styles.signText}>Check Out</Text>
           <Text style={styles.timeName}>{checkOutTime }</Text>
         </View>
          }

           </View>
         
        
      
         </View>

           

          {isCheckIn && ( 

<LinearGradient   
style={{borderRadius:10}}
colors={['#3baac7','#06566c' ]}>
   <View style={{height:50,width:300,borderRadius:10,paddingLeft:10,paddingRight:10,justifyContent:'center',alignItems:'center'}}>
    <PanGestureHandler onGestureEvent={AnimatedGestureHandler}>
    <Animated.View  style={[{height:50,width:50,position:'absolute',left:0,borderRadius:10,justifyContent:'center',alignItems:'center'},animatedStyle]}> 
    <AntDesign name="doubleright" size={30} color="white" />
     </Animated.View>
    </PanGestureHandler>
    <Animated.Text style={[textStyle, { color: 'white', fontSize: hp(2.2) }]}>
  {' Check In  here   >>'}
</Animated.Text>
  </View>
</LinearGradient>
   
        )}

    {isCheckOut && ( 
    <View style={{height:50,width:300,backgroundColor:'#EA7824',borderRadius:10,paddingLeft:10,paddingRight:10,justifyContent:'center',alignItems:'center'}}>
    <PanGestureHandler onGestureEvent={AnimatedGestureHandler2}>
    <Animated.View  style={[{height:50,width:50,position:'absolute',left:0,borderRadius:10,justifyContent:'center',alignItems:'center'},animatedStyle2]}> 
    <AntDesign name="doubleright" size={30} color="white" />
     </Animated.View>
    </PanGestureHandler>
    <Animated.Text style={[textStyle2, { color: 'white', fontSize: hp(2.5) }]}>
  {' Check Out here >>'}
</Animated.Text>
  </View>
        )}
        
      



<View style={{position: 'absolute', top: hp(45), left: wp(44)}}>
        {isLoading && (
          <ActivityIndicator size={45} animating={true} color={'#EA7824'} />
        )}
      </View>
      <Alert
        isVisible={showAlert}
        title="coming soon "
        message="Under Development...!"
        onClose={() => setShowAlert(false)}
      />
      

  
     </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
   header:{
    height:hp(25),
    width:wp(100),
    // backgroundColor:'#1E5B70',
   },
   name:{
fontSize:hp(4.5),
// fontFamily: 'OpenSans-Bold',
fontWeight:'600',
color:'#1E5B70',
textAlign:'center',
marginTop:hp(3)
// paddingVertical:hp(2)

   },
   namesub:{
    fontSize:hp(1.8),
    fontFamily: 'OpenSans-Bold',
    color:'black',
    textAlign:'center',
    paddingVertical:hp(.5)
       },
   timeName:{
    fontSize:hp(1.8),
    fontFamily: 'OpenSans-Bold',
    color:'white',
    paddingVertical:hp(.4)
   },
   signText:{
    fontSize:hp(1.8),
    fontFamily: 'OpenSans-Bold',
    color:'white',
    paddingVertical:hp(.4),
    width:wp(18),
   },
   image: {
    width: hp(4),
    height: wp(8),
    resizeMode: 'cover',
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    alignItems: 'center',
  },
  cardTitle: {
  fontFamily: 'OpenSans-Bold',
  color:'white',
  fontSize:hp(1.8),
  width:wp(28),
  textAlign:'center',
  marginTop:hp(1)
  },
  flatListView:{
     borderWidth:1,
     borderColor:'#ddd',
     borderRadius:hp(2),
     backgroundColor:'#1E5B70',
     width:wp(95),
    //  position:'absolute',
    //  top:hp(25),
     shadowColor: '#00000090',
     shadowOffset: { width: 0, height: 1 }, 
     shadowOpacity: 0.8,
     shadowRadius: 2, 
     elevation: 5,
  },
  circularImage: {
    width: hp(7), 
    height: hp(7), 
    borderRadius: hp(7) / 2, 
    overflow: 'hidden', 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#c7ecee'
  },
  time:{
    marginVertical:hp(2),
    borderWidth:1,
     borderColor:'#ddd',
     borderRadius:hp(2),
     backgroundColor:'#1E5B70',
     width:wp(95), 
     paddingVertical:hp(2),
     paddingHorizontal:wp(5),
     flexDirection:'row',
     justifyContent:'space-between',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 1 }, 
     shadowOpacity: 0.9,
     shadowRadius: 2, 
     elevation: 5,
  },
  headerlogo: {
    height: hp(23),
    width: wp(23),
    resizeMode: 'contain',
  },
  top: {
    height: hp(8),
    width: wp(100),
    backgroundColor: '#f1f1f1',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    flexDirection:'row',
    paddingHorizontal:wp(5)

  },
  logoutimage: {
    height: hp(7),
    width: wp(7),
    resizeMode: 'contain',
  },
  profileImage:{
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.12,
    height: Dimensions.get('window').width * 0.12,
    resizeMode: 'contain',
    marginTop:hp(.5),
    borderWidth:1,
    borderColor:'#1E5B70'
  }
 
});
