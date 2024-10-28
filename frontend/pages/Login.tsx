import React, { useContext, useEffect, useState } from "react";
import { SetToken } from "../utils/Cookie";
import { CheckUserStatus, FetchGoogleUserInfo, UserStatusCode } from "../utils/GoogleLogin";
import { APIUrl } from "../src/constant/global";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { Button, Modal } from "react-bootstrap";
import { PermissionCode } from "../Application";
import { GOOGLE_CALLBACK_URL } from "../src/constant/global"

export default function Login() {
    const navigate = useNavigate();
    const [isPendding, setIsPending] = useState(false)
    const handleClose = () => navigate("/");
    const [isReady, setIsReady] = useState(false)

    function parseAccessToken(url) {
        console.log("url:", url)
        if (url.includes('state')) {
            const paramsPart = location.href.split('#')[1]
            const table = {}
            paramsPart.split('&').forEach((pair) => {
                const [key, value] = pair.split('=')
                table[key] = value
            })
            
            return table["access_token"]
        }
        return -1
    }

    async function getUserToken() {
        let accessToken = parseAccessToken(location.href)
        console.log(accessToken);
        
        if (accessToken == -1) {
            console.log("error: no token")
            return
        }

        // fetch to /login
        fetch(`${APIUrl}/user/auth/googleLogin`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_token: accessToken,
            })
        })
            .then((response) => {
                if(response.status == 202){
                    // request ok but user invalid
                    setIsPending(true)
                }
                else if(response.status == 200){
                    // set token
                    return response.json()
                }
                else{
                    // there is some err
                    console.log("There is some error.")
                }
            })
            .then(async data => {
                // console.log("API return:", data)
                async function set() {
                    SetToken("token", data.token)
                    SetToken("level", data.level)
                }
                await set()
                navigate("/")
                location.reload()
            })

        // // 使用回傳參數 access_token，去向 google API 取回使用者資訊
        // let userResult
        // try {
        //     userResult = await FetchGoogleUserInfo(accessToken)
        // } catch (err) {
        //     console.log(err)
        // }
        // console.log("result:", userResult)

        // // check with DB
        //  console.log("permission id:", userResult.permissionId)

        // // if valid, redirect to home page
        // // let userStatus = await CheckUserStatus(userResult.permissionId, userResult.emailAddress)
        // let userStatus = UserStatusCode.NOT_APPROVED
        // switch (userStatus) {
        //     case UserStatusCode.REGISTERED:
        //         console.log("user exist, redircet to home login")
        //         await SetToken("token", accessToken)
        //         navigate("/")
        //         break
        //     case UserStatusCode.ERROR:
        //         // if invalid, popup modal
        //         console.log("something error")
        //         navigate("/")
        //         break
        //     case UserStatusCode.NOT_APPROVED:
        //         // popup modal
        //         console.log("waiting admin to approved")
        //         setIsPending(true)
        //         // navigate("/")
        //         break
        //     case UserStatusCode.NOT_REGISTERED:
        //         console.log("user not exist, create")
        //         fetch(`${APIUrl}/user/apply`, {
        //             method: "POST",
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({
        //                 name: userResult.displayName,
        //                 email: userResult.emailAddress,
        //                 permission_id: userResult.permissionId,
        //                 last_login_time: new Date(),
        //                 level: PermissionCode.Guest,
        //             })
        //         })
        //             .then((response) => response.json())
        //             .then(data => {
        //                 console.log("API create apply return:", data)
        //                 SetToken("permission", "guest")
        //                 setIsPending(true)
        //                 // navigate("/")
        //             })
        // }
    }


    useEffect(() => {
        // console.log("parse url")
        getUserToken()
    })

    return <div>
        <Modal show={isPendding} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>成功申請</Modal.Title>
            </Modal.Header>
            <Modal.Body>已經成功提交申請，請耐心等待，將自動轉回首頁</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    </div>;
}
