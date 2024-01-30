
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Attendance = ({ navigation }) => {

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    const getRequiredName=(id)=>{
       AsyncStorage.setItem('NAME', JSON.stringify(id));
       navigation.navigate('TopBarAttendance');
    }

  const renderItem = ({ item }) => {
    if (
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return (
        <TouchableOpacity
          onPress={()=> getRequiredName(item)}
          activeOpacity={1}
        >  
          <View style={styles.list}>
            <View style={styles.circle}>
            <Image
              style={styles.empolyeimage}
              source={{
                uri: item.imageUri,
              }}
            />
            </View>

            <View style={{ marginRight: wp(10) }}>
              <Text style={styles.listtext}>{item.name}</Text>
              <Text style={styles.listtextsub}>{item.designation}</Text>
            </View>
            <Text style={styles.listlasttext}>{item.code}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

 

  const getItems = async () => {
    console.log('get Data');
    setIsLoading(true); 
       
      try{

         firestore().collection('Empolyeelist').onSnapshot((snap)=>{
            const temArray=[]
            snap.forEach((item)=>{
                temArray.push(item.data())                
            })
            setItems(temArray);
            setIsLoading(false); 
          })

      } catch(err){
        console.log(err);
        
      }
     
  }; 

 

  useEffect(() => {
    getItems();
  }, []);


  return (
    <View style={{ flex: 1 }}>
    
       <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
          <Text style={styles.headtext}>Attendance</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      /> 
        <Ionicons  style={{position:'absolute',top:hp(10),right:wp(8)}} name="search" size={30} color="#E97724" />

      <View style={{ width: wp(100), justifyContent: 'center', alignItems: 'center' ,paddingBottom:hp(17)}}>
        <FlatList
          data={items}
          renderItem={renderItem}
          // keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
        
      <View style={{position:'absolute',top:hp(45),left:wp(44)}}>
{isLoading && <ActivityIndicator  size={45} animating={true} color={'#1E5B70'} />}
        </View>
    

    </View>
  );
};

export default Attendance;

 const styles = StyleSheet.create({
  

  list: {
    flexDirection: 'row',
    width: wp(93),
    backgroundColor:'white',
    marginTop: hp(.8),
    paddingLeft: wp(4),
    paddingRight: hp(2),
    marginHorizontal:wp(2),
    borderRadius: wp(1),
    alignItems: 'center',
    paddingVertical: hp(2),
    justifyContent: 'space-between',
  },
    listtext: {
      fontFamily: 'OpenSans-SemiBold',
      width: wp(40),
      marginLeft: wp(5),
      paddingVertical: hp(.5),
      color:'black',
     
    },
    listtextsub:{
      fontFamily: 'OpenSans-SemiBold',
      width: wp(40),
      marginLeft: wp(5),
      paddingVertical: hp(.5),
      color: 'grey',
    },
    listlasttext: {
      fontSize: hp(2),
      color: 'grey',
      fontFamily: 'OpenSans-SemiBold',
      width: wp(20),
    },
    circle: {
      borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
      width: Dimensions.get('window').width * 0.18,
      height: Dimensions.get('window').width * 0.18,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#fd9644'
    },
    empolyeimage: {
      borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
      width: Dimensions.get('window').width * 0.17,
      height: Dimensions.get('window').width * 0.17,
      resizeMode: 'contain'
    },
    add: {
      fontSize: hp(4),
      color: 'white',
      fontFamily: 'OpenSans-SemiBold'
    },
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
    searchInput: {
      height: 40,
      borderColor: '#E97724',
      borderWidth: 1.5,
      margin: 10,
      paddingLeft: 10,
      borderRadius:5
    },
  
  });
