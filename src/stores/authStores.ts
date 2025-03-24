import axios from "axios";
import { Login } from "@/core/utils/url_api";
import { defineStore } from "pinia";
import router from "@/router";
import Swal from "sweetalert2";
import JwtServices from "@/core/services/JwtServices";

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
        user : JwtServices.getData(),         
        token : window.localStorage.getItem('token'),       
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        users : (state) => state.user,
    },

    actions: {        
        setAuth(data: { token: string | 'null'; user: string; }) {
            this.token = data.token;
            JwtServices.saveData(data.user);
            window.localStorage.setItem('token', data.token);
        },

        async login(email:string, password:string)
        {      
            return axios.post(Login, {
                email : email,
                password : password,                                
            }).then(({data}) => {
                this.setAuth(data);
                router.push('/');
            })
        } ,
        
        async logout(){            
            this.user = null;
            this.token = null;
            window.localStorage.removeItem('token')            
            window.localStorage.removeItem('user')            
            router.push('/signin');
        }
    }
})