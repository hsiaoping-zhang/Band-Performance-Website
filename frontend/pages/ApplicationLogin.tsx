import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { OAuthSignIn } from '../utils/GoogleLogin';
import { CLIENT_ID, REDIRECT_URI } from '../src/constant/global';

function ApplicationLogin() {
    return (
        <div style={{height: "100vh"}}>
            <div style={{height: "50vh", display: "flex", alignItems: "center", textAlign: "center", justifyContent:"center",}}>
                <div style={{alignItems: "center", justifyContent:"center", textAlign: "center"}}>
                    <div>這是一個文件共享平台，如需使用請使用 Google 帳戶申請權限</div>
                    <GoogleOAuthProvider clientId={CLIENT_ID} >
                        <div className='btn' onClick={OAuthSignIn}>
                                <div id="g_id_onload"
                                data-client_id={CLIENT_ID}
                                data-context="signup"
                                data-ux_mode="redirect"
                                data-login_uri={REDIRECT_URI}
                                data-auto_prompt="false">
                                </div>

                                <div className="g_id_signin"
                                    data-type="standard"
                                    data-shape="pill"
                                    data-theme="outline"
                                    data-text="signin_with"
                                    data-size="large"
                                    data-logo_alignment="left">
                                </div>
                            {/* </div> */}
                            
                        </div>
                        <div className="g-signin2" data-onsuccess="onSignIn"></div>
                    </GoogleOAuthProvider>
                    <div>聯絡方式：hsiaoping.zhang@gmail.com</div>
                </div>
            </div>
        </div>
        
    )
}
export default ApplicationLogin;