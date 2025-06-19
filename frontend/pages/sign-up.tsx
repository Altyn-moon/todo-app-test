import { useState } from 'react';
import axios from 'axios';
import { TextInput, PasswordInput, Button, Container, Title, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/signup', {
        username,
        password,
      });

      showNotification({
        title: 'Успешно!',
        message: 'Пользователь зарегистрирован 🎉',
        color: 'green',
        icon: <IconCheck />,
      });

      setUsername('');
      setPassword('');
    } catch (error: any) {
      showNotification({
        title: 'Ошибка!',
        message: error.response?.data?.detail || 'Не удалось зарегистрироваться',
        color: 'red',
        icon: <IconX />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Регистрация</Title>
      <form onSubmit={handleSubmit}>
        <Stack spacing="md" mt="lg">
          <TextInput
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <Button className="app-button" type="submit" loading={loading} fullWidth>
            Зарегистрироваться
          </Button>
        </Stack>
      </form>

      <Button className="app-button" variant="subtle" fullWidth mt="sm" onClick={() => window.location.href = '/sign-in'}>
        Уже есть аккаунт? Войти
      </Button>

    </Container>
    
  );
}
