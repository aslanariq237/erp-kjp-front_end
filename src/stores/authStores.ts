import axios from "axios";
import { Login } from "@/core/utils/url_api";
import { defineStore } from "pinia";
import router from "@/router";

interface User {
    id: number;
    name : string;
    email : string;
};

interface authData {
    user : User;
    token : string;
};

export const useAuthStore = defineStore('auth',{    
    state: () => ({        
        user : JSON.parse(window.localStorage.getItem('user') || 'null') as User | null, 
        token : window.localStorage.getItem('token'),
        isAuthenticated : false,                 
    }),

    actions: {
        setAuth(data : authData){
            this.user = data.user;
            this.token = data.token;
            window.localStorage.setItem('isAuthenticated', 'true');              
            window.localStorage.setItem('user', JSON.stringify(this.user));                    
            window.localStorage.setItem('token', data.token);                    
            router.push('/');
        },

        async login(email:string, password:string)
        {
            return axios.post(Login, {
                email : email,
                password : password
            }).then(
                ({data}) => {                    
                    this.setAuth(data);                    
                }
            )
        } ,
        
        async logout(){            
            this.user = null;
            this.token = null;
            window.localStorage.removeItem('token')            
            window.localStorage.removeItem('user')            
        }
    }
})