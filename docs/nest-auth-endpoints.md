# TLMN DOHRMP NestJS Auth Contract

This Vite repository does not currently contain a NestJS backend. Use this as the production backend contract for a Nest API that powers the frontend auth pages.

## Required Endpoints

### `POST /api/auth/login`

Request:

```json
{ "username": "aaron.hamilton", "password": "TLMNDemo2025" }
```

Server behavior:

- Find user by username or email.
- Reject disabled users with `403` and message: `Your account has been disabled. Contact HR.`
- Compare password using `bcrypt.compare`.
- Issue JWT access token with 15 minute expiry.
- Issue refresh token with 7 day expiry.
- Store tokens in `httpOnly`, `secure`, `sameSite=lax` cookies.
- Return user object for immediate client hydration.

Response:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "u-aaron",
    "name": "Aaron Hamilton",
    "role": "HR Manager",
    "thematics": [],
    "department": "Human Resources",
    "isFirstLogin": true
  }
}
```

### `POST /api/auth/refresh`

- Reads refresh token from `refresh_token` cookie.
- Verifies refresh token.
- Issues new access token cookie.
- Returns `{ "ok": true }`.

### `POST /api/auth/logout`

- Clears `access_token` and `refresh_token` cookies.
- Returns `{ "ok": true }`.

### `PATCH /api/auth/set-password`

Request:

```json
{ "newPassword": "NewPass123" }
```

Server behavior:

- Requires valid temporary/current access token.
- Validate password: minimum 8 characters, at least one uppercase letter, at least one number.
- Hash password with bcrypt.
- Set `isFirstLogin = false`.
- Return current user.

### `GET /api/auth/me`

- Reads access token cookie.
- Returns current user from JWT/database.
- Used by frontend `AuthProvider` to hydrate state after reload.

## NestJS Skeleton

```ts
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const session = await this.authService.login(dto.username, dto.password);
    res.cookie('access_token', session.accessToken, authCookie(15 * 60 * 1000));
    res.cookie('refresh_token', session.refreshToken, authCookie(7 * 24 * 60 * 60 * 1000));
    return session;
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.refresh(req.cookies.refresh_token);
    res.cookie('access_token', accessToken, authCookie(15 * 60 * 1000));
    return { ok: true };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { ok: true };
  }

  @Patch('set-password')
  setPassword(@CurrentUser() user: JwtUser, @Body() dto: SetPasswordDto) {
    return this.authService.setPassword(user.id, dto.newPassword);
  }

  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return this.authService.me(user.id);
  }
}

function authCookie(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
```
