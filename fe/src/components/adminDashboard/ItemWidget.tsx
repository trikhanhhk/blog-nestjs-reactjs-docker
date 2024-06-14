import React, { useEffect, useState } from 'react'
import { getCountUser } from '../../services/UserService';
import { BookOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { getCountArticle } from '../../services/ArticleService';
import { getCountSeries } from '../../services/SeriesSerivce';
import * as actions from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

interface Props {
  type: "user" | "article" | "series";
  time?: "week" | "month" | "year" | undefined;
  from?: string | undefined;
  to?: string | undefined;
  background?: string;
  href?: string;
}

const ItemWidget: React.FC<Props> = (props) => {
  const { type, time, from, to, background, href } = props;

  const dispatch = useDispatch();

  const [count, setCount] = useState<number>(0);
  const [title, setTitle] = useState<string>('');

  const [icon, setIcon] = useState<JSX.Element>(<></>);

  useEffect(() => {
    const fetchData = async () => {
      let fetchApi = null
      if (type === "article") {

        fetchApi = getCountArticle;
        setTitle("Bài viết");
        setIcon(() => <BookOutlined style={{ fontSize: "30px" }} />)

      } else if (type === "user") {

        fetchApi = getCountUser;
        setTitle("Người dùng");
        setIcon(() => (<UserOutlined style={{ fontSize: "30px" }} />));

      } else {

        fetchApi = getCountSeries;
        setTitle("Series");
        setIcon(() => <UnorderedListOutlined style={{ fontSize: "30px" }} />)

      }

      if (!fetchApi) return;

      dispatch(actions.controlLoading(true));
      const response = await fetchApi(time, from, to);
      dispatch(actions.controlLoading(false));

      if (!response) return;

      setCount(response.data.data)
    }

    fetchData();

  }, [type]);

  return (
    <div className="col-sm-6 col-lg-3">
      <div className={`card ${background} text-white mb-3 mb-xl-3`}>
        <Link style={{ textDecoration: "none", color: "#fff" }} to={href ? href : '#'}>
          <div className="card-body py-3 d-flex align-items-stretch">
            <div className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-start">
              {icon}
            </div>
            <div className="flex-grow-1 ms-3">
              <h5 className="h2 mb-0">{count}</h5>
              <p className="mb-0">{title}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ItemWidget
