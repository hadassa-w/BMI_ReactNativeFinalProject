// BMI calculation formulas and utilities

interface BMICalculationParams {
  age: number
  weight: number
  height: number
  ageCategory: string
  gender: string
  useMetric: boolean
}

interface BMIResult {
  bmi: number
  category: string
  age: number
  weight: number
  height: number
  ageCategory: string
  gender: string
  useMetric: boolean
  timestamp: string
}

export const calculateBMI = (params: BMICalculationParams): BMIResult => {
  const { age, weight, height, ageCategory, gender, useMetric } = params

  // Convert to metric if using imperial
  const weightInKg = useMetric ? weight : weight * 0.453592 // lbs to kg
  const heightInM = useMetric ? height / 100 : height * 0.0254 // cm or inches to meters

  // Calculate BMI
  const bmi = weightInKg / (heightInM * heightInM)

  // Determine BMI category based on age category
  let category: string

  if (ageCategory === "infant") {
    // For infants, we use a simplified approach
    // In reality, weight-for-length charts are used instead of BMI
    // This is a simplified categorization for demonstration
    if (bmi < 14) {
      category = "Underweight"
    } else if (bmi >= 14 && bmi < 17) {
      category = "Normal weight"
    } else if (bmi >= 17 && bmi < 19) {
      category = "Overweight"
    } else {
      category = "Obese"
    }
  } else if (ageCategory === "child") {
    // For children, BMI categories vary by age and gender
    // This is a simplified approach
    if (bmi < 14) {
      category = "Underweight"
    } else if (bmi >= 14 && bmi < 18) {
      category = "Normal weight"
    } else if (bmi >= 18 && bmi < 20) {
      category = "Overweight"
    } else {
      category = "Obese"
    }
  } else {
    // Adult BMI categories
    if (bmi < 18.5) {
      category = "Underweight"
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight"
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight"
    } else {
      category = "Obese"
    }
  }

  // Create result object with all relevant information
  const result: BMIResult = {
    bmi,
    category,
    age,
    weight,
    height,
    ageCategory,
    gender,
    useMetric,
    timestamp: new Date().toISOString(),
  }

  return result
}
