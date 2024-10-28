import React, { useContext } from "react";
import { APIUrl, CLIENT_ID, REDIRECT_URI } from "../src/constant/global";
import { UserContext } from "../Context";
import { SetToken } from "./Cookie";

export enum UserStatusCode{
    REGISTERED,
    NOT_APPROVED,
    NOT_REGISTERED,
    ERROR,
}

export enum ResponseCode{
    OK = 200,
}

export function OAuthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': CLIENT_ID, // 更換成自己的資訊
        'redirect_uri': REDIRECT_URI, // 更換成自己的資訊
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

export const FetchGoogleUserInfo = (access_token) => 
    // 直接前端去向 google API 取回使用者資訊
    fetch(`https://www.googleapis.com/drive/v3/about?fields=user&access_token=${access_token}`)
    .then((response) => response.json())
    // .catch((error) => console.log(error))
    .then(data =>{
        console.log("API return:", data)
        console.log(data.user.displayName)
        return data.user
    })

export const GetUser = (permission_id) => 
    // login to get JWT 

    fetch(`${APIUrl}/user/${permission_id}`)
    .then((response) => response.json())
    // .catch((error) => console.log(error))
    .then(data =>{
        console.log("GetUser API return:", data)
        if(data.status == ResponseCode.OK){
            SetToken("email", data.user.email)
            SetToken("permission ID", permission_id)
            SetToken("permission", data.user.level)
            return data.user
        }
        else{
            return null
        }
    })

export async function CheckUserStatus(permission_id, email){
    let returnUser = await GetUser(permission_id)
    if(!returnUser){
        return UserStatusCode.NOT_REGISTERED
    }
    if(returnUser.email != email){
        console.log("user error!! not valid")
        return UserStatusCode.ERROR
    }
    else if(!returnUser.is_valid){
        return UserStatusCode.NOT_APPROVED
    }
    else{
        console.log("ee", returnUser)
        return UserStatusCode.REGISTERED
    }
}