import React, { useState } from 'react';
import { CommentData } from '../../types/CommentData';
import { formatDateTime } from '../../untils/time-format';
import ChildComment from './ChildComment';
import CommentForm from './CommentForm';
import UpDownVote from '../UpDownVote';
import { faChevronDown, faChevronUp, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCurrentLogin, getToken } from '../../services/AuthService';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';
import LinkToProfile from '../user/LinkToProfile';
import MoreAction from '../common/MoreAction';

export type onPostCommentFunction = (content: string, parentId: number | null) => void;
export type handleReadMoreCommentFunction = (nextPage: number, parentId: number) => void;

interface Props {
  comment: CommentData;
  onPostComment: onPostCommentFunction
  handleReadMoreComment: handleReadMoreCommentFunction;
}

const Comment: React.FC<Props> = ({ comment, onPostComment, handleReadMoreComment }) => {
  const dispatch = useDispatch();

  const [showReplyForm, setShowReplyForm] = useState(false);

  const [showReplies, setShowReplies] = useState<boolean>(false);

  const avatarPath = comment.comment.author.avatarPath;

  const commentParent = comment.comment;
  const childComment = comment.children;

  const isLogin = getToken();

  const handleReplyClick = () => {
    if (!isLogin) {
      dispatch(actions.showLogin(true));
    }
    setShowReplyForm(!showReplyForm);
  };

  const handlePostComment = (content: string, parentId: number | null) => {
    onPostComment(content, parentId);
    setShowReplyForm(!showReplyForm);
  }

  const toggleShowReplies = () => {
    const commentId = comment.comment.id;

    setShowReplies(!showReplies);

    if (comment.paginationChild.nextPage) {
      handleReadMoreComment(comment.paginationChild.nextPage, commentId);
    }
  }

  return (
    <div className='row'>
      <div style={{ marginBottom: "10px" }} className="d-flex flex-start">
        <img className="rounded-circle shadow-1-strong me-3" src={avatarPath ? `${process.env.REACT_APP_URL_MINIO}${avatarPath}` : "/assets/img/profile-photos/5.png"} alt="avatar" width="65" height="65" />
        <div className="flex-grow-1 flex-shrink-1">
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <LinkToProfile userId={commentParent.authorId} userName={`${commentParent.author.first_name} ${commentParent.author.last_name}`} />
              <div className="d-flex">
                <span className="small mr-4">{formatDateTime(commentParent.createdAt)}</span>
                {getToken() && getCurrentLogin().status === 1 && <MoreAction dataId={commentParent.id} typeReport='comment' />}
              </div>
            </div>
            <p className="mb-3">{commentParent.content}</p>
            <UpDownVote isDisabled={false} idData={commentParent.id} vote={commentParent.vote} typeItem="comment" />
            {showReplies && childComment && childComment.map((item) => (
              <ChildComment comment={item} key={item.id} />
            ))}
            {childComment.length >= 1 &&
              <a className="btn-link ml-5" onClick={toggleShowReplies}>
                {comment.paginationChild.nextPage ? <span><FontAwesomeIcon icon={faChevronDown} /> {comment.paginationChild.itemCount} phản hồi</span> : (showReplies ? <span><FontAwesomeIcon icon={faChevronUp} /> Ẩn phản hồi</span> : <span><FontAwesomeIcon icon={faChevronDown} /> {comment.paginationChild.itemCount} phản hồi</span>)}
              </a>}
            <a className='btn-link ml-5' onClick={handleReplyClick}><span><FontAwesomeIcon icon={faReply} /> Trả lời</span></a>
            {showReplyForm && isLogin && <CommentForm onPostComment={handlePostComment} parentId={commentParent.id} />}
          </div>
        </div>
      </div >
    </div>
  );
};

export default Comment;
