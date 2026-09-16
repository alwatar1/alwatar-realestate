import {prisma} from '@/lib/prisma'; import AdminPropertyForm from '@/components/AdminPropertyForm';
export default async function New(){const ns=await prisma.neighborhood.findMany({orderBy:{name:'asc'}});return <main className="section"><div className="container"><div className="panel"><h1>إضافة عقار</h1><AdminPropertyForm neighborhoods={ns}/></div></div></main>}
