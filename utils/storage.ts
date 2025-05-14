import AsyncStorage from "@react-native-async-storage/async-storage"
import type { BMIResult } from "../App"

const HISTORY_KEY = "bmi_calculation_history"

// Save a new BMI calculation to history
export const saveCalculation = async (calculationData: BMIResult): Promise<boolean> => {
  try {
    // Get existing history
    const existingHistory = await getCalculationHistory()

    // Add new calculation to history
    const updatedHistory = [...existingHistory, calculationData]

    // Save updated history
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))

    return true
  } catch (error) {
    console.error("Error saving calculation:", error)
    return false
  }
}

// Get all BMI calculation history
export const getCalculationHistory = async (): Promise<BMIResult[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY)

    if (historyJson) {
      return JSON.parse(historyJson)
    }

    return []
  } catch (error) {
    console.error("Error getting calculation history:", error)
    return []
  }
}

// Clear all BMI calculation history
export const clearHistory = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY)
    return true
  } catch (error) {
    console.error("Error clearing history:", error)
    return false
  }
}
