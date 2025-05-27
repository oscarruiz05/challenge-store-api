import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryUseCase } from '../use-cases/create-delivery.use-case';
import { GetDeliveryUseCase } from '../use-cases/get-delivery.use-case';
import { GetAllDeliveriesUseCase } from '../use-cases/get-all-deliveries.use-case';
import { UpdateDeliveryStatusUseCase } from '../use-cases/update-delivery-status.use-case';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryStatusEnum } from '../../infrastructure/persistence/entities/delivery.orm';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let createDeliveryUseCase: CreateDeliveryUseCase;
  let getDeliveryUseCase: GetDeliveryUseCase;
  let getAllDeliveriesUseCase: GetAllDeliveriesUseCase;
  let updateDeliveryStatusUseCase: UpdateDeliveryStatusUseCase;

  const mockDeliveryId = '123e4567-e89b-12d3-a456-426614174000';
  const mockDelivery = new Delivery(
    mockDeliveryId,
    'transaction-123',
    'product-456',
    'customer-789',
    '123 Main St',
    DeliveryStatusEnum.PENDING
  );

  const mockDeliveries = [
    mockDelivery,
    new Delivery('2', 'transaction-2', 'product-2', 'customer-2', '456 Elm St', DeliveryStatusEnum.DELIVERED),
    new Delivery('3', 'transaction-3', 'product-3', 'customer-3', '789 Oak St', DeliveryStatusEnum.PENDING),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        {
          provide: CreateDeliveryUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
        {
          provide: GetDeliveryUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
        {
          provide: GetAllDeliveriesUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockDeliveries),
          },
        },
        {
          provide: UpdateDeliveryStatusUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    createDeliveryUseCase = module.get<CreateDeliveryUseCase>(CreateDeliveryUseCase);
    getDeliveryUseCase = module.get<GetDeliveryUseCase>(GetDeliveryUseCase);
    getAllDeliveriesUseCase = module.get<GetAllDeliveriesUseCase>(GetAllDeliveriesUseCase);
    updateDeliveryStatusUseCase = module.get<UpdateDeliveryStatusUseCase>(UpdateDeliveryStatusUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDelivery', () => {
    it('should call createDeliveryUseCase.execute with the correct parameters', async () => {
      const createDeliveryCommand = {
        transaction_id: 'transaction-123',
        product_id: 'product-456',
        customer_id: 'customer-789',
        address: '123 Main St',
      };

      const result = await service.createDelivery(createDeliveryCommand);

      expect(createDeliveryUseCase.execute).toHaveBeenCalledWith(createDeliveryCommand);
      expect(result).toEqual(mockDelivery);
    });
  });

  describe('getDeliveryById', () => {
    it('should call getDeliveryUseCase.execute with the correct parameters', async () => {
      const result = await service.getDeliveryById(mockDeliveryId);

      expect(getDeliveryUseCase.execute).toHaveBeenCalledWith(mockDeliveryId);
      expect(result).toEqual(mockDelivery);
    });
  });

  describe('getAllDeliveries', () => {
    it('should call getAllDeliveriesUseCase.execute', async () => {
      const result = await service.getAllDeliveries();

      expect(getAllDeliveriesUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDeliveries);
      expect(result.length).toBe(3);
    });
  });

  describe('updateDeliveryStatus', () => {
    it('should call updateDeliveryStatusUseCase.execute with the correct parameters', async () => {
      const updateStatusCommand = {
        id: mockDeliveryId,
        status: DeliveryStatusEnum.DELIVERED,
      };

      const result = await service.updateDeliveryStatus(updateStatusCommand);

      expect(updateDeliveryStatusUseCase.execute).toHaveBeenCalledWith(updateStatusCommand);
      expect(result).toEqual(mockDelivery);
    });
  });
});