import { BadRequestException } from '@nestjs/common';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > MAX_PROFILE_PICTURE_SIZE_IN_BYTES) {
    return callback(new BadRequestException('Maksimum filesize 2MB'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const ext = file.mimetype.split('/')[1];
  callback(null, `${file.fieldname}-${new Date().getTime()}.${ext}`);
};
