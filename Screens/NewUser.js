import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import firebase from "../Config";
import { saveConnectionStatus } from "../utils/ConnectionUtils";
import { Ionicons } from "@expo/vector-icons";

const auth = firebase.auth();

export default function NewUser(props) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  return (
    <ImageBackground
      source={require("../assets/background.jpg")} // Vibrant gradient background
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#6C63FF" />
          <TextInput
            keyboardType="email-address"
            placeholder="Enter your email"
            placeholderTextColor="#ccc"
            style={styles.textInput}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6C63FF" />
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={(text) => setPwd(text)}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6C63FF" />
          <TextInput
            placeholder="Confirm your password"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={(text) => setConfirmPwd(text)}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (!email || !pwd || !confirmPwd) {
                alert("Please fill in all fields.");
                return;
              }

              if (pwd === confirmPwd) {
                auth
                  .createUserWithEmailAndPassword(email, pwd)
                  .then(async () => {
                    props.navigation.navigate("Home");
                    await saveConnectionStatus(true);
                  })
                  .catch((error) => {
                    alert(error.message);
                  });
              } else {
                alert("Passwords do not match.");
              }
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white
    borderRadius: 25,
    padding: 25,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#6A98F0",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "45%",
    alignItems: "center",
    shadowColor: "#6A98F0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  backButton: {
    backgroundColor: "#FF7070",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "45%",
    alignItems: "center",
    shadowColor: "#FF7070",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
