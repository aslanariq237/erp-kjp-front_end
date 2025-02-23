import type { App } from 'vue'
import type { AxiosResponse, AxiosInstance } from 'axios'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from './JwtServices'

class ApiService {
  public static AxiosInstance: App

  public static init(app: App<Element>) {
    ApiService.AxiosInstance = app
    ApiService.AxiosInstance.use(VueAxios, axios)
    ApiService.AxiosInstance.axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL
  }

  public static setHeader(): void {
    ApiService.AxiosInstance.axios.create({
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${JwtService.getToken()}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.AxiosInstance.axios.get(resource, params)
  }

  public static get(resource: string, slug = '' as string): Promise<AxiosResponse> {
    return ApiService.AxiosInstance.axios.get(`${resource}`)
  }
}
export default ApiService

// import type { App } from "vue";
// import type { AxiosResponse } from "axios";
// import axios from "axios";
// import VueAxios from "vue-axios"
// import JwtService from "./JwtServices";

// /**
//  * @description service to call HTTP request via Axios
//  */
// class ApiService {
//     /**
//      * @description property to share vue instance
//      */
//     public static AxiosInstance: App;
<<<<<<< HEAD

//     /**
//      * @description initialize vue axios
//      */
// public static init(app: App<Element>) {
//   ApiService.AxiosInstance = app;
//   ApiService.AxiosInstance.use(VueAxios, axios);
//   ApiService.AxiosInstance.axios.defaults.baseURL =
//     import.meta.env.VITE_APP_API_URL;
// }

//     /**
//      * @description set the default HTTP request headers
//      */
// public static setHeader(): void {
//   ApiService.AxiosInstance.axios.defaults.headers.common[
//     "Authorization"
//   ] = `Bearer ${JwtService.getToken()}`;
//   ApiService.AxiosInstance.axios.defaults.headers.common["Accept"] =
//     "application/json";
//     ApiService.AxiosInstance.axios.defaults.headers.common["Access-Control-Allow-Credentials"] =
//     "true";
//     ApiService.AxiosInstance.axios.defaults.headers.common["Access-Control-Allow-Origin"] =
//     "*";
// }

=======
  
//     /**
//      * @description initialize vue axios
//      */
    // public static init(app: App<Element>) {
    //   ApiService.AxiosInstance = app;
    //   ApiService.AxiosInstance.use(VueAxios, axios);
    //   ApiService.AxiosInstance.axios.defaults.baseURL =
    //     import.meta.env.VITE_APP_API_URL;
    // }
  
//     /**
//      * @description set the default HTTP request headers
//      */
    // public static setHeader(): void {
    //   ApiService.AxiosInstance.axios.defaults.headers.common[
    //     "Authorization"
    //   ] = `Bearer ${JwtService.getToken()}`;
    //   ApiService.AxiosInstance.axios.defaults.headers.common["Accept"] =
    //     "application/json";
    //     ApiService.AxiosInstance.axios.defaults.headers.common["Access-Control-Allow-Credentials"] =
    //     "true";
    //     ApiService.AxiosInstance.axios.defaults.headers.common["Access-Control-Allow-Origin"] =
    //     "*";
    // }
  
>>>>>>> 226189582dfabce14d82875663c16c503a3a7253
//     /**
//      * @description send the GET HTTP request
//      * @param resource: string
//      * @param params: AxiosRequestConfig
//      * @returns Promise<AxiosResponse>
//      */
<<<<<<< HEAD
// public static query(resource: string, params: any): Promise<AxiosResponse> {
//   return ApiService.AxiosInstance.axios.get(resource, params);
// }

=======
    // public static query(resource: string, params: any): Promise<AxiosResponse> {
    //   return ApiService.AxiosInstance.axios.get(resource, params);
    // }
  
>>>>>>> 226189582dfabce14d82875663c16c503a3a7253
//     /**
//      * @description send the GET HTTP request
//      * @param resource: string
//      * @param slug: string
//      * @returns Promise<AxiosResponse>
//      */
//     public static get(
//       resource: string,
//       slug = "" as string
//     ): Promise<AxiosResponse> {
//       return ApiService.AxiosInstance.axios.get(`${resource}`);
//     }
<<<<<<< HEAD

=======
  
>>>>>>> 226189582dfabce14d82875663c16c503a3a7253
//     /**
//      * @description set the POST HTTP request
//      * @param resource: string
//      * @param params: AxiosRequestConfig
//      * @returns Promise<AxiosResponse>
//      */
//     public static post(resource: string, params: any): Promise<AxiosResponse> {
//       return ApiService.AxiosInstance.axios.post(`${resource}`, params);
//     }
<<<<<<< HEAD

=======
  
>>>>>>> 226189582dfabce14d82875663c16c503a3a7253
//     /**
//      * @description send the UPDATE HTTP request
//      * @param resource: string
//      * @param slug: string
//      * @param params: AxiosRequestConfig
//      * @returns Promise<AxiosResponse>
//      */
//     public static update(
//       resource: string,
//       slug: string,
//       params: any
//     ): Promise<AxiosResponse> {
//       return ApiService.AxiosInstance.axios.put(`${resource}`, params);
//     }
<<<<<<< HEAD

=======
  
>>>>>>> 226189582dfabce14d82875663c16c503a3a7253
//     /**
//      * @description Send the PUT HTTP request
//      * @param resource: string
//      * @param params: AxiosRequestConfig
//      * @returns Promise<AxiosResponse>
//      */
//     public static put(resource: string, params: any): Promise<AxiosResponse> {
//       return ApiService.AxiosInstance.axios.put(`${resource}`, params);
//     }
<<<<<<< HEAD

=======
  
>>>>>>> 226189582dfabce14d82875663c16c503a3a7253
//     /**
//      * @description Send the DELETE HTTP request
//      * @param resource: string
//      * @returns Promise<AxiosResponse>
//      */
//     public static delete(resource: string): Promise<AxiosResponse> {
//       return ApiService.AxiosInstance.axios.delete(resource);
//     }
//   }
<<<<<<< HEAD

//   export default ApiService;
=======
  
//   export default ApiService;
>>>>>>> 226189582dfabce14d82875663c16c503a3a7253
