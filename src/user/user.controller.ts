import { Controller, Post, Body, Patch, UseGuards, Param, Get, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { RolesGuard } from 'common/gaurds/roles.gaurds';
import { JwtAuthGuard } from 'common/gaurds/jwt-auth.guard';
import { RolesDecorators } from 'src/auth/roles.decorator';
import { Roles } from 'common/roles.enums';
import { UpdateRoleDto } from './dto/roles.dto';


@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('signup')
  async signUp(@Body() signupDto: UserDto) {
    return this.usersService.signUp(signupDto);
  }

@Post(':email')
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesDecorators(Roles.ADMIN)
async updateUserRole(
  @Param('email') email: string,
  @Query('role') role: string, 
) {
  return this.usersService.updateUserRole(email, role);
}


 @Get('by-email/:email')
async getUserByEmail(@Param('email') email: string) {
  return this.usersService.findUserByEmail(email);
}

@Get('get-all-emails')
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesDecorators(Roles.ADMIN)
async getAllUserEmails() {
  return this.usersService.getAllUserEmails();
}


}
