import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailPage from './DetailPage';
import { app, database } from './firebase.js';
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

const Stack = createNativeStackNavigator();

export default function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [values, loading, error] = useCollection(collection(database, "notes"));
  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  const submitButton = async () => {
    try {
      alert("You have submitted: " + text);
      await addDoc(collection(database, "notes"), {
        text: text
      });
      setText("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      alert('Notes saved successfully!');
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleEditNote = async (editedText, noteId) => {
    try {
      const noteRef = doc(database, "notes", noteId);
      await updateDoc(noteRef, { text: editedText });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const noteRef = doc(database, "notes", id);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home">
          {(props) => (
            <Home
              {...props}
              submitButton={submitButton}
              loadNotes={loadNotes}
              saveNotes={saveNotes}
              notes={notes}
              setText={setText}
              text={text}
              setNotes={setNotes}
              data={data}
              handleDeleteNote={handleDeleteNote}
              handleEditNote={handleEditNote}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="DetailPage">
          {(props) => (
            <DetailPage
              {...props}
              onSave={(editedText) => handleEditNote(editedText, props.route.params.note.id)}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Home = ({ navigation, route, submitButton, loadNotes, saveNotes, notes, setText, text, setNotes, data, handleDeleteNote }) => {
  const handleItemPress = (item) => {
    navigation.navigate('DetailPage', { note: item });
  };

  const truncateNote = (note) => {
    return note.length > 30 ? note.substring(0, 30) + "..." : note;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.note}>{truncateNote(item.text)}</Text>
        <Button title="Delete" onPress={() => handleDeleteNote(item.id)} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notebook</Text>
      <Button title='Detail Page' onPress={() => navigation.navigate('DetailPage')} />
      <TextInput style={styles.input} placeholder='Type Something' onChangeText={setText} value={text} />
      <Button title='Submit' onPress={submitButton} color="#841584" />
      <FlatList
        data={data}
        renderItem={renderItem}
      />
      <View style={styles.buttonContainer}>
        <Button title='Save Notes' onPress={saveNotes} style={styles.button} />
        <Button title='Load Notes' onPress={loadNotes} style={styles.button} />
        <Button title='Clear Notes' onPress={() => setNotes([])} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    marginTop: 10
  },
  note: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    marginBottom: 10,
  }
});
