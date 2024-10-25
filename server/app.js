//Main application setUp
const express = require('express');
require('dotenv').config();
const cors= require('cors');
const bodyParser = require('body-parser');
//External import
const loginRoutes=require('./routes/auth/loginRoute');
const ActiviseRouters=require('./CrudAPI/Activitise');
const EventsRouters=require('./CrudAPI/Event');
const SliderRouters=require('./CrudAPI/Slider');
const HomeRouters = require('./CrudAPI/Home');
const AboutRouters = require('./CrudAPI/About');
const NewsRouters = require('./CrudAPI/News');
const MahogonyRouters = require('./CrudAPI/Malign-Tree/Mahogony');
const RainTreeRouters = require('./CrudAPI/Malign-Tree/Rain-Tree');
const ShishamTreeRouters = require('./CrudAPI/Malign-Tree/Shisham-Tree');
const AkashMoniRouters = require('./CrudAPI/Malign-Tree/Akash-Moni');
const EucalytusRouters = require('./CrudAPI/Malign-Tree/Eucalyptus');
const ImageRouters = require('./CrudAPI/Gallary/Image');
const VideosRouters = require('./CrudAPI/Gallary/Video');
const FounderRouters = require('./CrudAPI/Organization/founder');
const ExecutiveRouters =require('./CrudAPI/Organization/executive');
const GeneralRouters = require('./CrudAPI/Organization/general');
//configaration......
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));
app.use(express.static("uploadsGallary"));
app.use(express.static("uploadsOrganization"));
// routing element......
app.use('/auth',loginRoutes);
app.use('/api',ActiviseRouters,EventsRouters,SliderRouters,HomeRouters,AboutRouters,NewsRouters);
app.use('/malign',MahogonyRouters,RainTreeRouters,ShishamTreeRouters,AkashMoniRouters,EucalytusRouters);
app.use('/gallary',ImageRouters,VideosRouters );
app.use('/organization',FounderRouters,ExecutiveRouters ,GeneralRouters  );


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


