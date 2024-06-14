import React, { useEffect, useState } from 'react'
import InfoUserItem from '../InfoUserItem'
import { deleteSeries, getDetailSeries } from '../../services/SeriesSerivce';
import { useLocation, useNavigate } from 'react-router-dom';
import { SeriesData } from '../../types/SeriesData';
import { toast } from 'react-toastify';
import LinkToProfile from '../user/LinkToProfile';
import { Result } from 'antd';
import BtnFollow from '../common/BtnFollow';
import { getCurrentLogin, getToken } from '../../services/AuthService';
import AddArticleToSeries from './AddArticleToSeries';
import { Article } from '../../types/Article';
import ArticleItem from '../article/ArticleItem';
import { getArticles, updateSeriesArticle } from '../../services/ArticleService';
import { PaginationData } from '../../types/Pagination';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faMinus, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';
import ButtonConfirm from 'button-confirm-tk';
import Pagination from '../common/Pagination';

const DetailSeries = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const seriesIdStr = searchParams.get("seriesId");
  const seriesId = seriesIdStr ? +seriesIdStr : -1;

  const navigate = useNavigate();

  const [articleList, setArticleList] = useState<Article[]>([]);

  const [pagingArticle, setPagingArticle] = useState<PaginationData>();

  const [isInitialMount, setIsInitialMount] = useState(true);

  const [seriesData, setSeriesData] = useState<SeriesData>();

  const [toggleAddArticle, setToggleAddArticle] = useState<boolean>(false);

  const [pageNumber, setPageNumber] = useState<number>(parseInt(searchParams.get('search') || '1'));

  const dispatch = useDispatch();

  useEffect(() => {

    const fetchData = async () => {
      const id = seriesId ? +seriesId : -1;
      dispatch(actions.controlLoading(true));
      const response = await getArticles(10, pageNumber, null, null, "", id);
      dispatch(actions.controlLoading(false));

      if (!response) return;

      const result = response.data.data;
      const pagination = response.data.pagination;
      setArticleList(result);
      setPagingArticle(pagination);
    }

    fetchData()
  }, [location]);

  useEffect(() => {
    const fetchSeriesData = async () => {
      dispatch(actions.controlLoading(true));
      const response = await getDetailSeries(seriesId);
      dispatch(actions.controlLoading(false));

      if (!response) {
        return;
      }
      const series = response.data.data;
      setSeriesData(series);
    }
    if (isInitialMount) {
      setIsInitialMount(false);
    } else {
      fetchSeriesData();
    }
  }, [isInitialMount]);

  const changeUrl = () => {
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  }

  const handleAddArticle = (newItem: Article) => {
    setToggleAddArticle(prevToggleAddArticle => !prevToggleAddArticle);
    setArticleList(prevArticles => {
      return [...prevArticles, newItem];
    })
  }

  const handleToggleAddArticle = () => {
    setToggleAddArticle(prevToggleAddArticle => !prevToggleAddArticle);
  }

  const handleDeleteArticle = async (articledId: number) => {
    dispatch(actions.controlLoading(true));
    const response = await updateSeriesArticle(articledId, seriesId, -1, "delete");
    dispatch(actions.controlLoading(false));

    if (!response) {
      return;
    }

    toast.info("Đã xóa bài viết khỏi series");
    window.location.reload();
  }

  const handleDeleteSeries = async (seriesId: number) => {
    dispatch(actions.controlLoading(true));
    const response = await deleteSeries(seriesId);
    dispatch(actions.controlLoading(false));

    if (!response) return;

    toast.info('Đã xóa series');
    navigate(`/user/profile?userId=${getCurrentLogin().id}&tab=2`);
  }

  return (
    <div>
      {seriesData ?
        <section id="content" className="content">
          <div className=''>
            <div className="card-header toolbar">
              <div className="toolbar-start">
                <div className='d-flex'>
                  <InfoUserItem
                    idData={seriesData?.id}
                    avatarPath={seriesData?.author.avatarPath || ""}
                    vote={seriesData?.vote || 0} type="series"
                    name={`${seriesData?.author.first_name} ${seriesData?.author.last_name}`}
                    nameDisplay={false}
                    userId={seriesData?.author.id || -1}
                  />
                  <div className='mb-3'>
                    <LinkToProfile userId={seriesData?.author.id || -1} userName={`${seriesData?.author.first_name} ${seriesData?.author.last_name}`} />
                  </div>
                </div>
              </div>
              <div className="toolbar-end">
                <div className='mb-3 d-flex'>
                  <FontAwesomeIcon icon={faEye} />
                  <span className='text-muted'>{seriesData.view}</span>
                </div>
                {getCurrentLogin() && getCurrentLogin().id === seriesData.author.id &&
                  <>
                    <div className='mb-3 d-flex' style={{ marginLeft: "10px" }}>
                      <Button title='Chỉnh sửa' onClick={() => navigate(`/series/edit?seriesId=${seriesData.id}`)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </div>
                    <div className='mb-3 d-flex' style={{ marginLeft: "10px" }}>
                      <ButtonConfirm
                        body='Bạn có chắc muốn xóa series này'
                        btnClass='btn btn-danger'
                        btnContent={<FontAwesomeIcon title='Xóa series này' icon={faTrash} />}
                        closeTxt='Đóng'
                        header='Cảnh báo'
                        okeTxt='Xóa'
                        onConfirm={() => handleDeleteSeries(seriesData.id)}
                      />
                    </div>
                  </>
                }
                <div className='mb-3 d-flex'>
                  {(getCurrentLogin() && (getCurrentLogin().id != seriesData?.author.id)) &&
                    < BtnFollow userId={seriesData?.author.id || -1} />
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='card'>
            <div className="card-header mb-3">
              <h3>{seriesData?.title}</h3>
            </div>
            <div className="card-body flex-grow-0 ql-editor">
              <div dangerouslySetInnerHTML={{ __html: seriesData?.description || '' }} className="lh-lg mb-3">
              </div>
              <hr />
              <div className='row'>
                {articleList ? articleList.map(article => (
                  <div className='toolbar'>
                    <div className='toolbar-start'>
                      <div className={`col-lg-12 order-lg-0`}>
                        <div className="row">
                          <ArticleItem key={article.id} article={article} />
                        </div>
                      </div>
                    </div>
                    {getCurrentLogin() && getCurrentLogin().id === seriesData.author.id &&
                      <div className='toolbar-end' style={{ marginLeft: "10px" }}>
                        <ButtonConfirm
                          body='Bạn có chắc muốn xóa bài viết này khỏi series'
                          btnClass='btn btn-danger'
                          btnContent={<FontAwesomeIcon title='Xóa bài viết khỏi series' icon={faMinus} />}
                          closeTxt='Đóng'
                          header='Cảnh báo'
                          okeTxt='Xóa'
                          onConfirm={() => handleDeleteArticle(article.id || -1)}
                        />
                      </div>
                    }


                  </div>
                )) : <p>Chưa có bài viết trong series này</p>}
              </div>
              {getToken() && getCurrentLogin().id === seriesData.author.id &&
                <div className='row'>
                  {toggleAddArticle &&
                    <AddArticleToSeries
                      seriesId={seriesId ? +seriesId : -1}
                      onSuccess={handleAddArticle}
                      beforeValue={articleList.map(article => article.id)}
                    />
                  }

                  {!toggleAddArticle &&
                    <Button onClick={handleToggleAddArticle} className='btn-primary'>
                      <span><FontAwesomeIcon icon={faPlusCircle} /> Thêm bài viết </span>
                    </Button>
                  }
                </div>
              }
            </div>
            <div className='row'>
              {pagingArticle && pagingArticle.itemCount > 0 &&
                <Pagination
                  onChangePage={(page) => {
                    setPageNumber(page);
                    searchParams.set('page', page);
                    changeUrl();
                  }}
                  paging={pagingArticle} />
              }
            </div>
          </div>
        </section>
        :
        <Result
          status="404"
          title="404 - Series không tồn tại"
          subTitle="Series đã bị xóa hoặc không tồn tại"
          extra={<Link to="/" type="primary">Về trang chủ</Link>}
        />
      }
    </div >
  )
}

export default DetailSeries
