import { Box, Text, Button, Stack, Image } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [pokemon, setPokemon] = useState("Bulbasaur");
  const [pokemonImage, setPokemonImage] = useState(
    "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/151.png"
  );
  const nextPokemon = () => {
    const randomPokemon = Math.floor(Math.random() * 151) + 1;
    if (randomPokemon < 10) {
      setPokemonImage(
        `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/00${randomPokemon}.png`
      );
    } else if (randomPokemon < 100 && randomPokemon > 9) {
      setPokemonImage(
        `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/0${randomPokemon}.png`
      );
    } else {
      setPokemonImage(
        `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${randomPokemon}.png`
      );
    }
  };

  return (
    <>
      <Box width="60vw" m="auto" p="auto">
        <Text fontSize="5xl" align="center">
          Pokeswipe
        </Text>
        <a href="http://localhost:3000/table">
          <Button
            bg="blue.600"
            w="fit-content"
            m="auto"
            _hover={{ bg: "blue.900" }}
          >
            <Text fontSize="2xl">Results</Text>
          </Button>
        </a>
        <Image alt={pokemon} src={pokemonImage} w="20vw" />
        <Button fontSize="2xl" onClick={nextPokemon}></Button>
      </Box>
    </>
  );
};
export default Home;
