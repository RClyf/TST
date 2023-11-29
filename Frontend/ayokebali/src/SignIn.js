import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import querystring from 'querystring';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react' 

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const signInToApis = async () => {
    try {
      const apiUrlSignIn1 = 'https://ayokebalitst.azurewebsites.net/signin';
      const apiUrlSignIn2 = 'https://loanrecommendationapi.azurewebsites.net/login';

      const dataForApi2 = querystring.stringify({ // Menggunakan querystring untuk format application/x-www-form-urlencoded
        username: username,
        password: password,
      });

      // Membuat dua permintaan sign in secara bersamaan
      const [response1, response2] = await Promise.all([
        axios.post(apiUrlSignIn1, {
          user_id: username,
          password: password,
        }),
        axios.post(apiUrlSignIn2, dataForApi2, { // Menggunakan dataForApi2 sebagai data
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Mengatur tipe konten
          },
        }),
      ]);

      // Handle respons dari kedua API sesuai kebutuhan aplikasi Anda
      if (response1.data.token || response2.data.access_token) {
        // Pilih token dari respons yang berhasil (disesuaikan dengan respons API)
        const token1 = response1.data.token 
        const token2 = response2.data.access_token;

        // Simpan token dalam sessionStorage atau localStorage
        sessionStorage.setItem('token1', token1);
        sessionStorage.setItem('token2', token2);

        // Redirect ke halaman home
        navigate('/home');
      } else {
        console.log(response1.data, response2.data);
        alert('Login gagal. Coba lagi.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setError('Kombinasi username dan password tidak valid.');
        } else {
          console.log(error);
          setError('Terjadi kesalahan. Silakan coba lagi.');
        }
      } else if (error.request) {
        setError('Terjadi kesalahan dalam mengirim permintaan.');
      } else {
        console.log(error);
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Panggil fungsi sign in ke dua API
    signInToApis();
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <input type="text" value={username} onChange={handleUsernameChange} required />
        </FormControl>
        <FormControl>
          <FormLabel>Password:</FormLabel>
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </FormControl>
        <button type="submit">Sign In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignIn;
