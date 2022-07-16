document.addEventListener('DOMContentLoaded', async (e) => {
    // fetch saved images
    const response = await fetchImageData()
    const data = await response.json()
    data.forEach(item => {
        createImageUnit(item)
    })

    // execute main function
    main();
});

function main() {
    // build modal
    buildModal();
    document.querySelector('.image-container').addEventListener('click', (e) => {
        let currentTarget = e.target;
        while (currentTarget != document.querySelector('.image-container')) {
            if (currentTarget.classList.contains('item')) break
            currentTarget = currentTarget.parentElement;
        }
        if (e.target.classList.contains('btn-delete')) {
            const imageId = currentTarget.dataset.id;
            fetch(`http://localhost:3001/delete/${imageId}`)
        }
    })
}

function fetchImageData() {
    return fetch('http://localhost:3001/images')

}
