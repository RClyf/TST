import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  SimpleGrid, 
  Box, 
  Card, 
  CardHeader, 
  CardBody,
  CardFooter, 
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
  Flex,
  Heading
} from '@chakra-ui/react';
import { Search2Icon } from "@chakra-ui/icons";

const Home = () => {
  const [token1, setToken1] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Ambil token dari sessionStorage atau localStorage saat komponen dipasang
    const storedToken1 = sessionStorage.getItem('token1');
    setToken1(storedToken1 || ''); // Jika tidak ada token, gunakan string kosong

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
    <Flex align={'center'} justify={'center'} textAlign="center" mt={10} mx={10}>
      {token1 ? (
        <Box margin="auto">
          <Heading fontSize={'4xl'} mb={4}>Rekomendasi Destinasi</Heading>
          {/* Input untuk melakukan pencarian */}
          <InputGroup borderRadius={5} size="sm">
            <InputLeftElement
              pointerEvents="none"
              children={<Search2Icon color="gray.600" />}
            />
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari nama atau lokasi destinasi..."
              border="1px solid #949494"
            />
          </InputGroup>

          {destinations ? (
            <SimpleGrid spacing={4} mt={5} columns={[1, null, 3]}>
              {destinations.filter(filterDestinations).map(destination => (
                <Card key={destination.destination_id}>
                  <CardHeader>
                    <Link to={`/destination/${destination.destination_id}`}>
                      <strong>{destination.name}</strong>
                    </Link>
                  </CardHeader>
                  <CardBody>
                    {destination.location}
                  </CardBody>
                  <CardFooter>
                    <Button as={Link} to={`/destination/${destination.destination_id}`}>View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      ) : (
        <p>Anda tidak memiliki akses. Silakan login terlebih dahulu.</p>
      )}
    </Flex>


  )
};

export default Home;
