import React from 'react'
import { Article } from '../../types/Article'
import { formatDateTime } from '../../untils/time-format';
import { useNavigate } from 'react-router-dom';
import { faBan, faCaretDown, faCaretUp, faComments, faEye } from '@fortawesome/free-solid-svg-icons';
import LinkToProfile from '../user/LinkToProfile';
import '../styles/article.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ArticleItem: React.FC<{ article: Article }> = (props) => {

  const navigate = useNavigate();

  const { article } = props;

  if (!article) return null;

  const tags = article.tags;

  const authorAvatar = article.author?.avatarPath;

  let pathDetail = `/blog/view?id=${props.article.id}`;

  if (article.status == 2) {
    pathDetail = `/blog/view?id=${props.article.id}&status=${article.status}`;
  }


  return (
    <>
      <div className="col-md-4 mb-4 article-link"
        onClick={() => navigate(pathDetail)}>
        <img className="thumbnail"
          src={`${process.env.REACT_APP_URL_MINIO}${article.thumbnail}`}
          alt="" />
      </div>
      <div className="col-md-8 mb-4">
        <div className="d-flex align-items-center">
          {tags && tags.map((item, index) => {
            if (index < 2) {
              return (
                <span
                  onClick={() => navigate(`/blog/list?tag=${item.id}`)}
                  className="bg-gray tag-item" key={item.id}>
                  {item.tagName}
                </span>
              );
            } else if (index === tags.length - 1) {
              return (
                <span className="bg-gray tag-item" key={item.id}>...</span>
              );
            } else {
              return null;
            }
          })}
          <span className="text-muted ps-4">{formatDateTime(article?.createdAt ? article?.createdAt : '')}</span>
        </div>
        <div>
          <p className="text-capitalize fs5 my-3 fw-bolder article-link"
            onClick={() => navigate(pathDetail)}
          >
            {article.title}
          </p>
          <p className="text-muted article-description">{article.description}</p>
        </div>
        <div className='toolbar'>
          <div className='toolbar-start'>
            <div className='d-flex'>
              <img className="img-sm rounded-circle"
                src={authorAvatar ? `${process.env.REACT_APP_URL_MINIO}${authorAvatar}` : "/assets/img/profile-photos/5.png"} />
              <LinkToProfile email={article.author?.email} userName={`${article.author?.first_name} ${article.author?.last_name}`} userId={article.author?.id || -1} />
            </div>
          </div>
          <div className='toolbar-end'>
            <div className='d-flex' style={{ color: "#242323" }}>
              <div className='points m-2'>
                <FontAwesomeIcon icon={faComments} />
                <span className='text-muted'>{article.countComment}</span>
              </div>
              <div className='points m-2'>
                <FontAwesomeIcon icon={faEye} />
                <span className='text-muted'>{article.view}</span>
              </div>
              <div className='points m-2'>
                <div className='carets'>
                  <FontAwesomeIcon icon={faCaretUp} />
                  <FontAwesomeIcon icon={faCaretDown} />
                </div>
                <span className='text-muted'>{article?.vote || 0}</span>
              </div>
              {article.status === 2 &&
                <div className='points m-2'>
                  <FontAwesomeIcon style={{ color: "red" }} icon={faBan} />
                  <span title='Nội dung bài viết bị hạn chế' className='text-muted'>Hạn chế</span>
                </div>
              }
            </div>
          </div>
        </div>

      </div>
      <hr style={{ color: "black" }} />
    </>
  )
}

export default ArticleItem
