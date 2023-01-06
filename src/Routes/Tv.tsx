import { useQuery, useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState, useEffect } from "react";
import { useNavigate, useMatch, useParams, Outlet } from "react-router-dom";
import TvSlider from "../Components/TvSlider";

const Wrapper = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  overflow-x: hidden;
`;
const LatestShow = styled.div`
  height: 80vh;
  border: 3px solid red;
`;
interface IGenres {
  id: number;
  name: string;
}
interface ILatest {
  backdrop_path: string;
  id: number;
  genres: IGenres[];
  type: string;
}

function Tv() {
  const { data: latestShow } = useQuery(["latestShow"], () =>
    fetch(
      "https://api.themoviedb.org/3/tv/latest?api_key=10923b261ba94d897ac6b81148314a3f"
    ).then((res) => res.json())
  );

  return (
    <Wrapper>
      <TvSlider tvSort={"on_the_air"} slideTitle={"Latest shows!"} page={1} />
      <TvSlider tvSort={"airing_today"} slideTitle={"Airing Today"} page={2} />
      <TvSlider tvSort={"popular"} slideTitle={"Popular"} page={3} />
      <TvSlider tvSort={"top_rated"} slideTitle={"Top Rated"} page={1} />
    </Wrapper>
  );
}
export default Tv;
