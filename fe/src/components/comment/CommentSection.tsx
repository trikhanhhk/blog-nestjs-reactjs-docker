import React, { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import { CommentData, CommentItem } from '../../types/CommentData';
import { PaginationData } from '../../types/Pagination';
import Comment from './Comment';
import { getListComment, getListCommentChild, saveComment } from '../../services/CommentService';
import socket from '../../helpers/socketFactory';
import { functionChange } from '../../type';
import { getToken } from '../../services/AuthService';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';

interface Props {
  articleId: number;
  setTotalComment: functionChange;
}
const CommentSection: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { articleId, setTotalComment } = props;

  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentPage, setCommentPage] = useState<PaginationData>();
  useEffect(() => {
    if (articleId) {
      const fetchComments = async () => {
        getListComment({ articleId }).then((response) => {
          const data: CommentData[] = response.data.data;
          const pagination = response.data.pagination;
          console.log("from api", data);
          setCommentPage(pagination);
          setComments(data);
          setTotalComment(pagination.itemCount);
        });
      }
      fetchComments();
    }
  }, []);

  useEffect(() => {
    socket.on('receive_comment_' + articleId, handleNewComment);
    return () => {
      socket.off('receive_comment_' + articleId, handleNewComment);
    };

  }, []);


  const handleNewComment = (newComment: CommentItem) => {
    const newCommentData: CommentData = {
      comment: newComment,
      paginationChild: {
        itemCount: 0,
        itemsPerPage: 10,
        lastPage: 1,
        currentPage: 1,
        nextPage: 0,
        prevPage: 0
      },
      children: []
    };

    if (newComment.parentId) {
      setComments(prevComments => {
        const parentIndex = prevComments.findIndex(comment => comment.comment.id === newComment.parentId);
        console.log("parentIndex", parentIndex);
        if (parentIndex !== -1) {
          const updatedComments = [...prevComments];
          const updatedParentComment = { ...updatedComments[parentIndex] };
          updatedParentComment.children = [...updatedParentComment.children, newComment];
          updatedComments[parentIndex] = updatedParentComment;
          updatedComments[parentIndex].paginationChild.itemCount = updatedComments[parentIndex].paginationChild.itemCount + 1
          return updatedComments;
        }

        return prevComments;
      });
    } else {
      setComments(prevComments => {
        console.log("prevComments", prevComments);
        return [...prevComments, newCommentData]
      });
    }
  };

  const onPostComment = (content: string, parentId: number | null) => {
    handleComment(content, parentId);
  }

  const handleComment = async (content: string, parentId: number | null) => {
    const comment = {
      content: content,
      articleId: articleId,
      parentId: parentId
    }
    const newComment = await saveComment(comment);
    console.log("Sending comment ...");
    socket.connect().emit("send_comment", { comment: newComment.data.data });
  }

  const handleReadMore = () => {
    const currentPage = commentPage?.currentPage || 0;
    getListComment({ articleId: articleId, page: currentPage + 1 }).then((response) => {
      const data = response.data;
      setCommentPage(data.pagination);
      setComments(prevComments => [...prevComments, ...data.data]);
    });
  }

  const handleReadMoreChildComment = (nexPage: number, parentId: number) => {
    getListCommentChild(parentId, nexPage).then((response) => {
      console.log(response.data.pagination);
      setComments(prevComments => {
        const parentIndex = prevComments.findIndex(comment => comment.comment.id === parentId);
        console.log("parentIndex", parentIndex);
        if (parentIndex !== -1) {
          const updatedComments = [...prevComments];
          const updatedParentComment = { ...updatedComments[parentIndex] };
          const pagingUpdate = { ...response.data.pagination }
          if (updatedComments[parentIndex].children.length === 1) {
            updatedParentComment.children = [...response.data.data];
          } else {
            updatedParentComment.children = [...updatedParentComment.children, ...response.data.data];
          }
          updatedComments[parentIndex] = updatedParentComment;
          updatedComments[parentIndex].paginationChild = pagingUpdate
          return updatedComments;
        }

        return prevComments;
      });
    });
  }

  const isLogin = getToken();

  return (
    <section className="">
      <div className="">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body p-4">
                <h5 className="card-title">{(commentPage?.itemCount && commentPage?.itemCount > 0) || comments.length > 0 ? `Có ${commentPage?.itemCount ? commentPage?.itemCount : ''} bình luận` : "Chưa có bình luận"}</h5>

                <div className="row">
                  <div className="col">
                    {comments.map((comment, index) => (
                      <Comment handleReadMoreComment={handleReadMoreChildComment} onPostComment={onPostComment} key={index} comment={comment} />
                    ))}
                  </div>
                </div>
                {
                  (commentPage?.nextPage) ? <a className="btn-link" onClick={handleReadMore}>Xem thêm bình luận</a> : ""
                }
                {isLogin ? <CommentForm onPostComment={onPostComment} /> : <a href='#' onClick={() => dispatch(actions.showLogin(true))}>Đăng nhập để bình luận</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
