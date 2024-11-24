import { Pipe, PipeTransform } from '@angular/core';
import {ABP, mapEnumToOptions} from '@abp/ng.core';
import Option = ABP.Option;
import {CommonEnumService} from '../services/common-enum.service';

@Pipe({
  name: 'extractFlags',
  standalone: true
})
export class ExtractFlagsPipe implements PipeTransform {
  constructor(private commonEnumService: CommonEnumService) {
  }
  transform(value: any , enumType: any , enumName: string): unknown {
    let result = '';
    let data = [];
    if (Array.isArray(value)) {
      data = [...value];
    } else {
      data = [value];
    }
    const options = mapEnumToOptions(enumType);
    data.forEach(val => {
      options.forEach(ele => {
        if (val === ele.value) {
          const option = this.commonEnumService.getEnumOptionAsLabelValuePair(ele , enumName , 'KSchoolEnums');
          result += result?.length > 0 ? ' , ' + option.label : option.label ;
        }
      });
    });
    return result;
  }

}
