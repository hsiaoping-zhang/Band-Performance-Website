import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { GetAuthToken, GetToken } from '../utils/Cookie';
import { APIUrl, DOMAIN } from '../src/constant/global';
import { Badge, Button, Card, Col, Form, ListGroup, Modal, Row, Spinner, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ActivityListPage() {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [ismodalShow, setIsmodalShow] = useState(false)
    // const [modalAttribute, setModalAttribute] = useState({})
    const [isUpdateMessageShow, setIsUpdateMessageShow] = useState(false)
    const [updateMessage, setUpdateMessage] = useState("")
    const [modalActivity, setModalActivity] = useState({})
    const token = GetAuthToken()

    const navigate = useNavigate();

    useEffect(() => {
        fetchActivityList()
    }, [])

    const convertTime = (time, datailTime = true) => {
        let selectedTime = new Date(time)
        let weekdays = "日,一,二,三,四,五,六".split(",");
        let timeString = `${selectedTime.getFullYear()} 年 ${(selectedTime.getMonth() + 1).toString().padStart(2, "0")} 月 ${(selectedTime.getDate()).toString().padStart(2, "0")} 日 (${weekdays[selectedTime.getDay()]})`
        return datailTime ? timeString + ` ${selectedTime.getHours().toString().padStart(2, "0")} 時 ${selectedTime.getMinutes().toString().padStart(2, "0")} 分` : timeString
    }

    // get area list pass to select element
    const fetchActivityList = () => {
        console.log("get fetchActivityList")
        // let token = GetAuthToken()

        return fetch(`${APIUrl}/activityList`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
        })
            .then((response) => {

                if (response.status != 200) {
                    console.log("data error")
                    setActivities([])
                }
                else {
                    return response.json()
                }
            })
            .then((data) => {
                setActivities(data["activity_array"])
                setLoading(false)
            });
    }

    const openEditActivityModal = (activity) => {
        console.log("edit:", activity.id, "!!!")
        console.log("eee")
        // window.open(`${DOMAIN}/updateActivity/${activity.id}`)

        // setIsmodalShow(true)
        // setModalAttribute({
        //     mode: "edit",
        //     title: "編輯",
        //     btn: "儲存"
        // })
        // setModalPerformer({
        //     id: performer.id,
        //     name: performer.name,
        //     description: performer.description
        // })
    }

    const openDeleteActivityModal = (activity) => {
        console.log("delete:", activity)
        setModalActivity({
            id: activity.id,
            name: activity.name,
            note: activity.note,
            // performers: activity.performers
        })

        // setModalAttribute({
        //     mode: "delete",
        //     title: "刪除",
        //     btn: "確認刪除"
        // })
        setIsmodalShow(true)
    }

    const splitPerformers = (performers) => {
        let performerArray = performers.split(",")
        return performerArray.map((performer) => (
            <Badge bg="secondary" style={{ marginTop: "5px" }}>{performer}</Badge>
        ))
    }

    const handleModalClose = () => {
        setIsmodalShow(false)
        setIsUpdateMessageShow(false)
    }

    const handleDeleteActivity = (activity) => {
        console.log("delete activity")

        // let permissionId = GetToken("permission ID").toString()
        // if (!permissionId) {
        //     console.log("not user can not search")
        // }

        return fetch(`${APIUrl}/activity/${modalActivity["id"]}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                if (response.status != 200) {
                    setIsmodalShow(false)
                    setIsUpdateMessageShow(true)
                    setUpdateMessage("Error")
                    setLoading(false)
                    return
                }
                else {
                    setIsmodalShow(false)
                    let newList = activities.filter((activity) => (activity["id"] !== modalActivity["id"]))
                    setActivities(newList)
                    setIsUpdateMessageShow(true)
                    setUpdateMessage("OK")
                    setLoading(false)
                }
                return response.json()
            })

    }

    return (
        <div className='m-5'>
            <div style={{
                backgroundColor: "#1858a6",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                width: "100%", height: "50px",
                marginTop: "5px",
                textAlign: "center",
                alignContent: "center",
                fontSize: "large",
                color: "white"
            }}>
                活動清單列表
            </div>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (

                <ListGroup variant="flush">
                    {activities?.map((activity) => (
                        <ListGroup.Item className="d-flex justify-content-between align-items-start">
                            <div className="ms-6 me-auto">
                                <div className="fw-bold">{activity["name"]}</div>
                                <div>{activity["city"]} / {activity["location"]}</div>
                                <div>日期時間：{convertTime(activity["time"])}</div>
                                <div>演出者</div>
                                <Stack direction="horizontal" gap={2} style={{ fontSize: "larger" }}>
                                    {splitPerformers(activity["performers"])}
                                </Stack>
                                {activity["note"] != "" ? (
                                    <><div>備註</div>
                                        <Card body>{activity["note"]}</Card></>
                                ) : (null)}
                            </div>
                            
                            <div className="ms-1 me-auto">
                                <Col>
                                <Row  style={{marginBottom: "10px"}}>{activity["is_free"] ? (<Badge pill bg="success" style={{ marginRight: "5px" }}>免費</Badge>) : (null)}</Row>
                                <Row  style={{marginBottom: "10px"}}><Badge bg="primary" pill>
                                    {activity["area"]}
                                </Badge></Row>
                                </Col>
                            </div>

                            <div className="ms-1 ms-auto">

                                <Button variant="success" onClick={() => openEditActivityModal(activity)}>編輯</Button>{'   '}
                                <Button variant="danger" onClick={() => openDeleteActivityModal(activity)}>刪除</Button>
                            </div>

                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            <Modal show={ismodalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>刪除活動</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="modal.name">
                            <Form.Label>名字</Form.Label>
                            <Form.Control
                                autoFocus
                                defaultValue={modalActivity["name"]}
                                // onChange={() => handleInputChange("name")}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="modal.description">
                            <Form.Label>備註</Form.Label>
                            <Form.Control as="textarea"
                                defaultValue={modalActivity["note"]}
                                // onChange={() => handleInputChange("description")}
                                disabled
                                rows={1} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        取消
                    </Button>
                    <Button variant="danger"
                        onClick={handleDeleteActivity}>
                        刪除
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

export default ActivityListPage;