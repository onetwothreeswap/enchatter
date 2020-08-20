import React from "react";
import { Modal } from "antd";
import AddUserToChatForm from "../containers/AddUserToChatForm";


class AddUserToChatModal extends React.Component {
  render() {
    return (
      <Modal
        centered
        footer={null}
        visible={this.props.isVisible}
        onCancel={this.props.close}
      >
        <h2>Invite user to this chat</h2>
        <AddUserToChatForm />
      </Modal>
    );
  }
}

export default AddUserToChatModal;
