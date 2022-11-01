import { Text, Box, Image, Grid } from "@chakra-ui/react";
import { useState } from "react";
import { prisma } from "../../server/db/client";

export async function getServerSideProps() {
  const pokemons = await prisma.pokemon.findMany();
  return {
    props: {
      pokemonData: pokemons,
    },
  };
}
const Table = (pokemonData: any) => {
  console.log(pokemonData);
  return (
    <Box maxW='610px' m='auto' pt='10px'>
      <Text fontSize='2xl' fontWeight='bold' textAlign='center' pb='10px'>
        These are the user results
      </Text>
      <Grid templateColumns='repeat(1, 1fr)' gap={6}>
        {pokemonData.pokemonData.map((pokemon: any) => (
          <Box
            key={pokemon.id}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            p='10px'
            border='1px solid black'
            borderRadius='5px'
            borderColor='whiteAlpha.700'
            mb='10px'
          >
            <Image
              alt={pokemon.name}
              src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokemon.pokedexId}.png`}
              w='20vw'
            />
            <Text fontSize='xl'>{pokemon.name}</Text>
            <Text fontSize='xl' color='white'>
              {pokemon.votes}
            </Text>
            <Text>{pokemon.weight}</Text>
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