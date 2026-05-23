import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class UserBackendService {

  private API_SERVER = "";
  
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
   
 
  getUserList():Observable<any> {    
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json',
    });
	  return this.httpClient.get(this.API_SERVER+"/api/users", {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  getUsersNumber():Observable<any> {    
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json',
    });
	  return this.httpClient.get(this.API_SERVER+"/api/nbrusers", {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  

  addUser(user:User) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json',
    });
    
    return this.httpClient.post(this.API_SERVER+"/api/adduser", user, {headers: httpHeaders}).pipe(catchError(this.handleError));
    
  }
  

  getMyLogs(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_SERVER + "/api/usage/my")
      .pipe(catchError(this.handleError));
  }

  getMyTotalMinutes(): Observable<number> {
    return this.httpClient.get<number>(this.API_SERVER + "/api/usage/my/total")
      .pipe(catchError(this.handleError));
  }

  getAllLogs(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_SERVER + "/api/usage/all")
      .pipe(catchError(this.handleError));
  }

  /*
  getUserById(id:string) : Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json',
    });
    return this.httpClient.get(this.API_SERVER+"/vms/"+id, {headers: httpHeaders}).pipe(catchError(this.handleError));
  }
    */

  /*
  updateUser(id:number, user:User) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    
    return this.httpClient.put(this.API_SERVER+"/updateuser/"+id, user, {headers: httpHeaders}).pipe(catchError(this.handleError));
  }
    */

  // verifyUser(username:string, password:string) {
  //   let httpHeaders = new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Accept':  'application/json',
  //   });
  
  //   return this.httpClient.get(this.API_SERVER+"/verifyuser?username="+username+"&password="+password, {headers: httpHeaders}).pipe(catchError(this.handleError));
  // }

login(username: string, password: string): Observable<any> {
  return this.httpClient.post(
    this.API_SERVER + "/api/auth/signin",
    {
      username,
      password
    }
  ).pipe(catchError(this.handleError));
}

  register(payload: { username: string; email: string; password: string; role: string[] }): Observable<any> {
  return this.httpClient.post(this.API_SERVER + '/api/auth/signup', payload)
    .pipe(catchError(this.handleError));
}
  deleteUser(id:number) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':  'application/json',
    });
    return this.httpClient.delete(this.API_SERVER+"/deleteuser/"+id, {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  
  
}
