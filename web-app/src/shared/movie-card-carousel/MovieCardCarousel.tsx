import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { sliderPropertiesSelector } from '../../services/slices-selectors/slider-properties';
import { IMovie } from '../interfaces/movie-types';
import CardOverlayPortal from './card-overlay/card-overlay-portal/CardOverlayPortal';
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
	const [idx, setIdx] = useState(0);
  const [touched, setTouched] = useState(false);
  const listReference = listRef.current;
  const [listAdjusted, setListAdjusted] = useState(true);
  const [transitionStarted, setTransitionStarted] = useState(false);
  const [activeCard, setActiveCard] = useState<HTMLDivElement | undefined | null>();
  const [activeMovie, setActiveMovie] = useState<any>();
  const sliderProperties = useSelector(sliderPropertiesSelector);

	const handleFowardMovement = () => {
    if (!transitionStarted) {
      setTransitionStarted(true);
      if (!touched) {
        setTouched(true);
      }
      setIdx(state => state + sliderProperties.numberCards - movieList.length*(Math.trunc((state + sliderProperties.numberCards) / movieList.length)));
  
      setSlider(state => ({
        ...state, 
        posX: state.posX - 100,
        transitionTime: 800,
        controlCounter: state.controlCounter + sliderProperties.numberCards
      }));
    } 
	};

	const handleBackwardMovement = () => {
    if (!transitionStarted) {
      setTransitionStarted(true);
      setIdx(state => state - sliderProperties.numberCards + movieList.length*(state - sliderProperties.numberCards >= 0 ? 0 : 1));
    
      setSlider(state => ({
        ...state, 
        posX: state.posX + 100, 
        transitionTime: 800,
        controlCounter: state.controlCounter - sliderProperties.numberCards
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
    if (!touched && sliderProperties.numberCards) {

      let slice: typeof movieList = [];

      if (sliderProperties.numberCards >= movieList.length) {
        slice = [
          ...getSlice(idx, sliderProperties.numberCards, movieList)
        ];
      } else {
        slice = [
          ...getSlice(idx, sliderProperties.numberCards, movieList),
        ];
      }

      setSlider(state => (
        {
          ...state,
          list: slice.map((item, index) => ({...item, key: state.controlCounter + index}))        
        }
      ));
    }
	}, [idx, touched, movieList, sliderProperties]);

  useEffect(() => {
    const handleTranslationFinished = () => {
      if (touched && !sliderProperties.isMobile) {
        const start =
          idx - sliderProperties.numberCards - 1 + movieList.length*(idx - sliderProperties.numberCards - 1 >= 0 ? 0 : 1);

        let slice: typeof movieList = [];

        if (sliderProperties.numberCards >= movieList.length) {
          slice = [
            ...getSlice(0, sliderProperties.numberCards, movieList)
          ];
        } else {
          slice = [
            ...getSlice(start, sliderProperties.numberCards, movieList),
          ];
        }

        setSlider(state => ({
          ...state,
          list: slice.map((value, index) => ({...value, key: state.controlCounter + index - sliderProperties.numberCards})),
          posX: movieList.length > sliderProperties.numberCards ? -100 - (1/sliderProperties.numberCards)*100 : 0,
          transitionTime: 0
        }));

        setTransitionStarted(false);
      }
    };

    if (sliderProperties.isMobile) {
      setSlider(state => ({
        ...state,
        list: getSlice(0, movieList.length, movieList).map((value, index) => ({...value, key: index})),
        posX: 0,
        transitionTime: 0
      }));
    }

    if (!listAdjusted && !sliderProperties.isMobile) {
      handleTranslationFinished();
      setListAdjusted(true);
    }

    listReference?.addEventListener('transitionend', handleTranslationFinished);

    return () => {
      listReference?.removeEventListener('transitionend', handleTranslationFinished);
    };
  }, [idx, sliderProperties, touched, listReference, listAdjusted, movieList]);

	useEffect(() => {
		const handleResize = () => {
      // when resizing if cardOverlay is open
      // the next line will close it.
      clearCardOverlay();
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
      <CardOverlayPortal 
        activeCard={activeCard}
        activeMovie={activeMovie}
        clearCardOverlay={clearCardOverlay} 
      />
      <div className={style['container']}>
        <div className={style['header']}>
          <div className={style['title']}>{title ? title : ' '}</div>
        </div>
        <div className={style['list-container']}>
          {
            touched && !sliderProperties.isMobile && sliderProperties.numberCards < movieList.length ? (
              <div className={style['backward']} onClick={handleBackwardMovement}>
                <span></span>
                <span></span>
              </div>
            ) : null
          }
          <Slider 
            movieSlice={slider.list}
            sliderRef={listRef}
            posX={slider.posX}
            transitionTime={slider.transitionTime}
            handleOverlay={handleOverlay}
          />
          {
            !sliderProperties.isMobile && sliderProperties.numberCards < movieList.length ? (
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