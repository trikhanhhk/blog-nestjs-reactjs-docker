import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Main from './layouts/Main';
import DashBoard from './components/Dashboard';
import PublicRoute from './layouts/PublicRoute';
import PrivateRoute from './layouts/PrivateRoute';
import Layout from './layouts/Layout';
import 'react-toastify/dist/ReactToastify.css';
import ListUser from './components/user/admin/ListUser';
import AddUser from './components/user/admin/AddUser';
import AddArticle from './components/article/AddArticle';
import EditArticle from './components/article/EditArticle';
import DetailArticle from './components/article/DetailArticle';
import ArticleList from './components/article/ArticleList';
import ViewProfile from './components/user/ViewProfile';
import MainUser from './layouts/MainUser';
import SettingUser from './components/user/SettingUser';
import AddCarouselSlider from './components/Carousel/AddCarouselSlider';
import MainUserWithoutCarousel from './layouts/MainUserWithoutCarousel';
import ArticleLayout from './layouts/ArticleLayout';
import ArticleFollow from './components/article/ArticleFollow';
import SeriesList from './components/series/SeriesList';
import AddSeries from './components/series/AddSeries';
import DetailSeries from './components/series/DetailSeries';
import EditSeries from './components/series/EditSeries';
import ForbiddenPage from './layouts/error/ForbiddenPage';
import NotFoundPage from './layouts/error/NotFoundPage';
import ResultSearchEverything from './components/SearchEverything/ResultSearchEverything';
import DashboardAdmin from './components/adminDashboard/DashboardAdmin';
import ManagerArticle from './components/article/admin/ManagerArticle';
import ViewArticle from './components/article/admin/ViewArticle';
import ViewSeries from './components/series/Admin/ViewSeries';
import ManagerSeries from './components/series/Admin/ManagerSeries';
import ManagerReport from './components/Report/admin/ManagerReport';
import ForgotPassword from './components/user/forgotPassword/ForgotPassword';
import PrivateRouteAdmin from './layouts/PrivateRouteAdmin';
import ManagerCarousel from './components/Carousel/admin/ManagerCarousel';
import EditCarouselSlider from './components/Carousel/EditCarouselSlider';
import RegisterUser from './components/user/RegisterUser';
import LoginPage from './components/LoginPage';
import UserProfile from './components/user/admin/UserProfile';
import NotificationResultReport from './components/Report/NotificationResultReport';
import ManagerTags from './components/tags/ManagerTags';
import AddTag from './components/tags/AddTag';
import EditTag from './components/tags/EditTag';
import DetailReport from './components/Report/admin/DetailReport';
import PrivateRouteMasterAdmin from './layouts/PrivateRouteMasterAdmin';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<PublicRoute />}>
              <Route path="/register" element={<RegisterUser />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/login" element={<LoginPage />} />
              {/* <Route path="/test" element={<CommentSection />} /> */}
              {/* <Route path="/test2" element={<NewComment />} /> */}
              <Route element={<MainUser />}>
                <Route path="/blog/view" element={<DetailArticle />} />
              </Route>

              <Route element={<ArticleLayout />}>
                <Route path="/blog/list" element={<ArticleList />} />
                <Route path="/series/list" element={<SeriesList />} />
                <Route path="/" element={<DashBoard />} />
                <Route path="/blog/list/follow" element={<ArticleFollow />} />
                <Route path="/series/detail" element={<DetailSeries />} />
              </Route>

              <Route element={<MainUserWithoutCarousel />}>
                <Route element={<PrivateRoute />} >
                  <Route path="/blog/add" element={<AddArticle />} />
                  <Route path="/blog/edit" element={<EditArticle />} />

                  <Route path="/series/add" element={<AddSeries />} />
                  <Route path='/series/edit' element={<EditSeries />} />

                  <Route path='/user/setting' element={<SettingUser />} />
                  <Route path='/user/notification' element={<NotificationResultReport />} />
                </Route>
                <Route path="/user/profile" element={<ViewProfile />} />
                <Route path='/forbidden' element={<ForbiddenPage />} />
                <Route path='/search' element={<ResultSearchEverything />} />
              </Route>
            </Route>


            <Route element={<PrivateRouteAdmin />}>
              <Route element={<Main />}>
                <Route element={<PrivateRouteMasterAdmin />}>
                  <Route path="/admin/user/list" element={<ListUser />} />
                  <Route path="/admin/user/add" element={<AddUser />} />
                  <Route path="/admin/user/view" element={<UserProfile />} />
                </Route>
                <Route path="/admin" element={<DashboardAdmin />} />

                <Route path="/admin/blog/list" element={<ManagerArticle />} />
                <Route path="/admin/blog/view" element={<ViewArticle />} />

                <Route path='/admin/series/list' element={<ManagerSeries />} />
                <Route path="/admin/series/view" element={<ViewSeries />} />

                <Route path="/admin/slider/add" element={<AddCarouselSlider />} />
                <Route path="/admin/slider/edit" element={<EditCarouselSlider />} />
                <Route path='/admin/slider/list' element={<ManagerCarousel />} />

                <Route path='/admin/tags/list' element={<ManagerTags />} />
                <Route path='/admin/tags/add' element={<AddTag />} />
                <Route path='/admin/tags/view' element={<EditTag />} />

                <Route path="/admin/report/list" element={<ManagerReport />} />
                <Route path='/admin/report/detail' element={<DetailReport />} />
              </Route>

            </Route>
          </Route>
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
