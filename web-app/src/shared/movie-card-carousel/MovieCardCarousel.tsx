import React, { Fragment, useEffect, useRef, useState } from 'react';
import MovieCard from '../movie-card/MovieCard';
import style from './MovieCardCarousel.module.scss';

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

const MovieCarousel: React.FC<any> = ({title}) => {
	const listRef = useRef<HTMLDivElement>(null);
	const [posX, setPosX] = useState(0);
	const [list, setList] = useState<typeof movieList>([]);
	const [cardAmount, setCardAmount] = useState(0);
	const [idx, setIdx] = useState(0);
  const [touched, setTouched] = useState(false); // if the carousel was touched
  const [cardWidth, setCardWidth] = useState(0);
  const [transitionStarted, setTrasitionStarted] = useState(false);

	const handleFowardMovement = () => {
    if (!transitionStarted) {
      if (!touched) {
        setTouched(true);
      }
      setTrasitionStarted(true);
      setIdx(state => state + cardAmount - movieList.length*(Math.trunc((state + cardAmount) / movieList.length)));
  
      const listWidth = listRef.current?.clientWidth ?? 0;
      setPosX(state => state - listWidth);
    }
	};

	const handleBackwardMovement = () => {
    if (!transitionStarted) {
      setTrasitionStarted(true);
      setIdx(state => state - cardAmount + movieList.length*(state - cardAmount >= 0 ? 0 : 1));
      
      const listWidth = listRef.current?.clientWidth ?? 0;
      setPosX(state => state + listWidth);
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
		listRef.current
			?.setAttribute(
        'style',
        `transform: translate3d(${posX}px, 0, 0); transition: 650ms ease-out`);
	},[posX]);

	useEffect(() => {
    if (!touched && cardAmount) {
      setList([
        ...getSlice(idx, cardAmount + 1),
        ...getSlice(cardAmount + 1, cardAmount*2 + 1)
      ]);
    }
	}, [cardAmount, idx, touched]);

  useEffect(() => {
    setTrasitionStarted(false);
  }, [list]);

  useEffect(() => {
    const listWidth = listRef.current?.clientWidth ?? 0;
    setCardWidth(Math.floor((listWidth - 4*cardAmount)/cardAmount));
  }, [cardAmount, list]);

  useEffect(() => {
    if (touched && !transitionStarted) {
      const resetX = listRef.current?.clientWidth ?? 0; 
      // console.log(-resetX);
      // setPosX(-resetX);
      listRef.current
        ?.setAttribute(
          'style',
          `transform: translate3d(${-resetX}px, 0, 0); transition: 0 !important;`
        );
      
      setPosX(-resetX);
    }
  }, [touched, list, transitionStarted]);

  useEffect(() => {
    const listReference = listRef.current;

    const handleTranslationFinish = () => {
      if (touched && transitionStarted) {
        const start1 = idx - cardAmount + movieList.length*(idx - cardAmount >= 0 ? 0 : 1);
        const end1 = (
            start1 + cardAmount >= movieList.length ?
              (start1 + cardAmount - movieList.length) : start1 + cardAmount
          );
  
        const start2 = idx;
        const end2 = start2 + cardAmount + 1 - movieList.length*(Math.trunc((start2 + cardAmount + 1) / movieList.length));

        const start3 = end2;
        const end3 = start3 + cardAmount - movieList.length*(Math.trunc((start3 + cardAmount) / movieList.length));
  
        setList([
          ...getSlice(start1, end1),
          ...getSlice(start2, end2),
          ...getSlice(start3, end3)
        ]);
      }
    };

    listReference?.addEventListener('transitionend', handleTranslationFinish);

    return () => {
      listReference?.removeEventListener('transitionend', handleTranslationFinish);
    };
  }, [idx, cardAmount, touched, transitionStarted]);

	useEffect(() => {
		const handleResize = () => {
			let numberCards = 10;
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
				<div className={style['list']} ref={listRef}>
					{
						list.map((item, index) => (
							<Fragment key={index}>
                <MovieCard 
                  title={item.id}
                  popularity={item.popularity}
                  genres={item.genres}
                  width={cardWidth}
                />
              </Fragment>
						))
					}
				</div>
				<div className={style['forward']} onClick={handleFowardMovement}>
          <span></span>
          <span></span>
        </div>
			</div>
		</div>
	)
};

export default MovieCarousel;