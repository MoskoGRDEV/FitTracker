import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  BackHandler, 
  Modal, 
  Pressable 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@user_settings";
const defaultSettings = { darkMode: false };

const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDarkMode(parsed.darkMode);
      }
    };
    loadSettings();
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ darkMode: newValue }));
  };

  const exitApp = () => {
    BackHandler.exitApp();
  };

  const isDark = darkMode;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f2f2f2" }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, { color: isDark ? "#fff" : "#222" }]}>Ρυθμίσεις</Text>

        {/* Dark Mode */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>

        {/* Privacy & Policy */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: "#4F8EF7" }]} 
          onPress={() => setShowPrivacy(true)}
        >
          <Text style={styles.buttonText}>Privacy & Policy</Text>
        </TouchableOpacity>

        {/* Exit App */}
        <TouchableOpacity style={[styles.button, { backgroundColor: "#e63946" }]} onPress={exitApp}>
          <Text style={styles.buttonText}>Έξοδος</Text>
        </TouchableOpacity>

        {/* Privacy Modal */}
        <Modal
          visible={showPrivacy}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: isDark ? "#1f1f1f" : "#fff" }]}>
              <Text style={[styles.modalHeader, { color: isDark ? "#fff" : "#000" }]}>Privacy & Policy</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                <Text style={{ color: isDark ? "#ccc" : "#333" }}>
                Η εφαρμογή FitTracker δεσμεύεται να προστατεύει την ιδιωτικότητα των χρηστών.

Συλλογή Δεδομένων
Η εφαρμογή FitTracker δεν συλλέγει κανένα προσωπικό δεδομένο , η εφαρμογή δεν περιέχει μηχανισμούς παρακολούθησης (όπως μετρητές βημάτων, αισθητήρες κίνησης ή GPS) και δεν απαιτεί τη δημιουργία λογαριασμού.

Αποθήκευση Δεδομένων
η εφαρμογή δεν αποθηκεύει δεδομένα σε εξωτερικούς διακομιστές. Δεν υπάρχει καμία αποστολή ή κοινοποίηση δεδομένων σε τρίτους.

Χρήση Δεδομένων
Καθώς η FitTracker δεν συλλέγει δεδομένα, δεν υπάρχει καμία χρήση, επεξεργασία ή ανάλυση δεδομένων χρηστών.

Σύνδεση στο Διαδίκτυο
η εφαρμογή λειτουργεί πλήρως χωρίς σύνδεση στο διαδίκτυο και δεν πραγματοποιεί επικοινωνία με εξωτερικές υπηρεσίες.

Δικαιώματα Χρήστη
Δεδομένου ότι δεν συλλέγονται ούτε αποθηκεύονται δεδομένα, δεν απαιτούνται ενέργειες από τον χρήστη για την προστασία της ιδιωτικότητάς του.
                </Text>
              </ScrollView>
              <Pressable style={styles.modalButton} onPress={() => setShowPrivacy(false)}>
                <Text style={styles.modalButtonText}>Κλείσιμο</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  label: { fontSize: 16, flex: 1 },
  button: { padding: 12, borderRadius: 10, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "600" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { padding: 20, borderRadius: 10, width: '90%' },
  modalHeader: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  modalButton: { marginTop: 20, backgroundColor: "#4F8EF7", padding: 10, borderRadius: 8, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "600" },
});

export default SettingsScreen;
