// src/assignments/dto/assignment.dto.ts
import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

// 検索用（再現性確保のため importId を受け取る）
export class GetAssignmentsQueryDto {
  @IsOptional()
  @IsString()
  importId?: string;
}

// 更新用
export class UpdateAssignmentDto {
  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsString()
  role?: string;
  
  // ...他フィールド
}