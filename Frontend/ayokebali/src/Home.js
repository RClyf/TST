import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Ambil token dari sessionStorage atau localStorage saat komponen dipasang
    const storedToken1 = sessionStorage.getItem('token1');
    const storedToken2 = sessionStorage.getItem('token2');
    
    setToken1(storedToken1 || ''); // Jika tidak ada token, gunakan string kosong
    setToken2(storedToken2 || ''); // Jika tidak ada token, gunakan string kosong

    // Ambil data destinasi dari API saat komponen dipasang
    axios.get('https://ayokebalitst.azurewebsites.net/destination', {
      headers: {
        Authorization: `Bearer ${token1}` // Menggunakan token1 dalam header Authorization
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
  }, [token1]); // Perubahan token1 akan memicu pengambilan data ulang

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
      {token1 ? (
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
