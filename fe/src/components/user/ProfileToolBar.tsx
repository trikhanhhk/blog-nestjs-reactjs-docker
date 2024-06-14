import React, { useEffect, useState } from 'react'
import BtnFollow from '../common/BtnFollow'
import { UserData } from '../../types/UserData';
import { getUserProfileById } from '../../services/UserService';
import LinkToProfile from './LinkToProfile';
import { getCurrentLogin, getToken } from '../../services/AuthService';
import AvatarUploadModal from './AvatarUploadModal';
import AddEditSocialModal from './AddEditSocialModal';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faCamera, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

interface Props {
  userId: number;
}

const ProfileToolBar: React.FC<Props> = (props) => {
  const { userId } = props;

  const [userData, setUserData] = useState<UserData>();

  const [isOpenAvatarUpload, setIsAvatarUpload] = useState<boolean>(false);

  const [isOpenFormSocial, setIsOpenFormSocial] = useState<boolean>(false);

  const [avatarPath, setAvatarPath] = useState<string | null>(null);

  const [isUserLogin, setIsLogin] = useState<boolean>(false);

  const [facebookLink, setFacebookLink] = useState<string | null>(null);

  const [discordLink, setDiscordLink] = useState<string | null>(null);

  const [githubLink, setGithubLink] = useState<string | null>(null);

  useEffect(() => {
    if (userId && userId != -1) {
      getUserProfileById(userId).then((response) => {
        const data = response.data.data;
        setUserData(data);

        setAvatarPath(data.avatarPath);

        setFacebookLink(data.facebookLink);

        setDiscordLink(data.discordLink);

        setGithubLink(data.githubLink);

        setIsLogin(getCurrentLogin() && getCurrentLogin().id == (data?.id || -1));
      });
    }
  }, [userId]);

  const avatarUploadSuccess = (path: string | null) => {
    setIsAvatarUpload(false);
    const userLogin = getCurrentLogin();
    if (path != null) {
      setAvatarPath(path);
      userLogin.avatarPath = path;
      localStorage.setItem("userData", JSON.stringify(userLogin));
      window.location.reload();
    }
  }

  const updateSocial = (data: any) => {
    if (data != null) {
      setAvatarPath(data.avatarPath);

      setFacebookLink(data.facebookLink);

      setDiscordLink(data.discordLink);

      setGithubLink(data.githubLink);
    }
  }

  return (
    <>
      <div style={{ backgroundColor: "#d1e6e5" }} className="card-header toolbar">
        <div className="content__wrap d-md-flex align-items-start toolbar-start">
          <figure className="m-0">
            <div className="d-inline-flex align-items-center position-relative pt-xl-5 mb-3">
              <div className="flex-shrink-0" style={{ position: 'relative' }}>
                <img className="img-xl rounded-circle" src={avatarPath ? `${process.env.REACT_APP_URL_MINIO}${avatarPath}` : "/assets/img/profile-photos/5.png"} alt="Profile Picture" loading="lazy" />
                {isUserLogin &&
                  <div className="overlay">
                    <Button onClick={() => setIsAvatarUpload(true)} className="camera-button">
                      <FontAwesomeIcon style={{ fontSize: '24px' }} icon={faCamera} />
                    </Button>
                  </div>
                }
              </div>
              <div className="flex-grow-1 ms-4">
                <h4>{`${userData?.first_name} ${userData?.last_name}`}</h4>
                <p className="text-muted m-0">{userData?.email}</p>
                <p className="text-muted m-0">{userData?.career}</p>

                {/* Social network button */}
                <div className="mt-3 text-reset">
                  {facebookLink && <a href={facebookLink} target="_blank" className="btn btn-icon btn-hover bg-blue-700 text-white">
                    <FontAwesomeIcon style={{ fontSize: '24px' }} icon={faFacebook} />
                  </a>}

                  <a href={`mailto:${userData?.email}`} target="_blank" className="btn btn-icon btn-hover bg-blue-400 text-white">
                    <FontAwesomeIcon style={{ fontSize: '24px' }} icon={faGoogle} />
                  </a>

                  {githubLink && <a href={githubLink} target="_blank" className="btn btn-icon btn-hover bg-red text-white">
                    <FontAwesomeIcon style={{ fontSize: '24px' }} icon={faGithub} />
                  </a>}

                  {discordLink && <a href={discordLink} target='_blank' className="btn btn-icon btn-hover bg-orange text-white">
                    <FontAwesomeIcon style={{ fontSize: '24px' }} icon={faDiscord} />
                  </a>}
                  {isUserLogin &&
                    <Button onClick={() => setIsOpenFormSocial(true)} className='btn btn-hover' title='Thêm & chỉnh sửa'>
                      <FontAwesomeIcon style={{ fontSize: '24px' }} icon={faPlusCircle} />
                    </Button>
                  }
                </div>
                {/* END : Social network button */}

              </div>
            </div>

            {userData?.maxim && <>
              <blockquote className="blockquote">
                <p>{userData.maxim}</p>
              </blockquote>
              <figcaption className="blockquote-footer mb-xl-0">
                {`${userData?.first_name} ${userData?.last_name}`}
              </figcaption>
            </>}
          </figure>
        </div >
        <div className="d-inline-flex justify-content-end pt-xl-5 gap-2 ms-auto toolbar-end">
          {isUserLogin ?
            <Link to={`/user/setting?userId=${getCurrentLogin().id}`} className="btn btn-success text-nowrap">Chỉnh sửa thông tin cá nhân</Link>
            : <BtnFollow userId={userData?.id || -1} />
          }
        </div>
      </div >

      {getToken() &&
        <>
          <AvatarUploadModal isOpen={isOpenAvatarUpload} onClose={(path) => avatarUploadSuccess(path)} />
          <AddEditSocialModal isOpen={isOpenFormSocial} data={{ facebookLink, githubLink, discordLink }} onClose={(data) => {
            updateSocial(data)
            setIsOpenFormSocial(false);
          }
          } />
        </>
      }
    </>
  )
}

export default ProfileToolBar
