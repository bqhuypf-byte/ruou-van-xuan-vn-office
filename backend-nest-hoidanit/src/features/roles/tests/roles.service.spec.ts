import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RolesService } from '../roles.service';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;
  let repository: jest.Mocked<RoleRepository>;

  const mockRole: Role = {
    id: 1,
    name: 'admin',
  };

  const mockRoleRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RoleRepository,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get(RoleRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const expectedRoles: Role[] = [mockRole, { id: 2, name: 'customer' }];
      repository.findAll.mockResolvedValue(expectedRoles);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedRoles);
    });
  });

  describe('findOne', () => {
    it('should return a role by id if found', async () => {
      repository.findById.mockResolvedValue(mockRole);

      const result = await service.findOne(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException if role is not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(99);
    });
  });

  describe('create', () => {
    it('should create and return a new role successfully', async () => {
      const dto = { name: 'manager' };
      const createdRole: Role = { id: 3, name: 'manager' };

      repository.findByName.mockResolvedValue(null);
      repository.create.mockReturnValue(createdRole);
      repository.save.mockResolvedValue(createdRole);

      const result = await service.create(dto);

      expect(repository.findByName).toHaveBeenCalledWith('manager');
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(createdRole);
      expect(result).toEqual(createdRole);
    });

    it('should throw ConflictException if role name already exists', async () => {
      const dto = { name: 'admin' };
      repository.findByName.mockResolvedValue(mockRole);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.findByName).toHaveBeenCalledWith('admin');
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update role name successfully when new name is unique', async () => {
      const dto = { name: 'super_admin' };
      const updatedRole: Role = { id: 1, name: 'super_admin' };

      repository.findById.mockResolvedValue({ ...mockRole });
      repository.findByName.mockResolvedValue(null);
      repository.save.mockResolvedValue(updatedRole);

      const result = await service.update(1, dto);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.findByName).toHaveBeenCalledWith('super_admin');
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('super_admin');
    });

    it('should update role successfully without checking name if name is unchanged', async () => {
      const dto = { name: 'admin' };

      repository.findById.mockResolvedValue({ ...mockRole });
      repository.save.mockResolvedValue(mockRole);

      const result = await service.update(1, dto);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.findByName).not.toHaveBeenCalled();
      expect(result).toEqual(mockRole);
    });

    it('should throw ConflictException if updated name belongs to another role', async () => {
      const dto = { name: 'customer' };
      const existingOtherRole: Role = { id: 2, name: 'customer' };

      repository.findById.mockResolvedValue({ ...mockRole });
      repository.findByName.mockResolvedValue(existingOtherRole);

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.findByName).toHaveBeenCalledWith('customer');
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if role to update does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(99, { name: 'test' })).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove role successfully', async () => {
      repository.findById.mockResolvedValue(mockRole);
      repository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(mockRole);
    });

    it('should throw NotFoundException if role to remove does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
