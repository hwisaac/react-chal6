import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getMovies,
  getTv,
  IGetTvResult,
  ITv,
  IGetMoviesResult,
  IMovie,
  MovieSort,
  TvSort,
} from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useNavigate, useMatch, useParams, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import { moviesAtom } from "../atoms";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

const Wrapper = styled.div`
  width: 80%;
  height: auto;

  margin-top: 30px;
  position: relative;
  color: white;
  font-size: 100px;
  display: grid;
  padding: 40px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const Card = styled.div<{ bg: string }>`
  width: 200px;
  height: calc(200px * 3 / 2);
  border: 1px solid yellow;
  display: flex;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  position: relative;
`;

const CardDescription = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  padding: 10px 0;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 20px;
  font-weight: 700;
`;
const CardTitle = styled.h2`
  padding: 0 10px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const CardDescriptionSpan = styled.span`
  font-size: 14px;
  color: chartreuse;
`;

interface IItem {
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
  id: number;
  title: string;
  name: string;
  release_date: string;
  vote_average: number;
}

const SearchedResults = ({ results }: any) => {
  console.log(results);
  return (
    <Wrapper>
      {results &&
        results?.map((item: IItem) => (
          <Card
            key={item.title + String(item.id)}
            bg={
              item.poster_path
                ? makeImagePath(item.poster_path, "w500")
                : makeImagePath(item.backdrop_path, "w500")
            }>
            <CardDescription>
              <CardDescriptionSpan>{item.release_date}</CardDescriptionSpan>
              <CardTitle>{item.title ?? item.name}</CardTitle>
            </CardDescription>
          </Card>
        ))}
    </Wrapper>
  );
};
export default SearchedResults;
