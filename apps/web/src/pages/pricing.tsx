import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const PricingCard = ({ title, price, features, buttonText, isPopular = false }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gradientFrom = isPopular ? 'cyan.400' : 'transparent';
  const gradientTo = isPopular ? 'pink.400' : 'transparent';

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bgGradient: `linear(to-r, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <Box p={6}>
        <Stack spacing={4} align="center">
          <Heading size="md">{title}</Heading>
          <Stack spacing={1} align="center">
            <Text fontSize="4xl" fontWeight="bold">
              ${price}
            </Text>
            <Text color="gray.500">/month</Text>
          </Stack>
          <List spacing={3}>
            {features.map((feature, index) => (
              <ListItem key={index} textAlign="center">
                {feature}
              </ListItem>
            ))}
          </List>
          <Button
            w="full"
            bgGradient="linear(to-r, cyan.400, pink.400)"
            color="white"
            _hover={{
              bgGradient: 'linear(to-r, cyan.500, pink.500)',
            }}
          >
            {buttonText}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

const Pricing = () => {
  const plans = [
    {
      title: 'Starter',
      price: 99,
      features: [
        'Up to 5 job postings',
        'Basic candidate matching',
        'Email support',
        '30-day job listings',
      ],
      buttonText: 'Start Free Trial',
    },
    {
      title: 'Professional',
      price: 199,
      features: [
        'Up to 15 job postings',
        'Advanced candidate matching',
        'Priority support',
        '60-day job listings',
        'Featured listings',
      ],
      buttonText: 'Subscribe Now',
      isPopular: true,
    },
    {
      title: 'Enterprise',
      price: 399,
      features: [
        'Unlimited job postings',
        'AI-powered matching',
        '24/7 dedicated support',
        '90-day job listings',
        'Custom branding',
        'API access',
      ],
      buttonText: 'Contact Sales',
    },
  ];

  return (
    <Container maxW="6xl" py={16}>
      <Stack spacing={8} align="center">
        <Stack spacing={2} textAlign="center">
          <Heading
            bgGradient="linear(to-r, cyan.400, pink.400)"
            bgClip="text"
            fontSize={{ base: '3xl', md: '4xl' }}
          >
            Simple, Transparent Pricing
          </Heading>
          <Text color="gray.500">
            Choose the plan that best fits your recruitment needs
          </Text>
        </Stack>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={8}
          align="center"
          justify="center"
        >
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </Flex>
      </Stack>
    </Container>
  );
};

export default Pricing;
