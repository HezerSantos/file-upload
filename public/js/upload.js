

try{
    const uModal = document.querySelector(".upload__modal")
    const cModal = document.querySelector(".create__modal")
    const fModal = document.querySelector(".file__modal")

    const uploadButton = document.querySelector(".upload__button")
    const createButton = document.querySelector(".create__button")

    const closeUModal = document.querySelector(".close__umodal")
    const closeCFModal = document.querySelector(".close__cfmodal")

    const fileButtons = document.querySelectorAll(".file__block")

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

    const fileInput = document.querySelector("#file")
    const fileName = document.querySelector(".file__name")
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (file){
            fileName.textContent = `File: ${file.name}`
        } else {
            fileName.textContent = `File: None`
        }
    })

    const originalFileName = document.querySelector("#efile__name")
    const HTMLFileSize = document.querySelector(".file__size")
    const closeFModal = document.querySelector(".close__fmodal")
    const hiddenInputs = document.querySelectorAll(".h__input")
    const dForm = document.querySelector(".delete__file")
    const uForm = document.querySelector(".update__file")
    const dlForm = document.querySelector(".download__file")

    fileButtons.forEach(button => {
        button.addEventListener('click', () => {
            fModal.classList.toggle('show__modal')
            const fileName = button.children[0]
            const fileSize = button.children[3]
            const fileId = button.children[4]

            HTMLFileSize.textContent = `Size: ${fileSize.textContent}`
            originalFileName.value = fileName.textContent
            
            originalFileName.addEventListener("change", (e) => {
                hiddenInputs.forEach(input => {
                    input.value = e.target.value
                })
            })
            dForm.action = `/dashboard/delete/${fileName.textContent}/${fileId.textContent}`
            uForm.action = `/dashboard/update/${fileName.textContent}/${fileId.textContent}`
            dlForm.action = `/dashboard/download/${fileName.textContent}`

        })
    })
    closeFModal.addEventListener('click', (e) => {
        close(e, fModal)
    })

} catch(e) {
    console.log(e)
}