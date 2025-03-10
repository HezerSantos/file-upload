
try{
    const uModal = document.querySelector(".upload__modal")
    const cModal = document.querySelector(".create__modal")

    const uploadButton = document.querySelector(".upload__button")
    const createButton = document.querySelector(".create__button")

    const closeUModal = document.querySelector(".close__umodal")
    const closeCFModal = document.querySelector(".close__cfmodal")

    uploadButton.addEventListener('click', () => {
        uModal.showModal();
    })

    createButton.addEventListener('click', () => {
        cModal.showModal()
    })

    const close = (e, modal) => {
        e.preventDefault()
        modal.close()
    }
    closeUModal.addEventListener('click', (e) => {
        close(e, uModal)
    })

    closeCFModal.addEventListener('click', (e) => {
        close(e, cModal)
    })
} catch(e) {

}