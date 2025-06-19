import { useState } from 'react';
import { TextInput, PasswordInput, Button, Container, Title, Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
        username,
        password,
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      localStorage.setItem('access_token', response.data.access_token);

      setNotification({ type: 'success', message: 'Вход выполнен!' });
      setTimeout(() => {
        window.location.href = '/todos';
      }, 1000);

    } catch (error) {
      setNotification({ type: 'error', message: 'Неверный логин или пароль' });
    }
  };

  return (
    <Container size="xs">
      <Title align="center" mb="md">Вход</Title>

      <TextInput label="Имя пользователя" value={username} onChange={(e) => setUsername(e.currentTarget.value)} mb="sm" required />
      <PasswordInput label="Пароль" value={password} onChange={(e) => setPassword(e.currentTarget.value)} mb="sm" required />
      <Button className="app-button" fullWidth onClick={handleSubmit}>Войти</Button>

      {notification && (
        <Notification
          icon={notification.type === 'success' ? <IconCheck /> : <IconX />}
          color={notification.type === 'success' ? 'teal' : 'red'}
          mt="md"
          withCloseButton
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Notification>
      )}

      <Button className="app-button" variant="subtle" fullWidth mt="sm" onClick={() => window.location.href = '/sign-up'}>
        Нет аккаунта? Зарегистрироваться
      </Button>

    </Container>
  );
}
