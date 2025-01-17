import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByCountyQuery } from '../impl/get-median-time-to-art-by-county.query';
import { FactCtTimeToArtLast12M } from '../../entities/fact-ct-time-to-art-last-12-m.model';

@QueryHandler(GetMedianTimeToArtByCountyQuery)
export class GetMedianTimeToArtByCountyHandler implements IQueryHandler<GetMedianTimeToArtByCountyQuery> {
    constructor(
        @InjectRepository(FactCtTimeToArtLast12M, 'mssql')
        private readonly repository: Repository<FactCtTimeToArtLast12M>
    ) {

    }

    async execute(query: GetMedianTimeToArtByCountyQuery): Promise<any> {
        let medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
            .select(['County county, MedianTimeToART_County medianTime'])
            .where('f.[County] IS NOT NULL')
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['SubCounty county, MedianTimeToART_SbCty medianTime'])
                .andWhere('f.County = :County', { County: query.county });

            return await medianTimeToARTCountySql
                .groupBy('SubCounty, MedianTimeToART_SbCty')
                .orderBy('f.MedianTimeToART_SbCty', 'DESC')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['County county, MedianTimeToART_SbCty medianTime'])
                .andWhere('f.SubCounty = :SubCounty', { SubCounty: query.subCounty });


            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_SbCty')
                .orderBy('f.MedianTimeToART_SbCty', 'DESC')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['County county, MedianTimeToART_County medianTime'])
                .andWhere('f.CTPartner = :Partner', { Partner: query.partner });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_County')
                .orderBy('f.MedianTimeToART_County', 'DESC')
                .getRawMany();
        }


        return await medianTimeToARTCountySql
            .groupBy('County, MedianTimeToART_County')
            .orderBy('f.MedianTimeToART_County', 'DESC')
            .getRawMany();
    }
}
