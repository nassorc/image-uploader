class Modal {
    constructor(parentElm) {
        this.parent = (parentElm) ? parentElm : document.querySelector('body');
        this.root = document.createElement('div');  // root reference the backdrop
        this.root.classList.add('modal-backdrop');

        this.root.innerHTML += `
            <div class="modal-container">
                <div class="side left-side">
                    <div class="section1">
                        <div class="icon-container">
                            <i class="fa-solid fa-ellipsis fa-2x ellipsis-icon"></i>
                        </div>
                    </div>
                    <div class="section2">
                        <label for="upload-image" class="upload-image-label">
                            <div class="upload-image-container">
                                <div class="dotted-border">
                                    <div class="upload-image-body">
                                        <p>Select Image</p>
                                    </div>
                                    <div class="upload-image-footer">
                                        <p>Recommend file size: 20mb</p>
                                    </div>
                                </div>
                            </div>
                        </label>
                        <input type="file" name="upload-image" id="upload-image">
                        <div class="item-upload"></div>
                    </div>
                </div>
                <div class="side right-side">
                    <div class="section1">
                        <select name="" id="item_size" class="select-input btn">
                            <option value="" disabled selected>select</option>
                            <option value="small" >small</option>
                            <option value="medium" >medium</option>
                            <option value="large" >large</option>
                        </select>
                        <button class="btn-save btn">save</button>
                    </div>
                    <div class="section2">
                        <div class="form-container">
                            <form action="">
                                <div class="input-field">
                                    <input type="text" name="" id="item_title" placeholder="Title">
                                </div>
                                <div class="input-field">
                                    <input type="text" name="" id="item_description" placeholder="Description">
                                </div>
                                <div class="input-field">
                                    <input type="text" name="" id="item_destination" placeholder="Add a destination link">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `
        this.parent.appendChild(this.root);

        this.root.addEventListener('click', e => {
            // if client clicks backdrop
            if (this.root === e.target) {
                this.resetModal();
            }
        })
    }
    showModal() {
        this.root.style.display = 'flex';
        return this;
    }
    resetModal() {
        this.root.style.display = 'none';

        // reset input fields
        this.root.querySelector('#item_title').value = '';
        this.root.querySelector('#item_description').value = '';
        this.root.querySelector('#item_destination').value = '';
        this.root.querySelector('#item_size').value = '';
        this.root.querySelector('#upload-image').value ='';

        // remove image preview
        const imagePreview = this.root.querySelector('.section2 .item-upload');
        const imageFromPreview = this.root.querySelector('.section2 .item-upload img');
        const uploadImageLabel = this.root.querySelector('label.upload-image-label');
        uploadImageLabel.style.display = 'block'
        imagePreview.style.display = 'none';
        imagePreview.removeChild(imageFromPreview);
    }
}