import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeadsService } from './leads.service';
import { QueryLeadsDto } from './dto/query-leads.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateNoteDto } from './dto/create-note.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(@Query() query: QueryLeadsDto, @Req() req: any) {
    return this.leadsService.findAll(query, req.user.gymId);
  }

  @Post()
  create(@Body() dto: CreateLeadDto, @Req() req: any) {
    console.log('HEre I am', dto);
    return this.leadsService.create(dto, req.user.gymId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Put(':id/preferences')
  updatePreferences(
    @Param('id') id: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.leadsService.updatePreferences(id, dto);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.leadsService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string, @Body('isArchived') isArchived: boolean) {
    return this.leadsService.archive(id, isArchived);
  }

  @Post(':id/notes')
  addNote(
    @Param('id') id: string,
    @Body() dto: CreateNoteDto & { userId: string },
  ) {
    return this.leadsService.addNote(id, dto, dto.userId);
  }

  @Put(':id/notes/:noteId')
  updateNote(
    @Param('id') id: string,
    @Param('noteId') noteId: string,
    @Body('content') content: string,
  ) {
    return this.leadsService.updateNote(id, noteId, content);
  }

  @Delete(':id/notes/:noteId')
  deleteNote(@Param('id') id: string, @Param('noteId') noteId: string) {
    return this.leadsService.deleteNote(id, noteId);
  }

  @Patch('bulk-archive')
  bulkArchive(@Body() body: { ids: string[]; isArchived: boolean }) {
    return this.leadsService.bulkArchive(body.ids, body.isArchived);
  }

  // @Patch('bulk-assign')
  // bulkAssign(@Body() body: { ids: string[]; userId: string }) {
  //   return this.leadsService.bulkAssign(body.ids, body.userId);
  // }

  @Delete('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.leadsService.bulkDelete(body.ids);
  }
}
