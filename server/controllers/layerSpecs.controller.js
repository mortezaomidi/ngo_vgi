import LayerSpecs from '../models/layerSpecs.model'
import Layer from '../models/layer.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {

    const layerSpecs = new LayerSpecs(req.body);
    try {
        await layerSpecs.save();
        return res.status(200).json({
            message: "Successfully layerSpecs is added!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

/**
 * Load layer and append to req.
 */

const layerByID = async (req, res, next, id) => {
    try {
        let layer = await Layer.findById(id);
        if (!layer)
            return res.status('400').json({
                error: "layer not found"
            });
        req.layerId = layer._id;
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve layer"
        })
    }
};

const layerSpecsId = async (req, res, next, id) => {
    try {
        let layerSpecs = await LayerSpecs.findById(id);
        if (!layerSpecs)
            return res.status('400').json({
                error: "layerSpecs not found"
            });
        req.layerSpecs = layerSpecs;
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve layerSpecs"
        })
    }
};


const read = async (req, res) => {
    try {
        let layerSpecs = await LayerSpecs.find({layer : req.layerId}).select('name');
        return res.json(layerSpecs)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

const remove = async (req, res) => {
    try {
        let layerSpecs = req.layerSpecs;
        let deletedLayer = await layerSpecs.remove();
        res.json(deletedLayer);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

const removeLayerSpecs = async (req, res) => {
    try {
        let layerId = req.layerId;
        let layerSpecs = await LayerSpecs.find({layer: layerId}).remove();
        res.json(layerSpecs);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

export default {
    create,
    layerByID,
    layerSpecsId,
    read,
    remove,
    removeLayerSpecs
};
