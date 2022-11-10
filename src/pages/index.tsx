import { Box, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { prisma } from "../server/db/client";

export async function getServerSideProps() {
  const random = Math.floor(Math.random() * 809) + 1;
  function randomId() {
    const Id: any = Math.floor(Math.random() * 809) + 1;
    if (Id < 10) {
      return `00${Id}`;
    } else if (Id < 100) {
      return `0${Id}`;
    } else {
      return String(Id);
    }
  }

  const nextRandomId = [randomId(), randomId(), randomId()];

  const wantedPokemon = await prisma.pokemon.findUnique({
    where: {
      id: random,
    },
  });
  return {
    props: { wantedPokemon, nextRandomId },
  };
}

const Home = (props: {
  wantedPokemon: {
    id: number;
    name: string;
    pokedexId: string;
    weight: number;
    height: number;
    votes: number;
  };
  nextRandomId: number[];
}) => {
  useEffect(() => {
    setPokemonData(props.wantedPokemon);
    setImage(props.nextRandomId);
    setButtonEnabled(true);
  }, [props]);
  const [pokemonData, setPokemonData] = useState({
    id: 1,
    name: "Balbasaus",
    pokedexId: "001",
    weight: 0,
    height: 0,
    votes: 0,
  });
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [image, setImage] = useState([1, 2, 3]);

  async function sendVote(vote: boolean) {
    console.log(pokemonData);
    await fetch("/api/sendVote", {
      method: "POST",
      body: JSON.stringify({
        id: pokemonData.id,
        vote: vote,
      }),
    });
  }
  async function getData() {
    function randomId() {
      const Id: number = Math.floor(Math.random() * 809) + 1;
      if (Id < 10) {
        return `00${Id}`;
      } else if (Id < 100) {
        return `0${Id}`;
      } else {
        return String(Id);
      }
    }
    const nextRandomId: any = [image[1], image[2], randomId()];
    setImage(nextRandomId);
    // add a random number to the end of the array and remove the first one
    interface PokemonId {
      id: number;
    }
    const json: PokemonId = {
      id: parseInt(nextRandomId[0]),
    };
    fetch("/api/handler", {
      method: "POST",
      body: JSON.stringify(json),
    })
      .then((res) => res.json())
      .then((res) => {
        setPokemonData(res);
      });
    setButtonEnabled(true);
    console.log(image);
  }
  const animation = useAnimation();

  return (
    <>
      <Box>
        <Box
          w='full'
          h='5vh'
          display='flex'
          justifyContent='space-evenly'
          alignItems='center'
          flexDir={"row"}
        >
          <Text fontSize='2xl' align='center'>
            Pokeswipe
          </Text>
        </Box>
        <Box
          maxW={600}
          m='auto'
          display='flex'
          maxH='60vh'
          mt='20vh'
          justifyContent='space-evenly'
          flexDirection='column'
        >
          <motion.div animate={animation}>
            <Box maxW={600} p='50px' bg='blue.400' borderRadius='40px'>
              <Image
                alt={String(pokemonData.name)}
                src={`/${image[0]}.avif`}
                layout='responsive'
                width={200}
                height={200}
              />
              <Text fontSize='2xl' align='center'>
                {pokemonData.name}
              </Text>
              <Text fontSize='xl' align='center'>
                {Math.round(pokemonData.weight / 10)}kg
              </Text>
              <Text fontSize='xl' align='center'>
                {Math.round(pokemonData.height * 8.6)} cm
              </Text>
            </Box>
          </motion.div>
          <Box w='full' m='auto' display='flex' justifyContent='center'>
            <Button
              // dispable the button
              isDisabled={!buttonEnabled}
              bgGradient={"linear(to-l, blue.600, gray.600)"}
              fontSize='2xl'
              rounded='full'
              mr='30px'
              w='55px'
              h='55px'
              _hover={{
                bgGradient: "linear(to-r, blue.300, gray.300)",
                transform: "scale(1.1)",
              }}
              _active={{
                bgGradient: "linear(to-l, blue.800, gray.800)",
                transform: "scale(0.9)",
              }}
              onClick={async () => {
                setButtonEnabled(true);
                sendVote(true);
                animation
                  .start({
                    x: -100,
                    scale: 0.1,
                    rotate: -20,
                    transition: {
                      duration: 0.7,
                    },
                  })
                  .then(getData)
                  .then(() => {
                    animation.start({
                      x: 0,
                      scale: 1,
                      rotate: 0,
                      transition: {
                        duration: 0.7,
                      },
                    });
                  });
              }}
            >
              🥱
            </Button>
            <Button
              disabled={!buttonEnabled}
              bgGradient='linear(to-r, red.700, pink.500)'
              fontSize='2xl'
              rounded='full'
              ml='30px'
              _hover={{
                bgGradient: "linear(to-l, red.500, pink.300)",
                transform: "scale(1.1)",
              }}
              _active={{
                bgGradient: "linear(to-l, red.800, pink.800)",
                transform: "scale(0.9)",
              }}
              w='55px'
              h='55px'
              onClick={async () => {
                setButtonEnabled(true);
                sendVote(true);
                animation
                  .start({
                    x: 100,
                    scale: 0.1,
                    rotate: 20,
                    transition: {
                      duration: 0.7,
                    },
                  })
                  .then(getData)
                  .then(() => {
                    animation.start({
                      x: 0,
                      scale: 1,
                      rotate: 0,
                      transition: {
                        duration: 0.7,
                      },
                    });
                  });
              }}
            >
              😍
            </Button>
            <Image
              width={0}
              height={0}
              alt='pokemon'
              src={`/${image[0]}.avif`}
            />
            <Image
              width={0}
              height={0}
              alt='pokemon'
              src={`/${image[1]}.avif`}
            />
            <Image
              width={0}
              height={0}
              alt='pokemon'
              src={`/${image[2]}.avif`}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default Home;
