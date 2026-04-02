import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from 'common/roles.enums';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique : true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Object.values(Roles), default: Roles.VIEWER })
  role: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
