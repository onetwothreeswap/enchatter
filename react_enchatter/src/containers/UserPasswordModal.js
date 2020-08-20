import React from "react";
import { Modal } from "antd";
import {connect} from "react-redux";
import UserPasswordForm from "../components/UserPasswordForm";


class UserPasswordModal extends React.Component {

  render() {
    return (
      <Modal
        centered
        wrapClassName={this.props.className}
        footer={null}
        visible={this.props.isVisible}
        onCancel={this.props.close}>

        <h2>{this.props.user === null ? `Edit password` : `Edit ${this.props.user.username} password`}</h2>
         <UserPasswordForm user={this.props.user}/>

      </Modal>
    );
  }
}

const mapStateToProps = state => {
    return {
        user: state.nav.editingUserId,
    };
};


export default connect(mapStateToProps)(UserPasswordModal);
