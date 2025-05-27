import { Test, TestingModule } from '@nestjs/testing';
import { GetDeliveryUseCase } from './get-delivery.use-case';
import { DeliveryRepository } from '../../domain/repositories/delivery.repository.interface';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryStatusEnum } from '../../infrastructure/persistence/entities/delivery.orm';

describe('GetDeliveryUseCase', () => {
  let useCase: GetDeliveryUseCase;
  let deliveryRepository: DeliveryRepository;

  const mockDeliveryId = '123e4567-e89b-12d3-a456-426614174000';
  const mockDelivery = new Delivery(
    mockDeliveryId,
    'transaction-123',
    'product-456',
    'customer-789',
    '123 Main St',
    DeliveryStatusEnum.PENDING
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDeliveryUseCase,
        {
          provide: 'DeliveryRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetDeliveryUseCase>(GetDeliveryUseCase);
    deliveryRepository = module.get<DeliveryRepository>('DeliveryRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a delivery when found by id', async () => {
      const result = await useCase.execute(mockDeliveryId);

      expect(deliveryRepository.findById).toHaveBeenCalledWith(mockDeliveryId);
      expect(result).toEqual(mockDelivery);
    });

    it('should return null when delivery is not found', async () => {
      jest.spyOn(deliveryRepository, 'findById').mockResolvedValueOnce(null);

      const result = await useCase.execute('non-existent-id');

      expect(deliveryRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('should throw an error if repository findById fails', async () => {
      jest.spyOn(deliveryRepository, 'findById').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(mockDeliveryId)).rejects.toThrow('Database error');
    });
  });
});