import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Flex,
  IconButton,
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Avatar
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Links = [ 'Home','Itinerary', 'Loan'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const Itinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const username = sessionStorage.getItem('username');
  const { isOpen, onOpen, onClose } = useDisclosure()
  const storedToken1 = sessionStorage.getItem('token1');

  useEffect(() => {
    fetchData();
  }, [username]);

  const fetchData = async () => {
      

    if (username) {
      try {
        // Fetch data itinerary berdasarkan username dari API
        const response = await axios.get(`https://ayokebalitst.azurewebsites.net/itinerary/user/${username}`, {
          headers: {
            Authorization: `Bearer ${storedToken1}` // Menyertakan token dalam header Authorization
          }
        });

        // Ambil data detail destinasi untuk setiap destination_id dalam itinerary
        const itinerariesWithDestinations = await Promise.all(
          response.data.map(async (itinerary) => {
            const destinationDetails = await Promise.all(
              itinerary.destination.map(async (destinationId) => {
                const destinationResponse = await axios.get(`https://ayokebalitst.azurewebsites.net/destination/${destinationId}`, {
                  headers: {
                    Authorization: `Bearer ${storedToken1}` // Menyertakan token dalam header Authorization
                  }
                });
                return destinationResponse.data;
              })
            );

            return {
              ...itinerary,
              destination: destinationDetails,
            };
          })
        );

        setItineraries(itinerariesWithDestinations);
      } catch (error) {
        console.error('Error fetching itinerary data:', error);
      }
    }
  };

  const handleDeleteItinerary = async (itineraryId) => {
    try {
      // Panggil API untuk melakukan penghapusan
      await axios.delete(`https://ayokebalitst.azurewebsites.net/itinerary/${itineraryId}`,{
        headers: {
          Authorization: `Bearer ${storedToken1}` // Menyertakan token dalam header Authorization
        }
      });
  
      fetchData()
      alert(`Itinerary berhasil dihapus`);
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
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
      <Heading mb={4} mt={4}>Daftar Itinerary</Heading>
      <Button bg={'teal.200'} as={Link} to={`/create-itinerary`} mb={4}>
        Create Itinerary
      </Button>
      {itineraries.map(itinerary => (
        <Box key={itinerary.id} borderWidth="1px" borderRadius="lg" p={4} mx={10} mb={4}>
          <VStack align="start">
            <Text>Tanggal: {itinerary.date}</Text>
            <Text>Lama Kunjungan: {itinerary.lama_kunjungan} hari</Text>
            <Text>Accommodation: {itinerary.accommodation}</Text>

            <HStack>
              <Text>Destinations:</Text>
              {itinerary.destination.map(destination => (
                <Badge key={destination.destination_id} colorScheme="blue" ml={1}>
                  {destination.name} ({destination.location})
                </Badge>
              ))}
            </HStack>

            <Text>Estimasi Budget: Rp {itinerary.estimasi_budget.toLocaleString()}</Text>

            {/* Tombol Delete */}
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Button bg={'green.400'} color={'white'} as={Link} to={`/loan`} mr={4} mt={2} mb={4}>
                Need help with budgeting?
              </Button>
              <Button colorScheme="red" mt={2} mb={4} onClick={() => handleDeleteItinerary(itinerary.id)}>
                Delete
              </Button>
            </Flex>
            
          </VStack>
        </Box>
      ))}
    </Box>
  );
};

export default Itinerary;
