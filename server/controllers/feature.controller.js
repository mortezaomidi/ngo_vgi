import Feature from '../models/feature.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {

    const feature = new Feature(req.body);
    try {
        await feature.save();
        return res.status(200).json({
            message: "Successfully feature is added!"
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
const featureByID = async (req, res, next, id) => {
    try {
        let feature = await Feature.findById(id);
        if (!feature)
            return res.status('400').json({
                error: "feature not found"
            });
        req.profile = feature;
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve feature"
        })
    }
};

const read = (req, res) => {
    return res.json(req.profile)
};

const list = async (req, res) => {
    try {
        let features = await Feature.find().select('name layerID userID geometry.type geometry.coordinates attribute valid createdAt updatedAt');
        res.json(features)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

const update = async (req, res) => {
    try {
        let feature = req.profile;
        feature = extend(feature, req.body);
        feature.updated = Date.now();
        await feature.save();
        res.json(feature);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

const remove = async (req, res) => {
    try {
        let feature = req.profile;
        let deletedFeature = await feature.remove();
        res.json(deletedFeature);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

export default {
    create,
    featureByID,
    read,
    list,
    remove,
    update
};
