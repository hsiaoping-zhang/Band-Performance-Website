import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { APIUrl, StatusCode } from "../src/constant/global";
import { GetAuthToken } from "../utils/Cookie";
import InfoModal from "../componenet/InformationModal"

export default function ApproveUser(){
    const [loading, setLoading] = useState(true)
    const token = GetAuthToken()
    const [users, setUsers] = useState([])
    const [isShow, setIsmodalShow] = useState(false)
    const [modalInfo, setModalInfo] = useState({title: "", info: ""})

    const fetchUnapprovedUsers = () => {
        return fetch(`${APIUrl}/user/auth/unapproved`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }
        })
        .then((response) => {
            if(response.status != StatusCode.OK){
                // there is error
                return
            }
            return response.json()
        })
        .then((data) => {
            setUsers(data["users"])
            setLoading(false)
        })
    }

    const handleApproveUser = (user) => {

        return fetch(`${APIUrl}/user/auth/approve`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                email: user["email"]
            })
        })
        .then((response) => {
            if(response.status == StatusCode.OK){
                setModalInfo({
                    title: "成功",
                    info: `使用者 ${user["name"]} 已通過`
                })
                let newUsers = users.filter((item) => (item["email"] != user.email))
                setUsers(newUsers)
            }
            else{
                // there is error
                setModalInfo({
                    title: "失敗",
                    info: `使用者 ${user["name"]} 未通過，請稍候再試一次`
                })
            }
            setIsmodalShow(true)
        })
    }

    const setIsShowClose = () => {
        setIsmodalShow(false)
    }

    useEffect(() => {
        fetchUnapprovedUsers()
    }, [])

    return (
        <div className='m-5'>
        {loading ? (<p>Loading...</p>) : (
            <>
            <h2 style={{textAlign: "center"}}>未通過申請使用者</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>名稱</th>
                        <th>Email</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user) => (
                        <tr>
                            <td>{user["id"]}</td>
                            <td>{user["name"]}</td>
                            <td>{user["email"]}</td>
                            <td>
                                <Button variant="success" onClick={() => handleApproveUser(user)}>通過</Button>{'   '}
                                {/* <Button variant="danger" onClick={() => openDeletePerformerModal(performer)}>刪除</Button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <InfoModal size="medium" isShow={isShow} title={modalInfo.title} info={modalInfo.info} handleClose={setIsShowClose} />
            </>
        )}
        </div>
        
    )
}