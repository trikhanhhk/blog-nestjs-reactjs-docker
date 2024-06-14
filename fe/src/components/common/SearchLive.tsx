import React, { CSSProperties, useEffect, useState } from 'react'
import { functionChange } from '../../type';

interface SearchLiveProps {
  onChangKeyword: functionChange;
  placeholder?: string;
  style?: CSSProperties | undefined;
  defaultValue?: string;
}

const SearchLive: React.FC<SearchLiveProps> = (props) => {
  const { onChangKeyword, placeholder, style, defaultValue } = props;
  const [keyword, setKeyword] = useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const onTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(!isInitialLoad ? event.target.value : (defaultValue ? defaultValue : ''));
  }

  useEffect(() => {
    defaultValue && setKeyword(defaultValue);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      const delayDebounce = setTimeout(() => {
        onChangKeyword(keyword);
      }, 600);
      return () => clearTimeout(delayDebounce);
    }

    setIsInitialLoad(false);
  }, [keyword]);

  return (
    <input style={style} type="text" placeholder={placeholder ? placeholder : 'Tìm kiếm...'} value={isInitialLoad ? (defaultValue ? defaultValue : '') : keyword} className="form-control" autoComplete="off" onChange={onTyping} />
  )
}

export default SearchLive
