import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDeliveryStatusUseCase } from './update-delivery-status.use-case';
import { DeliveryRepository } from '../../domain/repositories/delivery.repository.interface';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryStatusEnum } from '../../infrastructure/persistence/entities/delivery.orm';

describe('UpdateDeliveryStatusUseCase', () => {
  let useCase: UpdateDeliveryStatusUseCase;
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

  const updatedMockDelivery = new Delivery(
    mockDeliveryId,
    'transaction-123',
    'product-456',
    'customer-789',
    '123 Main St',
    DeliveryStatusEnum.DELIVERED
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDeliveryStatusUseCase,
        {
          provide: 'DeliveryRepository',
          useValue: {
            updateStatus: jest.fn().mockResolvedValue(updatedMockDelivery),
            findById: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateDeliveryStatusUseCase>(UpdateDeliveryStatusUseCase);
    deliveryRepository = module.get<DeliveryRepository>('DeliveryRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update delivery status successfully', async () => {
      const command = {
        id: mockDeliveryId,
        status: DeliveryStatusEnum.DELIVERED,
      };

      const result = await useCase.execute(command);

      expect(deliveryRepository.updateStatus).toHaveBeenCalledWith(mockDeliveryId, DeliveryStatusEnum.DELIVERED);
      expect(result).toEqual(updatedMockDelivery);
    });

    it('should throw an error when delivery is not found', async () => {
      jest.spyOn(deliveryRepository, 'updateStatus').mockRejectedValueOnce(new Error('Delivery not found'));

      const command = {
        id: 'non-existent-id',
        status: DeliveryStatusEnum.DELIVERED,
      };

      await expect(useCase.execute(command)).rejects.toThrow('Delivery not found');
      expect(deliveryRepository.updateStatus).toHaveBeenCalledWith('non-existent-id', DeliveryStatusEnum.DELIVERED);
    });

    it('should throw an error if repository update fails', async () => {
      jest.spyOn(deliveryRepository, 'updateStatus').mockRejectedValueOnce(new Error('Database error'));

      const command = {
        id: mockDeliveryId,
        status: DeliveryStatusEnum.DELIVERED,
      };

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
      expect(deliveryRepository.updateStatus).toHaveBeenCalledWith(mockDeliveryId, DeliveryStatusEnum.DELIVERED);
    });
  });
});