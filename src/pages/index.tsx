import { Box, Text, Button, Stack, Image } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [pokemonData, setPokemonData] = useState([
    "bulbasaur",
    60,
    100,
    0,
    "001",
  ]);
  function randomId() {
    return Math.floor(Math.random() * 151) + 1;
  }
  function randomPokemon() {
    getData(randomId());
  }
  async function getData(id: number) {
    fetch("http://localhost:3000/api/create", {
      method: "GETONE",
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPokemonData([
          data.name,
          data.weight,
          data.height,
          data.votes,
          data.pokedexId,
        ]);
      });
  }

  return (
    <>
      <Box width='60vw' m='auto' p='auto'>
        <Text fontSize='5xl' align='center'>
          Pokeswipe
        </Text>
        <a href='http://localhost:3000/table'>
          <Button
            bg='blue.600'
            w='fit-content'
            m='auto'
            _hover={{ bg: "blue.900" }}
          >
            <Text fontSize='2xl'>Results</Text>
          </Button>
        </a>
        <Image
          alt={String(pokemonData[0])}
          src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokemonData[4]}.png`}
          w='20vw'
        />
        <Button fontSize='2xl' onClick={() => randomPokemon()}></Button>
      </Box>
    </>
  );
};
export default Home;
