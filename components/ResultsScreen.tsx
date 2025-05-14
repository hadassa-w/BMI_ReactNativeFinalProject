import type React from "react"
import { useEffect, useMemo } from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../App"
import { saveCalculation } from "../utils/storage"
import { calculateBMI } from "../utils/bmiUtils" // Import BMIResult type from the new file

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, "Results">
type ResultsScreenRouteProp = RouteProp<RootStackParamList, "Results">

type Props = {
  navigation: ResultsScreenNavigationProp
  route: ResultsScreenRouteProp
}

interface BMIRange {
  min: number
  max: number
  label: string
  color: string
  valueText: string
}

const ResultsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bmiResult } = route.params
  const scaleAnim = new Animated.Value(0)

  // Define BMI ranges based on age category
  const bmiRanges = useMemo((): BMIRange[] => {
    if (bmiResult.ageCategory === "infant") {
      return [
        { min: 0, max: 14, label: "Underweight", color: "#3498db", valueText: "<14" },
        { min: 14, max: 17, label: "Normal", color: "#2ecc71", valueText: "14-17" },
        { min: 17, max: 19, label: "Overweight", color: "#f39c12", valueText: "17-19" },
        { min: 19, max: 30, label: "Obese", color: "#e74c3c", valueText: ">19" },
      ]
    } else if (bmiResult.ageCategory === "child") {
      return [
        { min: 0, max: 14, label: "Underweight", color: "#3498db", valueText: "<14" },
        { min: 14, max: 18, label: "Normal", color: "#2ecc71", valueText: "14-18" },
        { min: 18, max: 20, label: "Overweight", color: "#f39c12", valueText: "18-20" },
        { min: 20, max: 30, label: "Obese", color: "#e74c3c", valueText: ">20" },
      ]
    } else {
      // Adult
      return [
        { min: 0, max: 18.5, label: "Underweight", color: "#3498db", valueText: "<18.5" },
        { min: 18.5, max: 25, label: "Normal", color: "#2ecc71", valueText: "18.5-25" },
        { min: 25, max: 30, label: "Overweight", color: "#f39c12", valueText: "25-30" },
        { min: 30, max: 50, label: "Obese", color: "#e74c3c", valueText: ">30" },
      ]
    }
  }, [bmiResult.ageCategory])

  useEffect(() => {
    // Save the calculation to history
    saveCalculation(bmiResult)

    // Animate the BMI value
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start()
  }, [])

  const getBMIColor = (): string => {
    const { category } = bmiResult
    switch (category) {
      case "Underweight":
        return "#3498db"
      case "Normal weight":
        return "#2ecc71"
      case "Overweight":
        return "#f39c12"
      case "Obese":
        return "#e74c3c"
      default:
        return "#0066CC"
    }
  }

  const getIndicatorPosition = (): `${number}%` => {
    const { bmi } = bmiResult
    
    // Find which category the BMI falls into
    let position = 0
    const segmentWidth = 100 / bmiRanges.length // Equal width segments
    
    for (let i = 0; i < bmiRanges.length; i++) {
      const range = bmiRanges[i]
      if (bmi >= range.min && bmi < range.max) {
        // Calculate position within the segment
        const percentInRange = (bmi - range.min) / (range.max - range.min)
        position = (i * segmentWidth) + (percentInRange * segmentWidth)
        break
      }
      
      // If we're at the last range and BMI is higher
      if (i === bmiRanges.length - 1 && bmi >= range.max) {
        position = 100
      }
    }
    
    // Ensure position is between 0-100%
    position = Math.min(Math.max(position, 0), 100)
    return `${position}%` as `${number}%`
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Your BMI Result</Text>

          <Animated.View
            style={[
              styles.bmiValueContainer,
              {
                transform: [{ scale: scaleAnim }],
                backgroundColor: getBMIColor(),
              },
            ]}
          >
            <Text style={styles.bmiValue}>{bmiResult.bmi.toFixed(1)}</Text>
            <Text style={styles.bmiUnit}>kg/m²</Text>
          </Animated.View>

          <Text style={[styles.bmiCategory, { color: getBMIColor() }]}>{bmiResult.category}</Text>

          <View style={styles.bmiScaleContainer}>
            <Text style={styles.scaleTitle}>
              BMI Scale ({bmiResult.ageCategory === "infant" 
                ? "Infant" 
                : bmiResult.ageCategory === "child" 
                  ? "Child" 
                  : "Adult"})
            </Text>
            <View style={styles.scaleContainer}>
              <View style={styles.scaleBar}>
                {bmiRanges.map((range, index) => (
                  <View 
                    key={`segment-${index}`} 
                    style={[
                      styles.scaleSegment, 
                      { 
                        backgroundColor: range.color,
                        flex: 1  // All segments have equal flex value
                      }
                    ]} 
                  />
                ))}
              </View>
              <View style={styles.scaleLabels}>
                {bmiRanges.map((range, index) => (
                  <Text 
                    key={`label-${index}`} 
                    style={[
                      styles.scaleLabel,
                      { 
                        flex: 1, // Equal width for all labels
                        textAlign: "center" 
                      }
                    ]}
                  >
                    {range.label}
                  </Text>
                ))}
              </View>
              <View style={styles.scaleValues}>
                {bmiRanges.map((range, index) => (
                  <Text 
                    key={`value-${index}`} 
                    style={[
                      styles.scaleValue,
                      { 
                        flex: 1, // Equal width for all values
                        textAlign: "center" 
                      }
                    ]}
                  >
                    {range.valueText}
                  </Text>
                ))}
              </View>

              {/* Indicator showing where the user's BMI falls on the scale */}
              <Animated.View
                style={[
                  styles.bmiIndicator,
                  {
                    left: getIndicatorPosition(),
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Age Category:</Text>
              <Text style={styles.detailValue}>
                {bmiResult.ageCategory === "infant"
                  ? "Infant (0-2 years)"
                  : bmiResult.ageCategory === "child"
                    ? "Child (2-18 years)"
                    : "Adult (18+ years)"}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Age:</Text>
              <Text style={styles.detailValue}>{bmiResult.age} years</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Gender:</Text>
              <Text style={styles.detailValue}>{bmiResult.gender === "male" ? "Male" : "Female"}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Weight:</Text>
              <Text style={styles.detailValue}>
                {bmiResult.weight} {bmiResult.useMetric ? "kg" : "lbs"}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Height:</Text>
              <Text style={styles.detailValue}>
                {bmiResult.height} {bmiResult.useMetric ? "cm" : "inches"}
              </Text>
            </View>
          </View>

          <View style={styles.disclaimerContainer}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.disclaimerText}>
              BMI is a screening tool and not a diagnostic of body fatness or health. Consult with a healthcare
              professional for a complete assessment.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Calculator")}>
            <Text style={styles.buttonText}>Calculate Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={styles.buttonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  resultContainer: {
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
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  bmiValueContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  bmiValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  bmiUnit: {
    fontSize: 16,
    color: "white",
    opacity: 0.8,
  },
  bmiCategory: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  disclaimerContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  disclaimerText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0066CC",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bmiScaleContainer: {
    width: "100%",
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  scaleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  scaleContainer: {
    position: "relative",
    marginTop: 10,
  },
  scaleBar: {
    flexDirection: "row",
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  scaleSegment: {
    height: "100%",
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  scaleLabel: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    textAlign: "center",
  },
  scaleValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  scaleValue: {
    fontSize: 11,
    color: "#888",
    flex: 1,
    textAlign: "center",
  },
  bmiIndicator: {
    position: "absolute",
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#333",
    marginLeft: -10,
  },
})

export default ResultsScreen