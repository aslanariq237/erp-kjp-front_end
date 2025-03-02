import {ref} from "vue";

export function numberWithCommas(x){
    var x = x.toString().replace(".", ",");
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

export function isFLoat(n){
    return parseFloat(n) / parseFloat(n) === 1;
}   

export function dateNow() {
    var today = new Date();
    return moment(today).format("DD MMMM YYYY");
  }
  
  export function dateNowFormat() {
    var today = new Date();
    return moment(today).format("YYYY-MM-DD");
  }
  
  export function dateNowFormatWithTime() {
    var today = new Date();
    return moment(today).format("YYYY-MM-DD HH:mm:ss");
  }