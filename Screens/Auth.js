import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../Config";
import { useNavigation } from "@react-navigation/native";
import { saveConnectionStatus } from "../utils/ConnectionUtils";

const auth = firebase.auth();

export default function Auth(props) {
  let email, password;
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/background.jpg")} // Background image
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.card}>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#6C63FF" />
          <TextInput
            keyboardType="email-address"
            placeholder="Enter your email"
            placeholderTextColor="#888"
            onChangeText={(text) => {
              email = text;
            }}
            style={styles.textInput}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6C63FF" />
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={true}
            onChangeText={(text) => {
              password = text;
            }}
            style={styles.textInput}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              auth
                .signInWithEmailAndPassword(email, password)
                .then(async () => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                  });
                  await saveConnectionStatus(true);
                })
                .catch((error) => {
                  alert(error.message);
                });
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Create New User */}
        <Text
          style={styles.newUserText}
          onPress={() => {
            props.navigation.navigate("NewUser");
          }}
        >
          <Text style={styles.signUpLink}>Create new user</Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  welcomeText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#3A3D42",
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
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  exitButton: {
    backgroundColor: "#FF5E57",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
    shadowColor: "#FF5E57",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  newUserText: {
    color: "#6C63FF",
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  signUpLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
