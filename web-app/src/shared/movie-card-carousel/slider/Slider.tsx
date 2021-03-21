import React, { Fragment, useEffect, useState } from 'react';
import { IMovie } from '../../interfaces/movie-types';
import MovieCard from '../../movie-card/MovieCard';
import style from './Slider.module.scss';

interface ISlider {
  movieSlice: IMovie[];
  cardAmount: number;
  sliderRef: React.RefObject<HTMLDivElement>;
  posX: number;
  transitionTime: number;
  handleOverlay: (card: HTMLDivElement | undefined | null, movie: IMovie) => void
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

    setTimeout(() => {
      handleWindowResize();
    }, 10);
    
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
              movie={item}
              width={cardWidth}
              handleOverlay={props.handleOverlay}
            />
          </Fragment>
        ))
      }
    </div>
  )
};

export default Slider;

