import { BadRequestException } from "@nestjs/common";
import { extname } from "path";

export const fileValidator = (file: Express.Multer.File, require: boolean = true): boolean => {
  if (!file) {
    if (!require) return true;

    throw new BadRequestException('Vui lòng upload file');
    return false;
  }
  const ext = extname(file.originalname);
  const allowedExt = ['.jpg', '.png', '.jpeg'];
  if (!allowedExt.includes(ext)) {
    throw new BadRequestException(`File định dạng phải là hình ảnh, chỉ chấp nhận file: ${allowedExt.toString()}`);
    return false;
  }
  const fileSize = file.size;
  if (fileSize > 1024 * 1024 * 5) { // > 5MB
    throw new BadRequestException('File gửi lên quá lớn, file phải có dung lượng nhỏ hơn 5MB');
    return false;
  }

  return true;
}