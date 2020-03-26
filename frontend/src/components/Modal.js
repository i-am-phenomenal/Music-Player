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
///  NEED TO MAKE A GENERALIZED FUNCTION OUT OF THIS 
  handleUsernameChange = (event) => {
    // console.log(e.target.value, "EVENT TARGET VALUE ");
    let {name, value} = event.target;
    console.log(name, "NAME");
    console.log(value, "VALUE");
    let userObject = this.state.currentUser;
    userObject.username = value
    this.setState({currentUser: userObject})
    // const currentUser = {... this.state.currentUser, [name]: value};
    // this.setState({ currentUser });  
  };

  handleChange = e => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  };
  render() {
    const { toggle, onSave } = this.props;
    return (
      <Modal isOpen={true} toggle={true}>
        <ModalHeader toggle={true}> Sign Up </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                value= {this.state.currentUser.username}
                onChange={this.handleUsernameChange}
                placeholder="Enter Username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                value= "Dummy Value 1"//{this.state.activeItem.description}
                // onChange={this.handleChange}
                placeholder="Enter Todo description"
              />
            </FormGroup>
            <FormGroup check>
              <Label for="completed">
                <Input
                  type="checkbox"
                  name="completed"
                  checked= "Dummy Value 1" //{this.state.activeItem.completed}
                  // onChange={this.handleChange}
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.activeItem)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}