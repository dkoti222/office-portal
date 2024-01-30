import { View, Text, StyleSheet ,TouchableOpacity} from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OfferRelease from './OfferRelease';
import Reject from './Reject';
import ShortList from './ShortList';
import Fire from './Fire';
import Resign from './Resign';
import OfferHold from './OfferHold';

const Tab = createMaterialTopTabNavigator();

const Recruitment = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.top}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        <Text style={styles.headtext}>Recruitment</Text>
      </View>

      <Tab.Navigator
        initialRouteName="ShortList"
        screenOptions={{
          tabBarLabelStyle: { fontSize: hp(1.2), color: 'white',fontWeight:'700' },
          tabBarStyle: { backgroundColor: '#1E5B70' },
          tabBarScrollEnabled: true, // Enable horizontal scroll
          tabBarItemStyle:{width:wp(27)},
          tabBarIndicatorStyle: {
            backgroundColor: '#E97724', 
            height: 3, 
          },
        

        }}
      >
        <Tab.Screen
          name="Shortlist"
          component={ShortList}
          options={{ tabBarLabel: 'Shortlist' }}
        />
        <Tab.Screen
          name="OfferRelease"
          component={OfferRelease}
          options={{ tabBarLabel: 'Offer Release' }}
        />
         <Tab.Screen
          name="OfferHold" 
          component={OfferHold} 
          options={{ tabBarLabel: 'Offer Hold' }} 
        />
        <Tab.Screen
          name="Reject"
          component={Reject}
          options={{ tabBarLabel: 'Reject' }}
        />
         <Tab.Screen
          name="Fire"
          component={Fire}
          options={{ tabBarLabel: 'Fired' }}
        />
        <Tab.Screen
          name="Resign"
          component={Resign}
          options={{ tabBarLabel: 'Resign' }}
        />
      </Tab.Navigator>


    </SafeAreaView>
  )
}

export default Recruitment


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
    marginLeft: wp(15),
    width: wp(60),
  },
})