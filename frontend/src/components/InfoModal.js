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

export default class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDetails: this.props.userDetails,
        };
    }

    convertBooleanToString = (boolean) => {
        if (boolean) {
            return "True"
        } else {
            return "False"
        }
    }

    render() {
        const {toggle} = this.props;
        let username = this.state.userDetails.username;
        let updatedName = username + "'s"
        return (
            <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> {updatedName} Details  </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">Username</Label>
              <Input
                readOnly={true}
                name="title"
                value= {this.state.userDetails.username}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Password</Label>
              <Input
                readOnly={true}
                name="description"
                value= {this.state.userDetails.password}
              />
            </FormGroup>
            <FormGroup>
            <Label for="isAdmin">Is Admin</Label>
                <Input
                  readOnly={true}
                  name="isAdmin"
                  value=  {this.convertBooleanToString(this.state.userDetails.isAdmin)} 
                />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </Modal>
        );
    }    
}