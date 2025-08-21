/*import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.department.findMany({ orderBy: { name: 'asc' } });
  }
} */ 

  import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(hotelCode?: string) {
    // 1) Otel kodu yoksa: global departmanları döndür (gerekirse oluştur)
    if (!hotelCode) {
      return this.ensureAndGetGlobal();
    }

    // 2) Otel kodu varsa: oteli bul
    const hotel = await this.prisma.hotel.findUnique({
      where: { code: hotelCode },
    });

    // 3) Otel bulunduysa ve departmanları varsa: sadece otel departmanlarını döndür
    if (hotel) {
      const hotelDepts = await this.prisma.department.findMany({
        where: { hotelId: hotel.id },
        orderBy: { name: 'asc' },
      });
      if (hotelDepts.length > 0) {
        return hotelDepts;
      }
    }

    // 4) Aksi halde fallback: global departmanlar
    return this.ensureAndGetGlobal();
  }

  /** Global departmanları getir; hiç yoksa makul bir başlangıç seti oluştur. */
  private async ensureAndGetGlobal() {
    let global = await this.prisma.department.findMany({
      where: { hotelId: null },
      orderBy: { name: 'asc' },
    });

    if (global.length === 0) {
      await this.prisma.department.createMany({
        data: [
          { name: 'Resepsiyon' },
          { name: 'Kat Hizmetleri' },
          { name: 'Teknik Servis' },
          { name: 'Yiyecek & İçecek' },
        ],
        skipDuplicates: true,
      });

      global = await this.prisma.department.findMany({
        where: { hotelId: null },
        orderBy: { name: 'asc' },
      });
    }

    return global;
  }
}

