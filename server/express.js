import express from 'express';
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'

import devBundle from './devBundle'
import Template from './../template';

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import layerRoutes from './routes/layer.routes';
import layerSpecsRoutes from './routes/layerSpecs.routes';
import featureRoutes from './routes/feature.routes';



const CURRENT_WORKING_DIR = process.cwd();

const app = express();

//comment out before building for production
devBundle.compile(app);
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());


// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "worker-src 'self' blob:");
    return next();
});

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', layerRoutes);
app.use('/', layerSpecsRoutes);
app.use('/', featureRoutes);



app.get('*', (req,res) => {
    res.status(200).send(Template());
});



// Catch unauthorised errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message})
    }else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
});


export default app
