import { IsEnum } from 'class-validator';
import { OrganizationStatus } from '../../entities/organization.entity';

export class UpdateOrganizationStatusDto {
  @IsEnum(OrganizationStatus)
  status: OrganizationStatus;
}

