import { client } from "../../config/prismicConfig.js";

export async function fetchPrismic() {
  const preloader = (await client.getSingle("preloader")).data;
  const about = (await client.getSingle("about")).data;

  return {
    preloader,
    about,
  };
}
