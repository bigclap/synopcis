import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthService {
  getUserIdFromRequest(request: Request): string {
    // TODO: Replace with actual user ID from auth context
    return 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  }
}
