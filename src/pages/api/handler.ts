import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const wantedId = JSON.parse(req.body);
    const wantedPokemon = await prisma.pokemon.findUnique({
      where: {
        id: wantedId.id,
      },
    });
    res.json(wantedPokemon);
  }
}
