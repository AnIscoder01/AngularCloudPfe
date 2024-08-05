import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.css'
})
export class MachinesComponent implements OnInit{

  API_SERVER:string = "http://localhost:4200/api";

  listVm: any ;
  
  constructor(private httpClient:HttpClient){}

  handleError(error: HttpErrorResponse) {	
    let errorMessage = 'Unknown Error.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    }
    else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
      
    return throwError(errorMessage);
    }

  loadVmList() {    
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
	  return this.httpClient.get(this.API_SERVER+"/vms", {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  ngOnInit(): void {
    
      this.loadVmList().subscribe(data=>{
        this.listVm = data;
      })
      
  }

}
