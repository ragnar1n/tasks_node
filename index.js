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

app.get('/delete-task/:taskId',(req,res)=>{
    let deletedTaskId=parseInt(req.params.taskId)
    fs.readFile('./tasks.json',"utf-8",(err,jsonstring)=>{
        if (err){
            console.log('Error reading file', err)
            return
        }
        try{
            const tasks=JSON.parse(jsonstring)
            tasks.forEach((task,index)=>{
                if (task.id===deletedTaskId){
                    tasks.splice(index,1)
                }
            })
            jsonstring=JSON.stringify(tasks,null,2)
            fs.writeFile('./tasks.json',jsonstring,"utf-8",()=>{
                if (err){
                    console.log('Error writing file', err)
                }else{
                    console.log('Data saved')
                }
            })
            res.redirect('/')
        }catch (err){
            console.log('Error parsing json file',err)
        }
    })
})

app.get('/delete-tasks/',(req,res)=>{
    fs.writeFile('./tasks.json',JSON.stringify([]),(err)=>{
        if (err !=null){
            console.log('Deleting error', err)
        }
    })
    res.redirect('/')
})

//proceed form post method data
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/add-task',(req,res)=>{
    let userTask=req.body.user_task
    fs.readFile('./tasks.json',"utf-8",(err,jsonstring)=>{
        if (err){
            console.log('Error reading file', err)
            return
        }
        try{
            const tasks=JSON.parse(jsonstring)
            //add new task
            //create new id automatically
            let index
            if (tasks.length===0){
                index=0
            }else{
                index=tasks[tasks.length-1].id+1
            }
            //create task object
            const newTask={
                "id":index,
                "task":userTask
            }
            //add into task array
            tasks.push(newTask)
            jsonstring=JSON.stringify(tasks,null,2)
            fs.writeFile('./tasks.json',jsonstring,"utf-8",()=>{
                if (err){
                    console.log('Error writing file', err)
                }else{
                    console.log('Data saved')
                }
            })
            res.redirect('/')
        }catch (err){
            console.log('Error parsing json file',err)
        }
    })
})

app.listen(3002)