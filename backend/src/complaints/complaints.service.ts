import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Status } from '@prisma/client';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  /** İlişkileri (department, attachments) tek noktadan yönetelim */
  private readonly relationInclude = { department: true, attachments: true } as const;

  /**
   * Şikayet oluştur.
   * Varsayılan: eski davranış (yalın obje). includeRelations=true verirsen ilişkileri dahil eder.
   */
  async create(
    dto: CreateComplaintDto,
    createdById: string,
    includeRelations = false,
  ) {
    return this.prisma.complaint.create({
      data: {
        title: dto.title,
        description: dto.description,
        departmentId: dto.departmentId,
        createdById,
      },
      ...(includeRelations ? { include: this.relationInclude } : {}),
    });
  }

  /**
   * Listele.
   * Varsayılan: eski davranış (yalın). includeRelations=true → ilişkilerle döner.
   */
  list(includeRelations = false) {
    return this.prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
      ...(includeRelations ? { include: this.relationInclude } : {}),
    });
  }

  /**
   * Tek kayıt getir.
   * Varsayılan: eski davranış (yalın). includeRelations=true → ilişkilerle döner.
   */
  async get(id: string, includeRelations = false) {
    const c = await this.prisma.complaint.findUnique({
      where: { id },
      ...(includeRelations ? { include: this.relationInclude } : {}),
    });
    if (!c) throw new NotFoundException('Complaint not found');
    return c;
  }

  /**
   * Durum güncelle.
   * Varsayılan: eski davranış (yalın). includeRelations=true → ilişkilerle döner.
   */
  updateStatus(id: string, status: Status, includeRelations = false) {
    return this.prisma.complaint.update({
      where: { id },
      data: { status },
      ...(includeRelations ? { include: this.relationInclude } : {}),
    });
  }

  /**
   * Attachment ekle (URL bazlı).
   * Kolay kullanım için güncel şikayeti İLİŞKİLERİYLE döndürür.
   * (İstersen ikinci parametre ile yalın da döndürebiliriz; şimdilik pratik olanı seçtim.)
   */
  async addAttachment(complaintId: string, url: string, type: string) {
    // Şikayet var mı? (yoksa 404)
    await this.get(complaintId, false);

    await this.prisma.attachment.create({
      data: { url, type, complaintId },
    });

    // Ekleme sonrası güncel durumu ilişkileriyle birlikte döndür
    return this.get(complaintId, true);
  }
}
