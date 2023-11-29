import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrlRegister1 = 'https://ayokebalitst.azurewebsites.net/register';
      const apiUrlRegister2 = 'https://loanrecommendationapi.azurewebsites.net/register';

      // Membuat dua permintaan registrasi secara bersamaan
      const [response1, response2] = await Promise.all([
        axios.post(apiUrlRegister1, {
          username: username,
          password: password,
        }),
        axios.post(apiUrlRegister2, {
          username: username,
          password: password,
        }),
      ]);

      // Handle respons dari kedua API sesuai kebutuhan aplikasi Anda
      if (response1.data.username && response2.data.message) {
        alert('Registrasi berhasil!!!');
        navigate('/');
      } else {
        console.log(response1.data, response2.data);
        alert('Registrasi gagal. Coba lagi.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setError('Username sudah digunakan. Silakan pilih username lain.');
        } else if (error.response.status === 400) {
            setError('Username sudah digunakan. Silakan pilih username lain.');
        } else {
          console.log(error);
          setError('Terjadi kesalahan. Silakan coba lagi.');
        }
      } else if (error.request) {
        console.log(error);
        setError('Terjadi kesalahan dalam mengirim permintaan.');
      } else {
        console.log(error);
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Welcome to Ayo Ke Bali</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Your Guidebook To Bali
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <Heading fontSize={'2xl'}>Register</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" value={username} onChange={handleUsernameChange} required />
            </FormControl>
            <FormControl id="password" isRequired mb={4}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack align={'center'}>
              <Text fontSize={'md'} color={'gray.600'}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Link to={`/`}>
                    <strong>Already a user?</strong>
                  </Link>
              </Text>
            </Stack>
            <Stack spacing={10} mt={5}>
              <Button  type="submit"
                bg={'teal.200'}
                color={'white'}
                _hover={{
                  bg: 'teal.200',
                }}>
                Register
              </Button>
            </Stack>
          </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
};

export default Register;
