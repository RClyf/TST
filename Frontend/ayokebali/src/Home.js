import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [token, setToken] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Ambil token dari sessionStorage atau localStorage saat komponen dipasang
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken || ''); // Jika tidak ada token, gunakan string kosong

    // Ambil data destinasi dari API saat komponen dipasang
    axios.get('https://ayokebalitst.azurewebsites.net/destination', {
      headers: {
        Authorization: `Bearer ${token}` // Menyertakan token dalam header Authorization
      }
    })
      .then(response => {
        // Mengacak urutan destinasi sebelum diset ke state
        const shuffledDestinations = shuffleArray(response.data);
        setDestinations(shuffledDestinations);
      })
      .catch(error => {
        console.error('Error fetching destinations:', error);
      });
  }, [token]); // Perubahan token akan memicu pengambilan data ulang

  // Fungsi untuk mengacak array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fungsi untuk melakukan pencarian berdasarkan nama dan lokasi
  const filterDestinations = (destination) => {
    return (
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Fungsi untuk menangani perubahan input pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h2>Home</h2>
      {token ? (
        <div>
          <p>Selamat datang di Ayo Ke Bali!</p>

          <h3>Rekomendasi Destinasi:</h3>
          
          {/* Input untuk melakukan pencarian */}
          <input
            type="text"
            placeholder="Cari nama atau lokasi destinasi..."
            value={searchTerm}
            onChange={handleSearchChange} 
            style={{ width: '500px' }}
          />
          {destinations ? (
            <ul>
              {destinations.filter(filterDestinations).map(destination => (
                <li key={destination.destination_id}>
                  <Link to={`/destination/${destination.destination_id}`}>
                    <strong>{destination.name}</strong>
                  </Link>
                  {' '}({destination.location})
                  <br/><br/>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <p>Anda tidak memiliki akses. Silakan login terlebih dahulu.</p>
      )}
    </div>
  );
};

export default Home;
