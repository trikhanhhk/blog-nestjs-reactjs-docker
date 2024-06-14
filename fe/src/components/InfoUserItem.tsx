import React, { useEffect, useState } from 'react'
import UpDownVote from './UpDownVote'
import LinkToProfile from './user/LinkToProfile';

interface Props {
  idData: any;
  vote: number
  type: "comment" | "article" | "series";
  avatarPath: string
  name: string;
  nameDisplay: boolean;
  userId: number
}

const InfoUserItem: React.FC<Props> = (props) => {
  const { idData, vote, type, avatarPath, name, nameDisplay, userId } = props;
  return (
    <div className="flex-shrink-0 comment-info">
      <div className="image-container">
        <img className="img-sm rounded-circle"
          src={avatarPath ? `${process.env.REACT_APP_URL_MINIO}${avatarPath}` : "/assets/img/profile-photos/5.png"} />
      </div>
      <div className="updownvote-container">
        <UpDownVote isDisabled={false} idData={idData} vote={vote} typeItem={type} />
      </div>
      {nameDisplay &&
        <LinkToProfile userId={userId} userName={name} />
      }
    </div>
  )
}

export default InfoUserItem