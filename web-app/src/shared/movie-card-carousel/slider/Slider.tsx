import React, { Fragment, useEffect, useState } from 'react';
import MovieCard from '../../movie-card/MovieCard';
import style from './Slider.module.scss';

interface IMovie {
  id: string;
  title: string;
  popularity: string;
  genres: string[];
  key: number;
  backdrop: string
}

interface ISlider {
  movieSlice: IMovie[];
  cardAmount: number;
  sliderRef: React.RefObject<HTMLDivElement>;
  posX: number;
  transitionTime: number;
}

const Slider: React.FC<ISlider> = (props: ISlider) => {
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const listWidth = props.sliderRef.current?.getBoundingClientRect().width ?? 0;
    setCardWidth((listWidth - 4*props.cardAmount) / props.cardAmount);
  }, [props.cardAmount, props.sliderRef]);

  useEffect(() => {
    const handleWindowResize = () => {
      const listWidth = props.sliderRef.current?.getBoundingClientRect().width ?? 0;
      setCardWidth((listWidth - 4*props.cardAmount) / props.cardAmount);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, [props.cardAmount, props.sliderRef]);

  return (
    <div
      className={style['slider']}
      ref={props.sliderRef}
      style={{
        transform: `translate3d(${props.posX}%, 0, 0)`,
        transition: `${props.transitionTime}ms ease`
      }}
    >
      {
        props.movieSlice.map((item, index) => (
          <Fragment key={item.key}>
            <MovieCard            
              title={item.title}
              popularity={item.popularity}
              genres={item.genres}
              width={cardWidth}
              backdrop={item.backdrop}
            />
          </Fragment>
        ))
      }
    </div>
  )
};

export default Slider;

