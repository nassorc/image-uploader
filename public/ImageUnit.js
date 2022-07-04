const template = document.createElement('template');
template.innerHTML = `
    <style>
        h3 {
            color: cadetblue;
        }
    </style>
    <h3></h3>
    <img/>
`
console.log(template.content.cloneNode(true))

class ImageUnit extends HTMLElement {
    constructor(imageDetails= {}) {
        super();  // initialize parent class
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('title')
    }

}

window.customElements.define('image-unit', ImageUnit)