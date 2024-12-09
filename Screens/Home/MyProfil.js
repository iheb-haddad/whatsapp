import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import firebase from "../../Config";
import { supabase } from "../../Config/initSupabase"; // Import Supabase client
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const database = firebase.database();
const ref_tableProfils = database.ref("Tabledeprofils");

export default function MyProfil(props) {
  const [nom, setNom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [uriImage, setUriImage] = useState("");
  const userId = firebase.auth().currentUser.uid; // Get the authenticated user's ID
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const userProfileRef = ref_tableProfils.child(`unprofil${userId}`);
    userProfileRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNom(data.nom || "");
        setPseudo(data.pseudo || "");
        setTelephone(data.telephone || "");
        if (data.profileImage) {
          setUriImage(data.profileImage);
          setIsDefaultImage(false);
        }
      }
    });

    return () => userProfileRef.off(); // Cleanup listener on unmount
  }, []);

  // Image Picker Handler
  const handleImagePick = async (fromCamera) => {
    try {
      // Request media library permissions
      const permissionResult = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          `You need to allow access to your ${
            fromCamera ? "camera" : "media library"
          }.`
        );
        return;
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
          });
      setModalVisible(false);
      if (!result.canceled) {
        const uri = result.assets[0].base64;
        if (!uri) throw new Error("Failed to get image base64 data.");
        setUriImage(result.assets[0].uri);
        setIsDefaultImage(false);
        //Upload to Supabase
        await uploadImageToSupabase(uri);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Upload Image to Supabase Storage
  const uploadImageToSupabase = async (uri) => {
    try {
      const fileName = `${userId}-${Date.now()}.jpg`; // Generate unique file name
      // const response = await fetch(uri);
      // const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from("profile-images") // Bucket name in Supabase
        .upload(fileName, decode(uri), { contentType: "image/jpeg" });

      if (error) {
        console.log(error);
        throw error;
      }

      const imageUrl =
        process.env.EXPO_PUBLIC_SUPABASE_URL +
        "/storage/v1/object/public/" +
        data.fullPath;

      //Save URL to Firebase
      await ref_tableProfils.child(`unprofil${userId}`).update({
        profileImage: imageUrl,
      });
      // Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = () => {
    if (!nom || !pseudo || !telephone) {
      console.log("Please fill all fields");
      return;
    }

    const userProfileRef = ref_tableProfils.child(`unprofil${userId}`);
    userProfileRef
      .update({
        id: userId,
        nom: nom,
        pseudo: pseudo,
        telephone: telephone,
      })
      .then(() => console.log("Profile updated successfully!"))
      .catch((error) => console.log(error));
  };

  const handleDisconnect = () => {
    firebase.auth().signOut();
    navigation.replace("Auth");

    const userProfileRef = ref_tableProfils.child(`unprofil${userId}`);
    if (userProfileRef) {
      userProfileRef.update({ isConnected: false });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0b75a7" }]}>
      <StatusBar style="light" />
      <Text style={styles.textstyle}>My Account</Text>

      <View style={styles.imageContainer}>
        <TouchableHighlight>
          <Image
            source={
              isDefaultImage
                ? require("../../assets/profil.png")
                : { uri: uriImage }
            }
            style={styles.profileImage}
          />
        </TouchableHighlight>

        <TouchableOpacity
          style={styles.cameraIcon}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={require("../../assets/camera-icon.png")} // Replace with your camera icon
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <TouchableOpacity style={styles.modalContainer}
        onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleImagePick(true); // Open Camera
              }}
            >
              <Text style={styles.modalButtonText}>Open Camera</Text>
              <Ionicons name="camera" size={24} color="#0b75a7" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleImagePick(false); // Open Gallery
              }}
            >
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
              <Ionicons name="image" size={24} color="#0b75a7" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
              <Ionicons name="close" size={24} color="#0b75a7" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <TextInput
        value={nom}
        onChangeText={(text) => setNom(text)}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Nom"
        keyboardType="default"
        style={styles.textinputstyle}
      />
      <TextInput
        value={pseudo}
        onChangeText={(text) => setPseudo(text)}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Pseudo"
        keyboardType="default"
        style={styles.textinputstyle}
      />
      <TextInput
        value={telephone}
        onChangeText={(text) => setTelephone(text)}
        placeholderTextColor="#fff"
        textAlign="center"
        placeholder="Numero"
        keyboardType="phone-pad"
        style={styles.textinputstyle}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Ionicons name="save" size={24} color="#fff" />
          <Text style={styles.buttonText}>Save Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deconnectionButton}
          onPress={handleDisconnect}
        >
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 5,
  },
  textinputstyle: {
    fontWeight: "bold",
    backgroundColor: "#0004",
    fontSize: 20,
    color: "#fff",
    width: "75%",
    height: 50,
    borderRadius: 10,
    margin: 5,
  },
  textstyle: {
    fontSize: 36,
    fontFamily: "serif",
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F52BA",
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  deconnectionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9534F",
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
  modalButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "start",
    width: "100%",
  },
  modalButtonText: {
    color: "#0b75a7",
    fontSize: 16,
    fontWeight: "bold",
  },
});
