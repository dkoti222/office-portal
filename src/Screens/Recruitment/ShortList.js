import React, { useEffect, useState } from 'react';
import {View, Text,StyleSheet,TouchableOpacity,FlatList,ActivityIndicator,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Shortlist = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const profileGetRequiredName = (id) => {
    AsyncStorage.setItem('PROFILENAME', JSON.stringify(id));
    navigation.navigate('ProfileView');
  }

  const shortListItems = items.filter((ele) => ele.status === 'ShortList');

  const renderItem = ({ item }) => (

      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.namesub}>{item.designation}</Text>
          <Text style={styles.namesub}>{item.email}</Text>
          <Text style={styles.namesub}>{item.phone}</Text>
        </View>
        <View>
          {/* <Text style={styles.name}>Offer Released</Text> */}
          <TouchableOpacity style={styles.status}  
          onPress={() => profileGetRequiredName(item)} activeOpacity={1} 
          >
            <Text style={styles.statustext}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
   
  );

  const getItems = async () => {
    setIsLoading(true);
    try {
      firestore().collection('Recruitment').onSnapshot((snap) => {
        const tempArray = [];
        snap.forEach((item) => {
          tempArray.push(item.data());
        });
        setItems(tempArray);
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      {shortListItems.length > 0 ? (  <FlatList data={shortListItems} renderItem={renderItem} />
  ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noData}>No data available</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate("ProfileCreation")}
      >
        <AntDesign name="pluscircle" size={50} color="#1a6372" />
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size={45} animating={true} color={'#1E5B70'} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Shortlist;

const styles = StyleSheet.create({
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
});
