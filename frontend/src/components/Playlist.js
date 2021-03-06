import React, { Component } from "react";
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
        this.state = {
            allFiles: [],
            dummy: []
        };
    }

    componentDidMount() {
        this.requestForAllFiles();
    }

    handleDelete = (item, event) => {
        event.preventDefault();
        let custom_url = "http://localhost:8000/api/delete/"

        axios 
        .post(custom_url, item)
        .then(response => 
              alert(response.data) 
            )
        .then(response => this.requestForAllFiles());
    }


    handlePlay = (item, event) => {
        event.preventDefault();
        let custom_url = "http://localhost:8000/api/play/"
        axios
        .post(custom_url, item)
        .catch(error => alert(error));
    }

    requestInfo = (item, event) => {
        event.preventDefault();
        let custom_url = "http://localhost:8000/api/get_info/"
        console.log(item, "$$$$$$$$$$$$$$");
        axios
        .post(custom_url, item)
        .then(response => alert(response))
        .catch(error =>  console.log(error))
    }

    requestForAllFiles = () => {
        let custom_url = "http://localhost:8000/api/all_files/"
        axios
            .get(custom_url)
            .then(response => this.setState({ allFiles: response.data }))
            .catch(error => console.log(error))
    }

    renderPlaylist = () => {
        const allItems = this.state.allFiles
        return allItems.map(item => (
            <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="list-group-item" title={item}>                        
                    <div className="btn-group"> 
                        {item}  
                        &nbsp;
                        <Button variant="outline-dark" onClick={(e) => this.handlePlay(item, e)}>Play</Button>
                        &nbsp;
                        <Button color="danger" onClick={(e) => this.handleDelete(item, e)}>Delete</Button>
                        &nbsp;
                        <Button color="info" onClick={(e) => this.requestInfo(item, e)}>Info</Button>
                         </div>
                        </span> 
                </li>
        ))
    }

    render() {
        return (
            <div>
                <form onSubmit={this.requestForAllFiles}>
                    <Button variant="outline-dark" type="submit">All Files</Button>
                </form>
                <br /> 
                <br /> 
                <ul className="list-group list-group-flush">
                    {this.renderPlaylist()}
                </ul>
            </div>
        )
    }
}