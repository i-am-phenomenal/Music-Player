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
            user: {
                isAdmin: false,
                userUuid: ""
            },
            allUsers: []
        }
    };

    getAllUsersData = () => {
        let customUrl = "http://localhost:8000/api/get_all_users/";
        axios 
        .get(customUrl)
        // .then(response => console.log(response.data, "111111111111"))
        .then(response => this.setState({allUsers: response.data}))
        .catch(error => alert(error));
    }

    componentDidMount() {
        let userUuid = window.sessionStorage.getItem("user")
        let isAdmin = window.sessionStorage.getItem("isAdmin")
        let userObject = {
            isAdmin: isAdmin,
            uuid: userUuid
        }
        this.setState({user: userObject});
        if (isAdmin) {
            this.getAllUsersData()
        }
    }

    renderAdminView = () => {
        let users = this.state.allUsers;
        const TableRow = ({row}) => (
            <tbody>
                <tr>
                <td key={row.uuid}>{row.uuid}</td>
                <td key={row.username}>{row.username}</td>
                <td key={row.password}>{row.password}</td>
                <td key={row.isAdmin}>{row.isAdmin}</td>
                <td key={row.isLoggedIn}>{row.isLoggedIn}</td>
                </tr> 
            </tbody>
          )

          const Table = ({data}) => (
            <table>
              {data.map(row => {
                  console.log(row, 'ROW ')
                return <TableRow row={row} />
              })}
            </table>
          )
        
          return <Table data={users} />
        // return users.map(item => (
        //     <li className="list-group-item d-flex justify-content-between align-items-center">

        //     </li>
        // ))
    }

    render() {
        return (
            <div> 
                {this.renderAdminView()}
                </div>
        )
    }
}