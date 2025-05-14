"use client"

import type React from "react"
import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
  Pressable,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../App"
import { calculateBMI } from "../utils/bmiUtils"

type CalculatorScreenNavigationProp = StackNavigationProp<RootStackParamList, "Calculator">

type Props = {
  navigation: CalculatorScreenNavigationProp
}

type AgeCategory = {
  id: string
  label: string
}

const ageCategories: AgeCategory[] = [
  { id: "infant", label: "Infant (0-2 years)" },
  { id: "child", label: "Child (2-18 years)" },
  { id: "adult", label: "Adult (18+ years)" },
]

const CalculatorScreen: React.FC<Props> = ({ navigation }) => {
  const [ageCategory, setAgeCategory] = useState<string>("adult")
  const [age, setAge] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [gender, setGender] = useState<string>("male")
  const [useMetric, setUseMetric] = useState<boolean>(true)

  const validateInputs = (): boolean => {
    if (!age || !weight || !height) {
      Alert.alert("Missing Information", "Please fill in all fields to calculate BMI.", [{ text: "OK" }])
      return false
    }

    const ageNum = Number.parseFloat(age)
    const weightNum = Number.parseFloat(weight)
    const heightNum = Number.parseFloat(height)

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
      Alert.alert("Invalid Input", "Please enter valid numbers for age, weight, and height.", [{ text: "OK" }])
      return false
    }

    if (ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
      Alert.alert("Invalid Input", "Age, weight, and height must be greater than zero.", [{ text: "OK" }])
      return false
    }

    return true
  }

  const handleCalculate = (): void => {
    if (validateInputs()) {
      const bmiResult = calculateBMI({
        age: Number.parseFloat(age),
        weight: Number.parseFloat(weight),
        height: Number.parseFloat(height),
        ageCategory,
        gender,
        useMetric,
      })

      navigation.navigate("Results", { bmiResult })
    }
  }

  const handleClear = (): void => {
    setAge("")
    setWeight("")
    setHeight("")
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidView}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Age Category</Text>
            <View style={styles.categoryContainer}>
              {ageCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[styles.categoryButton, ageCategory === category.id && styles.categoryButtonActive]}
                  onPress={() => setAgeCategory(category.id)}
                >
                  <Text
                    style={[styles.categoryButtonText, ageCategory === category.id && styles.categoryButtonTextActive]}
                  >
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>

            <View style={styles.genderContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[styles.genderButton, gender === "male" && styles.genderButtonActive]}
                  onPress={() => setGender("male")}
                >
                  <Ionicons name="male" size={24} color={gender === "male" ? "white" : "#0066CC"} />
                  <Text style={[styles.genderButtonText, gender === "male" && styles.genderButtonTextActive]}>
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderButton, gender === "female" && styles.genderButtonActive]}
                  onPress={() => setGender("female")}
                >
                  <Ionicons name="female" size={24} color={gender === "female" ? "white" : "#0066CC"} />
                  <Text style={[styles.genderButtonText, gender === "female" && styles.genderButtonTextActive]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.unitSwitchContainer}>
              <Text style={styles.label}>Units</Text>
              <View style={styles.unitSwitch}>
                <Text style={styles.unitText}>Imperial</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={useMetric ? "#0066CC" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setUseMetric(!useMetric)}
                  value={useMetric}
                />
                <Text style={styles.unitText}>Metric</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight</Text>
              <TextInput
                style={styles.input}
                placeholder={useMetric ? "Enter weight (kg)" : "Enter weight (lbs)"}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                style={styles.input}
                placeholder={useMetric ? "Enter height (cm)" : "Enter height (inches)"}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                <Text style={styles.calculateButtonText}>Calculate BMI</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  categoryButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  categoryButtonActive: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
  },
  categoryButtonText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  categoryButtonTextActive: {
    color: "white",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  genderContainer: {
    marginBottom: 15,
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0066CC",
    width: "48%",
  },
  genderButtonActive: {
    backgroundColor: "#0066CC",
  },
  genderButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#0066CC",
  },
  genderButtonTextActive: {
    color: "white",
  },
  unitSwitchContainer: {
    marginBottom: 15,
  },
  unitSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  unitText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  calculateButton: {
    backgroundColor: "#0066CC",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  calculateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  clearButtonText: {
    color: "#333",
    fontSize: 16,
  },
})

export default CalculatorScreen
