import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Text,
  MenuDivider,
  useDisclosure,
  Stack,
  Select
} from '@chakra-ui/react';
import { Search2Icon, AddIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Links = [ 'Home', 'Itinerary', 'Loan'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const Home = () => {
  const [token1, setToken1] = useState('');
  const [username, setUsername] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure()


  useEffect(() => {
    // Ambil token dari sessionStorage atau localStorage saat komponen dipasang
    const storedToken1 = sessionStorage.getItem('token1');
    setToken1(storedToken1 || ''); // Jika tidak ada token, gunakan string kosong

    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername || ''); // Jika tidak ada token, gunakan string kosong

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

  // New state variables for category and location
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Mendapatkan semua variasi category
  const allCategories = [...new Set(destinations.map(destination => destination.category))];

  // Mendapatkan semua variasi location
  const allLocations = [...new Set(destinations.map(destination => destination.location))];

  // Fungsi untuk mengambil 2 kategori secara acak
  const getRandomCategories = () => {
    const shuffledCategories = shuffleArray(allCategories);
    return shuffledCategories.slice(0, 2);
  };

  // Fungsi untuk mengambil 2 lokasi secara acak
  const getRandomLocations = () => {
    const shuffledLocations = shuffleArray(allLocations);
    return shuffledLocations.slice(0, 2);
  };

  // Function to handle category filter change
  const handleCategoryFilterChange = (category) => {
    setCategoryFilter(category);
    setLocationFilter(''); // Clear location filter when category filter changes
    fetchData('category', category);
  };

  // Function to handle location filter change
  const handleLocationFilterChange = (location) => {
    setLocationFilter(location);
    setCategoryFilter(''); // Clear category filter when location filter changes
    fetchData('location', location);
  };

  // Fungsi untuk menangani perubahan dropdown
  const handleDropdownChange = (value) => {
    if (value === 'reset'){
      resetData();
    }
    else if (value) {
      // Jika nilai dropdown dipilih, tentukan jenis filter berdasarkan tipe
      const type = allCategories.includes(value) ? 'category' : 'location';
      fetchData(type, value);
    } else {
      // Jika tidak ada nilai dipilih, ambil semua destinasi
      fetchData();
    }
  };

  // Function to fetch data based on category or location
  const fetchData = (type, value) => {
    axios.get(`https://ayokebalitst.azurewebsites.net/destination/${type}/${value}`, {
      headers: {
        Authorization: `Bearer ${token1}`
      }
    })
      .then(response => {
        const shuffledDestinations = shuffleArray(response.data);
        setDestinations(shuffledDestinations);
      })
      .catch(error => {
        console.error(`Error fetching destinations by ${type}:`, error);
      });
  };

  const resetData = () => {
    axios.get(`https://ayokebalitst.azurewebsites.net/destination`, {
      headers: {
        Authorization: `Bearer ${token1}`
      }
    })
      .then(response => {
        const shuffledDestinations = shuffleArray(response.data);
        setDestinations(shuffledDestinations);
      })
      .catch(error => {
        console.error(`Error fetching destinations by ${type}:`, error);
      });
  };

  const SignOut = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  return (
    <Box>
      {token1 ? (
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
      ) : null}

      <Flex
        align={'center'}
        justify={'center'}
        textAlign="center"
        mt={token1 ? 0 : 10}
        mx={10}
      >
        {/* Konten utama */}
        {token1 ? (
          <Box margin="auto">
            <Heading fontSize={'4xl'} mb={4} mt={4}>
              Rekomendasi Destinasi
            </Heading>
            <HStack mt={4} spacing={4} align={'center'} justify={'center'}>
              {getRandomCategories().map((category) => (
                <Button bg={'teal.200'} key={category} onClick={() => handleCategoryFilterChange(category)}>
                  {category}
                </Button>
              ))}
              {getRandomLocations().map((category) => (
                <Button bg={'teal.200'} key={category} onClick={() => handleLocationFilterChange(category)}>
                  {category}
                </Button>
              ))}
              <Button bg={'teal.200'} onClick={() => resetData()}>Reset</Button>
            </HStack>

            <Select mt={4} mb={4} onChange={(e) => handleDropdownChange(e.target.value)}>
              <option value="reset">Semua Kategori & Lokasi</option>
              {allCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {allLocations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {/* Tambahkan lokasi lainnya jika diperlukan */}
            </Select>

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

            {/* Konten destinasi */}
            {destinations ? (
              <SimpleGrid spacing={4} mt={5} columns={[1, null, 3]}>
                {destinations.filter(filterDestinations).map((destination) => (
                  <Card key={destination.destination_id}>
                    <CardHeader>
                      <Link to={`/destination/${destination.destination_id}`}>
                        <strong>{destination.name}</strong>
                      </Link>
                    </CardHeader>
                    <CardBody>{destination.location}</CardBody>
                    <CardFooter align={'center'} justify={'center'}>
                      <Button bg={'teal.200'} as={Link} to={`/destination/${destination.destination_id}`}>
                        View Details
                      </Button>
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
    </Box>
  );

};

export default Home;
