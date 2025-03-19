import axios from "axios";
import { Login } from "@/core/utils/url_api";
import { defineStore } from "pinia";
import router from "@/router";


export const useAuthStore = defineStore('auth',{    
    state: () => ({
        user: JSON.parse(window.localStorage.getItem('user')) || null,  
        token : '',
        // isAuthenticated : false,              
    }),

    actions: {
        setAuth(data){
            this.user = data.user;
            this.token = data.token;
            window.localStorage.setItem('isAuthenticated', 'true');              
            window.localStorage.setItem('user', JSON.stringify(this.user));                    
            window.localStorage.setItem('token', data.token);                    
            router.push('/');
        },

        async login(email, password)
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
            this.token = null;
            this.user = null;
            window.localStorage.removeItem(this.token)            
        }
    }
})