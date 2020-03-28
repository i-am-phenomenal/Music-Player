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

export default class PanelView extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            var: "" 
        }
    };

    render() {
        return (
            <div> 
                <p>This is panel view </p> 
                </div>
        )
    }
}