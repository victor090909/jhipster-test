package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Peticion;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Peticion} entity.
 */
public interface PeticionSearchRepository extends ElasticsearchRepository<Peticion, Long> {
}
