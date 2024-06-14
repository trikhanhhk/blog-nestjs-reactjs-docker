import React from 'react';
import { SeriesData } from '../../types/SeriesData';
import { Link, useNavigate } from 'react-router-dom';
import LinkToProfile from '../user/LinkToProfile';
import { formatDateTime } from '../../untils/time-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faEye } from '@fortawesome/free-solid-svg-icons';

interface Props {
  seriesData: SeriesData;
}

const SeriesItem: React.FC<Props> = (props) => {
  const { seriesData } = props;
  const avatarPath = seriesData.author.avatarPath;

  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: "10px" }} className="d-flex flex-start">
      <img className="rounded-circle shadow-1-strong me-3" src={avatarPath ? `${process.env.REACT_APP_URL_MINIO}${avatarPath}` : "/assets/img/profile-photos/5.png"} alt="avatar" width="40" height="40" />
      <div className="flex-grow-1 flex-shrink-1">
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <LinkToProfile email={seriesData.author.email} userId={seriesData.author.id} userName={`${seriesData.author.first_name} ${seriesData.author.last_name}`} />
              <span className="small"> {formatDateTime(seriesData.createdAt)}</span>
            </div>
            <div className='points'>
              <span className='text-muted' style={{ marginRight: "30px" }}><FontAwesomeIcon icon={faEye} />{seriesData.view}</span>
              <div className='carets'>
                <FontAwesomeIcon icon={faCaretUp} />
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
              <span className='text-muted'>{seriesData?.vote || 0}</span>
            </div>
          </div>
          <div onClick={() => navigate(`/series/detail?seriesId=${seriesData.id}`)}>
            <p className="text-capitalize fs5 my-3 fw-bolder article-link">{seriesData.title}</p>
          </div>
        </div>
      </div>
    </div >
  )
}

export default SeriesItem
