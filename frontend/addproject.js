const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE' //default mode
let selectedId = ''

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    console.log('id', id)
    if (id) {
        mode = 'EDIT'
        selectedId = id

        //1.ดึงข้อมูล user เก่าออกมาก่อน
        try{
            const response = await axios.get(`${BASE_URL}/projects/${id}`)
            const project = response.data

            //2.เราจะนำข้อมูล user กลับใส่เข้าไปใน input
            let projectnameDOM = document.querySelector('input[name=projectname]')
            let detailDOM = document.querySelector('input[name=detail]')
            let responderDOM = document.querySelector('input[name=responder]')
            let eventDOM = document.querySelector('input[name=event]')
            let timestartDOM = document.querySelector('input[name=timestart]')
            let timeendDOM = document.querySelector('input[name=timeend]')
            let progressDOM = document.querySelector('input[name=progress]')
            let costbudgetDOM = document.querySelector('input[name=costbudget]')
            let financialbudgetDOM = document.querySelector('input[name=financialbudget]')
            let expensesDOM = document.querySelector('input[name=expenses]')

            /* let messageDOM = document.getElementById('message') //<===== */

            const dateone = new Date(project.timestart); 
            dateone.setDate(dateone.getDate() + 1);
            const datetwo = new Date(project.timeend);
            datetwo.setDate(datetwo.getDate() + 1);
            const formattedDate = dateone.toISOString().split('T')[0];
            const formattedDate2 = datetwo.toISOString().split('T')[0];

            projectnameDOM.value = project.projectname
            detailDOM.value = project.detail
            responderDOM.value = project.responder
            eventDOM.value = project.event

            project.timestart = formattedDate
            timestartDOM.value = project.timestart
            
            project.timeend = formattedDate2
            timeendDOM.value = project.timeend

            progressDOM.value = project.progress
            costbudgetDOM.value = project.costbudget
            financialbudgetDOM.value = project.financialbudget
            expensesDOM.value = project.expenses


        } catch (error){
            console.log('error',error)
        }
    }
}


const validateData = (userData) => {
    let errors = []
    if(!userData.projectname){
        errors.push('กรุณากรอกชื่อโครงการ') }
    if(!userData.detail){
        errors.push('กรุณากรอกรายละเอียด') }
    if(!userData.responder){
        errors.push('กรุณากรอกผู้รับผิดชอบ') }
    if(!userData.event){
        errors.push('กรุณากรอกกิจกรรม') }
    if(!userData.timestart){
        errors.push('กรุณากรอกเวลาเริ่มต้น') }
    if(!userData.timeend){
        errors.push('กรุณากรอกเวลาสิ้นสุด') }
    if(!userData.progress){
        errors.push('กรุณาเลือกความคืบหน้า') }
    if(!userData.costbudget){
        errors.push('กรุณากรอกงบประมาณต้นทุน') }
    if(!userData.financialbudget){
        errors.push('กรุณากรอกงบประมาณการเงิน') }
    if(!userData.expenses){
        errors.push('กรุณากรอกรายการค่าใช้จ่าย') }
    return errors
}


const submitData = async () => {
    let projectnameDOM = document.querySelector('input[name=projectname]')
    let detailDOM = document.querySelector('input[name=detail]')
    let responderDOM = document.querySelector('input[name=responder]')
    let eventDOM = document.querySelector('input[name=event]')
    let timestartDOM = document.querySelector('input[name=timestart]')
    let timeendDOM = document.querySelector('input[name=timeend]')
    let progressDOM = document.querySelector('input[name=progress]')
    let costbudgetDOM = document.querySelector('input[name=costbudget]')
    let financialbudgetDOM = document.querySelector('input[name=financialbudget]')
    let expensesDOM = document.querySelector('input[name=expenses]')

    let messageDOM = document.getElementById('message')

    try {

    console.log('test');
    let userData = {
        projectname: projectnameDOM.value,
        detail: detailDOM.value,
        responder: responderDOM.value,
        event: eventDOM.value,
        timestart: timestartDOM.value,
        timeend: timeendDOM.value,
        progress: progressDOM.value,
        costbudget: costbudgetDOM.value,
        financialbudget: financialbudgetDOM.value,
        expenses: expensesDOM.value
    }

    console.log('submit Data',userData);

        const errors = validateData(userData)

        if (errors.length > 0) {
            //มี error เกิดขึ้น
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            }
        }

        let message = "บันทึกข้อมูลโครงการของคุณเรียบร้อยแล้ว"

        if (mode === 'CREATE') {
            const response = await axios.post(`${BASE_URL}/projects`, userData)
            console.log('response', response.data);
        }else{
            const response = await axios.put(`${BASE_URL}/projects/${selectedId}`, userData)
            message = 'แก้ไขข้อมูลเรียบร้อย'
            console.log('response', response.data);
        }

        messageDOM.innerText = message
        messageDOM.className = 'message success'
    }catch(error) {

        console.log('error message', error.message); // <====
        console.log('error', error.errors); // <====
        
        if (error.response) {
            console.log(error.response.data.message);
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }

    
        let htmlData = '<div>'
        htmlData += `<div class="error">${error.message}</div>`
        htmlData += '<ul>'
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li class="errors">${error.errors[i]}</li>`
        }
        htmlData += '</ul>'
        htmlData += '</div>'

        messageDOM.innerHTML = htmlData
        messageDOM.className = 'message danger'
    }
}