const express = require('express')
const database = require('mysql2')
const {v4:uuidv4} = require('uuid')
const PORT = 6666

const app = express()


app.use(express.json())

//configure my database 
const curve = database.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'backend',

multipleStatements:true
})

//connect database
curve.connect((err,)=>{
    if (err) {
        console.log(err.message)
    } else {
        console.log('connection successful');
    }
})
 
let tableName = 'studentInfo'
app.get("/",(req,res)=>{
    console.log(req);
    res.status(200).json({message:'WELCOME TO MY BACKEND WEB APPLICATION'})
})

//create a new student
app.post('/createstudent',(req,res)=>{
    try {
        let createQuery = `INSERT INTO ${tableName} (id,name,email,stack,age,gender) VALUES (?,?,?,?,?,?)`
        //generate a unique id
        let id = uuidv4();
        const{name,email,stack,age,gender} = req.body
        let whatToCreate = [id,name,email,stack,age,gender]
        console.log(createQuery);
        curve.query(createQuery,whatToCreate,(err,data)=>{
            if (err) {
               res.status(400).json(err.sqlmessage) 
            } else {
                //get the user info from the database
                curve.query(`SELECT * FROM $ {tableName} WHERE ID = '${id}'`,(err,data)=>{
                    if (err) {
                        res.status(404).json({
                            message:'user created',newUserData:data 
                        })
                    }
                })
            }
        })
    } catch (err) {
        res.status(400).json(err.message)
    }
})

//get all students
app.get("/allstudents",(req,res)=>{
    try {
        const getAllQuery = `SELECT * FROM ${tableName}`
        curve.query(getAllQuery,(err,data)=>{
            if (err) {
                res.status(400).json(err.sqlmessage)
            } else {
                res.status(200).json({message:`kindly find below the ${data.langth} registered students`,
                data})
            }
        })
    } catch (err) {
        res.status(400).json(err.message)
    }
})

//get one student
app.get(`/getOnestudent/:studentid`,(req,res)=>{
    try {
        let studentid = req.params.studentid
        const getOneQuery = `SELECT * FROM ${tableName} WHERE id = "${studentid}"`
        curve.query(getOneQuery,(err,data)=>{
            if (err) {
                res.status(400).json(err.sqlMessage)
            } else {if(data.length===0)
                res.status(404).json({message:`Student with this ID does not exist`})
                else{ res.status(200).json({message:`Kindly find the required student below`,
                    data
                })}
            }
        })
    } catch (err) {
        res.status(400).json(err.message)
    }
})

//delete one student
app.delete(`/deleteOnestudent/:studentid`,(req,res)=>{
    try {
        let studentid = req.params.studentid
        const deleteOneQuery = `DELETE * FROM ${tableName} WHERE id = "${studentid}"`
        curve.query(deleteOneQuery,(err,data)=>{
            if (err) {
                res.status(400).json(err.sqlMessage)
            } else {if(data.length===0)
                res.status(404).json({message:`Student with this ID does not exist`})
                res.status(200).json({message:`student with this ID is deleted successfully`,
                    data
                })
            }
        })
    } catch (err) {
        res.status(400).json(err.message)
   }
})
app.listen(PORT,()=>{
    console.log(`app successfully running on port:${PORT}`)
})