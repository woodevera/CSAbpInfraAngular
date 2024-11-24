import {Injectable} from '@angular/core';
import {AbpInfraService} from "./abp-infra.service";
import {FormBuilder, Validators} from "@angular/forms";
import {FieldSignatureDto, FormModeEnum, SignatureDataTypeEnum, SignatureDto} from "../models/models";
import {forkJoin, Observable} from "rxjs";
import {PagedResultRequestDto} from "@abp/ng.core";


@Injectable({
  providedIn: 'root'
})
export class CommonCrudService {

  constructor(private utilitiesService: AbpInfraService , private fb: FormBuilder) { }

  getSignatures(filterDtoName: string , gridDtoName: string , formDtoName: string): Observable<SignatureDto[]>{
    const subscriptions = [];
    if(gridDtoName?.length > 0){
      subscriptions.push(this.utilitiesService.getDtoSignature(gridDtoName));
    }
    if(filterDtoName?.length > 0){
      subscriptions.push(this.utilitiesService.getDtoSignature(filterDtoName));
    }
    if(formDtoName?.length > 0){
      subscriptions.push(this.utilitiesService.getDtoSignature(formDtoName));
    }
    if(subscriptions?.length > 0) {
      return forkJoin(subscriptions);
    }
    return null;
  }

  getSignatureElements(signatureDto: SignatureDto , hiddenElements: string[]): FieldSignatureDto[]{
    const filterElements = [];
    if(signatureDto?.fields?.length > 0) {
      signatureDto.fields.forEach(field => {
        if(hiddenElements.includes(field.name) || filterElements.indexOf(field) > -1)
        {
          return;
        }
        filterElements.push(field);
      });
    }
    return filterElements;
  }

  getSignatureDto(filterElements:FieldSignatureDto[] , filterDto: any): any{
    if(!filterDto) {
      filterDto = new PagedResultRequestDto();
    }
    if(filterElements?.length > 0) {
      filterElements.forEach(ele => {
        if(!filterDto[ele.name]) {
          if (ele.dataType === SignatureDataTypeEnum.Boolean) {
            filterDto[ele.name] = false;
          } else {
            filterDto[ele.name] = null;
          }
        }
      });
    }
    return filterDto;
  }

  getSignatureForm(dtoElements: FieldSignatureDto[] , dto: any , formMode: FormModeEnum = FormModeEnum.None) {
    const formGroup = this.fb.group({
    });
    if(dtoElements?.length > 0) {
      dtoElements.forEach(ele => {

        const validators = [];
        if(ele.isRequired) {
          validators.push(Validators.required);
        }
        if(ele.regEx?.length > 0) {
          validators.push(Validators.pattern(ele.regEx));
        }

        formGroup.addControl(ele.name , this.fb.control({value: dto[ele.name] , disabled: formMode === FormModeEnum.View} ,
          validators));
      });
    }
    return formGroup;
  }
}
