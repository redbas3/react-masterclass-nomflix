import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  IGetTvResult,
  getSearchMovies,
  getSEarchTv,
} from "../api";
import styled from "styled-components";
import { makeImagePath, makeOverlayId } from "../utilities";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

import { useSearchParams } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  position: relative;
  margin-top: 100px;
  margin-bottom: 250px;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 30px 12px 30px;
`;

const SliderTitle = styled.div`
  font-size: 36px;
  font-weight: 400;
`;

const SliderArrow = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 30px;
    height: 30px;
    margin: 8px;
    cursor: pointer;
    path {
      fill: white;
    }
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  height: 200px;
  font-size: 66px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  position: relative;
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
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 34px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -80px;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  console.log(keyword);

  const history = useNavigate();
  const bigMovieMatch = useMatch("/search/:id");
  const { scrollY } = useScroll();
  const { data: movieData, isLoading: isMovieLoading } =
    useQuery<IGetMoviesResult>(["movies", "searchMoive"], () =>
      getSearchMovies(keyword + "")
    );

  const { data: tvData, isLoading: isTvLoading } = useQuery<IGetTvResult>(
    ["tv", "searchTv"],
    () => getSEarchTv(keyword + "")
  );

  const [currentMode, setCurrentMode] = useState("movie");

  const isLoading = isMovieLoading || isTvLoading;

  const [indexMovie, setIndexMovie] = useState(0);
  const [indexTv, setIndexTv] = useState(0);

  const incraseIndexNow = () => {
    if (movieData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexMovie((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseIndexTv = () => {
    if (tvData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = tvData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexTv((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (mode: string, id: number) => {
    setCurrentMode(mode);
    history(`/search/${id}`);
  };

  const onOverlayClick = () => {
    history(-1);
  };

  let clickedData = null;
  if (currentMode === "movie") {
    clickedData =
      bigMovieMatch?.params.id &&
      movieData?.results.find(
        (movie) => movie.id.toString() === bigMovieMatch.params.id
      );
  } else if (currentMode === "tv") {
    clickedData =
      bigMovieMatch?.params.id &&
      tvData?.results.find(
        (tv) => tv.id.toString() === bigMovieMatch.params.id
      );
  }

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <SliderHeader>
              <SliderTitle>Movies</SliderTitle>
              <SliderArrow>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  onClick={incraseIndexNow}
                >
                  <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                </svg>
              </SliderArrow>
            </SliderHeader>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={"movie" + indexMovie}
              >
                {movieData?.results
                  .slice(1)
                  .slice(offset * indexMovie, offset * indexMovie + offset)
                  .map((movie) => (
                    <Box
                      layoutId={"movie|" + movie.id}
                      key={"movie" + movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked("movie", movie.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider>
            <SliderHeader>
              <SliderTitle>TV</SliderTitle>
              <SliderArrow>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  onClick={incraseIndexTv}
                >
                  <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                </svg>
              </SliderArrow>
            </SliderHeader>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={"tv" + indexTv}
              >
                {tvData?.results
                  .slice(offset * indexTv, offset * indexTv + offset)
                  .map((tv) => (
                    <Box
                      layoutId={"tv|" + tv.id}
                      key={"tv" + tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked("tv", tv.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={makeOverlayId(
                    currentMode,
                    bigMovieMatch.params.id + ""
                  )}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedData && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedData.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      ></BigCover>
                      <BigOverview>{clickedData.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
