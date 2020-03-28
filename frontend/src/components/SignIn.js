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
import {Redirect} from 'react-router-dom';

export default class SignInView extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            currentUser: {
                username: "",
                password: "",
                isAdmin: false,
                isLoggedIn: false,
                isRegistered: true,

            },
            showLoginModal: true,
            redirect: false,
        }
    }

    returnDefaultUserObject = () => {
        return ({
            username: "",
            password: "",
            isRegistered: false,
            isLoggedin: false,
            isAdmin: false,
        })
    }

    toggleModal = () => {
        this.setState({showLoginModal: !this.state.showLoginModal, currentUser: this.returnDefaultUserObject()});
    }

    isUserValidated = (object) => {
        if (object.username == "" || object.password == "") {
            return false
        } else {
            return true
        }
    }

    tryRedirect = () => {
        if (this.state.redirect) {
           return <Redirect to="/panel" />
        }
    }

    // performAction = (responseObject) => {
    //     console.log(this.state.redirect, "INSIDE PERFORM ACTION ")
    //     if (this.state.redirect) {
    //         this.props.history.push('/upload')
    //     //    return <Redirect to="/upload" />
    //     }
    // }

    setRedirect = (respData) => {
        console.log(respData, "RESPONSE DATA ");
        if (respData == "True") {
            this.setState({redirect: true});
        }
    }

    loginUser = (userObject) => {
        if (this.isUserValidated(userObject)) {
            let customUrl = ""
            if (userObject.isAdmin) {
                customUrl = 'http://localhost:8000/api/admin/'
            } else {
                customUrl = 'http://localhost:8000/api/signin/'
            }
            axios 
            .post(customUrl, userObject)
            .then(response => this.setRedirect(response.data))
            .catch(error => alert(error))
        } else {
            alert("You have missed out on some details. Please have a look !!");
        }
    }

    renderModal = () => {
        let showModal = this.state.showLoginModal;
        if (showModal) {
            return (
                <CustomModal
                    toggle = {this.toggleModal}
                    currentUser = {this.state.currentUser}
                    onSave = {this.loginUser}
                    />
            )    
        } else {
           return ("")
        }
        
    }

    handleSignIn = (event) => {
        event.preventDefault();
        this.setState({showLoginModal: true});
    }

    render() {
        return (
            <div> 
                <Button variant="outline-dark" onClick={(e) => this.handleSignIn(e)}  type="submit">
                    Sign In
                    </Button>
                {this.tryRedirect()}
                {this.renderModal()}
                </div>
        )
    }
}