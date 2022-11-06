import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const wantedId = JSON.parse(req.body);
    if (wantedId.vote) {
      const wantedPokemon = await prisma.pokemon.update({
        where: {
          id: wantedId.id,
        },
        data: {
          votes: {
            increment: 1,
          },
        },
      });
      res.json(wantedPokemon);
    } else {
      const wantedPokemon = await prisma.pokemon.update({
        where: {
          id: wantedId.id,
        },
        data: {
          votes: {
            decrement: 1,
          },
        },
      });
      res.json(wantedPokemon);
    }
  }
}
