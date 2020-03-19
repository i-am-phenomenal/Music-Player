import React, {Component} from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
  } from "reactstrap";
import ReactDOM from 'react-dom';
import axios from "axios";

function buildFileSelector(){
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    console.log(fileSelector, "  FILE SELECTOR ")
    return fileSelector;
}

export default class UploadView extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
        this.fileSelector = buildFileSelector();
    }
    
    handleFileSelect = (e) => {
        e.preventDefault();
        this.fileSelector.click();
    }
    handleSubmit(event) {
        event.preventDefault();
        const fileObject = this.fileInput.current.files[0];
        let form_data = new FormData();
        form_data.append('file', fileObject);
        form_data.append('title', fileObject.name);
        form_data.append('type',fileObject.type);
        form_data.append('file_size', fileObject.size);
        // var newObject = {
        //     'fileName' : fileObject.name,
        //     'lastModified' : fileObject.lastModified,
        //     'type' : fileObject.type,
        //     'size' : fileObject.size, 
        //     'webkitRelativePath' : fileObject.webkitRelativePath
        // };

        // const fileAsBlob = new Blob([fileObject]);
        // var stream = fileAsBlob.stream();

        // var converted = JSON.stringify(newObject);
        // console.log(stream, " --> CONVERTED ");

        let custom_url = "http://localhost:8000/api/upload_file/"

        axios.post(custom_url, form_data, {
            headers: {
              'content-type': 'multipart/form-data'  
            }
        })
        .then(res => {
            console.log(res.data, " RESPONSE AFTER POST REQUEST FOR FILE")
        })
        .catch(error => console.log(error , "!!!!!!!! ERROR !!!!!!!!"))

      }
    
    render(){
        return(
            <div className="text-center">
            <form onSubmit={this.handleSubmit}> 
                <label>
                <p style={{color: 'white'}}>Upload File(s)</p> 
                <input type="file" ref={this.fileInput} />
                    </label> 
                <br /> 
                <Button variant="outline-dark" type="submit">Upload </Button>
            </form>
            </div>
        )
    }
}