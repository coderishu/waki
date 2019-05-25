import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WakiServiceService } from 'src/app/service/waki-service.service';
import { ChangeLangService } from 'src/app/provider/change-lang.service';
import {appConstant} from '../../constant/app.constant';
import {Router} from '@angular/router';
import {CurrencyconvertService} from '../../provider/currencyconvert.service';
import { ToastrService } from 'ngx-toastr';
import {CartdetailService} from '../../provider/cartdetail.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $:any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
cartResponse:any={};
currentLanguageData: any = {};
bagDetail:any={};
fullResponse: any = "";
addresses:any=[];
notfoundcart:boolean=true;
cartdetail:CartdetailService;
cartcount:any='';
selectedAddress:any={};
chooseAddress:any="";
cartResponseLength;any='';
address:any=[];
radiovalue:any="";
userResponse: any = {};
dontshow:boolean=false;
productDetail: any = [];
response:any=[];
user: any = {};
dataa: any = {}
@ViewChild('show') show: ElementRef;
  userExist:boolean = false;
  constructor(cartdetail:CartdetailService,private ngxloader:NgxUiLoaderService,private wakiservice: WakiServiceService,private router:Router,private toastr: ToastrService,private currencyConvertService:CurrencyconvertService,private languageTranslateInfoService:ChangeLangService)
  {
    this.cartdetail = cartdetail;
    // this.cartdetail.currentMessage.subscribe(data => {
    //   this.cartcount = data;
    //   console.log("cartcount>>>>.carttttt 44", this.cartcount);
    //           });
    this.cartList();
    languageTranslateInfoService.translateInfo.subscribe((data) => {
      if(data){

                 this.currentLanguageData = data;
                 console.log("currentlanguage",this.currentLanguageData['currencyData']['sign']);
               }
       });
       $("html, body").animate({ scrollTop: 0 }, "slow");
       if((localStorage.getItem('userLoginDetail'))||localStorage.getItem("sociallogin") || localStorage.getItem("register") )
       {
        this.user = (JSON.parse(localStorage.getItem('userLoginDetail'))|| JSON.parse(localStorage.getItem("sociallogin")) || JSON.parse(localStorage.getItem("register")));
        this.userExist=true;
        // this.userResponse = this.user['result'];
   }
  }

cartList(){
  let URL = appConstant.baseUrl + `vendor/listOfAddCart/?lang=${this.currentLanguageData['lng_code']}`;
  this.wakiservice.createGetRequest(URL,1).subscribe((response: any) => {
    this.cartResponse = response['result'];
    this.cartResponseLength = Object.keys(this.cartResponse).length;
    this.productDetail = this.cartResponse['productDetail'];
    if(this.cartResponseLength > 0) {
this.cartcount = this.productDetail.length || this.cartResponseLength;
    }
    else {
      this.cartcount = this.cartResponseLength;
    }
    this.bagDetail = this.cartResponse['bagDetails'];
    this.addresses = this.cartResponse['address'];
    this.cartdetail.changeMessage(this.cartcount);
    this.notfoundcart = false;
    if (this.cartResponseLength == 0) {
this.notfoundcart = true;
this.toastr.error("Empty list please add products")
    }
});
}
modal(event){
  this.addresses[0].addresses = event.addresses;
  this.selectedAddress = event;
  console.log("selectedaddress", this.selectedAddress);
}
removecart(productId){
  let URL =  appConstant.baseUrl + 'vendor/deleteCart';
  this.dataa={"productId": productId,"lang": this.currentLanguageData['lng_code']}
  this.wakiservice.createPostRequest(URL,this.dataa,1).subscribe(response=>{
    if(response.statusCode === 200){
      this.cartdetail.changeMessage(this.cartcount);
      console.log("cartcount>>>cart",this.cartcount);
      this.cartList();
     }
  });
}
radioChange(value){
this.radiovalue = value;
if(this.radiovalue=='online'){
  const node = document.createElement('script');
                node.src = 'https://www.paytabs.com/express/v4/paytabs-express-checkout.js';
                node.type = 'text/javascript';
                node.setAttribute("id","paytabs-express-checkout"),
                node.setAttribute("data-secret-key","HaypqELLChscu03jPMAMhV3DzHgnBcninVINAtzdL1qf2tzSf9Ex5IbEpr21Eqj1m2PWvpagrAwt35ljf0QkI2Z8t197rt9NvYK0"),
                node.setAttribute("data-merchant-id","10041158"),
                node.setAttribute("data-url-redirect" , 'https://waki.store:6262/home'),
                node.setAttribute("data-amount",this.bagDetail['bagTotal']),
                node.setAttribute("data-currency", 'SAR'),
                // node.setAttribute("data-currency", 'INR'),
                node.setAttribute("data-title",'ishu'),
                node.setAttribute("data-product-names","Iphone"),
                node.setAttribute("data-order-id","25"),
                node.setAttribute("data-customer-phone-number",this.user['phone']),
                node.setAttribute("data-customer-email-address",this.user['email']),
                node.setAttribute("data-customer-country-code",this.user['countryCode']),
                document.getElementsByTagName('head')[0].appendChild(node);
setTimeout(() => {
  $(".PT_open_iframe").trigger("click");
}, 1000);
}
}
addToWishlist(pdetail)
  {
    if(localStorage.getItem("userLoginDetail") || localStorage.getItem("register") || localStorage.getItem("sociallogin"))
    {
      let URL = appConstant.baseUrl+`vendor/addToWishList`;
      this.dataa={"lang":this.currentLanguageData['lng_code'],"productId":pdetail['productId'],"size":pdetail['size'],"color":pdetail['color'],"material":pdetail['material']}
      this.wakiservice.createPostRequest(URL, this.dataa,1).subscribe((response: any) => {
        if(response['statusCode'] === 200)
        {
          this.toastr.success(response['statusMessage']);
        }
        else{
    this.toastr.error(response['statusMessage']);
        }

      });
    }
    else{
      this.toastr.error("you are not logged in ");
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
      }

  }
