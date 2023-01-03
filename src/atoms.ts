import { atom } from "recoil";
import { IMovie } from "./api";

export const moviesAtom = atom<IMovie[]>({
  key: "moviesAtom",
  default: [],
});
