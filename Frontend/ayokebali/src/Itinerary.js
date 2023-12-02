import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';

const Itinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [token1, setToken1] = useState('');
  const username = sessionStorage.getItem('username'); // Ambil username dari session

  useEffect(() => {
    const storedToken1 = sessionStorage.getItem('token1');
    setToken1(storedToken1 || ''); // Jika tidak ada token, gunakan string kosong

    if (username) {
      // Fetch data itinerary berdasarkan username dari API
      axios.get(`https://ayokebalitst.azurewebsites.net/itinerary/user/${username}`, {
        headers: {
          Authorization: `Bearer ${storedToken1}` // Menyertakan token dalam header Authorization
        }
      })
        .then(response => {
          setItineraries(response.data);
        })
        .catch(error => {
          console.error('Error fetching itinerary data:', error);
        });
    }
  }, [username]);

  return (
    <Box>
      <Heading mb={4}>Daftar Itinerary</Heading>

      {itineraries.map(itinerary => (
        <Box key={itinerary.id} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
          <VStack align="start">
            <Text>Username: {itinerary.username}</Text>
            <Text>Lama Kunjungan: {itinerary.lama_kunjungan} hari</Text>
            <Text>Accommodation: {itinerary.accommodation}</Text>

            <HStack>
              <Text>Destinations:</Text>
              {itinerary.destination.map(destinationId => (
                <Badge key={destinationId} colorScheme="blue" ml={1}>
                  {destinationId}
                </Badge>
              ))}
            </HStack>

            <Text>Estimasi Budget: Rp {itinerary.estimasi_budget.toLocaleString()}</Text>
          </VStack>
        </Box>
      ))}
    </Box>
  );
};

export default Itinerary;
