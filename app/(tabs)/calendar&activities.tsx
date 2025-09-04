import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  View,
  Text,
} from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface ItemBase {
  id: string;
  title: string;
  time: string;
  description: string;
}

interface EventsAndActivities {
  events: ItemBase[];
  activities: ItemBase[];
}

export default function CalendarScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const colors = {
    background: isDarkMode ? "#121212" : "#fff",
    text: isDarkMode ? "#fff" : "#000",
    card: isDarkMode ? "#1E1E1E" : "#f0f6ff",
    placeholder: "#999",
    primary: "#4A90E2",
    danger: "#FF3B30",
    today: "#FF6B6B",
    modalBackground: isDarkMode ? "#1E1E1E" : "#fff",
    calendarBackground: isDarkMode ? "#1E1E1E" : "#fff",
    border: isDarkMode ? "#333" : "#ddd",
    buttonBackground: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,1)",
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState<{ [key: string]: EventsAndActivities }>({});

  // Shared state για προσθήκη
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState(new Date());
  const [eventDescription, setEventDescription] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeType, setActiveType] = useState<"event" | "activity">("event");

  // Φόρτωση αποθηκευμένων
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("calendarData");
        if (stored) setData(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading:", error);
      }
    })();
  }, []);

  const saveData = async (newData: { [key: string]: EventsAndActivities }) => {
    try {
      await AsyncStorage.setItem("calendarData", JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Error saving:", error);
      Alert.alert("Error", "Failed to save");
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddItem = () => {
    if (!eventTitle.trim() || !eventDescription.trim()) {
      Alert.alert("Error", "Please fill all details");
      return;
    }

    const formattedTime = eventTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newItem: ItemBase = {
      id: generateId(),
      title: eventTitle.trim(),
      time: formattedTime,
      description: eventDescription.trim(),
    };

    const prev = data[selectedDate] || { events: [], activities: [] };
    const updated: EventsAndActivities = {
      events:
        activeType === "event" ? [...prev.events, newItem] : prev.events,
      activities:
        activeType === "activity" ? [...prev.activities, newItem] : prev.activities,
    };

    const newData = { ...data, [selectedDate]: updated };
    saveData(newData);

    setEventTitle("");
    setEventDescription("");
    setEventTime(new Date());
    setModalVisible(false);
  };

  const handleDeleteItem = (id: string, type: "event" | "activity") => {
    Alert.alert("Confirm Delete", "Delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const prev = data[selectedDate] || { events: [], activities: [] };
          const updated: EventsAndActivities = {
            events:
              type === "event"
                ? prev.events.filter((e) => e.id !== id)
                : prev.events,
            activities:
              type === "activity"
                ? prev.activities.filter((a) => a.id !== id)
                : prev.activities,
          };
          if (updated.events.length === 0 && updated.activities.length === 0) {
            const newData = { ...data };
            delete newData[selectedDate];
            saveData(newData);
          } else {
            saveData({ ...data, [selectedDate]: updated });
          }
        },
      },
    ]);
  };

  const markedDates: Record<string, any> = {};
  Object.keys(data).forEach((date) => {
    markedDates[date] = { marked: true, dotColor: colors.primary };
  });
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: colors.primary,
  };

  const renderItems = (items: ItemBase[], type: "event" | "activity") => (
    <>
      {items.map((item) => (
        <View
          key={item.id}
          style={[styles.eventCardRow, { backgroundColor: colors.card }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.eventTime, { color: colors.primary }]}>
              {item.time}
            </Text>
            <Text style={[styles.eventDescription, { color: colors.text }]}>
              {item.description}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteItem(item.id, type)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={28} color={colors.primary} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.addButton,
              { backgroundColor: colors.buttonBackground, marginRight: 8 },
            ]}
          >
            <Ionicons
              name={isDarkMode ? "sunny-outline" : "moon-outline"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveType("event");
              setModalVisible(true);
            }}
            style={[styles.addButton, { backgroundColor: colors.buttonBackground }]}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveType("activity");
              setModalVisible(true);
            }}
            style={[styles.addButton, { backgroundColor: colors.buttonBackground, marginLeft: 8 }]}
          >
            <Ionicons name="bicycle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <Calendar
          style={styles.calendar}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: colors.calendarBackground,
            calendarBackground: colors.calendarBackground,
            textSectionTitleColor: colors.text,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: "#fff",
            todayTextColor: colors.today,
            dayTextColor: colors.text,
            textDisabledColor: "#ccc",
            dotColor: colors.primary,
            selectedDotColor: "#fff",
            arrowColor: colors.primary,
            monthTextColor: colors.text,
            textMonthFontWeight: "bold",
          }}
        />

        <View style={styles.eventsSection}>
          <Text style={[styles.eventsTitle, { color: colors.text }]}>
            Events on {selectedDate}
          </Text>
          {data[selectedDate]?.events?.length > 0 ? (
            renderItems(data[selectedDate].events, "event")
          ) : (
            <Text style={[styles.noEventsText, { color: colors.placeholder }]}>
              No events
            </Text>
          )}

          <Text style={[styles.eventsTitle, { color: colors.text, marginTop: 20 }]}>
            Activities on {selectedDate}
          </Text>
          {data[selectedDate]?.activities?.length > 0 ? (
            renderItems(data[selectedDate].activities, "activity")
          ) : (
            <Text style={[styles.noEventsText, { color: colors.placeholder }]}>
              No activities
            </Text>
          )}
        </View>
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View
          style={[styles.modalContent, { backgroundColor: colors.modalBackground }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Add {activeType === "event" ? "Event" : "Activity"} for {selectedDate}
          </Text>

          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
            ]}
            placeholder="Title"
            placeholderTextColor={colors.placeholder}
            value={eventTitle}
            onChangeText={setEventTitle}
          />

          <TouchableOpacity
            style={[
              styles.timeInput,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={{ color: colors.text }}>
              {eventTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={eventTime}
              mode="time"
              display="default"
              onChange={(e, date) => {
                setShowTimePicker(false);
                if (date) setEventTime(date);
              }}
            />
          )}

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
            ]}
            placeholder="Description"
            placeholderTextColor={colors.placeholder}
            value={eventDescription}
            onChangeText={setEventDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              color={colors.danger}
              onPress={() => setModalVisible(false)}
            />
            <Button title="Add" onPress={handleAddItem} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  addButton: {
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: { marginHorizontal: 16, borderRadius: 12, elevation: 4 },
  eventsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  eventsTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  eventCardRow: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  eventTitle: { fontWeight: "700", fontSize: 16 },
  eventTime: { fontWeight: "600", marginTop: 2 },
  eventDescription: { marginTop: 6, fontSize: 14 },
  deleteButton: {
    marginLeft: 12,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  noEventsText: { fontStyle: "italic", textAlign: "center", marginTop: 10 },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  descriptionInput: { height: 100, textAlignVertical: "top", paddingTop: 12 },
  timeInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    justifyContent: "center",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});
