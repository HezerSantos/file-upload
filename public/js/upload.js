

try{
    const uModal = document.querySelector(".upload__modal")
    const cModal = document.querySelector(".create__modal")
    const fModal = document.querySelector(".file__modal")

    const uploadButton = document.querySelector(".upload__button")
    const createButton = document.querySelector(".create__button")

    const closeUModal = document.querySelector(".close__umodal")
    const closeCFModal = document.querySelector(".close__cfmodal")

    const fileButtons = document.querySelectorAll(".file__block")

    const originalFileName = document.querySelector("#efile__name")
    const HTMLFileSize = document.querySelector(".file__size")
    const closeFModal = document.querySelector(".close__fmodal")
    const hiddenInputs = document.querySelectorAll(".h__input")
    const dForm = document.querySelector(".delete__file")
    const uForm = document.querySelector(".update__file")
    const dlForm = document.querySelector(".download__file")

    const fileInput = document.querySelector("#file")
    const fileName = document.querySelector(".file__name")

    const cDates = document.querySelectorAll(".cDate")
    const uDates = document.querySelectorAll(".uDate")

    const dates = [...cDates, ...uDates]

    const fileItems = document.querySelectorAll(".file__item")
    const uploadForm = document.querySelector(".upload__form")

    const folderSelect = document.querySelector(".folder__select")


    //Basic Buttons
    uploadButton.addEventListener('click', () => {
        uModal.classList.toggle('show__modal')
    })
    createButton.addEventListener('click', () => {
        cModal.classList.toggle('show__modal')
    })
    const close = (e, modal) => {
        e.preventDefault()
        modal.classList.toggle('show__modal')
    }
    closeUModal.addEventListener('click', (e) => {
        close(e, uModal)
    })

    closeCFModal.addEventListener('click', (e) => {
        close(e, cModal)
    })

    //CREATING FILE NAME

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (file){
            fileName.textContent = `File: ${file.name}`
        } else {
            fileName.textContent = `File: None`
        }
    })

    let fModalFlag = false
    //Editing the action of delete update and download
    fileButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!fModalFlag){
                fModal.classList.toggle('show__modal')
                fModalFlag = true
            }
            const fileName = button.children[0]
            const fileSize = button.children[3]
            const fileId = button.children[4]
            let folderName = "/null"
            if(button.children[5]){
                folderName = `/${button.children[5].textContent}`
                console.log(folderName)
            }

            HTMLFileSize.textContent = `Size: ${fileSize.textContent}`
            originalFileName.value = fileName.textContent
            
            originalFileName.addEventListener("change", (e) => {
                hiddenInputs.forEach(input => {
                    input.value = e.target.value
                })
            })

            
            dForm.action = `/dashboard/delete${folderName}/${fileName.textContent}/${fileId.textContent}`
            uForm.action = `/dashboard/update${folderName}/${fileName.textContent}/${fileId.textContent}`
            dlForm.action = `/dashboard/download${folderName}/${fileName.textContent}`

        })
    })
    closeFModal.addEventListener('click', (e) => {
        close(e, fModal)
        fModalFlag = false
    })


    //Format the Dates
    dates.forEach(date => {
        const oDate = new Date(date.textContent)
        const formattedDate = oDate.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        });
        date.textContent = formattedDate
    })


    //Editing the action for file nav
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!fModalFlag){
                fModal.classList.toggle('show__modal')
                fModalFlag = true
            }
            const path = item.children[1].textContent
            const fileName = item.children[0].textContent.trim()
            dlForm.action = `/dashboard/download/${path.trim()}`
            uForm.action = `/dashboard/update/${path.trim()}`
            dForm.action = `/dashboard/delete/${path.trim()}`

            originalFileName.value = fileName
        })
    })



    folderSelect.addEventListener('change', (e) => {
        const [folderId, folderName ] = e.target.value.split(',')
        uploadForm.action = `/dashboard/upload/${folderName? folderName : null}`
    })
} catch(e) {
    console.log(e)
}