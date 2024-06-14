import React, { useEffect, useState } from 'react'
import { functionChange } from '../../type';
import { getArticleByFollow, getArticles } from '../../services/ArticleService';
import { PaginationData } from '../../types/Pagination';
import { Article } from '../../types/Article';
import Pagination from '../common/Pagination';
import { Empty } from 'antd';
import '../styles/article.css';
import ArticleItem from './ArticleItem';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  authorId?: string | null;
  tagId?: string | null;
  itemPerPage?: number | null;
  type?: "new" | "follow";
  searchText?: string;
  onSuccess?: functionChange;
  col?: number;
}

const ArticleItems: React.FC<Props> = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authorId, tagId, searchText, onSuccess, col } = props;
  const [paging, setPaging] = useState<PaginationData>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(parseInt(searchParams.get("page") || '1'));

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      if (props.type === "follow") {
        const response = await getArticleByFollow();
        dispatch(actions.controlLoading(false));
        if (!response) {
          return;
        }

        setArticles(response.data.data);
        setPaging(response.data.pagination);
        onSuccess && onSuccess(response.data.pagination.itemCount);

      } else {
        const response = await getArticles(20, pageNumber, tagId, authorId, searchText);
        dispatch(actions.controlLoading(false));
        if (!response) {
          return;
        }
        setArticles(response.data.data);
        setPaging(response.data.pagination);
        onSuccess && onSuccess(response.data.pagination.itemCount);
      }
      dispatch(actions.controlLoading(false));
    }

    fetchData();

  }, [location, tagId, authorId, searchText, props.type]);

  const changeUrl = () => {
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  }

  return (
    <div className={`col-lg-${col ? col : '12'} order-lg-0`}>
      <div className="row">
        {articles.length > 0 ?
          <>
            {articles.map((article, index) => (
              <ArticleItem key={index} article={article} />
            ))}

            {paging && <Pagination
              onChangePage={(page) => {
                setPageNumber(page);
                searchParams.set('page', page);
                changeUrl();
              }} paging={paging} />}
          </>
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </div>
    </div>
  )
}

export default ArticleItems