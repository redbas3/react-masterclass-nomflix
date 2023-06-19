import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  getNowMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api";
import styled from "styled-components";
import { makeImagePath, makeOverlayId } from "../utilities";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
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

function Home() {
  const history = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data: nowData, isLoading: isNowLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getNowMovies
  );

  const { data: popularData, isLoading: isPopularLoading } =
    useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], getTopRatedMovies);
  const { data: upcomingData, isLoading: isUpcomingLoading } =
    useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies);

  const [currentMode, setCurrentMode] = useState("nowPlaying");

  const isLoading =
    isNowLoading || isPopularLoading || isTopRatedLoading || isUpcomingLoading;

  const [indexNow, setIndexNow] = useState(0);
  const [indexPopular, setIndexPopular] = useState(0);
  const [indexTopRated, setIndexTopRated] = useState(0);
  const [indexUpcoming, setIndexUpcoming] = useState(0);

  const incraseIndexNow = () => {
    if (nowData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = nowData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexNow((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseIndexPopular = () => {
    if (popularData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = popularData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexPopular((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseIndexTopRated = () => {
    if (topRatedData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = topRatedData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexTopRated((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseIndexUpcoming = () => {
    if (upcomingData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = upcomingData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexUpcoming((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (mode: string, movieId: number) => {
    setCurrentMode(mode);
    history(`/movies/${movieId}`);
  };

  const onOverlayClick = () => {
    history(-1);
  };

  let clickedMovie = null;
  if (currentMode === "now") {
    clickedMovie =
      bigMovieMatch?.params.movieId &&
      nowData?.results.find(
        (movie) => movie.id.toString() === bigMovieMatch.params.movieId
      );
  } else if (currentMode === "popular") {
    clickedMovie =
      bigMovieMatch?.params.movieId &&
      popularData?.results.find(
        (movie) => movie.id.toString() === bigMovieMatch.params.movieId
      );
  } else if (currentMode === "topRated") {
    clickedMovie =
      bigMovieMatch?.params.movieId &&
      topRatedData?.results.find(
        (movie) => movie.id.toString() === bigMovieMatch.params.movieId
      );
  } else if (currentMode === "upcoming") {
    clickedMovie =
      bigMovieMatch?.params.movieId &&
      upcomingData?.results.find(
        (movie) => movie.id.toString() === bigMovieMatch.params.movieId
      );
  }
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <Title>{nowData?.results[0].title}</Title>
            <Overview>{nowData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderHeader>
              <SliderTitle>Now Playing</SliderTitle>
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
                key={"now" + indexNow}
              >
                {nowData?.results
                  .slice(1)
                  .slice(offset * indexNow, offset * indexNow + offset)
                  .map((movie) => (
                    <Box
                      layoutId={"now|" + movie.id}
                      key={"now" + movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked("now", movie.id)}
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
              <SliderTitle>Popular</SliderTitle>
              <SliderArrow>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  onClick={incraseIndexPopular}
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
                key={"popular" + indexPopular}
              >
                {popularData?.results
                  .slice(offset * indexPopular, offset * indexPopular + offset)
                  .map((movie) => (
                    <Box
                      layoutId={"popular|" + movie.id}
                      key={"popular" + movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked("popular", movie.id)}
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
              <SliderTitle>Top Rated</SliderTitle>
              <SliderArrow>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  onClick={incraseIndexTopRated}
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
                key={"topRated" + indexTopRated}
              >
                {topRatedData?.results
                  .slice(
                    offset * indexTopRated,
                    offset * indexTopRated + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={"topRated|" + movie.id}
                      key={"topRated" + movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked("topRated", movie.id)}
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
              <SliderTitle>Upcoming</SliderTitle>
              <SliderArrow>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  onClick={incraseIndexUpcoming}
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
                key={"upcoming" + indexUpcoming}
              >
                {upcomingData?.results
                  .slice(
                    offset * indexUpcoming,
                    offset * indexUpcoming + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={"upcoming|" + movie.id}
                      key={"upcoming" + movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked("upcoming", movie.id)}
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
                    bigMovieMatch.params.movieId + ""
                  )}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      ></BigCover>
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
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

export default Home;
