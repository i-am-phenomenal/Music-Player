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
                isLoggedin: false,
                isAdmin: false,
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

    toggle = () => {
        this.setState({showRegisterModal: !this.state.showRegisterModal})
        this.refreshUserObject();
    }

    refreshUserObject = () => {
        let refreshed = {
            username: "",
            password: "",
            isRegistered: false,
            isLoggedin: false,
            isAdmin: false,
        }

        this.setState({userObject: refreshed})
    }

    isUserValidated = userObject => {
        if (userObject.username === "" || userObject.password === "") {
            return false
        } else {
            return true
        }
    }

    registerUser = userObject => {
        if (this.isUserValidated(userObject)) {
            this.toggle();
            let custom_url = 'http://localhost:8000/api/signup/'
            axios 
            .post(custom_url, userObject)
            .then(response => alert(response.data))
            .then(_ => this.refreshUserObject)
            .catch(error => alert(error))
        }
        else {
            alert("You may have missed out on some details. Please have a look !");
        }
        
    };

    renderModal = ()  => {
        let showModal = this.state.showRegisterModal;
        if (showModal) {
            return (
            <CustomModal 
            toggle = {this.toggle} 
            currentUser = {this.state.userObject}
            onSave = {this.registerUser}
                
                />)
        } else {
            return ("")
        }
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