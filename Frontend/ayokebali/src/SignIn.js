import React, { useState } from 'react';
import axios from 'axios';

const SignIn = () => {
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
      const apiUrl = 'https://ayokebalitst.azurewebsites.net/signin';

      const response = await axios.post(apiUrl, {
        user_id: username,
        password: password,
      });

      // Handle respons dari API sesuai kebutuhan aplikasi Anda
      if (response.data.token) {
        alert('Login berhasil!');
      } else {
        console.log(response.data);
        alert('Login gagal. Coba lagi.');
      }
    } catch (error) {
      if (error.response) {
        // Respons diterima dari server, tetapi tidak dalam kisaran status 2xx
        if (error.response.status === 422) {
          setError('Kombinasi username dan password tidak valid.');
        } else {
          setError('Terjadi kesalahan. Silakan coba lagi.');
        }
      } else if (error.request) {
        // Permintaan dikirimkan tetapi tidak menerima respons atau terjadi kesalahan lain
        setError('Terjadi kesalahan dalam mengirim permintaan.');
      } else {
        // Kesalahan lainnya
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignIn;
