import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  SafeAreaView,
  Platform,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
  KeyboardAvoidingView,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Note = {
  id: string;
  text: string;
};

export default function XiaomiNotesClone() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const savedNotes = await AsyncStorage.getItem('@notes');
        if (savedNotes) setNotes(JSON.parse(savedNotes));
        const savedDarkMode = await AsyncStorage.getItem('@darkMode');
        if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
      } catch (e) {
        console.warn(e);
      }
    }
    loadData();
  }, []);

  const saveNotes = async (newNotes: Note[]) => {
    setNotes(newNotes);
    await AsyncStorage.setItem('@notes', JSON.stringify(newNotes));
  };

  const createNote = () => {
    const newNote: Note = { id: Date.now().toString(), text: '' };
    saveNotes([newNote, ...notes]);
    setCurrentNote(newNote);
    setCurrentText('');
    setIsEditing(true);
  };

  const openNote = (note: Note) => {
    setCurrentNote(note);
    setCurrentText(note.text);
    setIsEditing(false); // read-only
  };

  const updateNote = (text: string) => {
    setCurrentText(text);
    if (!currentNote) return;
    const updated = notes.map(n => (n.id === currentNote.id ? { ...n, text } : n));
    saveNotes(updated);
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      'Διαγραφή Σημείωσης',
      'Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτή τη σημείωση;',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: () => {
            const filtered = notes.filter(n => n.id !== id);
            saveNotes(filtered);
            setCurrentNote(null);
            setCurrentText('');
            setIsEditing(false);
          },
        },
      ]
    );
  };

  const bgColor = darkMode ? '#121212' : '#fff';
  const textColor = darkMode ? '#eee' : '#000';
  const listBg = darkMode ? '#1e1e1e' : '#f9f9f9';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {!currentNote ? (
          <>
            <FlatList
              data={notes}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
              renderItem={({ item }) => {
                const lines = (item.text || 'Κενή σημείωση').split('\n');
                return (
                  <TouchableOpacity
                    onPress={() => openNote(item)}
                    style={[styles.noteRow, { backgroundColor: listBg }]}
                  >
                    <Text numberOfLines={1} style={[styles.noteTitle, { color: textColor }]}>
                      {lines[0] || 'Κενή σημείωση'}
                    </Text>
                    {lines[1] && (
                      <Text numberOfLines={1} style={[styles.notePreview, { color: darkMode ? '#aaa' : '#555' }]}>
                        {lines.slice(1).join(' ')}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={<Text style={{ color: textColor, textAlign: 'center', marginTop: 40 }}>Δεν υπάρχουν σημειώσεις</Text>}
            />

            {/* Floating button */}
            <TouchableOpacity style={styles.fab} onPress={createNote}>
              <Text style={{ color: 'white', fontSize: 28 }}>＋</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Full screen modal for reading/editing
          <Modal visible={!!currentNote} animationType="slide">
            <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
              <View style={styles.toolbar}>
                <TouchableOpacity onPress={() => setCurrentNote(null)}>
                  <Text style={{ color: textColor, marginRight: 12 }}>← Πίσω</Text>
                </TouchableOpacity>
                {/* Delete button πάντα διαθέσιμο */}
                <TouchableOpacity onPress={() => deleteNote(currentNote.id)}>
                  <Text style={{ color: 'red', marginRight: 12 }}>🗑️ Διαγραφή</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                  <Text style={{ color: textColor, marginRight: 6 }}>Dark</Text>
                  <Switch value={darkMode} onValueChange={setDarkMode} />
                </View>
              </View>

              <TextInput
                style={[styles.textInput, { color: textColor }]}
                multiline
                value={currentText}
                onChangeText={isEditing ? updateNote : undefined}
                placeholder={isEditing ? "Γράψε σημείωση..." : ""}
                placeholderTextColor={darkMode ? '#888' : '#aaa'}
                editable={isEditing}
              />

              {isEditing && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Αποθήκευση</Text>
                </TouchableOpacity>
              )}
            </SafeAreaView>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0 },
  noteRow: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  notePreview: {
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a84ff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  saveButton: {
    backgroundColor: '#0a84ff',
    padding: 14,
    alignItems: 'center',
  },
});
