import React from "react";
import { NavLink } from "react-router-dom";
import Circle from "./Circle";
import {getChatName} from "../store/utility";

const Contact = props => (
  <NavLink to={`${props.chatURL}`} style={{ color: "#fff" }}>
    <li className="contact">
      <div className="wrap">
        <span className={`contact-status ${props.status}`} />
        <Circle username={props.participants[0].username} size={36}/>
        <div className="meta">
          <p className="name">{getChatName(props.participants)}</p>
          {/* <p className="preview">You just got LITT up, Mike.</p> */}
        </div>
      </div>
    </li>
  </NavLink>
);

export default Contact;
