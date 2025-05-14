import type React from "react"
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../App"

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">

type Props = {
  navigation: HomeScreenNavigationProp
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require("../assets/BMI_picture.jpg")} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>BMI Calculator</Text>
            <Text style={styles.subtitle}>Calculate Body Mass Index for infants, children, and adults</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Calculator")}>
              <Ionicons name="calculator" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Start Calculation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate("History")}
            >
              <Ionicons name="time" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    justifyContent: "space-between",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    opacity: 0.9,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#0066CC",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "#4CAF50",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default HomeScreen
