import { ReactNode, createContext, useState } from 'react';

import jwtDecode from 'jwt-decode';
interface authResponse {
    token: string;
    token_type: string;
    jira_authorized: boolean;
    github_authorized: boolean;
    linkage_status: string;
}
interface DecodedToken extends authResponse {
    exp: number; // Expiration timestamp
}
interface contextType {
    userDetails: authResponse;
    updateData: (obj: authResponse) => void;
    isAuthenticated: () => boolean;
}

const DataContext = createContext<contextType>({
    userDetails: {
        token: '',
        token_type: '',
        jira_authorized: false,
        github_authorized: false,
        linkage_status: '',
    },

    updateData: (obj: authResponse) => {
        obj;
    },
    isAuthenticated: () => false,
});

const { Provider } = DataContext;
interface Props {
    children: ReactNode;
}

const DataProvider = ({ children }: Props) => {
    const token = localStorage.getItem('token');

    const [userDetails, setUserDetails] = useState<authResponse>({
        token: token ? JSON.parse(token).token : '',
        jira_authorized: token ? JSON.parse(token).jira_authorized : '',
        github_authorized: token ? JSON.parse(token).github_authorized : '',
        token_type: token ? JSON.parse(token).token_type : '',
        linkage_status: token ? JSON.parse(token).linkage_status : '',
    });

    const updateData = (obj: authResponse) => {
        localStorage.setItem('token', JSON.stringify(obj));
        setUserDetails(obj);
    };

    const isAuthenticated = () => {
        if (userDetails.token && userDetails.token.trim() !== '') {
            // Check if the token is present and not empty
            const decodedToken: DecodedToken = jwtDecode(userDetails.token);

            if (decodedToken.exp * 1000 > Date.now()) {
                // Token is not expired
                return true;
            } else {
                // Token is expired, clear local storage

                localStorage.removeItem('token');

                setUserDetails({
                    token: '',
                    token_type: '',
                    jira_authorized: false,
                    github_authorized: false,
                    linkage_status: '',
                });
                return false;
            }
        }
        return false;
    };
    return <Provider value={{ userDetails, updateData, isAuthenticated }}>{children}</Provider>;
};

export { DataContext, DataProvider };
