import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function InfoModal({ size, isShow, title, info, handleClose, btnText="OK" }) {
    return (
        <Modal size={size} show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{info}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    {btnText}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}