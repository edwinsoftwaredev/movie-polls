import React, { useEffect, useRef, useState } from 'react';
import style from './MovieCardCarousel.module.scss';
import Slider from './slider/Slider';

const movieList = [{
  id: '1',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '85%',
  genres: ['Adventure', 'Fantasy', 'Action'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/a7p3RuCocDAwurgu2bJbAEhJagf.jpg'
},{
  id: '2',
  title: 'Blade Runner 2049',
  popularity: '75%',
  genres: ['Science Fiction', 'Drama'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg'
},{
  id: '3',
  title: 'Wonder Woman 1984',
  popularity: '70%',
  genres: ['Fantasy', 'Action', 'Adventure'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/srYya1ZlI97Au4jUYAktDe3avyA.jpg'
},{
  id: '4',
  title: 'Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)',
  popularity: '71%',
  genres: ['Action', 'Crime'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/9xNOiv6DZZjH7ABoUUDP0ZynouU.jpg'
},{
  id: '5',
  title: 'Tenet',
  popularity: '73%',
  genres: ['Action', 'Thriller', 'Science Fiction'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/wzJRB4MKi3yK138bJyuL9nx47y6.jpg'
},{
  id: '6',
  title: 'Godzilla vs. Kong',
  popularity: '90%',
  genres: ['Action', 'Science Fiction'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/iopYFB1b6Bh7FWZh3onQhph1sih.jpg'
},{
  id: '7',
  title: 'The Croods: A New Age',
  popularity: '76%',
  genres: ['Family', 'Adventure', 'Fantasy', 'Animation'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/cjaOSjsjV6cl3uXdJqimktT880L.jpg'
},{
  id: '8',
  title: 'Jumanji: The Next Level',
  popularity: '70%',
  genres: ['Adventure', 'Comedy', 'Fantasy'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/lzGTOie3M3Adb4eIAXqolDuxm3S.jpg'
},{
  id: '9',
  title: 'Joker',
  popularity: '82%',
  genres: ['Crime', 'Thriller', 'Drama'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/2nbKZ5RWFSvjq5IGVRcz8kAolmw.jpg'
},{
  id: '10',
  title: 'Greenland',
  popularity: '72%',
  genres: ['Action', 'Thriller'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/nNinYyiKzsGin0Qt55elelP1wSi.jpg'
},{
  id: '11',
  title: 'Avengers: Endgame',
  popularity: '83%',
  genres: ['Adventure', 'Science Fiction', 'Action'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg'
},{
  id: '12',
  title: 'Star Wars: The Rise of Skywalker',
  popularity: '65%',
  genres: ['Action', 'Adventure', 'Science Fiction'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/jn52me8AagfNt7r84SgQbV0R9ZG.jpg'
},{
  id: '13',
  title: 'John Wick: Chapter 3 - Parabellum',
  popularity: '74%',
  genres: ['Action', 'Thriller', 'Crime'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg'
},{
  id: '14',
  title: 'The King',
  popularity: '72%',
  genres: ['Drama', 'History', 'War'],
  backdrop: 'https://www.themoviedb.org/t/p/w533_and_h300_bestv2/oMAhce30UvkgJwlzMwsuLaPJ5cG.jpg'
}]

const movieItems = movieList.map((item, index) => ({...item, key: index}))

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

  const getSlice = (start: number, end: number) => {
    const slice = [];
    let idx = start;
    
    while (idx !== end) {
      if (idx === movieList.length) {
        idx = 0;
        if (idx === end) break;
        slice.push(movieList[idx]);
        idx++;
      } else {
        slice.push(movieList[idx]);
        idx++;
      }
    }

    return slice;
  };

	useEffect(() => {
    if (!touched && cardAmount) {
      const slice =  [
        ...getSlice(idx, cardAmount + 1),
        ...getSlice(cardAmount + 1, (cardAmount + 1)*2)
      ];

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
      if (touched) {
        const start1 = idx - cardAmount - 1 + movieList.length*(idx - cardAmount - 1 >= 0 ? 0 : 1);
        const end1 = (
            start1 + cardAmount >= movieList.length ?
              (start1 + cardAmount - movieList.length) : start1 + cardAmount
          );
  
        const start2 = idx - 1 + movieList.length*(idx - 1 >= 0 ? 0 : 1);
        const end2 = start2 + cardAmount + 2 - movieList.length*(Math.trunc((start2 + cardAmount + 2) / movieList.length));

        const start3 = end2;
        const end3 = start3 + cardAmount - movieList.length*(Math.trunc((start3 + cardAmount) / movieList.length));

        const slice = [
          ...getSlice(start1, end1),
          ...getSlice(start2, end2),
          ...getSlice(start3, end3)
        ];

        setSlider(state => ({
          ...state,
          list: slice.map((value, index) => ({...value, key: state.controlCounter + index - cardAmount})),
          posX: -100 - (1/cardAmount)*100,
          transitionTime: 0
        }));

        setTransitionStarted(false);
      }
    };

    if (!listAdjusted) {
      handleTranslationFinished();
      setListAdjusted(true);
    }

    listReference?.addEventListener('transitionend', handleTranslationFinished);

    return () => {
      listReference?.removeEventListener('transitionend', handleTranslationFinished);
    };
  }, [idx, cardAmount, touched, listReference, listAdjusted]);

	useEffect(() => {
		const handleResize = () => {
			let numberCards = 6;
			const windowWidth = window.innerWidth;

			if (windowWidth >= 1440) {
				numberCards = 6;
			} else if (windowWidth >= 1360 && windowWidth < 1440) {
				numberCards = 5;
			} else if (windowWidth >= 769 && windowWidth < 1360) {
				numberCards = 4;
			} else {
				numberCards = 3;
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
		<div className={style['container']}>
			<div className={style['header']}>
				<div className={style['title']}>{title}</div>
			</div>
			<div className={style['list-container']}>
        {
          touched ? (
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
        />
				<div className={style['forward']} onClick={handleFowardMovement}>
          <span></span>
          <span></span>
        </div>
			</div>
		</div>
	)
};

export default MovieCarousel;