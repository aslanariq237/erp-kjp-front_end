import axios from "axios";
import { Login } from "@/core/utils/url_api";
import { defineStore } from "pinia";
import router from "@/router";


export const useAuthStore = defineStore('auth',{    
    state: () => ({
        user: JSON.parse(window.localStorage.getItem('user')) || null,  
        // isAuthenticated : false,              
    }),

    actions: {
        setAuth(data){
            var user = data.user;
            window.localStorage.setItem('isAuthenticated', 'true');              
            window.localStorage.setItem('user', JSON.stringify(user));            
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
        }
    }
})