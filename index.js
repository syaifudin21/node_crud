const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

//parsing json
app.use(bodyparser.json());

//restApi agar support body parameter
app.use(bodyparser.urlencoded({
    extended: true
})); 

// setting connection
var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password : '',
    database : 'crudnode'
})

// cek koneksi
mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB Connection Success');
    else
    console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
})

//menjalankan port
app.listen(3000, ()=> console.log('Express runing is port 3000'));

//mengambil semua data employee
app.get('/employess', (req, res)=>{
    mysqlConnection.query('SELECT * FROM employee', (err, rows, fields)=> {
        if (!err)
            // console.log(rows[0].EmpID);
            res.send(rows)
        else
            console.log(err);
    })
})

//mengambil data perid
app.get('/employess/:id', (req, res)=>{
    mysqlConnection.query('SELECT * FROM employee where EmpID = ?',[req.params.id], (err, rows, fields)=> {
        if (!err)
            // console.log(req.params.id);
            res.send(rows);
        else
            console.log(err);
    })
} )

//meng hapus perid
app.delete('/employess/:id', (req, res)=>{
    mysqlConnection.query('DELETE FROM employee where EmpID = ?',[req.params.id], (err, rows, fields)=> {
        if (!err)
            // console.log(req.params.id);
            res.send('Delete Successfull');
        else
            console.log(err);
    })
} )

//menambahkan data 
app.post('/employess', (req, res)=>{
    let emp = req.body;
    var sql = "INSERT INTO employee SET ?";

    // mendeskripsikan parameter row table
    var bodyparam = {
        'name' : emp.name,
        'EmpCode' : emp.code,
        'Salary' : emp.salary
    };

    var sqlSelectId = 'SELECT * FROM employee where EmpID = ?';

    // res.send(emp.name);
    mysqlConnection.query(sql, bodyparam, (err, rows, fields)=> {
        if (!err){
            // eksekusi setelah berhasil menambahkan row
            mysqlConnection.query(sqlSelectId, [rows.insertId], (err, rows, fields)=> {
                res.send(rows);
            });
            console.log(rows.insertId);
        }
        else{
            console.log(err);
        }
    })
} )

//mengupdate data perid
app.put('/employess/:id', (req, res)=>{
    let emp = req.body;
    var sql = "UPDATE employee SET ? WHERE EmpID = ?";
    var bodyparam = {
        'name' : emp.name,
        'EmpCode' : emp.code,
        'Salary' : emp.salary
    };
    var sqlSelectId = 'SELECT * FROM employee where EmpID = ?';

    // res.send(emp.name);
    mysqlConnection.query(sql, [bodyparam, req.params.id], (err, rows, fields)=> {
        if (!err){
            // eksekusi setelah berhasil mengupdate row
            mysqlConnection.query(sqlSelectId, [req.params.id], (err, rows, fields)=> {
                res.send(rows);
            });
            console.log(bodyparam);
        }
        else{
            console.log(err);
        }
    })
} )
