import Cookies from "universal-cookie";

const cookies = new Cookies();

// TODO: get cookie("permission ID") not real

export const SetToken = async (name, token) => {
    cookies.set(name, token,
        { path: '/', secure: true, sameSite: true }
    );
};

export const RemoveToken = (name) => {
    cookies.remove(name);
};

export const GetAuthToken = () => {
    if (cookies.get('token') === undefined) {
        return '';
    }
    return cookies.get('token');
};

export const GetToken = (name) => {
    if (cookies.get(name) === undefined) {
        return '';
    }
    return cookies.get(name);
};

export const RemoveAllToken = () =>{
    RemoveToken("token")
    RemoveToken("email")
    RemoveToken("permission_id")
    RemoveToken("permission")
    RemoveToken("level")
}