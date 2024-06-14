import { IsOptional } from "class-validator";
import { BaseQuery } from "./BaseQuery.dto";

export class SliderQuery extends BaseQuery {

  @IsOptional()
  status: "on" | "off";
}