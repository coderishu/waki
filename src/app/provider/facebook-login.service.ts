import {Host,HostListener,Injectable} from "@angular/core";
// import { GlobalData } from './app.global';
declare var FB:any;


 @Injectable()
export class FacebookLoginService {
  // private globalDataService:GlobalData
 constructor() {
   //  1881309552121280
  //  if(this.globalDataService.isBrowser){
window.onload = function(){
  
    FB.init({
    appId      : '243365436344811',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v3.2' // use graph api version 2.8
  });
  }
   
//  }
 }
 fbLogin(callBack){
    FB.login(callBack, {scope: 'public_profile,email'});
 }
 fbLogout(callback){
    	FB.logout(callback);
 }
 isLogin(){
     FB.getLoginStatus(function(response) {
     
    });
 }
 getUserData(callback){
   
     FB.api('/me',{fields: 'id,name,email,birthday,gender,picture,photos'}, callback);
 }

}