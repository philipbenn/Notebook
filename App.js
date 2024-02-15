import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailPage from './DetailPage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  function submitButton() {
    alert("You have submitted: " + text)
    setNotes(prevNotes => [...notes, { key: notes.length, value: text }])
    setText("")
  }

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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home">
          {(props) => <Home {...props} submitButton={submitButton} loadNotes={loadNotes} saveNotes={saveNotes} notes={notes} setText={setText} text={text} setNotes={setNotes} />}
        </Stack.Screen>

        <Stack.Screen name="DetailPage">
          {(props) => <DetailPage {...props} saveNotes={saveNotes} notes={notes} setNotes={setNotes} />}
        </Stack.Screen>


      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Home = ({ navigation, route, submitButton, loadNotes, saveNotes, notes, setText, text, setNotes }) => {
  const handleItemPress = (item) => {
    navigation.navigate('DetailPage', { message: item.value });
  };

  const truncateNote = (note) => {
    return note.length > 30 ? note.substring(0, 30) + "..." : note;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notebook</Text>
      <Button title='Detail Page' onPress={() => navigation.navigate('DetailPage')} />
      <TextInput style={styles.input} placeholder='Type Something' onChangeText={setText} value={text} />
      <Button title='Submit' onPress={submitButton} color="#841584" />
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Text style={styles.note}>{truncateNote(item.value)}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button title='Save Notes' onPress={saveNotes} />
        <Button title='Load Notes' onPress={loadNotes} />
        <Button title='Clear Notes' onPress={() => setNotes([])} />
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
});
