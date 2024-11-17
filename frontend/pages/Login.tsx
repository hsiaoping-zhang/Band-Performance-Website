import React, { useEffect, useState } from "react";
import { SetToken } from "../utils/Cookie";
import { APIUrl, StatusCode } from "../src/constant/global";
import { useNavigate } from "react-router-dom";
import InfoModal from "../componenet/InformationModal";

export default function Login() {
    const navigate = useNavigate();
    const [isPendding, setIsPending] = useState(false)
    const handleClose = () => navigate("/");

    function parseAccessToken(url) {
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
                if (response.status == StatusCode.StatusAccepted) {
                    // request ok but user invalid
                    setIsPending(true)
                }
                else if (response.status == StatusCode.OK) {
                    // set token
                    return response.json()
                }
                else {
                    // there is some err
                    console.log("There is some error.")
                }
            })
            .then(async data => {
                // administrator login
                async function set() {
                    SetToken("token", data.token)
                    SetToken("level", data.level)
                }
                await set()
                navigate("/")
                location.reload()
            })
    }
    useEffect(() => {
        getUserToken()
    })

    return <div>
        <InfoModal size="medium" isShow={isPendding}
            title="注意！" info="會員功能已停用，將轉回首頁" handleClose={handleClose} />
    </div>;
}
