import React, { Fragment, useEffect, useRef, useState } from 'react';
import CardOverlay from './card-overlay/CardOverlay';
import style from './MovieCardCarousel.module.scss';
import Slider from './slider/Slider';

const movieList = [{
  id: '1',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '85%',
  genres: ['Adventure', 'Fantasy', 'Action'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/a7p3RuCocDAwurgu2bJbAEhJagf.jpg'
},{
  id: '2',
  title: 'Blade Runner 2049',
  popularity: '75%',
  genres: ['Science Fiction', 'Drama'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/jsMVRjLwKWN3gaiGd9pJUrxezsp.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg'
},{
  id: '3',
  title: 'Wonder Woman 1984',
  popularity: '70%',
  genres: ['Fantasy', 'Action', 'Adventure'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/srYya1ZlI97Au4jUYAktDe3avyA.jpg'
},{
  id: '4',
  title: 'Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)',
  popularity: '71%',
  genres: ['Action', 'Crime'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/9xNOiv6DZZjH7ABoUUDP0ZynouU.jpg'
},{
  id: '5',
  title: 'Tenet',
  popularity: '73%',
  genres: ['Action', 'Thriller', 'Science Fiction'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/k68nPLbIST6NP96JmTxmZijEvCA.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/wzJRB4MKi3yK138bJyuL9nx47y6.jpg'
},{
  id: '6',
  title: 'Godzilla vs. Kong',
  popularity: '90%',
  genres: ['Action', 'Science Fiction'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/3Iso4hatk3N0RTkQFAk7YFO4GGy.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/iopYFB1b6Bh7FWZh3onQhph1sih.jpg'
},{
  id: '7',
  title: 'The Croods: A New Age',
  popularity: '76%',
  genres: ['Family', 'Adventure', 'Fantasy', 'Animation'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/tK1zy5BsCt1J4OzoDicXmr0UTFH.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/cjaOSjsjV6cl3uXdJqimktT880L.jpg'
},{
  id: '8',
  title: 'Jumanji: The Next Level',
  popularity: '70%',
  genres: ['Adventure', 'Comedy', 'Fantasy'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/bB42KDdfWkOvmzmYkmK58ZlCa9P.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/lzGTOie3M3Adb4eIAXqolDuxm3S.jpg'
},{
  id: '9',
  title: 'Joker',
  popularity: '82%',
  genres: ['Crime', 'Thriller', 'Drama'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/2nbKZ5RWFSvjq5IGVRcz8kAolmw.jpg'
},{
  id: '10',
  title: 'Greenland',
  popularity: '72%',
  genres: ['Action', 'Thriller'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/wVu2B58T61LAMiY68hxAA2NLcr9.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/nNinYyiKzsGin0Qt55elelP1wSi.jpg'
},{
  id: '11',
  title: 'Avengers: Endgame',
  popularity: '83%',
  genres: ['Adventure', 'Science Fiction', 'Action'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg'
},{
  id: '12',
  title: 'Star Wars: The Rise of Skywalker',
  popularity: '65%',
  genres: ['Action', 'Adventure', 'Science Fiction'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/db32LaOibwEliAmSL2jjDF6oDdj.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/jn52me8AagfNt7r84SgQbV0R9ZG.jpg'
},{
  id: '13',
  title: 'John Wick: Chapter 3 - Parabellum',
  popularity: '74%',
  genres: ['Action', 'Thriller', 'Crime'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg'
},{
  id: '14',
  title: 'The King',
  popularity: '72%',
  genres: ['Drama', 'History', 'War'],
  poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/8u0QBGUbZcBW59VEAdmeFl9g98N.jpg',
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/oMAhce30UvkgJwlzMwsuLaPJ5cG.jpg'
}];

const movieItems = movieList.map((item, index) => ({...item, key: index}));

interface ISlider {
  list: typeof movieItems;
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

const MovieCarousel: React.FC<any> = ({title}) => {
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
  };

  const getSlice = (start: number, cardAmount: number) => {
    const slice: typeof movieList = [];
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
          ...getSlice(idx, cardAmount)
        ];
      } else {
        slice = [
          ...getSlice(idx, cardAmount),
        ];
      }

      setSlider(state => (
        {
          ...state,
          list: slice.map((item, index) => ({...item, key: state.controlCounter + index}))        
        }
      ));
    }
	}, [cardAmount, idx, touched]);

  useEffect(() => {
    const handleTranslationFinished = () => {
      if (touched && !isMobile) {
        const start =
          idx - cardAmount - 1 + movieList.length*(idx - cardAmount - 1 >= 0 ? 0 : 1);

        let slice: typeof movieList = [];

        if (cardAmount >= movieList.length) {
          slice = [
            ...getSlice(0, cardAmount)
          ];
        } else {
          slice = [
            ...getSlice(start, cardAmount),
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
        list: getSlice(0, movieList.length).map((value, index) => ({...value, key: index})),
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
  }, [idx, cardAmount, touched, listReference, listAdjusted, isMobile]);

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