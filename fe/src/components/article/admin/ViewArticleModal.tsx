import { Modal } from 'antd'
import React from 'react'
import ArticleContent from '../ArticleContent';
import { functionChange } from '../../../type';
import { Link } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  articleId: number | undefined;
  onClose?: functionChange;
}

const ViewArticleModal: React.FC<Props> = (props) => {
  const { isOpen, articleId, onClose } = props;

  return (
    <Modal
      title="Nội dung bài viết"
      open={isOpen}
      width={1400}
      onCancel={() => onClose && onClose(false)}
    >
      <div className='toolbar'>
        <div className='toolbar-start'></div>
        <div className='toolbar-end'>
          <Link target='_blank' to={`/blog/view?id=${articleId}`}>Xem chi tiết ở trang bài viết</Link>
        </div>
      </div>
      <ArticleContent
        style={{
          height: "800px",
          overflow: "scroll"
        }}
        articleId={articleId}
      />

    </Modal >
  )
}

export default ViewArticleModal
