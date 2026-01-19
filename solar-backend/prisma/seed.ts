import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@azenterprises.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@azenterprises.com',
            phone: '+916006642157',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Admin user created:', admin.email);
    console.log('📧 Email: admin@azenterprises.com');
    console.log('🔑 Password: Admin@123');
    console.log('⚠️  Please change the password after first login!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
