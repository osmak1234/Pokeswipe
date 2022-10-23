import { Text, Box, Button } from "@chakra-ui/react";
import { prisma } from "../../server/db/client";
const Table = () => {
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

      console.log(
        "This is " +
          data.name +
          " his height is " +
          data.height +
          " his weight is " +
          data.weight +
          " and his id is " +
          id
      );

      const pokemon = await prisma.pokemon.create({
        data: {
          name: data.name,
          height: data.height,
          weight: data.weight,
          pokedexId: id, //id is a string
          votes: 0,
        },
      });
    }
  }
  return (
    <Box maxW='610px' m='auto' pt='10px'>
      <Text fontSize='2xl' fontWeight='bold' textAlign='center' pb='10px'>
        These are the user results
      </Text>

      <Button onClick={() => postToDB()}>post to the database</Button>
    </Box>
  );
};

export default Table;
