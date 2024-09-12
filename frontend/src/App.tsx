import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  CircularProgress,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Item {
  id: bigint;
  description: string;
  completed: boolean;
  timestamp: bigint;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const result = await backend.getItems();
      setItems(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: { description: string }) => {
    try {
      setLoading(true);
      await backend.addItem(data.description);
      reset();
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      setLoading(false);
    }
  };

  const handleToggle = async (id: bigint) => {
    try {
      setLoading(true);
      await backend.toggleItemStatus(id);
      await fetchItems();
    } catch (error) {
      console.error('Error toggling item status:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      setLoading(true);
      await backend.removeItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Error removing item:', error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping List
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" mb={2}>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: 'Item description is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Add new item"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ ml: 1 }}
          >
            Add
          </Button>
        </Box>
      </form>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {items.map((item) => (
            <ListItem key={Number(item.id)} dense>
              <Checkbox
                edge="start"
                checked={item.completed}
                onChange={() => handleToggle(item.id)}
              />
              <ListItemText
                primary={item.description}
                style={{ textDecoration: item.completed ? 'line-through' : 'none' }}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default App;
