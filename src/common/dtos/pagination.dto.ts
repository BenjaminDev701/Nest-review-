import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto {


    //*La limitacion de cuantos objetos traera
    @IsOptional()
    @IsPositive()
    //*Transformar ya que en la url lo recibe como string y necesitamos pasarlo a number
    @Type(() => Number)
    limit?: number


    //*El numero de objetos que omitira
    @IsOptional()
    //*Transformar ya que en la url lo recibe como string y necesitamos pasarlo a number
    @Type(() => Number)
    @Min(0)
    offset?: number
}