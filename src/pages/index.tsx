import { Box, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation, useDragControls } from "framer-motion";
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
  const controls = useDragControls();
  function startDrag(event: any) {
    controls.start(event, { snapToCursor: true });
  }

  return (
    <>
      <Box p='20px'>
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
          <div onPointerDown={startDrag} />
          <motion.div
            drag={true}
            dragConstraints={{
              top: 4,
              left: -400,
              right: 400,
              bottom: 4,
            }}
            dragControls={controls}
            dragElastic={0.1}
            onDragEnd={async (event, info) => {
              if (info.point.x < 200) {
                animation.start({
                  rotate: 20,
                  scale: 0.3,
                  opacity: 0.1,
                  transition: {
                    duration: 0.5,
                  },
                });
                sendVote(false);
                getData();
                animation.start({
                  x: 0,
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.7,
                  },
                });
                console.log("left");
              } else if (info.point.x > -200) {
                animation.start({
                  rotate: -20,
                  scale: 0.3,
                  opacity: 0.1,
                  transition: {
                    duration: 0.5,
                  },
                });
                sendVote(true);
                getData();
                animation.start({
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  transition: {
                    duration: 0.7,
                  },
                });
                console.log("right");
              }
            }}
            animate={animation}
          >
            <Box
              maxH={600}
              maxW={600}
              pr='50px'
              pl='50px'
              bg='blue.400'
              borderRadius='40px'
            >
              <Image
                className='image'
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
