import "react-native-gesture-handler"
import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { ActivityIndicator, View } from "react-native"
import * as SplashScreen from "expo-splash-screen"

// Screens
import HomeScreen from "./components/HomeScreen"
import CalculatorScreen from "./components/CalculatorScreen"
import ResultsScreen from "./components/ResultsScreen"
import HistoryScreen from "./components/HistoryScreen"

// Types
export type RootStackParamList = {
  Home: undefined
  Calculator: undefined
  Results: { bmiResult: BMIResult }
  History: undefined
}

export interface BMIResult {
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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for 2 seconds to simulate loading resources
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
        await SplashScreen.hideAsync()
      }
    }

    prepare()
  }, [])

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#0066CC",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "BMI Calculator" }} />
          <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: "Calculate BMI" }} />
          <Stack.Screen name="Results" component={ResultsScreen} options={{ title: "Your BMI Results" }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: "Calculation History" }} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
