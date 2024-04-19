const BASE_URL = 'http://localhost:8000';
window.onload = async() => {
    await loadData()
}

const loadData = async () => {
    console.log('on load');
    //1. load user ทั้งหมดออกมาจาก API
    const response = await axios.get(`${BASE_URL}/projects`)
    console.log(response.data);

    //2. นำ user ที่โหลดมาใส่กลับเข้าไปใน html
    const projectDOM = document.getElementById('projectEDIT')
    let htmlData = '<div>'
    for (let i = 0; i < response.data.length; i++) {
        let project = response.data[i]
        const dateone = new Date(project.timestart); 
        dateone.setDate(dateone.getDate() + 1);
        const datetwo = new Date(project.timeend);
        datetwo.setDate(datetwo.getDate() + 1);
        const formattedDate = dateone.toISOString().split('T')[0]; 
        const formattedDate2 = datetwo.toISOString().split('T')[0];
        project.timestart = formattedDate
        project.timeend = formattedDate2
        htmlData += `
            <li class="table-row">
                <div class="col col-1" data-label="Project ID : ">${project.id}</div>            
                <div class="col col-2" data-label="ชื่อโครงการ : ">${project.projectname}</div>
                <div class="col col-3" data-label="รายละเอียดโครงการ : ">${project.detail}</div>
                <div class="col col-4" data-label="ผู้รับผิดชอบ : ">${project.responder}</div>
                <div class="col col-5" data-label="เวลาเริ่มต้น">${project.timestart}</div>
                <div class="col col-6" data-label="เวลาสิ้นสุด">${project.timeend}</div>
                <div class="col col-7" data-label="แก้ไขโครงการนี้ : "><a class='edit' href='addproject.html?id=${project.id}'><i class="fa-solid fa-file-pen"></i> Edit</a></div>
                <div class="col col-8" data-label="ลบโครงการนี้ : "><a class='cancel' data-id='${project.id}'><i class="fa-solid fa-folder-minus" style="color: rgb(180, 24, 24)"></i> Cancel</a></div>
            </li>
            </div>
            
        `
    }
    htmlData += '</div>'
    projectDOM.innerHTML = htmlData

    
    const deleteDOMs = document.getElementsByClassName('cancel')
    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            if (confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`${BASE_URL}/projects/${id}`);
                loadData();  
            } catch (error) {
                console.error(error);
                }
            }
        });
    }
}