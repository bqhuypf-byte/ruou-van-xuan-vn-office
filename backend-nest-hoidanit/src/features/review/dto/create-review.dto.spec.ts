import { validate } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

describe('CreateReviewDto', () => {
  it('accepts up to three uploaded review images', async () => {
    const dto = Object.assign(new CreateReviewDto(), {
      fullName: 'Nguyễn Văn A',
      email: 'nguyen@example.com',
      phone: '0901234567',
      rating: 5,
      comment: 'Sản phẩm tốt',
      imageUrls: [
        '/uploads/one.webp',
        '/uploads/two.webp',
        '/uploads/three.webp',
      ],
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects more than three review images', async () => {
    const dto = Object.assign(new CreateReviewDto(), {
      fullName: 'Nguyễn Văn A',
      email: 'nguyen@example.com',
      phone: '0901234567',
      rating: 5,
      imageUrls: [
        '/uploads/one.webp',
        '/uploads/two.webp',
        '/uploads/three.webp',
        '/uploads/four.webp',
      ],
    });

    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'imageUrls')).toBe(true);
  });

  it('requires valid public reviewer contact details', async () => {
    const dto = Object.assign(new CreateReviewDto(), {
      fullName: '',
      email: 'invalid-email',
      phone: '0901234567',
      rating: 5,
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'fullName')).toBe(true);
    expect(errors.some((error) => error.property === 'email')).toBe(true);
  });
});
