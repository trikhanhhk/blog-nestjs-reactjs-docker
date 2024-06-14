
import React, { useState } from 'react'
import ViewArticleModal from '../article/admin/ViewArticleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

interface Props {
  articleId: number;
}

const BtnViewArticle: React.FC<Props> = (props) => {
  const { articleId } = props;

  const [isOpenViewArticle, setIsOpenViewArticle] = useState<boolean>(false);

  return (
    < >
      <Button className='btn btn-success' title="Xem bài viết"
        onClick={() => {
          setIsOpenViewArticle(true);
        }}
      ><FontAwesomeIcon icon={faEye} /></Button>
      <ViewArticleModal onClose={setIsOpenViewArticle} articleId={articleId} isOpen={isOpenViewArticle} />
    </>
  )
}

export default BtnViewArticle
