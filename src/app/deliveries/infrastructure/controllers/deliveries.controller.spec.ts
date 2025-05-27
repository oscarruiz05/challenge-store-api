import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesController } from './deliveries.controller';
import { DeliveryService } from '../../application/services/delivery.service';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryStatusEnum } from '../persistence/entities/delivery.orm';
import { CreateDeliveryDto } from './dtos/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dtos/update-delivery-status.dto';

describe('DeliveriesController', () => {
  let controller: DeliveriesController;
  let deliveryService: DeliveryService;

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
      controllers: [DeliveriesController],
      providers: [
        {
          provide: DeliveryService,
          useValue: {
            createDelivery: jest.fn().mockResolvedValue(mockDelivery),
            getDeliveryById: jest.fn().mockResolvedValue(mockDelivery),
            getAllDeliveries: jest.fn().mockResolvedValue(mockDeliveries),
            updateDeliveryStatus: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
      ],
    }).compile();

    controller = module.get<DeliveriesController>(DeliveriesController);
    deliveryService = module.get<DeliveryService>(DeliveryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDelivery', () => {
    it('should create a delivery successfully', async () => {
      const createDeliveryDto: CreateDeliveryDto = {
        transaction_id: 'transaction-123',
        product_id: 'product-456',
        customer_id: 'customer-789',
        address: '123 Main St',
      };

      const result = await controller.createDelivery(createDeliveryDto);

      expect(deliveryService.createDelivery).toHaveBeenCalledWith(createDeliveryDto);
      expect(result).toEqual(mockDelivery);
    });
  });

  describe('getDeliveryById', () => {
    it('should get a delivery by id successfully', async () => {
      const result = await controller.getDeliveryById(mockDeliveryId);

      expect(deliveryService.getDeliveryById).toHaveBeenCalledWith(mockDeliveryId);
      expect(result).toEqual(mockDelivery);
    });
  });

  describe('getAllDeliveries', () => {
    it('should get all deliveries successfully', async () => {
      const result = await controller.getAllDeliveries();

      expect(deliveryService.getAllDeliveries).toHaveBeenCalled();
      expect(result).toEqual(mockDeliveries);
      expect(result.length).toBe(3);
    });
  });

  describe('updateDeliveryStatus', () => {
    it('should update delivery status successfully', async () => {
      const updateDeliveryStatusDto: UpdateDeliveryStatusDto = {
        status: DeliveryStatusEnum.DELIVERED,
      };

      const result = await controller.updateDeliveryStatus(mockDeliveryId, updateDeliveryStatusDto);

      expect(deliveryService.updateDeliveryStatus).toHaveBeenCalledWith({
        id: mockDeliveryId,
        status: DeliveryStatusEnum.DELIVERED,
      });
      expect(result).toEqual(mockDelivery);
    });
  });
});