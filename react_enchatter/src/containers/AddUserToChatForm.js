import React from "react";
import {Form, Button, Select, Input, Checkbox} from "antd";
import axios from "axios";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as navActions from "../store/actions/nav";
import * as messageActions from "../store/actions/message";
import {HOST_URL} from "../settings";
import {getHttpClient} from "../common/http_client";

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalAddUserToChatForm extends React.Component {
    state = {
        username: "",
        comment: "",
        is_staff: "",
        is_admin: "",
        error: null,
        inviteLink: ""
    };

    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const combined = [this.props.username];
                getHttpClient().post(`${HOST_URL}/rest-auth/registration/create/`, {
                        username: values.username,
                        comment: values.comment,
                        is_staff: values.is_staff,
                        is_admin: values.is_admin,
                        // TODO remove when multi chat is supported
                        chat: 1,
                    })
                    .then(res => {
                        this.setState({inviteLink: res.data.link});
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                            error: err
                        });
                    });
            }
        });
    };

    render() {
        const {
            getFieldDecorator,
            getFieldsError,
            getFieldError,
            isFieldTouched
        } = this.props.form;

        const userNameError =
            isFieldTouched("username") && getFieldError("username");
        return (
            this.state.inviteLink === "" ? (
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                    {this.state.error ? `${this.state.error}` : null}
                    <FormItem label="Username"
                              validateStatus={userNameError ? "error" : ""}
                              help={userNameError || ""}
                    >
                        {getFieldDecorator("username", {
                            rules: [
                                {
                                    required: true,
                                    message:
                                        "Please input the username of the person you want to chat with"
                                }
                            ]
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem label="Comment">
                        {getFieldDecorator("comment")(<Input/>)}
                    </FormItem>

                    {this.props.isAdmin === true ? (
                        <Form.Item>
                            {getFieldDecorator('is_staff', {
                                valuePropName: 'checked',
                                initialValue: false,
                            })(<Checkbox>Is admin ?</Checkbox>)}
                        </Form.Item>
                    ) : null}

                    {this.props.isAdmin === true ? (
                        <Form.Item>
                            {getFieldDecorator('is_admin', {
                                valuePropName: 'checked',
                                initialValue: false,
                            })(<Checkbox>Is super admin ?</Checkbox>)}
                        </Form.Item>
                    ) : null}

                    <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError())}
                        >
                            Invite user
                        </Button>
                    </FormItem>
                </Form>
            ) : (<Input value={this.state.inviteLink}/>)
        );
    }
}

const AddUserToChatForm = Form.create()(HorizontalAddUserToChatForm);

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        token: state.auth.token,
        isStaff: state.auth.isStaff,
        isAdmin: state.auth.isAdmin,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeAddUserToChatPopup: () => dispatch(navActions.closeAddUserToChatPopup())
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddUserToChatForm)
);
