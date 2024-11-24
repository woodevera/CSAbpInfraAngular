import { mapEnumToOptions , EntityDto } from '@abp/ng.core';

export interface FieldSignatureDto {
  name?: string;
  dataType: SignatureDataTypeEnum;
  enumName?: string;
  entityLiteDto: EntityLiteIntegerDto[];
  isRequired?: boolean;
  regEx?: string;
  validationErrorKeys: string[];
  value: any;
}

export interface GuidFileDto {
  id?: string;
  file: number[];
}

export interface SignatureDto {
  fields: FieldSignatureDto[];
  name?: string;
}


export enum SignatureDataTypeEnum {
  Integer = 1,
  Decimal = 2,
  String = 3,
  Date = 4,
  Enum = 6,
  Boolean = 6,
  UnKnown = 7,
}

export interface EntityLiteDto extends EntityDto<string> {
  label?: string;
}

export interface EntityLiteIntegerDto extends EntityDto<number> {
  label?: string;
  code?: string;
}

export interface EntityLiteBooleanDto extends EntityDto<any> {
  label?: string;
}

export class LabelValuePair {
  label: string;
  value: number;
}

export interface AlertMessage {
  messageKey: string;
  alertType: AlertTypeEnum;
}

export enum AlertTypeEnum {
  Success = 1,
  Error,
  Info,
  Warning
}

export enum FormModeEnum {
  Add = 1,
  View = 2,
  Edit = 3,
  None = 4
}


export const signatureDataTypeEnumOptions = mapEnumToOptions(SignatureDataTypeEnum);
