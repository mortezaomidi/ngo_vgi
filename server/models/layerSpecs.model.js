import mongoose from 'mongoose';
const schema = mongoose.Schema;

const LayerSpecsSchema = new schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    layer: {
        type: schema.Types.ObjectID,
        ref: 'Layer',
    },
},{
    timestamps: true
});

export default mongoose.model('LayerSpecs', LayerSpecsSchema)
