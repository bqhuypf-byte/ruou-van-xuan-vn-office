import { validate } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

describe('CreateReviewDto', () => {
  it('accepts up to three uploaded review images', async () => {
    const dto = Object.assign(new CreateReviewDto(), {
      orderId: 1,
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
      orderId: 1,
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
});
