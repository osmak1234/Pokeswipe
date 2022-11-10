import { Text, Box, Grid, Button, useMediaQuery } from "@chakra-ui/react";
import { prisma } from "../../server/db/client";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

export async function getServerSideProps() {
  const pokemons = await prisma.pokemon.findMany({
    orderBy: {
      votes: "desc",
    },
  });
  return {
    props: {
      pokemonData: pokemons,
    },
  };
}
const Table = (pokemonData: any) => {
  const [isSmallerThan1000] = useMediaQuery("(max-width: 1000px)");

  return (
    <Box h='full' m='auto' pt='10px'>
      <Text fontSize='2xl' fontWeight='bold' textAlign='center' pb='10px'>
        These are the user results
      </Text>

      <Grid
        templateColumns={
          isSmallerThan1000 ? "repeat(1, 1fr)" : "repeat(3, 3fr)"
        }
        gap={6}
      >
        {pokemonData.pokemonData.map((pokemon: any) => (
          <Box
            maxW='300px'
            w='100%'
            maxWidth={500}
            key={pokemon.id}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            border='1px solid black'
            borderRadius='5px'
            borderColor='whiteAlpha.700'
            p='10px'
            m='auto'
            mb='10px'
          >
            <Box w='full' h='full'>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <Image
                  placeholder='blur'
                  blurDataURL='pokemon'
                  width={200}
                  height={200}
                  alt={pokemon.name}
                  src={`/${pokemon.pokedexId}.avif`}
                />
              </motion.div>
            </Box>
            <Box p='10px' w='full' m='auto' textAlign='center'>
              <Grid templateColumns='repeat(2, 1fr)' gap={1}>
                <Text fontSize='xl'>Name: </Text>
                <Text fontSize='xl'>{pokemon.name}</Text>

                <Text fontSize='xl'>Weight: </Text>
                <Text fontSize='xl'>{pokemon.weight / 10 + " kg"}</Text>

                <Text fontSize='xl'>Height: </Text>
                <Text fontSize='xl'>
                  {Math.round(pokemon.height * 8.6) + " cm"}
                </Text>

                <Text fontSize='xl'>Votes: </Text>
                <Text fontSize='xl' color='white'>
                  {pokemon.votes}
                </Text>
              </Grid>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Table;

/*
//This code is for filling the database with data of all first generation pokemons, uncommnet and call the function once to fill the database
  async function postToDB() {
    for (let i = 0; i < 151; i++) {
      const data = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${i + 1}`
      ).then((res) => res.json());
      //create id that has type string
      let id = "001";
      if (i < 9) {
        id = `00${i + 1}`.toString();
      } else if (i < 99 && i > 8) {
        id = `0${i + 1}`.toString();
      } else {
        id = `${i + 1}`.toString();
      }
      const dataToPost = {
        name: data.name,
        weight: data.weight,
        height: data.height,
        pokedexId: id,
        votes: 0,
      };

      const response = await fetch("../api/create", {
        method: "POST",
        body: JSON.stringify(dataToPost),
      });
      console.log(dataToPost);
    }
  }*/
