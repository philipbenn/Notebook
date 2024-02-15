import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

const DetailPage = ({ navigation, route, saveNotes, notes, setNotes }) => {
  const [editedMessage, setEditedMessage] = useState(route.params?.message);

  const handleSaveNote = () => {
    const updatedNotes = (notes).map(note => {
      if (note.value === route.params?.message) {
        return { ...note, value: editedMessage };
      }
      return note;
    });
    setNotes(updatedNotes);
    saveNotes();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={editedMessage}
        onChangeText={setEditedMessage}
      />
      <Button title="Save" onPress={handleSaveNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    margin: 10,
    width: 200,
  },
});

export default DetailPage;
