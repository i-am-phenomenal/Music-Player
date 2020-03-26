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
import CustomModal from './Modal';


export default class SignUpView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userObject: {
                username: "",
                password: "",
                isRegistered: false,
                isLoggedin: false
            },
            showRegisterModal: false,
            showLoginModal: false,
        };   
    }

    handleSignUp = (event) => {
        event.preventDefault();
        this.setState({showRegisterModal: true});
    }

    handleSignIn = (event) => {
        event.preventDefault();
        this.setState({showLogInModal: true});
    }

    renderSignUpOrLogin = () => {
        let isRegistered = this.state.isRegistered;
        if (isRegistered) {
            return (
                <Button variant="outline-dark" onClick={(e) => this.handleSignIn(e)}  type="submit">
                    Sign In
                    </Button>
            )
        } else {
            return (<Button variant="outline-dark" onClick={(e) => this.handleSignUp(e)} type="submit">
                    Sign Up
                    </Button>
            )
        }
    }

    renderModal = ()  => {
        let showModal = this.state.showRegisterModal;
        if (showModal) {
            return (
            <CustomModal 
            toggle = {true} 
            currentUser = {this.state.userObject}
                
                />)
        } else {
            return ("")
        }
        
            // toggle= {this.toggle}
    }

    render() {
        return (
            <div> 
                {this.renderSignUpOrLogin()}
                <br /> 
                {this.renderModal()}
                </div>
                
        )
    }
}