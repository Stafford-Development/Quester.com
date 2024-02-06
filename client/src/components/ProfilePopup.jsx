import React, { useState } from 'react';
import { Image, Dropdown } from 'react-bootstrap';
//import '../styling/App.css';

const ProfilePopup = ({ profilePicUrl }) => {
 

  return (
    <Dropdown >
      <Dropdown.Toggle  id="dropdown-basic" >
        <Image src={profilePicUrl} width={55} height={55} roundedCircle />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.Item href="#/action-1">Settings</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfilePopup;