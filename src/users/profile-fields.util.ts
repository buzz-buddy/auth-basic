import { UserProfileFieldsDto } from './dto/user-profile-fields.dto';

export type UserProfileFieldsData = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  dateOfBirth?: Date;
};

export function profileFieldsFromDto(
  dto: UserProfileFieldsDto,
): UserProfileFieldsData {
  const data: UserProfileFieldsData = {};

  if (dto.firstName !== undefined) {
    data.firstName = dto.firstName;
  }
  if (dto.lastName !== undefined) {
    data.lastName = dto.lastName;
  }
  if (dto.displayName !== undefined) {
    data.displayName = dto.displayName;
  }
  if (dto.dateOfBirth !== undefined) {
    data.dateOfBirth = new Date(dto.dateOfBirth);
  }

  return data;
}
