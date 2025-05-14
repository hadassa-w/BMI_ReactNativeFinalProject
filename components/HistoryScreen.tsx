"use client"

import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList, BMIResult } from "../App"
import { getCalculationHistory, clearHistory } from "../utils/storage"

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, "History">

type Props = {
  navigation: HistoryScreenNavigationProp
}

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [history, setHistory] = useState<BMIResult[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadHistory()

    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory()
    })

    return unsubscribe
  }, [navigation])

  const loadHistory = async (): Promise<void> => {
    setLoading(true)
    const calculationHistory = await getCalculationHistory()

    // סינון כפילויות לפי timestamp
    const uniqueHistory = Array.from(
      new Map(calculationHistory.map(item => [item.timestamp, item])).values()
    )

    setHistory(uniqueHistory.reverse())
    setLoading(false)
  }

  const handleClearHistory = (): void => {
    Alert.alert("Clear History", "Are you sure you want to clear all calculation history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        onPress: async () => {
          await clearHistory()
          setHistory([])
        },
        style: "destructive",
      },
    ])
  }

  const getBMIColor = (category: string): string => {
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

  const renderHistoryItem = ({ item }: { item: BMIResult }) => {
    const date = new Date(item.timestamp)
    const formattedDate = date.toLocaleDateString()

    return (
      <TouchableOpacity style={styles.historyItem} onPress={() => navigation.navigate("Results", { bmiResult: item })}>
        <View style={styles.historyItemHeader}>
          <Text style={styles.historyItemDate}>{formattedDate}</Text>
          <View style={[styles.bmiTag, { backgroundColor: getBMIColor(item.category) }]}>
            <Text style={styles.bmiTagText}>{item.bmi.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.historyItemDetails}>
          <Text style={styles.historyDetailText}>
            {item.ageCategory === "infant" ? "Infant" : item.ageCategory === "child" ? "Child" : "Adult"},{" "}
            {item.age} years, {item.gender === "male" ? "Male" : "Female"}
          </Text>
          <Text style={styles.historyDetailText}>
            {item.weight} {item.useMetric ? "kg" : "lbs"},{" "}
            {item.height} {item.useMetric ? "cm" : "in"}
          </Text>
        </View>

        <Text style={[styles.categoryText, { color: getBMIColor(item.category) }]}>{item.category}</Text>
      </TouchableOpacity>
    )
  }

  const renderEmptyHistory = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No History Yet</Text>
      <Text style={styles.emptyText}>Your BMI calculation history will appear here</Text>
      <TouchableOpacity style={styles.calculateButton} onPress={() => navigation.navigate("Calculator")}>
        <Text style={styles.calculateButtonText}>Calculate BMI</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BMI History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => `history-${item.timestamp}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={!loading ? renderEmptyHistory : null}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  listContainer: { padding: 15, paddingBottom: 30, flexGrow: 1 },
  historyItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyItemDate: { fontSize: 14, color: "#666" },
  bmiTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  bmiTagText: { color: "white", fontWeight: "bold", fontSize: 14 },
  historyItemDetails: { marginBottom: 10 },
  historyDetailText: { fontSize: 14, color: "#333", marginBottom: 5 },
  categoryText: { fontWeight: "bold", fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 20, marginBottom: 10 },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 30 },
  calculateButton: {
    backgroundColor: "#0066CC",
    borderRadius: 8,
    padding: 15,
    width: "80%",
    alignItems: "center",
  },
  calculateButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
})

export default HistoryScreen
