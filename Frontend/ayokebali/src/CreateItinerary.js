import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  Badge,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Links = [ 'Home','Itinerary', 'Loan'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const AddItinerary = () => {
    const username = sessionStorage.getItem('username');
    const storedToken1 = sessionStorage.getItem('token1');
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [formData, setFormData] = useState({
      id: '',
      username: username,
      date: '',
      lama_kunjungan: '',
      accommodation: '',
      destination: [],
      estimasi_budget: 0,
    });

    

    const generateRandomId = () => {
      return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    };
  
    const isIdAvailable = async (itineraryId) => {
      try {
        const response = await axios.get(`https://ayokebalitst.azurewebsites.net/itinerary/${itineraryId}`, {
          headers: {
            Authorization: `Bearer ${storedToken1}`,
          },
        });
        
        if (response.status){
          return false
        }  // Jika 404, artinya id belum digunakan
      } catch (error) {
        return true;  // Anda dapat menangani error sesuai kebutuhan aplikasi Anda
      }
    };
  
    const getAvailableId = async () => {
      const maxAttempts = 10;
  
      for (let i = 0; i < maxAttempts; i++) {
        const randomId = generateRandomId();
        const idAvailable = await isIdAvailable(randomId);
  
        if (idAvailable) {
          setFormData((prevData) => ({
            id: Number(randomId),
            ...prevData,
          }));
          return;
        }
      }
  
      console.error(`Failed to get an available id after ${maxAttempts} attempts`);
      // Handle the failure case as needed for your application
    };

  const [destinationsList, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fungsi untuk mengacak array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('https://ayokebalitst.azurewebsites.net/destination', {
          headers: {
            Authorization: `Bearer ${storedToken1}`,
          },
        });
        const shuffledDestinations = shuffleArray(response.data);
        setDestinations(shuffledDestinations);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []); // Fetch destinasi hanya sekali saat komponen dimount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDestinationChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleAddDestination = () => {
    const destinationId = Number(searchQuery);
    if (!isNaN(destinationId) && destinationId > 0) {
      if (!formData.destination.includes(destinationId)) {
        setFormData((prevData) => ({
          ...prevData,
          destination: [...prevData.destination, destinationId],
        }));
        setSearchQuery(''); // Clear the searchQuery after successfully adding the destination
      } else {
        alert('Destination sudah ada dalam itinerary.');
        // Provide feedback if destinationId already exists
      }
    } else {
      alert('DestinationId tidak valid.');
    }
  };
  
  
  
  const handleLamaKunjunganChange = (e) => {
    const value = e.target.value;
  
    // Pastikan nilai yang dimasukkan adalah bilangan bulat positif
    if (/^[1-9]\d*$/.test(value) || value === '') {
      setFormData((prevData) => ({
        ...prevData,
        lama_kunjungan: Number(value),
      }));
    }
    // Jika nilai yang dimasukkan tidak valid, Anda bisa memberikan feedback kepada pengguna atau mengambil tindakan lainnya.
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await getAvailableId();

    const lama_kunjungan = Number(formData.lama_kunjungan);
    if (!isNaN(lama_kunjungan)) {
      setFormData((prevData) => ({
        ...prevData,
        lama_kunjungan: lama_kunjungan,
        searchQuery: '',
      }));
    }
    try {
      const response = await axios.post(
        'https://ayokebalitst.azurewebsites.net/itinerary',
        {
          id: formData.id,
          username: formData.username,
          date: formData.date,
          lama_kunjungan: formData.lama_kunjungan,
          accommodation: formData.accommodation,
          destination: formData.destination,
          estimasi_budget: formData.estimasi_budget,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken1}`,
            'Content-Type': 'application/json', // Set Content-Type header to application/json
          },
        }
      );
      // Handle redirect or other actions after successful submission
    } catch (error) {
      console.error('Error submitting itinerary:', error);
    }
    window.location.href = '/itinerary';
  };

  const SignOut = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  return (
    <Box>
      <Box bg={useColorModeValue('teal.200', 'teal.900')} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <IconButton
              size={'md'}
              icon={<HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={'center'}>
              <Box>Ayo Ke Bali</Box>
              <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                {Links.map((link) => (
                  <Button bg={'teal.200'} key={link} as={Link} to={`/${link.toLowerCase()}`} variant="ghost">
                    {link}
                  </Button>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={'center'}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={
                      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                </MenuButton>
                <MenuList>
                  <Text>Hello, {username}</Text>
                  <MenuDivider />
                  <Link to="/" onClick={SignOut}>Sign Out</Link>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link} to={`/${link.toLowerCase()}`}>{link}</NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      <Heading mb={4} mt={4} >Buat Itinerary Baru</Heading>
      <Box mx={10}>
        <form onSubmit={handleSubmit} >
          <VStack align="start">
            <FormControl id="date" isRequired>
              <FormLabel>Tanggal</FormLabel>
              <Input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Format dalam DD-MM-YYYY"
              />
            </FormControl>

            <FormControl id="lama_kunjungan" isRequired>
              <FormLabel>Lama Kunjungan (hari)</FormLabel>
              <Input
                type="number"
                name="lama_kunjungan"
                value={formData.lama_kunjungan}
                onChange={handleLamaKunjunganChange}
                placeholder="Format dalam integer positif (0,1,2,dst)"
              />
            </FormControl>

            <FormControl id="accommodation" isRequired>
              <FormLabel>Akomodasi</FormLabel>
              <Select name="accommodation" value={formData.accommodation} onChange={handleChange}>
                <option value="3 star">3 Star</option>
                <option value="4 star">4 Star</option>
                <option value="5 star">5 Star</option>
              </Select>
            </FormControl>

            <FormControl id="destination">
              <FormLabel>Destinasi</FormLabel>
              <InputGroup>
              <Select
                name="searchQuery"
                value={searchQuery}
                onChange={handleDestinationChange}
                placeholder="Pilih destinasi"
              >
                {destinationsList.map((destination) => (
                  <option key={destination.destination_id} value={destination.destination_id}>
                    {destination.name} ({destination.location})
                  </option>
                ))}
              </Select>
                <InputRightElement width="4.5rem">
                  <Button bg="teal.200" h="1.75rem" size="sm" onClick={handleAddDestination}>
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text fontSize="sm" mt={1}>
                Pilih destinasi dari daftar dan tekan "Add" untuk menambahkan ke itinerary.
              </Text>
            </FormControl>

            <Button type="submit" bg="teal.200" mt={4} mx="auto">
              Buat
            </Button>
          </VStack>
        </form>
        </Box>
    </Box>
  );
};

export default AddItinerary;
