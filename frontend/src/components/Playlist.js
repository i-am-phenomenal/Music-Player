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
        };
    }

    requestForAllFiles = () => {
        let custom_url = "http://localhost:8000/api/all_files/"
        axios
            .get(custom_url)
            .then(response => this.setState({ allFiles: response.data }))
            .catch(error => console.log(error))
    }

    renderPlaylist = () => {
        //WIP
        const allItems = this.state.allFiles
        console.log(allItems, "11111111")
        return allItems.map(item => (
            <li 
                className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="list-group-item" title={item}>
                        {item}
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
                <ul className="list-group list-group-flush">
                    {this.renderPlaylist()}
                </ul>
            </div>
        )
    }
}