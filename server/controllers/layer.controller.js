import Layer from '../models/layer.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {

    const layer = new Layer(req.body);
    try {
        await layer.save();
        return res.status(200).json({
            message: "Successfully layer is added!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

/**
 * Load user and append to req.
 */
const layerByID = async (req, res, next, id) => {
    try {
        let layer = await Layer.findById(id);
        if (!layer)
            return res.status('400').json({
                error: "layer not found"
            });
        req.profile = layer;
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve layer"
        })
    }
};

const read = (req, res) => {
    return res.json(req.profile)
};

const list = async (req, res) => {
    try {
        let layers = await Layer.find().select('name geometry user createdAt updatedAt');
        res.json(layers)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

const update = async (req, res) => {
    try {
        let layer = req.profile;
        layer = extend(layer, req.body);
        layer.updated = Date.now();
        await layer.save();
        res.json(layer);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

const remove = async (req, res) => {
    try {
        let layer = req.profile;
        let deletedLayer = await layer.remove();
        res.json(deletedLayer);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

export default {
    create,
    layerByID,
    read,
    list,
    remove,
    update
};
