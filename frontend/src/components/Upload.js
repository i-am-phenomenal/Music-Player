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
        var newObject = {
            'fileName' : fileObject.name,
            'lastModified' : fileObject.lastModified,
            'type' : fileObject.type,
            'size' : fileObject.size, 
            'webkitRelativePath' : fileObject.webkitRelativePath
        };

        const fileAsBlob = new Blob([fileObject]);
        var stream = fileAsBlob.stream();

        var converted = JSON.stringify(newObject);
        console.log(stream, " --> CONVERTED ");
        // alert(
        //   `Selected file - ${
        //     this.fileInput.current.files[0].size
        //   }`
        // );

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