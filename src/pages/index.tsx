import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation, useDragControls } from "framer-motion";
import { useEffect, useState } from "react";
import { prisma } from "../server/db/client";
import { useWindowWidth } from "@react-hook/window-size";

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
  }, [props]);
  //save screen width into const
  const width = useWindowWidth();

  const [pokemonData, setPokemonData] = useState({
    id: 1,
    name: "Balbasaus",
    pokedexId: "001",
    weight: 0,
    height: 0,
    votes: 0,
  });
  const [image, setImage] = useState([1, 2, 3]);
  const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

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
    console.log(image);
    await sleep(700);
    setImage(nextRandomId);
    animation.start({
      x: 0,
      scale: 1,
      rotateZ: 0,
      transition: {
        duration: 0,
      },
    });
    animation.start({
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    });
  }
  const animation = useAnimation();
  const controls = useDragControls();
  function startDrag(event: any) {
    controls.start(event);
  }

  return (
    <>
      <Box p='20px' overflow='hidden'>
        <Box
          w='full'
          h='5vh'
          display='flex'
          justifyContent='space-evenly'
          alignItems='center'
          flexDir={"row"}
          position='absolute'
          top='0'
          left='0'
          zIndex='100'
        >
          <Text fontSize='2xl' align='center'>
            Pokeswipe
          </Text>
          <Text fontSize='2xl' align='center'>
            <Link href='/table'>Results</Link>
          </Text>
        </Box>
        <Box
          maxW={600}
          m='auto'
          display='flex'
          h='justify-content'
          mt='10vh'
          justifyContent='space-evenly'
          flexDirection='column'
        >
          <div onPointerDown={startDrag} />
          <motion.div
            drag={true}
            dragConstraints={{
              top: 1,
              left: -70,
              right: 70,
              bottom: 1,
            }}
            dragElastic={0.1}
            dragControls={controls}
            onDragEnd={(event, info) => {
              if (info.delta.x < -0.1) {
                animation.start({
                  x: -width,
                  rotateZ: 60,
                  opacity: 0,
                  transition: {
                    duration: 0.7,
                  },
                });
                sendVote(false);
                getData();
                console.log("left");
              } else if (info.delta.x > 0.1) {
                animation.start({
                  x: width,
                  rotateZ: -60,
                  opacity: 0,
                  transition: {
                    duration: 0.7,
                  },
                });
                sendVote(true);
                getData();
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
              bg={`blue.500`}
              borderRadius='40px'
            >
              <Image
                priority
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
