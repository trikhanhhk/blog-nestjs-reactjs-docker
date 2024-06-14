import React, { useEffect, useRef, useState } from 'react'
import InfoUserItem from '../InfoUserItem';
import LinkToProfile from '../user/LinkToProfile';
import BtnFollow from '../common/BtnFollow'
import ArticleEditButton from './ArticleEditButton'
import MoreAction from '../common/MoreAction'
import { Article } from '../../types/Article'
import { deleteArticle, getArticleEdit, getDetailArticle } from '../../services/ArticleService'
import Seo from '../common/SEO'
import AsideArticle from './AsideArticle'
import CommentSection from '../comment/CommentSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faEye, faTrash, faWarning } from '@fortawesome/free-solid-svg-icons';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getCurrentLogin, getToken } from '../../services/AuthService';
import { Result } from 'antd';
import { Link } from 'react-router-dom';
import ButtonConfirm from 'button-confirm-tk';

interface Props {
  articleId: number | undefined;
  withSeo?: boolean;
  style?: React.CSSProperties | undefined;
  status?: string | undefined | null;
}

const ArticleContent: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { articleId, withSeo, style, status } = props;

  let userLoginId = undefined;
  const token = localStorage.getItem("access_token") || false;
  if (token && localStorage.getItem("userData")) {
    userLoginId = JSON.parse(localStorage.getItem("userData") || '').id;
  }

  const [article, setArticle] = useState<Article>();
  const [isInitialMount, setIsInitialMount] = useState(true);

  const [totalComment, setTotalComment] = useState<number>(0);

  const contentRef = useRef<HTMLDivElement>(null);


  if (!articleId) return;

  useEffect(() => {
    const fetchData = async () => {
      const requestApi = (status && status == '2') ? getArticleEdit : getDetailArticle;

      dispatch(actions.controlLoading(true));
      const response = await requestApi(articleId);
      dispatch(actions.controlLoading(false));

      if (!response) {
        return;
      }
      setArticle(response.data.data);
    }

    if (isInitialMount) {
      setIsInitialMount(false);
    } else {
      fetchData();
    }
  }, [articleId, isInitialMount]);

  const confirmDelete = async () => {
    const response = await deleteArticle(articleId);

    if (response) {
      toast.info('Xóa bài thành công');
      navigate(`/user/profile?userId=${getCurrentLogin().id}`)
    }
  }

  return (
    <>
      {article ?
        <>
          {withSeo &&
            <Seo title={article.title}
              metaDescription={article.description}
              metaKeywords={article.keyword}
            />
          }
          <section style={style ? style : {}} id="content" className="content">
            <div className="content__boxed">
              <div className=''>
                <div className="card-header toolbar">
                  <div className="toolbar-start">
                    <div className='d-flex'>
                      <InfoUserItem
                        idData={article.id} avatarPath={article.author?.avatarPath || ""}
                        vote={article.vote || 0} type="article"
                        name={`${article.author?.first_name} ${article.author?.last_name}`}
                        nameDisplay={false}
                        userId={article.author?.id || -1}
                      />
                      <div className='mb-3'>
                        <LinkToProfile userId={article.author?.id || -1} userName={`${article.author?.first_name} ${article.author?.last_name}`} />
                      </div>
                      <div style={{ marginLeft: "6px" }} className='d-flex'>
                        {userLoginId != article.author?.id &&
                          < BtnFollow userId={article.author?.id || -1} />
                        }

                      </div>
                    </div>
                  </div>
                  <div className="toolbar-end">
                    <div className='mb-3 d-flex'>
                      <div className='points mr-3'>
                        <FontAwesomeIcon icon={faComments} />
                        <span className='text-muted'>{totalComment}</span>
                      </div>
                      <div style={{ margin: "0  6px  0 6px" }} className='points mr-3'>
                        <FontAwesomeIcon icon={faEye} />
                        <span className='text-muted'>{article.view}</span>
                      </div>
                      {getToken() && getCurrentLogin()?.id === article.author?.id &&
                        <>
                          <div style={{ margin: "0  6px  0 6px" }} className='points'>
                            <ArticleEditButton articleId={article.id || null} authorId={article.author?.id} />
                          </div>
                          <div style={{ margin: "0  6px  0 6px" }} className='points'>
                            <ButtonConfirm
                              header='Cảnh báo'
                              body='Bạn có chắc muốn xóa bài viết này'
                              onConfirm={confirmDelete}
                              btnContent={<FontAwesomeIcon icon={faTrash} />}
                              btnClass='btn btn-danger'
                              okeTxt='Đồng ý'
                              closeTxt='Đóng'
                              zIndex={1000}
                            />
                          </div>
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <h1>{article.title}</h1>
                  <div className='toolbar'>
                    <div className='toolbar-start'></div>
                    <div className='toolbar-end'>
                      {getToken() && getCurrentLogin().status === 1 && <MoreAction typeReport='article' dataId={article.id} />}
                    </div>
                  </div>
                </div>
                <div className="card my-3">
                  <div className="ratio ratio-21x9 mb-3">
                    <div>
                      <img className="card-img-top object-cover h-100" src={`${process.env.REACT_APP_URL_MINIO}${article.thumbnail}`} alt={article.title} loading="lazy" />
                    </div>
                  </div>

                  <div className="card-body flex-grow-0 ql-editor">
                    {/* Article content */}
                    <div ref={contentRef} dangerouslySetInnerHTML={{ __html: article.body || '' }} className="lh-lg">


                    </div>

                  </div>
                </div>
              </div>
              {/* END : Card blog with image */}
              <div className='card card-footer'>
                {articleId &&
                  <CommentSection articleId={articleId} setTotalComment={setTotalComment} />
                  // <Comment articleId={articleId} setTotalComment={setTotalComment} />
                }
              </div>
              {withSeo &&
                <AsideArticle
                  key={article.id}
                  tags={article.tags || []}
                  userData={article.author}
                  contentRef={contentRef}
                />
              }
            </div>

          </section>
        </>
        :
        <h1 style={{ textAlign: "center" }}><FontAwesomeIcon style={{ color: "red" }} icon={faWarning} /><span>Bài viết không còn tồn tại trên hệ thống</span><FontAwesomeIcon style={{ color: "red" }} icon={faWarning} /></h1>
      }
    </>
  )
}

export default ArticleContent
