import React, {Component} from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    FormGroup,
    Input,
    Label,
    Table
  } from "reactstrap";
import ReactDOM from 'react-dom';
import axios from "axios";
import InfoModal from './InfoModal';
import CustomModal from "./Modal";
import { Redirect } from "react-router-dom";

export default class PanelView extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            user: {
                isAdmin: false,
                userUuid: "",
                username: "",
                password: ""
            },
            allUsers: [],
            isDropDownOpen: false,
            toggleInfoModal: false,
            toggleEditProfileModal: false,
            staticUrl: "http://localhost:8000/api",
            isLoggedOut: false
        }
    };

    getAllUsersData = () => {
        let customUrl = this.state.staticUrl + "/get_all_users/";
        axios 
        .get(customUrl)
        .then(response => this.setState({allUsers: response.data}))
        .catch(error => alert(error));
    }

    fetchCurrentUserData = () => {
        let currentUuid = window.sessionStorage.getItem("user")
        let customUrl = this.state.staticUrl + "/fetch_user/";
        axios
        .post(customUrl, currentUuid)
        .then(response => this.setState({user: response.data}))
        .catch(error => alert(error))
    }

    componentDidMount() {
        let isAdmin = window.sessionStorage.getItem("isAdmin")
        let currentUuid = window.sessionStorage.user
        if (currentUuid) {
            this.fetchCurrentUserData()
        }

        if (isAdmin) {
            this.getAllUsersData()  
        } 
    }

    convertBoolToString = (boolean) => {
        if (boolean) {
            return "True"
        } else {
            return "False"
        }
    }

    renderAdminView = () => {
        let users = this.state.allUsers;
        return (<Table striped> 
            <thead> 
                <tr> 
                    <th className="text-warning"> Uuid  </th>
                    <th className="text-warning"> Username </th>
                    <th className="text-warning"> Password </th>
                    <th className="text-warning"> Is Admin </th>
                    <th className="text-warning"> Is LoggedIn </th>
                    </tr>   
                </thead> 
                <tbody>
                    {users.map(user => 
                        {
                        return (
                        <tr>
                        <td className="text-warning"> {user.uuid} </td>
                        <td className="text-warning"> {user.username} </td>
                        <td className="text-warning"> {user.password} </td>
                        <td className="text-warning"> {this.convertBoolToString(user.isAdmin)} </td>
                        <td className="text-warning"> {this.convertBoolToString(user.isLoggedIn)} </td>
                        </tr> )
                        }
                    )}
                </tbody>
            </Table> )    
    }

    toggleDropdown = () => {
        this.setState({isDropDownOpen: !this.state.isDropDownOpen})
    }

    toggle = () => {
        this.setState({toggleInfoModal:  !this.state.toggleInfoModal})
    }

    updateState = (responseObj, updatedUserObject) => {
        if (responseObj.status == 200) {
            this.setState({user: updatedUserObject, toggleEditProfileModal: !this.state.toggleEditProfileModal})
            alert("Operation Successfull !!");
        }
    }

    updateUserDetails = updatedUserObject => {
        let customUrl = this.state.staticUrl + "/update_profile/";
        axios
        .put(customUrl, updatedUserObject)
        .then(response => this.updateState(response, updatedUserObject))
        .catch(error => alert(error))
    }

    toggleEditProfileModal =  () => {
        this.setState({toggleEditProfileModal: !this.state.toggleEditProfileModal})
    }

    renderEditProfileModal = () => {
        let toggleEditModal = this.state.toggleEditProfileModal;
        if (toggleEditModal) {
            return (
            <CustomModal 
                toggle={this.toggleEditModal}
                currentUser = {this.state.user}
                onSave = {this.updateUserDetails}
                />
            )
        }
    }

    renderInfoModal = () => {
        let toggleInfoModal = this.state.toggleInfoModal;
        if (toggleInfoModal) {
            return (
                <InfoModal
                    toggle = {this.toggle}
                    userDetails ={this.state.user}
                />
            )
        } else {
            return ("")
        }        
    }

    tryRedirect = () => {
        let shouldRedirect =  this.state.isLoggedOut;
        if (shouldRedirect) {
            return (<Redirect to="sign_in" /> )
        }
    }

    toggleRedirect = () => {
        this.setState({isLoggedOut: !this.state.isLoggedOut})
    }

    signOutUser = () => {
        let userUuid = window.sessionStorage.getItem("user")
        let customUrl = this.state.staticUrl + "/change_login_status/"
        window.sessionStorage.removeItem("user");
        window.sessionStorage.removeItem("isAdmin");
        axios
        .post(customUrl, userUuid)
        .then(response => alert(response.data))
        .then(_ => this.toggleRedirect())
        .catch(error => alert(error))
    }

    renderDropdown = () => {
       return (
           <div className="float-lg-right"> 
        <Dropdown isOpen={this.state.isDropDownOpen} toggle={this.toggleDropdown}>
        <DropdownToggle caret>
          {this.state.user.username}
          </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.toggle}>Profile</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.toggleEditProfileModal}>Edit Profile</DropdownItem>
          <DropdownItem> Settings </DropdownItem>
          <DropdownItem onClick={this.signOutUser}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </div>
      )
    }

    render() {
        return (
            <div> 
                {this.renderDropdown()}
                {this.renderAdminView()}
                {this.renderInfoModal()}
                {this.renderEditProfileModal()}
                {this.tryRedirect()}
                </div>
        )
    }
}