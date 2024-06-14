import React from 'react'
import { CommentItem } from '../../types/CommentData'
import { formatDateTime } from '../../untils/time-format';
import UpDownVote from '../UpDownVote';
import LinkToProfile from '../user/LinkToProfile';
import MoreAction from '../common/MoreAction';
import { getCurrentLogin, getToken } from '../../services/AuthService';

interface Props {
  comment: CommentItem;
}

const ChildComment: React.FC<Props> = (props) => {
  const { comment } = props;
  const avatarPath = comment.author.avatarPath;
  return (
    <div className="d-flex flex-start mt-4">
      <a href="#">
        <img className="rounded-circle shadow-1-strong me-3" src={avatarPath ? `${process.env.REACT_APP_URL_MINIO}${avatarPath}` : "/assets/img/profile-photos/5.png"} alt="avatar" width="65" height="65" />
      </a>
      <div className="flex-grow-1 flex-shrink-1">
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-1">
              <LinkToProfile userId={comment.authorId} userName={`${comment.author.first_name} ${comment.author.last_name}`} />

            </p>
            <div className="d-flex">
              <span className="small">{formatDateTime(comment.createdAt)}</span>
              {getToken() && getCurrentLogin().status === 1 && <MoreAction dataId={comment.id} typeReport='comment' />}
            </div>
          </div>
          <p className="mb-3">
            {comment.content}
          </p>
          <UpDownVote isDisabled={false} idData={comment.id} vote={comment.vote} typeItem="comment" />
        </div>
      </div>
    </div>
  )
}

export default ChildComment
