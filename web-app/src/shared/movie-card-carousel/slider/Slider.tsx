import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { sliderPropertiesSelector } from '../../../services/slices-selectors/slider-properties';
import { IMovie } from '../../interfaces/movie-types';
import MovieCard from '../../movie-card/MovieCard';
import style from './Slider.module.scss';

interface ISlider {
  movieSlice: IMovie[];
  sliderRef: React.RefObject<HTMLDivElement>;
  posX: number;
  transitionTime: number;
  handleOverlay: (card: HTMLDivElement | undefined | null, movie: IMovie) => void
}

const Slider: React.FC<ISlider> = (props: ISlider) => {
  const sliderProperties = useSelector(sliderPropertiesSelector);

  return (
    <div
      className={style['slider']}
      ref={props.sliderRef}
      style={{
        transform: `translate3d(${props.posX}%, 0, 0)`,
        transition: `${props.transitionTime}ms ease`,
        minHeight: (sliderProperties.cardWidth*9)/16 + 'px'
      }}
    >
      {
        props.movieSlice.map((item, index) => (
          <Fragment key={item.key}>
            <MovieCard    
              movie={item}
              handleOverlay={props.handleOverlay}
            />
          </Fragment>
        ))
      }
    </div>
  )
};

export default Slider;

