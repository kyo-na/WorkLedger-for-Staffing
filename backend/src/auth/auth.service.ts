import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../staff/staff.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const staff = await this.staffService.findOneByEmail(email);

    // ★修正1: passwordがnullの場合に備えて || '' を追加
    if (!staff || !(await bcrypt.compare(pass, staff.password || ''))) {
      throw new UnauthorizedException();
    }

    // ★修正2: roleはStaffテーブルにないので削除（または必要な場合はUserテーブルから取得）
    const payload = { sub: staff.id, email: staff.email }; 
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}