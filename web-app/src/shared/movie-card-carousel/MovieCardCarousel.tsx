import React, { Fragment, useEffect, useRef, useState } from 'react';
import { IMovie } from '../interfaces/movie-types';
import CardOverlay from './card-overlay/CardOverlay';
import style from './MovieCardCarousel.module.scss';
import Slider from './slider/Slider';

interface ISlider {
  list: IMovie[];
  posX: number;
  transitionTime: number,
  controlCounter: number
}

const initialSlider = {
  list: [],
  posX: 0,
  transitionTime: 0,
  controlCounter: 0
}

interface IMovieCarousel {
  title: string;
  movieList: IMovie[]
}

const MovieCarousel: React.FC<IMovieCarousel> = ({title, movieList}) => {
	const listRef = useRef<HTMLDivElement>(null);
  const [slider, setSlider] = useState<ISlider>(initialSlider);
	const [cardAmount, setCardAmount] = useState(0);
	const [idx, setIdx] = useState(0);
  const [touched, setTouched] = useState(false);
  const listReference = listRef.current;
  const [listAdjusted, setListAdjusted] = useState(true);
  const [transitionStarted, setTransitionStarted] = useState(false);
  const [activeCard, setActiveCard] = useState<HTMLDivElement | undefined | null>();
  const [activeMovie, setActiveMovie] = useState<any>();
  const [isMobile, setIsMobile] = useState(false);

	const handleFowardMovement = () => {
    if (!transitionStarted) {
      setTransitionStarted(true);
      if (!touched) {
        setTouched(true);
      }
      setIdx(state => state + cardAmount - movieList.length*(Math.trunc((state + cardAmount) / movieList.length)));
  
      setSlider(state => ({
        ...state, 
        posX: state.posX - 100,
        transitionTime: 800,
        controlCounter: state.controlCounter + cardAmount
      }));
    } 
	};

	const handleBackwardMovement = () => {
    if (!transitionStarted) {
      setTransitionStarted(true);
      setIdx(state => state - cardAmount + movieList.length*(state - cardAmount >= 0 ? 0 : 1));
    
      setSlider(state => ({
        ...state, 
        posX: state.posX + 100, 
        transitionTime: 800,
        controlCounter: state.controlCounter - cardAmount
      }));
    }
  };

  const handleOverlay = (card: HTMLDivElement | undefined | null, movie: any) => {
    setActiveCard(card);
    setActiveMovie(movieList.find(item => item.id === movie.id));
  };

  const clearCardOverlay = () => {
    setActiveCard(null);
    setActiveMovie(null);
  };

  const getSlice = (start: number, cardAmount: number, movieList: IMovie[]) => {
    const slice: IMovie[] = [];
    const sliceFinalSize =
      cardAmount < movieList.length ? cardAmount*3 + 2 : movieList.length;

    let idx = start;

    while (slice.length < sliceFinalSize) {
      if (idx === movieList.length) idx = 0;
      slice.push(movieList[idx]);
      idx++;
    }

    return slice;
  };

	useEffect(() => {
    if (!touched && cardAmount) {

      let slice: typeof movieList = [];

      if (cardAmount >= movieList.length) {
        slice = [
          ...getSlice(idx, cardAmount, movieList)
        ];
      } else {
        slice = [
          ...getSlice(idx, cardAmount, movieList),
        ];
      }

      setSlider(state => (
        {
          ...state,
          list: slice.map((item, index) => ({...item, key: state.controlCounter + index}))        
        }
      ));
    }
	}, [cardAmount, idx, touched, movieList]);

  useEffect(() => {
    const handleTranslationFinished = () => {
      if (touched && !isMobile) {
        const start =
          idx - cardAmount - 1 + movieList.length*(idx - cardAmount - 1 >= 0 ? 0 : 1);

        let slice: typeof movieList = [];

        if (cardAmount >= movieList.length) {
          slice = [
            ...getSlice(0, cardAmount, movieList)
          ];
        } else {
          slice = [
            ...getSlice(start, cardAmount, movieList),
          ];
        }

        setSlider(state => ({
          ...state,
          list: slice.map((value, index) => ({...value, key: state.controlCounter + index - cardAmount})),
          posX: movieList.length > cardAmount ? -100 - (1/cardAmount)*100 : 0,
          transitionTime: 0
        }));

        setTransitionStarted(false);
      }
    };

    if (isMobile) {
      setSlider(state => ({
        ...state,
        list: getSlice(0, movieList.length, movieList).map((value, index) => ({...value, key: index})),
        posX: 0,
        transitionTime: 0
      }));
    }

    if (!listAdjusted && !isMobile) {
      handleTranslationFinished();
      setListAdjusted(true);
    }

    listReference?.addEventListener('transitionend', handleTranslationFinished);

    return () => {
      listReference?.removeEventListener('transitionend', handleTranslationFinished);
    };
  }, [idx, cardAmount, touched, listReference, listAdjusted, isMobile, movieList]);

	useEffect(() => {
		const handleResize = () => {
			let numberCards = 6;
			const windowWidth = window.innerWidth;

			if (windowWidth >= 1440) {
				numberCards = 6;
        setIsMobile(false);
			} else if (windowWidth >= 1360 && windowWidth < 1440) {
				numberCards = 5;
        setIsMobile(false);
			} else if (windowWidth >= 769 && windowWidth < 1360) {
				numberCards = 4;
        setIsMobile(false);
			} else {
				numberCards = 0;
        setIsMobile(true);
			}

			setCardAmount(numberCards);
      setListAdjusted(false);
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, []);

	return (
    <Fragment>
      <CardOverlay 
        card={activeCard}
        clearCardOverlay={clearCardOverlay}
        movie={activeMovie}
        isMobile={isMobile}
      />
      <div className={style['container']}>
        <div className={style['header']}>
          <div className={style['title']}>{title}</div>
        </div>
        <div className={style['list-container']}>
          {
            touched && !isMobile && cardAmount < movieList.length ? (
              <div className={style['backward']} onClick={handleBackwardMovement}>
                <span></span>
                <span></span>
              </div>
            ) : null
          }
          <Slider 
            movieSlice={slider.list}
            cardAmount={cardAmount}
            sliderRef={listRef}
            posX={slider.posX}
            transitionTime={slider.transitionTime}
            handleOverlay={handleOverlay}
          />
          {
            !isMobile && cardAmount < movieList.length ? (
              <div className={style['forward']} onClick={handleFowardMovement}>
                <span></span>
                <span></span>
              </div>   
            ) : null
          }
        </div>
      </div>
    </Fragment>
	)
};

export default MovieCarousel;