import express from 'express';
import layerCtrl from '../controllers/layer.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/layers')
    .get(layerCtrl.list)
    .post(layerCtrl.create);

router.route('/api/layers/:layerId')
    .get(authCtrl.requireSignin, layerCtrl.read)
    .put(layerCtrl.update)
    .delete(layerCtrl.remove);

router.param('layerId', layerCtrl.layerByID);

export default router;
