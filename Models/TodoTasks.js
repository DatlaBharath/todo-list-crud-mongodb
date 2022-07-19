const mongoose = require('mongoose');

/* Defining the schema for our model */
const TasksSchema = new mongoose.Schema({
    title: 
    {
        type: String,
        required: true
    },
    content: String,
    date:
    {
        type: Date,
        default: Date.now
    }
});

/* Creating a mongoose model and a collection */
const Tasks = mongoose.model('Task', TasksSchema);

/* Exporting the model */
module.exports = Tasks;