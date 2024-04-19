const BASE_URL = 'http://localhost:8000';
window.onload = async() => {
    await loadData()
}

const loadData = async () => {
    console.log('on load');
    //1. load projects ftom API
    const response = await axios.get(`${BASE_URL}/projects`)
    console.log(response.data);

    const projectDOM = document.getElementById('projectHOME')
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
                <div class="col col-7" data-label="ดูรายละเอียดทั้งหมด : "><a class='edit' href='view.html?id=${project.id}'><i class="fa-solid fa-eye" style="color: #949494;"></i> View</a></div>
            </li>
            
        `
    }
    htmlData += '</div>'
    projectDOM.innerHTML = htmlData

    /* <a class='edit' href='addproject.html?id=${project.id}'>EDIT</a>
    <a class='delete' data-id='${project.id}'>Delete</a> */
    
    const deleteDOMs = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            //ดึงค่า id จาก attribute ของปุ่ม delete
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/projects/${id}`)
                loadData()
            } catch (error) {
                console.error(error)
            }
        })
    }
}