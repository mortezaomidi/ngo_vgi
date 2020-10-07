import express from 'express';
import featureCtrl from '../controllers/feature.controller';
import authCtrl from '../controllers/auth.controller';
import layerCtrl from "../controllers/layer.controller";

const router = express.Router();

router.route('/api/features')
    .get(featureCtrl.list)
    .post(featureCtrl.create);

router.route('/api/features/:featureId')
    .get(authCtrl.requireSignin, featureCtrl.read)
    .put(layerCtrl.update)
    .delete(featureCtrl.remove);

router.param('featureId', featureCtrl.featureByID);

export default router;
