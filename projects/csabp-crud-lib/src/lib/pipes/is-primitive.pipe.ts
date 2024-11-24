import {Pipe, PipeTransform} from '@angular/core';
import {SignatureDataTypeEnum} from "../models/models";


@Pipe({
  name: 'isPrimitive',
  standalone: true
})
export class IsPrimitivePipe implements PipeTransform {
  transform(value: SignatureDataTypeEnum): boolean {
    return value === SignatureDataTypeEnum.String || value === SignatureDataTypeEnum.Decimal || value === SignatureDataTypeEnum.Integer || value === SignatureDataTypeEnum.UnKnown;
  }
}
