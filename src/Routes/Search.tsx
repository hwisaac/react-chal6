import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getMovies,
  IGetMoviesResult,
  searchData,
  IGetSearchItems,
  ISearchedItem,
} from "../api";
import { makeImagePath } from "../utils";
import { useState, useEffect } from "react";
import {
  useNavigate,
  useMatch,
  useParams,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import MySlider from "../Components/MySlider";

const Wrapper = styled.div`
  padding-top: 70px;
  padding-bottom: 50px;
  height: 100vh;
  overflow-x: hidden;
  color: white;
  background-color: #2d2d2d;
`;
const Tab = styled.div``;
const SubNav = styled.ul`
  display: flex;
  width: 100%;
  height: 60px;
  background-color: orange;
  gap: 20px;
  justify-content: center;
`;
const SubNavItem = styled.li<{ clicked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  border: ${(props) => {
    return props.clicked ? "3px solid white" : "3px solid orange";
  }};
`;

function Search() {
  let [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [tabToggle, setTabToggle] = useState(true);
  const [movies, setMovies] = useState<any>();
  const [tvs, setTvs] = useState<any>();
  // console.log(searchParams.getAll());
  // console.log(searchParams.toString());
  // console.log(searchParams.values());
  const { data, isLoading, refetch } = useQuery<any>(
    ["search"],
    () => searchData("avengers"),
    {
      enabled: false,
      onSuccess: () => {
        console.log("data.movieJson.results: ", data?.movieJson.results);
        // console.log(movieJson.results);
        if (data) setMovies(data.movieJson.results);
        if (data) setTvs(data.tvJson.results);
      },
    }
  );

  useEffect(() => {
    // keyword = searchParams.get("keyword");
    refetch().then((res) => console.log("refetched"));
  }, []);

  return (
    <Wrapper>
      <SubNav>
        <SubNavItem onClick={() => setTabToggle(true)} clicked={tabToggle}>
          Movie
        </SubNavItem>
        <SubNavItem onClick={() => setTabToggle(false)} clicked={!tabToggle}>
          Tv Show
        </SubNavItem>
      </SubNav>
      {tabToggle ? (
        <Tab>
          무비 SEARCH: {keyword}
          {movies?.map((movie: any) => (
            <div>{movie.title}</div>
          ))}
        </Tab>
      ) : (
        <Tab>
          SEARCH: {keyword}
          {tvs?.map((tv: any) => (
            <div>{tv.name}</div>
          ))}
        </Tab>
      )}
    </Wrapper>
  );
}
export default Search;
