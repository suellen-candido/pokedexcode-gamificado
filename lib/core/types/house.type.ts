import { z } from "zod/v4";

export const HouseIdSchema = z.enum([
  'fogo',
  'agua',
  'planta',
]);

export type HouseStats = {
  houseId: string;
  members: number;
  totalXp: number;
  avgXp: number;
};

export type HouseId = z.infer<typeof HouseIdSchema>;
