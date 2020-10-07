import mongoose from 'mongoose';
const schema = mongoose.Schema;

const FeatureSchema = new schema({

    name: {
        type: String,
        trim: true,
        required: 'feature name is required'
    },

    layerID :{
        type: schema.Types.ObjectID,
        ref: 'Layer',
    },

    userID :{
        type: schema.Types.ObjectID,
        ref: 'User',
    },

    geometry: {
        type: { type: String },
        coordinates: { type: Array },
    },

    attribute: [{
        name: String,
        value: String,
    }],

    valid: {
        type: Boolean,
        default: false,
    },


},{
    timestamps: true
});

export default mongoose.model('Feature', FeatureSchema)
