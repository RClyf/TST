import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Ambil token dari sessionStorage atau localStorage saat komponen dipasang
    const storedToken = sessionStorage.getItem('token') || localStorage.getItem('token');
    setToken(storedToken || ''); // Jika tidak ada token, gunakan string kosong
  }, []);

  useEffect(() => {
    // Ambil data destinasi berdasarkan ID dari API saat komponen dipasang
    if (token && id) {
      axios.get(`https://ayokebalitst.azurewebsites.net/destination/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Menyertakan token dalam header Authorization
        }
      })
        .then(response => {
          setDestination(response.data);
        })
        .catch(error => {
          console.error('Error fetching destination details:', error);
        });
    }
  }, [id, token]);

  return (
    <div>
      <h2>Detail Destinasi</h2>
      {destination ? (
        <div>
          <p><strong>{destination.name}</strong> ({destination.category})</p>
          <p>Latitude: {destination.latitude}</p>
          <p>Longitude: {destination.longitude}</p>
          <p>Average Time: {destination.avg_time} minutes</p>
          <p>Count: {destination.count}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DestinationDetail;
