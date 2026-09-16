import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
const secret=new TextEncoder().encode(process.env.JWT_SECRET||'dev-secret-change-me');
export async function createSession(adminId:string){return new SignJWT({adminId}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret)}
export async function getSession(){const token=cookies().get('session')?.value;if(!token)return null;try{return (await jwtVerify(token,secret)).payload as {adminId:string}}catch{return null}}
export async function requireAdmin(){const s=await getSession();if(!s?.adminId)throw new Error('UNAUTHORIZED');return s.adminId}
