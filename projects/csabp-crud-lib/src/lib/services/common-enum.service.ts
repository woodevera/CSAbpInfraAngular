import { Injectable } from '@angular/core';
import {LocalizationService} from "@abp/ng.core";
import {EntityLiteIntegerDto, FormModeEnum, LabelValuePair} from "../models/models";


@Injectable({
  providedIn: 'root'
})
export class CommonEnumService {
  public formModeEnum: any;

  constructor(private localizationService: LocalizationService) {
    this.formModeEnum = FormModeEnum;
  }
  /*
  * Function Used To get Enum Options
  * Created By : Mahmoud Radwan
  * Created On : 5/4/2022
  */
  getEnumOptions(options: any[] , enumName: string , resourceName: string = 'KSchoolEnums'):LabelValuePair[] {
    const result: LabelValuePair [] = [];
    options.forEach(options => {
      result.push(
        { label : this.localizationService.instant(resourceName + '::' + enumName + ':' + options.key)  , value : options.value }
      );
    });
    return result;
  }
  /*
  * Function Used To get enum value as label value pair
  * Created By : Mahmoud Radwan
  * Created On : 9/3/2022
  */
  getEnumOptionAsLabelValuePair(option: any , enumName: string , resourceName: string = 'KSchool') : LabelValuePair {
    return { label : this.localizationService.instant(resourceName + '::' + enumName + ':' + option.key) , value : option.value };
  }

  getEnumEntityLiteAsLabelValuePair(option: EntityLiteIntegerDto , enumName: string , resourceName: string = 'KSchool') : LabelValuePair {
    return { label : this.localizationService.instant(resourceName + '::' + enumName + ':' + option.label) , value : option.id };
  }

}
