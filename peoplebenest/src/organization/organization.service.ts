import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async getProfile(orgId: number) {
    const organization = await this.organizationRepository.findOne({
      where: { org_id: orgId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return {
      success: true,
      data: {
        org_id: organization.org_id,
        org_name: organization.org_name,
        org_type: organization.org_type,
        email: organization.email,
        phone: organization.phone,
        website: organization.website,
        address: organization.address,
        services: organization.services,
        status: organization.status,
        profile_pic: organization.profile_pic
          ? Buffer.from(organization.profile_pic).toString('base64')
          : null,
        profile_completed: organization.profile_completed,
      },
    };
  }

  async updateProfile(updateOrgDto: UpdateOrganizationDto, orgId: number) {
    const organization = await this.organizationRepository.findOne({
      where: { org_id: orgId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (updateOrgDto.org_name) organization.org_name = updateOrgDto.org_name;
    if (updateOrgDto.phone) organization.phone = updateOrgDto.phone;
    if (updateOrgDto.website) organization.website = updateOrgDto.website;
    if (updateOrgDto.address) organization.address = updateOrgDto.address;
    if (updateOrgDto.services) organization.services = updateOrgDto.services;

    await this.organizationRepository.save(organization);

    return this.getProfile(orgId);
  }

  async getEmployees(orgId: number) {
    const employees = await this.employeeRepository.find({
      where: { organization_id: orgId },
      relations: ['organization'],
    });

    return {
      success: true,
      data: employees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        age: emp.age,
        post: emp.post,
        email: emp.email,
        nic_passport: emp.nic_passport,
        address: emp.address,
        photo: emp.photo ? Buffer.from(emp.photo).toString('base64') : null,
      })),
    };
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto, orgId: number) {
    let photoBuffer = null;
    if (createEmployeeDto.photo) {
      photoBuffer = Buffer.from(createEmployeeDto.photo, 'base64');
    }

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      organization_id: orgId,
      photo: photoBuffer,
    });

    await this.employeeRepository.save(employee);

    return {
      success: true,
      message: 'Employee created successfully',
      data: {
        id: employee.id,
        name: employee.name,
        age: employee.age,
        post: employee.post,
        email: employee.email,
      },
    };
  }
}

