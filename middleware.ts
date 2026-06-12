/*
 * Next.js middleware template for DOHRMP RBAC.
 *
 * This repository is currently a Vite React application, so this file is not
 * executed by the app. Keep it at the root as the source policy for a future
 * Next.js shell or deployment gateway.
 */

type UserRole =
  | 'Employee (ESS)'
  | 'Supervisor'
  | 'Program Officer'
  | 'Program Lead'
  | 'Audit Officer'
  | 'Finance Officer'
  | 'HR Officer'
  | 'HR Manager'
  | 'National Director'
  | 'Admin / Global Admin'
  | 'Admin';

const roleDashboard: Record<UserRole, string> = {
  'Admin / Global Admin': '/admin/dashboard',
  Admin: '/admin/dashboard',
  'HR Manager': '/hr/dashboard',
  'HR Officer': '/hr/dashboard',
  'National Director': '/nd/dashboard',
  'Program Officer': '/programs/dashboard',
  'Program Lead': '/programs/dashboard',
  'Finance Officer': '/finance/dashboard',
  'Audit Officer': '/audit/dashboard',
  Supervisor: '/supervisor/dashboard',
  'Employee (ESS)': '/dashboard',
};

const routePolicy: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: '/admin', roles: ['Admin', 'Admin / Global Admin'] },
  { prefix: '/hr', roles: ['HR Manager', 'HR Officer', 'Admin', 'Admin / Global Admin'] },
  { prefix: '/nd', roles: ['National Director', 'Admin', 'Admin / Global Admin'] },
  { prefix: '/finance', roles: ['Finance Officer', 'Admin', 'Admin / Global Admin'] },
  { prefix: '/audit', roles: ['Audit Officer', 'Admin', 'Admin / Global Admin'] },
  { prefix: '/supervisor', roles: ['Supervisor', 'Admin', 'Admin / Global Admin'] },
  { prefix: '/programs', roles: ['Program Officer', 'Program Lead', 'Admin', 'Admin / Global Admin'] },
];

export function getDashboardForRole(role: UserRole) {
  return roleDashboard[role] ?? '/dashboard';
}

export function canAccessRoute(role: UserRole, pathname: string) {
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) return true;
  const rule = routePolicy.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`));
  return rule ? rule.roles.includes(role) : true;
}

/*
 * In a real Next.js app, replace this comment with:
 *
 * import { NextRequest, NextResponse } from 'next/server';
 * import { jwtVerify } from 'jose';
 *
 * export async function middleware(request: NextRequest) {
 *   const { pathname } = request.nextUrl;
 *   const publicRoutes = ['/login', '/auth/set-password', '/api/auth/login'];
 *   if (publicRoutes.some((route) => pathname.startsWith(route))) return NextResponse.next();
 *
 *   const token = request.cookies.get('access_token')?.value;
 *   if (!token) return NextResponse.redirect(new URL('/login', request.url));
 *
 *   try {
 *     const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
 *     const role = payload.role as UserRole;
 *     if (!canAccessRoute(role, pathname)) {
 *       return NextResponse.redirect(new URL(getDashboardForRole(role), request.url));
 *     }
 *     return NextResponse.next();
 *   } catch {
 *     return NextResponse.redirect(new URL('/login?session=expired', request.url));
 *   }
 * }
 *
 * export const config = {
 *   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
 * };
 */
