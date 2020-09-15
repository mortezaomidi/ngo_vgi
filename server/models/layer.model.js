import mongoose from 'mongoose';
const schema = mongoose.Schema;

const LayerSchema = new schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    geometry: {
        type: String,
        trim: true,
        required: 'Name is required'
    },

    user :{
        type: schema.Types.ObjectID,
        ref: 'User',
    },

},{
    timestamps: true
});

export default mongoose.model('Layer', LayerSchema)
