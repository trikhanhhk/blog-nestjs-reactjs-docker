import React, { useEffect, useState } from 'react'
import { getCommentDetail } from '../../../services/CommentService';
import { CommentItem } from '../../../types/CommentData';
import ChildComment from '../../comment/ChildComment';

interface Props {
  commentId: number
}

const DetailReportComment: React.FC<Props> = (props) => {
  const { commentId } = props;
  const [commentItem, setCommentItem] = useState<CommentItem>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCommentDetail(commentId);
      if (response) {
        setCommentItem(response.data.data);
      }
    }

    if (commentId) {
      fetchData();
    }
  }, [commentId])

  return (
    <div>
      {commentItem && <ChildComment comment={commentItem} />}
    </div>
  )
}

export default DetailReportComment
