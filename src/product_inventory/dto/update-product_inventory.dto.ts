import { PartialType } from '@nestjs/mapped-types';
import { CreateProductInventoryDto } from './create-product_inventory.dto';

export class UpdateProductInventoryDto extends PartialType(CreateProductInventoryDto) {}
