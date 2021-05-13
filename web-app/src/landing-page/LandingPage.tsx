import React, { useState } from 'react';
import style from './LandingPage.module.scss';
import step1 from '../shared/resources/steps-gifs/step_1.gif';
import step2 from '../shared/resources/steps-gifs/step_2.gif';
import step3 from '../shared/resources/steps-gifs/step_3.gif';
import step4 from '../shared/resources/steps-gifs/step_4.gif'

const Carousel: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [{
    title: 'Pick the movies & Create a new poll',
    media: step1
  }, {
    title: 'Generate the tokens/links',
    media: step2
  }, {
    title: 'Share the tokens/links',
    media: step3
  }, {
    title: 'Check the results',
    media: step4
  }]
  
  return (
    <div className={style['carousel']}>
      <div className={style['step-title']}>{steps[step].title}</div>
      <div className={style['step-number-container']}>
        <hr />
        <div className={style['step-number']}>
          {step + 1}
        </div>
        <hr />
      </div>
      <div className={style['media-container']}>
        <div className={style['media']}>
          <img alt={steps[step].title} src={steps[step].media} />
        </div>
      </div>
      <div className={style['buttons']}>
        <div className={style['back']} onClick={e => {
          if (step + 1 === 1) {
            setStep(steps.length - 1);
          } else {
            setStep(step - 1);
          }
        }}>
          <span style={{transform: 'rotate(70deg)', transformOrigin: 'left'}}></span>
          <span style={{transform: 'rotate(-70deg)', transformOrigin: 'left'}}></span>
        </div>
        <div className={style['page-indicator']}>
          {
            steps.map((value, index) => (
                <div key={index} className={
                  style['indicator'] + ' ' + (
                    step === index ? style['active'] : ''
                  )
                }></div>
              )
            )
          }
        </div>
        <div className={style['forward']} onClick={e => {
          if (step + 1 === steps.length) {
            setStep(0);
          } else {
            setStep(step + 1);
          }
        }}>
          <span style={{transform: 'rotate(-70deg)', transformOrigin: 'right'}}></span>
          <span style={{transform: 'rotate(70deg)', transformOrigin: 'right'}}></span>          
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className={style['landing-page-component']}>
      <div className={style['container']}>
        <div className={style['grid-container']}>
          <div className={style['app-info']}>
            <div className={style['title']}>
              Movie Polls
            </div>
            <div className={style['content']}>
              Movie Polls helps you decide which movie 
              is the best movie to watch when you have many options.
              Just make a poll and let other people help you.
            </div>
          </div>
          <div className={style['app-steps']}>
            <Carousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;