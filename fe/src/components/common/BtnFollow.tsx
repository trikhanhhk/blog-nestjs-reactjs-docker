import React, { useEffect, useState } from 'react'
import { checkFollowUser, handleFollowUser } from '../../services/UserService'
import { getToken } from '../../services/AuthService'
import { useDispatch } from 'react-redux'
import * as action from '../../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Spinner } from 'react-bootstrap';

interface Props {
  userId: number
}

const BtnFollow: React.FC<Props> = (props) => {
  const { userId } = props;
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    checkFollowUser(userId).then((response) =>
      setIsFollow(response ? response.data.data : false));
  }, [userId]);

  const handleFollow = async () => {
    if (getToken()) {
      setIsLoading(true);
      await handleFollowUser(userId, isFollow ? "unfollow" : "follow");
      setIsLoading(false);
      setIsFollow(prevIsFollow => !prevIsFollow);
    } else {
      dispatch(action.showLogin(true));
    }
  }

  return (
    <Button
      onClick={handleFollow}
      className={isFollow ? "btn btn-info" : "btn btn-light"}
      style={{ height: '33px', padding: '3px', fontSize: '12px', minWidth: "107px" }}>
      {isLoading ? <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> :
        isFollow ? <span><FontAwesomeIcon icon={faCheck} /> Đang theo dõi</span> : <span><FontAwesomeIcon icon={faPlus} /> Theo dõi</span>
      }
    </Button >
  )
}

export default BtnFollow