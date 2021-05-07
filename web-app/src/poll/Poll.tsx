import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { pollsSelector } from '../services/slices-selectors/polls';
import { IPoll } from '../shared/interfaces/movie-poll-types';
import { IMovieDetail } from '../shared/interfaces/movie-types';
import style from './Poll.module.scss';
import { getPublicPoll, patchPoll } from '../services/epics/polls';
import PollService from '../services/poll-service';
import { userAuthenticationStatusSelector } from '../auth/auth-selectors';
import { USER_AUTHENTICATION_STATUS, VOTE_STATUS } from '../shared/utils/enums';
import { getUser } from '../firebase-config';
import Header from './header/Header';
import PollAuthor from './poll-author/PollAuthor';
import PollTokens from './poll-tokens/PollTokens';
import Movie from './movie/Movie';

const getId = (id: string): number | null => {
  const value = Number.parseInt(id); 
  return Number.isNaN(value) ? null : value;
}

const Poll: React.FC = () => {
  const [id, setId] = useState<number | null>(null);
  const [poll, setPoll] = useState<IPoll | null>(null);
  const polls = useSelector(pollsSelector);
  const location = useLocation(); 
  const [totalVotes, setTotalVotes] = useState(0);
  const [voted, setVoted] = useState<VOTE_STATUS>(VOTE_STATUS.NOT_FETCHED); // change to NOT_FETCHED
  const [author, setAuthor] = useState<{
    name: string | undefined,
    photoURL: string | undefined, 
    uid: string}>();
  const userAuthenticationStatus = useSelector(userAuthenticationStatusSelector);
  const [isOpen, setIsOpen] = useState<boolean | undefined>();
  const [tokenId, setTokenId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  
  // when this component loads it does with a token
  // if the token is used then the poll must be considered 
  // as voted by the user.

  const changeStatusClbk = () => {
    if (
      poll && 
      poll.endsAt && 
      poll.isOpen &&
      new Date(poll.endsAt) <= new Date()
    ) {
      return;
    }
    
    setIsOpen(state => typeof state !== 'undefined' ? !state : state);
  }

  useEffect(() => {
    poll &&
    poll.id &&
    typeof isOpen !== 'undefined' &&
    poll.endsAt &&
    isOpen !== poll.isOpen &&
    (!poll.isOpen ? true : new Date(poll.endsAt) > new Date()) &&
    author?.uid === getUser()?.uid && 
    dispatch(patchPoll({id: poll.id, pollPatch: {isOpen: isOpen}}));
  }, [dispatch, poll, isOpen, author]);

  useEffect(() => {
    id !== null && 
    userAuthenticationStatus !== USER_AUTHENTICATION_STATUS.ERROR_RETRIVING && 
    userAuthenticationStatus !== USER_AUTHENTICATION_STATUS.NOT_FETCHED &&
    PollService.getPollAuthor(id).then(res => setAuthor(res));
  }, [id, userAuthenticationStatus]);

  useEffect(() => {
    if (location.pathname.substring(1).split('/').length >= 2) {
      setId(getId(location.pathname.substring(1).split('/')[1]));
    }
  }, [location]);

  useEffect(() => {
    if (polls && id !== null) {
      // This could leads to memory leaks. Test before implementation.
      if (polls.filter(poll => poll.id === id).length === 1) {
        setPoll(polls.filter(poll => poll.id === id)[0]);
      } else {
        history.push('/my-polls');
      }
    }
  }, [id, polls, history]);

  useEffect(() => {
    poll && setTotalVotes(state => poll.movies
      // .filter(movie => movie.movie)
      .map(movie => movie.voteCount ?? 0)
      .reduce((prev, curr) => prev + curr)
    );
    poll && 
    author && 
    author.uid !== getUser()?.uid && 
    setVoted(state => typeof poll.tokens === 'undefined' ? 
      state : 
      typeof poll.tokens[0] === 'undefined' ? 
        state : 
        poll.tokens[0].used ? 
          VOTE_STATUS.VOTED : 
          VOTE_STATUS.NOT_VOTED
    );
    setIsOpen(state => poll === null || typeof poll === 'undefined' ? state : typeof poll.id === 'undefined' ? state : poll.isOpen);
  }, [poll, author]);

  useEffect(() => {
    const tokenId = new URLSearchParams(location.search).get('tid');
    if (tokenId && id && author && author.uid !== getUser()?.uid) {
      setTokenId(tokenId);
      dispatch(getPublicPoll({pollId: id, tokenId: tokenId}));
    }
  }, [id, location, author, dispatch]);

  return (
    <div
      id='sliders-container' 
      className={
        style['poll-component'] + ' ' +
        style['sliders-container']
      }
    >
      {
        !poll || !poll.id ? null : (
          <div className={style['poll-container']}>
            {author ? getUser()?.uid !== author.uid ? <PollAuthor name={author.name} photoURL={author.photoURL} /> : null : null} 
            <Header 
              poll={poll} 
              changeStatusClbk={changeStatusClbk}
              isUpdating={isOpen !== poll.isOpen}
              userIsAuthor={!!(author && getUser()?.uid === author.uid)}
            />
            {
              !poll.isOpen && author && getUser()?.uid === author.uid ? (
                <PollTokens
                  pollId={poll.id}
                  tokens={poll.tokens}
                />
              ) : null
            }
            <div className={style['movies-container']}>
            {
              poll.movies.filter(movie => movie.movie).map(movie => (
                <Fragment key={movie.movieId}>
                  <Movie 
                    movie={movie.movie as IMovieDetail} 
                    progress={totalVotes ? Math.ceil(((movie.voteCount ?? 0) / totalVotes)*100) : 0}
                    votes={movie.voteCount ?? 0}
                    isOpenPoll={!!poll.isOpen}
                    pollId={poll.id as number}
                    voted={voted}
                    onVote={() => setVoted(VOTE_STATUS.VOTING)}
                    votable={!poll.isOpen && !!author && getUser()?.uid !== author.uid}
                    isUpdating={isOpen !== poll.isOpen}
                    userIsAuthor={!!author && author.uid === getUser()?.uid}
                    tokenId={tokenId}
                    endsAt={poll.endsAt}
                  />
                </Fragment>
              ))
            }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Poll;