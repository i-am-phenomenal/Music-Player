import React, {Component} from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";

import ReactDOM from 'react-dom';
import axios from "axios";

export default class PlayListView extends Component {
    constructor(props) {
        super(props);  
    }
    state = {
        all_files: []
    }

    requestForAllFiles(event) {
        event.preventDefault();
        let custom_url = "http://localhost:8000/api/all_files/"
        axios
        .get(custom_url)
        .then(response =>  this.setState({all_files: response.data}))
        .catch(error => console.log(error))
    }

    render() {
        return(
        <form onSubmit={this.requestForAllFiles}>
            <Button variant="outline-dark" type="submit">All Files</Button>
        </form>    
        )
    }
}