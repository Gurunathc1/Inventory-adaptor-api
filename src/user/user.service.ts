import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';
import { Roles } from 'common/roles.enums';
import { UpdateRoleDto } from './dto/roles.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

async signUp(userDto: UserDto): Promise<any> {
    const { name, email, password } = userDto; // remove role from DTO
    const normalizedEmail = email.toLowerCase();

    const existingUser = await this.userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'viewer', // always assign viewer by default
    });

    try {
      const savedUser = await newUser.save();
      const { password: _, ...userWithoutPassword } = savedUser.toObject();
      return {
        message: 'Signup successful',
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in Signing Up');
    }
  }
async updateUserRole(userEmail: string, role: string) {
  console.log('userEmail:', userEmail);
  console.log('role:', role);

  if (!role) {
    throw new BadRequestException('Role is required');
  }

  // Optional: validate role against enum
  const validRoles = Object.values(Roles);
  if (!validRoles.includes(role as Roles)) {
    throw new BadRequestException(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  const user = await this.userModel.findOne({ email: userEmail });
  if (!user) throw new NotFoundException('User not found');

  user.role = role;
  await user.save();

  const { password: _, ...userWithoutPassword } = user.toObject();
  return {
    message: 'User role updated successfully',
    user: userWithoutPassword,
  };
}



async findUserByEmail(email: string) {
  const user = await this.userModel.findOne({ email }).select('-password');
  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`);
  }
  return user;
}

async getAllUserEmails() {
  const users = await this.userModel.find({}, 'email'); // only select the 'email' field
  if (!users || users.length === 0) {
    throw new NotFoundException('No users found');
  }

  // Return just the array of emails
  return users.map(user => user.email);
}



}
