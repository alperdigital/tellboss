/*import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  // Nest uygulaması kapanırken Prisma bağlantısını düzgün kapatmak için 
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // İstersen Node tarafında da güvenceye almak için
  enableShutdownHooks(app: INestApplication) {
    process.once('beforeExit', async () => {
      await app.close();
    });
  }
} */ 

  import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async enableShutdownHooks(app: INestApplication) {
    process.once('beforeExit', async () => {
      await app.close();
    });
  }
}

