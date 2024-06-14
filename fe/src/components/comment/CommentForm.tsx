import React, { useState } from 'react';
import { getCurrentLogin } from '../../services/AuthService';

export type onPostCommentFunction = (content: string, parentId: number | null) => void;

interface Props {
  onPostComment: onPostCommentFunction;
  parentId?: number;
}

const CommentForm: React.FC<Props> = (props) => {
  const { onPostComment, parentId } = props;

  const [comment, setComment] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    onPostComment(comment, parentId ? parentId : null);
    setComment('');
  };

  const currentLogin = getCurrentLogin();

  return (
    <>
      {getCurrentLogin().status === 1 ?
        <div className="card-footer py-3 border-0" style={{ backgroundColor: '#f8f9fa' }}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-start w-100">
              <img className="rounded-circle shadow-1-strong me-3"
                src={
                  currentLogin && currentLogin.avatarPath ? `${process.env.REACT_APP_URL_MINIO}${currentLogin.avatarPath}` : "/assets/img/profile-photos/5.png"
                }
                alt="avatar" width="40" height="40" />
              <div className="form-outline w-100">
                <textarea placeholder={`Bình luận với tư cách là ${currentLogin.first_name} ${currentLogin.last_name}`} className="form-control" rows={4} style={{ background: "#fff" }} value={comment} onChange={handleChange}></textarea>
              </div>
            </div>
            <div className="float-end mt-2 pt-1">
              <button type="submit" className="btn btn-primary btn-sm">Bình luận</button>
            </div>
          </form>
        </div>
        :
        <p style={{ color: "red" }}>Tài khoản của bạn đang bị khóa tính năng bình luận, vui lòng liên hệ quản trị viên để biết lý do</p>}
    </>
  );
};

export default CommentForm;
