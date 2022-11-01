import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const pokemonData = JSON.parse(req.body);
    console.log(pokemonData);

    const savedPokemon = await prisma.pokemon.create({
      data: pokemonData,
    });
    res.json(savedPokemon);
  } else if (req.method == "GET") {
    const pokemons = await prisma.pokemon.findMany();
    res.json(pokemons);
  }
}
