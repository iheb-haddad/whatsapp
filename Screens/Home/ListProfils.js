import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import firebase from "../../Config";
import Icon from "react-native-vector-icons/MaterialIcons";

const database = firebase.database();
const ref_tableProfils = database.ref("Tabledeprofils");

export default function ListProfils(props) {
  const [data, setData] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    ref_tableProfils.on("value", (snapshot) => {
      const d = [];
      snapshot.forEach((unprofil) => {
        d.push(unprofil.val());
      });
      setData(d.filter((profil) => profil.id !== userId));
    });

    return () => {
      ref_tableProfils.off();
    };
  }, [userId]);

  const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) =>
      alert("Unable to make a call. Check your phone settings.")
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0b75a7" }]}>
      <StatusBar style="light" />
      <Text style={styles.textstyle}>List profils</Text>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableHighlight
                onPress={() => {
                  props.navigation.navigate("Chat", { profile: item });
                }}
                underlayColor="#ddd"
                style={styles.contactContainer}
                key={item.id}
              >
                <View style={styles.contactInner}>
                  {/* Profile Image */}
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={
                        item.profileImage
                          ? { uri: item.profileImage }
                          : require("../../assets/profil.png")
                      }
                      style={styles.profileImage}
                    />
                    {item?.isConnected && <View style={styles.onlineDot} />}{" "}
                    {/* Add green dot */}
                  </View>
                  {/* Contact Info */}
                  <View style={styles.textContainer}>
                    <Text style={styles.contactName}>
                      {item.nom}
                    </Text>
                    <Text style={styles.contactPseudo}>@{item.pseudo}</Text>
                  </View>

                  {/* Phone Icon */}
                  {item.telephone && (
                    <TouchableOpacity
                      onPress={() => handleCall(item.telephone)}
                      style={styles.phoneIcon}
                    >
                      <Icon name="phone" size={25} color="#4CAF50" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableHighlight>
            );
          }}
          style={styles.listContainer}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  textinputstyle: {
    backgroundColor: "#0004",
    fontSize: 18,
    color: "#fff",
    width: "95%",
    height: 50,
    borderRadius: 10,
    margin: 5,
    paddingLeft: 15, // Add padding for better input appearance
  },
  textstyle: {
    fontSize: 36,
    fontFamily: "serif",
    color: "white",
    fontWeight: "bold",
    paddingTop: 45,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listContainer: {
    width: "100%",
    padding: 10,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  contactInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
  profileImageContainer: {
    position: "relative",
    width: 50,
    height: 50,
    marginRight: 7,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50", // Green color
    borderWidth: 2,
    borderColor: "#fff", // White border to make it stand out
  },
  textContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contactPseudo: {
    fontSize: 14,
    color: "#666",
  },
  phoneIcon: {
    padding: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  // Skeleton styles
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  skeletonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonText: {
    height: 15,
    backgroundColor: "#ddd",
    marginBottom: 5,
    borderRadius: 4,
  },
  skeletonTextSmall: {
    width: "60%",
  },
});
