import { useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { searchData } from "../api";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchedResults from "../Components/SearchedResults";

const Wrapper = styled.div`
  padding-top: 70px;
  padding-bottom: 50px;
  height: 100vh;
  overflow-x: hidden;
  color: white;
  background-color: #2d2d2d;
`;
const Tab = styled.div``;
const TabTitle = styled.h1`
  /* justify-content: center; */
  text-align: center;
  margin: 20px;
`;
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
const MoreButton = styled.div<{ disable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disable ? null : "pointer")};
  font-weight: 700;
  margin: 0 auto;
  color: white;
  background-color: ${(props) => (props.disable ? "gray" : "orange")};
  border-radius: 15px;
  width: auto;
  height: 50px;
  padding: 10px;
`;

function Search() {
  let [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") as any;
  const [tabToggle, setTabToggle] = useState(true);
  const [movies, setMovies] = useState<any>();
  const [tvs, setTvs] = useState<any>();

  const {
    data: movieInfiniteData,
    fetchNextPage: movieFetchNextPage,
    hasNextPage: movieHasNextPage,
    isFetchingNextPage: movieIsFetchingNextPage,
  } = useInfiniteQuery(
    ["searchMovie", keyword],
    ({ pageParam = 1 }) => searchData("movie", keyword, pageParam),
    {
      getNextPageParam: (lastPage, pages) => {
        const { page, total_pages } = lastPage;
        return page < total_pages ? page + 1 : undefined;
      },

      onSuccess: (movieInfiniteData) => {
        let temp: any = [];
        for (let x of movieInfiniteData.pages) {
          temp = [...temp, ...x.results];
        }
        setMovies(temp);
      },
    }
  );
  const {
    data: tvInfiniteData,
    fetchNextPage: tvFetchNextPage,
    hasNextPage: tvHasNextPage,
    isFetchingNextPage: tvIsFetchingNextPage,
  } = useInfiniteQuery(
    ["searchTv", keyword],
    ({ pageParam = 1 }) => searchData("tv", keyword, pageParam),
    {
      getNextPageParam: (lastPage, pages) => {
        const { page, total_pages } = lastPage;
        return page < total_pages ? page + 1 : undefined;
      },
      onSuccess: (tvInfiniteData) => {
        let temp: any = [];
        for (let x of tvInfiniteData.pages) {
          temp = [...temp, ...x.results];
        }
        setTvs(temp);
      },
    }
  );
  console.log(movieInfiniteData?.pages);
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
          <TabTitle>Movie SEARCH: {keyword}</TabTitle>

          {movies && <SearchedResults results={movies} />}
          <MoreButton
            onClick={() => movieFetchNextPage()}
            disable={!movieHasNextPage || movieIsFetchingNextPage}>
            {movieIsFetchingNextPage
              ? "Loading more..."
              : movieHasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </MoreButton>
        </Tab>
      ) : (
        <Tab>
          <TabTitle>TV SEARCH: {keyword}</TabTitle>
          {tvs && <SearchedResults results={tvs} />}
          <MoreButton
            onClick={() => tvFetchNextPage()}
            disable={!tvHasNextPage || tvIsFetchingNextPage}>
            {tvIsFetchingNextPage
              ? "Loading more..."
              : tvHasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </MoreButton>
        </Tab>
      )}
    </Wrapper>
  );
}
export default Search;
