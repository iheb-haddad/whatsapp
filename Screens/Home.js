import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ListProfils from"./Home/ListProfils";
import Groupes from "./Home/Groupes";
import MyProfil from "./Home/MyProfil";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import firebase from "../Config";
import { LogBox } from "react-native";
import { useState } from "react";
const ref_tableProfils = firebase.database().ref("Tabledeprofils");

LogBox.ignoreLogs([
  'A props object containing a "key" prop is being spread into JSX',
]);


const Tab = createMaterialBottomTabNavigator();
export default function Home(props) {
  const auth = firebase.auth().currentUser.uid;
  // const [profileExist, setProfileExist] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    if (!auth) {
      navigation.replace("Auth");
    }

    const userProfileRef = ref_tableProfils.child(`unprofil${auth}`);
    if (userProfileRef) {
      userProfileRef.update({ isConnected: true });
      // setProfileExist(true);
    } else{
      // setProfileExist(false);
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="ListProfils"
      activeColor="#000"
      inactiveColor="#fff"
      activeBackgroundColor="#fff"
      barStyle={{ backgroundColor: "#0b75a7" }}
      activeTintColor="#000"
    >
      <Tab.Screen name="ListProfils" component={ListProfils} 
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon name="list" size={focused ? 30 : 24} color={color} />
            ),
          }}/>
      <Tab.Screen name="Groupes" component={Groupes} 
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon name="group" size={focused ? 30 : 24} color={color} />
            ),
          }}/>
      <Tab.Screen name="MyProfile" component={MyProfil} 
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Icon name="person" size={focused ? 30 : 24} color={color} />
            ),
          }}/>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
