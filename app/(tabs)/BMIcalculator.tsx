import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";

export default function BmiApp() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState(""); 
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleCalculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || isNaN(h) || isNaN(w)) {
      setResult("Παρακαλώ εισάγετε έγκυρα αριθμητικά δεδομένα.");
      return;
    }

    if (h < 0.5 || h > 2.72 || w < 2 || w > 635) {
      setResult("Τα δεδομένα δεν είναι ρεαλιστικά. Ελέγξτε ύψος/βάρος.");
      return;
    }

    const bmiValue = w / (h * h);
    const bmi = bmiValue.toFixed(1);

    let evaluation = "";
    if (bmiValue < 18.5) evaluation = "Λιποβαρής";
    else if (bmiValue < 25) evaluation = "Φυσιολογικό βάρος";
    else if (bmiValue < 30) evaluation = "Υπέρβαρος";
    else if (bmiValue < 35) evaluation = "Παχυσαρκία (Κατηγορία I)";
    else if (bmiValue < 40) evaluation = "Παχυσαρκία (Κατηγορία II)";
    else evaluation = "Παχυσαρκία (Κατηγορία III - Νοσογόνος)";

    setResult(`Ο ΔΜΣ σας είναι: ${bmi} - Κατηγορία: ${evaluation}`);
  };

  const styles = createStyles(darkMode);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>BMI calculator</Text>

        <Text style={styles.label}>Ύψος (σε μέτρα, π.χ. 1.75):</Text>
        <TextInput
          style={styles.input}
          keyboardType={Platform.OS === "web" ? "text" : "decimal-pad"}
          value={height}
          onChangeText={setHeight}
          placeholderTextColor={darkMode ? "#ccc" : "#888"}
        />

        <Text style={styles.label}>Βάρος (σε κιλά):</Text>
        <TextInput
          style={styles.input}
          keyboardType={Platform.OS === "web" ? "text" : "decimal-pad"}
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor={darkMode ? "#ccc" : "#888"}
        />

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Υπολογισμός BMI</Text>
        </TouchableOpacity>

        {result && <Text style={styles.result}>{result}</Text>}
      </View>

      {/* Στρογγυλό κουμπί Light/Dark Mode */}
      <TouchableOpacity
        onPress={() => setDarkMode(prev => !prev)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: darkMode ? '#444' : '#ddd',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <Text style={{ color: darkMode ? '#fff' : '#000', fontWeight: 'bold', fontSize: 18 }}>
          {darkMode ? '☀️' : '🌙'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (darkMode) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: darkMode ? "#121212" : "#f8f9fa",
      minHeight: "100vh",
    },
    card: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: darkMode ? "#1e1e1e" : "#fff",
      padding: 20,
      borderRadius: 12,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: darkMode ? "#fff" : "#000",
    },
    label: {
      fontSize: 16,
      marginTop: 10,
      color: darkMode ? "#ccc" : "#000",
    },
    input: {
      borderWidth: 1,
      borderColor: darkMode ? "#555" : "#ccc",
      padding: 10,
      borderRadius: 6,
      marginTop: 5,
      marginBottom: 10,
      textAlign: "center",
      fontSize: 16,
      color: darkMode ? "#fff" : "#000",
    },
    button: {
      backgroundColor: "#007bff",
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    result: {
      marginTop: 20,
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "center",
      color: darkMode ? "#fff" : "#000",
    },
  });
