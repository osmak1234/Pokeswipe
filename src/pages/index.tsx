import { Box, Text, Button, Image } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { prisma } from "../server/db/client";

export async function getServerSideProps() {
  const randomId = Math.floor(Math.random() * 151) + 5;

  const wantedPokemon = await prisma.pokemon.findUnique({
    where: {
      id: randomId,
    },
  });
  return {
    props: {
      initialPokemon: wantedPokemon,
    },
  };
}

const Home = (props: {
  initialPokemon: {
    id: number;
    name: string;
    pokedexId: string;
    weight: number;
    height: number;
    votes: number;
  };
}) => {
  useEffect(() => {
    setPokemonData(props.initialPokemon);
    setImage(pokemonData.pokedexId);
  });
  const [image, setImage] = useState("001")

  const [pokemonData, setPokemonData] = useState({
    id: 5,
    name: "bulbasaur",
    pokedexId: "001",
    weight: 10,
    votes: 0,
    height: 5,
  });
  const [pokemonId, setPokemonId] = useState(1);

  async function sendVote(vote: boolean) {
    console.log(pokemonData);
    await fetch("/api/sendVote", {
      method: "POST",
      body: JSON.stringify({
        id: pokemonId + 5,
        vote: vote,
      }),
    });
  }
  async function getData() {
    const randomId = Math.floor(Math.random() * 151) + 5;
    interface PokemonId {
      id: number;
    }
    const json: PokemonId = {
      id: randomId,
    };
    console.log(json);
    fetch("/api/handler", {
      method: "POST",
      body: JSON.stringify(json),
    })
      .then((res) => res.json())
      .then((data) => {
        setPokemonData({
          id: data.id,
          name: data.name,
          height: data.height,
          weight: data.weight,
          votes: data.votes,
          pokedexId: data.pokedexId,
        });
        setPokemonId(data.id);
        setImage(data.pokedexId);
        console.log(pokemonData);
      });
  }

  return (
    <>
      <Box>
        <Box
          w='full'
          h='5vh'
          bg='red.800'
          display='flex'
          justifyContent='space-evenly'
          alignItems='center'
          flexDir={"row"}
        >
          <Text fontSize='2xl' align='center'>
            Pokeswipe
          </Text>
          <Link href='/table'>
            <Text fontSize='2xl'>Results</Text>
          </Link>
        </Box>
        <Image
          alt={String(pokemonData.name)}
          src={`/${image}.avif`}
          placeholder='../../public/images.png'
        />
        <Button
          fontSize='2xl'
          rounded='full'
          onClick={async () => {
            sendVote(false);
            getData();
          }}
        >
          ✖️
        </Button>
        <Button
          fontSize='2xl'
          rounded='full'
          onClick={async () => {
            sendVote(true);
            getData();
          }}
        >
          💓
        </Button>
      </Box>
    </>
  );
};
export default Home;
