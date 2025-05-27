import { Test, TestingModule } from '@nestjs/testing';
import { CreateDeliveryUseCase } from './create-delivery.use-case';
import { DeliveryRepository } from '../../domain/repositories/delivery.repository.interface';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryStatusEnum } from '../../infrastructure/persistence/entities/delivery.orm';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('CreateDeliveryUseCase', () => {
  let useCase: CreateDeliveryUseCase;
  let deliveryRepository: DeliveryRepository;

  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  const mockDelivery = new Delivery(
    mockUuid,
    'transaction-123',
    'product-456',
    'customer-789',
    '123 Main St',
    DeliveryStatusEnum.PENDING
  );

  beforeEach(async () => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDeliveryUseCase,
        {
          provide: 'DeliveryRepository',
          useValue: {
            save: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateDeliveryUseCase>(CreateDeliveryUseCase);
    deliveryRepository = module.get<DeliveryRepository>('DeliveryRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new delivery successfully', async () => {
      const command = {
        transaction_id: 'transaction-123',
        product_id: 'product-456',
        customer_id: 'customer-789',
        address: '123 Main St',
      };

      const result = await useCase.execute(command);

      expect(uuidv4).toHaveBeenCalled();
      expect(deliveryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUuid,
          transaction_id: command.transaction_id,
          product_id: command.product_id,
          customer_id: command.customer_id,
          address: command.address,
          status: DeliveryStatusEnum.PENDING,
        }),
      );
      expect(result).toEqual(mockDelivery);
    });

    it('should throw an error if repository save fails', async () => {
      const command = {
        transaction_id: 'transaction-123',
        product_id: 'product-456',
        customer_id: 'customer-789',
        address: '123 Main St',
      };

      jest.spyOn(deliveryRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
    });
  });
});