import { Pipe, PipeTransform } from '@angular/core';
import {ABP, mapEnumToOptions} from '@abp/ng.core';
import Option = ABP.Option;
import {CommonEnumService} from '../services/common-enum.service';
import {EntityLiteIntegerDto} from "../models/models";



@Pipe({
  name: 'extractFlagsFromEntityLite',
  standalone: true
})
export class ExtractFlagsFromEntityLitePipe implements PipeTransform {
  constructor(private commonEnumService: CommonEnumService) {
  }
  transform(value: any , entityLiteData: EntityLiteIntegerDto[] , enumName: string = null): unknown {
    let result = '';
    let data = [];
    if (Array.isArray(value)) {
      data = [...value];
    } else {
      data = [value];
    }
    data.forEach(val => {
      entityLiteData.forEach(ele => {
        if (val === ele.id) {
          if(enumName?.length > 0) {
            const option = this.commonEnumService.getEnumEntityLiteAsLabelValuePair(ele , enumName , 'KSchoolEnums');
            result += result?.length > 0 ? ' , ' + option.label : option.label ;
          } else {
            result += result?.length > 0 ? ' , ' + ele.label : ele.label ;
          }
        }
      });
    });
    return result;
  }

}
