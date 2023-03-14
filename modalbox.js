import React, { Component, Fragment } from "react";
import {
  Container,
  Card,
  Alert,
  Row,
  Col,
  ProgressBar,
  ProgressBarProps,
  ToggleButtonGroup,
  ToggleButton,
  Form,
  Modal,
  ModalBody,
  ModalDialog,
  ModalFooter,
  ModalProps,
  ModalTitle,
  ModalDialogProps,
  Button,
  Table,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { faHtml5 } from "@fortawesome/free-brands-svg-icons";
class modalbox extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      modalShow: false,
      CompleteList: [],
      value: "",

      rows: [],
      isChecked: true,
    };
  }

  handleAddRow = () => {
    const item = {
      id: new Date().getTime().toString(),
      // label: "",
      // input: "",
      // review: "",
      // check: "",
      // delete: "",
    };
    this.setState({
      rows: [...this.state.rows, item],
    });
  };

  handleDelete = (id) => {
    const { rows } = this.state;


    const filterdata = rows.filter((item) => {
      return item.id != id;
    });

    this.setState({
      rows: filterdata,
    });
  };

  render() {
    const { modalIsOpen } = this.state;
    const showModal = () => {
      this.setState({
        modalIsOpen: true,
      });
    };

    const hideModal = () => {
      this.setState({
        modalIsOpen: false,
      });
    };

    return (
      <Fragment>
        <h1 className="text-center">
          <Button variant="success" onClick={() => showModal(true)}>
            Click Me
          </Button>{" "}
        </h1>
        <Modal
          show={modalIsOpen}
          onHide={hideModal}
          style={{ marginTop: "50px" }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <th>Parameters</th>
                <th>Specifications</th>
                <th>Remarks</th>
                <th>Active</th>
              </thead>
              <tbody>
                <tr>
                  <th class="qual_param" colspan="4">
                    <b>
                      <center>Trade Parameters</center>
                    </b>
                  </th>
                </tr>
                <tr>
                  <th>Commodity *</th>
                  <td
                    class="nameofCommEnable mandatoryField enteringFields"
                    contenteditable="true"
                  ></td>
                  <td
                    class="nameofCommEnable enteringFields"
                    contenteditable="true"
                  ></td>
                  <td>
                    <input
                      type="checkbox"
                      id="EnableNameofComm"
                      name="checkbox"
                      checked="checked"
                      disabled="disabled"
                      class="mandatoryCheck"
                    />
                  </td>
                </tr>

                <tr>
                  <th>Procurement Date*</th>
                  <td
                    class="dateofCommEnable mandatoryField enteringFields"
                    title="Please enter Date in YYYY-MM-DD format"
                    contenteditable="true"
                  ></td>
                  <td
                    class="dateofCommEnable enteringFields"
                    contenteditable="true"
                  ></td>
                  <td>
                    <input
                      type="checkbox"
                      id="EnableDateofComm"
                      name="checkbox"
                      checked="checked"
                      disabled="disabled"
                      class="mandatoryCheck"
                    />
                  </td>
                </tr>

                <tr>
                  <th>Price (&#8377;/ Quintal) *</th>
                  <td
                    class="allow_only_numbers priceEnable mandatoryField enteringFields"
                    name="presentase"
                    contenteditable="true"
                  ></td>
                  <td
                    class="priceEnable enteringFields"
                    contenteditable="true"
                  ></td>
                  <td>
                    <input
                      type="checkbox"
                      name="checkbox"
                      id="EnablePrice"
                      checked="checked"
                      disabled="disabled"
                      class="mandatoryCheck"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Mode of Payment</th>
                  <td class="enablePayment enteringFields"></td>
                  <td class="enablePayment enteringFields"></td>
                  <td>
                    <input
                      type="checkbox"
                      name="checkbox"
                      id="enableModeOfPayment"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Date of Payment</th>
                  <td class="enableDoPayment enteringFields"></td>
                  <td class="enableDoPayment enteringFields"></td>
                  <td>
                    <input
                      type="checkbox"
                      name="checkbox"
                      id="enableDateOfPayment"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Delivery Location</th>
                  <td class="locationEnable enteringFields"></td>
                  <td class="locationEnable enteringFields"></td>
                  <td>
                    <input
                      type="checkbox"
                      name="checkbox"
                      id="enableLocation"
                    />
                  </td>
                </tr>

                <tr>
                  <th>Bag Size</th>
                  <td class="sizeEnable enteringFields"></td>
                  <td class="sizeEnable enteringFields"></td>
                  <td>
                    <input type="checkbox" name="checkbox" id="EnableSize" />
                  </td>
                </tr>
                <tr>
                  <th>Bag Weight</th>
                  <td class="weightEnable enteringFields"></td>
                  <td class="weightEnable enteringFields"></td>
                  <td>
                    <input type="checkbox" name="checkbox" id="EnableWeight" />
                  </td>
                </tr>
                <tr>
                  <th>Minimum Traded Quantity</th>
                  <td class="minTradeEnable enteringFields"></td>
                  <td class="minTradeEnable enteringFields"></td>
                  <td>
                    <input
                      type="checkbox"
                      name="checkbox"
                      id="EnableMinTrade"
                    />
                  </td>
                </tr>
                <tr className="new-params enteringFields">
                  <th colSpan="4" onClick={this.handleAddRow}>
                    Add other parameter +{" "}
                  </th>
                </tr>
                {this.state.rows.map((item) => (
                  <tr className="newrow " key={item.id}>
                    <td
                      className="enteringFields"
                      contentEditable="true"
                      style={{ width: "88px " }}
                    ></td>
                    <td className="enteringFields" contentEditable="true"></td>
                    <td className="enteringFields" contentEditable="true"></td>
                    <td
                    // contenteditable="true"
                    >
                      <input
                        type="checkbox"
                        name="check"
                        value="coding"
                        // checked
                        // checked="true"
                        // onChange={() => this.handleCheckbox}
                      />
                    </td>

                    <td onClick={() => this.handleDelete(item.id)}>
                      <i class="fa fa-times"></i>
                    </td>
                  </tr>
                ))}
                {/* {
                  (CompleteList.map = (item) => (
                    <tr class="newrow">
                      <td
                        class="enteringFields"
                        contenteditable="true"
                        // style={{ width: "88px " }}
                      ></td>
                      <td class="enteringFields" contenteditable="true"></td>
                      <td class="enteringFields" contenteditable="true"></td>
                      <td contenteditable="true">
                        <input
                          type="checkbox"
                          name="checkbox"
                          checked="checked"
                        />
                      </td>
                    </tr>
                  ))
                } */}
              </tbody>
            </Table>

            {/* <Row>
              <Col>
                <InputGroup>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Enter data"
                    value={this.state.value}
                    onChange={this.handleChangeData}
                  ></Form.Control>
                  <div
                    style={{ position: "relative", left: "6px", top: "4px" }}
                    onClick={this.handleItems}
                  >
                    <i className="fa fa-plus"></i>
                  </div>
                </InputGroup>
              </Col>
            </Row> */}
            {/* {CompleteList.length != 0 ? <Data /> : null} */}
            {/* {CompleteList.map((item) => (
              <li
                className="mt-3"
                style={{ backgroundColor: "rgba(163, 198, 20, 1)" }}
              >
                {item}{" "}
              </li>
            ))} */}
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}
export default modalbox;
