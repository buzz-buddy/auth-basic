import { ApiProperty } from '@nestjs/swagger';
import { UserPublicDto } from '../../common/swagger/api-responses.dto';

export class PaginatedUsersDto {
  @ApiProperty({ type: [UserPublicDto] })
  items: UserPublicDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
