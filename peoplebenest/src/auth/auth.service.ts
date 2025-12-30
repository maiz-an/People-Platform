import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserStatus, UserType } from '../entities/user.entity';
import { Organization, OrganizationStatus } from '../entities/organization.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterOrganizationDto } from './dto/register-organization.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      status: UserStatus.PENDING,
      user_type: UserType.REGULAR,
    });

    const savedUser = await this.userRepository.save(user);

    const payload = { sub: savedUser.id, email: savedUser.email, type: 'user' };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          gender: savedUser.gender,
          user_type: savedUser.user_type,
          status: savedUser.status,
        },
        token,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Account is blocked');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, type: 'user' };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          user_type: user.user_type,
          status: user.status,
          profile_pic: user.profile_pic
            ? Buffer.from(user.profile_pic).toString('base64')
            : null,
        },
        token,
      },
    };
  }

  async registerOrganization(registerDto: RegisterOrganizationDto) {
    const existingOrg = await this.organizationRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingOrg) {
      throw new ConflictException('Organization email already exists');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.org_password, 10);

    const organization = this.organizationRepository.create({
      org_name: registerDto.org_name,
      org_type: registerDto.org_type,
      org_registration: registerDto.org_registration,
      email: registerDto.email,
      phone: registerDto.phone,
      website: registerDto.website,
      address: registerDto.address,
      services: registerDto.services,
      org_password: hashedPassword,
      status: OrganizationStatus.PENDING,
      proof_registration: registerDto.proof_registration
        ? Buffer.from(registerDto.proof_registration, 'base64')
        : Buffer.alloc(0),
      profile_pic: registerDto.profile_pic
        ? Buffer.from(registerDto.profile_pic, 'base64')
        : null,
    });

    const savedOrg = await this.organizationRepository.save(organization);

    // Also create a user entry for organization
    const user = this.userRepository.create({
      name: registerDto.org_name,
      email: registerDto.email,
      password: hashedPassword,
      user_type: UserType.ORGANIZATION,
      status: UserStatus.PENDING,
      gender: null,
    });

    await this.userRepository.save(user);

    const payload = { sub: savedOrg.org_id, email: savedOrg.email, type: 'organization' };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Organization registered successfully',
      data: {
        organization: {
          org_id: savedOrg.org_id,
          org_name: savedOrg.org_name,
          email: savedOrg.email,
          status: savedOrg.status,
        },
        token,
      },
    };
  }

  async loginOrganization(loginDto: LoginDto) {
    const organization = await this.organizationRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!organization) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (organization.status === OrganizationStatus.BLOCKED) {
      throw new UnauthorizedException('Organization account is blocked');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      organization.org_password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: organization.org_id, email: organization.email, type: 'organization' };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login successful',
      data: {
        organization: {
          org_id: organization.org_id,
          org_name: organization.org_name,
          email: organization.email,
          status: organization.status,
        },
        token,
      },
    };
  }

  async validateUser(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }
}

