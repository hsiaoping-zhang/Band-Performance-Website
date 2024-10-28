import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { CurrentUser, PermissionCode } from "../Application";
import { GetToken } from "./Cookie";

const useAuth = (permissions, permission) => {
  // console.log(permissions)
  // permissions.forEach(element => {
  //   console.log(element)
  // });
  // console.log("d", found)
    // const { user } = useState(UserContext)
    // console.log("auth:", user)
    // console.log("check auth")
    // return user.name != ""
}

const ProtectedRoutes = (props) => {
    // const [isValid, setIsValid] = useState(false)

    const navigate = useNavigate();
    const handleClose = () => navigate("/");
    const isAuth = (props.permissions.indexOf(GetToken("level"))) > -1
    
    useEffect(() =>{
      
      // console.log((props.permissions.indexOf(CurrentUser.permission)))
      console.log(PermissionCode.Admin, PermissionCode.User, PermissionCode.Guest, "|", GetToken("level"))
      console.log("isAuth:", isAuth)
    }, [CurrentUser])
    // const isAuth = () => {
    //   let result = permissions.find((permission) => permission == CurrentUser.permission)
    //   console.log(result)
    //   return result
    // }
  //user物件內的permission為 permission : ["User"]
  //Account 頁面  permission 僅有 Admin 能訪問
  //Dashboard 頁面  permission User 和 Admin 都能訪問
  return isAuth ? // && user.permission.find((permission) => Permission.includes(permission)) 
  (
    <Outlet />
  ) : (
    <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>權限不足</Modal.Title>
            </Modal.Header>
            <Modal.Body>請先登入</Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
                OK
            </Button>
            </Modal.Footer>
        </Modal>
    // <Navigate to={"/"} />
  );
};

export default ProtectedRoutes;


