
try{
    const uModal = document.querySelector(".upload__modal")
    const cModal = document.querySelector(".create__modal")

    const uploadButton = document.querySelector(".upload__button")
    const createButton = document.querySelector(".create__button")

    const closeUModal = document.querySelector(".close__umodal")
    const closeCFModal = document.querySelector(".close__cfmodal")

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
} catch(e) {
    console.log(e)
}