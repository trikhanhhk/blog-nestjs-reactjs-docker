import React, { useEffect, useState } from 'react'
import { getVotedComment } from '../services/CommentService';
import socket from '../helpers/socketFactory';
import { getVotedArticle } from '../services/ArticleService';
import { getToken } from '../services/AuthService';
import * as action from '../redux/actions'
import { useDispatch } from 'react-redux';
import { getVotedSeries } from '../services/SeriesSerivce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDown, faCircleUp } from '@fortawesome/free-solid-svg-icons';

interface Props {
  idData: any,
  vote: number,
  typeItem: "comment" | "article" | "series",
  isDisabled: boolean
}

const UpDownVote: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const [total, setTotal] = useState<number>(props.vote);

  const [dataId, setDataId] = useState<number>(props.idData)

  const [isUpVote, setIsUpVote] = useState<boolean>(false);

  const [isDownVote, setIsDownVote] = useState<boolean>(false);

  const [typeItem, setTypeItem] = useState<"comment" | "article" | "series">(props.typeItem);

  const [stateVote, setStateVote] = useState<"upvote" | "downvote" | "-">("-");

  useEffect(() => {
    const fetchVoteData = async (getType: "article" | "comment" | "series", getId: number) => {
      let voteApi;
      if (getType === "comment") {
        voteApi = getVotedComment;
      } else if (getType === "article") {
        voteApi = getVotedArticle;
      } else if (getType === "series") {
        voteApi = getVotedSeries;
      } else {
        throw new Error("Invalid type specified.");
      }

      const response = await voteApi(getId);
      if (response) {
        const vote = response.data.data;
        if (vote) {
          if (vote.voteType === "upvote") {
            setStateVote("upvote");
            setIsUpVote(true);
            setIsDownVote(false);
          } else {
            setStateVote("downvote");
            setIsUpVote(false);
            setIsDownVote(true);
          }
        } else {
          setStateVote("-");
          setIsUpVote(false);
          setIsDownVote(false);
        }
      }
    };

    setDataId(props.idData)

    fetchVoteData(typeItem, dataId);
    console.log("typeItem", typeItem);
    socket.on("receive_vote_" + typeItem + "_" + dataId, handleReceiveVote);
    return () => {
      socket.off("receive_vote_" + typeItem + "_" + dataId, handleReceiveVote)
    };
  }, []);

  const handleReceiveVote = async (data: any) => {
    const { type, state } = data;

    // await handleStateReceive(data);

    if (type === state) {
      setIsUpVote(false);
      setIsDownVote(false);
      setStateVote("-");
      setTotal((prevTotal) => {
        return type === "upvote" ? prevTotal - 1 : prevTotal + 1
      });
    }

    else if (state === "-" && type === "upvote") {
      setIsUpVote(true);
      setIsDownVote(false);
      setStateVote("upvote");
      setTotal(prevTotal => prevTotal + 1);
    }

    else if (state === "-" && type === "downvote") {
      setIsUpVote(false);
      setIsDownVote(true);
      setStateVote("downvote");
      setTotal(prevTotal => prevTotal - 1);
    }

    else if (state === "downvote" && type === "upvote") {

      setIsUpVote(true);
      setIsDownVote(false);
      setStateVote("upvote");
      setTotal(prevTotal => prevTotal + 2);

    }

    else if (state === "upvote" && type === "downvote") {
      setIsUpVote(false);
      setIsDownVote(true);
      setStateVote("downvote");
      setTotal(prevTotal => prevTotal - 2);

    }
  }

  const handleVote = (btn: "up" | "down") => {
    if (!getToken()) {
      dispatch(action.showLogin(true));
    } else {
      const type = btn === "up" ? "upvote" : "downvote"
      const data = {
        type: type,
        dataId: dataId,
        state: stateVote
      }

      console.log("data send from client", data);

      let message = "vote_comment";
      if (typeItem === "article") {
        message = "vote_article";
      } else if (typeItem === "series") {
        message = "vote_series";
      }

      console.log("message socket emit", message);

      const delayDebounce = setTimeout(() => {
        socket.connect().emit(
          message, data);
      }, 50);
      return () => clearTimeout(delayDebounce);
    }
  }

  return (
    <>
      <span className='vote-item'>
        <FontAwesomeIcon icon={faCircleUp}
          onClick={() => {
            !props.isDisabled && handleVote("up")
          }}
          style={{
            color: `${isUpVote ? "blue" : "gray"}`,
            fontSize: "1rem",
            cursor: "pointer"
          }}

          className='vote-item-icon'
        />

        <span>{total}</span>

        <FontAwesomeIcon icon={faCircleDown}
          onClick={() => {
            !props.isDisabled && handleVote("down")
          }}
          style={{
            color: `${isDownVote ? "blue" : "gray"}`,
            fontSize: "1rem",
            cursor: "pointer"
          }}

          className='vote-item-icon'
        />
      </span>
    </>
  )
}

export default UpDownVote