import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { sliderPropertiesSelector } from '../../../../services/slices-selectors/slider-properties';
import CardOverlay from '../CardOverlay';

interface ICardOverlayPortal {
  activeCard: HTMLDivElement | undefined | null;
  activeMovie: any;
  clearCardOverlay: () => void;
}

const CardOverlayPortal: React.FC<ICardOverlayPortal> = (props: ICardOverlayPortal) =>{
  const elRef = useRef<HTMLDivElement>();
  const [isCurrent, setIsCurrent] = useState(false);
  const sliderProperties = useSelector(sliderPropertiesSelector);

  useEffect(() => {
    const el = document.createElement('div');
    if (!elRef.current && props.activeCard) {
      elRef.current = el;
      document.body.appendChild(el);
      setIsCurrent(true);
    }

    return () => {
      if (elRef.current) {
        document.body.removeChild(elRef.current);
        elRef.current = undefined;
        setIsCurrent(false);

        const el = document.getElementById('sliders-container');

        if (window.innerHeight < document.body.clientHeight) {
          document.body.style.overflowY = 'auto';
        }

        if (el) {
          el.style.top = 'unset';
          el.style.position = 'static';
        }
      }
    }
  }, [props]);

  return (
    elRef.current && isCurrent && props.activeCard ? (
      createPortal(
        <CardOverlay 
          card={props.activeCard}
          clearCardOverlay={props.clearCardOverlay}
          movie={props.activeMovie}
          isMobile={sliderProperties.isMobile}
        />,
        elRef.current
      )
    ) : null
  )
};

export default CardOverlayPortal;