let express= require ('express')
let app= express()
let bodyParser = require('body-parser')
let mysql = require('mysql')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// homepage route
app.get('/',(req,res)=>{
    return res.send({
        error:false,
        message: 'welcome to Restful CRUD API with NODEJS , Express ,MYSQL',
        written_by:'Narenrit',
        
    })
})
// connecttion to mySQL DB
let dbCon = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'nodejs_api'
})
dbCon.connect()
// retrieve all books
app.get('/books',(req,res)=>{
    dbCon.query('SELECT * FROM books',(error,results,fields)=>{
        if(error)throw error
        let message = ""
        if (results === undefined || results.length ==0){
            message="book table is empty"
        }else{
        message="Success"
    }
    return res.send({error:false ,data:results,message:message})
    })
})
// add a new book
app.post('/book', (req,res)=>{
    let name = req.body.name
    let author = req.body.author
    // validation
    if(!name || !author){
        return res.status(400).send({error:true,message:"Please provide book name and author."})
    }else{
        dbCon.query('INSERT INTO books(name,author)VALUES(?,?)',[name,author],(error,results,fields)=>{
            if(error)throw error
            return res.send({error:false,data:results,message:"Book successfully added"})
        })
    }
})
// retrieve book by id
app.get('/book/:id',(req,res)=>{
    let id = req.params.id
    if(!id){
        return res.status(400).send({error:true , message:"Please provide bookid"})
    }else{
        dbCon.query("SELECT * FROM books WHERE id = ?",id,(error,results,fields)=>{
            if (error) throw error
            let message = ""
            if (results === undefined || results.length ==0){
                message="book not found"
            }else{
            message="Success"
        }
        return res.send({error:false,data:results[0],message:message})
        })
    }
})
// update book with id
app.put('/book', (req,res)=>{
    let id = req.body.id
    let name = req.body.name
    let author = req.body.author

    // validation
    if(!id || !name || !author){
        return res.status(400).send({error:true,message:'Please provide book id , name , author'})
    }else{
        dbCon.query('UPDATE books SET name = ?,author=? WHERE id = ?',[name,author,id],(error,results,fields)=>{

        
        if(error)throw error
        let message = ""
        if(results.changedRows === 0){
            message="BOOK not found or data are same"
        }else{
            message= "book success update"
        }
        return res.send({error:false,data:results,message:message})
    })
    }
})
// delete book by id
app.delete('/book',(req,res)=>{
    let id =req.body.id
    if(!id){
        return res.status(400).send({error:true, message:"Please provide book id"})        
    }else{
        dbCon.query('DELETE FROM books WHERE id=?',[id],(error,results,fields)=>{
            if(error) throw error
            let message =""
            if(results.affectedRows ===0){
                message = "Book not found"
            }else{
                message = "Book Successfully Deleted"
            }
            return res.send({error:false,data:results,message:message})
        })
    }
})
app.listen(3000,()=>{
    console.log('Node App is running port3000');
})