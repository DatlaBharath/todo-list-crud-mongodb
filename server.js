const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tasks = require('./Models/TodoTasks.js');
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;


app.set('view engine', 'ejs');
app.use(express.static('Styles'));
app.use(express.urlencoded({extended: true}));


/* Connecting to the database */
const dburl = process.env.DATABASE_URL;
mongoose.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(console.log("Connected to the database!"))
.catch( (err) => console.log(err) );

/*-----------------------------------------------------------------------------------------------------*/

                                          /* <---ROUTES---> */

/* Get Method */
/* Rendering the ejs file & Getting the list of current tasks */
app.get('/', (req, res) => {

    Tasks.find({}, (err, tasks) => {
        if(err){
            console.log("ERROR!");
            res.status(500).send(err);
        }
        else{
            res.render('index.ejs', {TodoTasks: tasks});
        }
    });
});

/*-----------------------------------------------------------------------------------------------------*/

/* Post Method */
/* Storing the created tasks in the database */
app.post('/', async (req, res) => {

    const record = new Tasks(
        {
            title: req.body.title,
            content: req.body.content
        }
    );
    await record.save()
    .then(console.log("Successfully added new task!"))
    .catch( (err) => res.status(500).send(err) );

    /* Redirecting the user back to home page */
    res.redirect('/');
});

/*-----------------------------------------------------------------------------------------------------*/

/* Edit Task Method */
/* Opening Edit section for the clicked task & also displaying the remaining tasks */
app
    .route('/edit/:id')
    .get((req, res) => {
        /* Task Id */
        const id = req.params.id;

        /* Other Tasks */
        Tasks.find({}, (err, tasks) => {
            if(err){
                console.log("ERROR!");
                res.status(500).send(err);
            }
            else{
                res.render('edit.ejs', {TodoTasks: tasks, TaskId: id});
            }
        });
    })
    .post(async (req, res) => {
        /* Task Id */
        const id = req.params.id;

        /* Finding the item by id and updating it in the database */
        await Tasks.findByIdAndUpdate(id, {
            title: req.body.title,
            content: req.body.content
        })
        .then(console.log("Successfully updated the task!"))
        .catch((err) => {
            res.status(500).send(err);
        });

        /* Redirecting the user back to home page */
        res.redirect('/');
    });

/*-----------------------------------------------------------------------------------------------------*/

/* Delete Task Method */
app
    .route('/delete/:id')
    .get(async (req, res) => {
        /* Task Id */
        const id = req.params.id;
        await Tasks.findByIdAndRemove(id)
        .then(console.log("Successfully deleted the task!"))
        .catch((err) => {
            res.status(500).send(err);
        });

        /* Redirecting the user back to home page */
        res.redirect('/');
    })

/*-----------------------------------------------------------------------------------------------------*/

/* Listening to a port */
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}..`);
});