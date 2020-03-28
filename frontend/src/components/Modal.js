import React, { Component } from "react";
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

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
    };
  }

  handleChange = (flag ,event) => {
    event.preventDefault();
    let currentUserObject = this.state.currentUser;
    let currentValue = event.target.value;
    if(flag == "username") {
      currentUserObject.username = currentValue;
      this.setState({userObject: currentUserObject})
    } else if (flag == "password") {
      currentUserObject.password = currentValue;
      this.setState({userObject: currentUserObject})
    } else if (flag == "checkbox") {
      currentUserObject.isAdmin =  event.target.checked;
      this.setState({currentUser: currentUserObject});
    }
  }

  // handleChange = e => {
  //   let { name, value } = e.target;
  //   if (e.target.type === "checkbox") {
  //     value = e.target.checked;
  //   }
  //   const activeItem = { ...this.state.activeItem, [name]: value };
  //   this.setState({ activeItem });
  // };
  render() {
    const { toggle, onSave } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> Sign Up </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">Username</Label>
              <Input
                type="text"
                name="title"
                value= {this.state.currentUser.username}
                onChange={(e) => this.handleChange("username", e)}
                placeholder="Enter Username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Password</Label>
              <Input
                type="text"
                name="description"
                value= {this.state.currentUser.password}
                onChange={(e) => this.handleChange("password", e)}
                placeholder="Enter Password"
              />
            </FormGroup>
            <FormGroup check>
              <Label for="isAdmin">
                <Input
                  type="checkbox"
                  name="isAdmin"
                  checked= {this.state.currentUser.isAdmin}
                  onChange={(e) => this.handleChange("checkbox", e)}
                />
                Mark as Admin
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.currentUser)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}