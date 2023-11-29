import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrlRegister1 = 'https://ayokebalitst.azurewebsites.net/register';
      const apiUrlRegister2 = 'https://loanrecommendationapi.azurewebsites.net/register';

      // Membuat dua permintaan registrasi secara bersamaan
      const [response1, response2] = await Promise.all([
        axios.post(apiUrlRegister1, {
          user_id: username,
          password: password,
        }),
        axios.post(apiUrlRegister2, {
          username: username,
          password: password,
        }),
      ]);

      // Handle respons dari kedua API sesuai kebutuhan aplikasi Anda
      if (response1.data.user_id && response2.data.message) {
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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Register;
