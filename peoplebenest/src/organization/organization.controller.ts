import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationGuard } from '../auth/guards/organization.guard';

@ApiTags('Organization')
@Controller('organization')
@UseGuards(JwtAuthGuard, OrganizationGuard)
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get organization profile' })
  async getProfile(@Request() req) {
    return this.organizationService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update organization profile' })
  async updateProfile(@Body() updateOrgDto: UpdateOrganizationDto, @Request() req) {
    return this.organizationService.updateProfile(updateOrgDto, req.user.id);
  }

  @Get('employees')
  @ApiOperation({ summary: 'Get organization employees' })
  async getEmployees(@Request() req) {
    return this.organizationService.getEmployees(req.user.id);
  }

  @Post('employees')
  @ApiOperation({ summary: 'Create a new employee' })
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto, @Request() req) {
    return this.organizationService.createEmployee(createEmployeeDto, req.user.id);
  }
}

