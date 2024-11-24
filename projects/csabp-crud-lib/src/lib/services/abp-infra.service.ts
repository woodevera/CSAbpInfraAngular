import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import {EntityLiteBooleanDto, SignatureDto} from "../models/models";

@Injectable({
  providedIn: 'root',
})
export class AbpInfraService {
  apiName = 'Default';

  getDtoSignature = (dtoName: string) =>
    this.restService.request<any, SignatureDto>({
      method: 'GET',
      url: '/api/app/abp-infra/dto-signature',
      params: { dtoName },
    },
    { apiName: this.apiName });


  constructor(private restService: RestService) {}
}
