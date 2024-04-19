const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 8000;

let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8700
  })
}

const validateData = (userData) => {
  let errors = []
  if(!userData.projectname){
    errors.push('กรุณากรอกชื่อโครงการ')
  }
  if(!userData.detail){
    errors.push('กรุณากรอกรายละเอียด')
  }
  if(!userData.responder){
    errors.push('กรุณากรอกผู้รับผิดชอบ')
  }
  if(!userData.event){
    errors.push('กรุณากรอกกิจกรรม')
  }
  if(!userData.timestart){
    errors.push('กรุณากรอกเวลาเริ่มต้น')
  }
  if(!userData.timeend){
    errors.push('กรุณากรอกเวลาสิ้นสุด')
  }
  if(!userData.progress){
    errors.push('กรุณาเลือกความคืบหน้า')
  }
  if(!userData.costbudget){
    errors.push('กรุณากรอกงบประมาณต้นทุน')
  }
  if(!userData.financialbudget){
    errors.push('กรุณากรอกงบประมาณการเงิน')
  }
  if(!userData.expenses){
    errors.push('กรุณากรอกรายการค่าใช้จ่าย')
  }
  return errors
}


//path = GET /projects สำหรับ get projects ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/projects', async (req,res) =>{
  const results = await conn.query('SELECT * FROM projects')
  res.json(results[0]);
})


// GET /projects/:id สำหรับการดึง projects รายโครงการออกมา
app.get('/projects/:id', async (req,res) =>{ 
  try{
      let id = req.params.id;
      const results = await conn.query('SELECT * FROM projects WHERE id = ?', id)

      if(results[0].length == 0){
        throw {statusCode:404, message:'project not found'}
      } res.json(results[0][0]);
      } catch(error){
        console.log("errorMessage",error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
          message: 'something went wrong',
          errorMessage: error.message })
  }
})


// POST /project POST /projects สำหรับการสร้าง projects ใหม่บันทึกเข้าไป
app.post('/projects', async (req, res) => {
  try{ 
    let project = req.body;
    const errors = validateData(project) 
    if(errors.length > 0){
      throw{
        message: 'กรอกข้อมูลไม่ครบ',
        errors: errors }
    }
    const results = await conn.query('INSERT INTO projects SET ?', project) 
    res.json({
      message: 'Create project successfully',
      data: results[0]
    })
  } catch (error) {
    const errorMessage = error.errors || 'something went wrong'
    const errors = error.errors || []
    console.log("errorMessage",error.message)
    res.status(500).json({
      message: 'errorMessage',
      errors: errors })
  }
})


//PUT /projects/:id สำหรับการแก้ไข projects รายโครงการ (ตาม id ที่บันทึกเข้าไป)
app.put('/projects/:id', async (req, res) => { 
    try{
      let id = req.params.id;
      let updateUser = req.body;
      let project = req.body;
      const results = await conn.query(
        'UPDATE projects SET ? WHERE id = ?', [updateUser, id])
      res.json({
        message: 'Update project successfully',
        data: results[0]
      })
    } catch (error) {
      console.log("errorMessage",error.message)
      res.status(500).json({
        message: 'something went wrong',
      })
    }
})


//DELETE /projects/:id สำหรับการลบ projects รายโครงการ (ตาม id ที่บันทึกเข้าไป)
app.delete('/projects/:id', async (req, res) => {
  try{
    let id = req.params.id;
    const results = await conn.query('DELETE FROM projects WHERE id = ?', id)
    res.json({
      message: 'Delete project successfully',
      data: results[0]
    })
  } catch (error) {
    console.log("errorMessage",error.message)
    res.status(500).json({
      message: 'something went wrong',
    })
  }
});


app.listen(port, async (req, res) => {
  await initMySQL()
    console.log('Server is running on ', + port);
})