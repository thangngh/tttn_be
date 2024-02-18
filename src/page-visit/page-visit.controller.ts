import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PageVisitService } from './page-visit.service';
import { JWTAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreatePageVisitDto } from './dto/create-page.dto';

@Controller('page-visit')
export class PageVisitController {
  constructor(private readonly pageVisitService: PageVisitService) { }

  @UseGuards(JWTAuthGuard)
  @Get("/participant-total-visit")
  getTotalVisitInShop(@AuthUser() user: User) {
    return this.pageVisitService.getTotalVisitInShop(user);
  }

}
