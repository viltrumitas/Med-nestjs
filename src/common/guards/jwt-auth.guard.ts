import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  canActivate(context: ExecutionContext) {

    const req = context.switchToHttp().getRequest();

    console.log('========== NUEVA PETICIÓN ==========');
    console.log('METHOD:', req.method);
    console.log('URL:', req.url);
    console.log('AUTH:', req.headers.authorization);

    return super.canActivate(context);
  }

}