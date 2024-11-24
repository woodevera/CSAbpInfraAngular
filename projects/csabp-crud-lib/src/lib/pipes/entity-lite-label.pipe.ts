import { Pipe, PipeTransform } from '@angular/core';
import {EntityLiteDto} from "../models/models";

@Pipe({
  name: 'entityLiteLabel',
  standalone: true

})
export class EntityLiteLabelPipe implements PipeTransform {

  transform(value: string , data: EntityLiteDto[]): string {
    if (data && data.length > 0) {
      const item = data.filter(x=> x.id == value);
      if (item && item.length > 0) {
        return item[0].label;
      }
    }
    return value;
  }
}
