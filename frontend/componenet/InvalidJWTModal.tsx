
import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { OAuthSignIn } from "../utils/GoogleLogin";
import { RemoveAllToken } from "../utils/Cookie";

export default function InvalidJWTModal(prop) {
    //   const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate();
    function handleClose(){
        // remove token
        RemoveAllToken()
        window.location.reload();
    }
    
    useEffect(() => {
        // console.log("isshow:", prop.isShow)
    })
    return (
        <Modal show={prop.isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>登入過期</Modal.Title>
            </Modal.Header>
            <Modal.Body>請重新登入</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={OAuthSignIn}>
                    重新登入
                </Button>
            </Modal.Footer>
        </Modal>
    )
}