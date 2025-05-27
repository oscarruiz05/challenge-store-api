import { Test, TestingModule } from '@nestjs/testing';
import { GetAllDeliveriesUseCase } from './get-all-deliveries.use-case';
import { DeliveryRepository } from '../../domain/repositories/delivery.repository.interface';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryStatusEnum } from '../../infrastructure/persistence/entities/delivery.orm';

describe('GetAllDeliveriesUseCase', () => {
  let useCase: GetAllDeliveriesUseCase;
  let deliveryRepository: DeliveryRepository;

  const mockDeliveries = [
    new Delivery('1', 'transaction-1', 'product-1', 'customer-1', '123 Main St', DeliveryStatusEnum.PENDING),
    new Delivery('2', 'transaction-2', 'product-2', 'customer-2', '456 Elm St', DeliveryStatusEnum.DELIVERED),
    new Delivery('3', 'transaction-3', 'product-3', 'customer-3', '789 Oak St', DeliveryStatusEnum.PENDING),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllDeliveriesUseCase,
        {
          provide: 'DeliveryRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockDeliveries),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllDeliveriesUseCase>(GetAllDeliveriesUseCase);
    deliveryRepository = module.get<DeliveryRepository>('DeliveryRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all deliveries', async () => {
      const result = await useCase.execute();

      expect(deliveryRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDeliveries);
      expect(result.length).toBe(3);
    });

    it('should return empty array when no deliveries exist', async () => {
      jest.spyOn(deliveryRepository, 'findAll').mockResolvedValueOnce([]);

      const result = await useCase.execute();

      expect(deliveryRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should throw an error if repository findAll fails', async () => {
      jest.spyOn(deliveryRepository, 'findAll').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow('Database error');
    });
  });
});