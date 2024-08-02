import mixpanel from 'mixpanel-browser'
import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet'
import {useDispatch, useSelector} from 'react-redux'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Browse from './Components/Browse'
import OtherChannel from './Components/Channel/OtherChannel'
import Error from './Components/Error'
import Library from './Components/Library'
import LikeVideos from './Components/LikeVideos'
import Playlists from './Components/Playlists'
import SearchResults from './Components/SearchResults'
import Studio from './Components/Studio'
import Comments from './Components/Studio/Comments'
import Content from './Components/Studio/Content'
import Customization from './Components/Studio/Customization'
import VideoComments from './Components/Studio/VideoComments'
import VideoDetails from './Components/Studio/VideoDetails'
import Subscriptions from './Components/Subscriptions'
import Trending from './Components/Trending'
import VideoSection from './Components/VideoSection'
import WatchLater from './Components/WatchLater'
import ytLogo from './img/icon.png'
import {fetchUserData} from './reducer/user'

function App() {
 const User = useSelector(state => state.user.user)
 const {user} = User

 const dispatch = useDispatch()
 mixpanel.init('066ebd5744eb13b20a748ab8011a82ee')
 useEffect(() => {
  dispatch(fetchUserData())
 }, [dispatch])

 return (
  <>
   <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
   <BrowserRouter>
    <Helmet>
     <link rel="icon" type="image/x-icon" href={ytLogo} />
    </Helmet>
    <Routes>
     <Route path="/" element={<Browse />} />
     <Route path="/home" element={<Browse />} />
     <Route path="/studio" element={user ? <Studio /> : <Error />} />
     <Route path="/studio/customize" element={user ? <Customization /> : <Error />} />
     <Route path="/studio/video" element={user ? <Content /> : <Error />} />
     <Route path="/studio/comments" element={user ? <Comments /> : <Error />} />
     <Route path="/studio/video/edit/:id" element={user ? <VideoDetails /> : <Error />} />
     <Route path="/studio/video/comments/:id" element={user ? <VideoComments /> : <Error />} />
     <Route path="/likedVideos" element={user ? <LikeVideos /> : <Error />} />
     <Route path="/watchlater" element={user ? <WatchLater /> : <Error />} />

     <Route path="/library" element={user ? <Library /> : <Error />} />
     <Route path="/channel/:id" element={<OtherChannel />} />
     <Route path="/trending" element={<Trending />} />
     <Route path="/results/:data" element={<SearchResults />} />
     <Route path="/playlist/:id" element={<Playlists />} />
     <Route path="/subscriptions" element={user ? <Subscriptions /> : <Error />} />
     <Route path="/video/:id" element={<VideoSection />} />
     <Route path="/*" element={<Error />} />
    </Routes>
   </BrowserRouter>
  </>
 )
}

export default App
