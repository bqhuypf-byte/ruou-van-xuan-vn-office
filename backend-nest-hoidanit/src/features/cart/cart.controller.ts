import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../shared/guards/optional-jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartIdentity } from './types/cart.types';

const CART_SESSION_COOKIE = 'cartSessionId';
const CART_SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly configService: ConfigService,
  ) {}

  private resolveIdentity(req: Request, res: Response): CartIdentity {
    const user = req.user as AuthenticatedUser | undefined;
    if (user) {
      return { userId: user.id, sessionId: null };
    }

    let sessionId = req.cookies?.[CART_SESSION_COOKIE] as string | undefined;
    if (!sessionId) {
      sessionId = randomUUID();
      res.cookie(CART_SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: this.configService.get<string>('app.nodeEnv') === 'production',
        sameSite: 'lax',
        maxAge: CART_SESSION_MAX_AGE_MS,
      });
    }
    return { userId: null, sessionId };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.cartService.getCart(this.resolveIdentity(req, res));
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('items')
  addItem(
    @Body() dto: AddCartItemDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.cartService.addItem(this.resolveIdentity(req, res), dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Patch('items/:id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.cartService.updateItem(this.resolveIdentity(req, res), id, dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete('items/:id')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.cartService.removeItem(this.resolveIdentity(req, res), id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete()
  async clearCart(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.cartService.clearCart(this.resolveIdentity(req, res));
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('merge')
  async merge(
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId =
      (req.cookies?.[CART_SESSION_COOKIE] as string | undefined) ?? null;
    const result = await this.cartService.mergeGuestCart(user.id, sessionId);
    res.clearCookie(CART_SESSION_COOKIE);
    return result;
  }
}
