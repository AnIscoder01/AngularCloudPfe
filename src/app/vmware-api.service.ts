import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VmwareApiService {

  private API_SERVER = "http://localhost:4200/api";      
  
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
   
 
  getVmList():Observable<any> {    
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
	  return this.httpClient.get(this.API_SERVER+"/vms", {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  getVmById(id:string) : Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    return this.httpClient.get(this.API_SERVER+"/vms/"+id, {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  addVm(nom:string, template_vm_id: string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    let body = {"name":nom, "parentId":template_vm_id} ;
    return this.httpClient.post(this.API_SERVER+"/vms", body, {headers: httpHeaders}).pipe(catchError(this.handleError));
    
  }
   
  updateVm(id:string, cpu:number, ram:number) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    let _cpu:number=cpu;
    let body = {"processors":_cpu, "memory": ram};
    alert (JSON.stringify(body));
    return this.httpClient.put(this.API_SERVER+"/vms/"+id, body, {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  deleteVm(id:string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    return this.httpClient.delete(this.API_SERVER+"/vms/"+id, {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  powerVmOn(id:string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    
    return this.httpClient.put(this.API_SERVER+"/vms/"+id+"/power", "on", {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  powerVmOff(id:string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    
    return this.httpClient.put(this.API_SERVER+"/vms/"+id+"/power", "off", {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  getVmPowerState(id:string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    return this.httpClient.get(this.API_SERVER+"/vms/"+id+"/power", {headers: httpHeaders}).pipe(catchError(this.handleError));
  }

  getVmIp(id:string):Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type':  'application/vnd.vmware.vmw.rest-v1+json',
      'Accept':  'application/vnd.vmware.vmw.rest-v1+json',
      'Authorization': 'Basic ' + btoa('admin:Admin123*')
    });
    return this.httpClient.get(this.API_SERVER+"/vms/"+id+"/ip", {headers: httpHeaders}).pipe(catchError(this.handleError));
  }
  
}