getPaymentList(){
  if (this.cartResponse.length === 0) {
    this.toastr.error("please add product into your cart")
return;
  }
  if(this.addresses.length > 1) {
    this.chooseAddress = this.selectedAddress['_id'];
    // console.log("chooseaddress",this.chooseAddress,"radiovalue",this.radiovalue);
  }
  if(this.addresses.length == 1) {
    this.chooseAddress = this.addresses[0]['_id'];
  }
  if(this.chooseAddress == undefined || this.radiovalue == "") {
    this.toastr.error("please create address or select payment category")
    return;
  }
  let URL = appConstant.baseUrl + 'vendor/checkoutOrder';
  let data = {"lang":this.currentLanguageData['lng_code'],"addressId": this.chooseAddress,"orderPayment": this.radiovalue};
this.wakiservice.createPostRequest(URL, data, 1).subscribe((response: any) => {
this.response = response;
this.toastr.success(response['statusMessage']);
this.router.navigate(['/home']);
});
}
increaseQuantity(val,cart_id,type){
  if(type == 'increase'){
    document.getElementById("quantvalue").innerHTML = val;
    let data;
    if(this.userExist){
      data = {"lang": this.currentLanguageData['lng_code'],"quantity":val+1,"cart_id":cart_id,"user_id":this.user._id};
    }
    else{
      data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"quantity":val+1,"cart_id":cart_id};
    }
    let URL =  appConstant.baseUrl+'vendor/update_cart';
    this.wakiservice.createPostRequest(URL,data,0).subscribe(response=>{
      if(response.status){
        this.cartList();
       }
    });
   }
   else if(type == 'decrease'){
    let data;
   if(val>1){
      if(this.userExist){
        data = {"lang":this.currentLanguageData['lng_code'],"quantity":val-1,"cart_id":cart_id,"user_id":this.user.id};
      }
      else{
        data = {"lang":this.currentLanguageData['lng_code'],"quantity":val-1,"cart_id":cart_id};
      }
      let URL =  appConstant.baseUrl+'vendor/update_cart';
     this.wakiservice.createPostRequest(URL,data,0).subscribe(response=>{
        if(response.status){
          this.cartList();
          }
      });
    }

   }
}
ngAfterViewInit(): void {
  $('.addqty').on('click', function(){
    var $qty=$(this).closest('.wakichqtypro').find('.form-control');
    var currentVal = parseInt($qty.val());
    if (!isNaN(currentVal)) {
        $qty.val(currentVal + 1);
    }
});

}
}
