import React, { useReducer, createContext, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

// Define the types
type Item = {
  id: string;
  name: string;
};

type Action =
  | { type: 'ADD'; payload: Item }
  | { type: 'UPDATE'; payload: Item }
  | { type: 'DELETE'; payload: string };

type State = Item[];

// Initial state
const initialState: State = [];

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map(item => (item.id === action.payload.id ? action.payload : item));
    case 'DELETE':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};

// Create Context
const ItemsContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider Component
const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ItemsContext.Provider value={{ state, dispatch }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to use the ItemsContext
const useItems = () => useContext(ItemsContext);

// Main App Component
const App: React.FC = () => {
  const { state, dispatch } = useItems();
  const [name, setName] = React.useState('');
  const [editId, setEditId] = React.useState<string | null>(null);

  const handleAdd = () => {
    if (name.trim()) {
      const newItem: Item = {
        id: Math.random().toString(),
        name: name.trim(),
      };
      dispatch({ type: 'ADD', payload: newItem });
      setName('');
    }
  };

  const handleUpdate = () => {
    if (editId && name.trim()) {
      const updatedItem: Item = {
        id: editId,
        name: name.trim(),
      };
      dispatch({ type: 'UPDATE', payload: updatedItem });
      setName('');
      setEditId(null);
    }
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const handleEdit = (item: Item) => {
    setName(item.name);
    setEditId(item.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Text1}>Crud Assigment</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={name}
        onChangeText={setName}
      />
      <Button title={editId ? 'Update' : 'Add'} onPress={editId ? handleUpdate : handleAdd} />
      <FlatList
        data={state}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  Text1: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

// Wrap the App with the ItemsProvider
export default () => (
  <ItemsProvider>
    <App />
  </ItemsProvider>
);