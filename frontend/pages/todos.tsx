import { useEffect, useState } from 'react';
import {
  Container, Title, List, Text, Notification,
  TextInput, Textarea, Button, Group, Divider
} from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import axios from 'axios';

interface ToDo {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
}

export default function Todos() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (err) {
      setError('Не удалось загрузить задачи. Возможно, вы не авторизованы.');
    }
  };

  const createTodo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://127.0.0.1:8000/todos', {
        title,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle('');
      setDescription('');
      setSuccess('Задача успешно создана!');
      fetchTodos(); // обновим список
    } catch (err) {
      setError('Ошибка при создании задачи.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = '/sign-in';
        return;
    }

    fetchTodos();
  }, []);

  return (
    <Container size="sm" mt="xl">
      <Title align="center" mb="md">Мои задачи</Title>

      <Button className="app-button" variant="outline" color="gray" size="xs" onClick={() => {
        localStorage.removeItem('access_token');
        window.location.href = '/sign-in';
      }}>
        Выйти
      </Button>

      {error && (
        <Notification color="red" icon={<IconX />} withCloseButton onClose={() => setError(null)}>
          {error}
        </Notification>
      )}
      {success && (
        <Notification color="teal" icon={<IconCheck />} withCloseButton onClose={() => setSuccess(null)}>
          {success}
        </Notification>
      )}

      <Divider my="lg" label="Создать задачу" labelPosition="center" />

      <TextInput label="Заголовок" value={title} onChange={(e) => setTitle(e.currentTarget.value)} required />
      <Textarea label="Описание" value={description} onChange={(e) => setDescription(e.currentTarget.value)} required mt="sm" />

      <Group mt="md">
        <Button className="app-button" onClick={createTodo}>Создать</Button>
      </Group>

      <Divider my="lg" label="Список задач" labelPosition="center" />

      {todos.length === 0 && !error && <Text>Задач пока нет</Text>}

      <List spacing="sm" size="md" center>
        {todos.map((todo) => (
            <List.Item key={todo.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingId === todo.id ? (
                <div style={{ flex: 1 }}>
                    <TextInput
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.currentTarget.value)}
                    mb={5}
                    />
                    <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.currentTarget.value)}
                    />
                    <Group mt="xs">
                    <Button className="app-button"
                        size="xs"
                        color="green"
                        onClick={async () => {
                        try {
                            const token = localStorage.getItem('access_token');
                            await axios.put(`http://127.0.0.1:8000/todos/${todo.id}`, {
                            title: editTitle,
                            description: editDescription,
                            }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            });
                            setEditingId(null);
                            fetchTodos();
                        } catch {
                            setError('Не удалось обновить задачу.');
                        }
                        }}
                    >
                        Сохранить
                    </Button>
                    <Button className="app-button" size="xs" variant="outline" onClick={() => setEditingId(null)}>
                        Отмена
                    </Button>
                    </Group>
                </div>
                ) : (
                <>
                    <div>
                    <strong>{todo.title}</strong> — {todo.description}
                    </div>
                    <Group>
                    <Button className="app-button" size="xs" color="blue" onClick={() => {
                        setEditingId(todo.id);
                        setEditTitle(todo.title);
                        setEditDescription(todo.description);
                    }}>
                        Изменить
                    </Button>
                    <Button className="app-button" color="red" size="xs" onClick={async () => {
                        try {
                        const token = localStorage.getItem('access_token');
                        await axios.delete(`http://127.0.0.1:8000/todos/${todo.id}`, {
                            headers: {
                            Authorization: `Bearer ${token}`,
                            },
                        });
                        setSuccess('Задача удалена.');
                        fetchTodos();
                        } catch {
                        setError('Не удалось удалить задачу.');
                        }
                    }}>
                        Удалить
                    </Button>
                    </Group>
                </>
                )}
            </div>
            </List.Item>
        ))}
        </List>
    </Container>
  );
}
