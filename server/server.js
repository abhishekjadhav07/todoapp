const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4 : uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())

app.use(express.json())

// get all todos

app.get('/todos1/:userEmail' , async (req,res) => {
    const { userEmail }= req.params
   // console.log(userEmail)

    try{
        const todos1 = await pool.query('SELECT * FROM todos1 WHERE user_email = $1',[userEmail])
        res.json(todos1.rows)
    }catch(err){
        console.error(err)
    }
})


app.post('/todos1' , async (req,res) => {

    const {user_email , title , progress , date} = req.body
    console.log(user_email , title , progress , date)
    const id = uuidv4()
    try {

        const newToDo = await pool.query(`INSERT INTO todos1(id,user_email,title,progress,date) VALUES ($1,$2,$3,$4,$5)` , 
        [id, user_email , title , progress , date])

        res.json(newToDo)



    }catch(err){
        console.error(err)
    }
})



//edit a todo
app.put('/todos1/:id' , async (req, res) => {
    const { id } = req.params
    const { user_email , title , progress , date } = req.body

    try {

        const edittodo = await pool.query(`UPDATE todos1 SET user_email = $1 , title = $2 , progress = $3 , date = $4  WHERE id = $5 ;`,
        [user_email , title , progress, date , id] )
        res.json(edittodo)

    }catch(err){
        console.error(err)
    }
})


app.delete('/todos1/:id' , async (req,res) => {
    const { id } = req.params

    try {
        const deleteTodo = await pool.query(`DELETE FROM todos1 WHERE id = $1; ` , [id])
        res.json(deleteTodo)

    }catch(err){
        console.error(err)
    }
})

//SIGN UP

app.post('/signup' , async (req , res) => {
     const {email,password} = req.body

     const salt = bcypt.genSaltSync(10)
     const hashedPassword = bcypt.hashSync(password , salt)
     

    try{

    const signUp = await pool.query(`INSERT INTO users1 (email, hased_password) VALUES ($1 , $2)` , 
        [email,hashedPassword])

    const token = jwt.sign({email} , 'secret' , {expiresIn : '1hr'})

    res.json({email , token})

    }catch(err){
        console.error(err)
        if(err){
            res.json({detail: err.detail})
        }
    }


})

//log in

app.post('/login' , async (req , res) => {

    const {email,password} = req.body
    try{
        
        const users = await pool.query('SELECT * FROM users1 WHERE email = $1' , [email])
        if(!users.rows.length) return res.json({detail : 'User does not exits !'})

        const suc = await bcypt.compare(password , users.rows[0].hased_password)
        const token = jwt.sign({email} , 'secret' , {expiresIn : '1hr'})

        if(suc){
            res.json({ 'email' : users.rows[0].email , token})
        }else{
            res.json({detail: "Login Failed"})
        }

    }catch(err){
        console.error(err)
    }


})


app.listen(PORT , ( )=> console.log(`Server running on PORT  ${PORT}`))



