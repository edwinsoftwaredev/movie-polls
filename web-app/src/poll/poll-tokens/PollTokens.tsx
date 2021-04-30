import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToken, removeToken } from '../../services/epics/token';
import { IToken } from '../../shared/interfaces/movie-poll-types';
import Spinner from '../../shared/spinners/Spinners';
import style from './PollTokens.module.scss';
import {ReactComponent as ChevronVector} from '../../shared/resources/vectors/chevron-down.svg';
import {ReactComponent as LinkVector} from '../../shared/resources/vectors/link.svg';
import {ReactComponent as CopyVector} from '../../shared/resources/vectors/copy.svg';
import {ReactComponent as DeleteVector} from '../../shared/resources/vectors/delete.svg';

const PollTokens: React.FC<{
  tokens: IToken[] | undefined,
  pollId: number
}> = ({tokens, pollId}) => {
  const dispatch = useDispatch();
  const [tokensHidden, setTokensHidden] = useState<undefined | boolean>();
  const [removedTokens, setRemovedTokens] = useState<string[]>([]);
  const [addingTokens, setAddingTokens] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string>('');
  const timeoutRef = useRef<any>();

  const handleAddTokenClick = () => {
    setAddingTokens(true);
    dispatch(addToken({pollId: pollId}));
  };

  const handleRemoveTokenClick = (tokenId: string) => {
    setRemovedTokens(state => state.length !== 0 ? [...state, tokenId] : [tokenId]);
    dispatch(removeToken({pollId: pollId, tokenId: tokenId}));
  };

  const handleCopyToClipboardClick = (text: string) => {
    setCopiedToken(text);
    navigator.clipboard.writeText(`${window.location.host}/poll?id=${pollId}&tid=${text}`);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopiedToken('');
    }, 500);
  };

  useEffect(() => {
    setRemovedTokens(state => {
      const s = state.filter(token => tokens?.filter(t => t.uuid === token).length !== 0 ? true : false);
      if (s.length === state.length) {
        setAddingTokens(false);
      }

      return s;
    });
  }, [tokens]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return (
    <div className={style['poll-tokens-component']}>
      <div className={style['tokens-component-header']}>
        <div className={style['tokens-component-header-title']}>Tokens</div>
        {
          typeof tokensHidden !== 'undefined' ? !tokensHidden ? (
            <button
              title='Add New Token'
              onClick={handleAddTokenClick} 
              className={
                style['add-token-btn']
              }
              disabled={addingTokens}
            >
              {addingTokens ? <Spinner color={'white'} /> : 'Add New Token'} 
            </button>
          ) : <div className={style['empty-div']}></div> : <div className={style['empty-div']}></div>
        }
        <button 
          title='Show Tokens'
          onClick={e => setTokensHidden(state => typeof state === 'undefined' ? false : !state)} 
          className={
            style['tokens-component-header-show-btn'] + ' ' +
            (typeof tokensHidden !== 'undefined' && !tokensHidden ? style['btn-rotated'] : '') 
          }
        >
          <ChevronVector />
        </button>
      </div>
      <div 
        className={
          style['tokens-container'] + ' ' +
          (typeof tokensHidden !== 'undefined' ? (tokensHidden ? style['tokens-container-hidden'] : style['tokens-container-showed']) : '') 
        }
      >
        {
          tokens && tokens.length !== 0 ? (
            tokens.map((token, idx) => (
              <Fragment key={idx}>
                <div className={style['item-number']}>{idx + 1}.</div>
                <div key={token.uuid} className={style['token-container']}>
                  <div className={style['token-link-icon']}>
                    <LinkVector />
                  </div>
                  <div 
                    className={
                      style['token'] + ' ' +
                      (copiedToken === token.uuid ? style['token-copied'] : '')
                    }
                  >
                      {`${window.location.host}/poll?id=${pollId}&tid=${token.uuid}`}
                  </div>
                  <div 
                    className={
                      style['token-status'] + ' ' +
                      (token.used ? style['token-used'] : '')
                    }
                  >
                    {token.used ? 'USED' : 'NOT USED'}
                  </div>
                  <button
                    title='Remove Token' 
                    onClick={e => handleRemoveTokenClick(token.uuid)} 
                    className={style['remove-token-btn']}
                    disabled={removedTokens.filter(t => t === token.uuid).length !== 0 ? true : false}
                  >
                    {removedTokens.filter(t => t === token.uuid).length !== 0 ? <Spinner color={'red'} /> : <DeleteVector />}
                  </button>
                  <button 
                    title='Copy Token to Clipboard'
                    className={style['copy-token-btn']}
                    onClick={e => handleCopyToClipboardClick(token.uuid)}
                  >
                    <CopyVector />
                  </button>
                </div>
              </Fragment>
            ))
          ) : (
            <div className={style['token-empty-list-container']}>
              Add tokens to share with others and let them vote.
            </div>
          )
        }
      </div>
    </div>
  )
};

export default PollTokens;