import express from 'express';
import layerCtrl from '../controllers/layerSpecs.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/layersSpecs/:layerId')
    .get(authCtrl.requireSignin, layerCtrl.read)
    .post(layerCtrl.create)
    .delete(layerCtrl.removeLayerSpecs);

router.route('/api/layersSpecs/:layerSpecsId')
    .delete(layerCtrl.remove);

router.param('layerId', layerCtrl.layerByID);
router.param('layerSpecsId', layerCtrl.layerSpecsId);

export default router;
