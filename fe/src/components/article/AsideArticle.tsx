import React, { useEffect, useState } from 'react'
import SideBar from '../Sidebar'
import { UserData } from '../../types/UserData'
import { TagData } from '../../types/Tag'
import { Article } from '../../types/Article';
import { formatDateTime } from '../../untils/time-format'
import { Link } from 'react-router-dom'
import SideBarTag from '../common/side-bar/SideBarTag'
import { getArticles } from '../../services/ArticleService';
import TableOfContents from 'table-of-contents-tk';

interface AsideArticleProps {
  tags: TagData[],
  userData?: UserData
  contentRef: React.RefObject<HTMLDivElement>
}

const AsideArticle: React.FC<AsideArticleProps> = (props: AsideArticleProps) => {
  const [articleAuthor, setArticleAuthor] = useState<Article[]>();
  useEffect(() => {
    const fetchData = async () => {
      if (props.userData) {
        const response = await getArticles(5, 1, undefined, props.userData?.id);
        if (!response) return;

        setArticleAuthor(response.data.data);
      }
    }
    fetchData();
  }, [props.userData]);

  return (
    <SideBar >
      <h5 >MỤC LỤC: </h5>
      <TableOfContents
        contentRef={props.contentRef}
      />
      <h5>Cùng tác giả</h5>

      <ul className="nav flex-column px-3">
        {articleAuthor && articleAuthor.map((article, index) => (
          <li key={index} className="nav-item mb-3">
            <Link className="d-inline-block btn-link" to={`/blog/view?id=${article.id}`}>{article.title}</Link>
            <small className="d-block">{formatDateTime(article.createdAt || '')}</small>
          </li>
        ))}
        <Link to={`/blog/list?author=${props?.userData?.id}`} >Xem thêm</Link>
      </ul>

      <hr />
      <SideBarTag title='Cùng thể loại'
        tags={props.tags}
        path='/blog/list'
      />
    </SideBar>
  )
}

export default AsideArticle