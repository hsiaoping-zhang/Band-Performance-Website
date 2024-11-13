import React, { useContext, useEffect, useState } from 'react';
import { Button, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { GetAuthToken, GetToken, RemoveAllToken, RemoveToken } from '../utils/Cookie';
import { OAuthSignIn } from '../utils/GoogleLogin';
import { PermissionCode } from '../Application';

function Navbars() {
    // let token
    const[token, setToken] = useState(GetAuthToken())
    // const [isLogin, setisLogin] = useState(!!GetAuthToken())
    const isLogin = GetAuthToken() != ""
    const [permissionLevel, setPermissionLevel] = useState("guest")

    function handleLogout() {
        console.log("remove token")
        RemoveAllToken()
        window.location.reload();
    }

    function handleLogin() {
        OAuthSignIn()
    }

    useEffect(() => {
        let currentPermissionLevel = GetToken("level")
        setPermissionLevel(currentPermissionLevel)
        let thisToken = GetAuthToken()
    },)

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">表演行程</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {/* {
                            (permissionLevel == PermissionCode.Guest || !permissionLevel) ? (<Nav.Link href="/apply">權限申請</Nav.Link>) : null
                        } */}

                        {/* <Nav.Link href="/about">關於我們</Nav.Link> */}
                        <Nav.Link href="/performerActivity">查詢表演者</Nav.Link>

                        {
                            permissionLevel == PermissionCode.Admin ? (
                                <>
                                <NavDropdown title="活動編輯" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/newActivity">新增</NavDropdown.Item>
                                    <NavDropdown.Item href="/activityList">查看</NavDropdown.Item>
                                    {/* <NavDropdown.Item href="#action/3.3">刪除</NavDropdown.Item> */}
                                    
                                </NavDropdown>
                                
                                {/* <NavDropdown title="使用者" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/approveUser">待通過</NavDropdown.Item>
                                    <NavDropdown.Item href="/#">查看</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">刪除</NavDropdown.Item>
                                </NavDropdown> */}
                                </>
                            ) : null
                        }
                        {
                            (permissionLevel == PermissionCode.Admin) ? (<Nav.Link href="/performerList">編輯表演者</Nav.Link>) : null
                        }
                    </Nav>

                    <Nav>
                        {
                            isLogin ? (<Nav.Link onClick={handleLogout}>登出</Nav.Link>) : (<Nav.Link onClick={handleLogin}>登入</Nav.Link>)
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navbars;