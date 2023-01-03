import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getMovies, IGetMoviesResult, IMovie, MovieSort } from "../api";
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
  width: 100%;
  height: 300px;

  margin-top: 30px;
  position: relative;
  color: white;
  font-size: 100px;
`;

const Slide = styled.div`
  position: relative;
  top: 0;
`;
const SliderTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  margin: 10px 0;
`;
const LeftArrow = styled(BsFillArrowLeftCircleFill)`
  color: whitesmoke;
  font-size: 50px;
  cursor: pointer;
  position: relative;
  left: 1vw;
  bottom: -130px;
`;
const RightArrow = styled(BsFillArrowRightCircleFill)`
  color: whitesmoke;
  font-size: 50px;
  cursor: pointer;
  position: relative;
  right: -90vw;
  bottom: -130px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 99;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  z-index: 100;
  position: fixed;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  font-size: 20px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

// variants
const rowVariants = {
  hidden: (custom: number) => ({
    x: custom * (window.outerWidth + 5),
  }),
  visible: {
    x: 0,
  },
  exit: (custom: number) => ({
    x: custom * (-window.outerWidth - 5),
  }),
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
interface ISliderProps {
  movieSort: MovieSort;
  slideTitle: string;
}

const offset = 6;

const Slider = ({ movieSort, slideTitle }: ISliderProps) => {
  const ls = slideTitle.length;
  const [moviesData, setMoviesData] = useRecoilState(moviesAtom);
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const [openModal, setOpenModal] = useState(false);
  const [movieDetail, setMovieDetail] = useState<IMovie>();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", movieSort],
    () => getMovies(movieSort)
  );

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setDirection(1);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setDirection(-1);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const onBoxClicked = (movie: IMovie) => {
    navigate(`/movies/${movie.id}`);
    setOpenModal(true);
    setMovieDetail(movie);
  };

  return (
    <Wrapper>
      <SliderTitle>{slideTitle}</SliderTitle>
      <Slide>
        <AnimatePresence
          custom={direction}
          initial={false}
          onExitComplete={toggleLeaving}>
          <Row
            custom={direction}
            variants={rowVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            transition={{ type: "tween", duration: 1 }}
            key={`${index}-${slideTitle}`}>
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={`${String(movie.id)}${ls}`}
                  key={`${movie.id}${ls}`}
                  whileHover='hover'
                  initial='normal'
                  variants={boxVariants}
                  onClick={() => onBoxClicked(movie)}
                  transition={{ type: "tween" }}
                  bgphoto={makeImagePath(movie.backdrop_path, "w500")}>
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <LeftArrow onClick={decreaseIndex} />
        <RightArrow onClick={increaseIndex} />
      </Slide>
      <AnimatePresence>
        {openModal && (
          <>
            <Overlay
              onClick={() => {
                navigate("/");
                setOpenModal(false);
              }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie layoutId={`${Number(movieDetail?.id)}${ls}`}>
              {movieDetail && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        movieDetail.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />

                  <BigTitle>{movieDetail.title}</BigTitle>
                  <BigOverview>{movieDetail.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};
export default Slider;
