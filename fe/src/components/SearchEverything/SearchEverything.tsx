import Search from 'antd/es/input/Search';
import React, { ChangeEventHandler, CSSProperties, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  style?: CSSProperties | undefined;
  defaultTxt?: string;
}

const SearchEverything: React.FC<Props> = (props) => {
  const { style, defaultTxt } = props;

  const navigation = useNavigate();

  const [searchTxt, setSearchTxt] = useState<string>(defaultTxt || '');

  const onSearchEverything = (value: string) => {
    navigation(`/search?text=${value}`);
  }

  const onChangeText = (event: any) => {
    setSearchTxt(event.target.value);
  }

  return (
    <div>
      <Search value={searchTxt} onChange={onChangeText} style={style} size="large" onSearch={(value) => onSearchEverything(value)} placeholder="Tìm kiếm trên Viblo" enterButton />
    </div>
  )
}

export default SearchEverything
