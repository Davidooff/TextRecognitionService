import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify as jwtVerify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class MainGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const authHeader = request.headers['authorization'].split(' '); // => [Bareer, Token]
      const verified = jwtVerify(authHeader[1], process.env.JWT_SECRET);
      return true;
    } catch {
      return false;
    }
  }
}
