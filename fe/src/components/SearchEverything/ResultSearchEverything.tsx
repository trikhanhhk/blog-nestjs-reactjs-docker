import { Tabs, TabsProps } from 'antd';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ResultArticleSearch from './ResultArticleSearch';
import SearchEverything from './SearchEverything';
import ResultSearchAuthor from './ResultSearchAuthor';
import ResultSearchSeries from './ResultSearchSeries';
import Seo from '../common/SEO';

const ResultSearchEverything = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("text");

  const navigate = useNavigate();

  const [title, setTitle] = useState<string>(() => {
    const tab = searchParams.get("tab");
    if (tab === "2") {
      return "Tác giả";
    } else if (tab === "3") {
      return "Series";
    } else {
      return "Bài viết";
    }
  });

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Bài viết',
      children: <ResultArticleSearch />,
    },
    {
      key: '2',
      label: 'Tác giả',
      children: <ResultSearchAuthor />,
    },
    {
      key: '3',
      label: 'Series',
      children: <ResultSearchSeries />,
    }
  ];

  const changeUrl = () => {
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  }

  const handleTabChange = (key: string) => {
    if (key === '1') {

      searchParams.set("tab", "1");
      changeUrl();
      setTitle('Bài viết');

    } else if (key === '2') {

      searchParams.set("tab", "2");
      changeUrl();
      setTitle('Tác giả');

    } else {

      searchParams.set("tab", "3");
      changeUrl();
      setTitle('Series');

    }
  }

  return (
    <div>
      <Seo
        title={`Kết quả tìm kiếm ${title} - ${search}`}
        metaKeywords={`${title} - Tìm kiếm`}
        metaDescription={`Kết quả tìm kiếm ${title} - ${search}`}
      />
      <SearchEverything defaultTxt={search || ''} style={{ width: "100%", maxWidth: "1300px" }} />
      <Tabs defaultActiveKey={searchParams.get("tab") || "1"} items={items} onChange={(key) => handleTabChange(key)} />
    </div>
  )
}

export default ResultSearchEverything
