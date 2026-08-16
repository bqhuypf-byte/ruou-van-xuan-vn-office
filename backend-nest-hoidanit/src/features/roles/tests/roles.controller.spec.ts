import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { Role } from '../entities/role.entity';

describe('RolesController', () => {
  let controller: RolesController;
  let service: jest.Mocked<RolesService>;

  const mockRole: Role = {
    id: 1,
    name: 'admin',
  };

  const mockRolesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get(RolesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /roles (findAll)', () => {
    it('should return an array of roles', async () => {
      const expected = [mockRole, { id: 2, name: 'customer' }];
      service.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /roles/:id (findOne)', () => {
    it('should return a role by id', async () => {
      service.findOne.mockResolvedValue(mockRole);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRole);
    });
  });

  describe('POST /roles (create)', () => {
    it('should create a role and return it', async () => {
      const dto = { name: 'editor' };
      const expected: Role = { id: 3, name: 'editor' };
      service.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('PATCH /roles/:id (update)', () => {
    it('should update role and return updated role', async () => {
      const dto = { name: 'super_admin' };
      const expected: Role = { id: 1, name: 'super_admin' };
      service.update.mockResolvedValue(expected);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /roles/:id (remove)', () => {
    it('should remove role by id', async () => {
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
