import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Machine } from './machine';
//import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class MachineBackendService {

  private API_SERVER = "http://localhost:9000";      
  
  constructor(private httpClient: HttpClient) { }

  
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
   
 
  getMachinesByOwner(username:string):Observable<any> {    
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json',
    });
    alert(username);
	  return this.httpClient.get(this.API_SERVER+"/machines/"+username, {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  

  addMachine(machine:Machine) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json',
    });
    
    return this.httpClient.post(this.API_SERVER+"/addmachine", machine, {headers: httpHeaders}).pipe(catchError(this.handleError));
    
  }
  
 
  
}
