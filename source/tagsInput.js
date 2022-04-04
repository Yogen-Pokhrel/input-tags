const utils = {
    hasId: (element) =>{
        return (typeof element.id != 'undefined' && element.id) ? true : false;
    }
}

const closeIcon = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.605 13.5781C16.0734 14.0173 16.0734 14.7298 15.605 15.1691C15.1365 15.6083 14.3765 15.6082 13.908 15.1691L7.99999 9.58906L2.04999 15.1672C1.58154 15.6064 0.821488 15.6064 0.352988 15.1672C-0.115513 14.728 -0.115463 14.0155 0.352988 13.5763L6.30499 8L0.351338 2.37969C-0.117113 1.94051 -0.117113 1.22797 0.351338 0.788747C0.819788 0.349528 1.57984 0.349575 2.04834 0.788747L7.99999 6.41094L13.95 0.832809C14.4184 0.393637 15.1785 0.393637 15.647 0.832809C16.1155 1.27198 16.1154 1.98453 15.647 2.42375L9.69499 8L15.605 13.5781Z" fill="#CFCFCF"/>
</svg>`;

class Tags {

    data = [];
    element = {};
    id = "";
    delimeter= ",";
    placeholder = "Add a tag";

    constructor(element){
        let data = element.value;
        this.data = data.split(/[;,]/);
        this.element = element;
        this.id = element.id;
        let delimeter = element.getAttribute("delimeter");
        let placeholder = element.getAttribute("placeholder");
        if(delimeter){
            this.delimeter = delimeter;
        }
        if(placeholder){
            this.placeholder = placeholder;
        }
        let currentData = element.value;
        if(currentData){
            this.data = currentData.split(this.delimeter);
        }
        this.init();
    }

    init = () =>{
        const newNode = document.createElement('div');
        newNode.setAttribute('for', this.element.id)
        newNode.innerHTML = `<div class="tags-container-wrapper" id="container_wrapper_${this.id}">
                                <div class="tags-container" id="container_${this.id}">
                                <div class="input-container" id="input_container_${this.id}"><input class="tags-input" id="tag_input_${this.id}" placeholder="${this.placeholder}" />
                                <span class="error-box">Error!</span>
                                </div>
                                </div>
                                
                            </div>`;
        newNode.onclick = this.handleContainerClick;
        newNode.onkeydown = this.handleKeyPress;
        this.element.parentElement.append(newNode);
        this.element.style.display= "none";
        this.renderAllTags();
    }

    handleContainerClick = () =>{
        document.getElementById("tag_input_"+this.id).focus();
    }

    handleKeyPress = (event) =>{
        if (event.keyCode === 13 || event.key === this.delimeter) {
            event.preventDefault();
            this.addTag();
            return false;
        }
    }

    addTag = () => {
        let tag =  document.getElementById("tag_input_"+this.id);
        let tagValue = tag.value;
        if(tagValue && tagValue !== ""){
            if(!this.isUnique(tagValue)){ 
                tag.nextElementSibling.style.display ="block"; 
                tag.nextElementSibling.innerHTML = "Same tag already exists";  
                return false;
            }

            tag.nextElementSibling.style.display ="none"; 

            this.data.push(tagValue);
            this.renderTags(tagValue);
            document.getElementById("tag_input_"+this.id).value = "";
            this.refreshTags();
        }
    }

    isUnique = (tag) => {
        if(this.data.includes(tag)){
            return false;
        }else{
            return true;
        }
    }

    renderAllTags = () => {
        if(Array.isArray(this.data) && this.data.length > 0){
            this.data.map((element,index) => {
                if(!element) return "";
                return this.renderTags(element, index);
            });
        }
    }

    refreshTags = () => {
        document.getElementById(this.id).value = this.data.join(this.delimeter);
    }

    renderTags = (tag, index = false) => {
        let newNode = document.createElement('div');
        newNode.classList = "tag-node-wrapper";
        let removeButton = document.createElement('span');
        removeButton.classList = "remove-tag";
        removeButton.setAttribute('data-index', (index !== false) ? index + 1: this.data.length + 1);
        removeButton.innerHTML = closeIcon;
        newNode.innerHTML = `<span class="tag-node">${tag}</span>`;
        
        newNode.append(removeButton);
        document.getElementById("container_"+this.id).append(newNode);
        removeButton.onclick = this.removeTag.bind(event, removeButton.previousSibling.innerHTML);
    }

    clearAllTags = () => {
        const parentNode = document.getElementById("container_"+this.id);
        const elements = parentNode.querySelectorAll('.tag-node-wrapper');
        elements.forEach(ele => {
            ele.remove();
        });
    }

    removeTag = (value) =>{
        let newData = this.data.filter(ele => {
            if(ele === value) return false;
            return true;
        });

        this.data = newData;
        this.clearAllTags();
        this.renderAllTags();
        this.refreshTags()
    }
} 

let allTagsInputElement = document.getElementsByClassName('tagsInput');
Object.values(allTagsInputElement).forEach(element => {
    if(!utils.hasId(element)){
        element.id = "tags_"+Date.now();
    }
    new Tags(element);
});
