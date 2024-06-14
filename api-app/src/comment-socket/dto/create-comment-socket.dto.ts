import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentSocketDto {

    @ApiProperty()
    articleId: number;

    @ApiProperty()
    content: string;

    @ApiProperty()
    parentId: any;
}

