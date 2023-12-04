import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Links = [ 'Home','Itinerary', 'Loan'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const LoanForm = () => {
    const username = sessionStorage.getItem('username');
    const storedToken2 = sessionStorage.getItem('token2');
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [formData, setFormData] = useState({
        Customer_ID: '',
        Gender: '',
        Married: '',
        Dependents: 0,
        Education: '',
        ApplicantIncome: 0,
        Property_Area: '',
        Username: username
      });

    const generateRandomId = () => {
        const length = 6; // Panjang string acak yang diinginkan
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomId += characters.charAt(randomIndex);
        }
    
        return randomId;
    };
    
      const getAvailableId = async () => {
        const randomId = generateRandomId();
    
        handleInputChange("Customer_ID", randomId)
      };


      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await getAvailableId();

        try {
          const response = await axios.post(
            'https://loanrecommendationapi.azurewebsites.net/customers',
            {
                Customer_ID: formData.Customer_ID,
                Gender: formData.Gender,
                Married: formData.Married,
                Dependents: formData.Dependents,
                Education: formData.Education,
                ApplicantIncome: formData.ApplicantIncome,
                Property_Area: formData.Property_Area,
                Username: username
            },
            {
              headers: {
                Authorization: `Bearer ${storedToken2}`,
                'Content-Type': 'application/json', // Set Content-Type header to application/json
              },
            }
          );
          // Handle redirect or other actions after successful submission
        } catch (error) {
          console.error('Error submitting customer:', error);
        }
        window.location.href = '/loan';
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
      <Heading mb={4} mt={4}>Form Customer</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <Select
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            placeholder="Pilih Gender"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Married</FormLabel>
          <Select
            name="Married"
            value={formData.Married}
            onChange={handleChange}
            placeholder="Pilih Status Pernikahan"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Dependents</FormLabel>
          <NumberInput
            name="Dependents"
            value={formData.Dependents}
            min={0}
            max={5}
            onChange={(valueString) =>
              handleInputChange("Dependents", parseInt(valueString, 10))
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Education</FormLabel>
          <Select
            name="Education"
            value={formData.Education}
            onChange={handleChange}
            placeholder="Pilih Edukasi"
          >
            <option value="Graduate">Graduate</option>
            <option value="Not Graduate">Not Graduate</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Applicant Income</FormLabel>
          <NumberInput
            name="ApplicantIncome"
            value={formData.ApplicantIncome}
            min={1000}
            onChange={(valueString) =>
              handleInputChange(
                "ApplicantIncome",
                parseInt(valueString, 10)
              )
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Property Area</FormLabel>
          <Select
            name="Property_Area"
            value={formData.Property_Area}
            onChange={handleChange}
            placeholder="Pilih Property Area"
          >
            <option value="Urban">Urban</option>
            <option value="Semiurban">Semiurban</option>
            <option value="Rural">Rural</option>
          </Select>
        </FormControl>

        <Button type="submit" bg="teal.200" mt={4} mx="auto">
            Daftar
        </Button>
      </form>
    </Box>
  );
};

export default LoanForm;
