const express=require('express')
const app= express()

//add template engine
const path=require('path')
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
//static files css js
app.use(express.static(path.join(__dirname,'public')))
//use file system - read and write files
const fs=require('fs')

app.get('/',(req,res)=>{
    fs.readFile('./tasks.json',"utf-8",(err,jsonstring)=>{
        if (err){
            console.log('Error reading file', err)
            return
        }
        try{
            const tasks=JSON.parse(jsonstring)
            res.render('index',{tasksData:tasks})
            console.log(tasks)
        }catch (err){
            console.log('Error parsing json file',err)
        }
    })

})


app.listen(3002)