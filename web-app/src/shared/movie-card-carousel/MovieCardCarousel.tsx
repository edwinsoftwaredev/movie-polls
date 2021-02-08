import React, { useEffect, useRef, useState } from 'react';
import style from './MovieCardCarousel.module.scss';
import Slider from './slider/Slider';

const movieList = [{
  id: '1',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '2',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '3',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '4',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '5',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '6',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '7',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '8',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '9',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '10',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '11',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '12',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '13',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
},{
  id: '14',
  title: 'The lord of the Ring: The Return of the King',
  popularity: '90%',
  genres: ['Adventure', 'Fantasy', 'Action']
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

	const handleFowardMovement = () => {
    if (!touched) {
      setTouched(true);
    }
    setIdx(state => state + cardAmount - movieList.length*(Math.trunc((state + cardAmount) / movieList.length)));

    const listWidth = listRef.current?.clientWidth ?? 0;
    setSlider(state => ({
      ...state, 
      posX: state.posX - listWidth,
      transitionTime: 650,
      controlCounter: state.controlCounter + cardAmount
    }));
	};

	const handleBackwardMovement = () => {
    setIdx(state => state - cardAmount + movieList.length*(state - cardAmount >= 0 ? 0 : 1));
    
    const listWidth = listRef.current?.clientWidth ?? 0;
    setSlider(state => ({
      ...state, 
      posX: state.posX + listWidth, 
      transitionTime: 650,
      controlCounter: state.controlCounter - cardAmount
    }));
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
        ...getSlice(cardAmount + 1, cardAmount*2 + 1)
      ];


      setSlider(state => (
        {
          ...state,
          list: slice.map((item, index) => ({...item, key: state.controlCounter + index}))        
        }
      ))
    }
	}, [cardAmount, idx, touched]);

  useEffect(() => {
    const listReference = listRef.current;

    const handleTranslationFinish = () => {
      if (touched) {
        const start1 = idx - cardAmount + movieList.length*(idx - cardAmount >= 0 ? 0 : 1);
        const end1 = (
            start1 + cardAmount >= movieList.length ?
              (start1 + cardAmount - movieList.length) : start1 + cardAmount
          );
  
        const start2 = idx;
        const end2 = start2 + cardAmount + 1 - movieList.length*(Math.trunc((start2 + cardAmount + 1) / movieList.length));

        const start3 = end2;
        const end3 = start3 + cardAmount - movieList.length*(Math.trunc((start3 + cardAmount) / movieList.length));
    
        console.log(getSlice(start1, end1));
        console.log(getSlice(start2, end2));
        console.log(getSlice(start3, end3));

        const slice = [
          ...getSlice(start1, end1),
          ...getSlice(start2, end2),
          ...getSlice(start3, end3)
        ];

        // 1,2,3,4,5,6 -> 3,4,5,6,7,8 -> 5,6,7,8,9,10

        const resetX = listRef.current?.clientWidth ?? 0;

        setSlider(state => ({
          ...state,
          list: slice.map((value, index) => ({...value, key: state.controlCounter + index - cardAmount})),
          posX: -resetX,
          transitionTime: 0
        }));
      }
    };

    listReference?.addEventListener('transitionend', handleTranslationFinish);

    return () => {
      listReference?.removeEventListener('transitionend', handleTranslationFinish);
    };
  }, [idx, cardAmount, touched]);

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