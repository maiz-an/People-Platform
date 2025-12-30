import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Organization } from '../../entities/organization.entity';
import { Admin } from '../../entities/admin.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    const { sub, type } = payload;

    if (type === 'admin') {
      const admin = await this.adminRepository.findOne({
        where: { Aid: sub },
      });
      if (!admin) {
        throw new UnauthorizedException();
      }
      return { ...admin, user_type: 'admin' };
    }

    if (type === 'organization') {
      const organization = await this.organizationRepository.findOne({
        where: { org_id: sub },
      });
      if (!organization) {
        throw new UnauthorizedException();
      }
      return { ...organization, user_type: 'organization', id: organization.org_id };
    }

    const user = await this.userRepository.findOne({
      where: { id: sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

