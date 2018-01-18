import {Component, Input, ComponentFactoryResolver, ViewChild, OnInit} from '@angular/core';
import {Directory} from './directory';
import {Classification} from './classification';
import {ClassificationFi} from './classification-fi';

import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';

import { User } from '../model/user';
import {Observable} from 'rxjs/Observable';
@Component({
    selector: 'tree-view',
    templateUrl: './tree-view.html',
    styleUrls  : ['tree-view.css']
})
export class TreeView implements OnInit {
    @Input() directories: Array<Directory>;
    @Input() Classification: Array<Classification>;
    ClassificationFi: Array<ClassificationFi>;
    showIcon = false;
    expanded = false;
    icon = null;
    result: any;
    classification: Classification[] = [];
    classificationFi: ClassificationFi[] = [];
    position = 'right';
    positionprod = 'left';
    ifAdmin: any;
    currentUser: User;
	product:any;
	loading: boolean = false;
	count : number = 1;
	// drag and drop
	test: boolean = false;
    transferData: Object = {id: 1, msg: 'Hello', draw: true};
    receivedData: Array<any> = [];	
    selected : any;
	selectedId : any;
	selectedName : any;
    constructor(private componentResolver: ComponentFactoryResolver,
                private router: Router, private _http: Http){
	this.currentUser = JSON.parse(localStorage.getItem("currentUser"));    
	if (localStorage.getItem('currentUser')) {
           	this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
   	   	console.log(this.currentUser);
		
        }
	if (localStorage.getItem('ifAdmin') == "true") {
	   this.ifAdmin = true;	
   	   console.log("tes if "+localStorage.getItem('ifAdmin'));	
	}
   	   console.log(localStorage.getItem('ifAdmin'));
	
    	}
    ngOnInit(){
		
        console.log("From tree view =>"+this.Classification);        
         this.getAttribut();
	this.getDataFiliale();
	console.log("loading Finish oninit -- => ",this.loading);
    }
    /*expand(){
        this.expanded = !this.expanded;
        this.icon = this.getIcon();
    }*/
    getIcon(cl:any){
        if (cl.showIcon === true) {
          if(cl.expanded){
            return '- ';
          }
          return '+ ';
        }
        return null;
    }
    toggle(cl:Classification){
        console.log("aff =>"+this.classification["0"]);
        cl.icon = '-';
        cl.expanded = !cl.expanded;
        cl.icon = this.getIcon(cl);
    }
    toggle2(cl:any){
        
        cl.expanded = !cl.expanded;
        cl.icon = this.getIcon(cl);
    }
    getData():void {
        this._http.get("/api/test")
         .subscribe(result =>
            this.result = result.json()
         );
         console.log(this.result);
         
     }
     getResult():void {
         console.log(this.Classification["Classification"]);
         
         
         
     }
     getAttribut():any {
        console.log(this.Classification["0"].Classification);
        
        this.classification = this.Classification["0"].Classification["0"].Classification;
        console.log(this.classification);
        
        // this.classification = this.Classification["Classification"].Classification;
        this.classification["0"].icon = '+';
        for( let cl of this.classification){
           cl.expanded = false;
           cl.checked = false;
           cl.showIcon = true;
           cl.icon = '+';
           for( let cl2 of cl.Classification){
               cl2.expanded = false;
               cl2.checked = false;
               cl2.showIcon = true;
               cl2.icon = '+';
			
			setTimeout(()=>{ cl2.product = this._http.get("/api/sfa/"+cl2.attribut.ID)
        	.map(product => <any>product.json())        
         	.subscribe(product =>{
	  	 cl2.product = product,
         	console.log("SFA PROD -- => ",cl2.product.ClassificationReference["0"].attribut.ClassificationID, "GMC lv1 => ",cl2.Name["0"])
			if(cl2.product != null){
				this.count ++;
			}
		})}, 3000);

               if(cl2.Classification){
                    for( let cl3 of cl2.Classification){
                   cl3.expanded = false;
                   cl3.checked = false;
                   cl3.showIcon = true;
                   cl3.icon = '+';
		
setTimeout(()=>{ cl3.product = this._http.get("/api/sfa/"+cl3.attribut.ID)
        	.map(product => <any>product.json())        
         	.subscribe(product =>{
	  	 cl3.product = product,
         	console.log("SFA PROD -- => ",cl3.product.ClassificationReference["0"].attribut.ClassificationID, "GMC lv2 => ",cl3.Name["0"])
			if(cl3.product != null){
				this.count ++;
			}
		})}, 3000);


		//dczdzeadzed
		if(cl3.Classification){
                    for( let cl4 of cl3.Classification){
                   cl4.expanded = false;
                   cl4.checked = false;
                   cl4.showIcon = true;
                   cl4.icon = '+';
			setTimeout(()=>{ cl4.product = this._http.get("/api/sfa/"+cl4.attribut.ID)
        	.map(product => <any>product.json())        
         	.subscribe(product =>{
	  	 cl4.product = product,
         	console.log("SFA PROD -- => ",cl4.product, "=> GMC  lv3=>", cl4.Name["0"])
			if(cl4.product != null){
				this.count ++;
				console.log("count => ",this.count );
				if(this.count == 1470){
               				this.loading = true;
					console.log("count final => ",this.count );
				}
			}
		})}, 3000);
			
			//attribut LINK
		/*if(cl4.product.AttributeLink){
			for( let att1 of cl4.product.AttributeLink){
				//ICI
			}
		}*/

	}
		}
                   }
               }
		
           }
               
        }
	console.log("loading Finish -- => ",this.loading);
		
		
	return this.classification;        
    }
    getDataFiliale():void {
	if ( ((localStorage.getItem('ifAdmin') == "true")) && (( this.currentUser.structure == "filiale1" ) || ( this.currentUser.structure == "manutan"))) {
        this._http.get("/api/xslstest")
        .map(ClassificationFi => <ClassificationFi[]>ClassificationFi.json())        
         .subscribe(ClassificationFi =>{
	   setTimeout(()=>{ this.ClassificationFi = ClassificationFi }, 3000),
	   this.ClassificationFi = ClassificationFi,
         console.log("FILIALE => ",this.ClassificationFi),
	this.getAttributFi()
	});
        }else{
		this.ClassificationFi = null;	
	}
		
     }
    getAttributFi():any {
        
	if ((localStorage.getItem('ifAdmin') == "true") && (( this.currentUser.structure == "filiale1" ) || ( this.currentUser.structure == "manutan"))) {
		console.log("heho",this.ClassificationFi);
	
        this.ClassificationFi["0"].icon = '+';
        for( let cl of this.ClassificationFi){
           cl.expanded = false;
           cl.checked = false;
           cl.showIcon = true;
           cl.icon = '+';
       	   console.log("TEST F",cl);
	   console.log("CL =>",cl.classification);		
           for( let cl2 of cl.classification){
       	   	console.log("RENTrE",cl2);
               cl2.expanded = false;
               cl2.checked = false;
               cl2.showIcon = true;
               cl2.icon = '+';
		if(cl2.models){
                   			for( let cl22 of cl2.models){
                   				cl22.expanded = false;
                   				cl22.checked = false;
                   				cl22.showIcon = true;
                  	 			cl22.icon = '+';
						console.log("=> MIG ", cl22 );
						//Integration d attribut Last level
						if(cl22.products){
							for( let prod2 of cl22.products){
                   					prod2.expanded = false;
                   					prod2.checked = false;
                   					prod2.showIcon = true;
                  	 				prod2.icon = '+';
							
								if(prod2.techattrs){
								prod2.techattrs.icon = '+';
								prod2.techattrs.showIcon = true;								
								
						}
							}
						}
                   			}
	          		}
               if(cl2.classification){
                    for( let cl3 of cl2.classification){
                   cl3.expanded = false;
                   cl3.checked = false;
                   cl3.showIcon = true;
                   cl3.icon = '+';
		   if(cl3.models){
                   			for( let cl33 of cl3.models){
                   				cl33.expanded = false;
                   				cl33.checked = false;
                   				cl33.showIcon = true;
                  	 			cl33.icon = '+';
						console.log("=> Models ", cl33 );
						//Integration d attribut Last level
						if(cl33.products){
							for( let prod1 of cl33.products){
                   					prod1.expanded = false;
                   					prod1.checked = false;
                   					prod1.showIcon = true;
                  	 				prod1.icon = '+';
							console.log("=> PROD ", prod1 );
								if(prod1.techattrs){
								prod1.techattrs.icon = '+';
								prod1.techattrs.showIcon = true;									
								
						}
							}
						}
                   			}
		   }
		   if(cl3.classification){
                   	for( let cl4 of cl3.classification){
                   		cl4.expanded = false;
                   		cl4.checked = false;
                   		cl4.showIcon = true;
                  	 	cl4.icon = '+';
				if(cl4.models){
                   			for( let cl5 of cl4.models){
                   				cl5.expanded = false;
                   				cl5.checked = false;
                   				cl5.showIcon = true;
                  	 			cl5.icon = '+';
						console.log("=> MIG ", cl5 );
						if(cl5.products){
							for( let prod of cl5.products){
                   					prod.expanded = false;
                   					prod.checked = false;
                   					prod.showIcon = true;
                  	 				prod.icon = '+';
							console.log("=> PROD ", prod );
							if(prod.techattrs){
								prod.techattrs.icon = '+';
								prod.techattrs.showIcon = true;								
								
							}
							}
						}
				
                   			}
	          		}

                   	}
	          }
                }
              }
               
           }
               
        }
	return this.ClassificationFi;
	}else{
		this.ClassificationFi = null; 
		return this.ClassificationFi;
	}      
    }
	getDataSfa(cl:Classification,id:any) {
	
        	return this._http.get("/api/sfa/"+id)
        	.map(product => <any>product.json())        
         	.subscribe(product =>{
	  	 //setTimeout(()=>{ this.product = product }, 2000),
	  	 this.product = product,
         	console.log("SFA PROD => ",this.product)

		});
        
		
     }
transferDataSuccess($event: any , att: any) {
        alert("GOOOOOOOOOOOOOD");
        this.test = true;
	 let mapp = {classification_id : this.selectedId , sfa : null , status : "en cours"};
	mapp.classification_id = this.selectedId;
	mapp.sfa = att;
	mapp.status = 'en cours';
        this.receivedData.push(mapp);

	this.selected = "Mapping success : classification : "+ mapp.classification_id +" attribut: "+ mapp.sfa+" status : "+mapp.status; 
        console.log("cc",mapp);
    }	
getSelectedNode(id:any, name: any){
	this.selected = null;
	this.selectedId = id;
	this.selectedName = name;
	console.log("cc",id,"  ==> ", name);
}    
}