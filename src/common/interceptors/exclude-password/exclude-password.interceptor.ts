import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Array) {
          return data.map((item) => this.excludePassword(item));
        } else {
          return this.excludePassword(data);
        }
      }),
    );
  }

  private excludePassword(data: any) {
    if (data?.password) {
      delete data.password;
    }
    return data;
  }
}
