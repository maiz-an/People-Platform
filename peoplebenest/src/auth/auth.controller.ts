import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterOrganizationDto } from './dto/register-organization.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('organization/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new organization' })
  @ApiResponse({ status: 201, description: 'Organization registered successfully' })
  async registerOrganization(@Body() registerDto: RegisterOrganizationDto) {
    return this.authService.registerOrganization(registerDto);
  }

  @Post('organization/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Organization login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async loginOrganization(@Body() loginDto: LoginDto) {
    return this.authService.loginOrganization(loginDto);
  }
}

