import React from 'react'
import EditButton from '../common/EditButton'
import { Link } from 'react-router-dom'
import { getCurrentLogin, getToken } from '../../services/AuthService';
import { Button, Tooltip } from 'antd';

interface Props {
  articleId: number | null | undefined;
  authorId: number | null | undefined;
}

const ArticleEditButton: React.FC<Props> = (props) => {
  const currentLogin = getCurrentLogin();
  return (
    <>
      {getToken() && currentLogin.id === props.authorId &&
        <Tooltip placement="bottom" title="Chỉnh sửa bài viết">
          <Link to={`/blog/edit?id=${props.articleId}`} >
            <EditButton />
          </Link>
        </Tooltip>
      }
    </>
  )
}

export default ArticleEditButton
