import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { GetAuthToken, GetToken } from '../utils/Cookie';
import { APIUrl } from '../src/constant/global';
import { Button, Form, Modal } from 'react-bootstrap';
import { string } from 'yup';

function PerformerListPage() {
    const [performers, setPerformers] = useState([])
    const [loading, setLoading] = useState(true)
    const [ismodalShow, setIsmodalShow] = useState(false)
    const [modalAttribute, setModalAttribute] = useState({mode: "", title: "", btn: ""})
    const [isUpdateMessageShow, setIsUpdateMessageShow] = useState(false)
    const [updateMessage, setUpdateMessage] = useState("")
    const [modalPerformer, setModalPerformer] = useState({id: "", name: "", description: ""})

    useEffect(() => {
        fetchPerformerList()
        // console.log("isAuth:", isAuth)
    }, [])

    // get area list pass to select element
    const fetchPerformerList = () => {
        console.log("POST fetchPerformerList")

        // return null
        let permissionId = GetToken("permission ID").toString()
        let token = GetAuthToken()
        if (!permissionId) {
            console.log("not user can not search")
        }

        console.log(JSON.stringify({
            permission_id: permissionId,
        }))

        return fetch(`${APIUrl}/performerList`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
        })
            .then((response) => {
                console.log("response status code:", response.status)
                if(response.status != 200){
                    console.log("There is something error:", response.json()["err"])
                    setPerformers([])
                }
                return response.json()
            })
            .then((data) => {
                setPerformers(data["performers"])
                setLoading(false)
            });
    }

    const openEditPerformerModal = (performer) => {
        console.log("edit:", performer.id)
        setIsmodalShow(true)
        setModalAttribute({
            mode: "edit",
            title: "編輯",
            btn: "儲存"
        })
        setModalPerformer({
            id: performer.id,
            name: performer.name,
            description: performer.description
        })
    }

    const openDeletePerformerModal = (performer) => {
        console.log("delete:", performer)
        setModalPerformer({
            id: performer.id,
            name: performer.name,
            description: performer.description
        })

        setModalAttribute({
            mode: "delete",
            title: "刪除",
            btn: "確認刪除",
        })
        setIsmodalShow(true)
    }

    const handleModalClose = () => {
        setIsmodalShow(false)
        setIsUpdateMessageShow(false)
    }

    const  handleInputChange = (event, item) => {
        // console.log(event?.target?["value"])
        // item = event.target.value
        modalPerformer[item] = event.target.value
    }
    
    const handleUpdatePerformer = (event) => {
        // POST
        event.preventDefault();
        console.log("POST updatePerformer")
        let token = GetAuthToken()

        console.log(modalPerformer)

        return fetch(`${APIUrl}/performer/${modalPerformer?.id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                id: modalPerformer?.id.toString(),
                name: modalPerformer?.name,
                description: modalPerformer.description,
                // permissionId: "17018581147448188124",
            })
        })
        .then((response) => {
            if (response.status == 200) {
                // update list
                let newList = performers.map((performer) => {
                    if(performer["id"] == modalPerformer.id){
                        performer.name = modalPerformer.name
                        performer.description = modalPerformer.description
                        return performer
                    }
                    return performer
                })
                setPerformers(newList)
                setIsmodalShow(false)
                setIsUpdateMessageShow(true)
                setUpdateMessage("OK")
            }
            else {
                setIsmodalShow(false)
                setIsUpdateMessageShow(true)
                setUpdateMessage("Error",)
            }

        })
    }

const handleDeletePerformer = () => {
    // POST
    event.preventDefault();
    // console.log(event.target)
    console.log("POST updatePerformer")

    // return null
    let permissionId = GetToken("permission ID").toString()
    if (!permissionId) {
        console.log("not user can not search")
    }

    console.log(modalPerformer)

    return fetch(`${APIUrl}/performer/${modalPerformer.id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status == 200) {
                // remove performer from list in page
                setIsmodalShow(false)
                let newList = performers.filter((performer) => (performer.id !== modalPerformer.id))
                setPerformers(newList)
                setIsUpdateMessageShow(true)
                setUpdateMessage("OK")
            }
            else {
                setIsmodalShow(false)
                setIsUpdateMessageShow(true)
                setUpdateMessage("Error",)
            }
            setLoading(false)
        });

}

return (
    <div className='m-5'>
        {loading ? (<p>Loading...</p>) : (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>表演者</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {performers?.map((performer) => (
                        <tr>
                            <td>{performer.id}</td>
                            <td>{performer.name}</td>
                            <td>{performer.description}</td>
                            <td>
                                <Button variant="success" onClick={() => openEditPerformerModal(performer)}>編輯</Button>{'   '}
                                <Button variant="danger" onClick={() => openDeletePerformerModal(performer)}>刪除</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        )}
        <Modal show={ismodalShow} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modalAttribute.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="modal.name">
                        <Form.Label>名字</Form.Label>
                        <Form.Control
                            autoFocus
                            defaultValue={modalPerformer.name}
                            onChange={(e) => handleInputChange(e, "name")}
                            disabled={modalAttribute.mode == "delete"}
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="modal.description">
                        <Form.Label>描述</Form.Label>
                        <Form.Control as="textarea"
                            defaultValue={modalPerformer.description}
                            onChange={(e) => handleInputChange(e, "description")}
                            disabled={modalAttribute.mode == "delete"}
                            rows={3} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    取消
                </Button>
                <Button variant={modalAttribute.mode == "delete" ? "danger" : "primary"}
                    onClick={modalAttribute.mode == "delete" ? handleDeletePerformer : handleUpdatePerformer}>
                    {modalAttribute.btn}
                </Button>
            </Modal.Footer>
        </Modal>
        
        <Modal size="lg" show={isUpdateMessageShow} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>更新訊息</Modal.Title>
            </Modal.Header>
            <Modal.Body>{updateMessage}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleModalClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    </div>

);
}

export default PerformerListPage;