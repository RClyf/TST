import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  Stack,
  IconButton,
  useColorModeValue,
  useDisclosure,
  HStack,
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

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [token1, setToken1] = useState('');
  const [username, setUsername] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    // Ambil token dari sessionStorage atau localStorage saat komponen dipasang
    const storedToken1 = sessionStorage.getItem('token1');
    setToken1(storedToken1 || ''); // Jika tidak ada token, gunakan string kosong

    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername || ''); // Jika tidak ada token, gunakan string kosong
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
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          {destination ? (
          <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
            <Heading as="h2" mb={4}>
              {destination.name}
            </Heading>
          
            <Box textAlign={'left '}>
              <Text>Category: {destination.category}</Text>
              <Text>Lokasi: {destination.location}</Text>
              <Text>Latitude: {destination.latitude}</Text>
              <Text>Longitude: {destination.longitude}</Text>
              <Text>Estimasi Biaya: {destination.perkiraan_biaya}</Text>
            </Box>
            </Box>
      ) : (
        <Text>Loading...</Text>
      )}
    
      </Stack>
    </Flex>
    </Box>
  );
};

export default DestinationDetail;
