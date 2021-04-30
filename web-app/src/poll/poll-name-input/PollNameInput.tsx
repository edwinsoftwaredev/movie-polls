import React, { useEffect, useState } from 'react';
import style from './PollNameInput.module.scss';
import {ReactComponent as SaveVector} from '../../shared/resources/vectors/save.svg';
import {ReactComponent as EditVector} from '../../shared/resources/vectors/edit-3.svg';
import Spinner from '../../shared/spinners/Spinners';

const PollNameInput: React.FC<{
  onChange: (value: string) => void, 
  init: string,
  updatable: boolean
}> = ({onChange, init, updatable}) => {
  const [editable, setEditable] = useState(false);
  const [initVal, setInitVal] = useState(init);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editable && initVal !== init && !isSaving) {
      setIsSaving(true);
      onChange(initVal);
    }
  }, [initVal, onChange, editable, init, isSaving]);

  useEffect(() => {
    if (initVal === init && isSaving) {
      setIsSaving(false);
    }
  }, [isSaving, initVal, init]);
  
  return (
    <div className={style['text-input-component']}>
      <form onSubmit={e => {setEditable(false); e.preventDefault();} }>
        <input 
          type='text' 
          onChange={e => setInitVal(e.target.value)} 
          value={initVal}
          disabled={!editable || !updatable}
        />
        {
          updatable ? (
            <button 
              type='button' 
              title={editable ? 'Save' : 'Edit Title'}
              className={style['edit-vector']} 
              onClick={e => setEditable(state => !state)}>
              {
                editable ? <SaveVector /> : isSaving ? <Spinner color={'white'}/> : <EditVector /> 
              } 
            </button>
          ) : null
        }
      </form>
    </div>
  )
};

export default PollNameInput;