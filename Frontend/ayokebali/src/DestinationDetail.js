import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [token1, setToken1] = useState('');

  useEffect(() => {
    // Ambil token dari sessionStorage atau localStorage saat komponen dipasang
    const storedToken1 = sessionStorage.getItem('token1');
    setToken1(storedToken1 || ''); // Jika tidak ada token, gunakan string kosong
  }, []);

  useEffect(() => {
    // Ambil data destinasi berdasarkan ID dari API saat komponen dipasang
    if (token1 && id) {
      axios.get(`https://ayokebalitst.azurewebsites.net/destination/${id}`, {
        headers: {
          Authorization: `Bearer ${token1}` // Menyertakan token dalam header Authorization
        }
      })
        .then(response => {
          setDestination(response.data);
        })
        .catch(error => {
          console.error('Error fetching destination details:', error);
        });
    }
  }, [id, token1]);

  return (
    <div>
      <h2>Detail Destinasi</h2>
      {destination ? (
        <div>
          <p><strong>{destination.name}</strong> ({destination.location})</p>
          <p>Category: {destination.category}</p>
          <p>Latitude: {destination.latitude}</p>
          <p>Longitude: {destination.longitude}</p>
          <p>Estimasi Biaya: {destination.perkiraan_biaya}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DestinationDetail;
