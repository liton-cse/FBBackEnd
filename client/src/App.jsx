import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./components/login_page/Login";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Activitise from "./components/pages/Activitise";
import News from "./components/pages/News";
import Event from "./components/pages/Event";
import AkashMoni from "./components/malign-tree/Akash-Moni";
import Eucalyptus from "./components/malign-tree/Eucalyptus";
import Mahogony from "./components/malign-tree/Mahogony";
import ShishamTree from "./components/malign-tree/Shisham-Tree";
import RainTree from "./components/malign-tree/Rain-Tree";
import Images from "./components/gallary/Image";
import Videos from "./components/gallary/Video";
import Founder from "./components/oranization/Founder";
import Executive from "./components/oranization/Executive";
import General from "./components/oranization/General";
import Slider from "./components/pages/Slider"
//import ProtectedRoute from "./utils/ProtecredRoute";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<LoginForm />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/slider" element={<Slider />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/activitise" element={<Activitise />} />
        <Route exact path="/news" element={<News />} />
        <Route exact path="/events" element={<Event />} />
       <Route exact path="/images-gallery" element={<Images />} />
        <Route exact path="/videos-gallery" element={<Videos />} />
        <Route path="akash-moni" element={<AkashMoni/>}/>  
        <Route path="eucalyptus" element={<Eucalyptus/>}/>  
        <Route path="Mahogony" element={<Mahogony/>}/>  
        <Route path="shisham-tree" element={<ShishamTree/>}/>  
        <Route path="rain-tree" element={<RainTree/>}/>  
        <Route path="/founder-member" element={<Founder/>}/>  
        <Route path="/executive-member" element={<Executive/>}/> 
        <Route path="/general-member" element={<General/>}/>
      </Routes>
    </>
  );
}
export default App;
