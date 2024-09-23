import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'todos';

export default function App() {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      return AsyncStorage.getItem(STORAGE_KEY)
        .then((req) => JSON.parse(req))
        .then((json) => {
          if (json === null) {
            json = [];
          }
          setTodos(json);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const addTodo = () => {
    const newKey = String(todos.length);
    const object = { key: newKey, description: newTodo, completed: false };
    const newTodos = [...todos, object];
    setTodos(newTodos);
    setNewTodo('');
    storeData(newTodos);
  };

  // Toggle the completed status of a todo
  const toggleTodoCompletion = (key) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.key === key) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
    storeData(updatedTodos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todos</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new todo..."
        value={newTodo}
        onChangeText={(text) => setNewTodo(text)}
        returnKeyType="done"
        onSubmitEditing={() => addTodo()}
      />

      <FlatList
        style={styles.list}
        data={todos}
        extraData={todos}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleTodoCompletion(item.key)}>
            <Text style={[styles.todoItem, item.completed && styles.completedTodo]}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => {
            try {
              await AsyncStorage.clear();
              setTodos([]);
            } catch (e) {
              console.log(e);
            }
          }}
          title="Clear stored data"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 48,
    margin: 16,
  },
  input: {
    height: 45,
    width: '80%',
    fontSize: 16,
    margin: 16,
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
  },
  list: {
    margin: 8,
  },
  todoItem: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  buttonContainer: {
    flex: 3,
    margin: 16,
  },
});